import React from 'react'
import { Button } from '@/components/ui/button'

interface CourseCardProps {
  course: {
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
  isRegistered: boolean
  onRegister: (courseId: number) => void
  onDrop: (courseId: number) => void
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  isRegistered,
  onRegister,
  onDrop,
}) => {
  const capacityPercentage = (course.enrolledCount / course.maxCapacity) * 100
  const capacityColor =
    capacityPercentage < 75
      ? 'bg-green-500'
      : capacityPercentage < 90
        ? 'bg-yellow-500'
        : 'bg-red-500'

  const scheduleInfo = course.schedule
    ? (course.schedule as any[])
      .map((s) => `${s.day} ${s.startTime}-${s.endTime}`)
      .join(', ')
    : 'TBA'

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
        <p className="text-sm text-gray-600">{scheduleInfo}</p>
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
            className={`h-2 rounded-full ${capacityColor}`}
            style={{ width: `${capacityPercentage}%` }}
          />
        </div>
      </div>

      {isRegistered ? (
        <Button
          variant="destructive"
          onClick={() => onDrop(course.id)}
          className="w-full"
        >
          Drop Course
        </Button>
      ) : (
        <Button
          onClick={() => onRegister(course.id)}
          disabled={course.enrolledCount >= course.maxCapacity}
          className="w-full"
        >
          {course.enrolledCount >= course.maxCapacity ? 'Full' : 'Add Course'}
        </Button>
      )}
    </div>
  )
}
