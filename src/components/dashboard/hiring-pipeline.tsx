/**
 * Hiring Pipeline Component
 * Purpose: Visualize user's progress in the hiring pipeline
 * 
 * Architecture (per docs):
 * - Presentation component (dumb)
 * - Receives props, renders UI
 * - No business logic
 */

import { CheckCircle, Circle, ArrowRight } from 'lucide-react'
import { FlowStage, FLOW_STAGES, getProgressPercentage } from '@/types/flow'
import Link from 'next/link'

interface HiringPipelineProps {
  currentStage: FlowStage
  onStageClick?: (stage: FlowStage) => void
}

/**
 * Get stage icon based on completion status
 */
const getStageIcon = (stageIndex: number, currentIndex: number) => {
  if (stageIndex < currentIndex) {
    return <CheckCircle className="w-5 h-5 text-green-500" />
  }
  if (stageIndex === currentIndex) {
    return <div className="w-5 h-5 rounded-full bg-yellow-500 animate-pulse" />
  }
  return <Circle className="w-5 h-5 text-neutral-600" />
}

/**
 * Get stage border color
 */
const getStageColor = (stageIndex: number, currentIndex: number) => {
  if (stageIndex < currentIndex) {
    return 'border-green-500/30 bg-green-500/10'
  }
  if (stageIndex === currentIndex) {
    return 'border-yellow-500/50 bg-yellow-500/10'
  }
  return 'border-neutral-800 bg-neutral-900'
}

/**
 * Hiring Pipeline Component
 * 
 * Visualizes the user's journey through the hiring process
 */
export function HiringPipeline({ currentStage, onStageClick }: HiringPipelineProps) {
  const currentIndex = FLOW_STAGES.findIndex(s => s.id === currentStage)
  const progress = getProgressPercentage(currentStage)
  
  // Only show key stages in a condensed view
  const keyStages = FLOW_STAGES.filter((stage, index) => 
    index === 0 || // Job Identified
    index === 2 || // Applications
    index === 3 || // Screening
    index === 4 || // HR Interview
    index === 5 || // Skills Test
    index === 6 || // Technical
    index === 7 || // Behavioral
    index === 8 || // Final
    index === 10 || // Offer
    index === 12 // Onboarding
  )

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-neutral-400">Pipeline Progress</span>
          <span className="text-sm font-medium text-white">{progress}%</span>
        </div>
        <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-yellow-500 to-green-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stage Indicators */}
      <div className="flex items-center justify-between">
        {keyStages.map((stage, index) => {
          const actualIndex = FLOW_STAGES.findIndex(s => s.id === stage.id)
          const isCompleted = actualIndex < currentIndex
          const isCurrent = actualIndex === currentIndex
          
          return (
            <div key={stage.id} className="flex items-center">
              <button
                onClick={() => onStageClick?.(stage.id)}
                className={`
                  flex flex-col items-center gap-1 p-2 rounded-lg border transition-all
                  ${getStageColor(actualIndex, currentIndex)}
                  ${isCurrent ? 'ring-2 ring-yellow-500/50' : ''}
                  hover:border-neutral-600
                `}
              >
                {getStageIcon(actualIndex, currentIndex)}
                <span className={`
                  text-xs whitespace-nowrap
                  ${isCurrent ? 'text-yellow-400 font-medium' : isCompleted ? 'text-green-400' : 'text-neutral-500'}
                `}>
                  {stage.label.split(' ')[0]}
                </span>
              </button>
              
              {index < keyStages.length - 1 && (
                <ArrowRight className={`w-4 h-4 mx-1 ${actualIndex < currentIndex ? 'text-green-500' : 'text-neutral-700'}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* Current Stage Info */}
      <div className="mt-6 p-4 rounded-lg bg-neutral-900 border border-neutral-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-400">Current Stage</p>
            <p className="text-lg font-medium text-white">{FLOW_STAGES[currentIndex]?.label}</p>
            <p className="text-sm text-neutral-500">{FLOW_STAGES[currentIndex]?.description}</p>
          </div>
          <Link 
            href="/screening"
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HiringPipeline
