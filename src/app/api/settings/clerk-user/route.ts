import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch user from Clerk')
    }

    const user = await response.json()

    return NextResponse.json({
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email_addresses[0]?.email_address,
        imageUrl: user.image_url,
      }
    })
  } catch (error) {
    console.error('Error fetching Clerk user:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
