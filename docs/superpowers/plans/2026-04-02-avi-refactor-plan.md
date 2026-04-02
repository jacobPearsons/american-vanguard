# Comprehensive Code Quality Refactor - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve code quality by addressing theme consistency, component modularization, database layer improvements, and shared component creation.

**Architecture:** Phased approach - starting with quick wins (theme), moving to component splits, then database modularization, and finally shared components. Each phase is self-contained and can be tested independently.

**Tech Stack:** Next.js 14, Tailwind CSS, MongoDB/Mongoose, React

---

## Phase 1: Admin Theme Consistency

### Task 1.1: Create AdminLayout Component

**Files:**
- Create: `src/components/admin/AdminLayout.tsx`
- Modify: `src/app/admin/announcements/page.tsx`
- Modify: `src/app/admin/courses/page.tsx`
- Modify: `src/app/admin/exams/page.tsx`
- Modify: `src/app/admin/grades/page.tsx`

- [ ] **Step 1: Create AdminLayout component**

```typescript
// src/components/admin/AdminLayout.tsx
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Search, Filter } from 'lucide-react'

interface AdminLayoutProps {
  title: string
  description: string
  children: React.ReactNode
  actions?: React.ReactNode
}

export function AdminLayout({ 
  title, 
  description, 
  children, 
  actions 
}: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            <p className="text-neutral-400">{description}</p>
          </div>
          {actions}
        </div>
        {children}
      </div>
    </div>
  )
}

export function AdminCard({ 
  title, 
  children, 
  className = '' 
}: { 
  title?: string
  children: React.ReactNode
  className?: string 
}) {
  return (
    <Card className={`bg-neutral-900 border-neutral-800 ${className}`}>
      {title && (
        <CardHeader>
          <CardTitle className="text-lg text-white">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  )
}

export function AdminStats({ stats }: { stats: { label: string; value: number | string; color?: string }[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, i) => (
        <AdminCard key={i}>
          <div className="flex justify-between items-center">
            <span className="text-sm text-neutral-400">{stat.label}</span>
            <span className={`text-sm font-medium ${stat.color || 'text-white'}`}>
              {stat.value}
            </span>
          </div>
        </AdminCard>
      ))}
    </div>
  )
}

export function AdminSearchFilter({ 
  searchQuery, 
  onSearchChange,
  filterType,
  onFilterChange,
  filterOptions
}: {
  searchQuery: string
  onSearchChange: (value: string) => void
  filterType: string
  onFilterChange: (value: string) => void
  filterOptions: { value: string; label: string }[]
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:ring-2 focus:ring-yellow-600"
        />
      </div>
      <select
        value={filterType}
        onChange={(e) => onFilterChange(e.target.value)}
        className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white"
      >
        {filterOptions.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}
```

- [ ] **Step 2: Create admin components index**

```typescript
// src/components/admin/index.ts
export * from './AdminLayout'
```

- [ ] **Step 3: Update announcements page**

```typescript
// src/app/admin/announcements/page.tsx - Simplified version
'use client'

import React, { useState } from 'react'
import { AdminLayout, AdminCard, AdminStats, AdminSearchFilter } from '@/components/admin'
import { Bell, Plus, Edit, Trash2, Pin } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Announcement {
  id: number
  title: string
  content: string
  type: 'GENERAL' | 'DEPARTMENT' | 'DEADLINE'
  isPinned: boolean
  isActive: boolean
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    { id: 1, title: 'Second Semester Registration Opens', content: 'Course registration is now open.', type: 'DEADLINE', isPinned: true, isActive: true },
    { id: 2, title: 'Library Hours Extended', content: 'Main library will operate extended hours.', type: 'GENERAL', isPinned: false, isActive: true },
  ])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')

  const filteredAnnouncements = announcements.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || a.type === filterType
    return matchesSearch && matchesType
  })

  const stats = [
    { label: 'Total', value: announcements.length },
    { label: 'Active', value: announcements.filter(a => a.isActive).length, color: 'text-green-400' },
    { label: 'Pinned', value: announcements.filter(a => a.isPinned).length, color: 'text-yellow-400' },
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'DEADLINE': return 'bg-red-500/20 text-red-400'
      case 'DEPARTMENT': return 'bg-yellow-500/20 text-yellow-400'
      default: return 'bg-neutral-500/20 text-neutral-400'
    }
  }

  return (
    <AdminLayout
      title="Announcements Management"
      description="Create and manage student announcements"
      actions={
        <Button className="bg-yellow-600 hover:bg-yellow-700 gap-2">
          <Plus className="w-4 h-4" /> New Announcement
        </Button>
      }
    >
      <AdminStats stats={stats} />
      
      <AdminCard>
        <AdminSearchFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterType={filterType}
          onFilterChange={setFilterType}
          filterOptions={[
            { value: 'all', label: 'All Types' },
            { value: 'GENERAL', label: 'General' },
            { value: 'DEPARTMENT', label: 'Department' },
            { value: 'DEADLINE', label: 'Deadline' },
          ]}
        />
      </AdminCard>

      <div className="space-y-4">
        {filteredAnnouncements.map((announcement) => (
          <AdminCard key={announcement.id}>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {announcement.isPinned && <Pin className="w-4 h-4 text-yellow-500" />}
                  <h3 className="font-semibold text-white">{announcement.title}</h3>
                </div>
                <p className="text-sm text-neutral-400 mb-2">{announcement.content}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(announcement.type)}`}>
                  {announcement.type}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-neutral-400 hover:text-yellow-600">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-neutral-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </AdminCard>
        ))}
      </div>
    </AdminLayout>
  )
}
```

- [ ] **Step 4: Commit Phase 1**

```bash
git add src/components/admin/ src/app/admin/announcements/
git commit -m "refactor(admin): Add AdminLayout and update announcements page with dark theme"
```

---

## Phase 2: Dashboard Component Split

### Task 2.1: Create Dashboard Sub-Components

**Files:**
- Create: `src/components/dashboard/QuickActions.tsx`
- Create: `src/components/dashboard/EnrolledCoursesList.tsx`
- Create: `src/components/dashboard/RecentGradesList.tsx`
- Create: `src/components/dashboard/PaymentStatusList.tsx`
- Create: `src/components/dashboard/UpcomingExamsList.tsx`
- Create: `src/components/dashboard/NotificationGrid.tsx`
- Create: `src/components/dashboard/StatsDisplay.tsx`
- Modify: `src/components/dashboard/DashboardClient.tsx`
- Modify: `src/components/dashboard/index.ts`

- [ ] **Step 1: Create StatsDisplay component**

```typescript
// src/components/dashboard/StatsDisplay.tsx
import { DashboardSection, DashboardStatsGrid } from '@/components/dashboard'
import { BookOpen, GraduationCap, DollarSign, FileText } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface StatItem {
  label: string
  value: string
  icon: LucideIcon
  change: string
}

interface StatsDisplayProps {
  stats: StatItem[]
}

export function StatsDisplay({ stats }: StatsDisplayProps) {
  return (
    <DashboardSection title="Your Stats">
      <DashboardStatsGrid stats={stats} />
    </DashboardSection>
  )
}
```

- [ ] **Step 2: Create QuickActions component**

```typescript
// src/components/dashboard/QuickActions.tsx
import Link from 'next/link'
import { BookOpen, CreditCard, ClipboardList, Clock3, FileText, Laptop, Library, User } from 'lucide-react'

const quickActions = [
  { href: '/student/courses', icon: BookOpen, label: 'Course Registration' },
  { href: '/student/fees', icon: CreditCard, label: 'Pay Fees' },
  { href: '/student/grades', icon: ClipboardList, label: 'View Grades' },
  { href: '/student/timetable', icon: Clock3, label: 'Timetable' },
  { href: '/student/exams', icon: FileText, label: 'Exams' },
  { href: '/student/elearning', icon: Laptop, label: 'E-Learning' },
  { href: '/student/library', icon: Library, label: 'Library' },
  { href: '/student/profile', icon: User, label: 'My Profile' },
]

export function QuickActions() {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-yellow-600 hover:bg-neutral-800 transition-all group"
          >
            <action.icon className="w-8 h-8 text-yellow-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm text-neutral-300 text-center">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create EnrolledCoursesList component**

```typescript
// src/components/dashboard/EnrolledCoursesList.tsx
import { DashboardSection, DashboardGrid } from '@/components/dashboard'
import { Badge } from '@/components/ui/badge'
import { BookOpen, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { EnrolledCourse } from '@/types/dashboard'

interface EnrolledCoursesListProps {
  courses: EnrolledCourse[]
}

export function EnrolledCoursesList({ courses }: EnrolledCoursesListProps) {
  return (
    <DashboardSection title="Enrolled Courses">
      <DashboardGrid>
        {courses.length === 0 ? (
          <p className="text-neutral-400 text-center py-8">No courses enrolled yet</p>
        ) : (
          courses.slice(0, 4).map((course) => (
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
  )
}
```

- [ ] **Step 4: Create RecentGradesList component**

```typescript
// src/components/dashboard/RecentGradesList.tsx
import { DashboardSection, DashboardGrid } from '@/components/dashboard'
import { Badge } from '@/components/ui/badge'
import { GraduationCap } from 'lucide-react'
import type { Grade } from '@/types/dashboard'

interface RecentGradesListProps {
  grades: Grade[]
}

const getGradeColor = (grade: string) => {
  if (grade.startsWith('A')) return 'bg-green-500'
  if (grade.startsWith('B')) return 'bg-blue-500'
  if (grade.startsWith('C')) return 'bg-yellow-500'
  return 'bg-red-500'
}

export function RecentGradesList({ grades }: RecentGradesListProps) {
  return (
    <DashboardSection title="Recent Grades">
      <DashboardGrid>
        {grades.length === 0 ? (
          <p className="text-neutral-400 text-center py-8">No grades posted yet</p>
        ) : (
          grades.slice(0, 4).map((grade) => (
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
  )
}
```

- [ ] **Step 5: Create PaymentStatusList component**

```typescript
// src/components/dashboard/PaymentStatusList.tsx
import { DashboardSection, DashboardGrid } from '@/components/dashboard'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, AlertCircle, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { PaymentStatus } from '@/types/dashboard'

interface PaymentStatusListProps {
  payments: PaymentStatus[]
}

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case 'paid': return 'bg-green-500'
    case 'pending': return 'bg-yellow-500'
    case 'overdue': return 'bg-red-500'
    default: return 'bg-yellow-500'
  }
}

const PaymentIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'paid': return <CheckCircle className="w-5 h-5 text-green-600" />
    case 'overdue': return <AlertCircle className="w-5 h-5 text-red-600" />
    default: return <Clock className="w-5 h-5 text-yellow-600" />
  }
}

export function PaymentStatusList({ payments }: PaymentStatusListProps) {
  return (
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
                  <PaymentIcon status={payment.status} />
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
  )
}
```

- [ ] **Step 6: Create UpcomingExamsList component**

```typescript
// src/components/dashboard/UpcomingExamsList.tsx
import { DashboardSection, DashboardGrid } from '@/components/dashboard'
import { Badge } from '@/components/ui/badge'
import { Calendar } from 'lucide-react'
import type { Exam } from '@/types/dashboard'

interface UpcomingExamsListProps {
  exams: Exam[]
}

const getExamTypeColor = (type: string) => {
  switch (type) {
    case 'Final': return 'bg-red-500'
    case 'Midterm': return 'bg-yellow-500'
    case 'Quiz': return 'bg-blue-500'
    default: return 'bg-neutral-500'
  }
}

export function UpcomingExamsList({ exams }: UpcomingExamsListProps) {
  return (
    <DashboardSection title="Upcoming Exams">
      <DashboardGrid>
        {exams.length === 0 ? (
          <p className="text-neutral-400 text-center py-8">No upcoming exams</p>
        ) : (
          exams.slice(0, 4).map((exam) => (
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
  )
}
```

- [ ] **Step 7: Create NotificationGrid component**

```typescript
// src/components/dashboard/NotificationGrid.tsx
import { DashboardSection } from '@/components/dashboard'
import { Bell, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { DashboardNotification } from '@/types/dashboard'

interface NotificationGridProps {
  notifications: DashboardNotification[]
  unreadCount: number
}

export function NotificationGrid({ notifications, unreadCount }: NotificationGridProps) {
  return (
    <>
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
        {unreadCount > 0 && (
          <div className="mt-4 text-center">
            <span className="text-yellow-600 text-sm">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</span>
          </div>
        )}
      </DashboardSection>
    </>
  )
}
```

- [ ] **Step 8: Update DashboardClient to use sub-components**

```typescript
// src/components/dashboard/DashboardClient.tsx - Refactored
'use client'

import { DashboardContainer, DashboardHeader } from '@/components/dashboard'
import { Bell } from 'lucide-react'
import Link from 'next/link'
import { useDashboard } from '@/hooks/useDashboard'
import { motion } from 'framer-motion'
import { fadeInUp } from '@/animations'
import { Button } from '@/components/ui/button'
import { StatsDisplay } from './StatsDisplay'
import { QuickActions } from './QuickActions'
import { EnrolledCoursesList } from './EnrolledCoursesList'
import { RecentGradesList } from './RecentGradesList'
import { PaymentStatusList } from './PaymentStatusList'
import { UpcomingExamsList } from './UpcomingExamsList'
import { NotificationGrid } from './NotificationGrid'
import { BookOpen, GraduationCap, DollarSign, FileText } from 'lucide-react'

const mapStatsToDisplay = (stats: { enrolledCourses: number; totalCredits: number; gpa: number; pendingPayments: number } | null) => {
  if (!stats) return []
  
  return [
    { label: 'Enrolled Courses', value: stats.enrolledCourses.toString(), icon: BookOpen, change: 'Current' },
    { label: 'Total Credits', value: stats.totalCredits.toString(), icon: GraduationCap, change: 'Spring 2026' },
    { label: 'GPA', value: stats.gpa.toFixed(2), icon: FileText, change: 'Out of 4.0' },
    { label: 'Pending Payments', value: stats.pendingPayments.toString(), icon: DollarSign, change: 'Due Soon' },
  ]
}

export function DashboardClient({ userId, userName }: { userId: string | null; userName?: string | null }) {
  const { stats, enrolledCourses, recentGrades, upcomingExams, payments, notifications, isLoading, error, refresh } = useDashboard(userId)
  
  const displayStats = mapStatsToDisplay(stats)
  const unreadNotifications = notifications.filter(n => !n.isRead).length

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

        <StatsDisplay stats={displayStats} />
        <QuickActions />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <EnrolledCoursesList courses={enrolledCourses} />
          <RecentGradesList grades={recentGrades} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <PaymentStatusList payments={payments} />
          <UpcomingExamsList exams={upcomingExams} />
        </div>

        <NotificationGrid notifications={notifications} unreadCount={unreadNotifications} />
      </motion.div>
    </DashboardContainer>
  )
}
```

- [ ] **Step 9: Update dashboard index exports**

```typescript
// src/components/dashboard/index.ts - Add new exports
export * from './dashboard-container'
export * from './dashboard-header'
export * from './dashboard-section'
export * from './dashboard-grid'
export * from './dashboard-stats-grid'
export * from './QuickActions'
export * from './StatsDisplay'
export * from './EnrolledCoursesList'
export * from './RecentGradesList'
export * from './PaymentStatusList'
export * from './UpcomingExamsList'
export * from './NotificationGrid'
```

- [ ] **Step 10: Commit Phase 2**

```bash
git add src/components/dashboard/
git commit -m "refactor(dashboard): Split DashboardClient into focused sub-components"
```

---

## Phase 3: Database Layer Modularization

### Task 3.1: Create Database Directory Structure

**Files:**
- Create: `src/lib/db/connection.ts`
- Create: `src/lib/db/users.ts`
- Create: `src/lib/db/admissions.ts`
- Create: `src/lib/db/courses.ts`
- Create: `src/lib/db/grades.ts`
- Create: `src/lib/db/payments.ts`
- Create: `src/lib/db/notifications.ts`
- Create: `src/lib/db/faculty.ts`
- Create: `src/lib/db/departments.ts`
- Create: `src/lib/db/registrations.ts`
- Create: `src/lib/db/announcements.ts`
- Create: `src/lib/db/programs.ts`
- Create: `src/lib/db/utils.ts`
- Create: `src/lib/db/index.ts`
- Delete: `src/lib/db.ts`

- [ ] **Step 1: Create connection.ts**

```typescript
// src/lib/db/connection.ts
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/avi'

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

let cached: MongooseCache = { conn: null, promise: null }

export async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }
    cached.promise = mongoose.connect(MONGODB_URI, opts)
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export { mongoose }
```

- [ ] **Step 2: Create utils.ts**

```typescript
// src/lib/db/utils.ts
export function convertPrismaOperators(where: any): any {
  if (!where || typeof where !== 'object') return where

  const converted: any = {}
  for (const key of Object.keys(where)) {
    const value = where[key]
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      if (value.in !== undefined) converted[key] = { $in: value.in }
      else if (value.notIn !== undefined) converted[key] = { $nin: value.notIn }
      else if (value.gte !== undefined) converted[key] = { $gte: value.gte }
      else if (value.lte !== undefined) converted[key] = { $lte: value.lte }
      else if (value.gt !== undefined) converted[key] = { $gt: value.gt }
      else if (value.lt !== undefined) converted[key] = { $lt: value.lt }
      else if (value.contains !== undefined) converted[key] = { $regex: value.contains, $options: 'i' }
      else if (value.startsWith !== undefined) converted[key] = { $regex: `^${value.startsWith}`, $options: 'i' }
      else if (value.endsWith !== undefined) converted[key] = { $regex: `${value.endsWith}$`, $options: 'i' }
      else if (value.equals !== undefined) converted[key] = value.equals
      else if (value.not !== undefined) converted[key] = { $ne: value.not }
      else converted[key] = convertPrismaOperators(value)
    } else {
      converted[key] = value
    }
  }
  return converted
}

export function handleQuery(query: any) {
  const result: any = {}
  if (query.where) result.where = convertPrismaOperators(query.where)
  if (query.select) result.select = query.select
  if (query.orderBy) result.orderBy = query.orderBy
  if (query.include) result.include = query.include
  return result
}

export function transformResult(doc: any): any {
  if (!doc) return doc
  if (doc._id) doc.id = doc._id.toString()
  return doc
}

export function transformResults(docs: any[]): any[] {
  return docs.map(transformResult)
}

export async function applyInclude(modelQuery: any, include: any) {
  if (!include) return modelQuery
  
  const populate: string[] = []
  for (const key of Object.keys(include)) {
    if (include[key] === true) {
      populate.push(key)
    } else if (typeof include[key] === 'object') {
      populate.push({ path: key, ...include[key] })
    }
  }
  
  if (populate.length > 0) {
    return modelQuery.populate(populate)
  }
  return modelQuery
}

export function parseOrderBy(orderBy: any) {
  if (!orderBy) return undefined
  const sortField = Object.keys(orderBy)[0]
  const sortOrder = Object.values(orderBy)[0] === 'desc' ? -1 : 1
  return { [sortField]: sortOrder }
}
```

- [ ] **Step 3: Create users.ts**

```typescript
// src/lib/db/users.ts
import { handleQuery, parseOrderBy } from './utils'

async function getUserModel() {
  const mod = await import('../models/User')
  return mod.User || mod.default
}

export const users = {
  findUnique: async (query: { where: { clerkId: string } }) => {
    const User = await getUserModel()
    return User.findOne(query.where)
  },
  findFirst: async (query: any) => {
    const User = await getUserModel()
    const q = handleQuery(query)
    return User.findOne(q.where)
  },
  findMany: async (query: any) => {
    const User = await getUserModel()
    const q = handleQuery(query)
    let builder = User.find(q.where || {})
    if (q.orderBy) builder = builder.sort(parseOrderBy(q.orderBy))
    return builder
  },
  create: async (data: any) => {
    const User = await getUserModel()
    return User.create(data)
  },
  update: async (query: { where: { clerkId: string }; data: any }) => {
    const User = await getUserModel()
    return User.findOneAndUpdate(query.where, query.data, { new: true })
  },
  upsert: async (query: { where: { clerkId: string }; create: any; update: any }) => {
    const User = await getUserModel()
    return User.findOneAndUpdate(query.where, query.update, { new: true, upsert: true })
  },
}
```

- [ ] **Step 4: Create admissions.ts**

```typescript
// src/lib/db/admissions.ts
import { handleQuery, parseOrderBy } from './utils'

async function getModel() {
  const mod = await import('../models/AdmissionApplication')
  return mod.AdmissionApplication || mod.default
}

export const admissions = {
  findFirst: async (query: any) => {
    const Model = await getModel()
    const q = handleQuery(query)
    let builder = Model.findOne(q.where || {})
    if (q.select) builder = builder.select(q.select)
    if (q.orderBy) builder = builder.sort(parseOrderBy(q.orderBy))
    const results = await builder.limit(1)
    return results[0] || null
  },
  findMany: async (query: any) => {
    const Model = await getModel()
    const q = handleQuery(query)
    let builder = Model.find(q.where || {})
    if (q.orderBy) builder = builder.sort(parseOrderBy(q.orderBy))
    return builder
  },
  create: async (data: any) => {
    const Model = await getModel()
    return Model.create(data)
  },
  update: async (query: { where: any; data: any }) => {
    const Model = await getModel()
    return Model.findOneAndUpdate(query.where, query.data, { new: true })
  },
  findUnique: async (query: { where: { id: number } }) => {
    const Model = await getModel()
    return Model.findOne(query.where)
  },
}
```

- [ ] **Step 5: Create courses.ts**

```typescript
// src/lib/db/courses.ts
import { handleQuery, parseOrderBy, applyInclude } from './utils'

async function getModel() {
  const mod = await import('../models/Course')
  return mod.Course || mod.default
}

export const courses = {
  findFirst: async (query: any) => {
    const Model = await getModel()
    const q = handleQuery(query)
    let result = Model.findOne(q.where)
    result = await applyInclude(result, q.include)
    return result
  },
  findUnique: async (query: { where: { id: number }; include?: any }) => {
    const Model = await getModel()
    let result = Model.findOne(query.where)
    result = await applyInclude(result, query.include)
    return result
  },
  findMany: async (query: any) => {
    const Model = await getModel()
    const q = handleQuery(query)
    let result = Model.find(q.where || {})
    if (q.orderBy) result = result.sort(parseOrderBy(q.orderBy))
    result = await applyInclude(result, q.include)
    return result
  },
  create: async (data: any) => {
    const Model = await getModel()
    return Model.create(data)
  },
  update: async (query: { where: any; data: any }) => {
    const Model = await getModel()
    return Model.findOneAndUpdate(query.where, query.data, { new: true })
  },
  delete: async (query: { where: any }) => {
    const Model = await getModel()
    return Model.deleteOne(query.where)
  },
}
```

- [ ] **Step 6: Create grades.ts**

```typescript
// src/lib/db/grades.ts
import { handleQuery, parseOrderBy, applyInclude } from './utils'

async function getModel() {
  const mod = await import('../models/Grade')
  return mod.Grade || mod.default
}

export const grades = {
  findFirst: async (query: any) => {
    const Model = await getModel()
    const q = handleQuery(query)
    let result = Model.findOne(q.where)
    result = await applyInclude(result, q.include)
    return result
  },
  findMany: async (query: any) => {
    const Model = await getModel()
    const q = handleQuery(query)
    let result = Model.find(q.where || {})
    if (q.orderBy) result = result.sort(parseOrderBy(q.orderBy))
    result = await applyInclude(result, q.include)
    return result
  },
  create: async (data: any) => {
    const Model = await getModel()
    return Model.create(data)
  },
  update: async (query: { where: any; data: any }) => {
    const Model = await getModel()
    return Model.findOneAndUpdate(query.where, query.data, { new: true })
  },
  delete: async (query: { where: any }) => {
    const Model = await getModel()
    return Model.deleteOne(query.where)
  },
}
```

- [ ] **Step 7: Create payments.ts**

```typescript
// src/lib/db/payments.ts
import { handleQuery, parseOrderBy } from './utils'

async function getModel() {
  const mod = await import('../models/Payment')
  return mod.Payment || mod.default
}

export const payments = {
  findMany: async (query: any) => {
    const Model = await getModel()
    const q = handleQuery(query)
    return Model.find(q.where || {})
  },
  create: async (data: any) => {
    const Model = await getModel()
    return Model.create(data)
  },
  update: async (query: { where: any; data: any }) => {
    const Model = await getModel()
    return Model.findOneAndUpdate(query.where, query.data, { new: true })
  },
  updateMany: async (query: { where: any; data: any }) => {
    const Model = await getModel()
    return Model.updateMany(query.where, query.data)
  },
}
```

- [ ] **Step 8: Create notifications.ts**

```typescript
// src/lib/db/notifications.ts
import { handleQuery } from './utils'

async function getModel() {
  const mod = await import('../models/Notification')
  return mod.Notification || mod.default
}

export const notifications = {
  findFirst: async (query: any) => {
    const Model = await getModel()
    const q = handleQuery(query)
    return Model.findOne(q.where)
  },
  findMany: async (query: any) => {
    const Model = await getModel()
    const q = handleQuery(query)
    return Model.find(q.where || {})
  },
  create: async (data: any) => {
    const Model = await getModel()
    return Model.create(data)
  },
  update: async (query: { where: any; data: any }) => {
    const Model = await getModel()
    return Model.findOneAndUpdate(query.where, query.data, { new: true })
  },
  delete: async (query: { where: any }) => {
    const Model = await getModel()
    return Model.deleteOne(query.where)
  },
}
```

- [ ] **Step 9: Create faculty.ts, departments.ts, registrations.ts, announcements.ts, programs.ts**
(These follow the same pattern as above)

- [ ] **Step 10: Create index.ts**

```typescript
// src/lib/db/index.ts
export { connectDB, mongoose } from './connection'
export * from './utils'

import { users } from './users'
import { admissions } from './admissions'
import { courses } from './courses'
import { grades } from './grades'
import { payments } from './payments'
import { notifications } from './notifications'
import { faculty } from './faculty'
import { departments } from './departments'
import { registrations } from './registrations'
import { announcements } from './announcements'
import { programs } from './programs'

export const db = {
  user: users,
  admissionApplication: admissions,
  course: courses,
  grade: grades,
  payment: payments,
  notification: notifications,
  faculty,
  department: departments,
  studentRegistration: registrations,
  announcement: announcements,
  program: programs,
}
```

- [ ] **Step 11: Update imports in dashboardService.ts**

```typescript
// Update import in src/services/dashboardService.ts
// FROM: import { db } from '@/lib/db'
// TO: import { db } from '@/lib/db'
```

- [ ] **Step 12: Delete old db.ts**

```bash
rm src/lib/db.ts
```

- [ ] **Step 13: Commit Phase 3**

```bash
git add src/lib/db/
git rm src/lib/db.ts
git commit -m "refactor(db): Split monolithic db.ts into modular files"
```

---

## Phase 4: Shared Admin Components

### Task 4.1: Create Shared Admin Components

**Files:**
- Create: `src/components/admin/AdminTable.tsx`
- Create: `src/components/admin/AdminModal.tsx`
- Create: `src/components/admin/AdminHeader.tsx`
- Modify: `src/components/admin/index.ts`

- [ ] **Step 1: Create AdminTable component**

```typescript
// src/components/admin/AdminTable.tsx
import React from 'react'

interface Column<T> {
  key: keyof T | string
  label: string
  render?: (item: T) => React.ReactNode
}

interface AdminTableProps<T> {
  data: T[]
  columns: Column<T>[]
  onRowClick?: (item: T) => void
}

export function AdminTable<T extends { id: string | number }>({ 
  data, 
  columns, 
  onRowClick 
}: AdminTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-neutral-800">
            {columns.map((col) => (
              <th key={String(col.key)} className="text-left py-3 px-4 text-sm font-medium text-neutral-400">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr 
              key={item.id}
              onClick={() => onRowClick?.(item)}
              className={`border-b border-neutral-800 ${onRowClick ? 'cursor-pointer hover:bg-neutral-800' : ''}`}
            >
              {columns.map((col) => (
                <td key={String(col.key)} className="py-3 px-4 text-white">
                  {col.render ? col.render(item) : String((item as any)[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

- [ ] **Step 2: Create AdminModal component**

```typescript
// src/components/admin/AdminModal.tsx
'use client'

import React from 'react'
import { X } from 'lucide-react'

interface AdminModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function AdminModal({ open, onClose, title, children }: AdminModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-lg w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create AdminHeader component**

```typescript
// src/components/admin/AdminHeader.tsx
import React from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface AdminHeaderProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function AdminHeader({ 
  title, 
  description, 
  actionLabel,
  onAction 
}: AdminHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <p className="text-neutral-400">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="bg-yellow-600 hover:bg-yellow-700 gap-2">
          <Plus className="w-4 h-4" /> {actionLabel}
        </Button>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Update admin index**

```typescript
// src/components/admin/index.ts
export * from './AdminLayout'
export * from './AdminTable'
export * from './AdminModal'
export * from './AdminHeader'
```

- [ ] **Step 5: Commit Phase 4**

```bash
git add src/components/admin/
git commit -m "refactor(admin): Add shared AdminTable, AdminModal, and AdminHeader components"
```

---

## Final Verification

- [ ] Run `npm run lint` to check for linting errors
- [ ] Run `npm run build` to verify build passes
- [ ] Run `npm test` to ensure all tests pass
- [ ] Manual testing of admin pages and dashboard

---

**Plan created:** 2026-04-02
**Based on:** docs/superpowers/specs/2026-04-02-avi-refactor-design.md
