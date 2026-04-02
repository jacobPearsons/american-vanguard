'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  CourseCatalog,
  RegisteredCourses,
  CourseFilters,
} from '@/components/courses'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StudentSidebar, defaultNavItems } from '@/components/features/student-dashboard'

interface Course {
  id: number
  code: string
  name: string
  credits: number
  maxCapacity: number
  enrolledCount: number
  schedule?: any
  department: { name: string }
  instructor?: { firstName: string; lastName: string } | null
}

interface Registration {
  id: number
  course: Course
}

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [departmentId, setDepartmentId] = useState('all')
  const [semester, setSemester] = useState('Fall 2025')
  const [academicYear] = useState('2025/2026')

  const fetchCourses = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (departmentId !== 'all') params.set('departmentId', departmentId)
      params.set('semester', semester)
      params.set('academicYear', academicYear)

      const res = await fetch(`/api/courses?${params.toString()}`)
      const data = await res.json()
      setCourses(data.courses || [])
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }, [search, departmentId, semester, academicYear])

  const fetchMyCourses = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      params.set('semester', semester)
      params.set('academicYear', academicYear)

      const res = await fetch(`/api/courses/my?${params.toString()}`)
      const data = await res.json()
      setRegistrations(data.registrations || [])
    } catch (error) {
      console.error('Error fetching my courses:', error)
    }
  }, [semester, academicYear])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  useEffect(() => {
    fetchMyCourses()
  }, [fetchMyCourses])

  const handleRegister = async (courseId: number) => {
    try {
      const res = await fetch('/api/courses/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, semester, academicYear }),
      })

      if (res.ok) {
        fetchCourses()
        fetchMyCourses()
      }
    } catch (error) {
      console.error('Error registering:', error)
    }
  }

  const handleDrop = async (registrationId: number) => {
    try {
      const res = await fetch(`/api/courses/register?id=${registrationId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchCourses()
        fetchMyCourses()
      }
    } catch (error) {
      console.error('Error dropping:', error)
    }
  }

  const registeredCourseIds = registrations.map((r) => r.course.id)
  const totalCredits = registrations.reduce((sum, r) => sum + r.course.credits, 0)

  const handleNavigate = (item: { id: string; href?: string }) => {
    if (item.href) {
      window.location.href = item.href
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="fixed left-0 top-0 h-full z-50">
        <StudentSidebar
          items={defaultNavItems}
          logoSrc="../images/newllogo.png"
          studentName="Student"
          studentImage=""
          activeItem="course"
          onNavigate={handleNavigate}
        />
      </div>

      <div className="flex-1 ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Course Registration
              </h1>
              <p className="text-gray-500">Fall 2025 • 2025/2026 Academic Year</p>
            </div>
            <div className="bg-white rounded-lg shadow px-4 py-2">
              <p className="text-sm text-gray-500">Registered Credits</p>
              <p className="text-xl font-bold text-yellow-600">{totalCredits}</p>
            </div>
          </div>

          <Tabs defaultValue="catalog">
            <TabsList>
              <TabsTrigger value="catalog">Course Catalog</TabsTrigger>
              <TabsTrigger value="my">
                My Courses ({registrations.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="catalog">
            <div className="mb-6">
              <CourseFilters
                search={search}
                departmentId={departmentId}
                semester={semester}
                onSearchChange={setSearch}
                onDepartmentChange={setDepartmentId}
                onSemesterChange={setSemester}
                departments={[]}
              />
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading courses...</p>
              </div>
            ) : (
              <CourseCatalog
                courses={courses}
                registeredCourseIds={registeredCourseIds}
                onRegister={handleRegister}
                onDrop={(id) => handleDrop(id)}
              />
            )}
          </TabsContent>

            <TabsContent value="my">
              <RegisteredCourses
                courses={registrations}
                onDrop={handleDrop}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
