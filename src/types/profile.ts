/**
 * Profile Types
 * Purpose: Define data contracts for profile data flow
 * 
 * Data Flow: Database → Service → Hook → Component
 */

export interface ProfileData {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  address: string
  city: string
  country: string
  nationality: string
  jobTitle: string
  summary: string
  skills: string[]
  experienceYears: number
  expectedSalary: string
  remoteWork: boolean
  relocate: boolean
}

export interface Resume {
  name: string
  size: number
  uploaded: boolean
  url: string | null
}

export interface EnglishTest {
  hasTakenTest: boolean
  score: number
  level: string
  testDate: Date | null
}

export interface ProfileFormData {
  profile: ProfileData
  resume: Resume | null
  englishTest: EnglishTest
}

export interface ProfileSubmitResult {
  success: boolean
  message?: string
  error?: string
}

export interface TestQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: string
  category: string
}
