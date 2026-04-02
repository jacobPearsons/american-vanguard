import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'

const ExamSchema = z.object({
  courseCode: z.string().min(1),
  courseName: z.string().min(1),
  date: z.string(),
  time: z.string(),
  venue: z.string(),
  type: z.enum(['Midterm', 'Final', 'Quiz', 'Assignment']),
  duration: z.number().optional(),
  instructions: z.string().optional(),
})

const UpdateExamSchema = ExamSchema.partial()

// Mock data - replace with DB calls
const mockExams = [
  { id: '1', courseCode: 'EEE 501', courseName: 'Advanced Power Systems', date: '2026-04-15', time: '09:00 AM', venue: 'Hall A', type: 'Midterm', duration: 120 },
  { id: '2', courseCode: 'EEE 503', courseName: 'Digital Signal Processing', date: '2026-04-18', time: '02:00 PM', venue: 'Hall B', type: 'Midterm', duration: 120 },
  { id: '3', courseCode: 'EEE 505', courseName: 'Control Systems II', date: '2026-04-20', time: '10:00 AM', venue: 'Hall C', type: 'Final', duration: 180 },
  { id: '4', courseCode: 'CS301', courseName: 'Data Structures', date: '2026-04-22', time: '11:00 AM', venue: 'Lab 1', type: 'Quiz', duration: 60 },
  { id: '5', courseCode: 'MATH201', courseName: 'Linear Algebra', date: '2026-04-25', time: '09:00 AM', venue: 'Hall B', type: 'Final', duration: 150 },
]

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const courseCode = searchParams.get('courseCode')
    const type = searchParams.get('type')
    const upcoming = searchParams.get('upcoming')

    let exams = [...mockExams]

    // Filter by course code
    if (courseCode) {
      exams = exams.filter(e => e.courseCode === courseCode)
    }

    // Filter by type
    if (type) {
      exams = exams.filter(e => e.type === type)
    }

    // Filter upcoming only
    if (upcoming === 'true') {
      const today = new Date()
      exams = exams.filter(e => new Date(e.date) >= today)
    }

    return NextResponse.json({ exams })
  } catch (error) {
    console.error('Exams GET error:', error)
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
    const result = ExamSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation error', details: result.error.errors },
        { status: 400 }
      )
    }

    const newExam = {
      id: String(mockExams.length + 1),
      ...result.data,
    }

    // TODO: Save to database
    // await db.exam.create({ data: newExam })

    return NextResponse.json({ exam: newExam }, { status: 201 })
  } catch (error) {
    console.error('Exams POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
