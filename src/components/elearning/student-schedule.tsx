'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, MapPin, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react'

interface ScheduleItem {
  id: number
  courseCode: string
  courseName: string
  day: string
  startTime: string
  endTime: string
  venue: string
  instructor: string
}

interface StudentScheduleProps {
  studentId?: string
  semester?: string
  academicYear?: string
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function StudentSchedule({ studentId, semester = 'Fall 2025', academicYear = '2025/2026' }: StudentScheduleProps) {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currentWeek, setCurrentWeek] = useState(1)
  const [view, setView] = useState<'week' | 'list'>('week')

  useEffect(() => {
    const params = new URLSearchParams()
    if (studentId) params.set('studentId', studentId)
    params.set('semester', semester)
    params.set('academicYear', academicYear)

    fetch(`/api/courses/schedule?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setSchedule(data.schedule || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [studentId, semester, academicYear])

  const mockSchedule: ScheduleItem[] = [
    { id: 1, courseCode: 'EEE 501', courseName: 'Advanced Power Systems', day: 'Monday', startTime: '09:00', endTime: '11:00', venue: 'LT 1', instructor: 'Dr. Adeyemi' },
    { id: 2, courseCode: 'EEE 503', courseName: 'Digital Signal Processing', day: 'Tuesday', startTime: '11:00', endTime: '13:00', venue: 'LT 2', instructor: 'Prof. Okonkwo' },
    { id: 3, courseCode: 'EEE 505', courseName: 'Control Systems II', day: 'Wednesday', startTime: '14:00', endTime: '16:00', venue: 'LT 1', instructor: 'Dr. Ibrahim' },
    { id: 4, courseCode: 'CSC 401', courseName: 'Data Structures', day: 'Thursday', startTime: '10:00', endTime: '12:00', venue: 'Lab 1', instructor: 'Dr. Okafor' },
    { id: 5, courseCode: 'MAE 301', courseName: 'Thermodynamics', day: 'Friday', startTime: '13:00', endTime: '15:00', venue: 'LT 3', instructor: 'Prof. Adebayo' },
  ]

  const displaySchedule = schedule.length > 0 ? schedule : mockSchedule

  const getScheduleForDay = (day: string) => {
    return displaySchedule.filter(item => item.day === day)
  }

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00'
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-yellow-500" />
            Class Schedule
          </h3>
          <span className="text-neutral-400">{semester} {academicYear}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('week')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              view === 'week' ? 'bg-yellow-600 text-white' : 'bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            Week View
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              view === 'list' ? 'bg-yellow-600 text-white' : 'bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            List View
          </button>
        </div>
      </div>

      {view === 'week' && (
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
          <div className="grid grid-cols-7 border-b border-neutral-800">
            {days.map(day => (
              <div key={day} className="p-3 text-center bg-neutral-800/50">
                <span className="text-sm font-medium text-white">{day.slice(0, 3)}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 min-h-[400px]">
            {days.map(day => (
              <div key={day} className="border-r border-neutral-800 last:border-r-0 p-2 space-y-2">
                {getScheduleForDay(day).map(item => (
                  <div 
                    key={item.id}
                    className="p-2 bg-yellow-600/20 border border-yellow-600/30 rounded-lg hover:bg-yellow-600/30 cursor-pointer transition-colors"
                  >
                    <p className="text-xs font-semibold text-yellow-400">{item.courseCode}</p>
                    <p className="text-xs text-white truncate">{item.courseName}</p>
                    <p className="text-xs text-neutral-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.startTime}-{item.endTime}
                    </p>
                    <p className="text-xs text-neutral-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {item.venue}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'list' && (
        <div className="space-y-3">
          {displaySchedule.sort((a, b) => {
            const dayA = days.indexOf(a.day)
            const dayB = days.indexOf(b.day)
            if (dayA !== dayB) return dayA - dayB
            return a.startTime.localeCompare(b.startTime)
          }).map(item => (
            <div 
              key={item.id}
              className="bg-neutral-900 rounded-xl p-4 border border-neutral-800 hover:border-yellow-500/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{item.courseCode} - {item.courseName}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-neutral-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {item.day}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {item.startTime} - {item.endTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {item.venue}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-neutral-400">Instructor</p>
                  <p className="text-white font-medium">{item.instructor}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default StudentSchedule