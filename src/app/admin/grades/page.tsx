'use client'

import React, { useState } from 'react'
import { AdminLayout, AdminCard, AdminStats } from '@/components/admin'
import { Button } from '@/components/ui/button'
import { Upload, Download, Edit, Trash2, Save, X, FileSpreadsheet, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface Course {
  id: number
  code: string
  name: string
}

interface StudentGrade {
  id: number
  studentId: string
  score: number
  grade: string
  semester: string
  academicYear: string
  course?: Course
}

const mockCourses: Course[] = [
  { id: 1, code: 'EEE 501', name: 'Advanced Power Systems' },
  { id: 2, code: 'EEE 503', name: 'Digital Signal Processing' },
  { id: 3, code: 'EEE 505', name: 'Control Systems II' },
]

const mockStudents = [
  { id: 'user_1', name: 'Adeniyi Victor', matricNumber: '2005003013' },
  { id: 'user_2', name: 'Sarah Johnson', matricNumber: '2005003014' },
  { id: 'user_3', name: 'Michael Chen', matricNumber: '2005003015' },
  { id: 'user_4', name: 'Grace Williams', matricNumber: '2005003016' },
]

const mockGrades: StudentGrade[] = [
  { id: 1, studentId: 'user_1', score: 85, grade: 'B', semester: 'Fall 2025', academicYear: '2025/2026', course: mockCourses[0] },
  { id: 2, studentId: 'user_1', score: 92, grade: 'A', semester: 'Fall 2025', academicYear: '2025/2026', course: mockCourses[1] },
  { id: 3, studentId: 'user_2', score: 78, grade: 'C', semester: 'Fall 2025', academicYear: '2025/2026', course: mockCourses[0] },
  { id: 4, studentId: 'user_3', score: 88, grade: 'B', semester: 'Fall 2025', academicYear: '2025/2026', course: mockCourses[2] },
]

export default function AdminGradesPage() {
  const [grades, setGrades] = useState<StudentGrade[]>(mockGrades)
  const [selectedCourse, setSelectedCourse] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editScore, setEditScore] = useState('')

  const filteredGrades = grades.filter(g => {
    const matchesCourse = selectedCourse === 'all' || g.course?.id.toString() === selectedCourse
    const matchesSearch = searchQuery === '' || 
      mockStudents.find(s => s.id === g.studentId)?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mockStudents.find(s => s.id === g.studentId)?.matricNumber.includes(searchQuery)
    return matchesCourse && matchesSearch
  })

  const getStudentName = (studentId: string) => mockStudents.find(s => s.id === studentId)?.name || 'Unknown'
  const getMatricNumber = (studentId: string) => mockStudents.find(s => s.id === studentId)?.matricNumber || ''

  const handleEdit = (id: number, score: number) => {
    setEditingId(id)
    setEditScore(score.toString())
  }

  const handleSave = (id: number) => {
    const score = parseInt(editScore)
    if (score >= 0 && score <= 100) {
      const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F'
      setGrades(grades.map(g => g.id === id ? { ...g, score, grade } : g))
      setEditingId(null)
    }
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-500/20 text-green-400'
      case 'B': return 'bg-blue-500/20 text-blue-400'
      case 'C': return 'bg-yellow-500/20 text-yellow-400'
      case 'D': return 'bg-orange-500/20 text-orange-400'
      case 'F': return 'bg-red-500/20 text-red-400'
      default: return 'bg-neutral-500/20 text-neutral-400'
    }
  }

  const averageScore = grades.length > 0 ? Math.round(grades.reduce((sum, g) => sum + g.score, 0) / grades.length) : 0
  const passRate = grades.length > 0 ? Math.round((grades.filter(g => g.score >= 60).length / grades.length) * 100) : 0

  const stats = [
    { label: 'Total Records', value: grades.length },
    { label: 'Average Score', value: averageScore },
    { label: 'Pass Rate', value: `${passRate}%`, color: 'text-green-400' },
  ]

  return (
    <AdminLayout
      title="Grade Management"
      description="Upload and manage student grades"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" className="border-neutral-700 text-white hover:bg-neutral-800 gap-2">
            <Upload className="w-4 h-4" /> Bulk Upload
          </Button>
          <Button className="bg-yellow-600 hover:bg-yellow-700 gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>
      }
    >
      <AdminStats stats={stats} />
      
      <AdminCard>
        <div className="flex gap-4 flex-wrap">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white"
          >
            <option value="all">All Courses</option>
            {mockCourses.map(c => <option key={c.id} value={c.id.toString()}>{c.code}</option>)}
          </select>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by student name or matric number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:ring-2 focus:ring-yellow-600"
            />
          </div>
        </div>
      </AdminCard>

      <AdminCard title={`Grade Records (${filteredGrades.length})`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-800">
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">Matric No.</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">Student Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">Course</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-neutral-400">Score</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-neutral-400">Grade</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-neutral-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGrades.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-400">
                    No grades found for selected filters
                  </td>
                </tr>
              ) : (
                filteredGrades.map((grade) => (
                  <tr key={grade.id} className="border-b border-neutral-800 hover:bg-neutral-800/50">
                    <td className="py-3 px-4 text-neutral-300">{getMatricNumber(grade.studentId)}</td>
                    <td className="py-3 px-4 text-white">{getStudentName(grade.studentId)}</td>
                    <td className="py-3 px-4 text-neutral-400">{grade.course?.code}</td>
                    <td className="py-3 px-4 text-center">
                      {editingId === grade.id ? (
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={editScore}
                          onChange={(e) => setEditScore(e.target.value)}
                          className="w-20 px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-center text-white"
                        />
                      ) : (
                        <span className="text-white">{grade.score}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getGradeColor(grade.grade)}`}>
                        {grade.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {editingId === grade.id ? (
                        <div className="flex justify-center gap-1">
                          <button onClick={() => handleSave(grade.id)} className="p-1 text-green-400 hover:text-green-300">
                            <Save className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-1 text-neutral-400 hover:text-neutral-300">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-center gap-1">
                          <button onClick={() => handleEdit(grade.id, grade.score)} className="p-1 text-neutral-400 hover:text-yellow-500">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-neutral-400 hover:text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>

      <AdminCard>
        <div className="flex items-center gap-4">
          <FileSpreadsheet className="w-10 h-10 text-neutral-500" />
          <div>
            <p className="text-sm text-neutral-300">Upload Excel/CSV file</p>
            <p className="text-xs text-neutral-500">Columns: MatricNo, CourseCode, Score</p>
          </div>
        </div>
      </AdminCard>
    </AdminLayout>
  )
}
