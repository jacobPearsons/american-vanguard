/**
 * Verification Service Tests
 * Unit tests for verification code operations
 * 
 * Per docs/backend-architecture-framework.md:
 * - Testing must use Jest
 * - Services should be tested for business logic
 * 
 * Run with: bun test
 */

import {
  generateVerificationCode,
  validateVerificationCode,
  useVerificationCode,
  getVerificationSummary,
  revokeVerificationCode,
  canAccessInterview,
} from '@/services/verificationService'
import type { VerificationType } from '@/types/verification'

describe('verificationService', () => {
  beforeEach(() => {
    // Reset mock data before each test
    jest.clearAllMocks()
  })

  describe('generateVerificationCode', () => {
    it('should generate a unique verification code', async () => {
      const request = {
        userId: 'user-123',
        userEmail: 'test@example.com',
        type: 'skills_completion' as VerificationType,
      }
      
      const code = await generateVerificationCode(request)
      
      expect(code.code).toBeDefined()
      expect(code.code.length).toBeGreaterThan(0)
      expect(code.type).toBe('skills_completion')
      expect(code.status).toBe('active')
    })

    it('should generate codes with correct prefix', async () => {
      const request = {
        userId: 'user-456',
        userEmail: 'test2@example.com',
        type: 'interview_access' as const,
      }
      
      const code = await generateVerificationCode(request)
      
      // Codes should start with prefix per CODE_CONFIG
      expect(code.code).toContain('SK')
    })

    it('should set correct expiry time', async () => {
      const request = {
        userId: 'user-789',
        userEmail: 'test3@example.com',
        type: 'final_interview' as const,
      }
      
      const code = await generateVerificationCode(request)
      const now = new Date()
      
      expect(code.expiresAt.getTime()).toBeGreaterThan(now.getTime())
    })

    it('should return existing active code for same user and type', async () => {
      const request = {
        userId: 'user-same',
        userEmail: 'same@example.com',
        type: 'skills_completion' as const,
      }
      
      const code1 = await generateVerificationCode(request)
      const code2 = await generateVerificationCode(request)
      
      // Should return the same code (already exists)
      expect(code1.code).toBe(code2.code)
    })
  })

  describe('validateVerificationCode', () => {
    it('should validate a correct code', async () => {
      // First generate a code
      const generated = await generateVerificationCode({
        userId: 'validate-user-1',
        userEmail: 'validate@example.com',
        type: 'skills_completion',
      })
      
      // Then validate it
      const result = await validateVerificationCode({
        code: generated.code,
        type: 'skills_completion',
      })
      
      expect(result.valid).toBe(true)
      expect(result.message).toBe('Code is valid')
    })

    it('should reject an invalid code', async () => {
      const result = await validateVerificationCode({
        code: 'INVALID-CODE',
        type: 'skills_completion',
      })
      
      expect(result.valid).toBe(false)
    })

    it('should reject used codes', async () => {
      const generated = await generateVerificationCode({
        userId: 'used-user',
        userEmail: 'used@example.com',
        type: 'interview_access',
      })
      
      // Mark as used
      await useVerificationCode(generated.id)
      
      // Try to validate
      const result = await validateVerificationCode({
        code: generated.code,
        type: 'interview_access',
      })
      
      expect(result.valid).toBe(false)
      expect(result.message).toContain('already been used')
    })

    it('should reject expired codes', async () => {
      const request = {
        userId: 'expired-user',
        userEmail: 'expired@example.com',
        type: 'final_interview' as VerificationType,
      }
      
      const generated = await generateVerificationCode(request)
      
      // Manually expire the code
      const mockCode = generated as any
      mockCode.expiresAt = new Date(Date.now() - 1000)
      
      const result = await validateVerificationCode({
        code: generated.code,
        type: 'final_interview',
      })
      
      expect(result.valid).toBe(false)
    })
  })

  describe('useVerificationCode', () => {
    it('should mark a code as used', async () => {
      const generated = await generateVerificationCode({
        userId: 'use-user',
        userEmail: 'use@example.com',
        type: 'skills_completion',
      })
      
      const result = await useVerificationCode(generated.id)
      
      expect(result.valid).toBe(true)
    })

    it('should fail for non-existent code', async () => {
      const result = await useVerificationCode('non-existent-id')
      
      expect(result.valid).toBe(false)
      expect(result.message).toBe('Code not found')
    })
  })

  describe('getVerificationSummary', () => {
    it('should return summary with correct structure', async () => {
      const summary = await getVerificationSummary('any-user')
      
      expect(summary).toHaveProperty('hasActiveCode')
      expect(summary).toHaveProperty('activeCode')
      expect(summary).toHaveProperty('expiresAt')
      expect(summary).toHaveProperty('type')
      expect(summary).toHaveProperty('canAccessInterview')
    })

    it('should return correct summary after generating code', async () => {
      const userId = 'summary-user'
      
      // Generate a code
      await generateVerificationCode({
        userId,
        userEmail: 'summary@example.com',
        type: 'interview_access',
      })
      
      const summary = await getVerificationSummary(userId)
      
      expect(summary.hasActiveCode).toBe(true)
      expect(summary.canAccessInterview).toBe(true)
    })
  })

  describe('revokeVerificationCode', () => {
    it('should revoke an existing code', async () => {
      const generated = await generateVerificationCode({
        userId: 'revoke-user',
        userEmail: 'revoke@example.com',
        type: 'skills_completion',
      })
      
      const result = await revokeVerificationCode(generated.id)
      expect(result).toBe(true)
    })

    it('should return false for non-existent code', async () => {
      const result = await revokeVerificationCode('non-existent')
      expect(result).toBe(false)
    })
  })

  describe('canAccessInterview', () => {
    it('should check interview access correctly', async () => {
      const userId = 'access-user'
      
      // Generate code
      await generateVerificationCode({
        userId,
        userEmail: 'access@example.com',
        type: 'interview_access',
      })
      
      const hasAccess = await canAccessInterview(userId, 'interview_access')
      expect(hasAccess).toBe(true)
    })

    it('should deny access without valid code', async () => {
      const hasAccess = await canAccessInterview('non-existent-user', 'interview_access')
      expect(hasAccess).toBe(false)
    })
  })
})
