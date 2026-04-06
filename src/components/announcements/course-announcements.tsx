'use client'

import { useState, useEffect } from 'react'
import { Bell, Pin, Clock, AlertCircle } from 'lucide-react'

interface Announcement {
  id: number
  title: string
  content: string
  publishedAt: string
  isPinned: boolean
  type: string
}

interface CourseAnnouncementsProps {
  courseId: number
}

export function CourseAnnouncements({ courseId }: CourseAnnouncementsProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/announcements?courseId=${courseId}`)
      .then(res => res.json())
      .then(data => {
        setAnnouncements(data.announcements || [])
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [courseId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-yellow-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-neutral-400">
        <AlertCircle className="w-8 h-8 mx-auto mb-2" />
        <p>Unable to load announcements</p>
      </div>
    )
  }

  const pinned = announcements.filter(a => a.isPinned)
  const regular = announcements.filter(a => !a.isPinned)

  return (
    <div className="space-y-4">
      {pinned.map(a => (
        <AnnouncementCard key={a.id} announcement={a} isPinned />
      ))}
      {regular.map(a => (
        <AnnouncementCard key={a.id} announcement={a} />
      ))}
      {announcements.length === 0 && (
        <div className="text-center py-12 bg-neutral-900/50 rounded-xl border border-neutral-800">
          <Bell className="w-10 h-10 text-neutral-500 mx-auto mb-3" />
          <p className="text-neutral-400">No announcements for this course</p>
        </div>
      )}
    </div>
  )
}

function AnnouncementCard({ announcement, isPinned = false }: { announcement: Announcement; isPinned?: boolean }) {
  return (
    <div className={`p-5 rounded-xl border transition-colors ${
      isPinned 
        ? 'bg-yellow-900/20 border-yellow-600/50' 
        : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {isPinned && <Pin className="w-4 h-4 text-yellow-500" />}
          <Bell className="w-4 h-4 text-yellow-600" />
          <h3 className="font-semibold text-white">{announcement.title}</h3>
        </div>
        <span className="text-xs px-2 py-1 bg-neutral-800 text-neutral-400 rounded">
          {announcement.type}
        </span>
      </div>
      <p className="text-neutral-400 text-sm leading-relaxed mb-3">{announcement.content}</p>
      <div className="flex items-center gap-1 text-xs text-neutral-500">
        <Clock className="w-3 h-3" />
        {new Date(announcement.publishedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}
      </div>
    </div>
  )
}

export default CourseAnnouncements