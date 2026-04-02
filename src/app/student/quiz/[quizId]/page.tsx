import { notFound } from 'next/navigation'
import { QuizContainer } from '@/features/assessments/components/quiz-taker/quiz-container'
import { getQuizById } from '@/features/assessments/services/assessments'
import type { Quiz } from '@/features/assessments/types/assessment.types'

const mockQuiz: Quiz = {
  id: 'quiz-1',
  courseId: 'course-1',
  title: 'Power Systems Basics',
  description: 'Test your knowledge of power systems fundamentals',
  timeLimit: 30,
  shuffleQuestions: false,
  showCorrectAnswers: true,
  passingScore: 70,
  maxAttempts: 3,
  questions: [
    {
      id: 'q1',
      type: 'multiple-choice',
      text: 'What is the primary function of a transformer in a power system?',
      options: [
        { id: 'q1-a', text: 'Generate electrical power', isCorrect: false },
        { id: 'q1-b', text: 'Transmit electrical power', isCorrect: false },
        { id: 'q1-c', text: 'Step up or step down voltage levels', isCorrect: true },
        { id: 'q1-d', text: 'Store electrical energy', isCorrect: false },
      ],
      points: 10,
    },
    {
      id: 'q2',
      type: 'multiple-choice',
      text: 'Which of the following is a renewable energy source?',
      options: [
        { id: 'q2-a', text: 'Coal', isCorrect: false },
        { id: 'q2-b', text: 'Natural Gas', isCorrect: false },
        { id: 'q2-c', text: 'Solar', isCorrect: true },
        { id: 'q2-d', text: 'Nuclear', isCorrect: false },
      ],
      points: 10,
    },
    {
      id: 'q3',
      type: 'true-false',
      text: 'AC power is typically transmitted over long distances more efficiently than DC power.',
      options: [
        { id: 'q3-a', text: 'True', isCorrect: true },
        { id: 'q3-b', text: 'False', isCorrect: false },
      ],
      points: 10,
    },
    {
      id: 'q4',
      type: 'multiple-choice',
      text: 'What does PV stand for in solar PV systems?',
      options: [
        { id: 'q4-a', text: 'PhotoVoltage', isCorrect: true },
        { id: 'q4-b', text: 'Power Voltage', isCorrect: false },
        { id: 'q4-c', text: 'PhotoVariable', isCorrect: false },
        { id: 'q4-d', text: 'Primary Voltage', isCorrect: false },
      ],
      points: 10,
    },
    {
      id: 'q5',
      type: 'true-false',
      text: 'A circuit breaker is used to protect circuits from overload currents.',
      options: [
        { id: 'q5-a', text: 'True', isCorrect: true },
        { id: 'q5-b', text: 'False', isCorrect: false },
      ],
      points: 10,
    },
  ],
}

async function getQuiz(quizId: string): Promise<Quiz | null> {
  // TODO: Replace with actual DB fetch
  // return getQuizById(quizId)
  if (quizId === 'quiz-1') {
    return mockQuiz
  }
  return null
}

interface PageProps {
  params: Promise<{ quizId: string }>
}

export default async function QuizPage({ params }: PageProps) {
  const { quizId } = await params
  const quiz = await getQuiz(quizId)
  
  if (!quiz) {
    notFound()
  }

  if (!quiz.questions.length) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">No Questions Available</h1>
          <p className="text-gray-600">This quiz has no questions yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <QuizContainer quiz={quiz} useServerGrading={true} />
    </div>
  )
}
