/**
 * Authentication Service
 * 
 * Handles user authentication using Clerk
 * Session management is handled by Clerk middleware
 */

import { currentUser, auth } from '@clerk/nextjs/server'
import { db } from '@/lib/prisma'
import type { AuthUser } from '@/types/auth'

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const user = await currentUser()
    
    if (!user) {
      return null
    }

    return {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      role: 'student',
    }
  } catch {
    return null
  }
}

export async function getCurrentUserId(): Promise<string | null> {
  try {
    const { userId } = await auth()
    return userId
  } catch {
    return null
  }
}

export async function getUserFromDatabase(clerkId: string) {
  return db.user.findUnique({
    where: { clerkId },
  })
}

export async function isAuthenticated(): Promise<boolean> {
  const userId = await getCurrentUserId()
  return userId !== null
}
