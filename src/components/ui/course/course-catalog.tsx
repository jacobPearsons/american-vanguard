/**
 * Course Catalog Component
 * Displays a grid/list of courses with filtering and view controls
 * @module components/ui/course/course-catalog
 */

'use client'

import React, { useState, useEffect } from 'react'
import { Grid, List, BookOpen } from 'lucide-react'
import { CourseCard, type Course } from './course-card'
import { CourseFilter, type CourseFilterState, type Department } from './course-filter'

export interface CourseCatalogProps {
  initialCourses?: Course[]
  departments?: Department[]
  onRegister?: (courseId: number) => void
  onDrop?: (courseId: number) => void
  registeredCourseIds?: number[]
  showFilters?: boolean
}

/**
 * CourseCatalog - Displays courses with optional filtering
 * @param initialCourses - Initial course list
 * @param departments - Available departments for filtering
 * @param onRegister - Callback for course registration
 * @param onDrop - Callback for dropping courses
 * @param registeredCourseIds - IDs of courses user is registered for
 * @param showFilters - Whether to show filter controls
 */
export const CourseCatalog: React.FC<CourseCatalogProps> = ({
  initialCourses = [],
  departments = [],
  onRegister,
  onDrop,
  registeredCourseIds = [],
  showFilters = true,
}) => {
  const [courses, setCourses] = useState<Course[]>(initialCourses)
  const [loading, setLoading] = useState(!initialCourses.length)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState<CourseFilterState>({
    search: '',
    department: [],
    level: [],
    availability: 'all',
    credits: 'any',
  })

  useEffect(() => {
    if (initialCourses.length > 0) {
      setCourses(initialCourses)
      return
    }

    const params = new URLSearchParams()
    if (filters.search) params.set('search', filters.search)
    if (filters.department[0]) params.set('departmentId', filters.department[0])
    if (filters.availability !== 'all') params.set('availability', filters.availability)

    fetch(`/api/courses?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setCourses(data.courses || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [filters, initialCourses.length])

  const handleFilterChange = (newFilters: CourseFilterState) => {
    setFilters(newFilters)
  }

  const filteredCourses = courses.filter((course) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      if (
        !course.name.toLowerCase().includes(searchLower) &&
        !course.code.toLowerCase().includes(searchLower)
      ) {
        return false
      }
    }
    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {showFilters && (
        <CourseFilter departments={departments} onFilterChange={handleFilterChange} />
      )}

      <div className="flex items-center justify-between">
        <p className="text-neutral-400">{filteredCourses.length} courses found</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-yellow-600 text-white'
                : 'bg-neutral-800 text-neutral-400'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-yellow-600 text-white'
                : 'bg-neutral-800 text-neutral-400'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="text-center py-12 bg-neutral-900/50 rounded-2xl border border-neutral-800">
          <BookOpen className="w-12 h-12 text-neutral-500 mx-auto mb-4" />
          <p className="text-neutral-400">No courses found matching your criteria</p>
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isRegistered={registeredCourseIds.includes(course.id)}
              onRegister={onRegister}
              onDrop={onDrop}
              variant={viewMode === 'list' ? 'compact' : 'detailed'}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CourseCatalog