import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'

const GradeSchema = z.object({
  studentId: z.string().min(1),
  studentName: z.string().min(1),
  courseCode: z.string().min(1),
  courseName: z.string().min(1),
  semester: z.string(),
  academicYear: z.string(),
  score: z.number().min(0).max(100),
  grade: z.string(),
  credits: z.number().optional(),
})

// Mock data
const mockGrades = [
  { id: '1', studentId: 'STU001', studentName: 'John Doe', courseCode: 'EEE 501', courseName: 'Advanced Power Systems', semester: 'Fall 2025', academicYear: '2025/2026', score: 92, grade: 'A', credits: 3 },
  { id: '2', studentId: 'STU001', studentName: 'John Doe', courseCode: 'EEE 503', courseName: 'Digital Signal Processing', semester: 'Fall 2025', academicYear: '2025/2026', score: 88, grade: 'B+', credits: 3 },
  { id: '3', studentId: 'STU002', studentName: 'Jane Smith', courseCode: 'EEE 501', courseName: 'Advanced Power Systems', semester: 'Fall 2025', academicYear: '2025/2026', score: 95, grade: 'A', credits: 3 },
  { id: '4', studentId: 'STU003', studentName: 'Bob Wilson', courseCode: 'CS301', courseName: 'Data Structures', semester: 'Fall 2025', academicYear: '2025/2026', score: 78, grade: 'B', credits: 3 },
]

function calculateGrade(score: number): string {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'F'
}

// GET - List all grades with filters
// POST - Create/update grade
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const courseCode = searchParams.get('courseCode')
    const semester = searchParams.get('semester')
    const academicYear = searchParams.get('academicYear')

    let grades = [...mockGrades]

    if (studentId) grades = grades.filter(g => g.studentId === studentId)
    if (courseCode) grades = grades.filter(g => g.courseCode === courseCode)
    if (semester) grades = grades.filter(g => g.semester === semester)
    if (academicYear) grades = grades.filter(g => g.academicYear === academicYear)

    // Calculate GPA
    const totalCredits = grades.reduce((sum, g) => sum + (g.credits || 0), 0)
    const gradePoints: Record<string, number> = { 'A': 4.0, 'B': 3.0, 'C': 2.0, 'D': 1.0, 'F': 0.0 }
    const totalPoints = grades.reduce((sum, g) => sum + (gradePoints[g.grade] * (g.credits || 0)), 0)
    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00'

    return NextResponse.json({ grades, gpa: parseFloat(gpa) })
  } catch (error) {
    console.error('Admin grades GET error:', error)
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
    const result = GradeSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation error', details: result.error.errors },
        { status: 400 }
      )
    }

    const gradeData = {
      ...result.data,
      grade: result.data.grade || calculateGrade(result.data.score),
    }

    // Check if grade exists for update
    const existingIndex = mockGrades.findIndex(
      g => g.studentId === gradeData.studentId && 
           g.courseCode === gradeData.courseCode &&
           g.semester === gradeData.semester
    )

    if (existingIndex >= 0) {
      // Update existing
      const updatedGrade = { ...mockGrades[existingIndex], ...gradeData, id: mockGrades[existingIndex].id, credits: gradeData.credits || 3 }
      mockGrades[existingIndex] = updatedGrade
      return NextResponse.json({ grade: updatedGrade })
    }

    // Create new
    const newGrade = {
      id: String(Date.now()),
      ...gradeData,
      credits: gradeData.credits || 3,
    }
    mockGrades.push(newGrade)

    // TODO: Save to database
    // await db.grade.create({ data: newGrade })

    return NextResponse.json({ grade: newGrade }, { status: 201 })
  } catch (error) {
    console.error('Admin grades POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
