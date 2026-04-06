import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const threadId = parseInt(params.id, 10)
    const body = await request.json()

    const post = await db.forumPost.create({
      data: {
        threadId,
        content: body.content,
        authorId: body.authorId || 'anonymous',
        authorName: body.authorName || 'Anonymous'
      }
    })

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}