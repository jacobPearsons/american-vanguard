'use client'

import { StudentLayout } from '@/components/features/student-dashboard'
import { StudentCourseDetail } from '@/components/elearning/student-course-detail'

export default function StudentCoursePage() {
  return (
    <StudentLayout studentName="Student">
      <div className="min-h-screen bg-neutral-950 p-6">
        <StudentCourseDetail />
      </div>
    </StudentLayout>
  )
}