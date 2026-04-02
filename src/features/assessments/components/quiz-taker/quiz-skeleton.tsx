import { motion } from 'framer-motion'

export function QuizSkeleton() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 mr-4">
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-2 w-full bg-gray-200 rounded-full animate-pulse" />
        </div>
        <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
      </div>

      {/* Question skeleton */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-6" />
        
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-12 flex-1 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
      </motion.div>

      {/* Navigation skeleton */}
      <div className="flex justify-between items-center mt-6">
        <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    </div>
  )
}

export function QuizResultsSkeleton() {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-gray-200 rounded-full animate-pulse mb-4" />
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mx-auto mb-2" />
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mx-auto" />
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="text-center">
            <div className="h-12 w-24 bg-gray-200 rounded animate-pulse mx-auto mb-2" />
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mx-auto" />
          </div>
        </div>

        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
