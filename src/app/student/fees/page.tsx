import { Suspense } from 'react'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { StudentFeesClient } from './StudentFeesClient'

async function getPaymentData(userId: string) {
  const payments = await db.payment.findMany({
    where: { studentId: userId },
    orderBy: { createdAt: 'desc' },
  })
  return payments.map((p: any) => ({ ...p, id: p._id?.toString() || p.id }))
}

async function getUserData(userId: string) {
  const { db } = await import('@/lib/db')
  const { currentUser } = await import('@clerk/nextjs/server')
  
  const user = await currentUser()
  return {
    name: user?.fullName || user?.username || 'Student',
    image: user?.imageUrl || null,
  }
}

export default async function StudentFeesPage() {
  const { userId } = await auth()

  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to view your fees and make payments.</p>
          <a
            href="/sign-in"
            className="inline-block px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    )
  }

  const payments = await getPaymentData(userId)
  const userData = await getUserData(userId)

  return (
    <Suspense fallback={<div className="p-8">Loading fees...</div>}>
      <StudentFeesClient 
        payments={payments} 
        userData={userData}
      />
    </Suspense>
  )
}
