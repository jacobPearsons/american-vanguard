import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    const {
      emailAdmissionUpdates,
      emailApplicationStatus,
      emailDeadlines,
      emailNewFeatures,
      emailMarketing,
      pushAdmissionUpdates,
      pushApplicationStatus,
      pushDeadlines,
      pushMessages,
    } = body

    const preferences = await db.notificationPreferences.upsert({
      where: { userId },
      create: {
        userId,
        emailAdmissionUpdates,
        emailApplicationStatus,
        emailDeadlines,
        emailNewFeatures,
        emailMarketing,
        pushAdmissionUpdates,
        pushApplicationStatus,
        pushDeadlines,
        pushMessages,
      },
      update: {
        emailAdmissionUpdates,
        emailApplicationStatus,
        emailDeadlines,
        emailNewFeatures,
        emailMarketing,
        pushAdmissionUpdates,
        pushApplicationStatus,
        pushDeadlines,
        pushMessages,
      },
    })

    return NextResponse.json(preferences)
  } catch (error) {
    console.error('Error saving preferences:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const preferences = await db.notificationPreferences.findUnique({
      where: { userId },
    })

    return NextResponse.json(preferences)
  } catch (error) {
    console.error('Error fetching preferences:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
