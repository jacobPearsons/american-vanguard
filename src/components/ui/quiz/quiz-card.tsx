import { motion } from 'framer-motion'
import { Clock, FileQuestion } from 'lucide-react'
import type { Quiz } from '@/features/assessments/types/assessment.types'

/**
 * Props for the QuizCard component
 */
interface QuizCardProps {
  quiz: Quiz
  onClick?: () => void
  className?: string
}

/**
 * Displays quiz information in a list/card format.
 * Used for showing available quizzes to users.
 */
export function QuizCard({ quiz, onClick, className = '' }: QuizCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-5 cursor-pointer hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
          <FileQuestion className="w-6 h-6 text-yellow-600" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {quiz.title}
          </h3>
          
          {quiz.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {quiz.description}
            </p>
          )}
          
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{quiz.timeLimit} min</span>
            </div>
            <div className="flex items-center gap-1">
              <FileQuestion className="w-4 h-4" />
              <span>{quiz.questions.length} questions</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}