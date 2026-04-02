'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, FileText, Download, BookOpen, Filter, FolderOpen } from 'lucide-react'
import { StudentSidebar, defaultNavItems } from '@/components/features/student-dashboard/StudentSidebar'

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
      case 'Lecture': return 'bg-yellow-100 text-yellow-800'
      case 'Assignment': return 'bg-green-100 text-green-800'
      case 'Note': return 'bg-yellow-100 text-yellow-800'
      case 'Tutorial': return 'bg-purple-100 text-purple-800'
      case 'Past Question': return 'bg-red-100 text-red-800'
      case 'Lab Manual': return 'bg-cyan-100 text-cyan-800'
      case 'Syllabus': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="fixed left-0 top-0 h-full z-50">
        <StudentSidebar
          items={defaultNavItems}
          logoSrc="../images/newllogo.png"
          studentName="Adeniyi Victor"
          studentImage="../uploads/11015-d14efe5e-7045-42a4-9e53-0b597c3643c0_11zon-3.jpeg"
          activeItem="library"
          onNavigate={() => {}}
        />
      </div>

      <div className="flex-1 ml-64 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            <span className="mr-2">📖</span>
            e-Library
            <span className="ml-3 text-sm font-normal text-yellow-600 bg-yellow-100 px-3 py-1 rounded">
              Course Materials
            </span>
          </h1>
          <p className="text-gray-600 mt-2">Browse and download course materials</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search materials..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <select
                  value={selectedDepartment}
                  onChange={(e) => {
                    setSelectedDepartment(e.target.value)
                    setSelectedCourse('all')
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id.toString()}>{dept.name}</option>
                  ))}
                </select>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={courses.length === 0}
                >
                  <option value="all">All Courses</option>
                  {filteredCourses.map((course) => (
                    <option key={course.id} value={course.id.toString()}>{course.code} - {course.name}</option>
                  ))}
                </select>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </form>
            </div>

            {isLoading ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-4">Loading materials...</p>
              </div>
            ) : materials.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600">No materials found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {materials.map((material) => (
                  <div key={material.id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{getFileIcon(material.fileType)}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{material.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{material.course.code} - {material.course.name}</p>
                        {material.description && (
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{material.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(material.category)}`}>
                            {material.category}
                          </span>
                          <span className="text-xs text-gray-400">{material.department.name}</span>
                        </div>
                      </div>
                      <a
                        href={material.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg"
                        title="Download"
                      >
                        <Download className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Browse by Category</h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat)
                      fetchMaterials()
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === cat 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Materials</span>
                  <span className="font-semibold text-gray-800">{materials.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Departments</span>
                  <span className="font-semibold text-gray-800">{departments.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Courses</span>
                  <span className="font-semibold text-gray-800">{courses.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}