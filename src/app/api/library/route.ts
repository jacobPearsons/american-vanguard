import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'
import { libraryQuerySchema, libraryCreateSchema } from '@/lib/api-schemas'
import { ZodError } from 'zod'

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const courseId = searchParams.get('courseId')
    const departmentId = searchParams.get('departmentId')
    const category = searchParams.get('category')

    try {
      libraryQuerySchema.parse({ search, courseId, departmentId, category })
    } catch (e) {
      if (e instanceof ZodError) {
        return errorResponse(e.errors[0].message, 400)
      }
    }

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
    return errorResponse('Internal server error', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    let body: any
    try {
      body = await request.json()
    } catch {
      return errorResponse('Invalid JSON', 400)
    }

    try {
      libraryCreateSchema.parse(body)
    } catch (e) {
      if (e instanceof ZodError) {
        return errorResponse(e.errors[0].message, 400)
      }
    }

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
    return errorResponse('Internal server error', 500)
  }
}
