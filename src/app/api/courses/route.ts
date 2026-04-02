import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const departmentId = searchParams.get('departmentId')
    const semester = searchParams.get('semester')
    const academicYear = searchParams.get('academicYear')

    const where: any = { isActive: true }

    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (departmentId && departmentId !== 'all')
      where.departmentId = parseInt(departmentId, 10)
    if (semester) where.semester = semester
    if (academicYear) where.academicYear = academicYear

    const courses = await db.course.findMany({
      where,
      include: { department: true, instructor: true },
      orderBy: { code: 'asc' },
    })

    return NextResponse.json({ courses })
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
