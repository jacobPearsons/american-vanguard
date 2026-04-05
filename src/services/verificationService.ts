/**
 * Verification Service
 * Purpose: Handle verification code generation and validation
 * 
 * Data Flow: API → Service → Hook → UI Component
 * 
 * Rules (per docs):
 * - Services handle all data access
 * - Components never call APIs directly
 * - Generate unique, secure codes
 */

import type { 
  VerificationCode, 
  VerificationStatus,
  VerificationType,
  GenerateCodeRequest,
  ValidateCodeRequest,
  VerificationResult,
  VerificationSummary
} from '@/types/verification'
import { CODE_CONFIG } from '@/types/verification'

// Mock data store for demo
let mockCodes: VerificationCode[] = []

/**
 * Generate a unique verification code
 */
const generateCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = CODE_CONFIG.prefix
  
  for (let i = 0; i < CODE_CONFIG.length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return code
}

/**
 * Generate a new verification code
 */
export const generateVerificationCode = async (
  request: GenerateCodeRequest
): Promise<VerificationCode> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Check if user already has an active code of this type
    const existingCode = mockCodes.find(
      c => c.userId === request.userId && 
           c.type === request.type && 
           c.status === 'active'
    )
    
    if (existingCode) {
      return existingCode
    }
    
    // Create new code
    const now = new Date()
    const expires = new Date(now.getTime() + CODE_CONFIG.expiryHours * 60 * 60 * 1000)
    
    const newCode: VerificationCode = {
      id: `vc-${Date.now()}`,
      code: generateCode(),
      type: request.type,
      status: 'active',
      userId: request.userId,
      userEmail: request.userEmail,
      generatedAt: now,
      expiresAt: expires,
      usedAt: null,
      createdAt: now,
    }
    
    mockCodes.push(newCode)
    
    return newCode
  } catch (error) {
    console.error('Error generating code:', error)
    throw error
  }
}

/**
 * Validate a verification code
 */
export const validateVerificationCode = async (
  request: ValidateCodeRequest
): Promise<VerificationResult> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const code = mockCodes.find(
      c => c.code === request.code && 
           c.type === request.type
    )
    
    if (!code) {
      return { valid: false, message: 'Invalid verification code' }
    }
    
    if (code.status === 'used') {
      return { valid: false, message: 'This code has already been used' }
    }
    
    if (code.status === 'expired' || code.status === 'revoked') {
      return { valid: false, message: 'This code has expired or been revoked' }
    }
    
    if (code.status === 'pending') {
      return { valid: false, message: 'This code is still pending activation' }
    }
    
    // Check expiry
    if (new Date() > code.expiresAt) {
      // Mark as expired
      code.status = 'expired'
      return { valid: false, message: 'This code has expired' }
    }
    
    return { 
      valid: true, 
      message: 'Code is valid',
      code 
    }
  } catch (error) {
    console.error('Error validating code:', error)
    return { valid: false, message: 'Error validating code' }
  }
}

/**
 * Mark a code as used
 */
export const useVerificationCode = async (
  codeId: string
): Promise<VerificationResult> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const code = mockCodes.find(c => c.id === codeId)
    
    if (!code) {
      return { valid: false, message: 'Code not found' }
    }
    
    if (code.status !== 'active') {
      return { valid: false, message: 'Code is not active' }
    }
    
    // Mark as used
    code.status = 'used'
    code.usedAt = new Date()
    
    return { 
      valid: true, 
      message: 'Code used successfully',
      code 
    }
  } catch (error) {
    console.error('Error using code:', error)
    return { valid: false, message: 'Error using code' }
  }
}

/**
 * Get verification summary for a user
 */
export const getVerificationSummary = async (
  userId: string
): Promise<VerificationSummary> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const activeCodes = mockCodes.filter(
      c => c.userId === userId && c.status === 'active'
    )
    
    // Check if skills test is completed (has active code)
    const skillsCode = activeCodes.find(c => c.type === 'skills_completion')
    const interviewCode = activeCodes.find(c => c.type === 'interview_access')
    
    return {
      hasActiveCode: activeCodes.length > 0,
      activeCode: skillsCode?.code || interviewCode?.code || null,
      expiresAt: skillsCode?.expiresAt || interviewCode?.expiresAt || null,
      type: skillsCode?.type || interviewCode?.type || null,
      canAccessInterview: !!interviewCode,
    }
  } catch (error) {
    console.error('Error getting verification summary:', error)
    return {
      hasActiveCode: false,
      activeCode: null,
      expiresAt: null,
      type: null,
      canAccessInterview: false,
    }
  }
}

/**
 * Revoke a verification code
 */
export const revokeVerificationCode = async (
  codeId: string
): Promise<boolean> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const code = mockCodes.find(c => c.id === codeId)
    
    if (code) {
      code.status = 'revoked'
      return true
    }
    
    return false
  } catch (error) {
    console.error('Error revoking code:', error)
    return false
  }
}

/**
 * Check if user can access specific interview type
 */
export const canAccessInterview = async (
  userId: string,
  interviewType: VerificationType
): Promise<boolean> => {
  try {
    const summary = await getVerificationSummary(userId)
    
    // For now, allow access if user has completed skills test
    // In production, this would check specific code types
    return summary.hasActiveCode
  } catch (error) {
    return false
  }
}
