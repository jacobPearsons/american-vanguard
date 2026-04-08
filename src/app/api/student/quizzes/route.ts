import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export const dynamic = 'force-dynamic'

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

interface QuizItem {
  id: string
  courseCode: string
  courseName: string
  title: string
  description: string
  status: 'available' | 'in-progress' | 'completed'
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

export async function GET(_request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return errorResponse('Unauthorized', 401)
    }

    return NextResponse.json({ quizzes: mockQuizzes })
  } catch (error) {
    console.error('Student Quizzes GET error:', error)
    return errorResponse('Internal server error', 500)
  }
}
