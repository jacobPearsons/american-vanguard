/**
 * Validation Layer
 * Purpose: Input validation for API requests
 * 
 * Architecture (per docs/backend-architecture-framework.md):
 * - Validators check request body
 * - Sanitize input
 * - Enforce schema
 * - Controllers receive clean validated data
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

/**
 * Validation error response
 */
export interface ValidationError {
  success: false
  error: string
  details?: Record<string, string[]>
}

/**
 * Validation result
 */
export interface ValidationResult<T> {
  success: boolean
  data?: T
  error?: ValidationError
}

/**
 * Base validation schema
 */
export const baseSchemas = {
  /**
   * UUID validation
   */
  uuid: z.string().uuid('Invalid UUID format'),
  
  /**
   * Email validation
   */
  email: z.string().email('Invalid email format'),
  
  /**
   * Non-empty string
   */
  nonEmptyString: z.string().min(1, 'Field cannot be empty'),
  
  /**
   * Positive number
   */
  positiveNumber: z.number().positive('Must be a positive number'),
  
  /**
   * Date string
   */
  dateString: z.string().datetime('Invalid date format'),
}

/**
 * Create a validation middleware
 * 
 * @param schema - Zod schema to validate against
 * @returns Validation middleware function
 */
export const createValidator = <T>(schema: z.ZodSchema<T>) => {
  return async (request: NextRequest): Promise<ValidationResult<T>> => {
    try {
      // Parse body based on method
      let data: unknown
      
      if (request.method === 'GET') {
        const url = new URL(request.url)
        data = Object.fromEntries(url.searchParams)
      } else {
        data = await request.json()
      }
      
      // Validate against schema
      const validated = schema.parse(data)
      
      return {
        success: true,
        data: validated,
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const details: Record<string, string[]> = {}
        
        error.errors.forEach((err) => {
          const path = err.path.join('.')
          if (!details[path]) {
            details[path] = []
          }
          details[path].push(err.message)
        })
        
        return {
          success: false,
          error: {
            success: false,
            error: 'Validation failed',
            details,
          },
        }
      }
      
      return {
        success: false,
        error: {
          success: false,
          error: 'Invalid request data',
        },
      }
    }
  }
}

/**
 * Common validation schemas for the application
 */
export const schemas = {
  /**
   * User registration schema
   */
  register: z.object({
    email: baseSchemas.email,
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    firstName: baseSchemas.nonEmptyString.min(2, 'First name must be at least 2 characters'),
    lastName: baseSchemas.nonEmptyString.min(2, 'Last name must be at least 2 characters'),
    matricNumber: baseSchemas.nonEmptyString.optional(),
    role: z.enum(['student', 'staff', 'admin']).default('student'),
  }),

  /**
   * User login schema
   */
  login: z.object({
    email: baseSchemas.email,
    password: z.string().min(1, 'Password is required'),
  }),

  /**
   * Profile update schema
   */
  updateProfile: z.object({
    firstName: baseSchemas.nonEmptyString.min(2).optional(),
    lastName: baseSchemas.nonEmptyString.min(2).optional(),
    phone: z.string().optional(),
    bio: z.string().max(500).optional(),
    avatarUrl: z.string().url().optional(),
  }),

  /**
   * Screening evaluation schema
   */
  screeningEvaluation: z.object({
    screeningId: baseSchemas.uuid,
    evaluation: z.array(z.object({
      criteriaId: baseSchemas.nonEmptyString,
      score: z.number().min(0).max(100),
      comments: z.string().optional(),
    })),
    notes: z.string().optional(),
    reviewerName: baseSchemas.nonEmptyString,
  }),

  /**
   * Interview scheduling schema
   */
  scheduleInterview: z.object({
    candidateId: baseSchemas.uuid,
    interviewType: z.enum(['hr', 'technical', 'behavioral', 'final']),
    scheduledAt: baseSchemas.dateString,
    duration: z.number().min(15).max(180),
    notes: z.string().optional(),
  }),

  /**
   * Verification code generation schema
   */
  generateCode: z.object({
    userId: baseSchemas.uuid,
    userEmail: baseSchemas.email,
    type: z.enum(['skills_completion', 'interview_access', 'final_interview']),
  }),

  /**
   * Verification code validation schema
   */
  validateCode: z.object({
    code: baseSchemas.nonEmptyString,
    type: z.enum(['skills_completion', 'interview_access', 'final_interview']),
  }),

  /**
   * Flow transition schema
   */
  transitionFlow: z.object({
    applicationId: baseSchemas.uuid,
    targetStage: z.string(), // FlowStage
    notes: z.string().optional(),
  }),

  /**
   * Application submission schema
   */
  submitApplication: z.object({
    jobId: baseSchemas.uuid,
    firstName: baseSchemas.nonEmptyString,
    lastName: baseSchemas.nonEmptyString,
    email: baseSchemas.email,
    phone: baseSchemas.nonEmptyString,
    resumeUrl: baseSchemas.nonEmptyString,
    coverLetter: z.string().optional(),
  }),

  /**
   * Admission application schema
   */
  admissionApplication: z.object({
    admissionType: z.enum(['UNDERGRADUATE', 'GRADUATE', 'TRANSFER', 'INTERNATIONAL']),
    applicationTerm: z.enum(['FALL_2025', 'SPRING_2026', 'SUMMER_2026', 'FALL_2026']),
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: baseSchemas.email,
    phone: z.string().optional(),
    dateOfBirth: z.string().optional(),
    gender: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    citizenship: z.string().optional(),
    isInternational: z.boolean().optional().default(false),
    highSchoolName: z.string().optional(),
    highSchoolCountry: z.string().optional(),
    highSchoolGPA: z.number().optional(),
    satScore: z.number().optional(),
    actScore: z.number().optional(),
    undergradSchool: z.string().optional(),
    undergradDegree: z.string().optional(),
    undergradMajor: z.string().optional(),
    undergradGPA: z.number().optional(),
    greScore: z.number().optional(),
    gmatScore: z.number().optional(),
    toeflScore: z.number().optional(),
    ieltsScore: z.number().optional(),
    programOfInterest: z.string().optional(),
    majorFirstChoice: z.string().optional(),
    majorSecondChoice: z.string().optional(),
    essayContent: z.string().optional(),
    extracurriculars: z.string().optional(),
    workExperience: z.string().optional(),
    requestFinancialAid: z.boolean().optional().default(false),
    scholarshipInterest: z.boolean().optional().default(false),
  }),
}

/**
 * Validate and return typed data or error response
 * 
 * @param request - Next.js request
 * @param schema - Zod schema
 * @returns Tuple of [data, errorResponse] or throws
 */
export const validateRequest = async <T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): Promise<[T, null] | [null, NextResponse]> => {
  const result = await createValidator(schema)(request)
  
  if (!result.success || !result.data) {
    return [null, NextResponse.json(result.error, { status: 400 })]
  }
  
  return [result.data, null]
}
