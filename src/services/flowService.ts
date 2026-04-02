/**
 * Flow Service
 * Purpose: Manage hiring pipeline flow stages and transitions
 * 
 * Data Flow: API Route → Service → Database
 * 
 * Rules (per docs):
 * - Services handle all business logic
 * - Services interact with models only
 * - All stage transitions are validated
 */

import { 
  FlowStage, 
  FLOW_STAGES, 
  getNextStage, 
  getStageInfo,
  getProgressPercentage 
} from '@/types/flow'
import type { VerificationCode, VerificationType } from '@/types/verification'

/**
 * Flow transition validation
 */
export interface FlowTransition {
  from: FlowStage
  to: FlowStage
  valid: boolean
  reason?: string
}

/**
 * Application flow record
 */
export interface FlowRecord {
  id: string
  applicationId: string
  candidateId: string
  currentStage: FlowStage
  stageHistory: FlowStageHistory[]
  createdAt: Date
  updatedAt: Date
}

/**
 * Stage history entry
 */
export interface FlowStageHistory {
  stage: FlowStage
  enteredAt: Date
  exitedAt?: Date
  notes?: string
}

/**
 * Transition validation rules
 * 
 * Each stage can only transition to specific next stages
 */
const TRANSITION_RULES: Record<FlowStage, FlowStage[]> = {
  'job_identified': ['job_posted'],
  'job_posted': ['application_received'],
  'application_received': ['resume_screening'],
  'resume_screening': ['hr_interview', 'job_posted'], // Can reject back to job_posted (recycle)
  'hr_interview': ['skills_test', 'resume_screening'],
  'skills_test': ['technical_interview', 'hr_interview'],
  'technical_interview': ['behavioral_interview', 'skills_test'],
  'behavioral_interview': ['final_interview', 'technical_interview'],
  'final_interview': ['background_check', 'behavioral_interview'],
  'background_check': ['offer_letter', 'final_interview'],
  'offer_letter': ['hired', 'background_check'],
  'hired': ['onboarding'],
  'onboarding': [],
}

/**
 * Stage prerequisites
 * What must be completed before entering a stage
 */
const STAGE_PREREQUISITES: Record<FlowStage, FlowStage[]> = {
  'job_identified': [],
  'job_posted': ['job_identified'],
  'application_received': ['job_posted'],
  'resume_screening': ['application_received'],
  'hr_interview': ['resume_screening'],
  'skills_test': ['hr_interview'],
  'technical_interview': ['skills_test'],
  'behavioral_interview': ['technical_interview'],
  'final_interview': ['behavioral_interview'],
  'background_check': ['final_interview'],
  'offer_letter': ['background_check'],
  'hired': ['offer_letter'],
  'onboarding': ['hired'],
}

/**
 * Validate stage transition
 * 
 * @param currentStage - Current flow stage
 * @param targetStage - Desired next stage
 * @returns Transition validation result
 */
export const validateTransition = (
  currentStage: FlowStage,
  targetStage: FlowStage
): FlowTransition => {
  // Same stage - no transition needed
  if (currentStage === targetStage) {
    return {
      from: currentStage,
      to: targetStage,
      valid: true,
    }
  }

  // Check if transition is allowed
  const allowedTransitions = TRANSITION_RULES[currentStage]
  if (!allowedTransitions.includes(targetStage)) {
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
export const checkPrerequisites = (
  completedStages: FlowStage[],
  targetStage: FlowStage
): { met: boolean; missing: FlowStage[] } => {
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
 * @param currentStage - Current flow stage
 * @returns Array of valid next stages
 */
export const getAllowedTransitions = (currentStage: FlowStage): FlowStage[] => {
  return TRANSITION_RULES[currentStage] || []
}

/**
 * Get stage progress info
 * 
 * @param stage - Current flow stage
 * @returns Progress information
 */
export const getStageProgress = (stage: FlowStage) => {
  const info = getStageInfo(stage)
  const progress = getProgressPercentage(stage)
  const allowed = getAllowedTransitions(stage)
  
  return {
    stage: info,
    progress,
    allowedNextStages: allowed,
    nextStage: getNextStage(stage),
  }
}

/**
 * Calculate flow completion percentage
 * 
 * @param currentStage - Current stage
 * @returns Completion percentage
 */
export const calculateFlowCompletion = (currentStage: FlowStage): number => {
  return getProgressPercentage(currentStage)
}

/**
 * Get remaining stages
 * 
 * @param currentStage - Current stage
 * @returns Array of remaining stages
 */
export const getRemainingStages = (currentStage: FlowStage): FlowStage[] => {
  const currentIndex = FLOW_STAGES.findIndex(s => s.id === currentStage)
  if (currentIndex === -1) return []
  
  return FLOW_STAGES.slice(currentIndex + 1).map(s => s.id)
}

/**
 * Validate verification requirement for stage
 * 
 * Certain stages require verification codes
 */
export const VERIFICATION_REQUIRED_FOR: Record<FlowStage, VerificationType | null> = {
  'job_identified': null,
  'job_posted': null,
  'application_received': null,
  'resume_screening': null,
  'hr_interview': null,
  'skills_test': null,
  'technical_interview': 'interview_access',
  'behavioral_interview': 'interview_access',
  'final_interview': 'final_interview',
  'background_check': null,
  'offer_letter': null,
  'hired': null,
  'onboarding': null,
}

/**
 * Check if stage requires verification
 * 
 * @param stage - Flow stage to check
 * @returns Verification type required (if any)
 */
export const requiresVerification = (stage: FlowStage): VerificationType | null => {
  return VERIFICATION_REQUIRED_FOR[stage]
}

/**
 * Flow summary for dashboard
 */
export interface FlowSummary {
  currentStage: FlowStage
  progress: number
  completedStages: number
  totalStages: number
  remainingStages: FlowStage[]
  allowedTransitions: FlowStage[]
  requiresVerification: boolean
}

/**
 * Get flow summary
 * 
 * @param currentStage - Current flow stage
 * @returns Complete flow summary
 */
export const getFlowSummary = (currentStage: FlowStage): FlowSummary => {
  const progress = getProgressPercentage(currentStage)
  const currentIndex = FLOW_STAGES.findIndex(s => s.id === currentStage)
  const completedStages = currentIndex + 1
  const totalStages = FLOW_STAGES.length
  
  return {
    currentStage,
    progress,
    completedStages,
    totalStages,
    remainingStages: getRemainingStages(currentStage),
    allowedTransitions: getAllowedTransitions(currentStage),
    requiresVerification: requiresVerification(currentStage) !== null,
  }
}
