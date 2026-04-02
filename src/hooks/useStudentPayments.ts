/**
 * useStudentPayments Hook
 * Manages payment state and data fetching
 */

import { useState, useEffect, useCallback } from 'react'
import type {
  StudentInfo,
  PaymentRecord,
  PaymentStats,
  TransactionRecord,
  PaymentFilters,
} from '@/types/studentPayments'
import {
  getStudentInfo,
  getActiveSessionFees,
  getOtherSessionFees,
  getPaymentStats,
  getTransactions,
  initiatePayment,
} from '@/services/paymentService'

interface UseStudentPaymentsReturn {
  // Data
  studentInfo: StudentInfo | null
  activeSessionFees: PaymentRecord[]
  otherSessionFees: PaymentRecord[]
  transactions: TransactionRecord[]
  stats: PaymentStats | null
  
  // State
  loading: boolean
  error: string | null
  activeTab: 'payment' | 'transactions'
  
  // Pagination
  otherSessionPagination: {
    currentPage: number
    totalPages: number
    totalItems: number
  }
  
  // Actions
  setActiveTab: (tab: 'payment' | 'transactions') => void
  refreshData: () => Promise<void>
  handlePayment: (feeId: string) => Promise<void>
  searchActiveFees: (query: string) => void
  searchOtherFees: (query: string, page?: number) => Promise<void>
  setPerPage: (perPage: number) => void
}

export function useStudentPayments(): UseStudentPaymentsReturn {
  // State
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null)
  const [activeSessionFees, setActiveSessionFees] = useState<PaymentRecord[]>([])
  const [otherSessionFees, setOtherSessionFees] = useState<PaymentRecord[]>([])
  const [transactions, setTransactions] = useState<TransactionRecord[]>([])
  const [stats, setStats] = useState<PaymentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'payment' | 'transactions'>('payment')
  const [otherSessionPagination, setOtherSessionPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  })
  
  // Filters
  const [filters, setFilters] = useState<PaymentFilters>({
    perPage: 10,
    searchQuery: '',
  })

  // Fetch all initial data
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [
        studentData,
        activeFees,
        otherFees,
        statsData,
        txnData,
      ] = await Promise.all([
        getStudentInfo(),
        getActiveSessionFees(filters),
        getOtherSessionFees({ ...filters, searchQuery: '' }),
        getPaymentStats(),
        getTransactions(),
      ])
      
      setStudentInfo(studentData)
      setActiveSessionFees(activeFees.data)
      setOtherSessionFees(otherFees.data)
      setStats(statsData)
      setTransactions(txnData)
      setOtherSessionPagination({
        currentPage: otherFees.page,
        totalPages: otherFees.totalPages,
        totalItems: otherFees.total,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load payment data')
      console.error('Error fetching payment data:', err)
    } finally {
      setLoading(false)
    }
  }, [filters.perPage])

  // Initial load
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Refresh data
  const refreshData = useCallback(async () => {
    await fetchData()
  }, [fetchData])

  // Handle payment initiation
  const handlePayment = useCallback(async (feeId: string) => {
    try {
      const { url } = await initiatePayment(feeId)
      // In production, this would redirect to payment gateway
      console.log('Payment URL:', url)
      window.location.href = url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initiate payment')
    }
  }, [])

  // Search active fees (client-side filtering for demo)
  const searchActiveFees = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }))
    
    const lowerQuery = query.toLowerCase()
    getActiveSessionFees({ ...filters, searchQuery: query })
      .then(result => {
        if (!query) {
          getActiveSessionFees(filters).then(res => setActiveSessionFees(res.data))
        } else {
          const filtered = result.data.filter(
            fee =>
              fee.feesName.toLowerCase().includes(lowerQuery) ||
              fee.feesDescription.toLowerCase().includes(lowerQuery)
          )
          setActiveSessionFees(filtered)
        }
      })
  }, [filters])

  // Search other session fees
  const searchOtherFees = useCallback(async (query: string, page = 1) => {
    try {
      const result = await getOtherSessionFees({
        ...filters,
        searchQuery: query,
      })
      setOtherSessionFees(result.data)
      setOtherSessionPagination({
        currentPage: result.page,
        totalPages: result.totalPages,
        totalItems: result.total,
      })
    } catch (err) {
      console.error('Error searching other fees:', err)
    }
  }, [filters])

  // Set per page
  const setPerPage = useCallback((perPage: number) => {
    setFilters(prev => ({ ...prev, perPage }))
  }, [])

  return {
    // Data
    studentInfo,
    activeSessionFees,
    otherSessionFees,
    transactions,
    stats,
    
    // State
    loading,
    error,
    activeTab,
    
    // Pagination
    otherSessionPagination,
    
    // Actions
    setActiveTab,
    refreshData,
    handlePayment,
    searchActiveFees,
    searchOtherFees,
    setPerPage,
  }
}
