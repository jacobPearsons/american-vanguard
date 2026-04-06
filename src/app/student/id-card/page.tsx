import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/prisma'
import { StudentIDCardClient } from './StudentIDCardClient'

export default async function StudentIDCardPage() {
  const clerkUser = await currentUser()

  if (!clerkUser) {
    redirect('/sign-in')
  }

  const dbUser = await db.user.findUnique({
    where: { clerkId: clerkUser.id },
  })

  const userData = {
    firstName: clerkUser.firstName || dbUser?.firstName || '',
    lastName: clerkUser.lastName || dbUser?.lastName || '',
    email: clerkUser.emailAddresses[0]?.emailAddress || dbUser?.email || '',
    imageUrl: clerkUser.imageUrl || dbUser?.profileImage || '/default-avatar.png',
    phone: dbUser?.phone || '',
  }

  return <StudentIDCardClient userData={userData} />
}