'use client'

import React, { useState, useEffect } from 'react'
import { StudentLayout } from '@/components/features/student-dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bell, CheckCircle, AlertCircle, Info, Trash2, Loader2 } from 'lucide-react'

interface Notification {
  id: number
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'deadline'
  isRead: boolean
  createdAt: string
}

export default function StudentNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [filter])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/student/notifications?filter=${filter}`)
      const data = await res.json()
      if (data.notifications) {
        setNotifications(data.notifications)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: number) => {
    try {
      await fetch(`/api/student/notifications/${id}`, { method: 'PATCH' })
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await fetch('/api/student/notifications', {
        method: 'POST',
        body: JSON.stringify({ action: 'markAllRead' }),
      })
      setNotifications(notifications.map(n => ({ ...n, isRead: true })))
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const deleteNotification = async (id: number) => {
    try {
      await fetch(`/api/student/notifications/${id}`, { method: 'DELETE' })
      setNotifications(notifications.filter(n => n.id !== id))
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
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
      default: return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-l-green-500 bg-green-50'
      case 'warning': return 'border-l-yellow-500 bg-yellow-50'
      case 'deadline': return 'border-l-red-500 bg-red-50'
      default: return 'border-l-blue-50 bg-blue-50'
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
    <StudentLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            <span className="mr-2" aria-hidden="true">🔔</span>
            Notifications
            {unreadCount > 0 && (
              <span className="ml-3 text-sm font-normal text-red-600 bg-red-100 px-3 py-1 rounded-full" aria-label={`${unreadCount} unread notifications`}>
                {unreadCount} unread
              </span>
            )}
          </h1>
          <p className="text-gray-600">Stay updated with latest announcements and alerts</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between" role="group" aria-label="Notification filters">
              <div className="flex gap-2" role="tablist" aria-label="Filter by status">
                <button
                  role="tab"
                  aria-selected={filter === 'all'}
                  aria-controls="notifications-panel"
                  id="all-tab"
                  tabIndex={filter === 'all' ? 0 : -1}
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 ${
                    filter === 'all' ? 'bg-yellow-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  All
                </button>
                <button
                  role="tab"
                  aria-selected={filter === 'unread'}
                  aria-controls="notifications-panel"
                  id="unread-tab"
                  tabIndex={filter === 'unread' ? 0 : -1}
                  onClick={() => setFilter('unread')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 ${
                    filter === 'unread' ? 'bg-yellow-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
              </div>
              <button
                onClick={markAllAsRead}
                className="text-sm text-yellow-600 hover:text-yellow-800 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 rounded px-2 py-1"
                disabled={unreadCount === 0}
                aria-label="Mark all notifications as read"
              >
                Mark all as read
              </button>
            </div>

            {loading ? (
              <div className="bg-white rounded-lg shadow p-12 text-center" role="status" aria-live="polite">
                <Loader2 className="w-8 h-8 text-yellow-600 mx-auto animate-spin" />
                <p className="text-gray-500 mt-2">Loading notifications...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center" role="status">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600">No notifications</h3>
                <p className="text-gray-500">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-3" role="list" aria-label="Notifications list">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    role="listitem"
                    aria-labelledby={`notification-title-${notification.id}`}
                    className={`p-4 rounded-lg border-l-4 bg-white shadow-sm hover:shadow-md transition-shadow ${getTypeColor(notification.type)}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1" aria-hidden="true">{getTypeIcon(notification.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 id={`notification-title-${notification.id}`} className={`font-semibold ${notification.isRead ? 'text-gray-600' : 'text-gray-800'}`}>
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-yellow-500 rounded-full" aria-label="Unread"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-2">{formatDate(notification.createdAt)}</p>
                      </div>
                      <div className="flex gap-2">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 text-gray-400 hover:text-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded"
                            aria-label={`Mark "${notification.title}" as read`}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-2 text-gray-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded"
                          aria-label={`Delete notification "${notification.title}"`}
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
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                    <span className="text-sm text-gray-600">Info</span>
                    <span className="text-sm font-medium text-blue-600">
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
    </StudentLayout>
  )
}
