import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')

    const where = courseId ? { courseId: parseInt(courseId) } : {}

    const threads = await db.forumThread.findMany({
      where,
      include: { 
        course: { select: { name: true } },
        _count: { select: { posts: true } }
      },
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' }
      ]
    })
    
    return NextResponse.json({ 
      threads: threads.map(t => ({
        ...t,
        postCount: t._count.posts,
        courseName: t.course?.name
      }))
    })
  } catch (error) {
    console.error('Error fetching forum threads:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const thread = await db.forumThread.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: body.authorId || 'anonymous',
        authorName: body.authorName || 'Anonymous',
        courseId: body.courseId || null
      }
    })
    
    return NextResponse.json({ thread }, { status: 201 })
  } catch (error) {
    console.error('Error creating forum thread:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}