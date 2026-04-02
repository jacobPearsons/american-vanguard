/**
 * Screening Types
 * Purpose: Define data contracts for resume screening flow
 * 
 * Flow: Database → Service → Hook → UI Component
 * Part of: flow.md - Resume Screening stage
 */

import { FlowStage } from './flow'

/**
 * Resume screening status
 */
export type ScreeningStatus = 
  | 'pending'
  | 'in_review'
  | 'approved'
  | 'rejected'
  | 'needs_revision'

/**
 * Resume screening record
 */
export interface ScreeningRecord {
  id: string
  applicationId: string
  candidateName: string
  candidateEmail: string
  jobTitle: string
  resumeUrl: string
  status: ScreeningStatus
  score: number | null
  notes: string
  reviewedBy: string | null
  reviewedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

/**
 * Screening criteria for evaluation
 */
export interface ScreeningCriteria {
  id: string
  name: string
  description: string
  weight: number
  maxScore: number
}

/**
 * Screening evaluation result
 */
export interface ScreeningEvaluation {
  criteriaId: string
  score: number
  notes: string
}

/**
 * Screening summary for list view
 */
export interface ScreeningSummary {
  id: string
  candidateName: string
  jobTitle: string
  status: ScreeningStatus
  score: number | null
  submittedAt: Date
}

/**
 * Screening action result
 */
export interface ScreeningActionResult {
  success: boolean
  message?: string
  error?: string
  screening?: ScreeningRecord
}

/**
 * Default screening criteria
 */
export const DEFAULT_SCREENING_CRITERIA: ScreeningCriteria[] = [
  { id: 'education', name: 'Education', description: 'Relevant educational background', weight: 20, maxScore: 100 },
  { id: 'experience', name: 'Experience', description: 'Years of relevant experience', weight: 30, maxScore: 100 },
  { id: 'skills', name: 'Skills Match', description: 'Technical skills alignment', weight: 25, maxScore: 100 },
  { id: 'certifications', name: 'Certifications', description: 'Relevant certifications', weight: 15, maxScore: 100 },
  { id: 'culture', name: 'Cultural Fit', description: 'Alignment with company values', weight: 10, maxScore: 100 },
]

/**
 * Map screening status to flow stage
 */
export const SCREENING_STATUS_TO_FLOW: Record<ScreeningStatus, FlowStage> = {
  'pending': 'application_received',
  'in_review': 'resume_screening',
  'approved': 'hr_interview',
  'rejected': 'resume_screening',
  'needs_revision': 'resume_screening',
}
