import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/prisma'
import { notificationsFilterSchema, notificationActionSchema } from '@/lib/api-schemas'
import { ZodError } from 'zod'

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return errorResponse('Unauthorized', 401)
    }

    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') || 'all'

    try {
      notificationsFilterSchema.parse({ filter })
    } catch (e) {
      if (e instanceof ZodError) {
        return errorResponse(e.errors[0].message, 400)
      }
    }

    const where: any = { userId }
    if (filter === 'unread') where.isRead = false

    const notifications = await db.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    const typeMap: Record<string, string> = {
      ADMISSION_RECEIVED: 'info',
      ADMISSION_ACCEPTED: 'success',
      ADMISSION_REJECTED: 'warning',
      ADMISSION_WAITLISTED: 'warning',
      DOCUMENT_REQUESTED: 'warning',
      INTERVIEW_SCHEDULED: 'info',
      DECISION_MADE: 'info',
      ENROLLMENT_DEADLINE: 'deadline',
      PROFILE_VIEWED: 'info',
      MESSAGE: 'info',
      ENGLISH_TEST_INVITE: 'info',
    }

    return NextResponse.json({
      notifications: notifications.map(n => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: typeMap[n.type] || 'info',
        isRead: n.isRead,
        createdAt: n.createdAt.toISOString(),
      }))
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return errorResponse('Internal server error', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return errorResponse('Unauthorized', 401)
    }

    let body: any
    try {
      body = await request.json()
    } catch {
      return errorResponse('Invalid JSON', 400)
    }

    try {
      notificationActionSchema.parse(body)
    } catch (e) {
      if (e instanceof ZodError) {
        return errorResponse(e.errors[0].message, 400)
      }
    }

    const { action } = body

    if (action === 'markAllRead') {
      await db.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true, readAt: new Date() },
      })
      return NextResponse.json({ message: 'All notifications marked as read' })
    }

    return errorResponse('Invalid action', 400)
  } catch (error) {
    console.error('Error updating notifications:', error)
    return errorResponse('Internal server error', 500)
  }
}
