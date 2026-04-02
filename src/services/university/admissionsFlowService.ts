/**
 * University Admissions Flow Service
 * Purpose: Manage university admissions pipeline stages and transitions for AVI
 * 
 * Data Flow: API Route → Service → Database
 * 
 * Rules (per docs):
 * - Services handle all business logic
 * - Services interact with models only
 * - All stage transitions are validated
 * 
 * Based on docs/flow.md:
 * Student Identified → University Programs & Majors → Applications Submitted → 
 * Academic Record Review → Admissions Counselor Interview → Standardized Testing / Portfolio Review → 
 * Department Interview → Student Fit Assessment → Final Admissions Committee Review → 
 * Background Verification → Acceptance Letter → Enrollment → Orientation & Onboarding
 */

import { 
  AdmissionsStage, 
  ADMISSIONS_STAGES, 
  getNextAdmissionsStage, 
  getAdmissionsStageInfo,
  getAdmissionsProgressPercentage,
  ProgramType,
  PROGRAM_ADMISSIONS_STAGES,
} from '@/types/university/admissionsFlow'

/**
 * Admissions flow transition validation
 */
export interface AdmissionsTransition {
  from: AdmissionsStage
  to: AdmissionsStage
  valid: boolean
  reason?: string
}

/**
 * Student application flow record
 */
export interface AdmissionsRecord {
  id: string
  applicationId: string
  studentId: string
  programType: ProgramType
  currentStage: AdmissionsStage
  stageHistory: AdmissionsStageHistory[]
  createdAt: Date
  updatedAt: Date
}

/**
 * Stage history entry
 */
export interface AdmissionsStageHistory {
  stage: AdmissionsStage
  enteredAt: Date
  exitedAt?: Date
  notes?: string
}

/**
 * Transition validation rules
 * 
 * Each stage can only transition to specific next stages
 * Based on docs/flow.md 13-stage flow
 */
const ADMISSIONS_TRANSITION_RULES: Record<AdmissionsStage, AdmissionsStage[]> = {
  'student_identified': ['university_programs'],
  'university_programs': ['applications_submitted', 'student_identified'],
  'applications_submitted': ['academic_record_review'],
  'academic_record_review': ['admissions_counselor_interview', 'standardized_testing'],
  'admissions_counselor_interview': ['standardized_testing', 'academic_record_review'],
  'standardized_testing': ['department_interview', 'admissions_counselor_interview'],
  'department_interview': ['student_fit_assessment', 'standardized_testing'],
  'student_fit_assessment': ['final_committee_review', 'department_interview'],
  'final_committee_review': ['background_verification', 'student_fit_assessment'],
  'background_verification': ['acceptance_letter', 'final_committee_review'],
  'acceptance_letter': ['enrollment'],
  'enrollment': ['orientation_onboarding', 'acceptance_letter'],
  'orientation_onboarding': [],
}

/**
 * Stage prerequisites
 * What must be completed before entering a stage
 * Based on docs/flow.md
 */
const STAGE_PREREQUISITES: Record<AdmissionsStage, AdmissionsStage[]> = {
  'student_identified': [],
  'university_programs': ['student_identified'],
  'applications_submitted': ['university_programs'],
  'academic_record_review': ['applications_submitted'],
  'admissions_counselor_interview': ['academic_record_review'],
  'standardized_testing': ['admissions_counselor_interview'],
  'department_interview': ['standardized_testing'],
  'student_fit_assessment': ['department_interview'],
  'final_committee_review': ['student_fit_assessment'],
  'background_verification': ['final_committee_review'],
  'acceptance_letter': ['background_verification'],
  'enrollment': ['acceptance_letter'],
  'orientation_onboarding': ['enrollment'],
}

/**
 * Validate stage transition
 * 
 * @param currentStage - Current admissions stage
 * @param targetStage - Desired next stage
 * @returns Transition validation result
 */
export const validateAdmissionsTransition = (
  currentStage: AdmissionsStage,
  targetStage: AdmissionsStage
): AdmissionsTransition => {
  // Same stage - no transition needed
  if (currentStage === targetStage) {
    return {
      from: currentStage,
      to: targetStage,
      valid: true,
    }
  }

  // Check if transition is allowed
  const allowedTransitions = ADMISSIONS_TRANSITION_RULES[currentStage]
  if (!allowedTransitions || !allowedTransitions.includes(targetStage)) {
    return {
      from: currentStage,
      to: targetStage,
      valid: false,
      reason: `Cannot transition from ${currentStage} to ${targetStage}`,
    }
  }

  return {
    from: currentStage,
    to: targetStage,
    valid: true,
  }
}

/**
 * Check if prerequisites are met
 * 
 * @param completedStages - Stages that have been completed
 * @param targetStage - Stage to check
 * @returns Whether prerequisites are met
 */
export const checkAdmissionsPrerequisites = (
  completedStages: AdmissionsStage[],
  targetStage: AdmissionsStage
): { met: boolean; missing: AdmissionsStage[] } => {
  const prerequisites = STAGE_PREREQUISITES[targetStage]
  const missing = prerequisites.filter(p => !completedStages.includes(p))
  
  return {
    met: missing.length === 0,
    missing,
  }
}

/**
 * Get allowed next stages
 * 
 * @param currentStage - Current admissions stage
 * @returns Array of valid next stages
 */
export const getAllowedAdmissionsTransitions = (currentStage: AdmissionsStage): AdmissionsStage[] => {
  return ADMISSIONS_TRANSITION_RULES[currentStage] || []
}

/**
 * Get stage progress info
 * 
 * @param stage - Current admissions stage
 * @returns Progress information
 */
export const getAdmissionsStageProgress = (stage: AdmissionsStage) => {
  const info = getAdmissionsStageInfo(stage)
  const progress = getAdmissionsProgressPercentage(stage)
  const allowed = getAllowedAdmissionsTransitions(stage)
  
  return {
    stage: info,
    progress,
    allowedNextStages: allowed,
    nextStage: getNextAdmissionsStage(stage),
  }
}

/**
 * Calculate flow completion percentage
 * 
 * @param currentStage - Current stage
 * @returns Completion percentage
 */
export const calculateAdmissionsCompletion = (currentStage: AdmissionsStage): number => {
  return getAdmissionsProgressPercentage(currentStage)
}

/**
 * Get remaining stages
 * 
 * @param currentStage - Current stage
 * @returns Array of remaining stages
 */
export const getRemainingAdmissionsStages = (currentStage: AdmissionsStage): AdmissionsStage[] => {
  const currentIndex = ADMISSIONS_STAGES.findIndex(s => s.id === currentStage)
  if (currentIndex === -1) return []
  
  return ADMISSIONS_STAGES.slice(currentIndex + 1).map(s => s.id)
}

/**
 * Get stages for specific program type
 * 
 * @param programType - Type of program
 * @returns Array of stages for the program
 */
export const getProgramStages = (programType: ProgramType): AdmissionsStage[] => {
  return PROGRAM_ADMISSIONS_STAGES[programType] || ADMISSIONS_STAGES.map(s => s.id)
}

/**
 * Check if program requires specific stages
 * 
 * @param programType - Type of program
 * @param stage - Stage to check
 * @returns Whether stage is required for program
 */
export const isStageRequiredForProgram = (
  programType: ProgramType,
  stage: AdmissionsStage
): boolean => {
  const programStages = getProgramStages(programType)
  return programStages.includes(stage)
}

/**
 * Admissions flow summary for dashboard
 */
export interface AdmissionsFlowSummary {
  currentStage: AdmissionsStage
  progress: number
  completedStages: number
  totalStages: number
  remainingStages: AdmissionsStage[]
  allowedTransitions: AdmissionsStage[]
  programType: ProgramType
  institution: string
  institutionAbbr: string
}

/**
 * Get admissions flow summary
 * 
 * @param currentStage - Current admissions stage
 * @param programType - Type of program applied to
 * @returns Complete flow summary
 */
export const getAdmissionsFlowSummary = (
  currentStage: AdmissionsStage,
  programType: ProgramType = 'undergraduate'
): AdmissionsFlowSummary => {
  const progress = getAdmissionsProgressPercentage(currentStage)
  const currentIndex = ADMISSIONS_STAGES.findIndex(s => s.id === currentStage)
  const completedStages = currentIndex + 1
  const totalStages = ADMISSIONS_STAGES.length
  
  return {
    currentStage,
    progress,
    completedStages,
    totalStages,
    remainingStages: getRemainingAdmissionsStages(currentStage),
    allowedTransitions: getAllowedAdmissionsTransitions(currentStage),
    programType,
    institution: 'American Vanguard Institute',
    institutionAbbr: 'AVI',
  }
}

/**
 * Get all available admissions stages
 * 
 * @returns Array of all stage info
 */
export const getAllAdmissionsStages = () => {
  return ADMISSIONS_STAGES
}

/**
 * Transition admissions stage via API
 * 
 * @param applicationId - The application ID
 * @param targetStage - The stage to transition to
 * @param programType - The type of program
 * @returns Promise with transition result
 */
export const transitionAdmissionsStage = async (
  applicationId: string,
  targetStage: AdmissionsStage,
  programType: ProgramType = 'undergraduate'
): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await fetch('/api/admissions/flow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        applicationId,
        targetStage,
        programType,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to transition stage')
    }

    return await response.json()
  } catch (error) {
    console.error('Error transitioning admissions stage:', error)
    throw error
  }
}

/**
 * Get current admissions flow status
 * 
 * @param applicationId - The application ID
 * @returns Promise with current flow status
 */
export const getAdmissionsFlowStatus = async (
  applicationId: string
): Promise<{
  success: boolean
  data?: AdmissionsFlowSummary
  message?: string
}> => {
  try {
    const response = await fetch(`/api/admissions/flow?applicationId=${applicationId}`)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to get flow status')
    }

    return await response.json()
  } catch (error) {
    console.error('Error getting admissions flow status:', error)
    throw error
  }
}
