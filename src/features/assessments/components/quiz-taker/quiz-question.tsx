import { motion, AnimatePresence } from 'framer-motion'
import { Check, Image, Video, Volume2 } from 'lucide-react'
import type { Question } from '../../types/assessment.types'

interface QuizQuestionProps {
  question: Question
  selectedOptions: string[]
  onSelect: (optionId: string, isMultiSelect: boolean) => void
}

export function QuizQuestion({ question, selectedOptions, onSelect }: QuizQuestionProps) {
  const isTrueFalse = question.type === 'true-false'
  const isMultiSelect = question.type === 'multiple-select' || question.allowMultiple === true

  const handleSelect = (optionId: string) => {
    onSelect(optionId, isMultiSelect)
  }

  const getMediaIcon = (type?: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />
      case 'audio': return <Volume2 className="w-4 h-4" />
      default: return <Image className="w-4 h-4" />
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -20, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        {/* Question Text */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{question.text}</h2>

        {/* Media Display */}
        {question.mediaUrls && question.mediaUrls.length > 0 && (
          <div className="mb-6 space-y-3">
            {question.mediaUrls.map((url, idx) => (
              <div key={idx} className="rounded-lg overflow-hidden bg-gray-50">
                {question.mediaType === 'video' ? (
                  <video 
                    src={url} 
                    controls 
                    className="w-full max-h-64 rounded-lg"
                    preload="metadata"
                  />
                ) : question.mediaType === 'audio' ? (
                  <audio 
                    src={url} 
                    controls 
                    className="w-full"
                  />
                ) : (
                  <img 
                    src={url} 
                    alt={`Media ${idx + 1}`}
                    className="w-full max-h-64 object-contain rounded-lg"
                    loading="lazy"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Multi-select indicator */}
        {isMultiSelect && (
          <p className="text-sm text-yellow-600 mb-4">
            Select all that apply ({question.options.filter(o => o.isCorrect).length} correct answer(s))
          </p>
        )}

        {/* Options */}
        <div className={isTrueFalse ? 'grid grid-cols-2 gap-4' : 'space-y-3'}>
          {question.options.map((option, index) => {
            const isSelected = selectedOptions.includes(option.id)
            return (
              <motion.button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  isSelected
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-yellow-400 hover:bg-gray-50'
                }`}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  {/* Selection indicator */}
                  <span className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm ${
                    isSelected 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {isSelected ? (
                      <Check className="w-5 h-5" />
                    ) : isTrueFalse ? (
                      option.text
                    ) : (
                      String.fromCharCode(65 + index)
                    )}
                  </span>
                  {!isTrueFalse && (
                    <span className="text-gray-700">{option.text}</span>
                  )}
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Points indicator */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-500">
            Points: <span className="font-semibold text-gray-700">{question.points}</span>
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
