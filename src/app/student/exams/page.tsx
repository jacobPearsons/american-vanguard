'use client'

import React, { useState, useEffect, useRef } from 'react'
import { StudentLayout } from '@/components/features/student-dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader, StatsCard, EmptyState } from '@/components/ui'
import { Clock, Calendar, BookOpen, CheckCircle, Play, AlertCircle, FileQuestion, Inbox } from 'lucide-react'

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

export default function StudentExamsPage() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'results'>('schedule')
  const [exams, setExams] = useState<Exam[]>([])
  const [results, setResults] = useState<ExamResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [examsRes, resultsRes] = await Promise.all([
          fetch('/api/student/exams'),
          fetch('/api/student/exams?type=results')
        ])
        const examsData = await examsRes.json()
        const resultsData = await resultsRes.json()
        setExams(examsData.exams || [])
        setResults(resultsData.results || [])
      } catch (error) {
        console.error('Failed to fetch exam data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

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

  const upcomingExams = exams.filter(e => e.status === 'upcoming')
  const completedExams = exams.filter(e => e.status === 'completed')

  if (loading) {
    return (
      <StudentLayout studentName="Adeniyi Victor">
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
          <div className="text-neutral-400">Loading exams...</div>
        </div>
      </StudentLayout>
    )
  }

  return (
    <StudentLayout studentName="Adeniyi Victor">
      <div className="min-h-screen bg-neutral-950">
        <PageHeader 
          title="E-Exam" 
          description="View exam schedules and results"
          icon={Calendar}
        />

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <div className="flex gap-2 border-b border-neutral-800" role="tablist" aria-label="Exam sections">
                <button
                  role="tab"
                  aria-selected={activeTab === 'schedule'}
                  aria-controls="schedule-panel"
                  id="schedule-tab"
                  tabIndex={activeTab === 'schedule' ? 0 : -1}
                  onClick={() => setActiveTab('schedule')}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                      const tabs = ['schedule', 'results']
                      const currentIndex = tabs.indexOf(activeTab)
                      const direction = e.key === 'ArrowRight' ? 1 : -1
                      const newIndex = (currentIndex + direction + tabs.length) % tabs.length
                      setActiveTab(tabs[newIndex] as 'schedule' | 'results')
                    }
                  }}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-neutral-950 ${
                    activeTab === 'schedule' ? 'border-yellow-500 text-yellow-500' : 'border-transparent text-neutral-400 hover:text-white'
                  }`}
                >
                  Exam Schedule
                </button>
                <button
                  role="tab"
                  aria-selected={activeTab === 'results'}
                  aria-controls="results-panel"
                  id="results-tab"
                  tabIndex={activeTab === 'results' ? 0 : -1}
                  onClick={() => setActiveTab('results')}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                      const tabs = ['schedule', 'results']
                      const currentIndex = tabs.indexOf(activeTab)
                      const direction = e.key === 'ArrowRight' ? 1 : -1
                      const newIndex = (currentIndex + direction + tabs.length) % tabs.length
                      setActiveTab(tabs[newIndex] as 'schedule' | 'results')
                    }
                  }}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-neutral-950 ${
                    activeTab === 'results' ? 'border-yellow-500 text-yellow-500' : 'border-transparent text-neutral-400 hover:text-white'
                  }`}
                >
                  My Results
                </button>
              </div>

              {activeTab === 'schedule' && (
                <div 
                  id="schedule-panel" 
                  role="tabpanel" 
                  aria-labelledby="schedule-tab"
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatsCard
                      title="Upcoming"
                      value={upcomingExams.length}
                      icon={Clock}
                    />
                    <StatsCard
                      title="Ongoing"
                      value={exams.filter(e => e.status === 'ongoing').length}
                      icon={Play}
                    />
                    <StatsCard
                      title="Completed"
                      value={completedExams.length}
                      icon={CheckCircle}
                    />
                  </div>

                  {upcomingExams.length === 0 ? (
                    <EmptyState
                      icon={FileQuestion}
                      title="No upcoming exams"
                      description="You don't have any scheduled exams at the moment."
                    />
                  ) : (
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
                                {exam.instructions && (
                                  <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                                    <p className="text-sm text-yellow-400">Instructions: {exam.instructions}</p>
                                  </div>
                                )}
                              </div>
                              <div className="text-right ml-4">
                                <p className="text-sm text-neutral-500">{exam.totalQuestions} questions</p>
                                <button 
                                  className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
                                  aria-label={`Start exam for ${exam.courseCode} - ${exam.courseName}`}
                                >Start Exam</button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'results' && (
                <div 
                  id="results-panel" 
                  role="tabpanel" 
                  aria-labelledby="results-tab"
                  className="space-y-4"
                >
                  {results.length === 0 ? (
                    <EmptyState
                      icon={Inbox}
                      title="No results available"
                      description="Your exam results will appear here once graded."
                    />
                  ) : (
                    results.map((result) => (
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
                    ))
                  )}
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