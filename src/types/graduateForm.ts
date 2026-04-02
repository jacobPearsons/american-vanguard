import { z } from 'zod'

export const graduateFormSchema = z.object({
  applicationTerm: z.string().min(1, 'Please select an application term'),
  
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  
  citizenship: z.string().optional(),
  isInternational: z.boolean().default(false),
  
  undergraduateInstitution: z.string().min(1, 'Undergraduate institution is required'),
  undergraduateGPA: z.coerce.number().min(0).max(4).optional(),
  undergraduateDegree: z.string().min(1, 'Undergraduate degree is required'),
  graduationYear: z.coerce.number().min(1900).max(2030).optional(),
  
  greScore: z.coerce.number().min(260).max(340).optional(),
  gmatScore: z.coerce.number().min(200).max(800).optional(),
  
  programType: z.enum(['Masters', 'PhD']),
  majorFirstChoice: z.string().min(1, 'Please select your first choice major'),
  majorSecondChoice: z.string().optional(),
  researchInterest: z.string().optional(),
  
  workExperience: z.string().optional(),
  statementOfPurpose: z.string()
    .min(100, 'Please write at least 100 characters about your goals')
    .max(5000, 'Statement must be less than 5000 characters'),
  lettersOfRecommendation: z.string().optional(),
  fundingRequest: z.boolean().default(false),
})

export type GraduateFormValues = z.infer<typeof graduateFormSchema>

export const graduateFormDefaultValues: GraduateFormValues = {
  applicationTerm: 'FALL_2026',
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
  undergraduateInstitution: '',
  undergraduateGPA: undefined,
  undergraduateDegree: '',
  graduationYear: undefined,
  greScore: undefined,
  gmatScore: undefined,
  programType: 'Masters',
  majorFirstChoice: '',
  majorSecondChoice: '',
  researchInterest: '',
  workExperience: '',
  statementOfPurpose: '',
  lettersOfRecommendation: '',
  fundingRequest: false,
}
