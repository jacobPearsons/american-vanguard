/**
 * Course Filter Component
 * Provides filtering controls for course search
 * @module components/ui/course/course-filter
 */

'use client'

import React from 'react'
import { Search } from 'lucide-react'

export interface Department {
  id: number
  name: string
}

export interface CourseFilterState {
  search: string
  department: string[]
  level: string[]
  availability: string
  credits: string
}

export interface CourseFilterProps {
  departments: Department[]
  onFilterChange: (filters: CourseFilterState) => void
  initialFilters?: Partial<CourseFilterState>
}

/**
 * CourseFilter - Provides UI controls for filtering courses
 * @param departments - List of available departments
 * @param onFilterChange - Callback when filters change
 * @param initialFilters - Initial filter values
 */
export const CourseFilter: React.FC<CourseFilterProps> = ({
  departments,
  onFilterChange,
  initialFilters,
}) => {
  const [filters, setFilters] = React.useState<CourseFilterState>({
    search: initialFilters?.search || '',
    department: initialFilters?.department || [],
    level: initialFilters?.level || [],
    availability: initialFilters?.availability || 'all',
    credits: initialFilters?.credits || 'any',
  })

  const updateFilter = <K extends keyof CourseFilterState>(
    key: K,
    value: CourseFilterState[K]
  ) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
        <input
          type="text"
          placeholder="Search courses, topics, instructors..."
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:border-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Department</label>
          <select
            value={filters.department[0] || ''}
            onChange={(e) =>
              updateFilter('department', e.target.value ? [e.target.value] : [])
            }
            className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id.toString()}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Level</label>
          <select
            value={filters.level[0] || ''}
            onChange={(e) =>
              updateFilter('level', e.target.value ? [e.target.value] : [])
            }
            className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
          >
            <option value="">All Levels</option>
            <option value="undergraduate">Undergraduate</option>
            <option value="graduate">Graduate</option>
            <option value="doctoral">Doctoral</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Availability</label>
          <select
            value={filters.availability}
            onChange={(e) => updateFilter('availability', e.target.value)}
            className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
          >
            <option value="all">All Courses</option>
            <option value="open">Open for Enrollment</option>
            <option value="full">Full</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Credits</label>
          <select
            value={filters.credits}
            onChange={(e) => updateFilter('credits', e.target.value)}
            className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
          >
            <option value="any">Any Credits</option>
            <option value="1-2">1-2 Credits</option>
            <option value="3">3 Credits</option>
            <option value="4+">4+ Credits</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default CourseFilter