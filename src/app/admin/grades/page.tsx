'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, Search, Download, Edit, Trash2, Save, X, FileSpreadsheet, Filter } from 'lucide-react'

interface Course {
  id: number
  code: string
  name: string
  department: { name: string }
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

interface Student {
  id: string
  name: string
  matricNumber: string
  department: string
}

const mockCourses: Course[] = [
  { id: 1, code: 'EEE 501', name: 'Advanced Power Systems', department: { name: 'Electrical Engineering' } },
  { id: 2, code: 'EEE 503', name: 'Digital Signal Processing', department: { name: 'Electrical Engineering' } },
  { id: 3, code: 'EEE 505', name: 'Control Systems II', department: { name: 'Electrical Engineering' } },
  { id: 4, code: 'EEE 507', name: 'Microelectronics', department: { name: 'Electrical Engineering' } },
]

const mockStudents: Student[] = [
  { id: 'user_1', name: 'Adeniyi Victor', matricNumber: '2005003013', department: 'Electrical Engineering' },
  { id: 'user_2', name: 'Sarah Johnson', matricNumber: '2005003014', department: 'Electrical Engineering' },
  { id: 'user_3', name: 'Michael Chen', matricNumber: '2005003015', department: 'Electrical Engineering' },
  { id: 'user_4', name: 'Grace Williams', matricNumber: '2005003016', department: 'Electrical Engineering' },
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
  const [selectedSemester, setSelectedSemester] = useState('Fall 2025')
  const [selectedYear, setSelectedYear] = useState('2025/2026')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editScore, setEditScore] = useState('')
  const [showUploadModal, setShowUploadModal] = useState(false)

  const semesters = ['Fall 2025', 'Spring 2026']
  const academicYears = ['2025/2026', '2026/2027']

  const filteredGrades = grades.filter(g => {
    const matchesCourse = selectedCourse === 'all' || g.course?.id.toString() === selectedCourse
    const matchesSearch = searchQuery === '' || 
      mockStudents.find(s => s.id === g.studentId)?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mockStudents.find(s => s.id === g.studentId)?.matricNumber.includes(searchQuery)
    return matchesCourse && matchesSearch && g.semester === selectedSemester && g.academicYear === selectedYear
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

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this grade?')) {
      setGrades(grades.filter(g => g.id !== id))
    }
  }

  const handleBulkUpload = () => {
    setShowUploadModal(true)
  }

  const handleExport = () => {
    const csvContent = [
      ['Matric Number', 'Name', 'Course', 'Score', 'Grade', 'Semester', 'Academic Year'].join(','),
      ...filteredGrades.map(g => [
        getMatricNumber(g.studentId),
        getStudentName(g.studentId),
        g.course?.code || '',
        g.score,
        g.grade,
        g.semester,
        g.academicYear
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `grades_${selectedSemester}_${selectedYear}.csv`
    a.click()
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800'
      case 'B': return 'bg-yellow-100 text-yellow-800'
      case 'C': return 'bg-yellow-100 text-yellow-800'
      case 'D': return 'bg-orange-100 text-orange-800'
      case 'F': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              <span className="mr-2">📊</span>
              Grade Management
            </h1>
            <p className="text-gray-600">Upload and manage student grades</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleBulkUpload}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Upload className="w-4 h-4" />
              Bulk Upload
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="flex flex-wrap gap-4">
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Courses</option>
                {mockCourses.map(c => <option key={c.id} value={c.id.toString()}>{c.code} - {c.name}</option>)}
              </select>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {semesters.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {academicYears.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by student name or matric number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Grade Records ({filteredGrades.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium">Matric No.</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Student Name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Course</th>
                        <th className="px-4 py-3 text-center text-sm font-medium">Score</th>
                        <th className="px-4 py-3 text-center text-sm font-medium">Grade</th>
                        <th className="px-4 py-3 text-center text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredGrades.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                            No grades found for selected filters
                          </td>
                        </tr>
                      ) : (
                        filteredGrades.map((grade) => (
                          <tr key={grade.id} className="border-t">
                            <td className="px-4 py-3 text-sm text-gray-800">{getMatricNumber(grade.studentId)}</td>
                            <td className="px-4 py-3 text-sm text-gray-800">{getStudentName(grade.studentId)}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{grade.course?.code}</td>
                            <td className="px-4 py-3 text-center">
                              {editingId === grade.id ? (
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={editScore}
                                  onChange={(e) => setEditScore(e.target.value)}
                                  className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                                />
                              ) : (
                                <span className="text-sm text-gray-800">{grade.score}</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getGradeColor(grade.grade)}`}>
                                {grade.grade}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              {editingId === grade.id ? (
                                <div className="flex justify-center gap-1">
                                  <button
                                    onClick={() => handleSave(grade.id)}
                                    className="p-1 text-green-600 hover:text-green-800"
                                  >
                                    <Save className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setEditingId(null)}
                                    className="p-1 text-gray-400 hover:text-gray-600"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex justify-center gap-1">
                                  <button
                                    onClick={() => handleEdit(grade.id, grade.score)}
                                    className="p-1 text-gray-400 hover:text-yellow-600"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(grade.id)}
                                    className="p-1 text-gray-400 hover:text-red-600"
                                  >
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
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Records</span>
                    <span className="text-sm font-medium text-gray-800">{grades.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Score</span>
                    <span className="text-sm font-medium text-gray-800">
                      {Math.round(grades.reduce((sum, g) => sum + g.score, 0) / grades.length)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Pass Rate</span>
                    <span className="text-sm font-medium text-green-600">
                      {Math.round((grades.filter(g => g.score >= 60).length / grades.length) * 100)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Grade Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {['A', 'B', 'C', 'D', 'F'].map((g) => {
                    const count = grades.filter(gr => gr.grade === g).length
                    const percentage = Math.round((count / grades.length) * 100)
                    return (
                      <div key={g} className="flex items-center gap-2">
                        <span className="w-6 text-sm text-gray-600">{g}</span>
                        <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-500" style={{ width: `${percentage}%` }} />
                        </div>
                        <span className="w-8 text-sm text-gray-600">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-dashed border-2 border-gray-300">
              <CardContent className="p-6 text-center">
                <FileSpreadsheet className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Upload Excel/CSV file</p>
                <p className="text-xs text-gray-400 mt-1">Columns: MatricNo, CourseCode, Score</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}