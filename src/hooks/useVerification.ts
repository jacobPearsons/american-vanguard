/**
 * useVerification Hook
 * Purpose: Manage verification code state and operations
 * 
 * Data Flow: Service → Hook State → UI Component
 * 
 * Rules (per docs):
 * - Hooks manage state logic
 * - Components display state only
 * - All data operations go through services
 */

import { useState, useCallback } from 'react'
import type { 
  VerificationCode, 
  VerificationType,
  VerificationSummary
} from '@/types/verification'
import { 
  generateVerificationCode, 
  validateVerificationCode, 
  useVerificationCode,
  getVerificationSummary 
} from '@/services/verificationService'

interface UseVerificationReturn {
  // State
  currentCode: VerificationCode | null
  summary: VerificationSummary | null
  loading: boolean
  error: string | null
  isValid: boolean | null
  
  // Actions
  generateCode: (userId: string, userEmail: string, type: VerificationType) => Promise<VerificationCode | null>
  validateCode: (code: string, type: VerificationType) => Promise<boolean>
  useCode: (codeId: string) => Promise<boolean>
  loadSummary: (userId: string) => Promise<void>
  clearError: () => void
}

/**
 * Hook for managing verification codes
 * 
 * @returns Object containing verification state and actions
 * 
 * Usage:
 * const { generateCode, validateCode, currentCode } = useVerification()
 */
export const useVerification = (): UseVerificationReturn => {
  const [currentCode, setCurrentCode] = useState<VerificationCode | null>(null)
  const [summary, setSummary] = useState<VerificationSummary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  /**
   * Generate a new verification code
   */
  const generateCode = useCallback(async (
    userId: string,
    userEmail: string,
    type: VerificationType
  ) => {
    try {
      setLoading(true)
      setError(null)
      const code = await generateVerificationCode({ userId, userEmail, type })
      setCurrentCode(code)
      return code
    } catch (err) {
      setError('Failed to generate verification code')
      console.error(err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Validate a verification code
   */
  const validateCode = useCallback(async (
    code: string,
    type: VerificationType
  ) => {
    try {
      setLoading(true)
      setError(null)
      const result = await validateVerificationCode({ code, type })
      setIsValid(result.valid)
      
      if (!result.valid) {
        setError(result.message)
      }
      
      return result.valid
    } catch (err) {
      setError('Failed to validate code')
      console.error(err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Mark a code as used
   */
  const useCode = useCallback(async (codeId: string) => {
    try {
      setLoading(true)
      setError(null)
      const result = await useVerificationCode(codeId)
      
      if (result.valid) {
        setCurrentCode(null)
        return true
      }
      
      return false
    } catch (err) {
      setError('Failed to use code')
      console.error(err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Load verification summary for user
   */
  const loadSummary = useCallback(async (userId: string) => {
    try {
      setLoading(true)
      const data = await getVerificationSummary(userId)
      setSummary(data)
    } catch (err) {
      console.error('Failed to load summary:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null)
    setIsValid(null)
  }, [])

  return {
    currentCode,
    summary,
    loading,
    error,
    isValid,
    generateCode,
    validateCode,
    useCode,
    loadSummary,
    clearError,
  }
}
