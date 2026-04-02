/**
 * Profile Service
 * Purpose: Handle all data access for profile management
 * 
 * Data Flow: Database → Service → Hook → Component
 * 
 * Rules (per docs):
 * - Services handle API communication
 * - Components only consume results
 * - No fetch logic inside UI files
 */

import type { ProfileFormData, ProfileSubmitResult } from '@/types/profile'

/**
 * Submit profile data
 * 
 * @param data - Form data from profile page
 * @returns Promise<ProfileSubmitResult>
 * 
 * Architecture:
 * - Calls API endpoint
 * - Returns typed response
 * - Handles errors gracefully
 */
export const submitProfileData = async (
  data: ProfileFormData
): Promise<ProfileSubmitResult> => {
  try {
    const response = await fetch('/api/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        error: error.message || 'Failed to submit profile'
      }
    }

    return {
      success: true,
      message: 'Profile updated successfully'
    }
  } catch (error) {
    console.error('Error submitting profile:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit profile'
    }
  }
}

/**
 * Get profile data
 * 
 * @returns Promise<ProfileFormData | null>
 */
export const getProfileData = async (): Promise<ProfileFormData | null> => {
  try {
    const response = await fetch('/api/profile')
    
    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching profile:', error)
    return null
  }
}

/**
 * Validate profile data
 * 
 * @param data - Profile data to validate
 * @returns { valid: boolean; errors: string[] }
 */
export const validateProfileData = (
  data: ProfileFormData
): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  // Required fields
  if (!data.profile.firstName) {
    errors.push('First name is required')
  }
  if (!data.profile.lastName) {
    errors.push('Last name is required')
  }
  if (!data.profile.email) {
    errors.push('Email is required')
  }
  if (!data.profile.summary || data.profile.summary.length < 50) {
    errors.push('Professional summary must be at least 50 characters')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
