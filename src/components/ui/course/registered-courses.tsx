/**
 * Registered Courses Component
 * Displays user's registered courses with ability to drop
 * @module components/ui/course/registered-courses
 */

'use client'

import React from 'react'
import { Button } from '@/components/ui/button'

export interface RegisteredCourse {
  id: number
  course: {
    id: number
    code: string
    name: string
    credits: number
  }
}

export interface RegisteredCoursesProps {
  courses: RegisteredCourse[]
  onDrop: (registrationId: number) => void
}

/**
 * RegisteredCourses - Displays list of user's enrolled courses
 * @param courses - List of registered courses
 * @param onDrop - Callback to drop a course
 */
export const RegisteredCourses: React.FC<RegisteredCoursesProps> = ({
  courses,
  onDrop,
}) => {
  const totalCredits = courses.reduce((sum, r) => sum + r.course.credits, 0)

  if (courses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No registered courses yet.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 p-4 bg-yellow-50 rounded-lg">
        <p className="font-medium">
          Total Credits: <span>{totalCredits}</span>
        </p>
        <p className="text-sm text-gray-600">
          Registered Courses: <span>{courses.length}</span>
        </p>
      </div>

      <div className="space-y-3">
        {courses.map((reg) => (
          <div
            key={reg.id}
            className="flex justify-between items-center p-4 bg-white border rounded-lg"
          >
            <div>
              <p className="font-medium">{reg.course.code}</p>
              <p className="text-sm text-gray-600">{reg.course.name}</p>
              <p className="text-xs text-gray-500">
                {reg.course.credits} credits
              </p>
            </div>
            <Button variant="destructive" size="sm" onClick={() => onDrop(reg.id)}>
              Drop
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RegisteredCourses