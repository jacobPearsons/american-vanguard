import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10)
    
    const faculty = await db.faculty.findUnique({
      where: { id },
      include: {
        department: true,
        courses: {
          where: { isActive: true },
          include: { department: true }
        },
        publications: {
          orderBy: { year: 'desc' }
        }
      }
    })

    if (!faculty) {
      return NextResponse.json({ message: 'Faculty not found' }, { status: 404 })
    }

    return NextResponse.json({ faculty })
  } catch (error) {
    console.error('Error fetching faculty:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
