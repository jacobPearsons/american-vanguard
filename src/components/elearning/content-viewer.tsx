'use client'

import { useState, useEffect } from 'react'
import { 
  ChevronLeft, ChevronRight, Menu, Bookmark, CheckCircle, 
  Type, Sun, Maximize2, Minus, Plus, X, Clock, FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'

type ReaderTheme = 'dark' | 'sepia' | 'light'

interface ModuleContent {
  id: number
  title: string
  content: string
  type: 'markdown' | 'pdf' | 'video'
  duration?: string
  completed: boolean
}

interface ContentViewerProps {
  courseId: number
  courseName: string
  courseCode: string
  modules: ModuleContent[]
  currentModuleId: number
  onModuleComplete: (moduleId: number) => void
  onNavigate: (moduleId: number) => void
}

export function ContentViewer({ 
  courseId, 
  courseName, 
  courseCode,
  modules, 
  currentModuleId,
  onModuleComplete,
  onNavigate 
}: ContentViewerProps) {
  const [theme, setTheme] = useState<ReaderTheme>('dark')
  const [fontSize, setFontSize] = useState(16)
  const [showToc, setShowToc] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)

  const currentModule = modules.find(m => m.id === currentModuleId) || modules[0]
  const currentIndex = modules.findIndex(m => m.id === currentModuleId)
  
  const progress = Math.round(((currentIndex + 1) / modules.length) * 100)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    const scrollProgress = target.scrollTop / (target.scrollHeight - target.clientHeight)
    if (!isNaN(scrollProgress)) {
      setReadingProgress(Math.min(100, Math.max(0, scrollProgress * 100)))
    }
  }

  const navigateNext = () => {
    if (currentIndex < modules.length - 1) {
      onNavigate(modules[currentIndex + 1].id)
    }
  }

  const navigatePrev = () => {
    if (currentIndex > 0) {
      onNavigate(modules[currentIndex - 1].id)
    }
  }

  const getThemeClasses = () => {
    switch (theme) {
      case 'sepia':
        return 'bg-[#f4ecd8] text-[#5b4636]'
      case 'light':
        return 'bg-white text-gray-900'
      default:
        return 'bg-neutral-900 text-neutral-200'
    }
  }

  return (
    <div className={`flex flex-col h-screen ${fullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Reader Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-neutral-800 border-b border-neutral-700">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowToc(!showToc)}
            className="text-neutral-400 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="hidden md:block">
            <span className="text-yellow-500 text-sm font-medium">{courseCode}</span>
            <span className="text-neutral-400 text-sm mx-2">•</span>
            <span className="text-neutral-400 text-sm">{currentModule?.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Font Size */}
          <div className="flex items-center gap-1 bg-neutral-700 rounded-lg p-1">
            <button 
              onClick={() => setFontSize(Math.max(12, fontSize - 2))}
              className="p-1 hover:bg-neutral-600 rounded"
            >
              <Minus className="w-4 h-4 text-neutral-400" />
            </button>
            <span className="text-neutral-400 text-xs w-6 text-center">{fontSize}</span>
            <button 
              onClick={() => setFontSize(Math.min(24, fontSize + 2))}
              className="p-1 hover:bg-neutral-600 rounded"
            >
              <Plus className="w-4 h-4 text-neutral-400" />
            </button>
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center gap-1 bg-neutral-700 rounded-lg p-1">
            <button 
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded ${theme === 'dark' ? 'bg-neutral-600' : ''}`}
            >
              <div className="w-4 h-4 rounded-full bg-neutral-900 border border-neutral-600" />
            </button>
            <button 
              onClick={() => setTheme('sepia')}
              className={`p-1.5 rounded ${theme === 'sepia' ? 'bg-neutral-600' : ''}`}
            >
              <div className="w-4 h-4 rounded-full bg-[#f4ecd8] border border-yellow-200" />
            </button>
            <button 
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded ${theme === 'light' ? 'bg-neutral-600' : ''}`}
            >
              <div className="w-4 h-4 rounded-full bg-white border border-gray-300" />
            </button>
          </div>

          {/* Fullscreen */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setFullscreen(!fullscreen)}
            className="text-neutral-400 hover:text-white"
          >
            <Maximize2 className="w-5 h-5" />
          </Button>

          {/* Bookmark */}
          <Button 
            variant="ghost" 
            size="sm"
            className="text-neutral-400 hover:text-white"
          >
            <Bookmark className="w-5 h-5" />
          </Button>

          {/* Mark Complete */}
          <Button 
            variant={currentModule?.completed ? 'default' : 'outline'}
            size="sm"
            onClick={() => onModuleComplete(currentModuleId)}
            className={currentModule?.completed ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            {currentModule?.completed ? 'Completed' : 'Mark Complete'}
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-neutral-800">
        <div 
          className="h-full bg-yellow-500 transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Table of Contents Sidebar */}
        {showToc && (
          <div className="w-72 border-r border-neutral-700 bg-neutral-800/50 overflow-y-auto p-4">
            <h3 className="text-sm font-semibold text-white mb-4">Course Content</h3>
            <div className="space-y-1">
              {modules.map((module, index) => (
                <button
                  key={module.id}
                  onClick={() => onNavigate(module.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    module.id === currentModuleId
                      ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30'
                      : 'hover:bg-neutral-700 text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-neutral-700 flex items-center justify-center text-xs">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{module.title}</p>
                      {module.duration && (
                        <p className="text-xs text-neutral-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {module.duration}
                        </p>
                      )}
                    </div>
                    {module.completed && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-neutral-900/50 rounded-lg">
              <div className="text-sm text-neutral-400 mb-2">Course Progress</div>
              <div className="w-full bg-neutral-700 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-neutral-500 mt-2">{progress}% complete</p>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div 
          className={`flex-1 overflow-y-auto p-8 ${getThemeClasses()}`}
          onScroll={handleScroll}
        >
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <span className="text-sm text-neutral-500">Module {currentIndex + 1} of {modules.length}</span>
              <h1 className="text-2xl font-bold mt-2">{currentModule?.title}</h1>
            </div>
            
            <div 
              className="prose max-w-none"
              style={{ 
                fontSize: `${fontSize}px`,
                lineHeight: 1.8
              }}
            >
              {currentModule?.content ? (
                <div dangerouslySetInnerHTML={{ __html: currentModule.content }} />
              ) : (
                <div className="flex items-center justify-center h-64 text-neutral-500">
                  <div className="text-center">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No content available for this module</p>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-12 pt-6 border-t border-neutral-700">
              <Button
                variant="outline"
                onClick={navigatePrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <Button
                onClick={navigateNext}
                disabled={currentIndex === modules.length - 1}
                className="bg-yellow-600 hover:bg-yellow-700 flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Reading Stats */}
      <div className="hidden lg:flex items-center justify-between px-4 py-2 bg-neutral-800 border-t border-neutral-700 text-sm">
        <div className="text-neutral-500">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Est. {Math.round(modules.length * 15)} min read
          </span>
        </div>
        <div className="text-neutral-500">
          {readingProgress.toFixed(0)}% read
        </div>
      </div>
    </div>
  )
}

export default ContentViewer