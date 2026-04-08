import { motion } from 'framer-motion'

/**
 * Props for the QuizProgress component
 */
interface QuizProgressProps {
  /** Current question index (0-based) */
  current: number
  /** Total number of questions */
  total: number
}

/**
 * Progress bar component for quizzes.
 * Shows current question position and completion percentage.
 */
export function QuizProgress({ current, total }: QuizProgressProps) {
  const percentage = ((current + 1) / total) * 100

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>Question {current + 1} of {total}</span>
        <span>{Math.round(percentage)}% Complete</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-yellow-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  )
}