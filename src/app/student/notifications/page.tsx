'use client'

import React, { useState } from 'react'
import { StudentSidebar, defaultNavItems } from '@/components/features/student-dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bell, CheckCircle, AlertCircle, Info, Trash2, Filter } from 'lucide-react'

interface Notification {
  id: number
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'deadline'
  isRead: boolean
  createdAt: string
}

const mockNotifications: Notification[] = [
  { id: 1, title: 'Course Registration Open', message: 'Second semester course registration is now open. Please register before the deadline.', type: 'info', isRead: false, createdAt: '2026-03-26T10:00:00' },
  { id: 2, title: 'Fee Payment Reminder', message: 'Your second semester fees of ₦195,625 are due by February 15, 2026.', type: 'warning', isRead: false, createdAt: '2026-03-25T14:30:00' },
  { id: 3, title: 'Assignment Submitted', message: 'Your EEE 505 assignment has been successfully submitted.', type: 'success', isRead: true, createdAt: '2026-03-24T09:15:00' },
  { id: 4, title: 'Exam Schedule Released', message: 'Mid-semester examination timetable is now available.', type: 'info', isRead: true, createdAt: '2026-03-23T16:00:00' },
  { id: 5, title: 'Library Book Due', message: 'Please return "Power Systems Analysis" by March 30, 2026.', type: 'deadline', isRead: true, createdAt: '2026-03-22T11:00:00' },
  { id: 6, title: 'Welcome Back', message: 'Welcome to the second semester 2025/2026 session!', type: 'info', isRead: true, createdAt: '2026-01-15T08:00:00' },
]

export default function StudentNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const handleNavigate = (item: { id: string; href?: string }) => {
    if (item.href) window.location.href = item.href
  }

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })))
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead) 
    : notifications

  const unreadCount = notifications.filter(n => !n.isRead).length

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case 'deadline': return <AlertCircle className="w-5 h-5 text-red-500" />
      default: return <Info className="w-5 h-5 text-yellow-500" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-l-green-500 bg-green-50'
      case 'warning': return 'border-l-yellow-500 bg-yellow-50'
      case 'deadline': return 'border-l-red-500 bg-red-50'
      default: return 'border-l-blue-500 bg-yellow-50'
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="fixed left-0 top-0 h-full z-50">
        <StudentSidebar
          items={defaultNavItems}
          logoSrc="../images/newllogo.png"
          studentName="Adeniyi Victor"
          studentImage="../uploads/11015-d14efe5e-7045-42a4-9e53-0b597c3643c0_11zon-3.jpeg"
          activeItem="notifications"
          onNavigate={handleNavigate}
        />
      </div>

      <div className="flex-1 ml-64 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            <span className="mr-2">🔔</span>
            Notifications
            {unreadCount > 0 && (
              <span className="ml-3 text-sm font-normal text-red-600 bg-red-100 px-3 py-1 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </h1>
          <p className="text-gray-600">Stay updated with latest announcements and alerts</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'all' ? 'bg-yellow-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'unread' ? 'bg-yellow-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
              </div>
              <button
                onClick={markAllAsRead}
                className="text-sm text-yellow-600 hover:text-yellow-800"
              >
                Mark all as read
              </button>
            </div>

            {filteredNotifications.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600">No notifications</h3>
                <p className="text-gray-500">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border-l-4 bg-white shadow-sm hover:shadow-md transition-shadow ${getTypeColor(notification.type)}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1">{getTypeIcon(notification.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-semibold ${notification.isRead ? 'text-gray-600' : 'text-gray-800'}`}>
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-2">{formatDate(notification.createdAt)}</p>
                      </div>
                      <div className="flex gap-2">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 text-gray-400 hover:text-yellow-600"
                            title="Mark as read"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-2 text-gray-400 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total</span>
                    <span className="text-sm font-medium text-gray-800">{notifications.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Unread</span>
                    <span className="text-sm font-medium text-yellow-600">{unreadCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Read</span>
                    <span className="text-sm font-medium text-gray-800">{notifications.length - unreadCount}</span>
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
                  <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                    <span className="text-sm text-gray-600">Info</span>
                    <span className="text-sm font-medium text-yellow-600">
                      {notifications.filter(n => n.type === 'info').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm text-gray-600">Success</span>
                    <span className="text-sm font-medium text-green-600">
                      {notifications.filter(n => n.type === 'success').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                    <span className="text-sm text-gray-600">Warning</span>
                    <span className="text-sm font-medium text-yellow-600">
                      {notifications.filter(n => n.type === 'warning').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                    <span className="text-sm text-gray-600">Deadline</span>
                    <span className="text-sm font-medium text-red-600">
                      {notifications.filter(n => n.type === 'deadline').length}
                    </span>
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