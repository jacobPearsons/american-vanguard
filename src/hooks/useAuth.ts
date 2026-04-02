/**
 * useAuth Hook
 * 
 * Client-side authentication hook using Clerk
 */

'use client'

import { useUser, useSignIn, useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export function useAuth() {
  const { user, isLoaded: isUserLoaded } = useUser()
  const { signIn, isLoaded: isSignInLoaded } = useSignIn()
  const { signUp, isLoaded: isSignUpLoaded } = useSignUp()
  const router = useRouter()

  const isLoading = !isUserLoaded || !isSignInLoaded || !isSignUpLoaded

  const login = useCallback(async (email: string, password: string) => {
    if (!signIn) {
      return { success: false, error: 'Sign in not available' }
    }

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      })

      if (result.status === 'complete') {
        router.push('/dashboard')
        return { success: true }
      } else {
        return { success: false, error: 'Sign in requires additional steps' }
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Sign in failed' }
    }
  }, [signIn, router])

  const register = useCallback(async (email: string, password: string, firstName: string, lastName: string) => {
    if (!signUp) {
      return { success: false, error: 'Sign up not available' }
    }

    try {
      const result = await signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
      })

      if (result.status === 'complete') {
        router.push('/dashboard')
        return { success: true }
      } else {
        return { success: false, error: 'Sign up requires additional steps' }
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Sign up failed' }
    }
  }, [signUp, router])

  const logout = useCallback(async () => {
    router.push('/sign-in')
  }, [router])

  return {
    user: user ? {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
    } : null,
    loading: isLoading,
    error: null,
    login,
    register,
    logout,
    clearError: () => {},
    checkUser: () => {},
  }
}
