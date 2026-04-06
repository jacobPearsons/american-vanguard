import { StudentLayout } from '@/components/features/student-dashboard'
import { MaterialManager } from '@/components/elearning/material-manager'
import { useParams } from 'next/navigation'

export default function CourseMaterialsPage() {
  const params = useParams()
  const courseId = parseInt(params?.id as string)

  return (
    <StudentLayout studentName="Student">
      <div className="min-h-screen bg-neutral-950 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Course Materials</h1>
          <p className="text-neutral-400">Access all course resources and documents</p>
        </div>
        <MaterialManager courseId={courseId} courseCode="EEE 501" isAdmin={false} />
      </div>
    </StudentLayout>
  )
}