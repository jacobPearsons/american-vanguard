/**
 * useDashboard Hook
 * Purpose: Manage dashboard state and fetch data from service layer
 * 
 * Data Flow: Service → Hook State → UI Component
 * 
 * Rules (per docs):
 * - Hooks manage state logic
 * - Components display state
 * - State must be predictable
 */

import { useState, useEffect, useCallback } from 'react'
import type { 
  DashboardData, 
  DashboardStats, 
  EnrolledCourse, 
  Grade, 
  Exam,
  PaymentStatus,
  DashboardNotification
} from '@/types/dashboard'
import { 
  getDashboardData,
  getUserStats,
  getEnrolledCourses,
  getRecentGrades,
  getUpcomingExams,
  getPaymentStatuses,
  getNotifications
} from '@/services/dashboardService'

interface UseDashboardReturn {
  data: DashboardData | null
  stats: DashboardStats | null
  enrolledCourses: EnrolledCourse[]
  recentGrades: Grade[]
  upcomingExams: Exam[]
  payments: PaymentStatus[]
  notifications: DashboardNotification[]
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export const useDashboard = (userId: string | null): UseDashboardReturn => {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const dashboardData = await getDashboardData(userId)
      setData(dashboardData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data')
      console.error('Dashboard fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    stats: data?.stats ?? null,
    enrolledCourses: data?.enrolledCourses ?? [],
    recentGrades: data?.recentGrades ?? [],
    upcomingExams: data?.upcomingExams ?? [],
    payments: data?.payments ?? [],
    notifications: data?.notifications ?? [],
    isLoading,
    error,
    refresh: fetchData,
  }
}

export const useUserStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        const data = await getUserStats()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, isLoading, error }
}

export const useEnrolledCourses = () => {
  const [courses, setCourses] = useState<EnrolledCourse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true)
        const data = await getEnrolledCourses()
        setCourses(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch courses')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [])

  return { courses, isLoading, error }
}

export const useRecentGrades = () => {
  const [grades, setGrades] = useState<Grade[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setIsLoading(true)
        const data = await getRecentGrades()
        setGrades(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch grades')
      } finally {
        setIsLoading(false)
      }
    }

    fetchGrades()
  }, [])

  return { grades, isLoading, error }
}

export const useUpcomingExams = () => {
  const [exams, setExams] = useState<Exam[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setIsLoading(true)
        const data = await getUpcomingExams()
        setExams(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch exams')
      } finally {
        setIsLoading(false)
      }
    }

    fetchExams()
  }, [])

  return { exams, isLoading, error }
}

export const usePaymentStatuses = () => {
  const [payments, setPayments] = useState<PaymentStatus[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true)
        const data = await getPaymentStatuses()
        setPayments(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch payments')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPayments()
  }, [])

  return { payments, isLoading, error }
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<DashboardNotification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true)
        const data = await getNotifications()
        setNotifications(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch notifications')
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  return { notifications, isLoading, error }
}
