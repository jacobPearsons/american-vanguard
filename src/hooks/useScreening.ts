/**
 * useScreening Hook
 * Purpose: Manage resume screening state and operations
 * 
 * Data Flow: Service → Hook State → UI Component
 * 
 * Rules (per docs):
 * - Hooks manage state logic
 * - Components display state only
 * - All data operations go through services
 */

import { useState, useCallback, useEffect } from 'react'
import type { 
  ScreeningSummary, 
  ScreeningRecord, 
  ScreeningStatus,
  ScreeningCriteria,
  ScreeningEvaluation 
} from '@/types/screening'
import { 
  getScreenings, 
  getScreeningById, 
  getScreeningCriteria,
  evaluateScreening,
  updateScreeningStatus,
  getScreeningStats 
} from '@/services/screeningService'

interface UseScreeningReturn {
  // State
  screenings: ScreeningSummary[]
  currentScreening: ScreeningRecord | null
  criteria: ScreeningCriteria[]
  loading: boolean
  error: string | null
  stats: {
    total: number
    pending: number
    inReview: number
    approved: number
    rejected: number
    averageScore: number
  } | null
  
  // Actions
  loadScreenings: (status?: ScreeningStatus) => Promise<void>
  loadScreening: (id: string) => Promise<void>
  loadCriteria: () => Promise<void>
  submitEvaluation: (
    id: string, 
    evaluation: ScreeningEvaluation[], 
    notes: string
  ) => Promise<{ success: boolean; error?: string }>
  changeStatus: (id: string, status: ScreeningStatus) => Promise<{ success: boolean; error?: string }>
  loadStats: () => Promise<void>
}

/**
 * Hook for managing resume screening
 * 
 * @returns Object containing screening state and actions
 * 
 * Usage:
 * const { screenings, loadScreenings, submitEvaluation } = useScreening()
 */
export const useScreening = (): UseScreeningReturn => {
  const [screenings, setScreenings] = useState<ScreeningSummary[]>([])
  const [currentScreening, setCurrentScreening] = useState<ScreeningRecord | null>(null)
  const [criteria, setCriteria] = useState<ScreeningCriteria[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<{
    total: number
    pending: number
    inReview: number
    approved: number
    rejected: number
    averageScore: number
  } | null>(null)

  /**
   * Load screenings with optional status filter
   */
  const loadScreenings = useCallback(async (status?: ScreeningStatus) => {
    try {
      setLoading(true)
      setError(null)
      const data = await getScreenings(status)
      setScreenings(data)
    } catch (err) {
      setError('Failed to load screenings')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Load single screening details
   */
  const loadScreening = useCallback(async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const data = await getScreeningById(id)
      setCurrentScreening(data)
    } catch (err) {
      setError('Failed to load screening')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Load screening criteria
   */
  const loadCriteria = useCallback(async () => {
    try {
      const data = await getScreeningCriteria()
      setCriteria(data)
    } catch (err) {
      console.error('Failed to load criteria:', err)
    }
  }, [])

  /**
   * Submit screening evaluation
   */
  const submitEvaluation = useCallback(async (
    id: string,
    evaluation: ScreeningEvaluation[],
    notes: string
  ) => {
    try {
      setLoading(true)
      setError(null)
      const result = await evaluateScreening(id, evaluation, notes, 'Current User')
      
      if (result.success) {
        // Refresh the list
        await loadScreenings()
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (err) {
      const errorMsg = 'Failed to submit evaluation'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }, [loadScreenings])

  /**
   * Change screening status
   */
  const changeStatus = useCallback(async (
    id: string,
    status: ScreeningStatus
  ) => {
    try {
      setLoading(true)
      setError(null)
      const result = await updateScreeningStatus(id, status)
      
      if (result.success) {
        await loadScreenings()
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (err) {
      const errorMsg = 'Failed to update status'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }, [loadScreenings])

  /**
   * Load screening statistics
   */
  const loadStats = useCallback(async () => {
    try {
      const data = await getScreeningStats()
      setStats(data)
    } catch (err) {
      console.error('Failed to load stats:', err)
    }
  }, [])

  // Load criteria on mount
  useEffect(() => {
    loadCriteria()
  }, [loadCriteria])

  return {
    screenings,
    currentScreening,
    criteria,
    loading,
    error,
    stats,
    loadScreenings,
    loadScreening,
    loadCriteria,
    submitEvaluation,
    changeStatus,
    loadStats,
  }
}
