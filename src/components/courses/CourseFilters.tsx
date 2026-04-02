'use client'

import React from 'react'
import { Input } from '@/components/ui/input'

interface Department {
  id: number
  name: string
}

interface CourseFiltersProps {
  search: string
  departmentId: string
  semester: string
  onSearchChange: (value: string) => void
  onDepartmentChange: (value: string) => void
  onSemesterChange: (value: string) => void
  departments: Department[]
}

export const CourseFilters: React.FC<CourseFiltersProps> = ({
  search,
  departmentId,
  semester,
  onSearchChange,
  onDepartmentChange,
  onSemesterChange,
  departments,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <Input
        placeholder="Search courses..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-xs"
      />

      <select
        value={departmentId}
        onChange={(e) => onDepartmentChange(e.target.value)}
        className="h-10 w-48 rounded-md border border-input bg-background px-3 py-2 text-sm"
      >
        <option value="all">All Departments</option>
        {departments.map((dept) => (
          <option key={dept.id} value={dept.id.toString()}>
            {dept.name}
          </option>
        ))}
      </select>

      <select
        value={semester}
        onChange={(e) => onSemesterChange(e.target.value)}
        className="h-10 w-40 rounded-md border border-input bg-background px-3 py-2 text-sm"
      >
        <option value="Fall 2025">Fall 2025</option>
        <option value="Spring 2026">Spring 2026</option>
      </select>
    </div>
  )
}
