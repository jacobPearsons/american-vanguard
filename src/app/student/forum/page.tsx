'use client'

import React, { useState } from 'react'
import { StudentLayout } from '@/components/features/student-dashboard'
import { ForumList, NewThreadButton } from '@/components/forum/forum-list'
import { MessageSquare, BookOpen } from 'lucide-react'

export default function ForumPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all')

  return (
    <StudentLayout studentName="Student">
      <div className="min-h-screen bg-neutral-950">
        <div className="bg-neutral-900 border-b border-neutral-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-yellow-500" />
                Discussion Forum
              </h1>
              <p className="text-neutral-400 mt-1">Connect with fellow students and discuss course topics</p>
            </div>
            <NewThreadButton />
          </div>
        </div>

        <div className="p-6">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4 inline mr-2" />
              All Discussions
            </button>
            <button
              onClick={() => setActiveTab('my')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'my'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4 inline mr-2" />
              My Courses
            </button>
          </div>

          <ForumList />
        </div>
      </div>
    </StudentLayout>
  )
}