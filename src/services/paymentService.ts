/**
 * Payment Service
 * Handles all payment-related data operations
 */

import type {
  StudentInfo,
  PaymentRecord,
  PaymentStats,
  TransactionRecord,
  PaymentFilters,
} from '@/types/studentPayments'

// Mock student data (would come from database in production)
const mockStudentInfo: StudentInfo = {
  id: 'stu-001',
  matricNumber: '2005003013',
  regNumber: '22259597CF',
  firstName: 'Adeniyi Victor',
  lastName: 'Ayomide',
  fullName: 'ADENIYI VICTOR AYOMIDE',
  email: 'adeniyi.victor@students.avi.edu',
  faculty: 'ENGINEERING',
  department: 'ELECTRICAL & ELECTRONIC ENGINEERING',
  programme: 'B.Eng.ELECTRICAL & ELECTRONIC ENGINEERING',
  level: '500 LEVEL',
  status: 'Active',
  session: '2025/2026',
  semester: 'FIRST SEMESTER',
  entryMode: 'UTME',
  entryYear: '2020',
  profileImage: '/uploads/11015-d14efe5e-7045-42a4-9e53-0b597c3643c0_11zon-3.jpeg',
}

// Mock active session fees (from the HTML)
const mockActiveSessionFees: PaymentRecord[] = [
  {
    id: 'fee-001',
    feesName: 'EKSU SMART SCHOOL FEE (RETURNING STUDENTS)',
    feesDescription: 'EKSU SMART SCHOOL FEE (RETURNING STUDENTS)',
    session: '2025/2026',
    level: '',
    dueDate: null,
    totalAmount: 20000,
    totalPaid: 10000,
    outstanding: 10000,
    status: 'Partial',
    canPay: true,
    paymentLink: '#fees/pay_fees?cmlMcUU0bFpxNkhOcXAzMlA3d1dLdz09',
  },
  {
    id: 'fee-002',
    feesName: 'FACULTY DUE (RETURNING STUDENTS)',
    feesDescription: 'FACULTY DUE (RETURNING STUDENTS)',
    session: '2025/2026',
    level: '',
    dueDate: null,
    totalAmount: 8000,
    totalPaid: 0,
    outstanding: 8000,
    status: 'Unpaid',
    canPay: true,
    paymentLink: '#fees/pay_fees?TjJISXFVbmtsb0wxeUEwZVBWdkJlUT09',
  },
  {
    id: 'fee-003',
    feesName: 'SUG DUE II',
    feesDescription: 'STUDENT UNION GOVERNMENT DUE',
    session: '2025/2026',
    level: '',
    dueDate: null,
    totalAmount: 1500,
    totalPaid: 1500,
    outstanding: 0,
    status: 'Paid',
    canPay: false,
  },
  {
    id: 'fee-004',
    feesName: 'TUITION FEE (RETURNING STUDENTS)',
    feesDescription: 'TUITION FEE AND DEVELOPMENT CHARGES (RETURNING STUDENTS)',
    session: '2025/2026',
    level: '',
    dueDate: null,
    totalAmount: 188250,
    totalPaid: 0,
    outstanding: 188250,
    status: 'Unpaid',
    canPay: true,
    paymentLink: '#fees/pay_fees?NWk0S3VhT0pvK1FKZWJXaW1CMnR5QT09',
  },
]

// Mock other session fees
const mockOtherSessionFees: PaymentRecord[] = [
  {
    id: 'fee-005',
    feesName: 'ACCEPTANCE FEE',
    feesDescription: 'ACCEPTANCE FEE',
    session: '2020/2021',
    level: '',
    dueDate: null,
    totalAmount: 57000,
    totalPaid: 57000,
    outstanding: 0,
    status: 'Paid',
    canPay: false,
  },
  {
    id: 'fee-006',
    feesName: 'EKSU SMART SCHOOL FEE (FRESHERS)',
    feesDescription: 'EKSU SMART SCHOOL FEE (FRESHERS)',
    session: '2020/2021',
    level: '',
    dueDate: null,
    totalAmount: 11000,
    totalPaid: 11000,
    outstanding: 0,
    status: 'Paid',
    canPay: false,
  },
  {
    id: 'fee-007',
    feesName: 'EKSU SMART SCHOOL FEE (RETURNING STUDENTS)',
    feesDescription: 'EKSU SMART SCHOOL FEE (RETURNING STUDENTS)',
    session: '2021/2022',
    level: '',
    dueDate: null,
    totalAmount: 11000,
    totalPaid: 11000,
    outstanding: 0,
    status: 'Paid',
    canPay: false,
  },
  {
    id: 'fee-008',
    feesName: 'EKSU SMART SCHOOL FEE (RETURNING STUDENTS)',
    feesDescription: 'EKSU SMART SCHOOL FEE (RETURNING STUDENTS)',
    session: '2024/2025',
    level: '',
    dueDate: null,
    totalAmount: 20000,
    totalPaid: 20000,
    outstanding: 0,
    status: 'Paid',
    canPay: false,
  },
  {
    id: 'fee-009',
    feesName: 'EKSU SMART SCHOOL FEE (RETURNING STUDENTS)',
    feesDescription: 'EKSU SMART SCHOOL FEE (RETURNING STUDENTS)',
    session: '2022/2023',
    level: '',
    dueDate: null,
    totalAmount: 11000,
    totalPaid: 11000,
    outstanding: 0,
    status: 'Paid',
    canPay: false,
  },
  {
    id: 'fee-010',
    feesName: 'EKSU SMART SCHOOL FEE (RETURNING STUDENTS)',
    feesDescription: 'EKSU SMART SCHOOL FEE (RETURNING STUDENTS)',
    session: '2023/2024',
    level: '',
    dueDate: null,
    totalAmount: 5500,
    totalPaid: 5500,
    outstanding: 0,
    status: 'Paid',
    canPay: false,
  },
  {
    id: 'fee-011',
    feesName: 'FACULTY DUE (FRESH STUDENTS)',
    feesDescription: 'FACULTY DUE (FRESH STUDENTS)',
    session: '2020/2021',
    level: '',
    dueDate: null,
    totalAmount: 8000,
    totalPaid: 8000,
    outstanding: 0,
    status: 'Paid',
    canPay: false,
  },
  {
    id: 'fee-012',
    feesName: 'FACULTY DUE (RETURNING STUDENTS)',
    feesDescription: 'FACULTY DUE (RETURNING STUDENTS)',
    session: '2023/2024',
    level: '',
    dueDate: null,
    totalAmount: 8000,
    totalPaid: 8000,
    outstanding: 0,
    status: 'Paid',
    canPay: false,
  },
  {
    id: 'fee-013',
    feesName: 'FACULTY DUE (RETURNING STUDENTS)',
    feesDescription: 'FACULTY DUE (RETURNING STUDENTS)',
    session: '2021/2022',
    level: '',
    dueDate: null,
    totalAmount: 8000,
    totalPaid: 8000,
    outstanding: 0,
    status: 'Paid',
    canPay: false,
  },
  {
    id: 'fee-014',
    feesName: 'FACULTY DUE (RETURNING STUDENTS)',
    feesDescription: 'FACULTY DUE (RETURNING STUDENTS)',
    session: '2024/2025',
    level: '',
    dueDate: null,
    totalAmount: 8000,
    totalPaid: 0,
    outstanding: 8000,
    status: 'Unpaid',
    canPay: true,
    paymentLink: '#fees/pay_fees?d3pyUVVPWnNRb2NBYm5CVFBqSmNCZz09',
  },
]

// Mock transactions
const mockTransactions: TransactionRecord[] = [
  {
    id: 'txn-001',
    date: '2025-01-15',
    description: 'EKSU SMART SCHOOL FEE (RETURNING STUDENTS)',
    amount: 10000,
    type: 'Debit',
    reference: 'PAY/2025/001',
    status: 'Success',
  },
  {
    id: 'txn-002',
    date: '2025-01-10',
    description: 'SUG DUE II',
    amount: 1500,
    type: 'Debit',
    reference: 'PAY/2025/002',
    status: 'Success',
  },
  {
    id: 'txn-003',
    date: '2024-09-01',
    description: 'EKSU SMART SCHOOL FEE (RETURNING STUDENTS)',
    amount: 20000,
    type: 'Debit',
    reference: 'PAY/2024/045',
    status: 'Success',
  },
]

// Calculate stats from fees
function calculateStats(activeFees: PaymentRecord[]): PaymentStats {
  const totalBill = activeFees.reduce((sum, fee) => sum + fee.totalAmount, 0)
  const totalPayment = activeFees.reduce((sum, fee) => sum + fee.totalPaid, 0)
  const outstanding = activeFees.reduce((sum, fee) => sum + fee.outstanding, 0)

  return {
    walletBalance: 0,
    totalBill,
    totalPayment,
    outstanding,
  }
}

// Service functions
export async function getStudentInfo(): Promise<StudentInfo> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockStudentInfo
}

export async function getActiveSessionFees(
  _filters?: PaymentFilters
): Promise<{ data: PaymentRecord[]; total: number }> {
  await new Promise(resolve => setTimeout(resolve, 300))
  return {
    data: mockActiveSessionFees,
    total: mockActiveSessionFees.length,
  }
}

export async function getOtherSessionFees(
  _filters?: PaymentFilters
): Promise<{ data: PaymentRecord[]; total: number; page: number; totalPages: number }> {
  await new Promise(resolve => setTimeout(resolve, 300))
  return {
    data: mockOtherSessionFees,
    total: mockOtherSessionFees.length,
    page: 1,
    totalPages: 3,
  }
}

export async function getPaymentStats(): Promise<PaymentStats> {
  await new Promise(resolve => setTimeout(resolve, 200))
  return calculateStats(mockActiveSessionFees)
}

export async function getTransactions(): Promise<TransactionRecord[]> {
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockTransactions
}

export async function initiatePayment(feeId: string): Promise<{ url: string }> {
  await new Promise(resolve => setTimeout(resolve, 500))
  const fee = mockActiveSessionFees.find(f => f.id === feeId)
  if (!fee || !fee.canPay) {
    throw new Error('Payment not available for this fee')
  }
  return { url: fee.paymentLink || '#' }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-NG').format(num)
}

export function getPaymentTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    school_fees: 'School Fees',
    accommodation: 'Accommodation',
    registration: 'Registration Fee',
    examination: 'Examination Fee',
    library: 'Library Fee',
    other: 'Other',
  }
  return labels[type] || type
}
