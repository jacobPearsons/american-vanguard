'use client'

import { useEffect } from 'react'

export function usePWA() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration.scope)
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error)
        })
    }
  }, [])

  const isPWA = typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches

  return { isPWA }
}

export default usePWA