/**
 * useUndergraduateForm Hook
 * Purpose: Manage form state and submission logic for undergraduate admission
 * 
 * Per docs/frontend-lifecycle.md:
 * - Hooks manage state
 * - Components display state
 * 
 * Data Flow: Service → Hook → Component
 */

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, useUser } from '@clerk/nextjs'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  undergraduateFormSchema, 
  undergraduateFormDefaultValues,
  type UndergraduateFormValues 
} from '@/types/undergraduateForm'
import { submitUndergraduateApplication, type SubmitApplicationResponse } from '@/services/admissionService'
import { transitionAdmissionsStage } from '@/services/university/admissionsFlowService'

/**
 * Form submission result
 */
interface SubmitResult {
  success: boolean
  applicationId?: string
  message?: string
}

/**
 * Step field mapping for validation
 * Each step has specific fields that need to be validated
 */
const STEP_FIELDS: Record<number, (keyof UndergraduateFormValues)[]> = {
  1: ['applicationTerm', 'firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'gender', 'city', 'state', 'country', 'citizenship', 'isInternational'],
  2: ['highSchoolName', 'highSchoolCountry', 'highSchoolGPA', 'satScore', 'actScore', 'toeflScore', 'ieltsScore'],
  3: ['majorFirstChoice', 'majorSecondChoice'],
  4: ['essayContent', 'extracurriculars', 'requestFinancialAid', 'scholarshipInterest'],
}

/**
 * Step names for UI display
 */
const STEP_NAMES: Record<number, string> = {
  1: 'Personal Information',
  2: 'Academic Background',
  3: 'Program Selection',
  4: 'Essay & Additional Info',
}

/**
 * Hook return type
 */
interface UseUndergraduateFormReturn {
  // Form
  form: ReturnType<typeof useForm<UndergraduateFormValues>>
  isSubmitting: boolean
  submitSuccess: boolean
  currentStep: number
  totalSteps: number
  stepName: string
  validationErrors: Record<number, string[]>
  applicationData: SubmitResult | null
  
  // Actions
  onSubmit: (data: UndergraduateFormValues) => Promise<void>
  nextStep: () => Promise<boolean>
  prevStep: () => void
  goToStep: (step: number) => void
  validateCurrentStep: () => Promise<boolean>
}

/**
 * Undergraduate Form Hook
 * Handles form state, validation, and submission with step-by-step flow
 */
export function useUndergraduateForm(
  onComplete?: () => void
): UseUndergraduateFormReturn {
  const router = useRouter()
  const { userId } = useAuth()
  const { user: clerkUser, isLoaded: isUserLoaded } = useUser()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [validationErrors, setValidationErrors] = useState<Record<number, string[]>>({})
  const [applicationData, setApplicationData] = useState<SubmitResult | null>(null)
  
  const totalSteps = 4

  const form = useForm<UndergraduateFormValues>({
    resolver: zodResolver(undergraduateFormSchema),
    defaultValues: undergraduateFormDefaultValues,
    mode: 'onChange',
  })

  // Auto-fill form with Clerk user data
  useEffect(() => {
    if (isUserLoaded && clerkUser) {
      const clerkEmail = clerkUser.emailAddresses[0]?.emailAddress || ''
      const clerkFirstName = clerkUser.firstName || ''
      const clerkLastName = clerkUser.lastName || ''

      if (clerkEmail || clerkFirstName || clerkLastName) {
        form.setValue('email', clerkEmail)
        form.setValue('firstName', clerkFirstName)
        form.setValue('lastName', clerkLastName)
      }
    }
  }, [isUserLoaded, clerkUser, form])

  /**
   * Validate fields for the current step
   * Returns true if all required fields for the step are valid
   */
  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    const fieldsToValidate = STEP_FIELDS[currentStep] || []
    const errors: string[] = []
    
    for (const field of fieldsToValidate) {
      const fieldError = await form.trigger(field)
      if (!fieldError) {
        const fieldErrors = form.formState.errors[field]
        if (fieldErrors && fieldErrors.message) {
          errors.push(String(fieldErrors.message))
        }
      }
    }
    
    setValidationErrors(prev => ({
      ...prev,
      [currentStep]: errors,
    }))
    
    return errors.length === 0
  }, [currentStep, form])

  /**
   * Navigate to next step with validation
   */
  async function nextStep(): Promise<boolean> {
    if (currentStep >= totalSteps) {
      return false
    }

    // Validate current step before proceeding
    const isValid = await validateCurrentStep()
    
    if (isValid) {
      setCurrentStep(prev => prev + 1)
      // Clear errors for the new step
      setValidationErrors(prev => ({
        ...prev,
        [currentStep + 1]: [],
      }))
      return true
    }
    
    return false
  }

  /**
   * Submit form data to service
   */
  async function onSubmit(data: UndergraduateFormValues): Promise<void> {
    // Redirect to sign up if not authenticated
    if (!userId) {
      router.push('/sign-up?redirect_url=/apply?type=undergraduate')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Validate all fields before final submission
      const isFormValid = await form.trigger()
      
      if (!isFormValid) {
        // Find the first step with errors and navigate to it
        for (let step = 1; step <= totalSteps; step++) {
          const fields = STEP_FIELDS[step]
          const hasErrors = fields.some(field => !!form.formState.errors[field])
          if (hasErrors) {
            setCurrentStep(step)
            form.setError('root', { message: 'Please fix the errors before submitting' })
            setIsSubmitting(false)
            return
          }
        }
      }

      // Submit application using service
      const result: SubmitApplicationResponse = await submitUndergraduateApplication(data, userId)
      
      // Get the application ID from the response
      const appId = result.application?.id ? String(result.application.id) : `app-${Date.now()}`
      
      // Update admissions flow to mark application as submitted
      try {
        await transitionAdmissionsStage(
          appId,
          'applications_submitted',
          'undergraduate'
        )
      } catch (flowError) {
        // Log but don't fail the submission if flow update fails
        console.warn('Failed to update admissions flow:', flowError)
      }
      
      setApplicationData({
        success: true,
        applicationId: appId,
        message: result.message,
      })
      setSubmitSuccess(true)
      onComplete?.()
    } catch (error) {
      const message = error instanceof Error 
        ? error.message 
        : 'An error occurred. Please try again.'
      
      setApplicationData({
        success: false,
        message,
      })
      form.setError('root', { message })
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Navigate to previous step
   */
  function prevStep(): void {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  /**
   * Go to specific step
   */
  function goToStep(step: number): void {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step)
    }
  }

  return {
    form,
    isSubmitting,
    submitSuccess,
    currentStep,
    totalSteps,
    stepName: STEP_NAMES[currentStep],
    validationErrors,
    applicationData,
    onSubmit,
    nextStep,
    prevStep,
    goToStep,
    validateCurrentStep,
  }
}
