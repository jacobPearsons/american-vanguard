import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, journal, year, url, facultyId } = body

    const publication = await db.publication.create({
      data: { title, journal, year, url, facultyId }
    })

    return NextResponse.json({ publication }, { status: 201 })
  } catch (error) {
    console.error('Error creating publication:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const facultyId = searchParams.get('facultyId')

    const where: any = {}
    if (facultyId) where.facultyId = parseInt(facultyId, 10)

    const publications = await db.publication.findMany({
      where,
      include: { faculty: true },
      orderBy: { year: 'desc' }
    })

    return NextResponse.json({ publications })
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
