# Interactive Quiz System - Phase 1 Design

## Project Context

This is a Next.js education platform for a university website using:
- Next.js App Router
- TailwindCSS
- Framer Motion
- Clerk authentication
- MongoDB with Prisma
- Zod for validation

## Architecture Rules

- UI components cannot fetch data directly
- Hooks manage state logic
- Services handle data access
- Routes remain thin
- Client-side state for active quiz sessions

---

## Phase 1: Core Quiz Taking (MVP)

### Quiz Flow

1. **Instructions Screen** - Shows quiz title, time limit, question count, and "Start Quiz" button
2. **Question Screen** - One question per view with slide transitions
3. **Results Screen** - Score display with correct/incorrect breakdown

### Features

- **Navigation**: Previous/Next buttons, keyboard support (arrow keys)
- **Timer**: Countdown with warning pulse under 1 minute
- **Progress Bar**: Shows current question / total
- **Answer Selection**: Click to select, visual feedback (green highlight)
- **Auto-save**: Answers saved to localStorage every 10 seconds
- **Crash Recovery**: Restore answers from localStorage on reload
- **Transitions**: Smooth slide left/right between questions

### Question Types (Phase 1)

- Multiple Choice (single answer)
- True/False

### Data Structure

```typescript
interface Quiz {
  id: string
  courseId: string
  title: string
  description?: string
  timeLimit: number // in minutes
  shuffleQuestions: boolean
  showCorrectAnswers: boolean
  passingScore: number
  maxAttempts: number
  questions: Question[]
}

interface Question {
  id: string
  type: 'multiple-choice' | 'true-false'
  text: string
  mediaUrls?: string[]
  options: QuestionOption[]
  points: number
  tags?: string[]
  difficulty?: 'easy' | 'medium' | 'hard'
}

interface QuestionOption {
  id: string
  text: string
  isCorrect: boolean
  explanation?: string
}

interface QuizSession {
  quizId: string
  currentIndex: number
  answers: Record<string, string[]>
  startTime: Date
  isSubmitted: boolean
  timeSpent: Record<string, number>
}
```

### Components

1. **QuizInstructions** - Pre-quiz screen with quiz details
2. **QuizQuestion** - Single question display with answer options
3. **QuizNavigation** - Previous/Next buttons
4. **QuizTimer** - Countdown timer with warning state
5. **QuizProgress** - Progress bar showing current position
6. **QuizResults** - Post-quiz score and review

### Animations

- Question slide transitions using Framer Motion (left/right)
- Timer warning pulse (red) when under 1 minute
- Answer selection bounce effect
- Progress bar smooth fill
- Results page score reveal animation

### Edge Cases

- Browser crash recovery (localStorage backup)
- Timer expiration auto-submit
- Network failure during submission (queue and retry)

---

## File Structure

```
src/
├── app/
│   └── student/
│       └── quiz/
│           └── [quizId]/
│               └── page.tsx
├── features/
│   └── assessments/
│       ├── components/
│       │   ├── quiz-taker/
│       │   │   ├── quiz-instructions.tsx
│       │   │   ├── quiz-question.tsx
│       │   │   ├── quiz-navigation.tsx
│       │   │   ├── quiz-timer.tsx
│       │   │   ├── quiz-progress.tsx
│       │   │   └── quiz-results.tsx
│       │   └── question-types/
│       │       ├── multiple-choice.tsx
│       │       └── true-false.tsx
│       ├── hooks/
│       │   ├── use-quiz-session.ts
│       │   └── use-timer.ts
│       ├── services/
│       │   └── assessments.ts
│       └── types/
│           └── assessment.types.ts
```

---

## Acceptance Criteria

1. User sees instructions screen with quiz info and Start button
2. Timer counts down and warns when under 1 minute
3. User can navigate between questions with buttons and keyboard
4. Answers are visually highlighted when selected
5. Progress bar updates smoothly
6. Answers auto-save to localStorage every 10 seconds
7. On page reload, answers are restored from localStorage
8. Results screen shows score and breakdown
9. Smooth animations for all transitions
10. Accessible: ARIA labels, keyboard navigation
