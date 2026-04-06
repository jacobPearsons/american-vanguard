import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const course = await db.course.findUnique({
      where: { slug: params.slug },
      include: { 
        department: true, 
        instructor: true 
      }
    })
    
    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 })
    }
    
    return NextResponse.json({ course })
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}