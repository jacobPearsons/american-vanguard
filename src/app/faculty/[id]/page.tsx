'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { FacultyProfile } from '@/components/faculty/FacultyProfile'
import Navbar from '@/components/global/navbar'
import { Footer } from '@/components/global/footer'

interface Faculty {
  id: number
  firstName: string
  lastName: string
  title: string
  photoUrl?: string | null
  bio?: string | null
  email?: string | null
  phone?: string | null
  office?: string | null
  officeHours?: string | null
  department: { name: string; school: string }
  publications: Array<{ id: number; title: string; journal?: string; year: number; url?: string }>
  courses: Array<{ id: number; code: string; name: string; credits: number }>
}

export default function FacultyDetailPage() {
  const params = useParams()
  const [faculty, setFaculty] = useState<Faculty | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetch(`/api/faculty/${params.id}`)
        .then(res => res.json())
        .then(data => setFaculty(data.faculty))
        .catch(err => console.error(err))
        .finally(() => setLoading(false))
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  if (!faculty) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Faculty not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <FacultyProfile faculty={faculty} />
      </main>
      <Footer />
    </div>
  )
}
