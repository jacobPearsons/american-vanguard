/**
 * useInterview Hook
 * Purpose: Manage interview scheduling and feedback state
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
  InterviewSummary, 
  Interview,
  InterviewScheduleRequest,
  InterviewFeedback,
  InterviewType,
  InterviewStatus
} from '@/types/interview'
import { 
  getInterviews, 
  getInterviewById,
  getUpcomingInterviews,
  scheduleInterview,
  submitInterviewFeedback,
  cancelInterview,
  getInterviewStats 
} from '@/services/interviewService'

interface UseInterviewReturn {
  // State
  interviews: InterviewSummary[]
  upcomingInterviews: InterviewSummary[]
  currentInterview: Interview | null
  loading: boolean
  error: string | null
  stats: {
    upcoming: number
    completed: number
    cancelled: number
    total: number
    ratingBreakdown: Record<string, number>
  } | null
  
  // Actions
  loadInterviews: (type?: InterviewType, status?: InterviewStatus) => Promise<void>
  loadUpcomingInterviews: () => Promise<void>
  loadInterview: (id: string) => Promise<void>
  schedule: (request: InterviewScheduleRequest) => Promise<{ success: boolean; error?: string }>
  submitFeedback: (feedback: InterviewFeedback) => Promise<{ success: boolean; error?: string }>
  cancel: (id: string) => Promise<{ success: boolean; error?: string }>
  loadStats: () => Promise<void>
}

/**
 * Hook for managing interviews
 * 
 * @returns Object containing interview state and actions
 * 
 * Usage:
 * const { interviews, loadInterviews, schedule } = useInterview()
 */
export const useInterview = (): UseInterviewReturn => {
  const [interviews, setInterviews] = useState<InterviewSummary[]>([])
  const [upcomingInterviews, setUpcomingInterviews] = useState<InterviewSummary[]>([])
  const [currentInterview, setCurrentInterview] = useState<Interview | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<{
    upcoming: number
    completed: number
    cancelled: number
    total: number
    ratingBreakdown: Record<string, number>
  } | null>(null)

  /**
   * Load interviews with optional filters
   */
  const loadInterviews = useCallback(async (
    type?: InterviewType,
    status?: InterviewStatus
  ) => {
    try {
      setLoading(true)
      setError(null)
      const data = await getInterviews(type, status)
      setInterviews(data)
    } catch (err) {
      setError('Failed to load interviews')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Load upcoming interviews
   */
  const loadUpcomingInterviews = useCallback(async () => {
    try {
      const data = await getUpcomingInterviews()
      setUpcomingInterviews(data)
    } catch (err) {
      console.error('Failed to load upcoming interviews:', err)
    }
  }, [])

  /**
   * Load single interview details
   */
  const loadInterview = useCallback(async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const data = await getInterviewById(id)
      setCurrentInterview(data)
    } catch (err) {
      setError('Failed to load interview')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Schedule a new interview
   */
  const schedule = useCallback(async (
    request: InterviewScheduleRequest
  ) => {
    try {
      setLoading(true)
      setError(null)
      const result = await scheduleInterview(request)
      
      if (result.success) {
        await loadInterviews()
        await loadUpcomingInterviews()
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (err) {
      const errorMsg = 'Failed to schedule interview'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }, [loadInterviews, loadUpcomingInterviews])

  /**
   * Submit interview feedback
   */
  const submitFeedback = useCallback(async (
    feedback: InterviewFeedback
  ) => {
    try {
      setLoading(true)
      setError(null)
      const result = await submitInterviewFeedback(feedback)
      
      if (result.success) {
        await loadInterviews()
        await loadUpcomingInterviews()
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (err) {
      const errorMsg = 'Failed to submit feedback'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }, [loadInterviews, loadUpcomingInterviews])

  /**
   * Cancel an interview
   */
  const cancel = useCallback(async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const result = await cancelInterview(id)
      
      if (result.success) {
        await loadInterviews()
        await loadUpcomingInterviews()
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (err) {
      const errorMsg = 'Failed to cancel interview'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }, [loadInterviews, loadUpcomingInterviews])

  /**
   * Load interview statistics
   */
  const loadStats = useCallback(async () => {
    try {
      const data = await getInterviewStats()
      setStats(data)
    } catch (err) {
      console.error('Failed to load stats:', err)
    }
  }, [])

  // Load upcoming interviews on mount
  useEffect(() => {
    loadUpcomingInterviews()
  }, [loadUpcomingInterviews])

  return {
    interviews,
    upcomingInterviews,
    currentInterview,
    loading,
    error,
    stats,
    loadInterviews,
    loadUpcomingInterviews,
    loadInterview,
    schedule,
    submitFeedback,
    cancel,
    loadStats,
  }
}
