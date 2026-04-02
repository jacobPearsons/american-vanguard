'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StudentSidebar, defaultNavItems } from '@/components/features/student-dashboard'
import { Clock, Calendar, BookOpen, CheckCircle, AlertCircle, Play, Eye } from 'lucide-react'

interface Exam {
  id: number
  courseCode: string
  courseName: string
  examType: 'Mid-Semester' | 'Final' | 'Quiz'
  date: string
  startTime: string
  endTime: string
  duration: number
  venue: string
  status: 'upcoming' | 'ongoing' | 'completed'
  totalQuestions: number
  instructions: string
}

const mockExams: Exam[] = [
  { id: 1, courseCode: 'EEE 501', courseName: 'Advanced Power Systems', examType: 'Mid-Semester', date: '2026-04-15', startTime: '09:00', endTime: '11:00', duration: 120, venue: 'Exam Hall A', status: 'upcoming', totalQuestions: 50, instructions: 'Bring your student ID. No calculators allowed.' },
  { id: 2, courseCode: 'EEE 503', courseName: 'Digital Signal Processing', examType: 'Final', date: '2026-04-18', startTime: '14:00', endTime: '17:00', duration: 180, venue: 'Exam Hall B', status: 'upcoming', totalQuestions: 100, instructions: 'Scientific calculators allowed. Bring your own.' },
  { id: 3, courseCode: 'EEE 505', courseName: 'Control Systems II', examType: 'Quiz', date: '2026-04-10', startTime: '10:00', endTime: '10:30', duration: 30, venue: 'LT 1', status: 'completed', totalQuestions: 20, instructions: 'Online quiz via e-learning platform.' },
]

interface ExamResult {
  id: number
  courseCode: string
  courseName: string
  examType: string
  score: number
  totalQuestions: number
  percentage: number
  grade: string
  completedAt: string
}

const mockResults: ExamResult[] = [
  { id: 1, courseCode: 'EEE 505', courseName: 'Control Systems II', examType: 'Quiz', score: 18, totalQuestions: 20, percentage: 90, grade: 'A', completedAt: '2026-03-10T10:35:00' },
]

export default function StudentExamsPage() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'results'>('schedule')

  const handleNavigate = (item: { id: string; href?: string }) => {
    if (item.href) window.location.href = item.href
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-yellow-100 text-yellow-800'
      case 'ongoing': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100'
    }
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
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }

  const upcomingExams = mockExams.filter(e => e.status === 'upcoming')
  const completedExams = mockExams.filter(e => e.status === 'completed')

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="fixed left-0 top-0 h-full z-50">
        <StudentSidebar
          items={defaultNavItems}
          logoSrc="../images/newllogo.png"
          studentName="Adeniyi Victor"
          studentImage="../uploads/11015-d14efe5e-7045-42a4-9e53-0b597c3643c0_11zon-3.jpeg"
          activeItem="exam"
          onNavigate={handleNavigate}
        />
      </div>

      <div className="flex-1 ml-64 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            <span className="mr-2">📝</span>
            E-Exam
          </h1>
          <p className="text-gray-600">View exam schedules and results</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="flex gap-2 border-b">
              <button
                onClick={() => setActiveTab('schedule')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'schedule' ? 'border-blue-600 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Exam Schedule
              </button>
              <button
                onClick={() => setActiveTab('results')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'results' ? 'border-blue-600 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                My Results
              </button>
            </div>

            {activeTab === 'schedule' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-yellow-50 border-blue-200">
                    <CardContent className="p-4 flex items-center gap-3">
                      <Clock className="w-8 h-8 text-yellow-600" />
                      <div>
                        <p className="text-sm text-yellow-600">Upcoming</p>
                        <p className="text-2xl font-bold text-yellow-800">{upcomingExams.length}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4 flex items-center gap-3">
                      <Play className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="text-sm text-green-600">Ongoing</p>
                        <p className="text-2xl font-bold text-green-800">{mockExams.filter(e => e.status === 'ongoing').length}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-50 border-gray-200">
                    <CardContent className="p-4 flex items-center gap-3">
                      <CheckCircle className="w-8 h-8 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Completed</p>
                        <p className="text-2xl font-bold text-gray-800">{completedExams.length}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  {upcomingExams.map((exam) => (
                    <Card key={exam.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getExamTypeColor(exam.examType)}`}>
                                {exam.examType}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(exam.status)}`}>
                                {exam.status}
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">
                              {exam.courseCode} - {exam.courseName}
                            </h3>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(exam.date)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{exam.startTime} - {exam.endTime}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <BookOpen className="w-4 h-4" />
                                <span>{exam.duration} minutes</span>
                              </div>
                              <span>Venue: {exam.venue}</span>
                            </div>
                            <div className="p-3 bg-yellow-50 rounded-lg">
                              <p className="text-sm text-yellow-800">📋 Instructions: {exam.instructions}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">{exam.totalQuestions} questions</p>
                            <button className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
                              Start Exam
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {upcomingExams.length === 0 && (
                  <div className="bg-white rounded-lg shadow p-12 text-center">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600">No upcoming exams</h3>
                    <p className="text-gray-500">Check back later for exam schedules</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'results' && (
              <div className="space-y-4">
                {mockResults.map((result) => (
                  <Card key={result.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{result.courseCode} - {result.courseName}</h3>
                          <p className="text-sm text-gray-500">{result.examType} • Completed {new Date(result.completedAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-gray-800">{result.percentage}%</p>
                          <span className={`px-2 py-1 rounded text-sm font-medium ${
                            result.percentage >= 90 ? 'bg-green-100 text-green-800' :
                            result.percentage >= 80 ? 'bg-yellow-100 text-yellow-800' :
                            result.percentage >= 70 ? 'bg-yellow-100 text-yellow-800' :
                            result.percentage >= 60 ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
                          }`}>
                            Grade: {result.grade}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-4 text-sm">
                        <div className="flex-1 bg-gray-100 rounded-full h-2">
                          <div className="bg-yellow-600 h-2 rounded-full" style={{ width: `${result.percentage}%` }} />
                        </div>
                        <span>{result.score}/{result.totalQuestions} correct</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {mockResults.length === 0 && (
                  <div className="bg-white rounded-lg shadow p-12 text-center">
                    <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600">No exam results yet</h3>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />
                  <p>Arrive 30 minutes before exam start</p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />
                  <p>Bring valid student ID card</p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />
                  <p>Check allowed materials per exam</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Support</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                <p>Having issues with your exam?</p>
                <p className="mt-2 text-yellow-600">exam-support@university.edu</p>
                <p className="text-yellow-600">+234 800 123 4567</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}