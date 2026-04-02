/**
 * Announcements Preview Widget
 * 
 * Shows recent announcements with preview and link to view all
 */

import React from 'react'
import Link from 'next/link'
import { Bell, ChevronRight, Pin } from 'lucide-react'

interface Announcement {
  id: number
  title: string
  content: string
  type: 'GENERAL' | 'DEPARTMENT' | 'DEADLINE'
  isPinned: boolean
  publishedAt: string
}

interface AnnouncementsPreviewProps {
  announcements?: Announcement[]
  maxItems?: number
}

const defaultAnnouncements: Announcement[] = [
  {
    id: 1,
    title: 'Second Semester Registration Opens',
    content: 'Course registration for the second semester 2025/2026 session is now open. Please log in to register your courses before the deadline.',
    type: 'DEADLINE',
    isPinned: true,
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    title: 'Library Hours Update',
    content: 'The main library will operate extended hours during the examination period.',
    type: 'GENERAL',
    isPinned: false,
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    title: 'Engineering Faculty Meeting',
    content: 'All engineering students are required to attend the general meeting on Friday.',
    type: 'DEPARTMENT',
    isPinned: false,
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

const getTypeColor = (type: string): string => {
  switch (type) {
    case 'DEADLINE': return 'bg-red-100 text-red-800'
    case 'DEPARTMENT': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff < 7) return `${diff} days ago`
  return date.toLocaleDateString()
}

export const AnnouncementsPreview: React.FC<AnnouncementsPreviewProps> = ({ 
  announcements = defaultAnnouncements,
  maxItems = 4
}) => {
  const displayedAnnouncements = announcements.slice(0, maxItems)

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">Recent Announcements</h3>
        </div>
        <Link 
          href="/student/announcements" 
          className="text-sm text-yellow-600 hover:text-yellow-800 flex items-center gap-1"
        >
          View All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      
      <div className="space-y-3">
        {displayedAnnouncements.map((announcement) => (
          <div 
            key={announcement.id}
            className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="flex items-start gap-2">
              {announcement.isPinned && (
                <Pin className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-1" />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-800 text-sm line-clamp-1">
                  {announcement.title}
                </h4>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {announcement.content}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-0.5 text-xs rounded-full ${getTypeColor(announcement.type)}`}>
                    {announcement.type}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatDate(announcement.publishedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {displayedAnnouncements.length === 0 && (
        <p className="text-center text-gray-500 py-4">No announcements</p>
      )}
    </div>
  )
}

export default AnnouncementsPreview