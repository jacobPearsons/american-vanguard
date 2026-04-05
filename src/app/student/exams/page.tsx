'use client'

import React, { useState } from 'react'
import { StudentLayout } from '@/components/features/student-dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, Calendar, BookOpen, CheckCircle, Play, AlertCircle } from 'lucide-react'

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
  { id: 2, courseCode: 'EEE 503', courseName: 'Digital Signal Processing', examType: 'Final', date: '2026-04-18', startTime: '14:00', endTime: '17:00', duration: 180, venue: 'Exam Hall B', status: 'upcoming', totalQuestions: 100, instructions: 'Scientific calculators allowed.' },
  { id: 3, courseCode: 'EEE 505', courseName: 'Control Systems II', examType: 'Quiz', date: '2026-04-10', startTime: '10:00', endTime: '10:30', duration: 30, venue: 'LT 1', status: 'completed', totalQuestions: 20, instructions: 'Online quiz.' },
]

const mockResults = [
  { id: 1, courseCode: 'EEE 505', courseName: 'Control Systems II', examType: 'Quiz', score: 18, totalQuestions: 20, percentage: 90, grade: 'A', completedAt: '2026-03-10T10:35:00' },
]

export default function StudentExamsPage() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'results'>('schedule')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-yellow-500/20 text-yellow-400'
      case 'ongoing': return 'bg-green-500/20 text-green-400'
      case 'completed': return 'bg-neutral-500/20 text-neutral-400'
      default: return 'bg-neutral-500/20 text-neutral-400'
    }
  }

  const getExamTypeColor = (type: string) => {
    switch (type) {
      case 'Final': return 'bg-red-500/20 text-red-400'
      case 'Mid-Semester': return 'bg-yellow-500/20 text-yellow-400'
      case 'Quiz': return 'bg-purple-500/20 text-purple-400'
      default: return 'bg-neutral-500/20 text-neutral-400'
    }
  }

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const upcomingExams = mockExams.filter(e => e.status === 'upcoming')
  const completedExams = mockExams.filter(e => e.status === 'completed')

  return (
    <StudentLayout studentName="Adeniyi Victor">
      <div className="min-h-screen bg-neutral-950">
        <div className="bg-neutral-900 border-b border-neutral-800 px-6 py-4">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Calendar className="w-6 h-6 text-yellow-500" />
            E-Exam
          </h1>
          <p className="text-neutral-400 mt-1">View exam schedules and results</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <div className="flex gap-2 border-b border-neutral-800">
                <button
                  onClick={() => setActiveTab('schedule')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'schedule' ? 'border-yellow-500 text-yellow-500' : 'border-transparent text-neutral-400 hover:text-white'
                  }`}
                >
                  Exam Schedule
                </button>
                <button
                  onClick={() => setActiveTab('results')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'results' ? 'border-yellow-500 text-yellow-500' : 'border-transparent text-neutral-400 hover:text-white'
                  }`}
                >
                  My Results
                </button>
              </div>

              {activeTab === 'schedule' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-neutral-900 border-neutral-800">
                      <CardContent className="p-4 flex items-center gap-3">
                        <Clock className="w-8 h-8 text-yellow-500" />
                        <div>
                          <p className="text-sm text-neutral-400">Upcoming</p>
                          <p className="text-2xl font-bold text-white">{upcomingExams.length}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-neutral-900 border-neutral-800">
                      <CardContent className="p-4 flex items-center gap-3">
                        <Play className="w-8 h-8 text-green-500" />
                        <div>
                          <p className="text-sm text-neutral-400">Ongoing</p>
                          <p className="text-2xl font-bold text-white">{mockExams.filter(e => e.status === 'ongoing').length}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-neutral-900 border-neutral-800">
                      <CardContent className="p-4 flex items-center gap-3">
                        <CheckCircle className="w-8 h-8 text-neutral-500" />
                        <div>
                          <p className="text-sm text-neutral-400">Completed</p>
                          <p className="text-2xl font-bold text-white">{completedExams.length}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    {upcomingExams.map((exam) => (
                      <Card key={exam.id} className="bg-neutral-900 border-neutral-800 hover:border-neutral-700 transition-colors">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getExamTypeColor(exam.examType)}`}>{exam.examType}</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(exam.status)}`}>{exam.status}</span>
                              </div>
                              <h3 className="text-lg font-semibold text-white mb-1">{exam.courseCode} - {exam.courseName}</h3>
                              <div className="flex flex-wrap gap-4 text-sm text-neutral-400 mb-3">
                                <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /><span>{formatDate(exam.date)}</span></div>
                                <div className="flex items-center gap-1"><Clock className="w-4 h-4" /><span>{exam.startTime} - {exam.endTime}</span></div>
                                <span>Venue: {exam.venue}</span>
                              </div>
                              <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                                <p className="text-sm text-yellow-400">Instructions: {exam.instructions}</p>
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <p className="text-sm text-neutral-500">{exam.totalQuestions} questions</p>
                              <button className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">Start Exam</button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'results' && (
                <div className="space-y-4">
                  {mockResults.map((result) => (
                    <Card key={result.id} className="bg-neutral-900 border-neutral-800">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-white">{result.courseCode} - {result.courseName}</h3>
                            <p className="text-sm text-neutral-500">{result.examType} • Completed {new Date(result.completedAt).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold text-white">{result.percentage}%</p>
                            <span className={`px-2 py-1 rounded text-sm font-medium ${result.percentage >= 90 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>Grade: {result.grade}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <Card className="bg-neutral-900 border-neutral-800">
                <CardHeader><CardTitle className="text-white">Quick Tips</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm text-neutral-400">
                  <div className="flex items-start gap-2"><AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" /><p>Arrive 30 minutes before exam start</p></div>
                  <div className="flex items-start gap-2"><AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" /><p>Bring valid student ID card</p></div>
                  <div className="flex items-start gap-2"><AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" /><p>Check allowed materials per exam</p></div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  )
}
