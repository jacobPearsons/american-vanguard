import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const departmentId = searchParams.get('departmentId')
    const school = searchParams.get('school')

    const where: any = { isActive: true }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (departmentId) {
      where.departmentId = parseInt(departmentId, 10)
    }

    if (school) {
      where.department = { school }
    }

    const faculty = await db.faculty.findMany({
      where,
      include: { department: true },
      orderBy: { lastName: 'asc' },
    })

    return NextResponse.json({ faculty })
  } catch (error) {
    console.error('Error fetching faculty:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
