/**
 * Admissions Flow API Route
 * Purpose: Manage university admissions pipeline stages for AVI
 * 
 * Architecture (per docs/backend-architecture-framework.md):
 * - Route: Defines API endpoints, attaches middleware, forwards to controller
 * - Middleware: Auth, validation, error handling
 * - Controller: Orchestrates request handling
 * - Service: Business logic
 * 
 * Data Flow: Request → Route → Middleware → Controller → Service → Response
 * 
 * This is adapted from the hiring flow API for university admissions.
 */

import { NextRequest, NextResponse } from 'next/server'
import { 
  validateAdmissionsTransition, 
  getAdmissionsFlowSummary, 
  getAdmissionsStageProgress,
  getAllowedAdmissionsTransitions,
  calculateAdmissionsCompletion,
  getAllAdmissionsStages,
  getProgramStages,
} from '@/services/university/admissionsFlowService'
import { processAcceptance } from '@/services/acceptanceLetterService'
import { 
  AdmissionsStage, 
  ADMISSIONS_TO_APPLICATION_STATUS, 
  ADMISSIONS_STAGES,
  ProgramType,
} from '@/types/university/admissionsFlow'

/**
 * GET /api/admissions/flow
 * Get admissions flow information and current stage
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const applicationId = searchParams.get('applicationId')
    const currentStage = searchParams.get('stage') as AdmissionsStage | null
    const programType = searchParams.get('programType') as ProgramType | null

    if (!currentStage) {
      return NextResponse.json(
        { error: 'Current stage is required' },
        { status: 400 }
      )
    }

    // Validate stage
    if (!ADMISSIONS_TO_APPLICATION_STATUS[currentStage]) {
      return NextResponse.json(
        { error: 'Invalid admissions stage' },
        { status: 400 }
      )
    }

    // Get flow summary
    const summary = getAdmissionsFlowSummary(currentStage, programType || 'undergraduate')
    const progress = getAdmissionsStageProgress(currentStage)
    
    // Get program-specific stages
    const programStages = getProgramStages(programType || 'undergraduate')

    return NextResponse.json({
      success: true,
      data: {
        ...summary,
        stageInfo: progress.stage,
        allowedNextStages: progress.allowedNextStages.map(stage => ({
          id: stage,
          label: ADMISSIONS_TO_APPLICATION_STATUS[stage] || stage,
        })),
        programStages: programStages.map(stage => ({
          id: stage,
          required: true,
        })),
        institution: 'American Vanguard Institute',
        institutionAbbr: 'AVI',
      },
    })
  } catch (error) {
    console.error('Error getting admissions flow:', error)
    return NextResponse.json(
      { error: 'Failed to get admissions flow information' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admissions/flow
 * Transition to a new stage
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      applicationId, 
      currentStage, 
      targetStage, 
      programType,
      notes,
    } = body

    // Validate required fields
    if (!applicationId || !currentStage || !targetStage) {
      return NextResponse.json(
        { error: 'applicationId, currentStage, and targetStage are required' },
        { status: 400 }
      )
    }

    // Validate stages
    const validStages = ADMISSIONS_STAGES.map(s => s.id)
    if (!validStages.includes(currentStage as AdmissionsStage) || !validStages.includes(targetStage as AdmissionsStage)) {
      return NextResponse.json(
        { error: 'Invalid admissions stage' },
        { status: 400 }
      )
    }

    // Validate transition
    const transition = validateAdmissionsTransition(currentStage as AdmissionsStage, targetStage as AdmissionsStage)
    
    if (!transition.valid) {
      return NextResponse.json(
        { 
          error: 'Invalid transition',
          reason: transition.reason,
          allowedTransitions: getAllowedAdmissionsTransitions(currentStage as AdmissionsStage),
        },
        { status: 400 }
      )
    }

    // Calculate new progress
    const progress = calculateAdmissionsCompletion(targetStage as AdmissionsStage)

    // If transitioning to acceptance_letter stage, generate the acceptance letter
    let acceptanceLetterGenerated = false
    if (targetStage === 'acceptance_letter') {
      try {
        const acceptanceResult = await processAcceptance(applicationId)
        acceptanceLetterGenerated = acceptanceResult.success
        console.log('Acceptance letter generated:', acceptanceLetterGenerated)
      } catch (acceptanceError) {
        console.error('Error generating acceptance letter:', acceptanceError)
        // Continue with the transition even if letter generation fails
      }
    }

    // In production, update database here
    // For demo, return success

    return NextResponse.json({
      success: true,
      data: {
        previousStage: currentStage,
        currentStage: targetStage,
        progress,
        message: `Successfully transitioned to ${targetStage} at American Vanguard Institute`,
        notes,
        institution: 'American Vanguard Institute',
        acceptanceLetterGenerated,
      },
    })
  } catch (error) {
    console.error('Error transitioning admissions flow:', error)
    return NextResponse.json(
      { error: 'Failed to transition admissions stage' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admissions/flow/stages
 * Get all available admissions stages
 */
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const currentStage = searchParams.get('currentStage') as AdmissionsStage | null
    const targetStage = searchParams.get('targetStage') as AdmissionsStage | null
    const programType = searchParams.get('programType') as ProgramType | null

    // If validating a transition
    if (currentStage && targetStage) {
      if (!ADMISSIONS_TO_APPLICATION_STATUS[currentStage] || !ADMISSIONS_TO_APPLICATION_STATUS[targetStage]) {
        return NextResponse.json(
          { error: 'Invalid admissions stage' },
          { status: 400 }
        )
      }

      // Validate transition
      const transition = validateAdmissionsTransition(currentStage, targetStage)
      const progress = getAdmissionsStageProgress(targetStage)

      return NextResponse.json({
        success: true,
        data: {
          valid: transition.valid,
          reason: transition.reason,
          allowedTransitions: getAllowedAdmissionsTransitions(currentStage),
          progress: progress.progress,
        },
      })
    }

    // Otherwise, return all stages
    const stages = getAllAdmissionsStages()
    const programStages = getProgramStages(programType || 'undergraduate')

    return NextResponse.json({
      success: true,
      data: {
        stages: stages.map(stage => ({
          ...stage,
          requiredForProgram: programStages.includes(stage.id),
        })),
        institution: 'American Vanguard Institute',
        institutionAbbr: 'AVI',
      },
    })
  } catch (error) {
    console.error('Error getting admissions stages:', error)
    return NextResponse.json(
      { error: 'Failed to get admissions stages' },
      { status: 500 }
    )
  }
}
