'use client'

import React from 'react'

interface Department {
  id: number
  name: string
  school: string
}

interface FacultyFiltersProps {
  departments: Department[]
  selectedDepartment: string
  selectedSchool: string
  onDepartmentChange: (id: string) => void
  onSchoolChange: (school: string) => void
}

const schools = ['Sciences', 'Engineering']

export const FacultyFilters: React.FC<FacultyFiltersProps> = ({
  departments,
  selectedDepartment,
  selectedSchool,
  onDepartmentChange,
  onSchoolChange,
}) => {
  return (
    <div className="flex gap-4">
      <select
        value={selectedSchool}
        onChange={(e) => onSchoolChange(e.target.value)}
        className="h-10 w-48 rounded-md border border-input bg-background px-3 py-2 text-sm"
      >
        <option value="all">All Schools</option>
        {schools.map((school) => (
          <option key={school} value={school}>
            {school}
          </option>
        ))}
      </select>

      <select
        value={selectedDepartment}
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
    </div>
  )
}
