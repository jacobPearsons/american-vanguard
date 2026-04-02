import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const school = searchParams.get('school')

    const where: any = {}
    if (school) where.school = school

    const departments = await db.department.findMany({
      where,
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({ departments })
  } catch (error) {
    console.error('Error fetching departments:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
