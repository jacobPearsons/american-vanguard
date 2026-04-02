/**
 * useAuth Hook
 * 
 * Client-side authentication hook using Clerk
 */

'use client'

import { useUser, useSignIn, useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

export function useAuth() {
  const { user, isLoaded: isUserLoaded } = useUser()
  const { signIn, isLoaded: isSignInLoaded } = useSignIn()
  const { signUp, isLoaded: isSignUpLoaded } = useSignUp()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const isLoading = !isUserLoaded || !isSignInLoaded || !isSignUpLoaded || isProcessing

  const login = useCallback(async (email: string, password: string) => {
    if (!signIn) {
      return { success: false, error: 'Sign in not available' }
    }

    setIsProcessing(true)
    setError(null)

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      })

      if (result.status === 'complete') {
        router.push('/student/dashboard')
        return { success: true }
      } else {
        return { success: false, error: 'Sign in requires additional steps' }
      }
    } catch (err: any) {
      const errorMessage = err.errors?.[0]?.message || err.message || 'Sign in failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsProcessing(false)
    }
  }, [signIn, router])

  const register = useCallback(async (email: string, password: string, firstName: string, lastName: string) => {
    if (!signUp) {
      return { success: false, error: 'Sign up not available' }
    }

    setIsProcessing(true)
    setError(null)

    try {
      const result = await signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
      })

      if (result.status === 'complete') {
        router.push('/student/dashboard')
        return { success: true }
      } else {
        return { success: false, error: 'Sign up requires additional steps' }
      }
    } catch (err: any) {
      const errorMessage = err.errors?.[0]?.message || err.message || 'Sign up failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsProcessing(false)
    }
  }, [signUp, router])

  const logout = useCallback(async () => {
    router.push('/sign-in')
  }, [router])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const checkUser = useCallback(() => {
    if (user) {
      return {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        imageUrl: user.imageUrl || '',
      }
    }
    return null
  }, [user])

  useEffect(() => {
    if (isUserLoaded && !user) {
      // User not authenticated, could redirect
    }
  }, [isUserLoaded, user])

  return {
    user: user ? {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
    } : null,
    loading: isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    checkUser,
  }
}
