/**
 * Auth Service Tests
 * 
 * Tests for Clerk-based authentication system
 * Following patterns from docs/testing-infrastructure.md
 */

import { getCurrentUser, getCurrentUserId, getUserFromDatabase, isAuthenticated } from '@/services/authService'
import { db } from '@/lib/db'

const mockCurrentUser = jest.fn()
const mockAuth = jest.fn()
const mockFindUnique = jest.fn()

jest.mock('@clerk/nextjs/server', () => ({
  currentUser: (...args: unknown[]) => mockCurrentUser(...args),
  auth: (...args: unknown[]) => mockAuth(...args),
}))

jest.mock('@/lib/db', () => ({
  db: {
    user: {
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
    },
  },
}))

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockCurrentUser.mockResolvedValue(null)
    mockAuth.mockResolvedValue({ userId: null })
    mockFindUnique.mockResolvedValue(null)
  })

  describe('getCurrentUser', () => {
    it('should return user when Clerk session exists', async () => {
      const mockClerkUser = {
        id: 'user_123',
        emailAddresses: [{ emailAddress: 'student@avi.edu' }],
        firstName: 'John',
        lastName: 'Doe',
      }

      mockCurrentUser.mockResolvedValue(mockClerkUser)

      const user = await getCurrentUser()

      expect(user).toBeDefined()
      expect(user?.id).toBe('user_123')
      expect(user?.email).toBe('student@avi.edu')
      expect(user?.firstName).toBe('John')
      expect(user?.lastName).toBe('Doe')
      expect(user?.role).toBe('student')
    })

    it('should return null when no Clerk session', async () => {
      mockCurrentUser.mockResolvedValue(null)

      const user = await getCurrentUser()

      expect(user).toBeNull()
    })

    it('should return null when Clerk throws an error', async () => {
      mockCurrentUser.mockRejectedValue(new Error('Clerk error'))

      const user = await getCurrentUser()

      expect(user).toBeNull()
    })

    it('should handle missing email gracefully', async () => {
      const mockClerkUser = {
        id: 'user_123',
        emailAddresses: [],
        firstName: 'John',
        lastName: 'Doe',
      }

      mockCurrentUser.mockResolvedValue(mockClerkUser)

      const user = await getCurrentUser()

      expect(user).toBeDefined()
      expect(user?.email).toBe('')
    })

    it('should handle missing firstName and lastName', async () => {
      const mockClerkUser = {
        id: 'user_123',
        emailAddresses: [{ emailAddress: 'student@avi.edu' }],
        firstName: null,
        lastName: null,
      }

      mockCurrentUser.mockResolvedValue(mockClerkUser)

      const user = await getCurrentUser()

      expect(user).toBeDefined()
      expect(user?.firstName).toBe('')
      expect(user?.lastName).toBe('')
    })
  })

  describe('getCurrentUserId', () => {
    it('should return user ID when authenticated', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })

      const userId = await getCurrentUserId()

      expect(userId).toBe('user_123')
    })

    it('should return null when not authenticated', async () => {
      mockAuth.mockResolvedValue({ userId: null })

      const userId = await getCurrentUserId()

      expect(userId).toBeNull()
    })

    it('should return null when auth throws an error', async () => {
      mockAuth.mockRejectedValue(new Error('Auth error'))

      const userId = await getCurrentUserId()

      expect(userId).toBeNull()
    })
  })

  describe('getUserFromDatabase', () => {
    it('should return user from database by clerkId', async () => {
      const mockDbUser = {
        id: 1,
        clerkId: 'user_123',
        email: 'student@avi.edu',
        firstName: 'John',
        lastName: 'Doe',
      }

      mockFindUnique.mockResolvedValue(mockDbUser)

      const user = await getUserFromDatabase('user_123')

      expect(user).toBeDefined()
      expect(user?.clerkId).toBe('user_123')
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { clerkId: 'user_123' },
      })
    })

    it('should return null when user not found', async () => {
      mockFindUnique.mockResolvedValue(null)

      const user = await getUserFromDatabase('nonexistent')

      expect(user).toBeNull()
    })
  })

  describe('isAuthenticated', () => {
    it('should return true when user is authenticated', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' })

      const result = await isAuthenticated()

      expect(result).toBe(true)
    })

    it('should return false when user is not authenticated', async () => {
      mockAuth.mockResolvedValue({ userId: null })

      const result = await isAuthenticated()

      expect(result).toBe(false)
    })

    it('should return false when auth throws an error', async () => {
      mockAuth.mockRejectedValue(new Error('Auth error'))

      const result = await isAuthenticated()

      expect(result).toBe(false)
    })
  })

  describe('integration scenarios', () => {
    it('should handle full authentication flow', async () => {
      const mockClerkUser = {
        id: 'user_456',
        emailAddresses: [{ emailAddress: 'instructor@avi.edu' }],
        firstName: 'Jane',
        lastName: 'Smith',
      }

      const mockDbUser = {
        id: 2,
        clerkId: 'user_456',
        email: 'instructor@avi.edu',
        firstName: 'Jane',
        lastName: 'Smith',
      }

      mockCurrentUser.mockResolvedValue(mockClerkUser)
      mockAuth.mockResolvedValue({ userId: 'user_456' })
      mockFindUnique.mockResolvedValue(mockDbUser)

      const user = await getCurrentUser()
      const userId = await getCurrentUserId()
      const isAuth = await isAuthenticated()
      const dbUser = await getUserFromDatabase('user_456')

      expect(user).toBeDefined()
      expect(user?.id).toBe('user_456')
      expect(userId).toBe('user_456')
      expect(isAuth).toBe(true)
      expect(dbUser).toBeDefined()
    })

    it('should handle unauthenticated scenario', async () => {
      mockCurrentUser.mockResolvedValue(null)
      mockAuth.mockResolvedValue({ userId: null })

      const user = await getCurrentUser()
      const userId = await getCurrentUserId()
      const isAuth = await isAuthenticated()

      expect(user).toBeNull()
      expect(userId).toBeNull()
      expect(isAuth).toBe(false)
    })
  })
})
