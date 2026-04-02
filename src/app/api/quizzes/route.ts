import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'

const QuizSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  courseCode: z.string().min(1),
  courseName: z.string().min(1),
  timeLimit: z.number().min(1),
  passingScore: z.number().min(0).max(100),
  maxAttempts: z.number().min(1).optional(),
  shuffleQuestions: z.boolean().optional(),
  showCorrectAnswers: z.boolean().optional(),
  questions: z.array(z.object({
    type: z.enum(['multiple-choice', 'true-false', 'multiple-select']),
    text: z.string().min(1),
    options: z.array(z.object({
      text: z.string(),
      isCorrect: z.boolean(),
    })),
    points: z.number().min(1),
  })).optional(),
})

// Mock data - replace with DB calls
const mockQuizzes = [
  {
    id: 'quiz-1',
    courseCode: 'EEE 501',
    courseName: 'Advanced Power Systems',
    title: 'Power Systems Basics',
    description: 'Test your knowledge of power systems fundamentals',
    timeLimit: 30,
    passingScore: 70,
    maxAttempts: 3,
    questionCount: 5,
    status: 'available',
    dueDate: '2026-04-20',
  },
  {
    id: 'quiz-2',
    courseCode: 'EEE 503',
    courseName: 'Digital Signal Processing',
    title: 'Signal Processing',
    description: 'Practice problems for DSP',
    timeLimit: 20,
    passingScore: 60,
    maxAttempts: 2,
    questionCount: 15,
    status: 'available',
    dueDate: '2026-04-25',
  },
  {
    id: 'quiz-3',
    courseCode: 'EEE 505',
    courseName: 'Control Systems II',
    title: 'Control Fundamentals',
    description: 'Midterm preparation quiz',
    timeLimit: 40,
    passingScore: 70,
    maxAttempts: 1,
    questionCount: 25,
    status: 'locked',
    dueDate: null,
  },
  {
    id: 'quiz-4',
    courseCode: 'CS301',
    courseName: 'Data Structures',
    title: 'Arrays and Linked Lists',
    description: 'Basic data structures review',
    timeLimit: 25,
    passingScore: 65,
    maxAttempts: 3,
    questionCount: 10,
    status: 'completed',
    score: 85,
    dueDate: '2026-03-15',
  },
]

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const courseCode = searchParams.get('courseCode')
    const status = searchParams.get('status')

    let quizzes = [...mockQuizzes]

    if (courseCode) {
      quizzes = quizzes.filter(q => q.courseCode === courseCode)
    }

    if (status) {
      quizzes = quizzes.filter(q => q.status === status)
    }

    return NextResponse.json({ quizzes })
  } catch (error) {
    console.error('Quizzes GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const result = QuizSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation error', details: result.error.errors },
        { status: 400 }
      )
    }

    const newQuiz = {
      id: `quiz-${Date.now()}`,
      ...result.data,
      questionCount: result.data.questions?.length || 0,
      status: 'draft',
    }

    // TODO: Save to database
    // await db.quiz.create({ data: newQuiz })

    return NextResponse.json({ quiz: newQuiz }, { status: 201 })
  } catch (error) {
    console.error('Quizzes POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
