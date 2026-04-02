/**
 * Interview Service
 * Purpose: Handle interview scheduling and management
 * 
 * Data Flow: API → Service → Hook → UI Component
 * 
 * Rules (per docs):
 * - Services handle all data access
 * - Components never call APIs directly
 * - Always handle errors gracefully
 */

import type {
  Interview,
  InterviewSummary,
  InterviewScheduleRequest,
  InterviewFeedback,
  InterviewActionResult,
  InterviewType,
  InterviewStatus
} from '@/types/interview'
import { DEFAULT_INTERVIEW_DURATIONS } from '@/types/interview'

// Mock data store for demo
let mockInterviews: Interview[] = [
  {
    id: 'int-001',
    applicationId: 'app-002',
    candidateName: 'Sarah Johnson',
    candidateEmail: 'sarah@example.com',
    jobTitle: 'Product Designer',
    interviewType: 'hr',
    scheduledAt: new Date('2024-01-20T10:00:00'),
    duration: 45,
    location: 'https://meet.google.com/abc-defg-hij',
    interviewerName: 'HR Manager',
    interviewerEmail: 'hr@company.com',
    status: 'scheduled',
    notes: '',
    rating: null,
    feedback: '',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: 'int-002',
    applicationId: 'app-003',
    candidateName: 'Mike Wilson',
    candidateEmail: 'mike@example.com',
    jobTitle: 'Data Scientist',
    interviewType: 'technical',
    scheduledAt: new Date('2024-01-22T14:00:00'),
    duration: 60,
    location: 'https://meet.google.com/xyz-uvwx-yz',
    interviewerName: 'Tech Lead',
    interviewerEmail: 'tech@company.com',
    status: 'scheduled',
    notes: 'Prepare Python coding test',
    rating: null,
    feedback: '',
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
  },
  {
    id: 'int-003',
    applicationId: 'app-001',
    candidateName: 'John Smith',
    candidateEmail: 'john@example.com',
    jobTitle: 'Senior Software Engineer',
    interviewType: 'hr',
    scheduledAt: new Date('2024-01-15T11:00:00'),
    duration: 45,
    location: 'https://meet.google.com/def-ghij-klm',
    interviewerName: 'HR Manager',
    interviewerEmail: 'hr@company.com',
    status: 'completed',
    notes: 'Good communication skills',
    rating: 'yes',
    feedback: 'Candidate showed strong problem-solving abilities and good cultural fit.',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
  },
]

/**
 * Fetch all interviews with optional filters
 */
export const getInterviews = async (
  type?: InterviewType,
  status?: InterviewStatus
): Promise<InterviewSummary[]> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    let filtered = [...mockInterviews]
    
    if (type) {
      filtered = filtered.filter(i => i.interviewType === type)
    }
    
    if (status) {
      filtered = filtered.filter(i => i.status === status)
    }
    
    return filtered.map(interview => ({
      id: interview.id,
      candidateName: interview.candidateName,
      jobTitle: interview.jobTitle,
      interviewType: interview.interviewType,
      scheduledAt: interview.scheduledAt,
      status: interview.status,
      rating: interview.rating,
    }))
  } catch (error) {
    console.error('Error fetching interviews:', error)
    throw error
  }
}

/**
 * Get upcoming interviews
 */
export const getUpcomingInterviews = async (): Promise<InterviewSummary[]> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const now = new Date()
    const upcoming = mockInterviews
      .filter(i => i.scheduledAt > now && i.status === 'scheduled')
      .sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime())
      .slice(0, 5)
    
    return upcoming.map(interview => ({
      id: interview.id,
      candidateName: interview.candidateName,
      jobTitle: interview.jobTitle,
      interviewType: interview.interviewType,
      scheduledAt: interview.scheduledAt,
      status: interview.status,
      rating: interview.rating,
    }))
  } catch (error) {
    console.error('Error fetching upcoming interviews:', error)
    throw error
  }
}

/**
 * Get interview by ID
 */
export const getInterviewById = async (
  id: string
): Promise<Interview | null> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockInterviews.find(i => i.id === id) || null
  } catch (error) {
    console.error('Error fetching interview:', error)
    throw error
  }
}

/**
 * Schedule a new interview
 */
export const scheduleInterview = async (
  request: InterviewScheduleRequest
): Promise<InterviewActionResult> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const newInterview: Interview = {
      id: `int-${Date.now()}`,
      applicationId: request.applicationId,
      candidateName: '', // Would be fetched from application
      candidateEmail: '', // Would be fetched from application
      jobTitle: '', // Would be fetched from application
      interviewType: request.interviewType,
      scheduledAt: request.scheduledAt,
      duration: request.duration || DEFAULT_INTERVIEW_DURATIONS[request.interviewType],
      location: request.location,
      interviewerName: request.interviewerName,
      interviewerEmail: request.interviewerEmail,
      status: 'scheduled',
      notes: '',
      rating: null,
      feedback: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    mockInterviews.push(newInterview)
    
    return {
      success: true,
      message: 'Interview scheduled successfully',
      interview: newInterview,
    }
  } catch (error) {
    console.error('Error scheduling interview:', error)
    return { success: false, error: 'Failed to schedule interview' }
  }
}

/**
 * Submit interview feedback
 */
export const submitInterviewFeedback = async (
  feedback: InterviewFeedback
): Promise<InterviewActionResult> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const interviewIndex = mockInterviews.findIndex(i => i.id === feedback.interviewId)
    if (interviewIndex === -1) {
      return { success: false, error: 'Interview not found' }
    }
    
    const updatedInterview: Interview = {
      ...mockInterviews[interviewIndex],
      rating: feedback.rating,
      notes: feedback.notes,
      feedback: feedback.feedback,
      status: 'completed',
      updatedAt: new Date(),
    }
    
    mockInterviews[interviewIndex] = updatedInterview
    
    return {
      success: true,
      message: 'Feedback submitted successfully',
      interview: updatedInterview,
    }
  } catch (error) {
    console.error('Error submitting feedback:', error)
    return { success: false, error: 'Failed to submit feedback' }
  }
}

/**
 * Cancel an interview
 */
export const cancelInterview = async (
  id: string
): Promise<InterviewActionResult> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const interviewIndex = mockInterviews.findIndex(i => i.id === id)
    if (interviewIndex === -1) {
      return { success: false, error: 'Interview not found' }
    }
    
    mockInterviews[interviewIndex] = {
      ...mockInterviews[interviewIndex],
      status: 'cancelled',
      updatedAt: new Date(),
    }
    
    return {
      success: true,
      message: 'Interview cancelled',
      interview: mockInterviews[interviewIndex],
    }
  } catch (error) {
    console.error('Error cancelling interview:', error)
    return { success: false, error: 'Failed to cancel interview' }
  }
}

/**
 * Get interview statistics
 */
export const getInterviewStats = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const now = new Date()
    const upcoming = mockInterviews.filter(i => i.scheduledAt > now && i.status === 'scheduled').length
    const completed = mockInterviews.filter(i => i.status === 'completed').length
    const cancelled = mockInterviews.filter(i => i.status === 'cancelled').length
    
    // Calculate average rating from completed interviews
    const ratedInterviews = mockInterviews.filter(i => i.rating !== null)
    const ratingCounts = ratedInterviews.reduce((acc, i) => {
      acc[i.rating!] = (acc[i.rating!] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return {
      upcoming,
      completed,
      cancelled,
      total: mockInterviews.length,
      ratingBreakdown: ratingCounts,
    }
  } catch (error) {
    console.error('Error fetching interview stats:', error)
    throw error
  }
}
