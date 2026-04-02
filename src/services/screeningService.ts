/**
 * Screening Service
 * Purpose: Handle resume screening data operations
 * 
 * Data Flow: API → Service → Hook → UI Component
 * 
 * Rules (per docs):
 * - Services handle all data access
 * - Components never call APIs directly
 * - Always handle errors gracefully
 */

import type { 
  ScreeningRecord, 
  ScreeningStatus, 
  ScreeningSummary,
  ScreeningActionResult,
  ScreeningEvaluation,
  ScreeningCriteria
} from '@/types/screening'
import { DEFAULT_SCREENING_CRITERIA } from '@/types/screening'

// Mock data store for demo
let mockScreenings: ScreeningRecord[] = [
  {
    id: '1',
    applicationId: 'app-001',
    candidateName: 'John Smith',
    candidateEmail: 'john@example.com',
    jobTitle: 'Senior Software Engineer',
    resumeUrl: '/resumes/john-smith.pdf',
    status: 'pending',
    score: null,
    notes: '',
    reviewedBy: null,
    reviewedAt: null,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    applicationId: 'app-002',
    candidateName: 'Sarah Johnson',
    candidateEmail: 'sarah@example.com',
    jobTitle: 'Product Designer',
    resumeUrl: '/resumes/sarah-johnson.pdf',
    status: 'in_review',
    score: 85,
    notes: 'Strong portfolio, excellent UX experience',
    reviewedBy: 'HR Team',
    reviewedAt: new Date('2024-01-16'),
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: '3',
    applicationId: 'app-003',
    candidateName: 'Mike Wilson',
    candidateEmail: 'mike@example.com',
    jobTitle: 'Data Scientist',
    resumeUrl: '/resumes/mike-wilson.pdf',
    status: 'approved',
    score: 92,
    notes: 'Excellent technical background, PhD preferred',
    reviewedBy: 'Tech Lead',
    reviewedAt: new Date('2024-01-17'),
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-17'),
  },
  {
    id: '4',
    applicationId: 'app-004',
    candidateName: 'Emily Davis',
    candidateEmail: 'emily@example.com',
    jobTitle: 'Marketing Manager',
    resumeUrl: '/resumes/emily-davis.pdf',
    status: 'rejected',
    score: 45,
    notes: 'Not enough experience in digital marketing',
    reviewedBy: 'Marketing Lead',
    reviewedAt: new Date('2024-01-18'),
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-18'),
  },
]

/**
 * Fetch all screenings with optional filters
 */
export const getScreenings = async (
  status?: ScreeningStatus
): Promise<ScreeningSummary[]> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    let filtered = [...mockScreenings]
    
    if (status) {
      filtered = filtered.filter(s => s.status === status)
    }
    
    return filtered.map(screening => ({
      id: screening.id,
      candidateName: screening.candidateName,
      jobTitle: screening.jobTitle,
      status: screening.status,
      score: screening.score,
      submittedAt: screening.createdAt,
    }))
  } catch (error) {
    console.error('Error fetching screenings:', error)
    throw error
  }
}

/**
 * Get detailed screening by ID
 */
export const getScreeningById = async (
  id: string
): Promise<ScreeningRecord | null> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockScreenings.find(s => s.id === id) || null
  } catch (error) {
    console.error('Error fetching screening:', error)
    throw error
  }
}

/**
 * Get screening criteria
 */
export const getScreeningCriteria = async (): Promise<ScreeningCriteria[]> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 200))
    return DEFAULT_SCREENING_CRITERIA
  } catch (error) {
    console.error('Error fetching criteria:', error)
    throw error
  }
}

/**
 * Evaluate a screening (submit scores and notes)
 */
export const evaluateScreening = async (
  id: string,
  evaluation: ScreeningEvaluation[],
  notes: string,
  reviewerName: string
): Promise<ScreeningActionResult> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const screeningIndex = mockScreenings.findIndex(s => s.id === id)
    if (screeningIndex === -1) {
      return { success: false, error: 'Screening not found' }
    }
    
    // Calculate total score
    const totalScore = evaluation.reduce((sum, eval_item) => sum + eval_item.score, 0)
    
    // Update screening
    const updatedScreening: ScreeningRecord = {
      ...mockScreenings[screeningIndex],
      score: totalScore,
      notes,
      reviewedBy: reviewerName,
      reviewedAt: new Date(),
      updatedAt: new Date(),
      status: totalScore >= 60 ? 'approved' : 'rejected',
    }
    
    mockScreenings[screeningIndex] = updatedScreening
    
    return { 
      success: true, 
      message: 'Screening evaluated successfully',
      screening: updatedScreening 
    }
  } catch (error) {
    console.error('Error evaluating screening:', error)
    return { success: false, error: 'Failed to evaluate screening' }
  }
}

/**
 * Update screening status
 */
export const updateScreeningStatus = async (
  id: string,
  status: ScreeningStatus
): Promise<ScreeningActionResult> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const screeningIndex = mockScreenings.findIndex(s => s.id === id)
    if (screeningIndex === -1) {
      return { success: false, error: 'Screening not found' }
    }
    
    mockScreenings[screeningIndex] = {
      ...mockScreenings[screeningIndex],
      status,
      updatedAt: new Date(),
    }
    
    return { 
      success: true, 
      message: 'Status updated successfully',
      screening: mockScreenings[screeningIndex]
    }
  } catch (error) {
    console.error('Error updating screening:', error)
    return { success: false, error: 'Failed to update status' }
  }
}

/**
 * Get screening statistics
 */
export const getScreeningStats = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const stats = {
      total: mockScreenings.length,
      pending: mockScreenings.filter(s => s.status === 'pending').length,
      inReview: mockScreenings.filter(s => s.status === 'in_review').length,
      approved: mockScreenings.filter(s => s.status === 'approved').length,
      rejected: mockScreenings.filter(s => s.status === 'rejected').length,
      averageScore: 0,
    }
    
    const scoredScreenings = mockScreenings.filter(s => s.score !== null)
    if (scoredScreenings.length > 0) {
      stats.averageScore = Math.round(
        scoredScreenings.reduce((sum, s) => sum + (s.score || 0), 0) / scoredScreenings.length
      )
    }
    
    return stats
  } catch (error) {
    console.error('Error fetching stats:', error)
    throw error
  }
}
