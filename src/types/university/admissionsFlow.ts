/**
 * University Admissions Flow Types
 * Purpose: Define the university admissions pipeline stages for American Vanguard Institute (AVI)
 * 
 * Based on docs/flow.md:
 * Student Identified → University Programs & Majors → Applications Submitted → 
 * Academic Record Review → Admissions Counselor Interview → Standardized Testing / Portfolio Review → 
 * Department Interview → Student Fit Assessment → Final Admissions Committee Review → 
 * Background Verification → Acceptance Letter → Enrollment → Orientation & Onboarding
 */

import { Users, FileText, GraduationCap, CheckCircle, UserPlus, Calendar, Briefcase, ClipboardCheck, Search, BookOpen, Send, Mail } from 'lucide-react'

/**
 * All possible stages in the university admissions pipeline
 * Matches docs/flow.md exactly
 */
export type AdmissionsStage = 
  | 'student_identified'
  | 'university_programs'
  | 'applications_submitted'
  | 'academic_record_review'
  | 'admissions_counselor_interview'
  | 'standardized_testing'
  | 'department_interview'
  | 'student_fit_assessment'
  | 'final_committee_review'
  | 'background_verification'
  | 'acceptance_letter'
  | 'enrollment'
  | 'orientation_onboarding'

/**
 * Stage metadata for display
 */
export interface AdmissionsStageInfo {
  id: AdmissionsStage
  label: string
  description: string
  color: string
  icon: string
}

/**
 * Complete admissions flow definition with all 13 stages
 * Exactly matches docs/flow.md
 */
export const ADMISSIONS_STAGES: AdmissionsStageInfo[] = [
  { 
    id: 'student_identified', 
    label: 'Student Identified', 
    description: 'Prospective student shows interest in AVI', 
    color: 'bg-yellow-500', 
    icon: 'Search' 
  },
  { 
    id: 'university_programs', 
    label: 'University Programs & Majors', 
    description: 'Exploring available programs and majors', 
    color: 'bg-indigo-500', 
    icon: 'BookOpen' 
  },
  { 
    id: 'applications_submitted', 
    label: 'Applications Submitted', 
    description: 'Application submitted for review', 
    color: 'bg-purple-500', 
    icon: 'Send' 
  },
  { 
    id: 'academic_record_review', 
    label: 'Academic Record Review', 
    description: 'Reviewing transcripts and academic history', 
    color: 'bg-violet-500', 
    icon: 'FileText' 
  },
  { 
    id: 'admissions_counselor_interview', 
    label: 'Admissions Counselor Interview', 
    description: 'Initial interview with admissions counselor', 
    color: 'bg-orange-500', 
    icon: 'Users' 
  },
  { 
    id: 'standardized_testing', 
    label: 'Standardized Testing / Portfolio Review', 
    description: 'SAT/ACT scores or portfolio assessment', 
    color: 'bg-amber-500', 
    icon: 'GraduationCap' 
  },
  { 
    id: 'department_interview', 
    label: 'Department Interview', 
    description: 'Interview with department faculty', 
    color: 'bg-red-500', 
    icon: 'Briefcase' 
  },
  { 
    id: 'student_fit_assessment', 
    label: 'Student Fit Assessment', 
    description: 'Evaluating student fit for program', 
    color: 'bg-pink-500', 
    icon: 'ClipboardCheck' 
  },
  { 
    id: 'final_committee_review', 
    label: 'Final Admissions Committee Review', 
    description: 'Final review by admissions committee', 
    color: 'bg-rose-500', 
    icon: 'Mail' 
  },
  { 
    id: 'background_verification', 
    label: 'Background Verification', 
    description: 'Verifying applicant background and credentials', 
    color: 'bg-cyan-500', 
    icon: 'CheckCircle' 
  },
  { 
    id: 'acceptance_letter', 
    label: 'Acceptance Letter', 
    description: 'Official acceptance notification', 
    color: 'bg-green-500', 
    icon: 'Mail' 
  },
  { 
    id: 'enrollment', 
    label: 'Enrollment', 
    description: 'Completing enrollment paperwork', 
    color: 'bg-teal-500', 
    icon: 'UserPlus' 
  },
  { 
    id: 'orientation_onboarding', 
    label: 'Orientation & Onboarding', 
    description: 'New student orientation and onboarding', 
    color: 'bg-emerald-500', 
    icon: 'Calendar' 
  },
]

/**
 * Get stage info by ID
 */
export const getAdmissionsStageInfo = (stageId: AdmissionsStage): AdmissionsStageInfo | undefined => {
  return ADMISSIONS_STAGES.find(stage => stage.id === stageId)
}

/**
 * Get next stage in admissions flow
 */
export const getNextAdmissionsStage = (currentStage: AdmissionsStage): AdmissionsStage | null => {
  const currentIndex = ADMISSIONS_STAGES.findIndex(s => s.id === currentStage)
  if (currentIndex === -1 || currentIndex === ADMISSIONS_STAGES.length - 1) {
    return null
  }
  return ADMISSIONS_STAGES[currentIndex + 1].id
}

/**
 * Get previous stage in admissions flow
 */
export const getPreviousAdmissionsStage = (currentStage: AdmissionsStage): AdmissionsStage | null => {
  const currentIndex = ADMISSIONS_STAGES.findIndex(s => s.id === currentStage)
  if (currentIndex <= 0) {
    return null
  }
  return ADMISSIONS_STAGES[currentIndex - 1].id
}

/**
 * Get progress percentage
 */
export const getAdmissionsProgressPercentage = (stage: AdmissionsStage): number => {
  const index = ADMISSIONS_STAGES.findIndex(s => s.id === stage)
  if (index === -1) return 0
  return Math.round((index / (ADMISSIONS_STAGES.length - 1)) * 100)
}

/**
 * Application status mapping to admissions stages
 */
export const APPLICATION_STATUS_TO_ADMISSIONS: Record<string, AdmissionsStage> = {
  'prospect': 'student_identified',
  'exploring': 'university_programs',
  'applicant': 'applications_submitted',
  'submitted': 'applications_submitted',
  'under_review': 'academic_record_review',
  'counselor_interview': 'admissions_counselor_interview',
  'test_pending': 'standardized_testing',
  'test_completed': 'standardized_testing',
  'department_interview': 'department_interview',
  'fit_assessment': 'student_fit_assessment',
  'committee_review': 'final_committee_review',
  'background_check': 'background_verification',
  'accepted': 'acceptance_letter',
  'enrolled': 'enrollment',
  'oriented': 'orientation_onboarding',
  'active': 'orientation_onboarding',
  'rejected': 'academic_record_review',
  'waitlisted': 'final_committee_review',
  'deferred': 'academic_record_review',
}

/**
 * Reverse mapping: admissions stage to application status
 */
export const ADMISSIONS_TO_APPLICATION_STATUS: Record<AdmissionsStage, string> = {
  'student_identified': 'prospect',
  'university_programs': 'exploring',
  'applications_submitted': 'submitted',
  'academic_record_review': 'under_review',
  'admissions_counselor_interview': 'counselor_interview',
  'standardized_testing': 'test_completed',
  'department_interview': 'department_interview',
  'student_fit_assessment': 'fit_assessment',
  'final_committee_review': 'committee_review',
  'background_verification': 'background_check',
  'acceptance_letter': 'accepted',
  'enrollment': 'enrolled',
  'orientation_onboarding': 'oriented',
}

/**
 * Program types available at AVI
 */
export type ProgramType = 
  | 'undergraduate'
  | 'graduate'
  | 'doctoral'
  | 'certificate'
  | 'online'

/**
 * Program-specific admissions stages
 * Different programs may have different requirements
 * Uses docs/flow.md as the base template
 */
export const PROGRAM_ADMISSIONS_STAGES: Record<ProgramType, AdmissionsStage[]> = {
  'undergraduate': [
    'student_identified',
    'university_programs',
    'applications_submitted',
    'academic_record_review',
    'admissions_counselor_interview',
    'standardized_testing',
    'department_interview',
    'student_fit_assessment',
    'final_committee_review',
    'background_verification',
    'acceptance_letter',
    'enrollment',
    'orientation_onboarding',
  ],
  'graduate': [
    'student_identified',
    'university_programs',
    'applications_submitted',
    'academic_record_review',
    'admissions_counselor_interview',
    'standardized_testing',
    'department_interview',
    'student_fit_assessment',
    'final_committee_review',
    'background_verification',
    'acceptance_letter',
    'enrollment',
    'orientation_onboarding',
  ],
  'doctoral': [
    'student_identified',
    'university_programs',
    'applications_submitted',
    'academic_record_review',
    'admissions_counselor_interview',
    'standardized_testing',
    'department_interview',
    'student_fit_assessment',
    'final_committee_review',
    'background_verification',
    'acceptance_letter',
    'enrollment',
    'orientation_onboarding',
  ],
  'certificate': [
    'student_identified',
    'university_programs',
    'applications_submitted',
    'academic_record_review',
    'admissions_counselor_interview',
    'acceptance_letter',
    'enrollment',
    'orientation_onboarding',
  ],
  'online': [
    'student_identified',
    'university_programs',
    'applications_submitted',
    'academic_record_review',
    'student_fit_assessment',
    'acceptance_letter',
    'enrollment',
    'orientation_onboarding',
  ],
}

/**
 * Icon mapping for rendering icons in components
 */
export const ADMISSIONS_STAGE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Search,
  BookOpen,
  Send,
  FileText,
  Users,
  GraduationCap,
  Briefcase,
  ClipboardCheck,
  Mail,
  CheckCircle,
  UserPlus,
  Calendar,
}
