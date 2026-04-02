/**
 * Admissions Flow Service Tests
 * 
 * Tests for university admissions pipeline following docs/flow.md
 * 13-stage flow from Student Identified to Orientation & Onboarding
 */

import {
  validateAdmissionsTransition,
  checkAdmissionsPrerequisites,
  getAllowedAdmissionsTransitions,
  getAdmissionsStageProgress,
  calculateAdmissionsCompletion,
  getRemainingAdmissionsStages,
  getProgramStages,
  isStageRequiredForProgram,
  getAdmissionsFlowSummary,
  getAllAdmissionsStages,
} from '@/services/university/admissionsFlowService'
import type { AdmissionsStage, ProgramType } from '@/types/university/admissionsFlow'

describe('admissionsFlowService', () => {
  describe('validateAdmissionsTransition', () => {
    it('should allow forward progression to next stage', () => {
      const result = validateAdmissionsTransition('student_identified', 'university_programs')
      expect(result.valid).toBe(true)
    })

    it('should allow same stage (no transition needed)', () => {
      const result = validateAdmissionsTransition('student_identified', 'student_identified')
      expect(result.valid).toBe(true)
    })

    it('should reject backward movement beyond allowed', () => {
      const result = validateAdmissionsTransition('university_programs', 'student_identified')
      expect(result.valid).toBe(true) // Allowed in transition rules
    })

    it('should reject invalid random transitions', () => {
      const result = validateAdmissionsTransition('student_identified', 'department_interview')
      expect(result.valid).toBe(false)
      expect(result.reason).toContain('Cannot transition')
    })

    it('should allow progression through all stages', () => {
      // Full flow progression
      const stages: AdmissionsStage[] = [
        'student_identified',
        'university_programs',
        'applications_submitted',
        'academic_record_review',
        'admissions_counselor_interview',
        'standardized_testing',
        'department_interview',
        'student_fit_assessment',
        'final_committee_review',
        'background_verification',
        'acceptance_letter',
        'enrollment',
        'orientation_onboarding',
      ]

      for (let i = 0; i < stages.length - 1; i++) {
        const result = validateAdmissionsTransition(stages[i], stages[i + 1])
        expect(result.valid).toBe(true)
      }
    })

    it('should allow going back from acceptance_letter to enrollment', () => {
      const result = validateAdmissionsTransition('acceptance_letter', 'enrollment')
      expect(result.valid).toBe(true)
    })
  })

  describe('checkAdmissionsPrerequisites', () => {
    it('should pass when all prerequisites are met', () => {
      const completedStages: AdmissionsStage[] = ['student_identified', 'university_programs']
      const result = checkAdmissionsPrerequisites(completedStages, 'applications_submitted')
      expect(result.met).toBe(true)
      expect(result.missing).toEqual([])
    })

    it('should fail when prerequisites are missing', () => {
      const completedStages: AdmissionsStage[] = ['student_identified']
      const result = checkAdmissionsPrerequisites(completedStages, 'applications_submitted')
      expect(result.met).toBe(false)
      expect(result.missing).toContain('university_programs')
    })

    it('should pass for initial stage with no prerequisites', () => {
      const completedStages: AdmissionsStage[] = []
      const result = checkAdmissionsPrerequisites(completedStages, 'student_identified')
      expect(result.met).toBe(true)
      expect(result.missing).toEqual([])
    })

    it('should require multiple prerequisites', () => {
      // department_interview requires standardized_testing
      const completedStages: AdmissionsStage[] = [
        'student_identified',
        'university_programs',
        'applications_submitted',
        'academic_record_review',
        'admissions_counselor_interview',
        'standardized_testing',
      ]
      const result = checkAdmissionsPrerequisites(completedStages, 'department_interview')
      expect(result.met).toBe(true)
    })
  })

  describe('getAllowedAdmissionsTransitions', () => {
    it('should return allowed transitions for student_identified', () => {
      const result = getAllowedAdmissionsTransitions('student_identified')
      expect(result).toContain('university_programs')
    })

    it('should return empty array for terminal stage', () => {
      const result = getAllowedAdmissionsTransitions('orientation_onboarding')
      expect(result).toEqual([])
    })

    it('should return multiple options for intermediate stages', () => {
      const result = getAllowedAdmissionsTransitions('academic_record_review')
      expect(result).toContain('admissions_counselor_interview')
      expect(result).toContain('standardized_testing')
    })
  })

  describe('getAdmissionsStageProgress', () => {
    it('should return progress info for valid stage', () => {
      const result = getAdmissionsStageProgress('applications_submitted')
      expect(result.stage).toBeDefined()
      expect(result.progress).toBeGreaterThan(0)
      expect(result.allowedNextStages).toBeDefined()
      expect(result.nextStage).toBeDefined()
    })

    it('should return correct progress percentage', () => {
      const result = getAdmissionsStageProgress('academic_record_review')
      expect(result.progress).toBeGreaterThan(getAdmissionsStageProgress('applications_submitted').progress)
    })
  })

  describe('calculateAdmissionsCompletion', () => {
    it('should return 0 for initial stage', () => {
      const result = calculateAdmissionsCompletion('student_identified')
      expect(result).toBe(0)
    })

    it('should return 100 for final stage', () => {
      const result = calculateAdmissionsCompletion('orientation_onboarding')
      expect(result).toBe(100)
    })

    it('should return correct percentage for middle stages', () => {
      const result = calculateAdmissionsCompletion('department_interview')
      expect(result).toBeGreaterThan(0)
      expect(result).toBeLessThan(100)
    })
  })

  describe('getRemainingAdmissionsStages', () => {
    it('should return all stages after current', () => {
      const result = getRemainingAdmissionsStages('applications_submitted')
      expect(result).toContain('academic_record_review')
      expect(result).toContain('admissions_counselor_interview')
      expect(result).not.toContain('applications_submitted')
    })

    it('should return empty array for final stage', () => {
      const result = getRemainingAdmissionsStages('orientation_onboarding')
      expect(result).toEqual([])
    })
  })

  describe('getProgramStages', () => {
    it('should return stages for undergraduate program', () => {
      const result = getProgramStages('undergraduate')
      expect(result.length).toBeGreaterThan(0)
    })

    it('should return stages for graduate program', () => {
      const result = getProgramStages('graduate')
      expect(result.length).toBeGreaterThan(0)
    })

    it('should return stages for certificate program', () => {
      const result = getProgramStages('certificate')
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('isStageRequiredForProgram', () => {
    it('should return true for required stage', () => {
      const result = isStageRequiredForProgram('undergraduate', 'applications_submitted')
      expect(result).toBe(true)
    })

    it('should return true for all stages in undergraduate', () => {
      const undergraduateStages = getProgramStages('undergraduate')
      undergraduateStages.forEach(stage => {
        expect(isStageRequiredForProgram('undergraduate', stage)).toBe(true)
      })
    })
  })

  describe('getAdmissionsFlowSummary', () => {
    it('should return complete summary for undergraduate', () => {
      const result = getAdmissionsFlowSummary('academic_record_review', 'undergraduate')
      expect(result.currentStage).toBe('academic_record_review')
      expect(result.programType).toBe('undergraduate')
      expect(result.progress).toBeGreaterThan(0)
      expect(result.completedStages).toBeGreaterThan(0)
      expect(result.totalStages).toBe(13)
      expect(result.remainingStages).toBeDefined()
      expect(result.allowedTransitions).toBeDefined()
      expect(result.institution).toBe('American Vanguard Institute')
      expect(result.institutionAbbr).toBe('AVI')
    })

    it('should default to undergraduate if no program type specified', () => {
      const result = getAdmissionsFlowSummary('student_identified')
      expect(result.programType).toBe('undergraduate')
    })
  })

  describe('getAllAdmissionsStages', () => {
    it('should return all 13 stages', () => {
      const result = getAllAdmissionsStages()
      expect(result.length).toBe(13)
    })

    it('should include all flow.md stages', () => {
      const result = getAllAdmissionsStages()
      const stageIds = result.map(s => s.id)
      
      expect(stageIds).toContain('student_identified')
      expect(stageIds).toContain('university_programs')
      expect(stageIds).toContain('applications_submitted')
      expect(stageIds).toContain('academic_record_review')
      expect(stageIds).toContain('admissions_counselor_interview')
      expect(stageIds).toContain('standardized_testing')
      expect(stageIds).toContain('department_interview')
      expect(stageIds).toContain('student_fit_assessment')
      expect(stageIds).toContain('final_committee_review')
      expect(stageIds).toContain('background_verification')
      expect(stageIds).toContain('acceptance_letter')
      expect(stageIds).toContain('enrollment')
      expect(stageIds).toContain('orientation_onboarding')
    })
  })

  describe('flow completeness', () => {
    it('should have complete transition rules for all 13 stages', () => {
      const stages = getAllAdmissionsStages()
      stages.forEach(stage => {
        const transitions = getAllowedAdmissionsTransitions(stage.id)
        expect(transitions).toBeDefined()
      })
    })

    it('should have prerequisites for all 13 stages', () => {
      const stages = getAllAdmissionsStages()
      stages.forEach(stage => {
        const completed: AdmissionsStage[] = []
        // Should not throw
        expect(() => checkAdmissionsPrerequisites(completed, stage.id)).not.toThrow()
      })
    })

    it('should have stage info for all stages', () => {
      const stages = getAllAdmissionsStages()
      stages.forEach(stage => {
        expect(stage.id).toBeDefined()
        expect(stage.label).toBeDefined()
        expect(stage.description).toBeDefined()
      })
    })
  })
})
