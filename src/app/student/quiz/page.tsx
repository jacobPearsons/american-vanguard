'use client'

import { useState } from 'react'
import { StudentLayout } from '@/components/features/student-dashboard'
import { Card } from '@/components/ui/card'

type QuizStatus = 'available' | 'in-progress' | 'completed'

interface QuizItem {
  id: string
  courseCode: string
  courseName: string
  title: string
  description: string
  status: QuizStatus
  attemptsUsed: number
  maxAttempts: number
  bestScore?: number
  passingScore: number
  timeLimit: number
  totalQuestions: number
  dueDate?: string
}

const mockQuizzes: QuizItem[] = [
  {
    id: 'quiz-1',
    courseCode: 'EEE 501',
    courseName: 'Advanced Power Systems',
    title: 'Power Systems Basics',
    description: 'Test your knowledge of power systems fundamentals including transformers, transmission lines, and distribution systems.',
    status: 'completed',
    attemptsUsed: 2,
    maxAttempts: 3,
    bestScore: 85,
    passingScore: 70,
    timeLimit: 30,
    totalQuestions: 10,
    dueDate: '2025-03-15',
  },
  {
    id: 'quiz-2',
    courseCode: 'EEE 503',
    courseName: 'Digital Signal Processing',
    title: 'DSP Fundamentals',
    description: 'Covering discrete-time signals, Fourier transforms, and filter design concepts.',
    status: 'in-progress',
    attemptsUsed: 1,
    maxAttempts: 3,
    passingScore: 70,
    timeLimit: 45,
    totalQuestions: 15,
    dueDate: '2025-04-01',
  },
  {
    id: 'quiz-3',
    courseCode: 'EEE 505',
    courseName: 'Control Systems II',
    title: 'State Space Analysis',
    description: 'State-space representation, controllability, observability, and controller design.',
    status: 'available',
    attemptsUsed: 0,
    maxAttempts: 3,
    passingScore: 70,
    timeLimit: 60,
    totalQuestions: 20,
    dueDate: '2025-04-15',
  },
  {
    id: 'quiz-4',
    courseCode: 'EEE 507',
    courseName: 'Microelectronics',
    title: 'Semiconductor Devices',
    description: 'PN junctions, BJTs, MOSFETs, and integrated circuit fundamentals.',
    status: 'available',
    attemptsUsed: 0,
    maxAttempts: 2,
    passingScore: 60,
    timeLimit: 40,
    totalQuestions: 12,
  },
  {
    id: 'quiz-5',
    courseCode: 'EEE 501',
    courseName: 'Advanced Power Systems',
    title: 'Renewable Energy Systems',
    description: 'Solar PV systems, wind turbines, and grid integration challenges.',
    status: 'completed',
    attemptsUsed: 1,
    maxAttempts: 3,
    bestScore: 92,
    passingScore: 70,
    timeLimit: 35,
    totalQuestions: 15,
  },
]

function getStatusBadge(status: QuizStatus) {
  const styles = {
    available: 'bg-green-500/20 text-green-400 border-green-500/30',
    'in-progress': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  }
  const labels = {
    available: 'Available',
    'in-progress': 'In Progress',
    completed: 'Completed',
  }
  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}

function QuizCard({ quiz }: { quiz: QuizItem }) {
  return (
    <Card className="bg-neutral-900 border-neutral-800 hover:border-neutral-700 transition-colors p-5">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-medium text-yellow-500">{quiz.courseCode}</span>
            {getStatusBadge(quiz.status)}
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">{quiz.title}</h3>
          <p className="text-sm text-neutral-400 mb-3">{quiz.courseName}</p>
          <p className="text-sm text-neutral-500 line-clamp-2 mb-4">{quiz.description}</p>
          
          <div className="flex flex-wrap gap-4 text-sm text-neutral-400">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{quiz.timeLimit} min</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{quiz.totalQuestions} questions</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{quiz.attemptsUsed}/{quiz.maxAttempts} attempts</span>
            </div>
            {quiz.bestScore && (
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Best: {quiz.bestScore}%</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-2 sm:min-w-[140px]">
          {quiz.status === 'available' && (
            <a
              href={`/student/quiz/${quiz.id}`}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-neutral-950 font-medium rounded-lg text-center transition-colors"
            >
              Start Quiz
            </a>
          )}
          {quiz.status === 'in-progress' && (
            <a
              href={`/student/quiz/${quiz.id}`}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-neutral-950 font-medium rounded-lg text-center transition-colors"
            >
              Continue
            </a>
          )}
          {quiz.status === 'completed' && (
            <a
              href={`/student/quiz/${quiz.id}`}
              className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white font-medium rounded-lg text-center transition-colors"
            >
              View Results
            </a>
          )}
        </div>
      </div>
    </Card>
  )
}

export default function QuizListPage() {
  const [filter, setFilter] = useState<QuizStatus | 'all'>('all')
  
  const filteredQuizzes = filter === 'all' 
    ? mockQuizzes 
    : mockQuizzes.filter(q => q.status === filter)
  
  const filters: { value: QuizStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All Quizzes' },
    { value: 'available', label: 'Available' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ]

  return (
    <StudentLayout studentName="Adeniyi Victor Ayomide">
      <div className="min-h-screen bg-neutral-950">
        <div className="bg-neutral-900 border-b border-neutral-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Quizzes</h1>
              <p className="text-sm text-neutral-400 mt-1">View and take quizzes for your registered courses</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {filters.map(f => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === f.value
                      ? 'bg-yellow-500 text-neutral-950'
                      : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredQuizzes.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-12 h-12 mx-auto text-neutral-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-neutral-400">No quizzes found</p>
              </div>
            ) : (
              filteredQuizzes.map(quiz => (
                <QuizCard key={quiz.id} quiz={quiz} />
              ))
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  )
}
