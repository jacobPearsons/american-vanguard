import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const departmentId = searchParams.get('departmentId')

    const where: any = {
      isActive: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } }
      ]
    }

    if (type) where.type = type
    if (departmentId) where.departmentId = parseInt(departmentId, 10)

    const announcements = await db.announcement.findMany({
      where,
      include: { department: true },
      orderBy: [
        { isPinned: 'desc' },
        { publishedAt: 'desc' }
      ],
      take: 20
    })

    return NextResponse.json({ announcements })
  } catch (error) {
    console.error('Error fetching announcements:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
