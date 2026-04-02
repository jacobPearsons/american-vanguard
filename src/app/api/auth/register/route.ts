/**
 * POST /api/auth/register
 * 
 * Registration is now handled by Clerk
 * This endpoint is deprecated - use Clerk's sign-up page
 */

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      success: false, 
      message: 'Registration is handled by Clerk. Please use /sign-up to create an account.',
      deprecated: true 
    },
    { status: 410 }
  )
}
