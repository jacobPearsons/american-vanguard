/**
 * Dashboard Service
 * Purpose: Handle all data access for dashboard feature
 * 
 * Data Flow: Database → Service → Hook → Component
 * 
 * Rules (per docs):
 * - Services handle API communication
 * - Components only consume results
 * - No fetch logic inside UI files
 */

import { db } from '@/lib/db'
import type { 
  DashboardData, 
  DashboardStats, 
  EnrolledCourse, 
  Grade, 
  Exam,
  PaymentStatus,
  DashboardNotification
} from '@/types/dashboard'

const MOCK_STATS: DashboardStats = {
  enrolledCourses: 4,
  totalCredits: 15,
  gpa: 3.75,
  pendingPayments: 2,
}

const MOCK_COURSES: EnrolledCourse[] = [
  { id: 1, code: 'CS301', name: 'Data Structures', credits: 3, department: 'Computer Science', instructor: 'Dr. Smith', status: 'ENROLLED', semester: 'Spring 2026' },
  { id: 2, code: 'CS302', name: 'Algorithms', credits: 3, department: 'Computer Science', instructor: 'Dr. Johnson', status: 'ENROLLED', semester: 'Spring 2026' },
  { id: 3, code: 'MATH201', name: 'Linear Algebra', credits: 3, department: 'Mathematics', instructor: 'Prof. Williams', status: 'ENROLLED', semester: 'Spring 2026' },
  { id: 4, code: 'ENG101', name: 'Technical Writing', credits: 3, department: 'English', instructor: 'Prof. Davis', status: 'ENROLLED', semester: 'Spring 2026' },
]

const MOCK_GRADES: Grade[] = [
  { id: 1, courseCode: 'CS201', courseName: 'Introduction to Programming', score: 92, grade: 'A', semester: 'Fall 2025', academicYear: '2025-2026' },
  { id: 2, courseCode: 'MATH101', courseName: 'Calculus I', score: 88, grade: 'B+', semester: 'Fall 2025', academicYear: '2025-2026' },
  { id: 3, courseCode: 'PHY101', courseName: 'Physics I', score: 85, grade: 'B', semester: 'Fall 2025', academicYear: '2025-2026' },
]

const MOCK_EXAMS: Exam[] = [
  { id: 1, courseCode: 'CS301', courseName: 'Data Structures', date: '2026-04-15', time: '09:00 AM', venue: 'Hall A', type: 'Midterm' },
  { id: 2, courseCode: 'CS302', courseName: 'Algorithms', date: '2026-04-18', time: '02:00 PM', venue: 'Hall B', type: 'Midterm' },
  { id: 3, courseCode: 'MATH201', courseName: 'Linear Algebra', date: '2026-04-20', time: '10:00 AM', venue: 'Hall C', type: 'Final' },
]

const MOCK_PAYMENTS: PaymentStatus[] = [
  { id: 1, amount: 5000, description: 'Tuition Fee - Spring 2026', status: 'pending', dueDate: '2026-02-15', paidAt: null },
  { id: 2, amount: 1500, description: 'Accommodation Fee', status: 'pending', dueDate: '2026-02-20', paidAt: null },
  { id: 3, amount: 5000, description: 'Tuition Fee - Fall 2025', status: 'paid', dueDate: '2025-08-15', paidAt: '2025-08-10' },
]

const MOCK_NOTIFICATIONS: DashboardNotification[] = [
  { id: 1, title: 'Registration Open', message: 'Course registration for Spring 2026 is now open.', type: 'MESSAGE', isRead: false, createdAt: '2026-01-15T10:00:00Z' },
  { id: 2, title: 'Payment Reminder', message: 'Your tuition payment is due in 5 days.', type: 'ENROLLMENT_DEADLINE', isRead: false, createdAt: '2026-01-14T08:00:00Z' },
  { id: 3, title: 'Grade Posted', message: 'Your grade for CS201 has been posted.', type: 'DECISION_MADE', isRead: true, createdAt: '2026-01-10T14:00:00Z' },
]

/**
 * Fetch dashboard data for the current user
 * 
 * @param userId - The Clerk user ID (passed from client component)
 * @returns Promise<DashboardData> - Complete dashboard data
 * 
 * Architecture:
 * - Calls database through Prisma
 * - Returns typed data structure
 * - Handles errors gracefully
 */
export const getDashboardData = async (userId: string | null): Promise<DashboardData> => {
  try {
    if (!userId) {
      return {
        user: null,
        stats: MOCK_STATS,
        enrolledCourses: MOCK_COURSES,
        recentGrades: MOCK_GRADES,
        upcomingExams: MOCK_EXAMS,
        payments: MOCK_PAYMENTS,
        notifications: MOCK_NOTIFICATIONS,
      }
    }
    
    let dbUser = null
    try {
      dbUser = await db.user.findFirst({
        where: {
          clerkId: userId,
        },
      })
      
      if (!dbUser) {
        dbUser = await db.user.create({
          data: {
            clerkId: userId,
            email: 'user@example.com',
            name: 'User',
            tier: 'Free',
            credits: '10',
          },
        })
      }

      const currentSemester = 'Spring 2026'
      const currentYear = '2025-2026'

      const registrations = await db.studentRegistration.findMany({
        where: {
          studentId: userId,
          semester: currentSemester,
          academicYear: currentYear,
          status: 'ENROLLED',
        },
        include: {
          course: {
            include: {
              department: true,
              instructor: true,
            },
          },
        },
      })

      const enrolledCourses: EnrolledCourse[] = registrations.map((reg: any) => ({
        id: reg.course?.id || reg.course?._id,
        code: reg.course?.code,
        name: reg.course?.name,
        credits: reg.course?.credits,
        department: reg.course?.department?.name || 'N/A',
        instructor: reg.course?.instructor 
          ? `${reg.course.instructor.firstName} ${reg.course.instructor.lastName}`
          : 'TBA',
        status: reg.status,
        semester: reg.semester,
      }))

      const grades = await db.grade.findMany({
        where: {
          studentId: userId,
        },
        include: {
          course: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
      })

      const recentGrades: Grade[] = grades.map((g: any) => ({
        id: g.course?.id || g.course?._id || '0',
        courseCode: g.course?.code || 'N/A',
        courseName: g.course?.name || 'N/A',
        score: g.score,
        grade: g.grade,
        semester: g.semester,
        academicYear: g.academicYear,
      }))

      const totalCredits = enrolledCourses.reduce((sum, c) => sum + c.credits, 0)
      const validGrades = grades.filter((g) => g.score !== null)
      const gpa = validGrades.length > 0
        ? validGrades.reduce((sum, g) => sum + g.score, 0) / validGrades.length / 25
        : 0

      const payments = await db.payment.findMany({
        where: {
          studentId: userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
      })

      const paymentStatuses: PaymentStatus[] = payments.map((p: any) => ({
        id: p.id || p._id || '0',
        amount: p.amount,
        description: p.description || 'Payment',
        status: p.status as 'pending' | 'paid' | 'overdue',
        dueDate: p.createdAt?.toISOString().split('T')[0] || '',
        paidAt: p.paidAt?.toISOString() ?? null,
      }))

      const pendingPayments = paymentStatuses.filter((p) => p.status === 'pending').length

      const notifications = await db.notification.findMany({
        where: {
          userId: userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
      })

      const dashboardNotifications: DashboardNotification[] = notifications.map((n: any) => ({
        id: n.id || n._id || '0',
        title: n.title,
        message: n.message,
        type: n.type,
        isRead: n.isRead,
        createdAt: n.createdAt.toISOString(),
      }))

      return {
        user: {
          id: (dbUser as any).id || (dbUser as any)._id,
          name: dbUser.name || null,
          email: dbUser.email,
        },
        stats: {
          enrolledCourses: enrolledCourses.length,
          totalCredits,
          gpa: Math.round(gpa * 100) / 100,
          pendingPayments,
        },
        enrolledCourses,
        recentGrades,
        upcomingExams: MOCK_EXAMS,
        payments: paymentStatuses,
        notifications: dashboardNotifications,
      }
    } catch (dbError) {
      console.log('Database not available, using mock data')
    }
    
    return {
      user: dbUser ? {
        id: (dbUser as any).id || (dbUser as any)._id || userId,
        name: dbUser.name || null,
        email: dbUser.email,
      } : {
        id: userId,
        name: 'User',
        email: 'user@example.com',
      },
      stats: MOCK_STATS,
      enrolledCourses: MOCK_COURSES,
      recentGrades: MOCK_GRADES,
      upcomingExams: MOCK_EXAMS,
      payments: MOCK_PAYMENTS,
      notifications: MOCK_NOTIFICATIONS,
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return {
      user: null,
      stats: MOCK_STATS,
      enrolledCourses: MOCK_COURSES,
      recentGrades: MOCK_GRADES,
      upcomingExams: MOCK_EXAMS,
      payments: MOCK_PAYMENTS,
      notifications: MOCK_NOTIFICATIONS,
    }
  }
}

/**
 * Get user's profile statistics
 * 
 * @returns Promise<DashboardStats> - User statistics
 */
export const getUserStats = async (userId: string | null = null) => {
  const data = await getDashboardData(userId)
  return data.stats
}

/**
 * Get enrolled courses
 * 
 * @returns Promise<EnrolledCourse[]> - List of enrolled courses
 */
export const getEnrolledCourses = async (userId: string | null = null) => {
  const data = await getDashboardData(userId)
  return data.enrolledCourses
}

/**
 * Get recent grades
 * 
 * @returns Promise<Grade[]> - List of recent grades
 */
export const getRecentGrades = async (userId: string | null = null) => {
  const data = await getDashboardData(userId)
  return data.recentGrades
}

/**
 * Get upcoming exams
 * 
 * @returns Promise<Exam[]> - List of upcoming exams
 */
export const getUpcomingExams = async (userId: string | null = null) => {
  const data = await getDashboardData(userId)
  return data.upcomingExams
}

/**
 * Get payment statuses
 * 
 * @returns Promise<PaymentStatus[]> - List of payment statuses
 */
export const getPaymentStatuses = async (userId: string | null = null) => {
  const data = await getDashboardData(userId)
  return data.payments
}

/**
 * Get notifications
 * 
 * @returns Promise<DashboardNotification[]> - List of notifications
 */
export const getNotifications = async (userId: string | null = null) => {
  const data = await getDashboardData(userId)
  return data.notifications
}
