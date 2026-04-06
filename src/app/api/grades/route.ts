import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'
import { gradeQuerySchema, gradeCreateSchema, gradeUpdateSchema } from '@/lib/api-schemas'
import { ZodError } from 'zod'

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')
    const semester = searchParams.get('semester')
    const academicYear = searchParams.get('academicYear')

    try {
      gradeQuerySchema.parse({ courseId, semester, academicYear })
    } catch (e) {
      if (e instanceof ZodError) {
        return errorResponse(e.errors[0].message, 400)
      }
    }

    const where: any = {}
    if (courseId) where.courseId = parseInt(courseId, 10)
    if (semester) where.semester = semester
    if (academicYear) where.academicYear = academicYear

    const grades = await db.grade.findMany({
      where,
      include: { course: true },
      orderBy: [{ semester: 'desc' }, { course: { code: 'asc' } }],
    })

    return NextResponse.json({ grades })
  } catch (error) {
    console.error('Error fetching grades:', error)
    return errorResponse('Internal server error', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    let body: any
    try {
      body = await request.json()
    } catch {
      return errorResponse('Invalid JSON', 400)
    }

    try {
      gradeCreateSchema.parse(body)
    } catch (e) {
      if (e instanceof ZodError) {
        return errorResponse(e.errors[0].message, 400)
      }
    }

    const { studentId, courseId, score, semester, academicYear } = body

    let grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F'

    const existingGrade = await db.grade.findFirst({
      where: { studentId, courseId, semester, academicYear },
    })

    let result
    if (existingGrade) {
      result = await db.grade.update({
        where: { id: existingGrade.id },
        data: { score, grade },
      })
    } else {
      result = await db.grade.create({
        data: { studentId, courseId, score, grade, semester, academicYear },
      })
    }

    return NextResponse.json({ grade: result }, { status: 201 })
  } catch (error) {
    console.error('Error creating/updating grade:', error)
    return errorResponse('Internal server error', 500)
  }
}

export async function PUT(request: NextRequest) {
  try {
    let body: any
    try {
      body = await request.json()
    } catch {
      return errorResponse('Invalid JSON', 400)
    }

    try {
      gradeUpdateSchema.parse(body)
    } catch (e) {
      if (e instanceof ZodError) {
        return errorResponse(e.errors[0].message, 400)
      }
    }

    const { id, score } = body

    let grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F'

    const result = await db.grade.update({
      where: { id },
      data: { score, grade },
    })

    return NextResponse.json({ grade: result })
  } catch (error) {
    console.error('Error updating grade:', error)
    return errorResponse('Internal server error', 500)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id || isNaN(parseInt(id, 10))) {
      return errorResponse('Valid grade ID required', 400)
    }

    await db.grade.delete({
      where: { id: parseInt(id, 10) },
    })

    return NextResponse.json({ message: 'Grade deleted' })
  } catch (error) {
    console.error('Error deleting grade:', error)
    return errorResponse('Internal server error', 500)
  }
}
