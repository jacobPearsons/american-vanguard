'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MessageSquare, Pin, Lock, Clock, Plus } from 'lucide-react'

interface Thread {
  id: number
  title: string
  authorName: string
  createdAt: string
  isPinned: boolean
  isLocked: boolean
  postCount: number
  courseName?: string | null
}

interface ForumListProps {
  showCourseFilter?: boolean
  courseId?: number
}

export function ForumList({ showCourseFilter = false, courseId }: ForumListProps) {
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams()
    if (courseId) params.set('courseId', courseId.toString())
    
    fetch(`/api/forum/threads?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setThreads(data.threads || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [courseId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {threads.length === 0 ? (
        <div className="text-center py-16 bg-neutral-900/50 rounded-2xl border border-neutral-800">
          <MessageSquare className="w-12 h-12 text-neutral-500 mx-auto mb-4" />
          <p className="text-neutral-400 text-lg">No discussions yet</p>
          <p className="text-neutral-500 text-sm mt-2">Start a new thread to begin the conversation!</p>
        </div>
      ) : (
        threads.map(thread => (
          <Link key={thread.id} href={`/student/forum/${thread.id}`}>
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 hover:border-yellow-500/50 hover:bg-neutral-800/50 transition-all group cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-neutral-800 rounded-lg group-hover:bg-yellow-600/20">
                  <MessageSquare className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {thread.isPinned && <Pin className="w-4 h-4 text-yellow-500 flex-shrink-0" />}
                    {thread.isLocked && <Lock className="w-4 h-4 text-neutral-500 flex-shrink-0" />}
                    <h3 className="text-white font-semibold truncate group-hover:text-yellow-400 transition-colors">
                      {thread.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-neutral-400">
                    <span className="flex items-center gap-1">
                      <span className="text-neutral-500">by</span> {thread.authorName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(thread.createdAt).toLocaleDateString()}
                    </span>
                    {thread.courseName && (
                      <span className="text-yellow-600 bg-yellow-900/20 px-2 py-0.5 rounded text-xs">
                        {thread.courseName}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-center flex-shrink-0 bg-neutral-800/50 px-4 py-2 rounded-lg">
                  <p className="text-xl font-bold text-white">{thread.postCount}</p>
                  <p className="text-xs text-neutral-500">replies</p>
                </div>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  )
}

export function NewThreadButton() {
  return (
    <button className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
      <Plus className="w-4 h-4" />
      New Thread
    </button>
  )
}

export default ForumList