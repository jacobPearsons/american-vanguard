/**
 * Admissions Pipeline Component
 * Purpose: Visual display of university admissions progress for AVI
 * 
 * This component displays the admissions flow stages as a progress indicator
 * Adapted from the hiring pipeline component for university admissions.
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  AdmissionsStage, 
  AdmissionsStageInfo,
  ADMISSIONS_STAGES,
} from '@/types/university/admissionsFlow'
import { getAdmissionsStageProgress } from '@/services/university/admissionsFlowService'

interface AdmissionsPipelineProps {
  currentStage: AdmissionsStage
  onStageClick?: (stage: AdmissionsStage) => void
  showLabels?: boolean
  compact?: boolean
}

/**
 * Get icon component based on icon name
 */
const getIcon = (iconName: string) => {
  const icons: Record<string, string> = {
    'Search': '🔍',
    'BookOpen': '📚',
    'Send': '📤',
    'FileText': '📄',
    'Pencil': '✏️',
    'Users': '👥',
    'CheckCircle': '✅',
    'UserPlus': '👤',
    'Calendar': '📅',
    'GraduationCap': '🎓',
  }
  return icons[iconName] || '●'
}

/**
 * Admissions Pipeline Component
 */
export function AdmissionsPipeline({
  currentStage,
  onStageClick,
  showLabels = true,
  compact = false,
}: AdmissionsPipelineProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentIndex = ADMISSIONS_STAGES.findIndex(s => s.id === currentStage)
  const progress = getAdmissionsStageProgress(currentStage)

  if (!mounted) {
    return (
      <div className="w-full h-32 bg-gray-100 animate-pulse rounded-lg" />
    )
  }

  return (
    <div className="w-full">
      {/* Institution Header */}
      {!compact && (
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            American Vanguard Institute
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Admissions Progress
          </p>
        </div>
      )}

      {/* Progress Bar */}
      <div className="relative mb-8">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 rounded -translate-y-1/2" />
        <motion.div 
          className="absolute top-1/2 left-0 h-1 bg-yellow-600 rounded -translate-y-1/2"
          initial={{ width: 0 }}
          animate={{ width: `${progress.progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Stage Indicators */}
      <div className="flex justify-between relative">
        {ADMISSIONS_STAGES.map((stage, index) => {
          const isCompleted = index < currentIndex
          const isCurrent = stage.id === currentStage
          const isClickable = onStageClick && (isCompleted || index === currentIndex + 1)

          return (
            <div 
              key={stage.id}
              className="flex flex-col items-center relative"
            >
              {/* Stage Dot */}
              <motion.button
                whileHover={isClickable ? { scale: 1.1 } : {}}
                whileTap={isClickable ? { scale: 0.95 } : {}}
                onClick={() => isClickable && onStageClick(stage.id)}
                disabled={!isClickable}
                className={`
                  relative z-10 w-10 h-10 rounded-full flex items-center justify-center
                  text-lg transition-all duration-200
                  ${isCompleted ? 'bg-green-500 text-white' : ''}
                  ${isCurrent ? 'bg-yellow-600 text-white ring-4 ring-blue-200 dark:ring-blue-800' : ''}
                  ${!isCompleted && !isCurrent ? 'bg-gray-200 dark:bg-gray-700 text-gray-400' : ''}
                  ${isClickable ? 'cursor-pointer hover:shadow-lg' : 'cursor-default'}
                `}
              >
                {isCompleted ? (
                  <span>✓</span>
                ) : (
                  <span>{getIcon(stage.icon)}</span>
                )}
              </motion.button>

              {/* Stage Label */}
              {showLabels && (
                <div className={`
                  absolute top-14 w-24 text-center
                  ${compact ? 'text-xs' : 'text-sm'}
                `}>
                  <p className={`
                    font-medium truncate
                    ${isCurrent ? 'text-yellow-600 dark:text-yellow-400' : ''}
                    ${isCompleted ? 'text-green-600 dark:text-green-400' : ''}
                    ${!isCompleted && !isCurrent ? 'text-gray-500 dark:text-gray-400' : ''}
                  `}>
                    {compact ? stage.label.split(' ')[0] : stage.label}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Current Stage Info */}
      {progress.stage && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getIcon(progress.stage.icon)}</span>
            <div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-300">
                {progress.stage.label}
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                {progress.stage.description}
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-yellow-600 dark:text-yellow-400">
              {progress.progress}% Complete
            </span>
            <span className="text-sm text-yellow-600 dark:text-yellow-400">
              Stage {currentIndex + 1} of {ADMISSIONS_STAGES.length}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  )
}

/**
 * Compact version of the admissions pipeline
 */
export function AdmissionsPipelineCompact({
  currentStage,
  onStageClick,
}: Omit<AdmissionsPipelineProps, 'compact'>) {
  return (
    <AdmissionsPipeline
      currentStage={currentStage}
      onStageClick={onStageClick}
      showLabels={true}
      compact={true}
    />
  )
}

/**
 * Vertical version of the admissions pipeline
 */
export function AdmissionsPipelineVertical({
  currentStage,
  onStageClick,
}: Omit<AdmissionsPipelineProps, 'compact'>) {
  const currentIndex = ADMISSIONS_STAGES.findIndex(s => s.id === currentStage)
  const progress = getAdmissionsStageProgress(currentStage)

  return (
    <div className="w-full">
      {/* Institution Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          American Vanguard Institute
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Admissions Progress: {progress.progress}%
        </p>
      </div>

      {/* Vertical Timeline */}
      <div className="relative">
        {/* Line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
        
        {/* Stages */}
        <div className="space-y-6">
          {ADMISSIONS_STAGES.map((stage, index) => {
            const isCompleted = index < currentIndex
            const isCurrent = stage.id === currentStage
            const isClickable = onStageClick && (isCompleted || index === currentIndex + 1)

            return (
              <motion.div 
                key={stage.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-4 relative"
              >
                {/* Dot */}
                <div className={`
                  relative z-10 w-10 h-10 rounded-full flex items-center justify-center
                  text-lg flex-shrink-0
                  ${isCompleted ? 'bg-green-500 text-white' : ''}
                  ${isCurrent ? 'bg-yellow-600 text-white' : ''}
                  ${!isCompleted && !isCurrent ? 'bg-gray-200 dark:bg-gray-700 text-gray-400' : ''}
                `}>
                  {isCompleted ? '✓' : getIcon(stage.icon)}
                </div>

                {/* Content */}
                <div 
                  className={`
                    flex-1 p-3 rounded-lg cursor-pointer
                    ${isCurrent ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''}
                    ${isClickable ? 'hover:bg-gray-50 dark:hover:bg-gray-800' : ''}
                  `}
                  onClick={() => isClickable && onStageClick(stage.id)}
                >
                  <h4 className={`
                    font-medium
                    ${isCurrent ? 'text-yellow-900 dark:text-yellow-300' : ''}
                    ${isCompleted ? 'text-green-900 dark:text-green-300' : ''}
                    ${!isCompleted && !isCurrent ? 'text-gray-500 dark:text-gray-400' : ''}
                  `}>
                    {stage.label}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stage.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AdmissionsPipeline
