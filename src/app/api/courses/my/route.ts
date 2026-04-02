import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  let userId: string | null = null

  try {
    const authResult = await auth()
    userId = authResult.userId

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const semester = searchParams.get('semester')
    const academicYear = searchParams.get('academicYear')

    const where: any = { studentId: userId, status: 'ENROLLED' }

    if (semester) where.semester = semester
    if (academicYear) where.academicYear = academicYear

    const registrations = await db.studentRegistration.findMany({
      where,
      include: {
        course: {
          include: { department: true, instructor: true },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    })

    return NextResponse.json({ registrations })
  } catch (error) {
    console.error('Error fetching my courses:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
