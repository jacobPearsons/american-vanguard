import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/prisma'
import { z } from 'zod'

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

const examTypeSchema = z.enum(['results', 'schedules']).optional()

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return errorResponse('Unauthorized', 401)
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    try {
      examTypeSchema.parse(type)
    } catch (e) {
      if (e instanceof z.ZodError) {
        return errorResponse(e.errors[0].message, 400)
      }
    }

    if (type === 'results') {
      const results = await db.examResult.findMany({
        where: { studentId: userId },
        include: { course: true },
        orderBy: { completedAt: 'desc' }
      })

      return NextResponse.json({
        results: results.map(r => ({
          id: r.id,
          courseCode: r.course.code,
          courseName: r.course.name,
          examType: r.examType,
          score: r.score,
          totalQuestions: r.totalQuestions,
          percentage: r.percentage,
          grade: r.grade,
          completedAt: r.completedAt.toISOString()
        }))
      })
    }

    const now = new Date()
    const schedules = await db.examSchedule.findMany({
      include: { course: true },
      orderBy: { date: 'asc' }
    })

    const exams = schedules.map((s) => {
      const examDate = new Date(s.date)
      const examEnd = new Date(examDate.toISOString().split('T')[0] + 'T' + s.endTime)
      
      let status: 'upcoming' | 'ongoing' | 'completed' = 'upcoming'
      if (examEnd < now) status = 'completed'
      else if (examDate <= now && examEnd >= now) status = 'ongoing'

      return {
        id: s.id,
        courseCode: s.course.code,
        courseName: s.course.name,
        examType: s.examType === 'MID_SEMESTER' ? 'Mid-Semester' : s.examType === 'FINAL' ? 'Final' : 'Quiz',
        date: s.date.toISOString().split('T')[0],
        startTime: s.startTime,
        endTime: s.endTime,
        duration: Math.round((new Date(`1970-01-01T${s.endTime}`).getTime() - new Date(`1970-01-01T${s.startTime}`).getTime()) / 60000),
        venue: s.venue,
        status,
        totalQuestions: s.totalQuestions,
        instructions: s.instructions
      }
    })

    return NextResponse.json({ exams })
  } catch (error) {
    console.error('Student Exams GET error:', error)
    return errorResponse('Internal server error', 500)
  }
}
