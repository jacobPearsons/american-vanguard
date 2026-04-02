'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { AdminLayout, AdminCard, AdminStats } from '@/components/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface Course {
  id: number
  code: string
  name: string
  credits: number
  maxCapacity: number
  enrolledCount: number
  department: { name: string }
  instructor?: { firstName: string; lastName: string } | null
}

const mockCourses: Course[] = [
  { id: 1, code: 'CS101', name: 'Introduction to Programming', credits: 3, maxCapacity: 50, enrolledCount: 45, department: { name: 'Computer Science' }, instructor: { firstName: 'Dr. Smith', lastName: 'Johnson' } },
  { id: 2, code: 'CS201', name: 'Data Structures', credits: 3, maxCapacity: 40, enrolledCount: 38, department: { name: 'Computer Science' }, instructor: { firstName: 'Prof. Williams', lastName: 'Davis' } },
  { id: 3, code: 'MATH101', name: 'Calculus I', credits: 4, maxCapacity: 60, enrolledCount: 55, department: { name: 'Mathematics' }, instructor: null },
]

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>(mockCourses)
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)

  const filteredCourses = courses.filter(c => 
    c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = [
    { label: 'Total Courses', value: courses.length },
    { label: 'Total Enrolled', value: courses.reduce((sum, c) => sum + c.enrolledCount, 0) },
    { label: 'Available Seats', value: courses.reduce((sum, c) => sum + (c.maxCapacity - c.enrolledCount), 0) },
  ]

  return (
    <AdminLayout
      title="Course Management"
      description="Manage courses and enrollments"
      actions={
        <Button onClick={() => setShowModal(true)} className="bg-yellow-600 hover:bg-yellow-700 gap-2">
          <Plus className="w-4 h-4" /> Add Course
        </Button>
      }
    >
      <AdminStats stats={stats} />
      
      <AdminCard>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
          />
        </div>
      </AdminCard>

      <AdminCard>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-800">
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">Code</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">Department</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">Credits</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">Capacity</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">Instructor</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-neutral-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map(course => (
                <tr key={course.id} className="border-b border-neutral-800 hover:bg-neutral-800/50">
                  <td className="py-3 px-4">
                    <Badge className="bg-yellow-600/20 text-yellow-400">{course.code}</Badge>
                  </td>
                  <td className="py-3 px-4 text-white">{course.name}</td>
                  <td className="py-3 px-4 text-neutral-400">{course.department.name}</td>
                  <td className="py-3 px-4 text-neutral-400">{course.credits}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className={course.enrolledCount >= course.maxCapacity ? 'text-red-400' : 'text-neutral-400'}>
                        {course.enrolledCount}/{course.maxCapacity}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-neutral-400">
                    {course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : '-'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="p-2 text-neutral-400 hover:text-yellow-600">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-neutral-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </AdminLayout>
  )
}
