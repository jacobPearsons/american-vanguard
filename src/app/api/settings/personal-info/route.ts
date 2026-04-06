import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/prisma'

export async function PUT(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    const { firstName, lastName, phone, address, city, country } = body

    const user = await db.user.update({
      where: { clerkId: userId },
      data: {
        firstName,
        lastName,
        phone,
        address,
        city,
        country,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error updating personal info:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
