/**
 * Flow Service Tests
 * Unit tests for hiring pipeline flow transitions
 * 
 * Per docs/backend-architecture-framework.md:
 * - Testing must use Jest
 * - Services should be tested for business logic
 * 
 * Run with: npm test
 */

import {
  validateTransition,
  checkPrerequisites,
  getAllowedTransitions,
  getStageProgress,
  calculateFlowCompletion,
  getRemainingStages,
  requiresVerification,
  getFlowSummary,
} from '@/services/flowService'
import type { FlowStage } from '@/types/flow'

describe('flowService', () => {
  describe('validateTransition', () => {
    it('should allow forward progression to next stage', () => {
      const result = validateTransition('application_received', 'resume_screening')
      expect(result.valid).toBe(true)
      expect(result.from).toBe('application_received')
      expect(result.to).toBe('resume_screening')
    })

    it('should allow same stage (no transition needed)', () => {
      const result = validateTransition('hr_interview', 'hr_interview')
      expect(result.valid).toBe(true)
    })

    it('should reject backward movement beyond allowed', () => {
      const result = validateTransition('hr_interview', 'job_posted')
      expect(result.valid).toBe(false)
      expect(result.reason).toContain('Cannot transition')
    })

    it('should allow skipping stages that are in transition rules', () => {
      // From resume_screening, can go back to job_posted (recycle)
      const result = validateTransition('resume_screening', 'job_posted')
      expect(result.valid).toBe(true)
    })

    it('should reject invalid random transitions', () => {
      const result = validateTransition('application_received', 'technical_interview')
      expect(result.valid).toBe(false)
    })

    it('should allow progression through all stages', () => {
      // Test the happy path through the entire pipeline
      const stages: FlowStage[] = [
        'job_identified',
        'job_posted',
        'application_received',
        'resume_screening',
        'hr_interview',
        'skills_test',
        'technical_interview',
        'behavioral_interview',
        'final_interview',
        'background_check',
        'offer_letter',
        'hired',
        'onboarding',
      ]

      for (let i = 0; i < stages.length - 1; i++) {
        const result = validateTransition(stages[i], stages[i + 1])
        expect(result.valid).toBe(true)
      }
    })

    it('should allow going back from skills test to hr interview', () => {
      const result = validateTransition('skills_test', 'hr_interview')
      expect(result.valid).toBe(true)
    })
  })

  describe('checkPrerequisites', () => {
    it('should pass when all prerequisites are met', () => {
      const completed: FlowStage[] = ['job_identified', 'job_posted']
      const result = checkPrerequisites(completed, 'application_received')
      expect(result.met).toBe(true)
      expect(result.missing).toHaveLength(0)
    })

    it('should fail when prerequisites are missing', () => {
      const completed: FlowStage[] = ['job_identified']
      const result = checkPrerequisites(completed, 'application_received')
      expect(result.met).toBe(false)
      expect(result.missing).toContain('job_posted')
    })

    it('should pass for initial stage with no prerequisites', () => {
      const completed: FlowStage[] = []
      const result = checkPrerequisites(completed, 'job_identified')
      expect(result.met).toBe(true)
    })

    it('should require multiple prerequisites', () => {
      const completed: FlowStage[] = ['job_identified']
      const result = checkPrerequisites(completed, 'resume_screening')
      expect(result.met).toBe(false)
      expect(result.missing).toContain('application_received')
    })
  })

  describe('getAllowedTransitions', () => {
    it('should return allowed transitions for application_received', () => {
      const allowed = getAllowedTransitions('application_received')
      expect(allowed).toContain('resume_screening')
    })

    it('should return empty array for terminal stage', () => {
      const allowed = getAllowedTransitions('onboarding')
      expect(allowed).toHaveLength(0)
    })

    it('should return multiple options for intermediate stages', () => {
      const allowed = getAllowedTransitions('resume_screening')
      expect(allowed.length).toBeGreaterThan(1)
    })
  })

  describe('getStageProgress', () => {
    it('should return progress info for valid stage', () => {
      const progress = getStageProgress('hr_interview')
      expect(progress.stage).toBeDefined()
      expect(progress.progress).toBeGreaterThan(0)
    })

    it('should return correct progress percentage', () => {
      const initial = getStageProgress('job_identified')
      const final = getStageProgress('onboarding')
      
      expect(initial.progress).toBe(0)
      expect(final.progress).toBe(100)
    })
  })

  describe('calculateFlowCompletion', () => {
    it('should return 0 for initial stage', () => {
      const completion = calculateFlowCompletion('job_identified')
      expect(completion).toBe(0)
    })

    it('should return 100 for final stage', () => {
      const completion = calculateFlowCompletion('onboarding')
      expect(completion).toBe(100)
    })

    it('should return correct percentage for middle stages', () => {
      const completion = calculateFlowCompletion('technical_interview')
      // 6th stage out of 13 = ~46%
      expect(completion).toBeGreaterThan(40)
      expect(completion).toBeLessThan(60)
    })
  })

  describe('getRemainingStages', () => {
    it('should return all stages after current', () => {
      const remaining = getRemainingStages('application_received')
      expect(remaining.length).toBeGreaterThan(0)
      expect(remaining[0]).toBe('resume_screening')
    })

    it('should return empty array for final stage', () => {
      const remaining = getRemainingStages('onboarding')
      expect(remaining).toHaveLength(0)
    })
  })

  describe('requiresVerification', () => {
    it('should require verification for technical interview', () => {
      const type = requiresVerification('technical_interview')
      expect(type).toBe('interview_access')
    })

    it('should require verification for behavioral interview', () => {
      const type = requiresVerification('behavioral_interview')
      expect(type).toBe('interview_access')
    })

    it('should require verification for final interview', () => {
      const type = requiresVerification('final_interview')
      expect(type).toBe('final_interview')
    })

    it('should not require verification for early stages', () => {
      const type = requiresVerification('application_received')
      expect(type).toBeNull()
    })
  })

  describe('getFlowSummary', () => {
    it('should return complete summary for any stage', () => {
      const summary = getFlowSummary('hr_interview')
      
      expect(summary.currentStage).toBe('hr_interview')
      expect(summary.progress).toBeGreaterThan(0)
      expect(summary.completedStages).toBeGreaterThan(0)
      expect(summary.totalStages).toBe(13)
      expect(summary.remainingStages).toBeDefined()
      expect(summary.allowedTransitions).toBeDefined()
      expect(typeof summary.requiresVerification).toBe('boolean')
    })
  })
})
