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
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { lastMessageAt: 'desc' }
    })

    const formattedConversations = await Promise.all(conversations.map(async (conv) => {
      const otherParticipants = conv.participants.filter(p => p !== userId)
      
      let otherUserName = 'Unknown User'
      if (otherParticipants.length > 0) {
        const user = await db.user.findFirst({
          where: { clerkId: otherParticipants[0] }
        })
        if (user) {
          otherUserName = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email
        }
      }

      return {
        id: conv.id,
        participants: conv.participants,
        otherUserId: otherParticipants[0] || null,
        otherUserName,
        lastMessage: conv.messages[0] ? {
          content: conv.messages[0].content,
          createdAt: conv.messages[0].createdAt.toISOString(),
          isRead: conv.messages[0].isRead
        } : null,
        lastMessageAt: conv.lastMessageAt.toISOString()
      }
    }))

    return NextResponse.json({ conversations: formattedConversations })
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

    const { participantId } = body

    if (!participantId) {
      return errorResponse('participantId is required', 400)
    }

    const existingConversation = await db.conversation.findFirst({
      where: {
        participants: { hasEvery: [userId, participantId] }
      }
    })

    if (existingConversation) {
      return NextResponse.json({ conversation: existingConversation })
    }

    const conversation = await db.conversation.create({
      data: {
        participants: [userId, participantId]
      }
    })

    return NextResponse.json({ conversation })
  } catch (error) {
    console.error('Error creating conversation:', error)
    return errorResponse('Internal server error', 500)
  }
}
