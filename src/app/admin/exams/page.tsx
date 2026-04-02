'use client'

import React, { useState } from 'react'
import { AdminLayout, AdminCard, AdminStats } from '@/components/admin'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, Calendar, Clock, BookOpen, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface ExamSchedule {
  id: number
  courseCode: string
  courseName: string
  examType: 'Mid-Semester' | 'Final' | 'Quiz'
  date: string
  startTime: string
  endTime: string
  venue: string
  department: string
  totalStudents: number
  isPublished: boolean
}

const mockSchedules: ExamSchedule[] = [
  { id: 1, courseCode: 'EEE 501', courseName: 'Advanced Power Systems', examType: 'Mid-Semester', date: '2026-04-15', startTime: '09:00', endTime: '11:00', venue: 'Exam Hall A', department: 'Engineering', totalStudents: 45, isPublished: true },
  { id: 2, courseCode: 'EEE 503', courseName: 'Digital Signal Processing', examType: 'Final', date: '2026-04-18', startTime: '14:00', endTime: '17:00', venue: 'Exam Hall B', department: 'Engineering', totalStudents: 42, isPublished: true },
  { id: 3, courseCode: 'EEE 505', courseName: 'Control Systems II', examType: 'Quiz', date: '2026-04-20', startTime: '10:00', endTime: '10:30', venue: 'LT 1', department: 'Engineering', totalStudents: 45, isPublished: false },
]

const departments = ['Engineering', 'Computer Science', 'Business', 'Arts']

export default function AdminExamsPage() {
  const [schedules, setSchedules] = useState<ExamSchedule[]>(mockSchedules)
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredSchedules = schedules.filter(s => {
    const matchesDept = filterDepartment === 'all' || s.department === filterDepartment
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'published' && s.isPublished) ||
      (filterStatus === 'draft' && !s.isPublished)
    return matchesDept && matchesStatus
  })

  const togglePublish = (id: number) => {
    setSchedules(schedules.map(s => s.id === id ? { ...s, isPublished: !s.isPublished } : s))
  }

  const getExamTypeColor = (type: string) => {
    switch (type) {
      case 'Final': return 'bg-red-500/20 text-red-400'
      case 'Mid-Semester': return 'bg-yellow-500/20 text-yellow-400'
      case 'Quiz': return 'bg-purple-500/20 text-purple-400'
      default: return 'bg-neutral-500/20 text-neutral-400'
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  const stats = [
    { label: 'Total Schedules', value: schedules.length },
    { label: 'Published', value: schedules.filter(s => s.isPublished).length, color: 'text-green-400' },
    { label: 'Draft', value: schedules.filter(s => !s.isPublished).length, color: 'text-neutral-400' },
  ]

  return (
    <AdminLayout
      title="Exam Schedule Management"
      description="Create and manage exam schedules"
      actions={
        <Button className="bg-yellow-600 hover:bg-yellow-700 gap-2">
          <Plus className="w-4 h-4" /> Add Exam Schedule
        </Button>
      }
    >
      <AdminStats stats={stats} />
      
      <AdminCard>
        <div className="flex gap-4">
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white"
          >
            <option value="all">All Departments</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </AdminCard>

      <div className="space-y-4">
        {filteredSchedules.length === 0 ? (
          <AdminCard>
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-400">No exam schedules found</h3>
            </div>
          </AdminCard>
        ) : (
          filteredSchedules.map((schedule) => (
            <AdminCard key={schedule.id} className={!schedule.isPublished ? 'opacity-70' : ''}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getExamTypeColor(schedule.examType)}`}>
                      {schedule.examType}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      schedule.isPublished ? 'bg-green-500/20 text-green-400' : 'bg-neutral-500/20 text-neutral-400'
                    }`}>
                      {schedule.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {schedule.courseCode} - {schedule.courseName}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-neutral-400">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(schedule.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-400">
                      <Clock className="w-4 h-4" />
                      <span>{schedule.startTime} - {schedule.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-400">
                      <BookOpen className="w-4 h-4" />
                      <span>{schedule.venue}</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-400">
                      <Users className="w-4 h-4" />
                      <span>{schedule.totalStudents} students</span>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-neutral-500">
                    {schedule.department}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => togglePublish(schedule.id)}
                    className={`px-3 py-1 rounded text-sm ${
                      schedule.isPublished ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700' : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {schedule.isPublished ? 'Unpublish' : 'Publish'}
                  </button>
                  <button className="p-2 text-neutral-400 hover:text-yellow-600">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-neutral-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </AdminCard>
          ))
        )}
      </div>
    </AdminLayout>
  )
}
