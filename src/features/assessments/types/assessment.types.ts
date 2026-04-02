export type QuestionType = 'multiple-choice' | 'true-false'

export interface QuestionOption {
  id: string
  text: string
  isCorrect: boolean
  explanation?: string
}

export interface Question {
  id: string
  type: QuestionType
  text: string
  mediaUrls?: string[]
  options: QuestionOption[]
  points: number
  tags?: string[]
  difficulty?: 'easy' | 'medium' | 'hard'
}

export interface Quiz {
  id: string
  courseId: string
  title: string
  description?: string
  timeLimit: number
  shuffleQuestions: boolean
  showCorrectAnswers: boolean
  passingScore: number
  maxAttempts: number
  questions: Question[]
}

export interface QuizAnswer {
  questionId: string
  selectedOptions: string[]
  timeSpent: number
}

export interface QuizSession {
  quizId: string
  currentIndex: number
  answers: Record<string, string[]>
  startTime: number
  isSubmitted: boolean
  timeSpent: Record<string, number>
}

export interface QuizResult {
  score: number
  totalPoints: number
  percentage: number
  passed: boolean
  questionResults: {
    questionId: string
    correct: boolean
    selectedOptions: string[]
    correctOptions: string[]
    pointsEarned: number
  }[]
}