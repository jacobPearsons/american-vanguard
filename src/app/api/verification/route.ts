/**
 * Verification API Route
 * Purpose: Handle verification code operations
 * 
 * Architecture (per docs/backend-architecture-framework.md):
 * - Route: Defines API endpoints
 * - Middleware: Validation, error handling
 * - Controller: Orchestrates request
 * - Service: Business logic
 */

import { NextRequest, NextResponse } from 'next/server'
import { 
  generateVerificationCode, 
  validateVerificationCode,
  useVerificationCode,
  getVerificationSummary
} from '@/services/verificationService'

/**
 * GET /api/verification
 * Get verification summary for user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    const summary = await getVerificationSummary(userId)

    return NextResponse.json({
      success: true,
      data: summary,
    })
  } catch (error) {
    console.error('Error getting verification:', error)
    return NextResponse.json(
      { error: 'Failed to get verification' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/verification
 * Generate a new verification code
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, userEmail, type } = body

    if (!userId || !userEmail || !type) {
      return NextResponse.json(
        { error: 'userId, userEmail, and type are required' },
        { status: 400 }
      )
    }

    // Validate type
    const validTypes = ['skills_completion', 'interview_access', 'final_interview']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid verification type' },
        { status: 400 }
      )
    }

    const code = await generateVerificationCode({ userId, userEmail, type })

    if (!code) {
      return NextResponse.json(
        { error: 'Failed to generate code' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        code: code.code,
        expiresAt: code.expiresAt,
        type: code.type,
      },
      message: 'Verification code generated',
    })
  } catch (error) {
    console.error('Error generating verification:', error)
    return NextResponse.json(
      { error: 'Failed to generate verification code' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/verification
 * Validate a verification code
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, type } = body

    if (!code || !type) {
      return NextResponse.json(
        { error: 'code and type are required' },
        { status: 400 }
      )
    }

    const result = await validateVerificationCode({ code, type })

    if (!result.valid) {
      return NextResponse.json(
        { 
          valid: false,
          error: result.message 
        },
        { status: 401 }
      )
    }

    return NextResponse.json({
      valid: true,
      message: 'Verification successful',
    })
  } catch (error) {
    console.error('Error validating verification:', error)
    return NextResponse.json(
      { error: 'Failed to validate code' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/verification
 * Mark a code as used
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { codeId } = body

    if (!codeId) {
      return NextResponse.json(
        { error: 'codeId is required' },
        { status: 400 }
      )
    }

    const result = await useVerificationCode(codeId)

    if (!result.valid) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Code marked as used',
    })
  } catch (error) {
    console.error('Error using verification:', error)
    return NextResponse.json(
      { error: 'Failed to use code' },
      { status: 500 }
    )
  }
}
