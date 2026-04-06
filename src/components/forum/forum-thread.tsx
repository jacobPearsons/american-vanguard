'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { MessageSquare, Clock, User, Send, ArrowLeft, Lock, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Post {
  id: number
  content: string
  authorId: string
  authorName: string
  createdAt: string
}

interface Thread {
  id: number
  title: string
  content: string
  authorId: string
  authorName: string
  createdAt: string
  updatedAt: string
  isPinned: boolean
  isLocked: boolean
  courseName: string | null
  posts: Post[]
}

export function ForumThreadView() {
  const params = useParams()
  const router = useRouter()
  const [thread, setThread] = useState<Thread | null>(null)
  const [loading, setLoading] = useState(true)
  const [newReply, setNewReply] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const threadId = params?.id as string
    if (!threadId) return

    fetch(`/api/forum/threads/${threadId}`)
      .then(res => res.json())
      .then(data => {
        setThread(data.thread)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params?.id])

  const handleReply = async () => {
    if (!newReply.trim() || submitting) return

    setSubmitting(true)
    try {
      const res = await fetch(`/api/forum/threads/${thread?.id}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newReply,
          authorId: 'current_user',
          authorName: 'Current User'
        })
      })

      if (res.ok) {
        const data = await res.json()
        setThread(prev => prev ? {
          ...prev,
          posts: [...prev.posts, data.post]
        } : null)
        setNewReply('')
      }
    } catch (error) {
      console.error('Error posting reply:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-600"></div>
      </div>
    )
  }

  if (!thread) {
    return (
      <div className="text-center py-20">
        <p className="text-neutral-400 text-lg">Thread not found</p>
        <Link href="/student/forum" className="text-yellow-500 hover:text-yellow-400 mt-4 inline-block">
          ← Back to Forum
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link 
        href="/student/forum" 
        className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Forum
      </Link>

      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
        <div className="p-6 border-b border-neutral-800">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {thread.isPinned && (
                  <span className="px-2 py-0.5 bg-yellow-900/30 text-yellow-400 text-xs rounded">
                    📌 Pinned
                  </span>
                )}
                {thread.isLocked && (
                  <span className="px-2 py-0.5 bg-neutral-800 text-neutral-400 text-xs rounded flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Locked
                  </span>
                )}
                {thread.courseName && (
                  <span className="px-2 py-0.5 bg-yellow-900/20 text-yellow-400 text-xs rounded">
                    {thread.courseName}
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-white">{thread.title}</h1>
              <div className="flex items-center gap-4 mt-3 text-sm text-neutral-400">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {thread.authorName}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(thread.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 text-neutral-300 leading-relaxed">
            {thread.content}
          </div>
        </div>

        <div className="p-6 border-b border-neutral-800 bg-neutral-950/50">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-yellow-500" />
            {thread.posts.length} {thread.posts.length === 1 ? 'Reply' : 'Replies'}
          </h3>

          {thread.posts.length === 0 ? (
            <p className="text-neutral-400 text-center py-8">
              No replies yet. Be the first to respond!
            </p>
          ) : (
            <div className="space-y-4">
              {thread.posts.map(post => (
                <div key={post.id} className="bg-neutral-800/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white">{post.authorName}</span>
                    <span className="text-xs text-neutral-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-neutral-300">{post.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {!thread.isLocked && (
          <div className="p-6">
            <div className="flex gap-4">
              <textarea
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                placeholder="Write your reply..."
                className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-yellow-500 resize-none"
                rows={3}
              />
            </div>
            <div className="mt-3 flex justify-end">
              <Button 
                onClick={handleReply}
                disabled={!newReply.trim() || submitting}
                className="bg-yellow-600 hover:bg-yellow-700 gap-2"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Posting...' : 'Post Reply'}
              </Button>
            </div>
          </div>
        )}

        {thread.isLocked && (
          <div className="p-6 text-center bg-neutral-950/30">
            <Lock className="w-6 h-6 text-neutral-500 mx-auto mb-2" />
            <p className="text-neutral-400">This thread is locked and no longer accepting replies.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ForumThreadView