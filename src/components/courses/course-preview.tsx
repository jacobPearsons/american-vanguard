'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { GraduationCap, Clock, Users, MapPin, BookOpen, User, CheckCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Course {
  id: number
  code: string
  name: string
  description: string | null
  credits: number
  maxCapacity: number
  enrolledCount: number
  syllabus: string | null
  facilityTags: string[]
  department: { name: string }
  instructor?: {
    firstName: string
    lastName: string
    title: string
    photoUrl?: string | null
    researchArea?: string | null
  } | null
}

export function CoursePreview() {
  const params = useParams()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const slug = params?.slug as string
    if (!slug) return

    fetch(`/api/courses/${slug}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('Course not found')
        }
        const data = await res.json()
        setCourse(data.course)
      })
      .catch((err) => {
        setError(err.message || 'Failed to load course')
      })
      .finally(() => setLoading(false))
  }, [params?.slug])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-600"></div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="text-center py-20">
        <p className="text-neutral-400 text-lg">{error || 'Course not found'}</p>
        <Link href="/courses" className="text-yellow-500 hover:text-yellow-400 mt-4 inline-block">
          ← Back to Course Catalog
        </Link>
      </div>
    )
  }

  const isFull = course.enrolledCount >= course.maxCapacity

  return (
    <div className="space-y-8">
      <Link href="/courses" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Catalog
      </Link>

      <div className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-yellow-500 font-semibold text-lg">{course.code}</span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mt-2">{course.name}</h1>
            <p className="text-neutral-400 mt-2">{course.department.name}</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-white">{course.credits}</p>
            <p className="text-neutral-400">Credits</p>
          </div>
        </div>
      </div>

      {course.description && (
        <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
          <h2 className="text-xl font-semibold text-white mb-4">About This Course</h2>
          <p className="text-neutral-300 leading-relaxed">{course.description}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800 text-center">
          <Users className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
          <p className="text-3xl font-bold text-white">{course.enrolledCount}</p>
          <p className="text-neutral-400">Students Enrolled</p>
        </div>
        <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800 text-center">
          <MapPin className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
          <p className="text-3xl font-bold text-white">{course.maxCapacity}</p>
          <p className="text-neutral-400">Max Capacity</p>
        </div>
        <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800 text-center">
          <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
          <p className="text-3xl font-bold text-white">15</p>
          <p className="text-neutral-400">Weeks</p>
        </div>
      </div>

      {course.facilityTags && course.facilityTags.length > 0 && (
        <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
          <h2 className="text-xl font-semibold text-white mb-4">Facilities & Resources</h2>
          <div className="flex flex-wrap gap-2">
            {course.facilityTags.map((tag, i) => (
              <span key={i} className="px-4 py-2 bg-yellow-900/30 text-yellow-300 rounded-full text-sm font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {course.instructor && (
        <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
          <h2 className="text-xl font-semibold text-white mb-4">Instructor</h2>
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-neutral-800 rounded-full flex items-center justify-center flex-shrink-0">
              {course.instructor.photoUrl ? (
                <img 
                  src={course.instructor.photoUrl} 
                  alt={`${course.instructor.firstName} ${course.instructor.lastName}`}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <User className="w-10 h-10 text-neutral-500" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">
                {course.instructor.firstName} {course.instructor.lastName}
              </h3>
              <p className="text-yellow-500 font-medium">{course.instructor.title}</p>
              {course.instructor.researchArea && (
                <p className="text-neutral-400 mt-2">{course.instructor.researchArea}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {course.syllabus && (
        <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-yellow-500" />
            Syllabus
          </h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-neutral-300 whitespace-pre-wrap leading-relaxed">{course.syllabus}</p>
          </div>
        </div>
      )}

      <Button 
        className="w-full bg-yellow-600 hover:bg-yellow-700 py-4 text-lg font-semibold"
        disabled={isFull}
      >
        {isFull ? 'Course Full - Waitlist Only' : 'Enroll Now'}
      </Button>

      <div className="text-center text-neutral-500 text-sm">
        <p>For enrollment assistance, contact the admissions office</p>
      </div>
    </div>
  )
}

export default CoursePreview