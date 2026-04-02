'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bell, Plus, Edit, Trash2, Pin, Search, Filter } from 'lucide-react'

interface Announcement {
  id: number
  title: string
  content: string
  type: 'GENERAL' | 'DEPARTMENT' | 'DEADLINE'
  isPinned: boolean
  isActive: boolean
  departmentId: number | null
  department?: { name: string }
  publishedAt: string
  expiresAt: string | null
}

const mockAnnouncements: Announcement[] = [
  { id: 1, title: 'Second Semester Registration Opens', content: 'Course registration for second semester 2025/2026 is now open.', type: 'DEADLINE', isPinned: true, isActive: true, departmentId: null, publishedAt: '2026-03-26T10:00:00', expiresAt: '2026-04-15T00:00:00' },
  { id: 2, title: 'Library Hours Extended', content: 'Main library will operate extended hours during examination period.', type: 'GENERAL', isPinned: false, isActive: true, departmentId: null, publishedAt: '2026-03-25T14:00:00', expiresAt: null },
  { id: 3, title: 'Engineering Faculty Meeting', content: 'All engineering students must attend the general meeting on Friday.', type: 'DEPARTMENT', isPinned: false, isActive: true, departmentId: 1, department: { name: 'Engineering' }, publishedAt: '2026-03-24T09:00:00', expiresAt: '2026-03-28T00:00:00' },
]

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'GENERAL' | 'DEPARTMENT' | 'DEADLINE'>('all')
  const [showModal, setShowModal] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)

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
      case 'DEADLINE': return 'bg-red-100 text-red-800'
      case 'DEPARTMENT': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'No expiry'
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              <span className="mr-2">📢</span>
              Announcements Management
            </h1>
            <p className="text-gray-600">Create and manage student announcements</p>
          </div>
          <button
            onClick={() => { setEditingAnnouncement(null); setShowModal(true) }}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            <Plus className="w-4 h-4" />
            New Announcement
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search announcements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="GENERAL">General</option>
                <option value="DEPARTMENT">Department</option>
                <option value="DEADLINE">Deadline</option>
              </select>
            </div>

            {filteredAnnouncements.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600">No announcements found</h3>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAnnouncements.map((announcement) => (
                  <Card key={announcement.id} className={!announcement.isActive ? 'opacity-60' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {announcement.isPinned && <Pin className="w-4 h-4 text-yellow-500" />}
                            <h3 className="font-semibold text-gray-800">{announcement.title}</h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{announcement.content}</p>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                            <span className={`px-2 py-1 rounded-full ${getTypeColor(announcement.type)}`}>
                              {announcement.type}
                            </span>
                            {announcement.department && (
                              <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                                {announcement.department.name}
                              </span>
                            )}
                            <span>Expires: {formatDate(announcement.expiresAt)}</span>
                            <span>Published: {formatDate(announcement.publishedAt)}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => togglePin(announcement.id)}
                            className={`p-2 rounded ${announcement.isPinned ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                            title={announcement.isPinned ? 'Unpin' : 'Pin'}
                          >
                            <Pin className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleActive(announcement.id)}
                            className={`p-2 rounded ${announcement.isActive ? 'text-green-600' : 'text-gray-400'}`}
                            title={announcement.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {announcement.isActive ? '✓' : '○'}
                          </button>
                          <button
                            onClick={() => { setEditingAnnouncement(announcement); setShowModal(true) }}
                            className="p-2 text-gray-400 hover:text-yellow-600"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteAnnouncement(announcement.id)}
                            className="p-2 text-gray-400 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total</span>
                    <span className="text-sm font-medium text-gray-800">{announcements.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active</span>
                    <span className="text-sm font-medium text-green-600">{announcements.filter(a => a.isActive).length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Pinned</span>
                    <span className="text-sm font-medium text-yellow-600">{announcements.filter(a => a.isPinned).length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">By Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">General</span>
                    <span className="text-sm font-medium">{announcements.filter(a => a.type === 'GENERAL').length}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">Department</span>
                    <span className="text-sm font-medium">{announcements.filter(a => a.type === 'DEPARTMENT').length}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">Deadline</span>
                    <span className="text-sm font-medium">{announcements.filter(a => a.type === 'DEADLINE').length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}