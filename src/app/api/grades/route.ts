import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')
    const semester = searchParams.get('semester')
    const academicYear = searchParams.get('academicYear')

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
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
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
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, score } = body

    let grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F'

    const result = await db.grade.update({
      where: { id },
      data: { score, grade },
    })

    return NextResponse.json({ grade: result })
  } catch (error) {
    console.error('Error updating grade:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ message: 'Grade ID required' }, { status: 400 })
    }

    await db.grade.delete({
      where: { id: parseInt(id, 10) },
    })

    return NextResponse.json({ message: 'Grade deleted' })
  } catch (error) {
    console.error('Error deleting grade:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}