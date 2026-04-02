/**
 * Acceptance Letter API Route
 * Purpose: Handle acceptance letter generation and retrieval
 * 
 * Based on docs/flow.md:
 * Step 21: Acceptance Letter - Generate official acceptance letter PDF
 * 
 * Endpoints:
 * - POST /api/admissions/acceptance - Generate acceptance letter for an application
 * - GET /api/admissions/acceptance?applicationId={id} - Get acceptance letter data
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { processAcceptance, getAcceptanceLetter } from '@/services/acceptanceLetterService'

/**
 * POST - Generate acceptance letter PDF
 * 
 * Body: { applicationId: number }
 * 
 * Returns: PDF buffer or error
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await auth()
    const userId = authResult.userId
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { applicationId } = body

    if (!applicationId) {
      return NextResponse.json(
        { success: false, message: 'Application ID is required' },
        { status: 400 }
      )
    }

    // Process acceptance and generate letter
    const result = await processAcceptance(applicationId)

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      )
    }

    // Return the PDF buffer
    return new NextResponse(result.pdfBuffer as unknown as Blob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="acceptance-letter-${applicationId}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error in acceptance letter POST:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET - Retrieve acceptance letter data
 * 
 * Query: ?applicationId={id}
 * 
 * Returns: Acceptance letter data (JSON)
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await auth()
    const userId = authResult.userId
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get application ID from query params
    const { searchParams } = new URL(request.url)
    const applicationId = searchParams.get('applicationId')

    if (!applicationId) {
      return NextResponse.json(
        { success: false, message: 'Application ID is required' },
        { status: 400 }
      )
    }

    const id = parseInt(applicationId, 10)
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid application ID' },
        { status: 400 }
      )
    }

    // Get acceptance letter data
    const result = await getAcceptanceLetter(id)

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    })
  } catch (error) {
    console.error('Error in acceptance letter GET:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
