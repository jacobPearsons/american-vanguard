import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  let userId: string | null = null

  try {
    const authResult = await auth()
    userId = authResult.userId

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { courseId, semester, academicYear } = body

    if (!courseId || !semester || !academicYear) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    const course = await db.course.findUnique({ where: { id: courseId } })

    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 })
    }

    if (course.enrolledCount >= course.maxCapacity) {
      return NextResponse.json({ message: 'Course is full' }, { status: 400 })
    }

    const existingReg = await db.studentRegistration.findFirst({
      where: {
        studentId: userId,
        courseId,
        academicYear,
        semester,
      },
    })

    if (existingReg && existingReg.status === 'ENROLLED') {
      return NextResponse.json(
        { message: 'Already registered for this course' },
        { status: 409 }
      )
    }

    let registration

    if (existingReg) {
      registration = await db.studentRegistration.update({
        where: { id: existingReg.id },
        data: { status: 'ENROLLED', droppedAt: null },
      })
    } else {
      registration = await db.studentRegistration.create({
        data: {
          studentId: userId,
          courseId,
          semester,
          academicYear,
          status: 'ENROLLED',
        },
      })
    }

    await db.course.update({
      where: { id: courseId },
      data: { enrolledCount: { increment: 1 } },
    })

    return NextResponse.json(
      { message: 'Successfully registered', registration },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error registering for course:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  let userId: string | null = null

  try {
    const authResult = await auth()
    userId = authResult.userId

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const registrationId = searchParams.get('id')

    if (!registrationId) {
      return NextResponse.json(
        { message: 'Registration ID required' },
        { status: 400 }
      )
    }

    const id = parseInt(registrationId, 10)

    const registration = await db.studentRegistration.findFirst({
      where: { id: id },
    })

    if (!registration || registration.studentId !== userId) {
      return NextResponse.json(
        { message: 'Registration not found' },
        { status: 404 }
      )
    }

    const updated = await db.studentRegistration.update({
      where: { id },
      data: { status: 'DROPPED', droppedAt: new Date() },
    })

    await db.course.update({
      where: { id: registration.courseId },
      data: { enrolledCount: { decrement: 1 } },
    })

    return NextResponse.json({
      message: 'Course dropped successfully',
      registration: updated,
    })
  } catch (error) {
    console.error('Error dropping course:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
