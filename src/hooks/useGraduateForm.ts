import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, useUser } from '@clerk/nextjs'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  graduateFormSchema, 
  graduateFormDefaultValues,
  type GraduateFormValues 
} from '@/types/graduateForm'
import { submitGraduateApplication, type SubmitApplicationResponse } from '@/services/admissionService'
import { transitionAdmissionsStage } from '@/services/university/admissionsFlowService'

interface SubmitResult {
  success: boolean
  applicationId?: string
  message?: string
}

const STEP_FIELDS: Record<number, (keyof GraduateFormValues)[]> = {
  1: ['applicationTerm', 'firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'gender', 'city', 'state', 'country', 'citizenship', 'isInternational'],
  2: ['undergraduateInstitution', 'undergraduateGPA', 'undergraduateDegree', 'graduationYear', 'greScore', 'gmatScore'],
  3: ['programType', 'majorFirstChoice', 'majorSecondChoice', 'researchInterest'],
  4: ['statementOfPurpose', 'workExperience', 'lettersOfRecommendation', 'fundingRequest'],
}

const STEP_NAMES: Record<number, string> = {
  1: 'Personal Information',
  2: 'Academic Background',
  3: 'Program Selection',
  4: 'Documents',
}

interface UseGraduateFormReturn {
  form: ReturnType<typeof useForm<GraduateFormValues>>
  isSubmitting: boolean
  submitSuccess: boolean
  currentStep: number
  totalSteps: number
  stepName: string
  validationErrors: Record<number, string[]>
  applicationData: SubmitResult | null
  
  onSubmit: (data: GraduateFormValues) => Promise<void>
  nextStep: () => Promise<boolean>
  prevStep: () => void
  goToStep: (step: number) => void
  validateCurrentStep: () => Promise<boolean>
}

export function useGraduateForm(
  onComplete?: () => void
): UseGraduateFormReturn {
  const router = useRouter()
  const { userId } = useAuth()
  const { user: clerkUser, isLoaded: isUserLoaded } = useUser()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [validationErrors, setValidationErrors] = useState<Record<number, string[]>>({})
  const [applicationData, setApplicationData] = useState<SubmitResult | null>(null)
  
  const totalSteps = 4

  const form = useForm<GraduateFormValues>({
    resolver: zodResolver(graduateFormSchema),
    defaultValues: graduateFormDefaultValues,
    mode: 'onChange',
  })

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

  async function nextStep(): Promise<boolean> {
    if (currentStep >= totalSteps) {
      return false
    }

    const isValid = await validateCurrentStep()
    
    if (isValid) {
      setCurrentStep(prev => prev + 1)
      setValidationErrors(prev => ({
        ...prev,
        [currentStep + 1]: [],
      }))
      return true
    }
    
    return false
  }

  async function onSubmit(data: GraduateFormValues): Promise<void> {
    if (!userId) {
      router.push('/sign-up?redirect_url=/apply?type=graduate')
      return
    }

    setIsSubmitting(true)
    
    try {
      const isFormValid = await form.trigger()
      
      if (!isFormValid) {
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

      const result: SubmitApplicationResponse = await submitGraduateApplication(data, userId)
      
      const appId = result.application?.id ? String(result.application.id) : `app-${Date.now()}`
      
      try {
        await transitionAdmissionsStage(
          appId,
          'applications_submitted',
          'graduate'
        )
      } catch (flowError) {
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

  function prevStep(): void {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

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
