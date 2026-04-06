import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/prisma'

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return errorResponse('Unauthorized', 401)
    }

    const { id } = await params
    const notificationId = parseInt(id, 10)

    if (isNaN(notificationId)) {
      return errorResponse('Invalid notification ID', 400)
    }

    const notification = await db.notification.findFirst({
      where: { id: notificationId, userId },
    })

    if (!notification) {
      return errorResponse('Notification not found', 404)
    }

    const updated = await db.notification.update({
      where: { id: notificationId },
      data: { isRead: true, readAt: new Date() },
    })

    return NextResponse.json({ 
      notification: {
        id: updated.id,
        title: updated.title,
        message: updated.message,
        isRead: updated.isRead,
        createdAt: updated.createdAt.toISOString(),
      }
    })
  } catch (error) {
    console.error('Error updating notification:', error)
    return errorResponse('Internal server error', 500)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return errorResponse('Unauthorized', 401)
    }

    const { id } = await params
    const notificationId = parseInt(id, 10)

    if (isNaN(notificationId)) {
      return errorResponse('Invalid notification ID', 400)
    }

    const notification = await db.notification.findFirst({
      where: { id: notificationId, userId },
    })

    if (!notification) {
      return errorResponse('Notification not found', 404)
    }

    await db.notification.delete({
      where: { id: notificationId },
    })

    return NextResponse.json({ message: 'Notification deleted' })
  } catch (error) {
    console.error('Error deleting notification:', error)
    return errorResponse('Internal server error', 500)
  }
}
