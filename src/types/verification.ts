/**
 * Verification Types
 * Purpose: Define data contracts for verification code system
 * 
 * Flow: After Skills Test → Generate Code → Required for Interviews
 * Part of: flow.md - Skills Test → Interview stages
 */

import { FlowStage } from './flow'

/**
 * Verification code status
 */
export type VerificationStatus = 
  | 'pending'
  | 'active'
  | 'used'
  | 'expired'
  | 'revoked'

/**
 * Verification code type
 */
export type VerificationType = 
  | 'skills_completion'
  | 'interview_access'
  | 'final_interview'

/**
 * Verification code record
 */
export interface VerificationCode {
  id: string
  code: string
  type: VerificationType
  status: VerificationStatus
  userId: string
  userEmail: string
  generatedAt: Date
  expiresAt: Date
  usedAt: Date | null
  createdAt: Date
}

/**
 * Code generation request
 */
export interface GenerateCodeRequest {
  userId: string
  userEmail: string
  type: VerificationType
}

/**
 * Code validation request
 */
export interface ValidateCodeRequest {
  code: string
  type: VerificationType
}

/**
 * Verification result
 */
export interface VerificationResult {
  valid: boolean
  message: string
  code?: VerificationCode
  error?: string
}

/**
 * Verification summary for display
 */
export interface VerificationSummary {
  hasActiveCode: boolean
  activeCode: string | null
  expiresAt: Date | null
  type: VerificationType | null
  canAccessInterview: boolean
}

/**
 * Code format configuration
 */
export const CODE_CONFIG = {
  length: 8,
  format: 'alphanumeric',
  prefix: 'SK',
  expiryHours: 72, // 3 days
}

/**
 * Verification type labels
 */
export const VERIFICATION_TYPE_LABELS: Record<VerificationType, string> = {
  'skills_completion': 'Skills Test Completion',
  'interview_access': 'Interview Access',
  'final_interview': 'Final Interview Access',
}

/**
 * Verification status colors
 */
export const VERIFICATION_STATUS_COLORS: Record<VerificationStatus, string> = {
  'pending': 'bg-yellow-500',
  'active': 'bg-green-500',
  'used': 'bg-yellow-500',
  'expired': 'bg-gray-500',
  'revoked': 'bg-red-500',
}

/**
 * Map verification type to flow stage
 */
export const VERIFICATION_TYPE_TO_FLOW: Record<VerificationType, FlowStage> = {
  'skills_completion': 'skills_test',
  'interview_access': 'technical_interview',
  'final_interview': 'final_interview',
}
