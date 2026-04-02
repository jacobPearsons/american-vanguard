/**
 * Admission Service
 * Purpose: Handle all data access for admission forms
 * 
 * Data Flow: Database → Service → Hook → Component
 * 
 * Rules (per docs):
 * - Services handle API communication
 * - Components only consume results
 * - No fetch logic inside UI files
 */

import type { UndergraduateFormData, AdmissionApplication } from '@/types/admission'
import type { GraduateFormValues } from '@/types/graduateForm'

/**
 * API response for application submission
 */
export interface SubmitApplicationResponse {
  message: string
  application?: {
    id: number
    admissionType: string
    status: string
    submissionDate?: Date
  }
}

/**
 * Submit undergraduate application
 * 
 * @param data - Form data from undergraduate application
 * @param userId - Clerk user ID
 * @returns Promise<SubmitApplicationResponse> - Submission result
 * 
 * Architecture:
 * - Calls API endpoint
 * - Returns typed response
 * - Handles errors gracefully
 */
export const submitUndergraduateApplication = async (
  data: UndergraduateFormData,
  userId: string
): Promise<SubmitApplicationResponse> => {
  try {
    const response = await fetch('/api/admissions/apply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'undergraduate',
        data,
        userId,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to submit application')
    }

    return await response.json()
  } catch (error) {
    console.error('Error submitting application:', error)
    throw error
  }
}

export const submitGraduateApplication = async (
  data: GraduateFormValues,
  userId: string
): Promise<SubmitApplicationResponse> => {
  try {
    const response = await fetch('/api/admissions/apply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'graduate',
        data,
        userId,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to submit application')
    }

    return await response.json()
  } catch (error) {
    console.error('Error submitting graduate application:', error)
    throw error
  }
}

/**
 * Validate undergraduate application data
 * 
 * @param data - Form data to validate
 * @returns Promise<{ valid: boolean; errors: string[] }>
 */
export const validateApplication = async (
  data: UndergraduateFormData
): Promise<{ valid: boolean; errors: string[] }> => {
  const errors: string[] = []

  // Required fields validation
  if (!data.applicationTerm) {
    errors.push('Please select an application term')
  }

  if (!data.firstName || data.firstName.length < 2) {
    errors.push('First name must be at least 2 characters')
  }

  if (!data.lastName || data.lastName.length < 2) {
    errors.push('Last name must be at least 2 characters')
  }

  if (!data.email || !data.email.includes('@')) {
    errors.push('Please enter a valid email')
  }

  if (!data.city) {
    errors.push('City is required')
  }

  if (!data.state) {
    errors.push('State is required')
  }

  if (!data.country) {
    errors.push('Country is required')
  }

  if (!data.highSchoolName) {
    errors.push('High school name is required')
  }

  if (!data.highSchoolCountry) {
    errors.push('High school country is required')
  }

  if (!data.majorFirstChoice) {
    errors.push('Please select your first choice major')
  }

  if (!data.essayContent || data.essayContent.length < 100) {
    errors.push('Please write at least 100 characters about yourself')
  }

  if (data.essayContent && data.essayContent.length > 5000) {
    errors.push('Essay must be less than 5000 characters')
  }

  // SAT score validation
  if (data.satScore && (data.satScore < 400 || data.satScore > 1600)) {
    errors.push('SAT score must be between 400 and 1600')
  }

  // ACT score validation
  if (data.actScore && (data.actScore < 1 || data.actScore > 36)) {
    errors.push('ACT score must be between 1 and 36')
  }

  // TOEFL score validation
  if (data.toeflScore && (data.toeflScore < 0 || data.toeflScore > 120)) {
    errors.push('TOEFL score must be between 0 and 120')
  }

  // IELTS score validation
  if (data.ieltsScore && (data.ieltsScore < 0 || data.ieltsScore > 9)) {
    errors.push('IELTS score must be between 0 and 9')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Get application status
 * 
 * @param applicationId - Application ID
 * @returns Promise<AdmissionApplication | null>
 */
export const getApplicationStatus = async (
  applicationId: string
): Promise<AdmissionApplication | null> => {
  try {
    const response = await fetch(`/api/admissions/${applicationId}`)
    
    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching application status:', error)
    return null
  }
}
