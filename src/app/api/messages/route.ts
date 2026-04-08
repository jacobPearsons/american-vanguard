import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return errorResponse('Unauthorized', 401)
    }

    const conversations = await db.conversation.findMany({
      where: {
        participants: { has: userId }
      },
      orderBy: { lastMessageAt: 'desc' }
    })

    return NextResponse.json({ conversations })
  } catch (error) {
    console.error('Error fetching conversations:', error)
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

    const { conversationId, content } = body

    if (!conversationId || !content) {
      return errorResponse('conversationId and content are required', 400)
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

    const message = await db.message.create({
      data: {
        conversationId,
        senderId: userId,
        content
      }
    })

    await db.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() }
    })

    return NextResponse.json({ message })
  } catch (error) {
    console.error('Error sending message:', error)
    return errorResponse('Internal server error', 500)
  }
}
