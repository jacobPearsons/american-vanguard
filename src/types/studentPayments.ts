/**
 * Student Payments Types
 * Defines all types related to student fees and payments
 */

export interface StudentInfo {
  id: string
  matricNumber: string
  regNumber: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  faculty: string
  department: string
  programme: string
  level: string
  status: 'Active' | 'Inactive' | 'Graduated' | 'Suspended'
  session: string
  semester: string
  entryMode: string
  entryYear: string
  profileImage?: string
}

export interface PaymentRecord {
  id: string
  feesName: string
  feesDescription: string
  session: string
  level: string
  dueDate: string | null
  totalAmount: number
  totalPaid: number
  outstanding: number
  status: 'Paid' | 'Partial' | 'Unpaid'
  canPay: boolean
  paymentLink?: string
}

export interface PaymentStats {
  walletBalance: number
  totalBill: number
  totalPayment: number
  outstanding: number
}

export interface TransactionRecord {
  id: string
  date: string
  description: string
  amount: number
  type: 'Credit' | 'Debit'
  reference: string
  status: 'Success' | 'Pending' | 'Failed'
}

export interface FeesPayment {
  id: string
  studentId: string
  feesId: string
  amount: number
  paymentDate: string
  transactionRef: string
  status: 'Completed' | 'Pending' | 'Failed'
}

export interface PaymentTab {
  id: string
  label: string
  icon: string
  active: boolean
}

export interface PaymentFilters {
  perPage: number
  searchQuery: string
  session?: string
  semester?: string
}

export interface PaymentTableColumn {
  key: keyof PaymentRecord | 'action'
  label: string
  sortable?: boolean
  width?: string
}

export type PaymentStatus = 'Paid' | 'Partial' | 'Unpaid'

export interface PaymentState {
  activeSessionFees: PaymentRecord[]
  otherSessionFees: PaymentRecord[]
  transactions: TransactionRecord[]
  stats: PaymentStats
  studentInfo: StudentInfo | null
  loading: boolean
  error: string | null
  activeTab: 'payment' | 'transactions'
  filters: PaymentFilters
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
  }
}
