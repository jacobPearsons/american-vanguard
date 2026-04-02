import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function PUT(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    const { phone, address, city, country, dateOfBirth } = body

    const user = await db.user.update({
      where: { clerkId: userId },
      data: {
        phone,
        address,
        city,
        country,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error updating profile:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
