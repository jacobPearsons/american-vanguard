'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Grid, List, BookOpen, Clock, Users, Star, Bookmark, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Course {
  id: number
  code: string
  name: string
  description: string
  credits: number
  maxCapacity: number
  enrolledCount: number
  level: string
  department: { name: string }
  instructor?: { firstName: string; lastName: string } | null
  tags: string[]
}

interface CourseFiltersProps {
  departments: { id: number; name: string }[]
  onFilterChange: (filters: FilterState) => void
}

interface FilterState {
  search: string
  department: string[]
  level: string[]
  availability: string
  credits: string
}

export function CourseFiltersExtended({ departments, onFilterChange }: CourseFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    department: [],
    level: [],
    availability: 'all',
    credits: 'any'
  })

  const updateFilter = (key: keyof FilterState, value: any) => {
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
            onChange={(e) => updateFilter('department', e.target.value ? [e.target.value] : [])}
            className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
          >
            <option value="">All Departments</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Level</label>
          <select
            value={filters.level[0] || ''}
            onChange={(e) => updateFilter('level', e.target.value ? [e.target.value] : [])}
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

export function CourseCardExtended({ course, viewMode }: { course: Course; viewMode: 'grid' | 'list' }) {
  const [bookmarked, setBookmarked] = useState(false)
  const availability = course.enrolledCount >= course.maxCapacity ? 'full' : 'open'
  const spotsLeft = course.maxCapacity - course.enrolledCount

  if (viewMode === 'list') {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 hover:border-yellow-500/50 transition-colors group">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-yellow-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-8 h-8 text-yellow-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-yellow-500 font-semibold">{course.code}</span>
              <span className={`px-2 py-0.5 text-xs rounded ${
                availability === 'open' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
              }`}>
                {availability === 'open' ? `${spotsLeft} spots left` : 'Full'}
              </span>
            </div>
            <h3 className="font-semibold text-white truncate group-hover:text-yellow-400">{course.name}</h3>
            <p className="text-sm text-neutral-400 truncate">{course.description}</p>
          </div>
          <div className="text-center flex-shrink-0">
            <p className="text-xl font-bold text-white">{course.credits}</p>
            <p className="text-xs text-neutral-500">credits</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => setBookmarked(!bookmarked)}>
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'text-yellow-500 fill-yellow-500' : ''}`} />
            </Button>
            <Button size="sm" variant="ghost">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-yellow-500/50 transition-colors group">
      <div className="h-32 bg-gradient-to-r from-yellow-600/30 to-yellow-800/30 relative">
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-black/50 backdrop-blur rounded text-xs text-white font-medium">
            {course.code}
          </span>
        </div>
        <div className="absolute top-3 right-3 flex gap-1">
          <button 
            onClick={() => setBookmarked(!bookmarked)}
            className="p-1.5 bg-black/50 backdrop-blur rounded hover:bg-black/70 transition-colors"
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'text-yellow-500 fill-yellow-500' : 'text-white'}`} />
          </button>
          <button className="p-1.5 bg-black/50 backdrop-blur rounded hover:bg-black/70 transition-colors">
            <Share2 className="w-4 h-4 text-white" />
          </button>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className={`px-2 py-0.5 text-xs rounded ${
            availability === 'open' ? 'bg-green-900/80 text-green-400' : 'bg-red-900/80 text-red-400'
          }`}>
            {availability === 'open' ? `${spotsLeft} spots left` : 'Full'}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors">
          {course.name}
        </h3>
        <p className="text-sm text-neutral-400 mb-3 line-clamp-2">{course.description}</p>
        
        <div className="flex items-center justify-between text-sm mb-4">
          <span className="text-neutral-500">{course.department.name}</span>
          <span className="text-yellow-500 font-medium">{course.credits} credits</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-neutral-500">
            <Users className="w-3 h-3" />
            {course.enrolledCount} enrolled
          </div>
          {course.instructor && (
            <span className="text-xs text-neutral-500">
              • {course.instructor.firstName} {course.instructor.lastName}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export function CourseDiscover() {
  const [courses, setCourses] = useState<Course[]>([])
  const [departments, setDepartments] = useState<{ id: number; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    department: [],
    level: [],
    availability: 'all',
    credits: 'any'
  })

  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.search) params.set('search', filters.search)
    if (filters.department[0]) params.set('departmentId', filters.department[0])
    if (filters.availability !== 'all') params.set('availability', filters.availability)
    params.set('semester', 'Fall 2025')

    fetch(`/api/courses?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setCourses(data.courses || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))

    fetch('/api/departments')
      .then(res => res.json())
      .then(data => setDepartments(data.departments || []))
  }, [filters])

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  return (
    <div className="space-y-6">
      <CourseFiltersExtended departments={departments} onFilterChange={handleFilterChange} />

      <div className="flex items-center justify-between">
        <p className="text-neutral-400">
          {courses.length} courses found
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-yellow-600 text-white' : 'bg-neutral-800 text-neutral-400'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-yellow-600 text-white' : 'bg-neutral-800 text-neutral-400'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-600"></div>
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12 bg-neutral-900/50 rounded-2xl border border-neutral-800">
          <BookOpen className="w-12 h-12 text-neutral-500 mx-auto mb-4" />
          <p className="text-neutral-400">No courses found matching your criteria</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {courses.map(course => (
            <CourseCardExtended key={course.id} course={course} viewMode={viewMode} />
          ))}
        </div>
      )}
    </div>
  )
}

export default CourseDiscover