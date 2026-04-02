import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { StudentProfileClient } from './StudentProfileClient'

export default async function StudentProfilePage() {
  const clerkUser = await currentUser()

  if (!clerkUser) {
    redirect('/sign-in')
  }

  const dbUser = await db.user.findUnique({
    where: { clerkId: clerkUser.id },
  })

  const userData = {
    clerkId: clerkUser.id,
    firstName: clerkUser.firstName || dbUser?.firstName || '',
    lastName: clerkUser.lastName || dbUser?.lastName || '',
    email: clerkUser.emailAddresses[0]?.emailAddress || dbUser?.email || '',
    imageUrl: clerkUser.imageUrl || dbUser?.profileImage || '/default-avatar.png',
    phone: dbUser?.phone || '',
    address: dbUser?.address || '',
    city: dbUser?.city || '',
    country: dbUser?.country || '',
    dateOfBirth: dbUser?.dateOfBirth,
    isVerified: dbUser?.isVerified || false,
    emailVerified: clerkUser.emailAddresses[0]?.verification?.status === 'verified',
    createdAt: dbUser?.createdAt,
  }

  return <StudentProfileClient userData={userData} />
}
