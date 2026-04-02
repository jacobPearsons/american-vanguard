'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { QuizInstructions } from './quiz-instructions'
import { QuizQuestion } from './quiz-question'
import { QuizNavigation } from './quiz-navigation'
import { QuizTimer } from './quiz-timer'
import { QuizProgress } from './quiz-progress'
import { QuizResults } from './quiz-results'
import { useTimer } from '../../hooks/use-timer'
import { useQuizSession } from '../../hooks/use-quiz-session'
import type { Quiz, QuizResult } from '../../types/assessment.types'

interface QuizContainerProps {
  quiz: Quiz
  useServerGrading?: boolean
}

export function QuizContainer({ quiz, useServerGrading = false }: QuizContainerProps) {
  const router = useRouter()
  const [result, setResult] = useState<QuizResult | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    session,
    hasStarted,
    currentQuestion,
    currentIndex,
    totalQuestions,
    selectedAnswers,
    isFirstQuestion,
    isLastQuestion,
    startQuiz,
    selectAnswer,
    nextQuestion,
    prevQuestion,
    submitQuiz,
  } = useQuizSession(quiz)

  const { timeLeft, formattedTime, isWarning, start: startTimer } = useTimer({
    initialTime: quiz.timeLimit * 60,
    onTimeUp: handleTimeUp,
    autoStart: false,
  })

  function handleTimeUp() {
    const quizResult = submitQuiz()
    setResult(quizResult)
  }

  const handleStart = useCallback(() => {
    startQuiz()
    startTimer()
  }, [startQuiz, startTimer])

  const handleSubmit = useCallback(async () => {
    if (useServerGrading) {
      // Server-side grading
      setIsSubmitting(true)
      setSubmitError(null)
      
      try {
        const response = await fetch(`/api/quiz/${quiz.id}/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            quizId: quiz.id,
            answers: session.answers,
            timeSpent: session.timeSpent,
          }),
        })
        
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to submit quiz')
        }
        
        setResult(data.result)
      } catch (error) {
        console.error('Submission error:', error)
        setSubmitError(error instanceof Error ? error.message : 'Failed to submit quiz')
        // Fall back to client-side grading
        const quizResult = submitQuiz()
        setResult(quizResult)
      } finally {
        setIsSubmitting(false)
      }
    } else {
      // Client-side grading
      const quizResult = submitQuiz()
      setResult(quizResult)
    }
  }, [submitQuiz, useServerGrading, quiz.id, session.answers, session.timeSpent])

  const handleRetake = useCallback(() => {
    router.refresh()
  }, [router])

  // Keyboard navigation
  useEffect(() => {
    if (!hasStarted || result) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && !isLastQuestion) {
        nextQuestion()
      } else if (e.key === 'ArrowLeft' && !isFirstQuestion) {
        prevQuestion()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [hasStarted, result, isLastQuestion, isFirstQuestion, nextQuestion, prevQuestion])

  if (result) {
    return <QuizResults result={result} questions={quiz.questions} onRetake={handleRetake} />
  }

  if (!hasStarted) {
    return (
      <QuizInstructions
        title={quiz.title}
        description={quiz.description}
        timeLimit={quiz.timeLimit}
        questionCount={quiz.questions.length}
        passingScore={quiz.passingScore}
        onStart={handleStart}
      />
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <QuizProgress current={currentIndex} total={totalQuestions} />
        <QuizTimer
          timeLeft={timeLeft}
          formattedTime={formattedTime}
          isWarning={isWarning}
        />
      </div>

      {currentQuestion && (
        <QuizQuestion
          question={currentQuestion}
          selectedOptions={selectedAnswers}
          onSelect={(optionId, isMultiSelect) => selectAnswer(currentQuestion.id, optionId, isMultiSelect)}
        />
      )}

      {submitError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {submitError}
        </div>
      )}

      <QuizNavigation
        onPrevious={prevQuestion}
        onNext={nextQuestion}
        onSubmit={handleSubmit}
        isFirst={isFirstQuestion}
        isLast={isLastQuestion}
        hasAnswer={selectedAnswers.length > 0}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
