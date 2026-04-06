import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clerkId = searchParams.get('userId')

    if (!clerkId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const application = await db.admissionApplication.findFirst({
      where: { userId: clerkId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        admissionType: true,
        applicationTerm: true,
        currentStage: true,
        status: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!application) {
      return NextResponse.json({ application: null })
    }

    return NextResponse.json({
      application: {
        ...application,
        admissionType: application.admissionType as string,
        applicationTerm: application.applicationTerm as string,
        currentStage: application.currentStage as string,
        status: application.status as string
      }
    })
  } catch (error) {
    console.error('Error fetching application status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch application status' },
      { status: 500 }
    )
  }
}
