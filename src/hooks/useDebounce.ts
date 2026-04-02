/**
 * useDebounce Hook
 * Purpose: Delays value update until after specified delay
 * 
 * Per docs/component-design-rules.md:
 * - Logic should be in hooks, not components
 * - Hooks must be reusable
 */

import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
