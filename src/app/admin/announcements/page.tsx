'use client'

import React, { useState } from 'react'
import { AdminLayout, AdminCard, AdminStats, AdminSearchFilter } from '@/components/admin'
import { Bell, Plus, Edit, Trash2, Pin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Announcement {
  id: number
  title: string
  content: string
  type: 'GENERAL' | 'DEPARTMENT' | 'DEADLINE'
  isPinned: boolean
  isActive: boolean
  department?: { name: string }
  publishedAt: string
  expiresAt: string | null
}

const mockAnnouncements: Announcement[] = [
  { id: 1, title: 'Second Semester Registration Opens', content: 'Course registration for second semester 2025/2026 is now open.', type: 'DEADLINE', isPinned: true, isActive: true, publishedAt: '2026-03-26T10:00:00', expiresAt: '2026-04-15T00:00:00' },
  { id: 2, title: 'Library Hours Extended', content: 'Main library will operate extended hours during examination period.', type: 'GENERAL', isPinned: false, isActive: true, publishedAt: '2026-03-25T14:00:00', expiresAt: null },
  { id: 3, title: 'Engineering Faculty Meeting', content: 'All engineering students must attend the general meeting on Friday.', type: 'DEPARTMENT', isPinned: false, isActive: true, department: { name: 'Engineering' }, publishedAt: '2026-03-24T09:00:00', expiresAt: '2026-03-28T00:00:00' },
]

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'GENERAL' | 'DEPARTMENT' | 'DEADLINE'>('all')

  const filteredAnnouncements = announcements.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || a.type === filterType
    return matchesSearch && matchesType
  })

  const togglePin = (id: number) => {
    setAnnouncements(announcements.map(a => a.id === id ? { ...a, isPinned: !a.isPinned } : a))
  }

  const toggleActive = (id: number) => {
    setAnnouncements(announcements.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a))
  }

  const deleteAnnouncement = (id: number) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      setAnnouncements(announcements.filter(a => a.id !== id))
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'DEADLINE': return 'bg-red-500/20 text-red-400'
      case 'DEPARTMENT': return 'bg-yellow-500/20 text-yellow-400'
      default: return 'bg-neutral-500/20 text-neutral-400'
    }
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'No expiry'
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const stats = [
    { label: 'Total', value: announcements.length },
    { label: 'Active', value: announcements.filter(a => a.isActive).length, color: 'text-green-400' },
    { label: 'Pinned', value: announcements.filter(a => a.isPinned).length, color: 'text-yellow-400' },
  ]

  return (
    <AdminLayout
      title="Announcements Management"
      description="Create and manage student announcements"
      actions={
        <Button className="bg-yellow-600 hover:bg-yellow-700 gap-2">
          <Plus className="w-4 h-4" /> New Announcement
        </Button>
      }
    >
      <AdminStats stats={stats} />
      
      <AdminCard>
        <AdminSearchFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterType={filterType}
          onFilterChange={setFilterType}
          filterOptions={[
            { value: 'all', label: 'All Types' },
            { value: 'GENERAL', label: 'General' },
            { value: 'DEPARTMENT', label: 'Department' },
            { value: 'DEADLINE', label: 'Deadline' },
          ]}
        />
      </AdminCard>

      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <AdminCard>
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-400">No announcements found</h3>
            </div>
          </AdminCard>
        ) : (
          filteredAnnouncements.map((announcement) => (
            <AdminCard key={announcement.id} className={!announcement.isActive ? 'opacity-60' : ''}>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {announcement.isPinned && <Pin className="w-4 h-4 text-yellow-500" />}
                    <h3 className="font-semibold text-white">{announcement.title}</h3>
                  </div>
                  <p className="text-sm text-neutral-400 mb-2">{announcement.content}</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className={`px-2 py-1 rounded-full ${getTypeColor(announcement.type)}`}>
                      {announcement.type}
                    </span>
                    {announcement.department && (
                      <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">
                        {announcement.department.name}
                      </span>
                    )}
                    <span className="text-neutral-500">Expires: {formatDate(announcement.expiresAt)}</span>
                    <span className="text-neutral-500">Published: {formatDate(announcement.publishedAt)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => togglePin(announcement.id)}
                    className={`p-2 rounded ${announcement.isPinned ? 'text-yellow-500' : 'text-neutral-400 hover:text-yellow-500'}`}
                    title={announcement.isPinned ? 'Unpin' : 'Pin'}
                  >
                    <Pin className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleActive(announcement.id)}
                    className={`p-2 rounded ${announcement.isActive ? 'text-green-500' : 'text-neutral-400'}`}
                    title={announcement.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {announcement.isActive ? '✓' : '○'}
                  </button>
                  <button
                    onClick={() => {}}
                    className="p-2 text-neutral-400 hover:text-yellow-600"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteAnnouncement(announcement.id)}
                    className="p-2 text-neutral-400 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </AdminCard>
          ))
        )}
      </div>
    </AdminLayout>
  )
}
