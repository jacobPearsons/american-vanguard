'use client'

import { useState, useEffect } from 'react'
import { BookOpen, CheckCircle, Circle, Play, Clock } from 'lucide-react'

interface Module {
  id: number
  title: string
  type: 'video' | 'document' | 'quiz' | 'assignment'
  duration?: string
  completed: boolean
}

interface CourseProgressProps {
  courseId: number
  courseName: string
  courseCode: string
  progress: number
  modules: Module[]
  onModuleClick?: (moduleId: number) => void
}

export function CourseProgress({ 
  courseId, 
  courseName, 
  courseCode, 
  progress, 
  modules,
  onModuleClick 
}: CourseProgressProps) {
  const [expanded, setExpanded] = useState(false)
  
  const completedCount = modules.filter(m => m.completed).length
  const totalCount = modules.length

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return '🎬'
      case 'document': return '📄'
      case 'quiz': return '📝'
      case 'assignment': return '📋'
      default: return '📚'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-900/30 text-red-400'
      case 'document': return 'bg-yellow-900/30 text-yellow-400'
      case 'quiz': return 'bg-purple-900/30 text-purple-400'
      case 'assignment': return 'bg-orange-900/30 text-orange-400'
      default: return 'bg-neutral-800 text-neutral-400'
    }
  }

  return (
    <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
      <div 
        className="p-4 cursor-pointer hover:bg-neutral-800/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-yellow-500" />
            <div>
              <h4 className="font-semibold text-white">{courseCode}</h4>
              <p className="text-sm text-neutral-400">{courseName}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-white">{progress}%</p>
            <p className="text-xs text-neutral-500">{completedCount}/{totalCount} modules</p>
          </div>
        </div>

        <div className="w-full bg-neutral-800 rounded-full h-2">
          <div 
            className="h-2 rounded-full bg-yellow-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {expanded && (
        <div className="border-t border-neutral-800 p-4 space-y-2">
          {modules.map(module => (
            <div 
              key={module.id}
              className="flex items-center justify-between p-3 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors cursor-pointer"
              onClick={() => onModuleClick?.(module.id)}
            >
              <div className="flex items-center gap-3">
                {module.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-neutral-500" />
                )}
                <span className={`px-2 py-0.5 rounded text-xs ${getTypeColor(module.type)}`}>
                  {getTypeIcon(module.type)} {module.type}
                </span>
                <span className="text-white">{module.title}</span>
              </div>
              <div className="flex items-center gap-2">
                {module.duration && (
                  <span className="flex items-center gap-1 text-xs text-neutral-500">
                    <Clock className="w-3 h-3" />
                    {module.duration}
                  </span>
                )}
                {!module.completed && (
                  <button className="p-1 hover:bg-neutral-700 rounded">
                    <Play className="w-4 h-4 text-yellow-500" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function CourseProgressSidebar({ courses }: { courses: CourseProgressProps[] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-yellow-500" />
        Course Progress
      </h3>
      {courses.map(course => (
        <CourseProgress key={course.courseId} {...course} />
      ))}
    </div>
  )
}

export default CourseProgress