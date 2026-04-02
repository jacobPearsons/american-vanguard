/**
 * Dashboard Tabs Component
 * 
 * Displays tabs for different dashboard sections (Registration, Election, Timetable, Notifications)
 * Following component design rules from docs/component-design-rules.md
 */

import React, { useState } from 'react'
import type { DashboardTab } from '@/types/studentDashboard'

interface DashboardTabsProps {
  tabs: DashboardTab[]
  defaultTab?: string
}

export const DashboardTabs: React.FC<DashboardTabsProps> = ({ tabs, defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  const activeContent = tabs.find((tab) => tab.id === activeTab)?.content

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-yellow-600 bg-yellow-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeContent}
      </div>
    </div>
  )
}

// Default tab content components for quick usage

interface EmptyStateProps {
  message: string
  actionLabel?: string
  onAction?: () => void
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, actionLabel, onAction }) => (
  <div className="text-center py-8">
    <p className="text-gray-500 mb-4">{message}</p>
    {actionLabel && onAction && (
      <button
        onClick={onAction}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        {actionLabel}
      </button>
    )}
  </div>
)

interface CourseTableProps {
  courses: Array<{ code: string; name: string; unit: number }>
}

export const CourseRegistrationTab: React.FC<CourseTableProps> = ({ courses }) => {
  if (courses.length === 0) {
    return (
      <EmptyState
        message="No registered courses yet. Add new course to get started."
        actionLabel="Add New Course"
        onAction={() => window.location.href = '#course/course_reg'}
      />
    )
  }

  return (
    <div>
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Course Code</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Course Name</th>
            <th className="px-4 py-2 text-right font-medium text-gray-600">Unit</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2 text-gray-800">{course.code}</td>
              <td className="px-4 py-2 text-gray-800">{course.name}</td>
              <td className="px-4 py-2 text-right text-gray-800">{course.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

interface PollItemProps {
  title: string
  description: string
  isActive: boolean
}

export const ElectionTab: React.FC<{ polls: PollItemProps[] }> = ({ polls }) => {
  if (polls.length === 0) {
    return <EmptyState message="No active polls at the moment." />
  }

  return (
    <div className="space-y-4">
      {polls.map((poll, index) => (
        <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium text-gray-800">{poll.title}</h4>
              <p className="text-sm text-gray-500 mt-1">{poll.description}</p>
            </div>
            <span className={`px-2 py-1 text-xs rounded ${poll.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {poll.isActive ? 'Active' : 'Closed'}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

interface TimetableEntryProps {
  courseCode: string
  courseName: string
  day: string
  time: string
  venue: string
}

export const TimetableTab: React.FC<{ entries: TimetableEntryProps[] }> = ({ entries }) => {
  if (entries.length === 0) {
    return <EmptyState message="No timetable entries found." />
  }

  return (
    <div>
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Course</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Day</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Time</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Venue</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">
                <div className="font-medium text-gray-800">{entry.courseCode}</div>
                <div className="text-xs text-gray-500">{entry.courseName}</div>
              </td>
              <td className="px-4 py-2 text-gray-800">{entry.day}</td>
              <td className="px-4 py-2 text-gray-800">{entry.time}</td>
              <td className="px-4 py-2 text-gray-800">{entry.venue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

interface NotificationItemProps {
  title: string
  message: string
  timestamp: Date
  read: boolean
}

export const NotificationsTab: React.FC<{ notifications: NotificationItemProps[] }> = ({ notifications }) => {
  if (notifications.length === 0) {
    return <EmptyState message="No notifications at the moment." />
  }

  return (
    <div className="space-y-2">
      {notifications.map((notification, index) => (
        <div
          key={index}
          className={`p-3 rounded-lg border ${notification.read ? 'bg-gray-50' : 'bg-yellow-50 border-blue-200'}`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h5 className="font-medium text-gray-800">{notification.title}</h5>
              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
            </div>
            {!notification.read && (
              <span className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0 mt-2" />
            )}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {notification.timestamp.toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  )
}

export default DashboardTabs
