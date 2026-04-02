/**
 * Interview Types
 * Purpose: Define data contracts for HR and technical interview flow
 * 
 * Flow: Database → Service → Hook → UI Component
 *.md - HR Interview Part of: flow, Technical Interview, Behavioral Interview, Final Interview stages
 */

import { FlowStage } from './flow'

/**
 * Interview type
 */
export type InterviewType = 
  | 'hr'
  | 'technical'
  | 'behavioral'
  | 'final'
  | 'phone_screen'

/**
 * Interview status
 */
export type InterviewStatus = 
  | 'scheduled'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  | 'rescheduled'

/**
 * Interview feedback rating
 */
export type InterviewRating = 
  | 'strong_yes'
  | 'yes'
  | 'neutral'
  | 'no'
  | 'strong_no'

/**
 * Interview record
 */
export interface Interview {
  id: string
  applicationId: string
  candidateName: string
  candidateEmail: string
  jobTitle: string
  interviewType: InterviewType
  scheduledAt: Date
  duration: number // in minutes
  location: string // video call link or physical location
  interviewerName: string
  interviewerEmail: string
  status: InterviewStatus
  notes: string
  rating: InterviewRating | null
  feedback: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Interview schedule request
 */
export interface InterviewScheduleRequest {
  applicationId: string
  interviewType: InterviewType
  scheduledAt: Date
  duration: number
  location: string
  interviewerName: string
  interviewerEmail: string
}

/**
 * Interview feedback submission
 */
export interface InterviewFeedback {
  interviewId: string
  rating: InterviewRating
  notes: string
  feedback: string
  strengths: string[]
  weaknesses: string[]
  recommendation: 'advance' | 'hold' | 'reject'
}

/**
 * Interview summary for list view
 */
export interface InterviewSummary {
  id: string
  candidateName: string
  jobTitle: string
  interviewType: InterviewType
  scheduledAt: Date
  status: InterviewStatus
  rating: InterviewRating | null
}

/**
 * Interview action result
 */
export interface InterviewActionResult {
  success: boolean
  message?: string
  error?: string
  interview?: Interview
}

/**
 * Interview type labels
 */
export const INTERVIEW_TYPE_LABELS: Record<InterviewType, string> = {
  'hr': 'HR Interview',
  'technical': 'Technical Interview',
  'behavioral': 'Behavioral Interview',
  'final': 'Final Interview',
  'phone_screen': 'Phone Screen',
}

/**
 * Interview status colors
 */
export const INTERVIEW_STATUS_COLORS: Record<InterviewStatus, string> = {
  'scheduled': 'bg-yellow-500',
  'completed': 'bg-green-500',
  'cancelled': 'bg-red-500',
  'no_show': 'bg-gray-500',
  'rescheduled': 'bg-yellow-500',
}

/**
 * Interview rating labels
 */
export const INTERVIEW_RATING_LABELS: Record<InterviewRating, string> = {
  'strong_yes': 'Strong Yes',
  'yes': 'Yes',
  'neutral': 'Neutral',
  'no': 'No',
  'strong_no': 'Strong No',
}

/**
 * Map interview type to flow stage
 */
export const INTERVIEW_TYPE_TO_FLOW: Record<InterviewType, FlowStage> = {
  'hr': 'hr_interview',
  'phone_screen': 'hr_interview',
  'technical': 'technical_interview',
  'behavioral': 'behavioral_interview',
  'final': 'final_interview',
}

/**
 * Default interview durations (in minutes)
 */
export const DEFAULT_INTERVIEW_DURATIONS: Record<InterviewType, number> = {
  'hr': 45,
  'phone_screen': 30,
  'technical': 60,
  'behavioral': 45,
  'final': 60,
}
