/**
 * Dashboard Page
 * Purpose: Main user dashboard displaying student information
 * 
 * Architecture Rules (per docs):
 * - Routes must remain thin controllers
 * - Use hooks for state management
 * - Data flows: Service → Hook → UI Component
 */

import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/prisma'
import { DashboardClient } from './DashboardClient'

export default async function DashboardPage() {
  const { userId } = await auth()
  const user = await currentUser()
  const userName = user?.firstName || user?.fullName || null

  if (userId) {
    const application = await db.admissionApplication.findFirst({
      where: { userId: userId },
      select: { status: true }
    })

    if (!application || (application.status !== 'ENROLLED' && application.status !== 'ENROLLMENT_COMPLETE')) {
      redirect('/apply')
    }
  }

  return <DashboardClient userId={userId} userName={userName} />
}
