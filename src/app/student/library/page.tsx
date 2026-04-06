'use client'

import React, { useState, useEffect } from 'react'
import { Search, BookOpen, Download, Filter, FolderOpen } from 'lucide-react'
import { StudentLayout } from '@/components/features/student-dashboard'

interface LibraryMaterial {
  id: number
  title: string
  description: string | null
  fileUrl: string
  fileType: string
  courseId: number
  category: string
  course: {
    code: string
    name: string
  }
  department: {
    name: string
  }
  createdAt: string
}

interface Department {
  id: number
  name: string
  slug: string
}

interface Course {
  id: number
  code: string
  name: string
  departmentId: number
}

const categories = ['Lecture', 'Assignment', 'Note', 'Tutorial', 'Past Question', 'Lab Manual', 'Syllabus']

export default function StudentLibraryPage() {
  const [materials, setMaterials] = useState<LibraryMaterial[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedCourse, setSelectedCourse] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetchMaterials()
    fetchDepartments()
    fetchCourses()
  }, [])

  const fetchMaterials = async () => {
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set('search', searchQuery)
      if (selectedDepartment !== 'all') params.set('departmentId', selectedDepartment)
      if (selectedCourse !== 'all') params.set('courseId', selectedCourse)
      if (selectedCategory !== 'all') params.set('category', selectedCategory)

      const response = await fetch(`/api/library?${params.toString()}`)
      const data = await response.json()
      setMaterials(data.materials || [])
    } catch (error) {
      console.error('Error fetching materials:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchDepartments = async () => {
    try {
      const response = await fetch('/api/departments')
      const data = await response.json()
      setDepartments(data.departments || [])
    } catch (error) {
      console.error('Error fetching departments:', error)
    }
  }

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses')
      const data = await response.json()
      setCourses(data.courses || [])
    } catch (error) {
      console.error('Error fetching courses:', error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchMaterials()
  }

  const filteredCourses = selectedDepartment !== 'all' 
    ? courses.filter(c => c.departmentId === parseInt(selectedDepartment))
    : courses

  const getFileIcon = (fileType: string) => {
    const type = fileType.toLowerCase()
    if (type.includes('pdf')) return '📄'
    if (type.includes('doc') || type.includes('docx')) return '📝'
    if (type.includes('ppt') || type.includes('pptx')) return '📊'
    if (type.includes('xls') || type.includes('xlsx')) return '📈'
    return '📁'
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Lecture': return 'bg-yellow-500/20 text-yellow-400'
      case 'Assignment': return 'bg-green-500/20 text-green-400'
      case 'Note': return 'bg-yellow-500/20 text-yellow-400'
      case 'Tutorial': return 'bg-purple-500/20 text-purple-400'
      case 'Past Question': return 'bg-red-500/20 text-red-400'
      case 'Lab Manual': return 'bg-cyan-500/20 text-cyan-400'
      case 'Syllabus': return 'bg-orange-500/20 text-orange-400'
      default: return 'bg-neutral-500/20 text-neutral-400'
    }
  }

  return (
    <StudentLayout studentName="Adeniyi Victor">
      <div className="min-h-screen bg-neutral-950">
        <div className="bg-neutral-900 border-b border-neutral-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-yellow-500" />
                e-Library
                <span className="ml-3 text-sm font-normal text-yellow-400 bg-yellow-500/20 px-3 py-1 rounded-full">
                  Course Materials
                </span>
              </h1>
              <p className="text-neutral-400 mt-1">Browse and download course materials</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg shadow p-6">
                <form onSubmit={handleSearch} className="flex flex-wrap gap-4" role="search">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 w-5 h-5" aria-hidden="true" />
                      <label htmlFor="library-search" className="sr-only">Search materials</label>
                      <input
                        id="library-search"
                        type="text"
                        placeholder="Search materials..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-yellow-600 placeholder-neutral-500"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <label htmlFor="department-filter" className="sr-only">Filter by department</label>
                    <select
                      id="department-filter"
                      value={selectedDepartment}
                      onChange={(e) => {
                        setSelectedDepartment(e.target.value)
                        setSelectedCourse('all')
                      }}
                      className="px-4 py-2 bg-neutral-800 border border-neutral-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-600"
                    >
                      <option value="all">All Departments</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id.toString()}>{dept.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label htmlFor="course-filter" className="sr-only">Filter by course</label>
                    <select
                      id="course-filter"
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="px-4 py-2 bg-neutral-800 border border-neutral-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-600"
                      disabled={courses.length === 0}
                    >
                      <option value="all">All Courses</option>
                      {filteredCourses.map((course) => (
                        <option key={course.id} value={course.id.toString()}>{course.code} - {course.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label htmlFor="category-filter" className="sr-only">Filter by category</label>
                    <select
                      id="category-filter"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-4 py-2 bg-neutral-800 border border-neutral-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-600"
                    >
                      <option value="all">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
                  >
                    <Filter className="w-4 h-4" aria-hidden="true" />
                    <span>Filter</span>
                  </button>
                </form>
              </div>

              {isLoading ? (
                <div className="bg-neutral-900 border border-neutral-800 rounded-lg shadow p-12 text-center" role="status" aria-live="polite">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-600 mx-auto"></div>
                  <p className="text-neutral-400 mt-4">Loading materials...</p>
                </div>
              ) : materials.length === 0 ? (
                <div className="bg-neutral-900 border border-neutral-800 rounded-lg shadow p-12 text-center" role="status">
                  <FolderOpen className="w-16 h-16 text-neutral-700 mx-auto mb-4" aria-hidden="true" />
                  <h3 className="text-lg font-medium text-neutral-300">No materials found</h3>
                  <p className="text-neutral-500">Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="list" aria-label="Course materials">
                  {materials.map((material) => (
                    <article key={material.id} className="bg-neutral-900 border border-neutral-800 rounded-lg shadow p-4 hover:border-yellow-600/50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="text-3xl" aria-hidden="true">{getFileIcon(material.fileType)}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">{material.title}</h3>
                          <p className="text-sm text-neutral-400 mt-1">{material.course.code} - {material.course.name}</p>
                          {material.description && (
                            <p className="text-sm text-neutral-400 mt-2 line-clamp-2">{material.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-3">
                            <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(material.category)}`}>
                              {material.category}
                            </span>
                            <span className="text-xs text-neutral-500">{material.department.name}</span>
                          </div>
                        </div>
                        <a
                          href={material.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-yellow-500 hover:bg-yellow-500/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          aria-label={`Download ${material.title}`}
                        >
                          <Download className="w-5 h-5" aria-hidden="true" />
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg shadow p-6">
                <h3 className="font-semibold text-white mb-4" id="category-heading">Browse by Category</h3>
                <div className="space-y-2" role="listbox" aria-labelledby="category-heading">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      role="option"
                      aria-selected={selectedCategory === cat}
                      onClick={() => {
                        setSelectedCategory(cat)
                        fetchMaterials()
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-neutral-900 ${
                        selectedCategory === cat 
                          ? 'bg-yellow-500/20 text-yellow-400' 
                          : 'hover:bg-neutral-800 text-neutral-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-lg shadow p-6">
                <h3 className="font-semibold text-white mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400">Total Materials</span>
                    <span className="font-semibold text-white">{materials.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400">Departments</span>
                    <span className="font-semibold text-white">{departments.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400">Courses</span>
                    <span className="font-semibold text-white">{courses.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  )
}
