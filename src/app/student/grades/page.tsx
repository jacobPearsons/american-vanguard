'use client'

import React, { useState, useEffect } from 'react'
import { StudentLayout } from '@/components/features/student-dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader, StatsCard, FilterBar, DataTable, EmptyState, type Column } from '@/components/ui'
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
  'A': 'bg-green-500/20 text-green-400',
  'B': 'bg-blue-500/20 text-blue-400',
  'C': 'bg-yellow-500/20 text-yellow-400',
  'D': 'bg-orange-500/20 text-orange-400',
  'F': 'bg-red-500/20 text-red-400'
}

const gradePoints: Record<string, number> = { 'A': 4.0, 'B': 3.0, 'C': 2.0, 'D': 1.0, 'F': 0.0 }

const gradeColumns: Column[] = [
  { 
    key: 'course', 
    header: 'Course', 
    render: (row: unknown) => {
      const g = row as Grade
      return (
        <>
          <p className="font-medium text-white">{g.course.code}</p>
          <p className="text-sm text-neutral-400">{g.course.name}</p>
        </>
      )
    }
  },
  { key: 'credits', header: 'Credits', render: (row: unknown) => (row as Grade).course.credits },
  { key: 'score', header: 'Score', className: 'text-center', render: (row: unknown) => (row as Grade).score },
  { 
    key: 'grade', 
    header: 'Grade', 
    className: 'text-center',
    render: (row: unknown) => {
      const g = row as Grade
      return (
        <span className={`px-2 py-1 rounded text-sm font-medium ${gradeColors[g.grade] || 'bg-neutral-500/20 text-neutral-400'}`}>
          {g.grade}
        </span>
      )
    }
  },
  { key: 'point', header: 'Point', render: (row: unknown) => gradePoints[(row as Grade).grade]?.toFixed(1) },
  { 
    key: 'semester', 
    header: 'Semester', 
    render: (row: unknown) => {
      const g = row as Grade
      return <span className="text-neutral-500">{g.semester} {g.academicYear}</span>
    }
  }
]

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

  return (
    <StudentLayout studentName="Adeniyi Victor">
      <div className="min-h-screen bg-neutral-950">
        <PageHeader 
          title="Check Result" 
          description="View your grades and academic performance"
          icon={Award}
        />

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <FilterBar
                filters={[
                  { name: 'Semester', options: [{ value: 'all', label: 'All Semesters' }, ...semesters.map(s => ({ value: s, label: s }))], value: semester, onChange: setSemester },
                  { name: 'Year', options: [{ value: 'all', label: 'All Years' }, ...academicYears.map(y => ({ value: y, label: y }))], value: academicYear, onChange: setAcademicYear }
                ]}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatsCard
                  title="Current GPA"
                  value={currentGPA}
                  subtitle="out of 4.0"
                  icon={Award}
                  variant="gradient"
                />
                <StatsCard
                  title="Total Credits"
                  value={totalCredits}
                  subtitle="completed"
                  icon={BookOpen}
                />
                <StatsCard
                  title="Courses"
                  value={grades.length}
                  subtitle="completed"
                  icon={TrendingUp}
                />
              </div>

              <DataTable
                columns={gradeColumns}
                data={grades}
                emptyMessage="No grades available for selected filters"
                loading={loading}
                getRowId={(row) => (row as { id: number }).id}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="bg-neutral-900 border-neutral-800">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Semester Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  {semestersWithGrades.length === 0 ? (
                    <p className="text-neutral-500 text-sm">No data available</p>
                  ) : (
                    <div className="space-y-3">
                      {semestersWithGrades.map((sem) => {
                        const semGrades = grades.filter(g => `${g.semester} ${g.academicYear}` === sem)
                        const semGPA = calculateGPA(semGrades)
                        return (
                          <div key={sem} className="flex justify-between items-center p-2 bg-neutral-800 rounded-lg">
                            <span className="text-sm text-neutral-400">{sem}</span>
                            <span className="font-medium text-yellow-500">GPA: {semGPA}</span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-neutral-900 border-neutral-800">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Grade Scale</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-neutral-400">A (90-100)</span><span className="font-medium text-green-400">4.0</span></div>
                    <div className="flex justify-between"><span className="text-neutral-400">B (80-89)</span><span className="font-medium text-blue-400">3.0</span></div>
                    <div className="flex justify-between"><span className="text-neutral-400">C (70-79)</span><span className="font-medium text-yellow-400">2.0</span></div>
                    <div className="flex justify-between"><span className="text-neutral-400">D (60-69)</span><span className="font-medium text-orange-400">1.0</span></div>
                    <div className="flex justify-between"><span className="text-neutral-400">F (0-59)</span><span className="font-medium text-red-400">0.0</span></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  )
}
