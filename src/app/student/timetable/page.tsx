'use client'

import React, { useState } from 'react'
import { StudentSidebar, defaultNavItems } from '@/components/features/student-dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, MapPin, BookOpen, User } from 'lucide-react'

interface TimetableEntry {
  id: number
  courseCode: string
  courseName: string
  day: string
  startTime: string
  endTime: string
  venue: string
  instructor: string
}

const mockTimetable: TimetableEntry[] = [
  { id: 1, courseCode: 'EEE 501', courseName: 'Advanced Power Systems', day: 'Monday', startTime: '09:00', endTime: '11:00', venue: 'LT 1', instructor: 'Dr. Adeyemi' },
  { id: 2, courseCode: 'EEE 503', courseName: 'Digital Signal Processing', day: 'Tuesday', startTime: '11:00', endTime: '13:00', venue: 'LT 2', instructor: 'Prof. Okonkwo' },
  { id: 3, courseCode: 'EEE 505', courseName: 'Control Systems II', day: 'Wednesday', startTime: '14:00', endTime: '16:00', venue: 'LT 1', instructor: 'Dr. Ibrahim' },
  { id: 4, courseCode: 'EEE 507', courseName: 'Microelectronics', day: 'Thursday', startTime: '09:00', endTime: '11:00', venue: 'Lab 3', instructor: 'Dr. Okafor' },
  { id: 5, courseCode: 'EEE 509', courseName: 'Research Methodology', day: 'Friday', startTime: '10:00', endTime: '12:00', venue: 'LT 4', instructor: 'Prof. Adebayo' },
]

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function StudentTimetablePage() {
  const [selectedDay, setSelectedDay] = useState('all')

  const handleNavigate = (item: { id: string; href?: string }) => {
    if (item.href) window.location.href = item.href
  }

  const filteredTimetable = selectedDay === 'all' 
    ? mockTimetable 
    : mockTimetable.filter(t => t.day.toLowerCase() === selectedDay.toLowerCase())

  const getDayColor = (day: string): string => {
    const colors: Record<string, string> = {
      Monday: 'bg-yellow-100 border-blue-300',
      Tuesday: 'bg-green-100 border-green-300',
      Wednesday: 'bg-yellow-100 border-yellow-300',
      Thursday: 'bg-purple-100 border-purple-300',
      Friday: 'bg-orange-100 border-orange-300',
      Saturday: 'bg-gray-100 border-gray-300',
    }
    return colors[day] || 'bg-gray-100 border-gray-300'
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="fixed left-0 top-0 h-full z-50">
        <StudentSidebar
          items={defaultNavItems}
          logoSrc="../images/newllogo.png"
          studentName="Adeniyi Victor"
          studentImage="../uploads/11015-d14efe5e-7045-42a4-9e53-0b597c3643c0_11zon-3.jpeg"
          activeItem="timetable"
          onNavigate={handleNavigate}
        />
      </div>

      <div className="flex-1 ml-64 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            <span className="mr-2">📅</span>
            Lecture Timetable
          </h1>
          <p className="text-gray-600">View your weekly class schedule</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedDay('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedDay === 'all' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                All Days
              </button>
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedDay === day 
                      ? 'bg-yellow-600 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedDay === 'all' ? 'Full Weekly Schedule' : `${selectedDay} Schedule`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredTimetable.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No classes scheduled for this day
                  </div>
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
                              <span className="px-2 py-1 bg-white rounded text-sm font-bold text-gray-800">
                                {entry.courseCode}
                              </span>
                              <span className="text-sm text-gray-500">{entry.day}</span>
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-2">{entry.courseName}</h3>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
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
                            <span className="text-xs text-gray-500">Course</span>
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
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Classes</span>
                    <span className="text-sm font-medium text-gray-800">{mockTimetable.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Days with Classes</span>
                    <span className="text-sm font-medium text-gray-800">
                      {Array.from(new Set(mockTimetable.map(t => t.day))).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">By Day</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {days.map((day) => {
                    const count = mockTimetable.filter(t => t.day === day).length
                    return (
                      <div key={day} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-600">{day}</span>
                        <span className={`text-sm font-medium ${count > 0 ? 'text-yellow-600' : 'text-gray-400'}`}>
                          {count} class{count !== 1 ? 'es' : ''}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  📥 Download PDF
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  📧 Share via Email
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  🖨️ Print Schedule
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}