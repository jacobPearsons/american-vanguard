/**
 * Course Card Component
 * Displays course information with enrollment status and action buttons
 * @module components/ui/course/course-card
 */

import React from 'react'
import { Button } from '@/components/ui/button'
import { BookOpen, Users } from 'lucide-react'

export interface Course {
  id: number
  code: string
  name: string
  description?: string
  credits: number
  maxCapacity: number
  enrolledCount: number
  department: { name: string }
  instructor?: { firstName: string; lastName: string } | null
  schedule?: { day: string; startTime: string; endTime: string }[]
}

export interface CourseCardProps {
  course: Course
  isRegistered?: boolean
  onRegister?: (courseId: number) => void
  onDrop?: (courseId: number) => void
  variant?: 'default' | 'compact' | 'detailed'
}

/**
 * CourseCard - Displays course information with registration controls
 * @param course - Course data object
 * @param isRegistered - Whether user is registered for this course
 * @param onRegister - Callback when user clicks register
 * @param onDrop - Callback when user clicks drop
 * @param variant - Display variant (default, compact, detailed)
 */
export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  isRegistered = false,
  onRegister,
  onDrop,
  variant = 'default',
}) => {
  const capacityPercentage = (course.enrolledCount / course.maxCapacity) * 100
  const isFull = course.enrolledCount >= course.maxCapacity

  const getCapacityColor = () => {
    if (capacityPercentage >= 90) return 'bg-red-500'
    if (capacityPercentage >= 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getScheduleInfo = () => {
    if (!course.schedule) return 'TBA'
    return course.schedule
      .map((s) => `${s.day} ${s.startTime}-${s.endTime}`)
      .join(', ')
  }

  if (variant === 'compact') {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 hover:border-yellow-500/50 transition-colors group">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-yellow-500 font-semibold text-sm">{course.code}</span>
            <h3 className="text-white font-semibold mt-1 group-hover:text-yellow-400 transition-colors">
              {course.name}
            </h3>
          </div>
          <span className="bg-neutral-800 text-neutral-300 text-sm px-3 py-1 rounded-full">
            {course.credits} credits
          </span>
        </div>
      </div>
    )
  }

  if (variant === 'detailed') {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-yellow-500/50 transition-colors group">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-yellow-500 font-semibold text-sm">{course.code}</span>
            <h3 className="text-white font-semibold text-lg mt-1 group-hover:text-yellow-400 transition-colors">
              {course.name}
            </h3>
          </div>
          <span className="bg-neutral-800 text-neutral-300 text-sm px-3 py-1 rounded-full">
            {course.credits} credits
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-400">Department</span>
            <span className="text-neutral-300">{course.department.name}</span>
          </div>

          {course.instructor && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-400">Instructor</span>
              <span className="text-neutral-300">
                {course.instructor.firstName} {course.instructor.lastName}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-400">Seats</span>
            <span className={isFull ? 'text-red-400' : 'text-neutral-300'}>
              {course.enrolledCount} / {course.maxCapacity}
            </span>
          </div>

          <div>
            <div className="w-full bg-neutral-800 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getCapacityColor()}`}
                style={{ width: `${capacityPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {onRegister && (
          <div className="mt-6">
            <Button
              className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-neutral-700 disabled:text-neutral-500"
              disabled={isFull && !isRegistered}
              onClick={() => isRegistered ? onDrop?.(course.id) : onRegister(course.id)}
            >
              {isRegistered ? 'Registered' : isFull ? 'Course Full' : 'Register'}
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-lg">{course.code}</h3>
          <p className="text-gray-600">{course.name}</p>
        </div>
        <span className="text-sm bg-gray-100 px-2 py-1 rounded">
          {course.credits} credits
        </span>
      </div>

      <p className="text-sm text-gray-500 mb-2">{course.department.name}</p>

      <div className="mb-3">
        <p className="text-sm text-gray-600">{getScheduleInfo()}</p>
        {course.instructor && (
          <p className="text-sm text-gray-500">
            Instructor: {course.instructor.firstName} {course.instructor.lastName}
          </p>
        )}
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span>Capacity</span>
          <span>
            {course.enrolledCount}/{course.maxCapacity}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${getCapacityColor()}`}
            style={{ width: `${capacityPercentage}%` }}
          />
        </div>
      </div>

      {isRegistered ? (
        <Button
          variant="destructive"
          onClick={() => onDrop?.(course.id)}
          className="w-full"
        >
          Drop Course
        </Button>
      ) : (
        <Button
          onClick={() => onRegister?.(course.id)}
          disabled={isFull}
          className="w-full"
        >
          {isFull ? 'Full' : 'Add Course'}
        </Button>
      )}
    </div>
  )
}

export default CourseCard