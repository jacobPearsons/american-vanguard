/**
 * Student Dashboard Page
 * 
 * Main student dashboard page with all components
 * Following component design rules from docs/component-design-rules.md
 */

'use client'

import React, { useState } from 'react'
import {
  StudentInfoCard,
  StatsWidget,
  DashboardTabs,
  StudentSidebar,
  defaultNavItems,
  CourseRegistrationTab,
  ElectionTab,
  TimetableTab,
  NotificationsTab,
  QuickLinksWidget,
  DeadlinesWidget,
  AnnouncementsPreview,
  QuickStatsWidget,
} from '@/components/features/student-dashboard'
import { GradesView } from '@/components/dashboard/GradesView'
import SupportChat from '@/components/features/SupportChat'
import type { StudentInfo, UnitStats, FeeInfo, DashboardTab } from '@/types/studentDashboard'

// Mock data - in production, this would come from an API or server component
const mockStudentInfo: StudentInfo = {
  matricNumber: '2005003013',
  regNumber: '22259597CF',
  firstName: 'Adeniyi Victor',
  lastName: 'Ayomide',
  email: 'adeniyi.victor@example.com',
  faculty: 'Engineering',
  department: 'Electrical & Electronic Engineering',
  programme: 'B.Eng. Electrical & Electronic Engineering',
  level: 500,
  status: 'Active',
  session: '2025/2026',
  semester: 'FIRST SEMESTER',
  entryMode: 'UTME',
  entryYear: 2020,
  profileImage: '../uploads/11015-d14efe5e-7045-42a4-9e53-0b597c3643c0_11zon-3.jpeg',
}

const mockUnitStats: UnitStats = {
  maximumUnit: 28,
  registeredUnit: 0,
  unusedUnit: 28,
  compulsoryUnit: 0,
  requiredUnit: 0,
  electiveUnit: 0,
}

const mockFeeInfo: FeeInfo = {
  totalBill: 1392000,
  totalPayment: 896375,
  totalOutstanding: 495625,
}

const mockCourses = [
  { code: 'EEE 501', name: 'Advanced Power Systems', unit: 3 },
  { code: 'EEE 503', name: 'Digital Signal Processing', unit: 3 },
  { code: 'EEE 505', name: 'Control Systems II', unit: 3 },
  { code: 'EEE 507', name: 'Microelectronics', unit: 3 },
]

const mockPolls = [
  { title: 'Student Union Election 2025', description: 'Vote for your next student union representative', isActive: true },
]

const mockTimetable = [
  { courseCode: 'EEE 501', courseName: 'Advanced Power Systems', day: 'Monday', time: '9:00 - 11:00', venue: 'LT 1' },
  { courseCode: 'EEE 503', courseName: 'Digital Signal Processing', day: 'Tuesday', time: '11:00 - 13:00', venue: 'LT 2' },
  { courseCode: 'EEE 505', courseName: 'Control Systems II', day: 'Wednesday', time: '14:00 - 16:00', venue: 'LT 1' },
]

const mockNotifications = [
  { title: 'Welcome', message: 'Welcome back to the portal!', timestamp: new Date(), read: false },
  { title: 'Course Registration', message: 'Course registration is now open', timestamp: new Date(), read: true },
]

export default function StudentDashboardPage() {
  const [activeNav, setActiveNav] = useState('dashboard')

  const dashboardTabs: DashboardTab[] = [
    {
      id: 'registration',
      label: 'My Registration',
      icon: '📱',
      content: <CourseRegistrationTab courses={mockCourses} />,
    },
    {
      id: 'grades',
      label: 'Grades',
      icon: '📊',
      content: <GradesView />,
    },
    {
      id: 'election',
      label: 'Online Election',
      icon: '🎁',
      content: <ElectionTab polls={mockPolls} />,
    },
    {
      id: 'timetable',
      label: 'Lecture Timetable',
      icon: '📅',
      content: <TimetableTab entries={mockTimetable} />,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: '🔔',
      content: <NotificationsTab notifications={mockNotifications} />,
    },
  ]

  const handleLogout = () => {
    // Handle logout logic
    window.location.href = '?logout=1'
  }

  const handleEditProfile = () => {
    window.location.href = '#profile/edit_biodata'
  }

  const handleChangePassword = () => {
    window.location.href = '#profile/change_password'
  }

  const handleNavigate = (item: { id: string; href?: string }) => {
    setActiveNav(item.id)
    if (item.href) {
      window.location.href = item.href
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full z-50">
        <StudentSidebar
          items={defaultNavItems}
          logoSrc="../images/newllogo.png"
          studentName={`${mockStudentInfo.firstName} ${mockStudentInfo.lastName}`}
          studentImage={mockStudentInfo.profileImage}
          activeItem={activeNav}
          onNavigate={handleNavigate}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            <span className="mr-2">🏠</span>
            Dashboard
            <span className="ml-3 text-sm font-normal text-green-600 bg-green-100 px-3 py-1 rounded">
              Welcome Back {mockStudentInfo.firstName}!
            </span>
          </h1>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Student Info */}
          <div className="lg:col-span-1 space-y-6">
            <StudentInfoCard
              student={mockStudentInfo}
              onLogout={handleLogout}
              onEditProfile={handleEditProfile}
              onChangePassword={handleChangePassword}
            />
            <QuickStatsWidget />
          </div>

          {/* Right Column - Widgets & Tabs */}
          <div className="lg:col-span-3 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <QuickLinksWidget />
              <DeadlinesWidget />
            </div>
            <AnnouncementsPreview />
            <StatsWidget unitStats={mockUnitStats} feeInfo={mockFeeInfo} />
            <DashboardTabs tabs={dashboardTabs} defaultTab="registration" />
          </div>
        </div>
      </div>
      <SupportChat />
    </div>
  )
}
