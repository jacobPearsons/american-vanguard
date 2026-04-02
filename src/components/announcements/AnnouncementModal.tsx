'use client'

import React, { useState, useEffect } from 'react'

interface Announcement {
  id: number
  title: string
  content: string
  type: 'GENERAL' | 'DEPARTMENT' | 'DEADLINE'
  isPinned: boolean
  publishedAt: string
  department?: { name: string } | null
}

interface AnnouncementModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AnnouncementModal: React.FC<AnnouncementModalProps> = ({ isOpen, onClose }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      setLoading(true)
      fetch('/api/announcements')
        .then(res => res.json())
        .then(data => setAnnouncements(data.announcements || []))
        .finally(() => setLoading(false))
    }
  }, [isOpen])

  if (!isOpen) return null

  const filtered = filter === 'all' 
    ? announcements 
    : announcements.filter(a => a.type === filter)

  const typeColors: Record<string, string> = {
    GENERAL: 'bg-yellow-100 text-yellow-800',
    DEPARTMENT: 'bg-green-100 text-green-800',
    DEADLINE: 'bg-red-100 text-red-800'
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Announcements</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>

        <div className="p-4 border-b flex gap-2">
          {['all', 'GENERAL', 'DEPARTMENT', 'DEADLINE'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-sm ${filter === f ? 'bg-yellow-600 text-white' : 'bg-gray-100'}`}
            >
              {f === 'all' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <div className="p-4 overflow-y-auto max-h-[50vh]">
          {loading ? (
            <p className="text-center py-8">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No announcements</p>
          ) : (
            <div className="space-y-4">
              {filtered.map(ann => (
                <div key={ann.id} className={`p-4 rounded-lg ${ann.isPinned ? 'border-l-4 border-yellow-500 bg-yellow-50' : 'bg-gray-50'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{ann.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${typeColors[ann.type]}`}>
                      {ann.type}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{ann.content}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(ann.publishedAt).toLocaleDateString()}
                    {ann.department && ` • ${ann.department.name}`}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
