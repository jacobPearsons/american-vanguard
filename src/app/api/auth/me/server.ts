/**
 * Server-side authentication utilities
 * 
 * Functions for server components to check authentication
 */

import { cookies } from 'next/headers'
import type { AuthUser } from '@/types/auth'

/**
 * Get current user from server-side session cookie
 */
export async function getServerUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('avi_session')

    if (!sessionCookie?.value) {
      return null
    }

    const sessionData = JSON.parse(sessionCookie.value) as AuthUser & { exp: number }
    
    // Check if session is expired
    if (sessionData.exp * 1000 < Date.now()) {
      return null
    }

    return {
      id: sessionData.id,
      email: sessionData.email,
      firstName: sessionData.firstName,
      lastName: sessionData.lastName,
      matricNumber: sessionData.matricNumber,
      role: sessionData.role,
    }
  } catch {
    return null
  }
}

/**
 * Check if user is authenticated (server-side)
 */
export async function isServerAuthenticated(): Promise<boolean> {
  const user = await getServerUser()
  return user !== null
}
