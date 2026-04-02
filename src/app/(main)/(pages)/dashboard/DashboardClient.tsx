'use client'

import { 
  DashboardContainer,
  DashboardHeader,
  DashboardStatsGrid,
  DashboardSection,
  DashboardGrid,
  Badge,
  Button
} from '@/components/dashboard'
import { 
  BookOpen, 
  GraduationCap, 
  DollarSign, 
  Bell,
  Calendar,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Users,
  CreditCard,
  Library,
  ClipboardList,
  Clock3,
  Laptop,
  User
} from 'lucide-react'
import Link from 'next/link'
import { useDashboard } from '@/hooks/useDashboard'
import { motion } from 'framer-motion'
import { fadeInUp } from '@/animations'

const mapStatsToDisplay = (stats: { enrolledCourses: number; totalCredits: number; gpa: number; pendingPayments: number } | null) => {
  if (!stats) return []
  
  return [
    { label: 'Enrolled Courses', value: stats.enrolledCourses.toString(), icon: BookOpen, change: 'Current' },
    { label: 'Total Credits', value: stats.totalCredits.toString(), icon: GraduationCap, change: 'Spring 2026' },
    { label: 'GPA', value: stats.gpa.toFixed(2), icon: FileText, change: 'Out of 4.0' },
    { label: 'Pending Payments', value: stats.pendingPayments.toString(), icon: DollarSign, change: 'Due Soon' },
  ]
}

const getGradeColor = (grade: string) => {
  if (grade.startsWith('A')) return 'bg-green-500'
  if (grade.startsWith('B')) return 'bg-blue-500'
  if (grade.startsWith('C')) return 'bg-yellow-500'
  return 'bg-red-500'
}

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-green-500'
    case 'pending':
      return 'bg-yellow-500'
    case 'overdue':
      return 'bg-red-500'
    default:
      return 'bg-yellow-500'
  }
}

const getExamTypeColor = (type: string) => {
  switch (type) {
    case 'Final':
      return 'bg-red-500'
    case 'Midterm':
      return 'bg-yellow-500'
    case 'Quiz':
      return 'bg-blue-500'
    default:
      return 'bg-neutral-500'
  }
}

export function DashboardClient({ userId, userName }: { userId: string | null; userName?: string | null }) {
  const { stats, enrolledCourses, recentGrades, upcomingExams, payments, notifications, isLoading, error, refresh } = useDashboard(userId)
  
  const displayStats = mapStatsToDisplay(stats)

  if (isLoading) {
    return (
      <DashboardContainer>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-600"></div>
        </div>
      </DashboardContainer>
    )
  }

  if (error) {
    return (
      <DashboardContainer>
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">Error loading dashboard: {error}</p>
          <Button onClick={refresh}>Try Again</Button>
        </div>
      </DashboardContainer>
    )
  }

  const unreadNotifications = notifications.filter(n => !n.isRead).length

  return (
    <DashboardContainer>
      <motion.div variants={fadeInUp} initial="initial" animate="animate">
        <div className="flex items-center justify-between">
          <DashboardHeader 
            title={userName ? `Welcome back, ${userName}!` : "Welcome back!"} 
            description="Here's what's happening with your studies"
          />
          <Link 
            href="/student/notifications" 
            className="relative p-2 rounded-full bg-neutral-900 border border-neutral-800 hover:border-yellow-600 transition-colors"
          >
            <Bell className="w-6 h-6 text-neutral-400" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {unreadNotifications > 9 ? '9+' : unreadNotifications}
              </span>
            )}
          </Link>
        </div>

        <DashboardSection title="Your Stats">
          <DashboardStatsGrid stats={displayStats} />
        </DashboardSection>

        {/* Quick Actions */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Link href="/student/courses" className="flex flex-col items-center justify-center p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-yellow-600 hover:bg-neutral-800 transition-all group">
              <BookOpen className="w-8 h-8 text-yellow-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-neutral-300 text-center">Course Registration</span>
            </Link>
            <Link href="/student/fees" className="flex flex-col items-center justify-center p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-yellow-600 hover:bg-neutral-800 transition-all group">
              <CreditCard className="w-8 h-8 text-yellow-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-neutral-300 text-center">Pay Fees</span>
            </Link>
            <Link href="/student/grades" className="flex flex-col items-center justify-center p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-yellow-600 hover:bg-neutral-800 transition-all group">
              <ClipboardList className="w-8 h-8 text-yellow-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-neutral-300 text-center">View Grades</span>
            </Link>
            <Link href="/student/timetable" className="flex flex-col items-center justify-center p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-yellow-600 hover:bg-neutral-800 transition-all group">
              <Clock3 className="w-8 h-8 text-yellow-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-neutral-300 text-center">Timetable</span>
            </Link>
            <Link href="/student/exams" className="flex flex-col items-center justify-center p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-yellow-600 hover:bg-neutral-800 transition-all group">
              <FileText className="w-8 h-8 text-yellow-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-neutral-300 text-center">Exams</span>
            </Link>
            <Link href="/student/elearning" className="flex flex-col items-center justify-center p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-yellow-600 hover:bg-neutral-800 transition-all group">
              <Laptop className="w-8 h-8 text-yellow-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-neutral-300 text-center">E-Learning</span>
            </Link>
            <Link href="/student/library" className="flex flex-col items-center justify-center p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-yellow-600 hover:bg-neutral-800 transition-all group">
              <Library className="w-8 h-8 text-yellow-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-neutral-300 text-center">Library</span>
            </Link>
            <Link href="/student/profile" className="flex flex-col items-center justify-center p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-yellow-600 hover:bg-neutral-800 transition-all group">
              <User className="w-8 h-8 text-yellow-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-neutral-300 text-center">My Profile</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <DashboardSection title="Enrolled Courses">
            <DashboardGrid>
              {enrolledCourses.length === 0 ? (
                <p className="text-neutral-400 text-center py-8">No courses enrolled yet</p>
              ) : (
                enrolledCourses.slice(0, 4).map((course) => (
                  <div 
                    key={course.id} 
                    className="flex items-center justify-between p-4 rounded-lg bg-neutral-900 border border-neutral-800"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-yellow-600/20 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{course.code}</p>
                        <p className="text-sm text-neutral-400">{course.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={course.status === 'ENROLLED' ? 'bg-green-500' : 'bg-neutral-500'}>
                        {course.status}
                      </Badge>
                      <span className="text-sm text-neutral-500">{course.credits} credits</span>
                    </div>
                  </div>
                ))
              )}
              <Link 
                href="/courses" 
                className="flex items-center justify-center gap-2 p-3 rounded-lg border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
              >
                <span>View all courses</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </DashboardGrid>
          </DashboardSection>

          <DashboardSection title="Recent Grades">
            <DashboardGrid>
              {recentGrades.length === 0 ? (
                <p className="text-neutral-400 text-center py-8">No grades posted yet</p>
              ) : (
                recentGrades.slice(0, 4).map((grade) => (
                  <div 
                    key={grade.id} 
                    className="flex items-center justify-between p-4 rounded-lg bg-neutral-900 border border-neutral-800"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-600/20 flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{grade.courseCode}</p>
                        <p className="text-sm text-neutral-400">{grade.courseName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getGradeColor(grade.grade)}>
                        {grade.grade}
                      </Badge>
                      <p className="text-xs text-neutral-500 mt-1">{grade.semester}</p>
                    </div>
                  </div>
                ))
              )}
            </DashboardGrid>
          </DashboardSection>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <DashboardSection title="Fee Payment Status">
            <DashboardGrid>
              {payments.length === 0 ? (
                <p className="text-neutral-400 text-center py-8">No payment records</p>
              ) : (
                payments.slice(0, 4).map((payment) => (
                  <div 
                    key={payment.id} 
                    className="flex items-center justify-between p-4 rounded-lg bg-neutral-900 border border-neutral-800"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
                        {payment.status === 'paid' ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : payment.status === 'overdue' ? (
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-yellow-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">{payment.description}</p>
                        <p className="text-sm text-neutral-400">${payment.amount.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getPaymentStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                      <p className="text-xs text-neutral-500 mt-1">
                        {payment.paidAt ? `Paid: ${payment.paidAt}` : `Due: ${payment.dueDate}`}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <Link 
                href="/billing" 
                className="flex items-center justify-center gap-2 p-3 rounded-lg border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
              >
                <span>View payment details</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </DashboardGrid>
          </DashboardSection>

          <DashboardSection title="Upcoming Exams">
            <DashboardGrid>
              {upcomingExams.length === 0 ? (
                <p className="text-neutral-400 text-center py-8">No upcoming exams</p>
              ) : (
                upcomingExams.slice(0, 4).map((exam) => (
                  <div 
                    key={exam.id} 
                    className="flex items-center justify-between p-4 rounded-lg bg-neutral-900 border border-neutral-800"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{exam.courseCode}</p>
                        <p className="text-sm text-neutral-400">{exam.courseName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getExamTypeColor(exam.type)}>
                        {exam.type}
                      </Badge>
                      <p className="text-xs text-neutral-500 mt-1">{exam.date} at {exam.time}</p>
                      <p className="text-xs text-neutral-500">{exam.venue}</p>
                    </div>
                  </div>
                ))
              )}
            </DashboardGrid>
          </DashboardSection>
        </div>

        <div className="flex items-center justify-between mt-6 mb-4">
          <h3 className="text-lg font-semibold text-white">Notifications</h3>
          <Link href="/student/notifications" className="text-sm text-yellow-600 hover:text-yellow-500 flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <DashboardSection title="">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notifications.length === 0 ? (
              <p className="text-neutral-400 text-center py-8 col-span-3">No notifications</p>
            ) : (
              notifications.slice(0, 6).map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 rounded-lg border transition-colors ${
                    notification.isRead 
                      ? 'bg-neutral-900 border-neutral-800' 
                      : 'bg-neutral-800 border-yellow-600/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-yellow-600" />
                      <h4 className="font-medium text-white text-sm">{notification.title}</h4>
                    </div>
                    {!notification.isRead && (
                      <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-400 mb-2">{notification.message}</p>
                  <p className="text-xs text-neutral-500">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
          {unreadNotifications > 0 && (
            <div className="mt-4 text-center">
              <span className="text-yellow-600 text-sm">{unreadNotifications} unread notification{unreadNotifications !== 1 ? 's' : ''}</span>
            </div>
          )}
        </DashboardSection>
      </motion.div>
    </DashboardContainer>
  )
}
