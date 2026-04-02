/**
 * Student Dashboard Types
 * 
 * Defines types for the student dashboard components
 */

export interface StudentInfo {
  matricNumber: string
  regNumber: string
  firstName: string
  lastName: string
  email: string
  faculty: string
  department: string
  programme: string
  level: number
  status: 'Active' | 'Inactive' | 'Suspended'
  session: string
  semester: string
  entryMode: string
  entryYear: number
  profileImage?: string
}

export interface UnitStats {
  maximumUnit: number
  registeredUnit: number
  unusedUnit: number
  compulsoryUnit: number
  requiredUnit: number
  electiveUnit: number
}

export interface FeeInfo {
  totalBill: number
  totalPayment: number
  totalOutstanding: number
}

export interface DashboardTab {
  id: string
  label: string
  icon: string
  content: React.ReactNode
}

export interface Notification {
  id: string
  title: string
  message: string
  timestamp: Date
  read: boolean
}

export interface CourseRegistration {
  id: string
  code: string
  name: string
  unit: number
  semester: string
  session: string
}

export interface TimetableEntry {
  id: string
  courseCode: string
  courseName: string
  day: string
  time: string
  venue: string
}

export interface PollItem {
  id: string
  title: string
  description: string
  startDate: Date
  endDate: Date
  isActive: boolean
}
