/**
 * Types Index
 * Purpose: Central export point for all TypeScript types
 * 
 * Usage:
 * import { ProfileData, FlowStage } from '@/types'
 */

export * from './profile'
export * from './dashboard'
export * from './admission'
export * from './flow'

// Export with namespace to avoid conflicts
export type { ScreeningRecord, ScreeningStatus, ScreeningCriteria, ScreeningSummary } from './screening'
export { DEFAULT_SCREENING_CRITERIA, SCREENING_STATUS_TO_FLOW } from './screening'
export type { Interview as InterviewRecord, InterviewType, InterviewStatus, InterviewRating, InterviewSummary } from './interview'
export { INTERVIEW_TYPE_LABELS, INTERVIEW_STATUS_COLORS, INTERVIEW_RATING_LABELS, DEFAULT_INTERVIEW_DURATIONS } from './interview'
