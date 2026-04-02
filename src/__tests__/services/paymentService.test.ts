/**
 * Payment Service Tests
 * Unit tests for payment operations
 * 
 * Per docs/backend-architecture-framework.md:
 * - Testing must use Jest
 * - Services should be tested for business logic
 * 
 * Run with: bun test
 */

import {
  getStudentInfo,
  getActiveSessionFees,
  getOtherSessionFees,
  getPaymentStats,
  getTransactions,
  initiatePayment,
  formatCurrency,
  formatNumber,
} from '@/services/paymentService'

describe('paymentService', () => {
  describe('getStudentInfo', () => {
    it('should return student information', async () => {
      const student = await getStudentInfo()
      
      expect(student).toBeDefined()
      expect(student.id).toBe('stu-001')
      expect(student.matricNumber).toBe('2005003013')
      expect(student.firstName).toBe('Adeniyi Victor')
      expect(student.lastName).toBe('Ayomide')
      expect(student.status).toBe('Active')
    })

    it('should return correct student details', async () => {
      const student = await getStudentInfo()
      
      expect(student.faculty).toBe('ENGINEERING')
      expect(student.department).toBe('ELECTRICAL & ELECTRONIC ENGINEERING')
      expect(student.level).toBe('500 LEVEL')
      expect(student.session).toBe('2025/2026')
    })
  })

  describe('getActiveSessionFees', () => {
    it('should return active session fees', async () => {
      const result = await getActiveSessionFees()
      
      expect(result).toBeDefined()
      expect(result.data).toBeInstanceOf(Array)
      expect(result.total).toBeGreaterThan(0)
    })

    it('should return all active fees', async () => {
      const result = await getActiveSessionFees()
      
      expect(result.data.length).toBe(4)
    })

    it('should include partial payment fees', async () => {
      const result = await getActiveSessionFees()
      
      const partialFee = result.data.find(f => f.status === 'Partial')
      expect(partialFee).toBeDefined()
      expect(partialFee?.totalAmount).toBe(20000)
      expect(partialFee?.totalPaid).toBe(10000)
      expect(partialFee?.outstanding).toBe(10000)
    })

    it('should include unpaid fees', async () => {
      const result = await getActiveSessionFees()
      
      const unpaidFees = result.data.filter(f => f.status === 'Unpaid')
      expect(unpaidFees.length).toBeGreaterThan(0)
    })

    it('should include fully paid fees', async () => {
      const result = await getActiveSessionFees()
      
      const paidFee = result.data.find(f => f.status === 'Paid')
      expect(paidFee).toBeDefined()
      expect(paidFee?.outstanding).toBe(0)
    })
  })

  describe('getOtherSessionFees', () => {
    it('should return other session fees with pagination', async () => {
      const result = await getOtherSessionFees()
      
      expect(result).toBeDefined()
      expect(result.data).toBeInstanceOf(Array)
      expect(result.page).toBe(1)
      expect(result.totalPages).toBe(3)
    })

    it('should return historical fees', async () => {
      const result = await getOtherSessionFees()
      
      // Should include acceptance fee from 2020/2021
      const acceptanceFee = result.data.find(f => f.feesName === 'ACCEPTANCE FEE')
      expect(acceptanceFee).toBeDefined()
      expect(acceptanceFee?.session).toBe('2020/2021')
    })
  })

  describe('getPaymentStats', () => {
    it('should calculate correct payment stats', async () => {
      const stats = await getPaymentStats()
      
      // Total: 20000 + 8000 + 1500 + 188250 = 217750
      expect(stats.totalBill).toBe(217750)
      // Paid: 10000 + 0 + 1500 + 0 = 11500
      expect(stats.totalPayment).toBe(11500)
      // Outstanding: 10000 + 8000 + 0 + 188250 = 206250
      expect(stats.outstanding).toBe(206250)
    })

    it('should return wallet balance', async () => {
      const stats = await getPaymentStats()
      
      expect(stats.walletBalance).toBe(0)
    })
  })

  describe('getTransactions', () => {
    it('should return transaction history', async () => {
      const transactions = await getTransactions()
      
      expect(transactions).toBeDefined()
      expect(transactions).toBeInstanceOf(Array)
      expect(transactions.length).toBeGreaterThan(0)
    })

    it('should include transaction details', async () => {
      const transactions = await getTransactions()
      
      const firstTxn = transactions[0]
      expect(firstTxn.id).toBeDefined()
      expect(firstTxn.date).toBeDefined()
      expect(firstTxn.description).toBeDefined()
      expect(firstTxn.amount).toBeGreaterThan(0)
      expect(firstTxn.status).toBe('Success')
    })
  })

  describe('initiatePayment', () => {
    it('should return payment URL for valid fee', async () => {
      const result = await initiatePayment('fee-001')
      
      expect(result).toBeDefined()
      expect(result.url).toBeDefined()
    })

    it('should throw error for invalid fee', async () => {
      await expect(initiatePayment('invalid-fee')).rejects.toThrow('Payment not available for this fee')
    })

    it('should throw error for already paid fee', async () => {
      await expect(initiatePayment('fee-003')).rejects.toThrow('Payment not available for this fee')
    })
  })

  describe('formatCurrency', () => {
    it('should format currency in NGN', () => {
      const formatted = formatCurrency(10000)
      
      expect(formatted).toContain('10,000')
    })

    it('should format large amounts correctly', () => {
      const formatted = formatCurrency(217750)
      
      expect(formatted).toContain('217,750')
    })

    it('should handle zero', () => {
      const formatted = formatCurrency(0)
      
      expect(formatted).toContain('0')
    })
  })

  describe('formatNumber', () => {
    it('should format numbers with thousand separators', () => {
      const formatted = formatNumber(10000)
      
      expect(formatted).toBe('10,000')
    })

    it('should format large numbers', () => {
      const formatted = formatNumber(217750)
      
      expect(formatted).toBe('217,750')
    })
  })
})
