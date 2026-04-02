/**
 * Screening API Route
 * Purpose: Resume screening endpoints
 * 
 * Architecture (per docs/backend-architecture-framework.md):
 * - Route: Defines API endpoints
 * - Middleware: Validation, error handling
 * - Controller: Orchestrates request
 * - Service: Business logic
 */

import { NextRequest, NextResponse } from 'next/server'
import { 
  getScreenings, 
  getScreeningById, 
  getScreeningCriteria,
  evaluateScreening,
  updateScreeningStatus,
  getScreeningStats
} from '@/services/screeningService'

/**
 * GET /api/screening
 * Get all screenings with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || undefined
    const id = searchParams.get('id')
    const stats = searchParams.get('stats')

    // Get statistics
    if (stats === 'true') {
      const screeningStats = await getScreeningStats()
      return NextResponse.json({
        success: true,
        data: screeningStats,
      })
    }

    // Get single screening
    if (id) {
      const screening = await getScreeningById(id)
      if (!screening) {
        return NextResponse.json(
          { error: 'Screening not found' },
          { status: 404 }
        )
      }
      return NextResponse.json({
        success: true,
        data: screening,
      })
    }

    // Get all screenings with optional status filter
    const screenings = await getScreenings(status as any)
    const criteria = await getScreeningCriteria()

    return NextResponse.json({
      success: true,
      data: {
        screenings,
        criteria,
      },
    })
  } catch (error) {
    console.error('Error fetching screenings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch screenings' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/screening
 * Evaluate a screening
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { screeningId, evaluation, notes, reviewerName } = body

    // Validate required fields
    if (!screeningId || !evaluation || !reviewerName) {
      return NextResponse.json(
        { error: 'screeningId, evaluation, and reviewerName are required' },
        { status: 400 }
      )
    }

    // Evaluate screening
    const result = await evaluateScreening(
      screeningId,
      evaluation,
      notes || '',
      reviewerName
    )

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.screening,
      message: result.message,
    })
  } catch (error) {
    console.error('Error evaluating screening:', error)
    return NextResponse.json(
      { error: 'Failed to evaluate screening' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/screening
 * Update screening status
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { screeningId, status } = body

    if (!screeningId || !status) {
      return NextResponse.json(
        { error: 'screeningId and status are required' },
        { status: 400 }
      )
    }

    // Update status
    const result = await updateScreeningStatus(screeningId, status)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.screening,
      message: result.message,
    })
  } catch (error) {
    console.error('Error updating screening:', error)
    return NextResponse.json(
      { error: 'Failed to update screening' },
      { status: 500 }
    )
  }
}
