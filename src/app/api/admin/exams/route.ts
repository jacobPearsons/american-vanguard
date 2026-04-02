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
  semester: z.string(),
  academicYear: z.string(),
})

// Mock data
const mockExams = [
  { id: '1', courseCode: 'EEE 501', courseName: 'Advanced Power Systems', date: '2026-04-15', time: '09:00', venue: 'Hall A', type: 'Midterm', duration: 120, semester: 'Spring 2026', academicYear: '2025/2026' },
  { id: '2', courseCode: 'EEE 503', courseName: 'Digital Signal Processing', date: '2026-04-18', time: '14:00', venue: 'Hall B', type: 'Midterm', duration: 120, semester: 'Spring 2026', academicYear: '2025/2026' },
  { id: '3', courseCode: 'EEE 505', courseName: 'Control Systems II', date: '2026-04-20', time: '10:00', venue: 'Hall C', type: 'Final', duration: 180, semester: 'Spring 2026', academicYear: '2025/2026' },
]

// GET - List all exams with filters
// POST - Create new exam
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const courseCode = searchParams.get('courseCode')
    const semester = searchParams.get('semester')
    const academicYear = searchParams.get('academicYear')

    let exams = [...mockExams]

    if (courseCode) exams = exams.filter(e => e.courseCode === courseCode)
    if (semester) exams = exams.filter(e => e.semester === semester)
    if (academicYear) exams = exams.filter(e => e.academicYear === academicYear)

    return NextResponse.json({ exams })
  } catch (error) {
    console.error('Admin exams GET error:', error)
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
      id: String(Date.now()),
      ...result.data,
    }

    // TODO: Save to database
    // await db.exam.create({ data: newExam })

    return NextResponse.json({ exam: newExam }, { status: 201 })
  } catch (error) {
    console.error('Admin exams POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
