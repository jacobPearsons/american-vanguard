'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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

interface Department {
  id: number
  name: string
}

interface FacultyMember {
  id: number
  firstName: string
  lastName: string
  title: string
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [faculty, setFaculty] = useState<FacultyMember[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    credits: 3,
    departmentId: '',
    maxCapacity: 50,
    semester: 'Fall 2025',
    academicYear: '2025/2026',
    instructorId: '',
    schedule: ''
  })

  const fetchCourses = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/courses')
      const data = await res.json()
      setCourses(data.courses || [])
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchDepartments = useCallback(async () => {
    try {
      const res = await fetch('/api/departments')
      const data = await res.json()
      setDepartments(data.departments || [])
    } catch (error) {
      console.error('Error fetching departments:', error)
    }
  }, [])

  const fetchFaculty = useCallback(async () => {
    try {
      const res = await fetch('/api/faculty')
      const data = await res.json()
      setFaculty(data.faculty || [])
    } catch (error) {
      console.error('Error fetching faculty:', error)
    }
  }, [])

  useEffect(() => {
    fetchCourses()
    fetchDepartments()
    fetchFaculty()
  }, [fetchCourses, fetchDepartments, fetchFaculty])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const method = editingCourse ? 'PUT' : 'POST'
    const body = editingCourse 
      ? { id: editingCourse.id, ...formData, departmentId: parseInt(formData.departmentId), instructorId: formData.instructorId ? parseInt(formData.instructorId) : null }
      : { ...formData, departmentId: parseInt(formData.departmentId), instructorId: formData.instructorId ? parseInt(formData.instructorId) : null }

    try {
      const res = await fetch('/api/admin/courses', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (res.ok) {
        fetchCourses()
        setShowModal(false)
        setEditingCourse(null)
        setFormData({ code: '', name: '', description: '', credits: 3, departmentId: '', maxCapacity: 50, semester: 'Fall 2025', academicYear: '2025/2026', instructorId: '', schedule: '' })
      }
    } catch (error) {
      console.error('Error saving course:', error)
    }
  }

  const handleEdit = (course: Course) => {
    setEditingCourse(course)
    setFormData({
      code: course.code,
      name: course.name,
      description: '',
      credits: course.credits,
      departmentId: '',
      maxCapacity: course.maxCapacity,
      semester: 'Fall 2025',
      academicYear: '2025/2026',
      instructorId: '',
      schedule: ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this course?')) return
    
    try {
      await fetch(`/api/admin/courses?id=${id}`, { method: 'DELETE' })
      fetchCourses()
    } catch (error) {
      console.error('Error deleting course:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
          <Button onClick={() => setShowModal(true)}>Add Course</Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading courses...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Code</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Department</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Credits</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Capacity</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Instructor</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr key={course.id} className="border-t">
                    <td className="px-4 py-3 font-medium">{course.code}</td>
                    <td className="px-4 py-3">{course.name}</td>
                    <td className="px-4 py-3 text-gray-500">{course.department.name}</td>
                    <td className="px-4 py-3">{course.credits}</td>
                    <td className="px-4 py-3">{course.enrolledCount}/{course.maxCapacity}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(course)}>Edit</Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(course.id)} className="text-red-600">Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold mb-4">{editingCourse ? 'Edit Course' : 'Add Course'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
                    <Input value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Credits</label>
                    <Input type="number" value={formData.credits} onChange={e => setFormData({...formData, credits: parseInt(e.target.value)})} required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                  <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <select 
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                      value={formData.departmentId}
                      onChange={e => setFormData({...formData, departmentId: e.target.value})}
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Capacity</label>
                    <Input type="number" value={formData.maxCapacity} onChange={e => setFormData({...formData, maxCapacity: parseInt(e.target.value)})} required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
                  <select 
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                    value={formData.instructorId}
                    onChange={e => setFormData({...formData, instructorId: e.target.value})}
                  >
                    <option value="">Select Instructor</option>
                    {faculty.map(f => <option key={f.id} value={f.id}>{f.firstName} {f.lastName} - {f.title}</option>)}
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button type="submit">{editingCourse ? 'Update' : 'Create'}</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
