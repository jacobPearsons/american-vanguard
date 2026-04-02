/**
 * Dashboard Types
 * Purpose: Define data contracts for dashboard data flow
 * 
 * Data Flow: Database → Service → Hook → Component
 */

export interface DashboardStats {
  enrolledCourses: number
  totalCredits: number
  gpa: number
  pendingPayments: number
}

export interface EnrolledCourse {
  id: number
  code: string
  name: string
  credits: number
  department: string
  instructor: string
  status: 'ENROLLED' | 'DROPPED' | 'COMPLETED'
  semester: string
}

export interface Grade {
  id: number
  courseCode: string
  courseName: string
  score: number
  grade: string
  semester: string
  academicYear: string
}

export interface Exam {
  id: number
  courseCode: string
  courseName: string
  date: string
  time: string
  venue: string
  type: 'Midterm' | 'Final' | 'Quiz'
}

export interface PaymentStatus {
  id: number | string
  amount: number
  description: string
  status: 'pending' | 'paid' | 'overdue'
  dueDate: string
  paidAt: string | null
}

export interface DashboardNotification {
  id: number | string
  title: string
  message: string
  type: 'ADMISSION_RECEIVED' | 'ADMISSION_ACCEPTED' | 'ADMISSION_REJECTED' | 'ADMISSION_WAITLISTED' | 'DOCUMENT_REQUESTED' | 'INTERVIEW_SCHEDULED' | 'DECISION_MADE' | 'ENROLLMENT_DEADLINE' | 'PROFILE_VIEWED' | 'MESSAGE' | 'ENGLISH_TEST_INVITE'
  isRead: boolean
  createdAt: string
}

export interface DashboardData {
  user: {
    id: string | number
    name: string | null
    email: string
  } | null
  stats: DashboardStats
  enrolledCourses: EnrolledCourse[]
  recentGrades: Grade[]
  upcomingExams: Exam[]
  payments: PaymentStatus[]
  notifications: DashboardNotification[]
}

export interface DashboardStatsResponse {
  label: string
  value: string
  icon: string
  change: string
}
