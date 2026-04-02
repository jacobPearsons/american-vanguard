'use client'

import React from 'react'
import { CourseCard } from './CourseCard'

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

interface CourseCatalogProps {
  courses: Course[]
  registeredCourseIds: number[]
  onRegister: (courseId: number) => void
  onDrop: (courseId: number) => void
}

export const CourseCatalog: React.FC<CourseCatalogProps> = ({
  courses,
  registeredCourseIds,
  onRegister,
  onDrop,
}) => {
  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No courses available.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          isRegistered={registeredCourseIds.includes(course.id)}
          onRegister={onRegister}
          onDrop={onDrop}
        />
      ))}
    </div>
  )
}
