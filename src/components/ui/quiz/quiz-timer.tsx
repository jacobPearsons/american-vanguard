import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'

/**
 * Props for the QuizTimer component
 */
interface QuizTimerProps {
  /** Remaining time in seconds */
  timeLeft: number
  /** Pre-formatted time string (e.g., "05:30") */
  formattedTime: string
  /** Whether time is in warning zone (< 60 seconds) */
  isWarning: boolean
}

/**
 * Countdown timer component for quizzes.
 * Displays remaining time with visual warning state when low.
 */
export function QuizTimer({ timeLeft, formattedTime, isWarning }: QuizTimerProps) {
  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
        isWarning ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700'
      }`}
    >
      <Clock className="w-5 h-5" />
      <span className={`font-mono text-lg font-semibold ${isWarning ? 'animate-pulse' : ''}`}>
        {formattedTime}
      </span>
      {isWarning && (
        <motion.span
          className="text-xs text-red-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          Time Left
        </motion.span>
      )}
    </div>
  )
}