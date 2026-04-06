'use client'

import React from 'react'
import { CourseCard } from './CourseCard'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

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

interface PublicCourseCatalogProps {
  courses: Course[]
  loading?: boolean
}

export const PublicCourseCatalog: React.FC<PublicCourseCatalogProps> = ({
  courses,
  loading
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-600"></div>
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12 bg-neutral-900/50 rounded-2xl border border-neutral-800">
        <Search className="w-12 h-12 text-neutral-500 mx-auto mb-4" />
        <p className="text-neutral-400">No courses found</p>
        <p className="text-neutral-500 text-sm mt-2">Try adjusting your search criteria</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CoursePreviewCard key={course.id} course={course} />
      ))}
    </div>
  )
}

interface CoursePreviewCardProps {
  course: Course
}

export function CoursePreviewCard({ course }: CoursePreviewCardProps) {
  const capacityPercentage = (course.enrolledCount / course.maxCapacity) * 100
  const isFull = course.enrolledCount >= course.maxCapacity

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
              className={`h-2 rounded-full ${capacityPercentage >= 90 ? 'bg-red-500' : capacityPercentage >= 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
              style={{ width: `${capacityPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button 
          className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-neutral-700 disabled:text-neutral-500"
          disabled={isFull}
        >
          {isFull ? 'Course Full' : 'View Course Details'}
        </Button>
      </div>
    </div>
  )
}

export default PublicCourseCatalog