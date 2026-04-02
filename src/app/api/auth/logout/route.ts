/**
 * POST /api/auth/logout
 * 
 * Logout is now handled by Clerk
 * This endpoint is deprecated - use Clerk's signOut() method
 */

import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    { 
      success: false, 
      message: 'Logout is handled by Clerk. Please use Clerk\'s signOut() method.',
      deprecated: true 
    },
    { status: 410 }
  )
}
