/**
 * POST /api/auth/login
 * 
 * Authentication is now handled by Clerk
 * This endpoint is deprecated - use Clerk's sign-in page
 */

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      success: false, 
      message: 'Authentication is handled by Clerk. Please use /sign-in to authenticate.',
      deprecated: true 
    },
    { status: 410 }
  )
}
