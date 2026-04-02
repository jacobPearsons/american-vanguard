/**
 * Flow API Route
 * Purpose: Manage hiring pipeline flow stages
 * 
 * Architecture (per docs/backend-architecture-framework.md):
 * - Route: Defines API endpoints, attaches middleware, forwards to controller
 * - Middleware: Auth, validation, error handling
 * - Controller: Orchestrates request handling
 * - Service: Business logic
 * 
 * Data Flow: Request → Route → Middleware → Controller → Service → Response
 */

import { NextRequest, NextResponse } from 'next/server'
import { 
  validateTransition, 
  getFlowSummary, 
  getStageProgress,
  getAllowedTransitions,
  calculateFlowCompletion,
  requiresVerification 
} from '@/services/flowService'
import { validateVerificationCode } from '@/services/verificationService'
import { FlowStage, FLOW_TO_APPLICATION_STATUS, FLOW_STAGES } from '@/types/flow'

/**
 * GET /api/flow
 * Get flow information and current stage
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const applicationId = searchParams.get('applicationId')
    const currentStage = searchParams.get('stage') as FlowStage | null

    if (!currentStage) {
      return NextResponse.json(
        { error: 'Current stage is required' },
        { status: 400 }
      )
    }

    // Validate stage
    if (!FLOW_TO_APPLICATION_STATUS[currentStage]) {
      return NextResponse.json(
        { error: 'Invalid flow stage' },
        { status: 400 }
      )
    }

    // Get flow summary
    const summary = getFlowSummary(currentStage)
    const progress = getStageProgress(currentStage)
    
    // Check if verification is required
    const verificationRequired = requiresVerification(currentStage)

    return NextResponse.json({
      success: true,
      data: {
        ...summary,
        stageInfo: progress.stage,
        allowedNextStages: progress.allowedNextStages.map(stage => ({
          id: stage,
          label: FLOW_TO_APPLICATION_STATUS[stage] || stage,
        })),
        verificationRequired: verificationRequired !== null,
        verificationType: verificationRequired,
      },
    })
  } catch (error) {
    console.error('Error getting flow:', error)
    return NextResponse.json(
      { error: 'Failed to get flow information' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/flow
 * Transition to a new stage
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      applicationId, 
      currentStage, 
      targetStage, 
      verificationCode,
      notes 
    } = body

    // Validate required fields
    if (!applicationId || !currentStage || !targetStage) {
      return NextResponse.json(
        { error: 'applicationId, currentStage, and targetStage are required' },
        { status: 400 }
      )
    }

    // Validate stages
    const validStages = FLOW_STAGES.map(s => s.id)
    if (!validStages.includes(currentStage as FlowStage) || !validStages.includes(targetStage as FlowStage)) {
      return NextResponse.json(
        { error: 'Invalid flow stage' },
        { status: 400 }
      )
    }

    // Validate transition
    const transition = validateTransition(currentStage as FlowStage, targetStage as FlowStage)
    
    if (!transition.valid) {
      return NextResponse.json(
        { 
          error: 'Invalid transition',
          reason: transition.reason,
          allowedTransitions: getAllowedTransitions(currentStage as FlowStage),
        },
        { status: 400 }
      )
    }

    // Check if verification is required
    const verificationType = requiresVerification(targetStage as FlowStage)
    
    if (verificationType) {
      if (!verificationCode) {
        return NextResponse.json(
          { 
            error: 'Verification code required',
            verificationType,
          },
          { status: 401 }
        )
      }

      // Validate verification code
      const verificationResult = await validateVerificationCode({
        code: verificationCode,
        type: verificationType,
      })

      if (!verificationResult.valid) {
        return NextResponse.json(
          { 
            error: 'Invalid verification code',
            message: verificationResult.message,
          },
          { status: 401 }
        )
      }
    }

    // Calculate new progress
    const progress = calculateFlowCompletion(targetStage as FlowStage)

    // In production, update database here
    // For demo, return success

    return NextResponse.json({
      success: true,
      data: {
        previousStage: currentStage,
        currentStage: targetStage,
        progress,
        message: `Successfully transitioned to ${targetStage}`,
        notes,
      },
    })
  } catch (error) {
    console.error('Error transitioning flow:', error)
    return NextResponse.json(
      { error: 'Failed to transition flow stage' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/flow/validate
 * Validate if transition is possible
 */
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const currentStage = searchParams.get('currentStage') as FlowStage | null
    const targetStage = searchParams.get('targetStage') as FlowStage | null

    if (!currentStage || !targetStage) {
      return NextResponse.json(
        { error: 'currentStage and targetStage are required' },
        { status: 400 }
      )
    }

    // Validate stages
    if (!FLOW_TO_APPLICATION_STATUS[currentStage] || !FLOW_TO_APPLICATION_STATUS[targetStage]) {
      return NextResponse.json(
        { error: 'Invalid flow stage' },
        { status: 400 }
      )
    }

    // Validate transition
    const transition = validateTransition(currentStage, targetStage)
    const progress = getStageProgress(targetStage)

    return NextResponse.json({
      success: true,
      data: {
        valid: transition.valid,
        reason: transition.reason,
        allowedTransitions: getAllowedTransitions(currentStage),
        requiresVerification: requiresVerification(targetStage) !== null,
        progress: progress.progress,
      },
    })
  } catch (error) {
    console.error('Error validating transition:', error)
    return NextResponse.json(
      { error: 'Failed to validate transition' },
      { status: 500 }
    )
  }
}
