// Types for the admissions application flow

export type AdmissionType = 'UNDERGRADUATE' | 'GRADUATE' | 'TRANSFER' | 'INTERNATIONAL'

export type ApplicationTerm = 
  | 'FALL_2025' 
  | 'SPRING_2026' 
  | 'SUMMER_2026' 
  | 'FALL_2026'

export type AdmissionStatus = 
  | 'DRAFT' 
  | 'SUBMITTED' 
  | 'UNDER_REVIEW' 
  | 'DOCUMENTS_REQUESTED'
  | 'ACCEPTED' 
  | 'REJECTED' 
  | 'WAITLISTED' 
  | 'DEFERRED' 
  | 'ENROLLED'

export interface ApplicationFormData {
  // User reference
  userId?: string
  
  // Application Type
  admissionType: AdmissionType
  applicationTerm: ApplicationTerm
  
  // Personal Information
  firstName: string
  lastName: string
  email: string
  phone?: string
  dateOfBirth?: string
  gender?: string
  
  // Address
  currentAddress?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  
  // Citizenship
  citizenship?: string
  isInternational: boolean
  
  // Academic Background - Undergraduate
  highSchoolName?: string
  highSchoolCountry?: string
  highSchoolGPA?: number
  satScore?: number
  actScore?: number
  
  // Academic Background - Graduate
  undergradSchool?: string
  undergradDegree?: string
  undergradMajor?: string
  undergradGPA?: number
  greScore?: number
  gmatScore?: number
  
  // Test Scores
  toeflScore?: number
  ieltsScore?: number
  
  // Program Selection
  programOfInterest?: string
  majorFirstChoice?: string
  majorSecondChoice?: string
  
  // Essay/Personal Statement
  essayTopic?: string
  essayContent?: string
  
  // Additional Information
  extracurriculars?: string
  workExperience?: string
  
  // Financial Aid
  requestFinancialAid: boolean
  scholarshipInterest: boolean
}

export const APPLICATION_TERMS: { value: ApplicationTerm; label: string }[] = [
  { value: 'FALL_2025', label: 'Fall 2025' },
  { value: 'SPRING_2026', label: 'Spring 2026' },
  { value: 'SUMMER_2026', label: 'Summer 2026' },
  { value: 'FALL_2026', label: 'Fall 2026' },
]

export const UNDERGRADUATE_MAJORS = [
  'Business Administration',
  'Computer Science',
  'Engineering',
  'Biology',
  'Psychology',
  'Economics',
  'Political Science',
  'Communications',
  'Mathematics',
  'English Literature',
  'History',
  'Physics',
  'Chemistry',
  'Pre-Med',
  'Arts & Design',
  'Education',
]

export const GRADUATE_PROGRAMS = [
  'Master of Business Administration (MBA)',
  'Master of Public Policy (MPP)',
  'Master of Arts in International Relations',
  'Master of Science in Data Science',
  'Master of Computer Science',
  'Doctorate in Clinical Psychology',
  'Juris Doctor (Law)',
  'Master of Engineering',
  'Master of Education',
  'Master of Public Health',
  'PhD in Economics',
  'Master of Fine Arts',
]
