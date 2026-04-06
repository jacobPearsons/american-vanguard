import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/prisma'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    const preferences = await db.notificationPreferences.findUnique({
      where: { userId },
    })

    return NextResponse.json({ user, preferences })
  } catch (error) {
    console.error('Error fetching user data:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
