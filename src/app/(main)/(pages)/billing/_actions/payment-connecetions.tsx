'use server'

import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs/server'

export const onPaymentDetails = async () => {
  try {
    const user = await currentUser()

    if (!user) {
      return null
    }

    // Find user in database - create if doesn't exist
    let connection = await db.user.findFirst({
      where: {
        clerkId: user.id,
      },
      select: {
        tier: true,
        credits: true,
      },
    })

    // If user doesn't exist, create them with default values
    if (!connection) {
      await db.user.create({
        data: {
          clerkId: user.id,
          email: user.emailAddresses[0]?.emailAddress || '',
          name: user.fullName || '',
          tier: 'Free',
          credits: '10',
        },
      })
      
      // Fetch the newly created user
      connection = await db.user.findFirst({
        where: {
          clerkId: user.id,
        },
        select: {
          tier: true,
          credits: true,
        },
      })
    }

    return connection
  } catch (error) {
    console.error('Error fetching payment details:', error)
    // Return default values if database is not set up
    return {
      tier: 'Free',
      credits: '10',
    }
  }
}
