import { useState, useEffect, useCallback, useRef, useMemo } from 'react'

interface UseTimerOptions {
  initialTime: number // in seconds
  onTimeUp?: () => void
  autoStart?: boolean
}

export function useTimer({ initialTime, onTimeUp, autoStart = false }: UseTimerOptions) {
  const [timeLeft, setTimeLeft] = useState(initialTime)
  const [isRunning, setIsRunning] = useState(autoStart)
  const onTimeUpRef = useRef(onTimeUp)

  useEffect(() => {
    onTimeUpRef.current = onTimeUp
  }, [onTimeUp])

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false)
          onTimeUpRef.current?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning])

  const start = useCallback(() => setIsRunning(true), [])
  const pause = useCallback(() => setIsRunning(false), [])
  const reset = useCallback((newTime?: number) => {
    setTimeLeft(newTime ?? initialTime)
    setIsRunning(false)
  }, [initialTime])

  const formatTime = useMemo(() => (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }, [])

  const isWarning = useMemo(() => timeLeft > 0 && timeLeft <= 60, [timeLeft])
  const formattedTime = useMemo(() => formatTime(timeLeft), [formatTime, timeLeft])

  return {
    timeLeft,
    isRunning,
    isWarning,
    formattedTime,
    start,
    pause,
    reset,
  }
}
