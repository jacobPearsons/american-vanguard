'use client'

import React, { useState, useEffect } from 'react'
import { StudentSidebar, defaultNavItems } from '@/components/features/student-dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Award, BookOpen, TrendingUp } from 'lucide-react'

interface Grade {
  id: number
  score: number
  grade: string
  semester: string
  academicYear: string
  course: {
    code: string
    name: string
    credits: number
  }
}

const gradeColors: Record<string, string> = {
  'A': 'bg-green-100 text-green-800',
  'B': 'bg-yellow-100 text-yellow-800',
  'C': 'bg-yellow-100 text-yellow-800',
  'D': 'bg-orange-100 text-orange-800',
  'F': 'bg-red-100 text-red-800'
}

const gradePoints: Record<string, number> = { 'A': 4.0, 'B': 3.0, 'C': 2.0, 'D': 1.0, 'F': 0.0 }

export default function StudentGradesPage() {
  const [grades, setGrades] = useState<Grade[]>([])
  const [loading, setLoading] = useState(true)
  const [semester, setSemester] = useState('all')
  const [academicYear, setAcademicYear] = useState('all')

  const semesters = ['Fall 2024', 'Spring 2025', 'Fall 2025', 'Spring 2026']
  const academicYears = ['2024/2025', '2025/2026']

  useEffect(() => {
    fetchGrades()
  }, [semester, academicYear])

  const fetchGrades = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (semester !== 'all') params.set('semester', semester)
      if (academicYear !== 'all') params.set('academicYear', academicYear)

      const res = await fetch(`/api/grades?${params.toString()}`)
      const data = await res.json()
      setGrades(data.grades || [])
    } catch (error) {
      console.error('Error fetching grades:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateGPA = (gradeList: Grade[]) => {
    if (gradeList.length === 0) return '0.00'
    const totalPoints = gradeList.reduce((sum, g) => sum + (gradePoints[g.grade] || 0), 0)
    return (totalPoints / gradeList.length).toFixed(2)
  }

  const totalCredits = grades.reduce((sum, g) => sum + g.course.credits, 0)
  const currentGPA = calculateGPA(grades)

  const semestersWithGrades = Array.from(new Set(grades.map(g => `${g.semester} ${g.academicYear}`)))

  const handleNavigate = (item: { id: string; href?: string }) => {
    if (item.href) window.location.href = item.href
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="fixed left-0 top-0 h-full z-50">
        <StudentSidebar
          items={defaultNavItems}
          logoSrc="../images/newllogo.png"
          studentName="Adeniyi Victor"
          studentImage="../uploads/11015-d14efe5e-7045-42a4-9e53-0b597c3643c0_11zon-3.jpeg"
          activeItem="results"
          onNavigate={handleNavigate}
        />
      </div>

      <div className="flex-1 ml-64 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            <span className="mr-2">📊</span>
            Check Result
          </h1>
          <p className="text-gray-600">View your grades and academic performance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="flex gap-4 mb-4">
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Semesters</option>
                {semesters.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Years</option>
                {academicYears.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-80">Current GPA</p>
                      <p className="text-3xl font-bold">{currentGPA}</p>
                      <p className="text-xs opacity-80 mt-1">out of 4.0</p>
                    </div>
                    <Award className="w-10 h-10 opacity-50" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Credits</p>
                      <p className="text-3xl font-bold text-gray-800">{totalCredits}</p>
                      <p className="text-xs text-gray-500 mt-1">completed</p>
                    </div>
                    <BookOpen className="w-10 h-10 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Courses</p>
                      <p className="text-3xl font-bold text-gray-800">{grades.length}</p>
                      <p className="text-xs text-gray-500 mt-1">completed</p>
                    </div>
                    <TrendingUp className="w-10 h-10 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Grade Report</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading grades...</div>
                ) : grades.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No grades available for selected filters</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium">Course</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Credits</th>
                          <th className="px-4 py-3 text-center text-sm font-medium">Score</th>
                          <th className="px-4 py-3 text-center text-sm font-medium">Grade</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Point</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Semester</th>
                        </tr>
                      </thead>
                      <tbody>
                        {grades.map((grade) => (
                          <tr key={grade.id} className="border-t">
                            <td className="px-4 py-3">
                              <p className="font-medium text-gray-800">{grade.course.code}</p>
                              <p className="text-sm text-gray-500">{grade.course.name}</p>
                            </td>
                            <td className="px-4 py-3 text-gray-600">{grade.course.credits}</td>
                            <td className="px-4 py-3 text-center text-gray-600">{grade.score}</td>
                            <td className="px-4 py-3 text-center">
                              <span className={`px-2 py-1 rounded text-sm font-medium ${gradeColors[grade.grade] || 'bg-gray-100'}`}>
                                {grade.grade}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-600">{gradePoints[grade.grade]?.toFixed(1)}</td>
                            <td className="px-4 py-3 text-gray-500">{grade.semester} {grade.academicYear}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Semester Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                {semestersWithGrades.length === 0 ? (
                  <p className="text-gray-500 text-sm">No data available</p>
                ) : (
                  <div className="space-y-3">
                    {semestersWithGrades.map((sem) => {
                      const semGrades = grades.filter(g => `${g.semester} ${g.academicYear}` === sem)
                      const semGPA = calculateGPA(semGrades)
                      return (
                        <div key={sem} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-600">{sem}</span>
                          <span className="font-medium text-gray-800">GPA: {semGPA}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Grade Scale</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">A (90-100)</span><span className="font-medium">4.0</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">B (80-89)</span><span className="font-medium">3.0</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">C (70-79)</span><span className="font-medium">2.0</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">D (60-69)</span><span className="font-medium">1.0</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">F (0-59)</span><span className="font-medium">0.0</span></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}