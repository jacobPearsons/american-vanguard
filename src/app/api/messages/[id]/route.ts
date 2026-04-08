import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return errorResponse('Unauthorized', 401)
    }

    const { id } = await params
    const conversationId = parseInt(id)

    if (isNaN(conversationId)) {
      return errorResponse('Invalid conversation ID', 400)
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId,
        participants: { has: userId }
      }
    })

    if (!conversation) {
      return errorResponse('Conversation not found', 404)
    }

    const messages = await db.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' }
    })

    await db.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        isRead: false
      },
      data: { isRead: true }
    })

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return errorResponse('Internal server error', 500)
  }
}
