/**
 * Undergraduate Form Component
 * Purpose: Multi-step form for undergraduate admission applications
 * 
 * Per docs/component-design-rules.md:
 * - Components must remain under 200 lines
 * - Use hooks for logic, components for UI
 * 
 * Per docs/frontend-lifecycle.md:
 * - UI components must not fetch data directly
 * - Data flow: Service → Hook → Component
 */

'use client'

import { Button } from '@/components/ui/button'
import { CheckCircle, ArrowRight, ArrowLeft, Loader2, AlertCircle } from 'lucide-react'
import { useUndergraduateForm } from '@/hooks/useUndergraduateForm'
import { Form } from '@/components/ui/forms/form'
import { 
  PersonalInfoFields, 
  AcademicBackgroundFields, 
  ProgramSelectionFields, 
  EssayInfoFields 
} from './UndergraduateFormFields'

/**
 * Step information for display
 */
const STEPS = [
  { id: 1, name: 'Personal Info', icon: '1' },
  { id: 2, name: 'Academic', icon: '2' },
  { id: 3, name: 'Programs', icon: '3' },
  { id: 4, name: 'Essay', icon: '4' },
]

interface UndergraduateFormProps {
  onComplete?: () => void
}

/**
 * Main Undergraduate Form Component
 * Orchestrates form steps using the custom hook with step validation
 */
export function UndergraduateForm({ onComplete }: UndergraduateFormProps) {
  const { 
    form, 
    isSubmitting, 
    submitSuccess, 
    currentStep, 
    totalSteps, 
    stepName,
    validationErrors,
    applicationData,
    onSubmit, 
    nextStep, 
    prevStep,
    goToStep
  } = useUndergraduateForm(onComplete)

  // Handle Next step with validation
  const handleNextStep = async () => {
    await nextStep()
  }

  // Show success message after submission
  if (submitSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Application Submitted!</h2>
        <p className="text-neutral-400 text-center max-w-md mb-8">
          Your undergraduate application has been successfully submitted to American Vanguard Institute.
          {applicationData?.applicationId && (
            <span className="block mt-2 text-sm">
              Application ID: <span className="font-mono text-yellow-500">{applicationData.applicationId}</span>
            </span>
          )}
        </p>
        
        {/* Next Steps Information */}
        <div className="bg-neutral-900/50 rounded-lg p-6 max-w-md w-full mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">What happens next?</h3>
          <ul className="space-y-3 text-neutral-400">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>You will receive a confirmation email shortly</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <span>Your application will be reviewed by our admissions team</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <span>Track your application status on your dashboard</span>
            </li>
          </ul>
        </div>
        
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
            View Application Status
          </Button>
          <Button onClick={() => window.location.href = '/'}>
            Return Home
          </Button>
        </div>
      </div>
    )
  }

  // Render the current step form fields
  const renderStepFields = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoFields form={form} />
      case 2:
        return <AcademicBackgroundFields form={form} />
      case 3:
        return <ProgramSelectionFields form={form} />
      case 4:
        return <EssayInfoFields form={form} />
      default:
        return null
    }
  }

  // Get validation errors for current step
  const currentStepErrors = validationErrors[currentStep] || []
  const hasStepErrors = currentStepErrors.length > 0

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <button
              type="button"
              onClick={() => goToStep(step.id)}
              className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${
                currentStep >= step.id 
                  ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
              }`}
              disabled={isSubmitting}
            >
              {currentStep > step.id ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                step.icon
              )}
            </button>
            {index < STEPS.length - 1 && (
              <div className={`flex-1 h-1 mx-2 transition-all ${
                currentStep > step.id ? 'bg-yellow-600' : 'bg-neutral-800'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Title */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white">Step {currentStep}: {stepName}</h2>
        <p className="text-neutral-400 text-sm mt-1">
          Step {currentStep} of {totalSteps}
        </p>
      </div>

      {/* Validation Errors for Current Step */}
      {hasStepErrors && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-red-400 font-medium">Please fix the following errors:</p>
            <ul className="text-red-400/80 text-sm mt-1 list-disc list-inside">
              {currentStepErrors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Step Fields */}
          {renderStepFields()}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1 || isSubmitting}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={handleNextStep}
                disabled={isSubmitting}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Form-level errors */}
          {form.formState.errors.root && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div className="text-red-400 text-sm">
                {form.formState.errors.root.message}
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  )
}

export default UndergraduateForm
