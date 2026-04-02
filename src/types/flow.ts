/**
 * Application Flow Types
 * Purpose: Define the hiring pipeline flow stages
 * 
 * Flow (per docs/flow.md):
 * Job Need Identified → Job Posting → Applications Received → 
 * Resume Screening → HR Interview → Skills/Technical Test → 
 * Technical Interview → Behavioral Interview → 
 * Final Hiring Manager Interview → Background Checks → 
 * Offer Letter → Hiring → Onboarding
 */

/**
 * All possible stages in the hiring pipeline
 */
export type FlowStage = 
  | 'job_identified'
  | 'job_posted'
  | 'application_received'
  | 'resume_screening'
  | 'hr_interview'
  | 'skills_test'
  | 'technical_interview'
  | 'behavioral_interview'
  | 'final_interview'
  | 'background_check'
  | 'offer_letter'
  | 'hired'
  | 'onboarding'

/**
 * Stage metadata for display
 */
export interface StageInfo {
  id: FlowStage
  label: string
  description: string
  color: string
  icon: string
}

/**
 * Complete flow definition with all stages
 */
export const FLOW_STAGES: StageInfo[] = [
  { id: 'job_identified', label: 'Job Need Identified', description: 'Company identifies hiring need', color: 'bg-gray-500', icon: 'Briefcase' },
  { id: 'job_posted', label: 'Job Posted', description: 'Job listing is live', color: 'bg-yellow-500', icon: 'Globe' },
  { id: 'application_received', label: 'Application Received', description: 'Application submitted', color: 'bg-indigo-500', icon: 'FileText' },
  { id: 'resume_screening', label: 'Resume Screening', description: 'Resume under review', color: 'bg-purple-500', icon: 'Search' },
  { id: 'hr_interview', label: 'HR Interview', description: 'Initial HR screening', color: 'bg-violet-500', icon: 'Users' },
  { id: 'skills_test', label: 'Skills Test', description: 'Technical skills assessment', color: 'bg-amber-500', icon: 'Brain' },
  { id: 'technical_interview', label: 'Technical Interview', description: 'Technical evaluation', color: 'bg-orange-500', icon: 'Code' },
  { id: 'behavioral_interview', label: 'Behavioral Interview', description: 'Culture fit assessment', color: 'bg-pink-500', icon: 'MessageSquare' },
  { id: 'final_interview', label: 'Final Interview', description: 'Hiring manager review', color: 'bg-rose-500', icon: 'Star' },
  { id: 'background_check', label: 'Background Check', description: 'Reference verification', color: 'bg-red-500', icon: 'Shield' },
  { id: 'offer_letter', label: 'Offer Letter', description: 'Job offer extended', color: 'bg-green-500', icon: 'FileCheck' },
  { id: 'hired', label: 'Hired', description: 'Offer accepted', color: 'bg-emerald-500', icon: 'CheckCircle' },
  { id: 'onboarding', label: 'Onboarding', description: 'New hire orientation', color: 'bg-teal-500', icon: 'UserPlus' },
]

/**
 * Get stage info by ID
 */
export const getStageInfo = (stageId: FlowStage): StageInfo | undefined => {
  return FLOW_STAGES.find(stage => stage.id === stageId)
}

/**
 * Get next stage in flow
 */
export const getNextStage = (currentStage: FlowStage): FlowStage | null => {
  const currentIndex = FLOW_STAGES.findIndex(s => s.id === currentStage)
  if (currentIndex === -1 || currentIndex === FLOW_STAGES.length - 1) {
    return null
  }
  return FLOW_STAGES[currentIndex + 1].id
}

/**
 * Get progress percentage
 */
export const getProgressPercentage = (stage: FlowStage): number => {
  const index = FLOW_STAGES.findIndex(s => s.id === stage)
  if (index === -1) return 0
  return Math.round((index / (FLOW_STAGES.length - 1)) * 100)
}

/**
 * Application status mapping to flow stages
 */
export const APPLICATION_STATUS_TO_FLOW: Record<string, FlowStage> = {
  'submitted': 'application_received',
  'under_review': 'resume_screening',
  'screening': 'resume_screening',
  'interview': 'hr_interview',
  'skills': 'skills_test',
  'technical': 'technical_interview',
  'behavioral': 'behavioral_interview',
  'final': 'final_interview',
  'offer': 'offer_letter',
  'accepted': 'hired',
  'rejected': 'resume_screening',
  'pending': 'application_received',
}

/**
 * Reverse mapping: flow stage to application status
 */
export const FLOW_TO_APPLICATION_STATUS: Record<FlowStage, string> = {
  'job_identified': 'draft',
  'job_posted': 'active',
  'application_received': 'submitted',
  'resume_screening': 'under_review',
  'hr_interview': 'interview',
  'skills_test': 'skills',
  'technical_interview': 'technical',
  'behavioral_interview': 'behavioral',
  'final_interview': 'final',
  'background_check': 'verification',
  'offer_letter': 'offer',
  'hired': 'accepted',
  'onboarding': 'active',
}
