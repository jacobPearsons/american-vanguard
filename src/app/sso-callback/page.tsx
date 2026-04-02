'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SSOCallback() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    // Clerk automatically handles the OAuth callback
    // Just wait a moment and redirect
    const timer = setTimeout(() => {
      // Check if we have a Clerk session
      fetch('/api/auth/me')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            router.push('/dashboard')
          } else {
            router.push('/sign-in?error=oauth_error')
          }
        })
        .catch(() => {
          router.push('/sign-in?error=oauth_error')
        })
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-neutral-400">Completing sign in...</p>
      </div>
    </div>
  )
}
