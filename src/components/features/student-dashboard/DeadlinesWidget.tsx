/**
 * Deadlines Widget
 * 
 * Shows upcoming deadlines for registration, fees, exams, etc.
 */

import React from 'react'
import { Calendar, Clock, AlertCircle } from 'lucide-react'

interface Deadline {
  id: string
  title: string
  date: Date
  type: 'registration' | 'fee' | 'exam' | 'other'
  isUrgent: boolean
}

interface DeadlinesWidgetProps {
  deadlines?: Deadline[]
}

const defaultDeadlines: Deadline[] = [
  { id: '1', title: 'Course Registration Deadline', date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), type: 'registration', isUrgent: true },
  { id: '2', title: 'Second Semester Fees', date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), type: 'fee', isUrgent: false },
  { id: '3', title: 'Mid-Semester Exams', date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), type: 'exam', isUrgent: false },
  { id: '4', title: 'Assignment Submission', date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), type: 'other', isUrgent: false },
]

const getDaysUntil = (date: Date): number => {
  const now = new Date()
  const diff = date.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

const getTypeColor = (type: string): string => {
  switch (type) {
    case 'registration': return 'bg-yellow-100 text-yellow-800'
    case 'fee': return 'bg-red-100 text-red-800'
    case 'exam': return 'bg-orange-100 text-orange-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getTypeIcon = (type: string): string => {
  switch (type) {
    case 'registration': return '📱'
    case 'fee': return '💰'
    case 'exam': return '📝'
    default: return '📅'
  }
}

export const DeadlinesWidget: React.FC<DeadlinesWidgetProps> = ({ deadlines = defaultDeadlines }) => {
  const sortedDeadlines = [...deadlines].sort((a, b) => a.date.getTime() - b.date.getTime())

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-800">Upcoming Deadlines</h3>
      </div>
      
      <div className="space-y-3">
        {sortedDeadlines.slice(0, 5).map((deadline) => {
          const daysUntil = getDaysUntil(deadline.date)
          
          return (
            <div
              key={deadline.id}
              className={`flex items-center gap-3 p-3 rounded-lg border-l-4 ${
                deadline.isUrgent || daysUntil <= 3 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <span className="text-xl">{getTypeIcon(deadline.type)}</span>
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm ${deadline.isUrgent || daysUntil <= 3 ? 'text-red-800' : 'text-gray-800'}`}>
                  {deadline.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 text-xs rounded-full ${getTypeColor(deadline.type)}`}>
                    {deadline.type.charAt(0).toUpperCase() + deadline.type.slice(1)}
                  </span>
                  <span className={`text-xs ${daysUntil <= 3 ? 'text-red-600' : 'text-gray-500'}`}>
                    {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days left`}
                  </span>
                </div>
              </div>
              {(deadline.isUrgent || daysUntil <= 3) && (
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              )}
            </div>
          )
        })}
      </div>

      {sortedDeadlines.length > 5 && (
        <button className="w-full mt-4 text-sm text-yellow-600 hover:text-yellow-800">
          View all deadlines →
        </button>
      )}
    </div>
  )
}

export default DeadlinesWidget