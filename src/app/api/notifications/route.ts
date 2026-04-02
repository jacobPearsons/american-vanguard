import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const isRead = searchParams.get('isRead')

    const where: any = {}

    if (type && type !== 'all') where.type = type
    if (isRead !== null && isRead !== undefined) where.isRead = isRead === 'true'

    const notifications = await db.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json({ notifications })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, isRead } = body

    if (id) {
      const notification = await db.notification.update({
        where: { id },
        data: { isRead, readAt: isRead ? new Date() : null },
      })
      return NextResponse.json({ notification })
    }

    return NextResponse.json({ message: 'Notification ID required' }, { status: 400 })
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, message, type, userId } = body

    const notification = await db.notification.create({
      data: {
        title,
        message,
        type,
        userId,
        isRead: false,
      },
    })

    return NextResponse.json({ notification }, { status: 201 })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      await db.notification.delete({
        where: { id: parseInt(id, 10) },
      })
      return NextResponse.json({ message: 'Notification deleted' })
    }

    return NextResponse.json({ message: 'Notification ID required' }, { status: 400 })
  } catch (error) {
    console.error('Error deleting notification:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}