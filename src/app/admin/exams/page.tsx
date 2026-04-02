'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Edit, Trash2, Calendar, Clock, BookOpen, Users } from 'lucide-react'

interface ExamSchedule {
  id: number
  courseCode: string
  courseName: string
  examType: 'Mid-Semester' | 'Final' | 'Quiz'
  date: string
  startTime: string
  endTime: string
  duration: number
  venue: string
  department: string
  level: number
  totalStudents: number
  isPublished: boolean
}

const mockSchedules: ExamSchedule[] = [
  { id: 1, courseCode: 'EEE 501', courseName: 'Advanced Power Systems', examType: 'Mid-Semester', date: '2026-04-15', startTime: '09:00', endTime: '11:00', duration: 120, venue: 'Exam Hall A', department: 'Engineering', level: 500, totalStudents: 45, isPublished: true },
  { id: 2, courseCode: 'EEE 503', courseName: 'Digital Signal Processing', examType: 'Final', date: '2026-04-18', startTime: '14:00', endTime: '17:00', duration: 180, venue: 'Exam Hall B', department: 'Engineering', level: 500, totalStudents: 42, isPublished: true },
  { id: 3, courseCode: 'EEE 505', courseName: 'Control Systems II', examType: 'Quiz', date: '2026-04-20', startTime: '10:00', endTime: '10:30', duration: 30, venue: 'LT 1', department: 'Engineering', level: 500, totalStudents: 45, isPublished: false },
]

const examTypes = ['Mid-Semester', 'Final', 'Quiz']
const venues = ['Exam Hall A', 'Exam Hall B', 'LT 1', 'LT 2', 'LT 3', 'Computer Lab 1']
const departments = ['Engineering', 'Computer Science', 'Business', 'Arts']
const levels = [100, 200, 300, 400, 500]

export default function AdminExamsPage() {
  const [schedules, setSchedules] = useState<ExamSchedule[]>(mockSchedules)
  const [showModal, setShowModal] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<ExamSchedule | null>(null)
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredSchedules = schedules.filter(s => {
    const matchesDept = filterDepartment === 'all' || s.department === filterDepartment
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'published' && s.isPublished) ||
      (filterStatus === 'draft' && !s.isPublished)
    return matchesDept && matchesStatus
  })

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this exam schedule?')) {
      setSchedules(schedules.filter(s => s.id !== id))
    }
  }

  const togglePublish = (id: number) => {
    setSchedules(schedules.map(s => s.id === id ? { ...s, isPublished: !s.isPublished } : s))
  }

  const getExamTypeColor = (type: string) => {
    switch (type) {
      case 'Final': return 'bg-red-100 text-red-800'
      case 'Mid-Semester': return 'bg-yellow-100 text-yellow-800'
      case 'Quiz': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100'
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              <span className="mr-2">📝</span>
              Exam Schedule Management
            </h1>
            <p className="text-gray-600">Create and manage exam schedules</p>
          </div>
          <button
            onClick={() => { setEditingSchedule(null); setShowModal(true) }}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            <Plus className="w-4 h-4" />
            Add Exam Schedule
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="flex gap-4">
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Departments</option>
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            {filteredSchedules.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600">No exam schedules found</h3>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSchedules.map((schedule) => (
                  <Card key={schedule.id} className={!schedule.isPublished ? 'opacity-70' : ''}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getExamTypeColor(schedule.examType)}`}>
                              {schedule.examType}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              schedule.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {schedule.isPublished ? 'Published' : 'Draft'}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {schedule.courseCode} - {schedule.courseName}
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(schedule.date)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>{schedule.startTime} - {schedule.endTime}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <BookOpen className="w-4 h-4" />
                              <span>{schedule.venue}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Users className="w-4 h-4" />
                              <span>{schedule.totalStudents} students</span>
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-gray-500">
                            {schedule.department} • Level {schedule.level} • {schedule.duration} minutes
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => togglePublish(schedule.id)}
                            className={`px-3 py-1 rounded text-sm ${
                              schedule.isPublished ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                          >
                            {schedule.isPublished ? 'Unpublish' : 'Publish'}
                          </button>
                          <button
                            onClick={() => { setEditingSchedule(schedule); setShowModal(true) }}
                            className="p-2 text-gray-400 hover:text-yellow-600"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(schedule.id)}
                            className="p-2 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Schedules</span>
                    <span className="text-sm font-medium text-gray-800">{schedules.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Published</span>
                    <span className="text-sm font-medium text-green-600">{schedules.filter(s => s.isPublished).length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Draft</span>
                    <span className="text-sm font-medium text-gray-600">{schedules.filter(s => !s.isPublished).length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">By Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {examTypes.map(type => (
                    <div key={type} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-600">{type}</span>
                      <span className="text-sm font-medium">{schedules.filter(s => s.examType === type).length}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-yellow-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-medium text-yellow-800 mb-2">Quick Actions</h4>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 text-sm text-yellow-700 hover:bg-yellow-100 rounded">
                    📅 Generate Timetable
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-yellow-700 hover:bg-yellow-100 rounded">
                    📧 Notify Students
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-yellow-700 hover:bg-yellow-100 rounded">
                    🖨️ Print Schedule
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}