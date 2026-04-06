'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  BookOpen, Play, Clock, FileText, CheckCircle, Circle, 
  ArrowLeft, Users, MapPin, Calendar, Award
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CourseAnnouncements } from '@/components/announcements/course-announcements'

interface Course {
  id: number
  code: string
  name: string
  description: string
  credits: number
  maxCapacity: number
  enrolledCount: number
  semester: string
  academicYear: string
  department: { name: string }
  instructor?: {
    id: number
    firstName: string
    lastName: string
    title: string
    photoUrl?: string | null
  } | null
  modules?: Module[]
}

interface Module {
  id: number
  title: string
  type: 'video' | 'document' | 'quiz' | 'assignment'
  duration?: string
  completed: boolean
}

export function StudentCourseDetail() {
  const params = useParams()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'announcements' | 'grades'>('overview')

  useEffect(() => {
    const courseId = params?.id as string
    if (!courseId) return

    fetch(`/api/courses/student/${courseId}`)
      .then(res => res.json())
      .then(data => {
        setCourse(data.course)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params?.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-600"></div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="text-center py-20">
        <p className="text-neutral-400 text-lg">Course not found</p>
        <Link href="/student/courses" className="text-yellow-500 hover:text-yellow-400 mt-4 inline-block">
          ← Back to My Courses
        </Link>
      </div>
    )
  }

  const progress = course.modules ? Math.round((course.modules.filter(m => m.completed).length / course.modules.length) * 100) : 0

  const mockModules: Module[] = [
    { id: 1, title: 'Introduction and Overview', type: 'video', duration: '45 min', completed: true },
    { id: 2, title: 'Core Concepts', type: 'video', duration: '60 min', completed: true },
    { id: 3, title: 'Reading Materials', type: 'document', duration: '30 min', completed: true },
    { id: 4, title: 'Module 1 Quiz', type: 'quiz', duration: '20 min', completed: false },
    { id: 5, title: 'Practical Applications', type: 'video', duration: '55 min', completed: false },
    { id: 6, title: 'Assignment 1', type: 'assignment', duration: '2 hours', completed: false },
  ]

  const displayModules = course.modules || mockModules

  return (
    <div className="space-y-6">
      <Link 
        href="/student/courses" 
        className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to My Courses
      </Link>

      <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-yellow-500 font-semibold text-lg">{course.code}</span>
            <h1 className="text-3xl font-bold text-white mt-1">{course.name}</h1>
            <p className="text-neutral-400 mt-2">{course.department.name} • {course.semester} {course.academicYear}</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-white">{course.credits}</p>
            <p className="text-neutral-400">Credits</p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-neutral-400">Progress</span>
              <span className="text-white font-medium">{progress}%</span>
            </div>
            <div className="w-full bg-neutral-800 rounded-full h-3">
              <div 
                className="h-3 rounded-full bg-yellow-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <Button className="bg-yellow-600 hover:bg-yellow-700">
            <Play className="w-4 h-4 mr-2" />
            Continue Learning
          </Button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-neutral-800">
        {(['overview', 'content', 'announcements', 'grades'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === tab
                ? 'border-yellow-500 text-yellow-500'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {course.description && (
                <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
                  <h3 className="text-xl font-semibold text-white mb-4">About This Course</h3>
                  <p className="text-neutral-300 leading-relaxed">{course.description}</p>
                </div>
              )}

              <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
                <h3 className="text-xl font-semibold text-white mb-4">Course Stats</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-neutral-800/50 rounded-lg">
                    <Users className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{course.enrolledCount}</p>
                    <p className="text-sm text-neutral-400">Enrolled</p>
                  </div>
                  <div className="text-center p-4 bg-neutral-800/50 rounded-lg">
                    <MapPin className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{course.maxCapacity}</p>
                    <p className="text-sm text-neutral-400">Capacity</p>
                  </div>
                  <div className="text-center p-4 bg-neutral-800/50 rounded-lg">
                    <Calendar className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">15</p>
                    <p className="text-sm text-neutral-400">Weeks</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {course.instructor && (
                <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
                  <h3 className="text-xl font-semibold text-white mb-4">Instructor</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-neutral-500">
                        {course.instructor.firstName[0]}{course.instructor.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-white">
                        {course.instructor.firstName} {course.instructor.lastName}
                      </p>
                      <p className="text-yellow-500 text-sm">{course.instructor.title}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
                <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
                <div className="space-y-2">
                  <Link href={`/student/library?course=${course.id}`} className="flex items-center gap-2 text-neutral-400 hover:text-yellow-500">
                    <FileText className="w-4 h-4" />
                    Course Materials
                  </Link>
                  <Link href={`/student/grades?course=${course.id}`} className="flex items-center gap-2 text-neutral-400 hover:text-yellow-500">
                    <Award className="w-4 h-4" />
                    View Grades
                  </Link>
                  <Link href={`/student/forum?course=${course.id}`} className="flex items-center gap-2 text-neutral-400 hover:text-yellow-500">
                    <BookOpen className="w-4 h-4" />
                    Discussion Forum
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
            <div className="p-4 border-b border-neutral-800 bg-neutral-800/50">
              <h3 className="font-semibold text-white">Course Content</h3>
            </div>
            <div className="divide-y divide-neutral-800">
              {displayModules.map((module, index) => (
                <div key={module.id} className="p-4 hover:bg-neutral-800/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 text-sm">
                        {index + 1}
                      </span>
                      {module.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-neutral-500" />
                      )}
                      <div>
                        <p className={`font-medium ${module.completed ? 'text-neutral-400' : 'text-white'}`}>
                          {module.title}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-neutral-500">
                          <span className={`px-2 py-0.5 rounded ${module.type === 'video' ? 'bg-red-900/30 text-red-400' : module.type === 'quiz' ? 'bg-purple-900/30 text-purple-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                            {module.type}
                          </span>
                          {module.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {module.duration}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant={module.completed ? 'outline' : 'default'}>
                      {module.completed ? 'Review' : 'Start'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'announcements' && (
          <CourseAnnouncements courseId={course.id} />
        )}

        {activeTab === 'grades' && (
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Your Grades</h3>
            <div className="space-y-3">
              {displayModules
                .filter(m => m.type === 'quiz' || m.type === 'assignment')
                .map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-neutral-800/50 rounded-lg">
                    <div>
                      <p className="font-medium text-white">{item.title}</p>
                      <p className="text-sm text-neutral-400">{item.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-white">{i % 2 === 0 ? '85' : '--'}</p>
                      <p className="text-xs text-neutral-500">{i % 2 === 0 ? 'Graded' : 'Pending'}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentCourseDetail