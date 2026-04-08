import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Trophy, RefreshCw } from 'lucide-react'
import type { QuizResult, Question } from '@/features/assessments/types/assessment.types'

/**
 * Props for the QuizResults component
 */
interface QuizResultsProps {
  /** The quiz result data */
  result: QuizResult
  /** Original questions for display reference */
  questions: Question[]
  /** Optional callback to retake the quiz */
  onRetake?: () => void
}

/**
 * Displays quiz results/scores after submission.
 * Shows score percentage, pass/fail status, and per-question breakdown.
 */
export function QuizResults({ result, questions, onRetake }: QuizResultsProps) {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-lg p-8"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <Trophy
              className={`w-20 h-20 mx-auto mb-4 ${
                result.passed ? 'text-yellow-500' : 'text-gray-400'
              }`}
            />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {result.passed ? 'Congratulations!' : 'Keep Trying!'}
          </h1>
          <p className="text-gray-600">
            {result.passed
              ? 'You passed the quiz!'
              : `You need ${result.totalPoints > 0 ? Math.ceil(result.totalPoints * 0.01 * 70) : 0} points to pass.`}
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="text-center">
            <p className="text-5xl font-bold text-gray-800 mb-2">{result.percentage}%</p>
            <p className="text-gray-500">
              {result.score} / {result.totalPoints} points
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {result.questionResults.map((qr, index) => {
            const question = questions.find((q) => q.id === qr.questionId)
            return (
              <div
                key={qr.questionId}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  qr.correct ? 'bg-green-50' : 'bg-red-50'
                }`}
              >
                {qr.correct ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="text-gray-700 flex-1">
                  Question {index + 1}: {question?.text.substring(0, 50)}...
                </span>
                <span className={`font-semibold ${qr.correct ? 'text-green-600' : 'text-red-600'}`}>
                  {qr.pointsEarned}/{question?.points || 0}
                </span>
              </div>
            )
          })}
        </div>

        {onRetake && (
          <button
            onClick={onRetake}
            className="w-full flex items-center justify-center gap-2 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Retake Quiz
          </button>
        )}
      </motion.div>
    </div>
  )
}