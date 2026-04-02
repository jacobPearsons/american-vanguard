/**
 * Middleware Layer
 * Purpose: Cross-cutting concerns for API requests
 * 
 * Architecture (per docs/backend-architecture-framework.md):
 * - Authentication checks
 * - Request logging
 * - Security enforcement
 * - Session management
 * 
 * Middleware must remain small and reusable
 */

import { NextRequest, NextResponse } from 'next/server'
import type { NextFetchEvent } from 'next/server'

/**
 * Rate limiter store (in-memory for demo)
 * In production, use Redis or similar
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

/**
 * Rate limit configuration
 */
const RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 requests per minute
}

/**
 * Rate limiting middleware
 * 
 * @param request - Next.js request
 * @param limit - Max requests per window
 * @param windowMs - Window duration in ms
 */
export const rateLimit = (
  request: NextRequest,
  limit: number = RATE_LIMIT.maxRequests,
  windowMs: number = RATE_LIMIT.windowMs
): { allowed: boolean; remaining: number } => {
  // Get client identifier (IP or user ID)
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
              request.headers.get('x-real-ip') || 
              'unknown'
  
  const now = Date.now()
  const key = `ratelimit:${ip}`
  
  // Get or create rate limit record
  let record = rateLimitStore.get(key)
  
  if (!record || now > record.resetTime) {
    // New window
    record = {
      count: 0,
      resetTime: now + windowMs,
    }
    rateLimitStore.set(key, record)
  }
  
  // Check limit
  record.count++
  const remaining = Math.max(0, limit - record.count)
  
  return {
    allowed: record.count <= limit,
    remaining,
  }
}

/**
 * Create rate limit middleware
 */
export const createRateLimiter = (
  limit?: number,
  windowMs?: number
) => {
  return (request: NextRequest): NextResponse | null => {
    const { allowed, remaining } = rateLimit(request, limit, windowMs)
    
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests, please try again later' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'Retry-After': String(Math.ceil((RATE_LIMIT.windowMs / 1000))),
          },
        }
      )
    }
    
    // Add rate limit headers
    const response = NextResponse.next()
    response.headers.set('X-RateLimit-Remaining', String(remaining))
    
    return response
  }
}

/**
 * Request logging middleware
 * 
 * @param request - Next.js request
 */
export const requestLogger = (request: NextRequest): void => {
  const timestamp = new Date().toISOString()
  const method = request.method
  const url = request.url
  
  console.log(`[${timestamp}] ${method} ${url}`)
}

/**
 * Security headers middleware
 * 
 * Adds security headers to response
 */
export const securityHeaders = (response: NextResponse): NextResponse => {
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  )
  
  // X-Content-Type-Options
  response.headers.set('X-Content-Type-Options', 'nosniff')
  
  // X-Frame-Options
  response.headers.set('X-Frame-Options', 'DENY')
  
  // X-XSS-Protection
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // Referrer-Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Permissions-Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  )
  
  return response
}

/**
 * Apply security headers to all responses
 */
export const withSecurityHeaders = (response: NextResponse): NextResponse => {
  return securityHeaders(response)
}

/**
 * CORS configuration
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

/**
 * Handle CORS preflight
 */
export const handleCors = (request: NextRequest): NextResponse | null => {
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders,
    })
  }
  return null
}

/**
 * Authentication check middleware placeholder
 * 
 * In production, integrate with Clerk or other auth provider
 */
export const requireAuth = (request: NextRequest): { authenticated: boolean; userId?: string } => {
  // Check for auth header
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { authenticated: false }
  }
  
  // In production, verify token and extract user ID
  // For now, return authenticated if header exists
  return { 
    authenticated: true,
    userId: 'demo-user-id',
  }
}

/**
 * Create auth middleware
 */
export const createAuthMiddleware = () => {
  return (request: NextRequest): NextResponse | null => {
    const { authenticated } = requireAuth(request)
    
    if (!authenticated) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    return null
  }
}

/**
 * Error handling wrapper
 * 
 * Catches errors and returns appropriate response
 */
export const withErrorHandling = (
  handler: (request: NextRequest) => Promise<NextResponse>
) => {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      return await handler(request)
    } catch (error) {
      console.error('Unhandled error:', error)
      
      // Don't expose internal errors
      const message = error instanceof Error ? error.message : 'Internal server error'
      
      return NextResponse.json(
        { error: message },
        { status: 500 }
      )
    }
  }
}

/**
 * Validate required fields middleware
 */
export const requireFields = (fields: string[]) => {
  return (request: NextRequest): NextResponse | null => {
    return null // Placeholder - validation is handled by validators/
  }
}
