/**
 * Admission Types
 * Purpose: Define data contracts for admission form data flow
 * 
 * Data Flow: Database → Service → Hook → Component
 */

export type ApplicationTerm = 'Fall 2025' | 'Spring 2026' | 'Summer 2026' | 'Fall 2026'

export type Gender = 'Male' | 'Female' | 'Non-binary' | 'Prefer not to say'

export interface UndergraduateFormData {
  // Application Term
  applicationTerm: string
  
  // Personal Information
  firstName: string
  lastName: string
  email: string
  phone?: string
  dateOfBirth?: string
  gender?: string
  
  // Address
  city?: string
  state?: string
  country?: string
  
  // Citizenship
  citizenship?: string
  isInternational: boolean
  
  // High School Information
  highSchoolName: string
  highSchoolCountry: string
  highSchoolGPA?: number
  
  // Test Scores (optional)
  satScore?: number
  actScore?: number
  
  // Program Selection
  majorFirstChoice: string
  majorSecondChoice?: string
  
  // Test Scores - English
  toeflScore?: number
  ieltsScore?: number
  
  // Essay
  essayContent: string
  
  // Additional Information
  extracurriculars?: string
  
  // Financial Aid
  requestFinancialAid: boolean
  scholarshipInterest: boolean
}

export interface AdmissionApplication {
  id?: number
  type: 'undergraduate' | 'graduate'
  data: UndergraduateFormData
  userId: string
  status: 'pending' | 'submitted' | 'reviewing' | 'accepted' | 'rejected'
  submittedAt?: Date
}

export const APPLICATION_TERMS = [
  { value: 'Fall 2025', label: 'Fall 2025' },
  { value: 'Spring 2026', label: 'Spring 2026' },
  { value: 'Summer 2026', label: 'Summer 2026' },
  { value: 'Fall 2026', label: 'Fall 2026' },
]

export const UNDERGRADUATE_MAJORS = [
  { value: 'computer-science', label: 'Computer Science' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'business', label: 'Business Administration' },
  { value: 'psychology', label: 'Psychology' },
  { value: 'biology', label: 'Biology' },
  { value: 'chemistry', label: 'Chemistry' },
  { value: 'physics', label: 'Physics' },
  { value: 'mathematics', label: 'Mathematics' },
  { value: 'economics', label: 'Economics' },
  { value: 'communication', label: 'Communication' },
  { value: 'english', label: 'English' },
  { value: 'history', label: 'History' },
  { value: 'political-science', label: 'Political Science' },
  { value: 'art', label: 'Art' },
  { value: 'music', label: 'Music' },
  { value: 'theatre', label: 'Theatre' },
  { value: 'nursing', label: 'Nursing' },
  { value: 'pre-med', label: 'Pre-Medicine' },
  { value: 'education', label: 'Education' },
  { value: 'undecided', label: 'Undecided' },
]

export const COUNTRIES = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'JP', label: 'Japan' },
  { value: 'CN', label: 'China' },
  { value: 'IN', label: 'India' },
  { value: 'BR', label: 'Brazil' },
  { value: 'MX', label: 'Mexico' },
  { value: 'OTHER', label: 'Other' },
]
