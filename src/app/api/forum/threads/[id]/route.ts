import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const threadId = parseInt(params.id, 10)
    
    const thread = await db.forumThread.findUnique({
      where: { id: threadId },
      include: { 
        course: { select: { name: true } },
        posts: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!thread) {
      return NextResponse.json({ message: 'Thread not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      thread: {
        ...thread,
        courseName: thread.course?.name
      }
    })
  } catch (error) {
    console.error('Error fetching thread:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const threadId = parseInt(params.id, 10)
    const body = await request.json()

    const thread = await db.forumThread.update({
      where: { id: threadId },
      data: {
        isPinned: body.isPinned,
        isLocked: body.isLocked
      }
    })

    return NextResponse.json({ thread })
  } catch (error) {
    console.error('Error updating thread:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const threadId = parseInt(params.id, 10)

    await db.forumThread.delete({
      where: { id: threadId }
    })

    return NextResponse.json({ message: 'Thread deleted' })
  } catch (error) {
    console.error('Error deleting thread:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}