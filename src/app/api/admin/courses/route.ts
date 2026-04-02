import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const departmentId = searchParams.get('departmentId')
    const semester = searchParams.get('semester')

    const where: any = {}

    if (departmentId && departmentId !== 'all') {
      where.departmentId = parseInt(departmentId, 10)
    }
    if (semester) where.semester = semester

    const courses = await db.course.findMany({
      where,
      include: {
        department: true,
        instructor: true,
        _count: {
          select: { registrations: { where: { status: 'ENROLLED' } } }
        }
      },
      orderBy: { code: 'asc' }
    })

    return NextResponse.json({ courses })
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, name, description, credits, departmentId, maxCapacity, semester, academicYear, instructorId, schedule } = body

    const slug = `${code.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`

    const course = await db.course.create({
      data: {
        code,
        name,
        slug,
        description,
        credits: credits || 3,
        departmentId,
        maxCapacity: maxCapacity || 50,
        semester,
        academicYear,
        instructorId,
        schedule,
      }
    })

    return NextResponse.json({ course }, { status: 201 })
  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...data } = body

    const course = await db.course.update({
      where: { id },
      data
    })

    return NextResponse.json({ course })
  } catch (error) {
    console.error('Error updating course:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ message: 'Course ID required' }, { status: 400 })
    }

    await db.course.delete({
      where: { id: parseInt(id, 10) }
    })

    return NextResponse.json({ message: 'Course deleted' })
  } catch (error) {
    console.error('Error deleting course:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
