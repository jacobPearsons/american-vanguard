import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import type { Quiz, QuizSession, QuizResult, Question } from '../types/assessment.types'

const STORAGE_KEY = 'quiz_session'
const AUTO_SAVE_INTERVAL = 10000 // 10 seconds

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function useQuizSession(quiz: Quiz) {
  // Shuffle questions if enabled
  const shuffledQuestions = useMemo(() => {
    if (!quiz.shuffleQuestions) return quiz.questions
    
    const questions = shuffleArray(quiz.questions)
    // Also shuffle options within each question
    return questions.map(q => ({
      ...q,
      options: shuffleArray(q.options)
    }))
  }, [quiz.questions, quiz.shuffleQuestions])
  const [session, setSession] = useState<QuizSession>({
    quizId: quiz.id,
    currentIndex: 0,
    answers: {},
    startTime: 0,
    isSubmitted: false,
    timeSpent: {},
  })
  const [hasStarted, setHasStarted] = useState(false)
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const sessionRef = useRef(session)
  sessionRef.current = session

  // Restore from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const stored = localStorage.getItem(`${STORAGE_KEY}_${quiz.id}`)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as QuizSession
        if (!parsed.isSubmitted) {
          setSession(parsed)
          setHasStarted(true)
        }
      } catch {
        localStorage.removeItem(`${STORAGE_KEY}_${quiz.id}`)
      }
    }
  }, [quiz.id])

  // Auto-save every 10 seconds
  useEffect(() => {
    if (!hasStarted || session.isSubmitted) return

    autoSaveTimerRef.current = setInterval(() => {
      localStorage.setItem(`${STORAGE_KEY}_${quiz.id}`, JSON.stringify(sessionRef.current))
    }, AUTO_SAVE_INTERVAL)

    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current)
      }
    }
  }, [hasStarted, quiz.id])

  const startQuiz = useCallback(() => {
    setSession((prev) => ({
      ...prev,
      startTime: Date.now(),
    }))
    setHasStarted(true)
  }, [])

  const selectAnswer = useCallback((questionId: string, optionId: string, isMultiSelect: boolean = false) => {
    setSession((prev) => {
      const currentAnswers = prev.answers[questionId] || []
      
      if (isMultiSelect) {
        // Toggle option for multi-select
        const isSelected = currentAnswers.includes(optionId)
        const newAnswers = isSelected
          ? currentAnswers.filter(id => id !== optionId)
          : [...currentAnswers, optionId]
        return {
          ...prev,
          answers: {
            ...prev.answers,
            [questionId]: newAnswers,
          },
        }
      }
      
      // Single select (replace previous answer)
      return {
        ...prev,
        answers: {
          ...prev.answers,
          [questionId]: [optionId],
        },
      }
    })
  }, [])

  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < shuffledQuestions.length) {
      setSession((prev) => ({
        ...prev,
        currentIndex: index,
      }))
    }
  }, [shuffledQuestions.length])

  const nextQuestion = useCallback(() => {
    setSession((prev) => {
      if (prev.currentIndex < shuffledQuestions.length - 1) {
        return { ...prev, currentIndex: prev.currentIndex + 1 }
      }
      return prev
    })
  }, [shuffledQuestions.length])

  const prevQuestion = useCallback(() => {
    setSession((prev) => {
      if (prev.currentIndex > 0) {
        return { ...prev, currentIndex: prev.currentIndex - 1 }
      }
      return prev
    })
  }, [])

  const submitQuiz = useCallback((): QuizResult => {
    let totalPoints = 0
    let earnedPoints = 0

    const questionResults = shuffledQuestions.map((question) => {
      totalPoints += question.points
      const selectedOptions = session.answers[question.id] || []
      const correctOptions = question.options
        .filter((o) => o.isCorrect)
        .map((o) => o.id)

      // Handle multi-select questions with partial credit
      const isMultiSelect = question.type === 'multiple-select' || question.allowMultiple === true
      
      let correct = false
      let pointsEarned = 0

      if (isMultiSelect) {
        // For multi-select: calculate partial credit based on correct selections
        const correctSelections = selectedOptions.filter(id => correctOptions.includes(id)).length
        const incorrectSelections = selectedOptions.filter(id => !correctOptions.includes(id)).length
        
        // Award points for correct selections, deduct for incorrect
        const totalCorrectAnswers = correctOptions.length
        if (correctSelections > 0 && incorrectSelections === 0 && correctSelections === totalCorrectAnswers) {
          // All correct - full points
          correct = true
          pointsEarned = question.points
        } else if (correctSelections > 0) {
          // Partial credit
          correct = false
          const partialCredit = (correctSelections - incorrectSelections) / totalCorrectAnswers
          pointsEarned = Math.max(0, Math.round(question.points * partialCredit))
        }
        // If no correct selections or has incorrect, 0 points
      } else {
        // Single select - all or nothing
        correct = 
          selectedOptions.length === correctOptions.length &&
          selectedOptions.every((id) => correctOptions.includes(id))
        pointsEarned = correct ? question.points : 0
      }
      
      earnedPoints += pointsEarned

      return {
        questionId: question.id,
        correct,
        selectedOptions,
        correctOptions,
        pointsEarned,
      }
    })

    const result: QuizResult = {
      score: earnedPoints,
      totalPoints,
      percentage: totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0,
      passed: totalPoints > 0 ? (earnedPoints / totalPoints) * 100 >= quiz.passingScore : false,
      questionResults,
    }

    setSession((prev) => ({ ...prev, isSubmitted: true }))
    localStorage.removeItem(`${STORAGE_KEY}_${quiz.id}`)
    
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current)
    }

    return result
  }, [quiz, session.answers, shuffledQuestions])

  const currentQuestion = shuffledQuestions[session.currentIndex]
  const selectedAnswers = session.answers[currentQuestion?.id] || []

  return {
    session,
    hasStarted,
    currentQuestion,
    currentIndex: session.currentIndex,
    totalQuestions: shuffledQuestions.length,
    selectedAnswers,
    isFirstQuestion: session.currentIndex === 0,
    isLastQuestion: session.currentIndex === shuffledQuestions.length - 1,
    startQuiz,
    selectAnswer,
    goToQuestion,
    nextQuestion,
    prevQuestion,
    submitQuiz,
  }
}
