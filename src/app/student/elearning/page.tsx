'use client'

import React, { useState } from 'react'
import { StudentSidebar, defaultNavItems } from '@/components/features/student-dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BookOpen, Play, Clock, CheckCircle, FileText, Video, 
  Download, ChevronRight, Search, Filter
} from 'lucide-react'

interface Course {
  id: number
  code: string
  name: string
  instructor: string
  progress: number
  thumbnail: string
  modules: Module[]
}

interface Module {
  id: number
  title: string
  type: 'video' | 'document' | 'quiz' | 'assignment'
  duration?: string
  completed: boolean
  content: string
}

const mockCourses: Course[] = [
  {
    id: 1,
    code: 'EEE 501',
    name: 'Advanced Power Systems',
    instructor: 'Dr. Adeyemi',
    progress: 65,
    thumbnail: '/thumbnails/power-systems.jpg',
    modules: [
      { id: 1, title: 'Introduction to Power Systems', type: 'video', duration: '45 min', completed: true, content: 'https://video-url' },
      { id: 2, title: 'Power Generation', type: 'video', duration: '60 min', completed: true, content: 'https://video-url' },
      { id: 3, title: 'Transmission Lines', type: 'document', duration: '30 min', completed: true, content: '/docs/transmission.pdf' },
      { id: 4, title: 'Module 1 Quiz', type: 'quiz', completed: false, content: '' },
      { id: 5, title: 'Distribution Systems', type: 'video', duration: '55 min', completed: false, content: 'https://video-url' },
    ]
  },
  {
    id: 2,
    code: 'EEE 503',
    name: 'Digital Signal Processing',
    instructor: 'Prof. Okonkwo',
    progress: 40,
    thumbnail: '/thumbnails/dsp.jpg',
    modules: [
      { id: 1, title: 'Signals and Systems', type: 'video', duration: '50 min', completed: true, content: 'https://video-url' },
      { id: 2, title: 'Fourier Transform', type: 'video', duration: '65 min', completed: false, content: 'https://video-url' },
      { id: 3, title: 'Practice Problems', type: 'document', completed: false, content: '/docs/dsp-problems.pdf' },
    ]
  },
  {
    id: 3,
    code: 'EEE 505',
    name: 'Control Systems II',
    instructor: 'Dr. Ibrahim',
    progress: 80,
    thumbnail: '/thumbnails/control.jpg',
    modules: [
      { id: 1, title: 'State Space Analysis', type: 'video', duration: '55 min', completed: true, content: 'https://video-url' },
      { id: 2, title: 'Design Techniques', type: 'video', duration: '70 min', completed: true, content: 'https://video-url' },
      { id: 3, title: 'Assignment 1', type: 'assignment', completed: false, content: '' },
    ]
  },
]

interface Assignment {
  id: number
  courseCode: string
  courseName: string
  title: string
  dueDate: string
  status: 'pending' | 'submitted' | 'graded'
  grade?: number
}

const mockAssignments: Assignment[] = [
  { id: 1, courseCode: 'EEE 501', courseName: 'Advanced Power Systems', title: 'Power System Analysis', dueDate: '2026-04-01', status: 'pending' },
  { id: 2, courseCode: 'EEE 503', courseName: 'Digital Signal Processing', title: 'DSP Implementation', dueDate: '2026-03-28', status: 'submitted' },
  { id: 3, courseCode: 'EEE 505', courseName: 'Control Systems II', title: 'Controller Design', dueDate: '2026-03-20', status: 'graded', grade: 85 },
]

interface Quiz {
  id: number
  courseCode: string
  title: string
  questions: number
  duration: number
  status: 'available' | 'completed' | 'locked'
  score?: number
}

const mockQuizzes: Quiz[] = [
  { id: 1, courseCode: 'EEE 501', title: 'Power Systems Basics', questions: 20, duration: 30, status: 'completed', score: 85 },
  { id: 2, courseCode: 'EEE 503', title: 'Signal Processing', questions: 15, duration: 20, status: 'available' },
  { id: 3, courseCode: 'EEE 505', title: 'Control Fundamentals', questions: 25, duration: 40, status: 'locked' },
]

export default function ELearningPage() {
  const [courses] = useState<Course[]>(mockCourses)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [activeTab, setActiveTab] = useState<'courses' | 'assignments' | 'quizzes'>('courses')

  const handleNavigate = (item: { id: string; href?: string }) => {
    if (item.href) window.location.href = item.href
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />
      case 'document': return <FileText className="w-4 h-4" />
      case 'quiz': return <BookOpen className="w-4 h-4" />
      case 'assignment': return <FileText className="w-4 h-4" />
      default: return <BookOpen className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-100 text-red-600'
      case 'document': return 'bg-yellow-100 text-yellow-600'
      case 'quiz': return 'bg-purple-100 text-purple-600'
      case 'assignment': return 'bg-orange-100 text-orange-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': case 'graded': return 'text-green-600'
      case 'submitted': return 'text-yellow-600'
      default: return 'text-orange-600'
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="fixed left-0 top-0 h-full z-50">
        <StudentSidebar
          items={defaultNavItems}
          logoSrc="../images/newllogo.png"
          studentName="Adeniyi Victor"
          studentImage="../uploads/11015-d14efe5e-7045-42a4-9e53-0b597c3643c0_11zon-3.jpeg"
          activeItem="elearning"
          onNavigate={handleNavigate}
        />
      </div>

      <div className="flex-1 ml-64 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            <span className="mr-2">📚</span>
            E-Learning
          </h1>
          <p className="text-gray-600">Access your courses, assignments, and quizzes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="flex gap-2 border-b">
              <button
                onClick={() => setActiveTab('courses')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'courses' ? 'border-blue-600 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                My Courses
              </button>
              <button
                onClick={() => setActiveTab('assignments')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'assignments' ? 'border-blue-600 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Assignments
              </button>
              <button
                onClick={() => setActiveTab('quizzes')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'quizzes' ? 'border-blue-600 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Quizzes
              </button>
            </div>

            {activeTab === 'courses' && !selectedCourse && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course) => (
                  <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedCourse(course)}>
                    <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-t-lg flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-white opacity-50" />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-800">{course.code}</h3>
                      <p className="text-sm text-gray-600 mb-2">{course.name}</p>
                      <p className="text-xs text-gray-500 mb-3">Instructor: {course.instructor}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-green-500 rounded-full" style={{ width: `${course.progress}%` }} />
                        </div>
                        <span className="text-sm text-gray-600">{course.progress}%</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'courses' && selectedCourse && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <button onClick={() => setSelectedCourse(null)} className="text-yellow-600 hover:text-yellow-800">
                    ← Back to Courses
                  </button>
                  <h2 className="text-xl font-bold text-gray-800">{selectedCourse.code} - {selectedCourse.name}</h2>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Course Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedCourse.modules.map((module) => (
                        <div key={module.id} className={`flex items-center gap-4 p-3 rounded-lg ${module.completed ? 'bg-green-50' : 'bg-gray-50'}`}>
                          <div className={`p-2 rounded ${getTypeColor(module.type)}`}>
                            {getTypeIcon(module.type)}
                          </div>
                          <div className="flex-1">
                            <p className={`font-medium ${module.completed ? 'text-gray-600' : 'text-gray-800'}`}>
                              {module.title}
                            </p>
                            {module.duration && <p className="text-sm text-gray-500">{module.duration}</p>}
                          </div>
                          {module.completed ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <button className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700">
                              <Play className="w-4 h-4 inline mr-1" />
                              Start
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'assignments' && (
              <div className="space-y-4">
                {mockAssignments.map((assignment) => (
                  <Card key={assignment.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-800">{assignment.title}</h3>
                          <p className="text-sm text-gray-500">{assignment.courseCode} - {assignment.courseName}</p>
                          <p className="text-sm text-gray-400 mt-1">Due: {assignment.dueDate}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(assignment.status)} bg-gray-100`}>
                            {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                          </span>
                          {assignment.grade && <p className="text-lg font-bold text-green-600 mt-2">{assignment.grade}%</p>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'quizzes' && (
              <div className="space-y-4">
                {mockQuizzes.map((quiz) => (
                  <Card key={quiz.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-800">{quiz.title}</h3>
                          <p className="text-sm text-gray-500">{quiz.courseCode}</p>
                          <div className="flex gap-4 mt-2 text-sm text-gray-500">
                            <span>{quiz.questions} Questions</span>
                            <span>{quiz.duration} minutes</span>
                          </div>
                        </div>
                        <div className="text-right">
                          {quiz.status === 'completed' && quiz.score && (
                            <div>
                              <span className="text-2xl font-bold text-green-600">{quiz.score}%</span>
                              <p className="text-xs text-gray-500">Completed</p>
                            </div>
                          )}
                          {quiz.status === 'available' && (
                            <button className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">
                              Start Quiz
                            </button>
                          )}
                          {quiz.status === 'locked' && (
                            <span className="text-gray-400">🔒 Locked</span>
                          )}
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
                <CardTitle className="text-lg">Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div key={course.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{course.code}</span>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-yellow-500 rounded-full" style={{ width: `${course.progress}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockAssignments.filter(a => a.status === 'pending').map((a) => (
                    <div key={a.id} className="p-2 bg-orange-50 rounded">
                      <p className="text-sm font-medium text-gray-800">{a.title}</p>
                      <p className="text-xs text-orange-600">Due: {a.dueDate}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}