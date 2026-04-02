/**
 * Undergraduate Form Types
 * Purpose: Define TypeScript types for undergraduate admission form
 * 
 * Per docs/project-structure-blueprint.md:
 * - Types must be in src/types/
 */

import { z } from 'zod'

/**
 * Undergraduate form schema
 * Defines all validation rules for the undergraduate application form
 */
export const undergraduateFormSchema = z.object({
  // Application Term
  applicationTerm: z.string().min(1, 'Please select an application term'),
  
  // Personal Information
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  
  // Address
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  
  // Citizenship
  citizenship: z.string().optional(),
  isInternational: z.boolean().default(false),
  
  // High School Information
  highSchoolName: z.string().min(1, 'High school name is required'),
  highSchoolCountry: z.string().min(1, 'High school country is required'),
  highSchoolGPA: z.coerce.number().min(0).max(5).optional(),
  
  // Test Scores (optional)
  satScore: z.coerce.number().min(400).max(1600).optional(),
  actScore: z.coerce.number().min(1).max(36).optional(),
  
  // Program Selection
  majorFirstChoice: z.string().min(1, 'Please select your first choice major'),
  majorSecondChoice: z.string().optional(),
  
  // Test Scores - English
  toeflScore: z.coerce.number().min(0).max(120).optional(),
  ieltsScore: z.coerce.number().min(0).max(9).optional(),
  
  // Essay
  essayContent: z.string()
    .min(100, 'Please write at least 100 characters about yourself')
    .max(5000, 'Essay must be less than 5000 characters'),
  
  // Additional Information
  extracurriculars: z.string().optional(),
  
  // Financial Aid
  requestFinancialAid: z.boolean().default(false),
  scholarshipInterest: z.boolean().default(false),
})

/**
 * Type inferred from schema
 */
export type UndergraduateFormValues = z.infer<typeof undergraduateFormSchema>

/**
 * Default values for the form
 */
export const undergraduateFormDefaultValues: UndergraduateFormValues = {
  applicationTerm: 'FALL_2025',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  gender: '',
  city: '',
  state: '',
  country: 'United States',
  citizenship: '',
  isInternational: false,
  highSchoolName: '',
  highSchoolCountry: '',
  highSchoolGPA: undefined,
  satScore: undefined,
  actScore: undefined,
  majorFirstChoice: '',
  majorSecondChoice: '',
  toeflScore: undefined,
  ieltsScore: undefined,
  essayContent: '',
  extracurriculars: '',
  requestFinancialAid: false,
  scholarshipInterest: false,
}
