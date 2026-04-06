'use client'

import { StudentLayout } from '@/components/features/student-dashboard'
import { ForumThreadView } from '@/components/forum/forum-thread'

export default function ForumThreadPage() {
  return (
    <StudentLayout studentName="Student">
      <div className="min-h-screen bg-neutral-950">
        <ForumThreadView />
      </div>
    </StudentLayout>
  )
}