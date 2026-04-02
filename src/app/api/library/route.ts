import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const courseId = searchParams.get('courseId')
    const departmentId = searchParams.get('departmentId')
    const category = searchParams.get('category')

    const where: any = { isActive: true }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (courseId) where.courseId = parseInt(courseId, 10)
    if (departmentId && departmentId !== 'all') where.departmentId = parseInt(departmentId, 10)
    if (category && category !== 'all') where.category = category

    const materials = await db.libraryMaterial.findMany({
      where,
      include: {
        course: true,
        department: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ materials })
  } catch (error) {
    console.error('Error fetching materials:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, fileUrl, fileType, courseId, category, departmentId } = body

    const material = await db.libraryMaterial.create({
      data: {
        title,
        description,
        fileUrl,
        fileType,
        courseId,
        category,
        departmentId,
      }
    })

    return NextResponse.json({ material }, { status: 201 })
  } catch (error) {
    console.error('Error creating material:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
