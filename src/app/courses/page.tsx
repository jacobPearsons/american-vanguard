'use client'

import { useState, useEffect, useCallback } from 'react'
import Navbar from '@/components/global/navbar'
import { Footer } from '@/components/global/footer'
import { PublicCourseCatalog } from '@/components/courses/public-catalog'
import { CourseFilters } from '@/components/courses'
import { GraduationCap } from 'lucide-react'

interface Course {
  id: number
  code: string
  name: string
  credits: number
  maxCapacity: number
  enrolledCount: number
  department: { id: number; name: string }
  instructor?: { firstName: string; lastName: string } | null
}

interface Department {
  id: number
  name: string
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [departmentId, setDepartmentId] = useState('all')
  const [semester, setSemester] = useState('Fall 2025')

  const fetchCourses = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (departmentId !== 'all') params.set('departmentId', departmentId)
      params.set('semester', semester)

      const res = await fetch(`/api/courses?${params.toString()}`)
      const data = await res.json()
      setCourses(data.courses || [])
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }, [search, departmentId, semester])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCourses()
    }, 300)
    return () => clearTimeout(timer)
  }, [fetchCourses])

  useEffect(() => {
    fetch('/api/departments')
      .then(res => res.json())
      .then(data => setDepartments(data.departments || []))
      .catch(console.error)
  }, [])

  return (
    <main className="flex flex-col min-h-screen bg-neutral-950">
      <Navbar />
      
      <section className="w-full pt-32 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-neutral-950/60" />
        </div>
        
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="h-8 w-8 text-yellow-500" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">Course Catalog</h1>
          </div>
          <p className="text-xl text-neutral-300 mb-8">Explore our course offerings for {semester}</p>
          
          <CourseFilters
            search={search}
            departmentId={departmentId}
            semester={semester}
            onSearchChange={setSearch}
            onDepartmentChange={setDepartmentId}
            onSemesterChange={setSemester}
            departments={departments}
          />
        </div>
      </section>

      <section className="w-full pb-20">
        <div className="container px-4 md:px-6">
          <PublicCourseCatalog courses={courses} loading={loading} />
        </div>
      </section>

      <Footer />
    </main>
  )
}