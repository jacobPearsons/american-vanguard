import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const SubmitQuizSchema = z.object({
  quizId: z.string(),
  answers: z.record(z.array(z.string())),
  timeSpent: z.record(z.number()).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const result = SubmitQuizSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: result.error.errors },
        { status: 400 }
      )
    }

    const { quizId, answers, timeSpent } = result.data

    // TODO: Fetch quiz from database
    // const quiz = await getQuizById(quizId)
    const quiz = await getMockQuiz(quizId)

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      )
    }

    // Grade the quiz server-side
    const gradedResult = gradeQuiz(quiz.questions, answers)

    // TODO: Save attempt to database
    // await saveQuizAttempt({
    //   quizId,
    //   userId: getCurrentUserId(),
    //   score: gradedResult.score,
    //   totalPoints: gradedResult.totalPoints,
    //   percentage: gradedResult.percentage,
    //   passed: gradedResult.passed,
    //   answers,
    //   timeSpent,
    //   completedAt: new Date(),
    // })

    return NextResponse.json({
      success: true,
      result: gradedResult,
    })
  } catch (error) {
    console.error('Quiz submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function gradeQuiz(questions: any[], answers: Record<string, string[]>) {
  let totalPoints = 0
  let earnedPoints = 0

  const questionResults = questions.map((question) => {
    totalPoints += question.points
    const selectedOptions = answers[question.id] || []
    const correctOptions = question.options
      .filter((o: any) => o.isCorrect)
      .map((o: any) => o.id)

    const isMultiSelect = question.type === 'multiple-select' || question.allowMultiple

    let correct = false
    let pointsEarned = 0

    if (isMultiSelect) {
      const correctSelections = selectedOptions.filter((id) => correctOptions.includes(id)).length
      const incorrectSelections = selectedOptions.filter((id) => !correctOptions.includes(id)).length
      const totalCorrectAnswers = correctOptions.length

      if (correctSelections > 0 && incorrectSelections === 0 && correctSelections === totalCorrectAnswers) {
        correct = true
        pointsEarned = question.points
      } else if (correctSelections > 0) {
        correct = false
        const partialCredit = (correctSelections - incorrectSelections) / totalCorrectAnswers
        pointsEarned = Math.max(0, Math.round(question.points * partialCredit))
      }
    } else {
      correct =
        selectedOptions.length === correctOptions.length &&
        selectedOptions.every((id) => correctOptions.includes(id))
      pointsEarned = correct ? question.points : 0
    }

    earnedPoints += pointsEarned

    return {
      questionId: question.id,
      correct,
      selectedOptions,
      correctOptions,
      pointsEarned,
    }
  })

  const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0

  return {
    quizId: questions[0]?.id?.split('-')[0] || 'unknown',
    score: earnedPoints,
    totalPoints,
    percentage,
    passed: percentage >= 70, // passing score
    questionResults,
  }
}

// Mock quiz for now - replace with DB call
async function getMockQuiz(quizId: string) {
  const mockQuizzes: Record<string, any> = {
    'quiz-1': {
      id: 'quiz-1',
      courseId: 'course-1',
      title: 'Power Systems Basics',
      timeLimit: 30,
      shuffleQuestions: false,
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
    },
  }

  return mockQuizzes[quizId] || null
}
