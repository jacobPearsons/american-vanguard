'use client'

import React, { useState, useEffect } from 'react'
import { StudentLayout } from '@/components/features/student-dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader, StatsCard, FilterBar, EmptyState } from '@/components/ui'
import { Clock, MapPin, BookOpen, User, Calendar } from 'lucide-react'

interface TimetableEntry {
  id: string
  courseCode: string
  courseName: string
  day: string
  startTime: string
  endTime: string
  venue: string
  instructor: string
  semester?: string
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function StudentTimetablePage() {
  const [selectedDay, setSelectedDay] = useState('all')
  const [timetable, setTimetable] = useState<TimetableEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/timetable')
      .then(res => res.json())
      .then(data => {
        setTimetable(data.timetable || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filteredTimetable = selectedDay === 'all' 
    ? timetable 
    : timetable.filter(t => t.day.toLowerCase() === selectedDay.toLowerCase())

  const getDayColor = (day: string): string => {
    const colors: Record<string, string> = {
      Monday: 'border-yellow-500 bg-yellow-900/20',
      Tuesday: 'border-green-500 bg-green-900/20',
      Wednesday: 'border-orange-500 bg-orange-900/20',
      Thursday: 'border-purple-500 bg-purple-900/20',
      Friday: 'border-blue-500 bg-blue-900/20',
      Saturday: 'border-neutral-500 bg-neutral-800/50',
    }
    return colors[day] || 'border-neutral-500 bg-neutral-800/50'
  }

  const totalClasses = timetable.length
  const daysWithClasses = Array.from(new Set(timetable.map(t => t.day))).length

  return (
    <StudentLayout>
      <div className="p-6 min-h-screen bg-neutral-950">
        <PageHeader 
          title="Lecture Timetable"
          description="View your weekly class schedule"
          icon={Calendar}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <FilterBar
              filters={[
                { 
                  name: 'Day', 
                  options: [{ value: 'all', label: 'All Days' }, ...days.map(d => ({ value: d, label: d }))], 
                  value: selectedDay, 
                  onChange: setSelectedDay 
                }
              ]}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatsCard
                title="Total Classes"
                value={totalClasses}
                icon={BookOpen}
              />
              <StatsCard
                title="Days with Classes"
                value={daysWithClasses}
                icon={Calendar}
              />
            </div>

            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <CardTitle className="text-white">
                  {selectedDay === 'all' ? 'Full Weekly Schedule' : `${selectedDay} Schedule`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-neutral-400">Loading...</div>
                ) : filteredTimetable.length === 0 ? (
                  <EmptyState
                    icon={Calendar}
                    title="No classes scheduled"
                    description="You don't have any classes scheduled for this day."
                  />
                ) : (
                  <div className="space-y-4">
                    {filteredTimetable.map((entry) => (
                      <div 
                        key={entry.id}
                        className={`p-4 rounded-lg border-l-4 ${getDayColor(entry.day)}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="px-2 py-1 bg-neutral-800 rounded text-sm font-bold text-yellow-500">
                                {entry.courseCode}
                              </span>
                              <span className="text-sm text-neutral-400">{entry.day}</span>
                            </div>
                            <h3 className="font-semibold text-white mb-2">{entry.courseName}</h3>
                            <div className="flex flex-wrap gap-4 text-sm text-neutral-400">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{entry.startTime} - {entry.endTime}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{entry.venue}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                <span>{entry.instructor}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-neutral-500">Course</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <CardTitle className="text-lg text-white">Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-400">Total Classes</span>
                    <span className="text-sm font-medium text-white">{totalClasses}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-400">Days with Classes</span>
                    <span className="text-sm font-medium text-white">{daysWithClasses}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <CardTitle className="text-lg text-white">By Day</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {days.map((day) => {
                    const count = timetable.filter(t => t.day === day).length
                    return (
                      <div key={day} className="flex justify-between items-center p-2 bg-neutral-800 rounded">
                        <span className="text-sm text-neutral-400">{day}</span>
                        <span className={`text-sm font-medium ${count > 0 ? 'text-yellow-500' : 'text-neutral-600'}`}>
                          {count} class{count !== 1 ? 'es' : ''}
                        </span>
                    </div>
                  )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <CardTitle className="text-lg text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800 rounded">
                  📥 Download PDF
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800 rounded">
                  📧 Share via Email
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800 rounded">
                  🖨️ Print Schedule
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </StudentLayout>
  )
}