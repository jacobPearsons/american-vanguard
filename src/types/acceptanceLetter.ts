/**
 * Acceptance Letter Types
 * Purpose: Define data structures for acceptance letter PDF generation
 */

import { AdmissionType, ApplicationTerm } from './prisma'

/**
 * Acceptance letter data structure
 */
export interface AcceptanceLetterData {
  // Student Information
  studentName: string
  firstName: string
  lastName: string
  email: string
  
  // Application Details
  applicationId: number
  admissionType: AdmissionType
  applicationTerm: ApplicationTerm
  programOfInterest: string
  majorFirstChoice: string
  majorSecondChoice?: string
  
  // Acceptance Details
  acceptanceDate: Date
  enrollmentDeadline: Date
  responseRequiredBy: Date
  
  // Academic Info (if available)
  gpa?: number
  testScores?: {
    sat?: number
    act?: number
    gre?: number
    gmat?: number
  }
  
  // Financial Aid (if applicable)
  scholarshipAmount?: number
  scholarshipType?: string
  financialAidOffered?: boolean
  tuitionAmount?: number
  
  // Institution Details
  institutionName: string
  institutionAbbr: string
  institutionAddress: string
  city: string
  state: string
  zipCode: string
  country: string
  
  // Dean/Administrator
  deanName: string
  deanTitle: string
  
  // Additional
  studentId?: string
  backgroundCheckCompleted?: boolean
}

/**
 * PDF Generation Options
 */
export interface AcceptanceLetterOptions {
  includeFinancialDetails: boolean
  includeTestScores: boolean
  includeBackgroundCheckStatus: boolean
  generateAsHtml?: boolean
}

/**
 * Default acceptance letter options
 */
export const DEFAULT_ACCEPTANCE_LETTER_OPTIONS: AcceptanceLetterOptions = {
  includeFinancialDetails: true,
  includeTestScores: true,
  includeBackgroundCheckStatus: true,
  generateAsHtml: false,
}

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format date for display
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Get admission type display name
 */
export const getAdmissionTypeDisplay = (type: AdmissionType): string => {
  const typeMap: Record<AdmissionType, string> = {
    UNDERGRADUATE: 'Undergraduate',
    GRADUATE: 'Graduate',
    TRANSFER: 'Transfer',
    INTERNATIONAL: 'International',
    CERTIFICATE: 'Certificate',
    ONLINE: 'Online',
  }
  return typeMap[type] || type
}

/**
 * Get application term display name
 */
export const getApplicationTermDisplay = (term: ApplicationTerm): string => {
  const termMap: Record<ApplicationTerm, string> = {
    FALL_2025: 'Fall 2025',
    SPRING_2026: 'Spring 2026',
    SUMMER_2026: 'Summer 2026',
    FALL_2026: 'Fall 2026',
    SPRING_2027: 'Spring 2027',
  }
  return termMap[term] || term
}
