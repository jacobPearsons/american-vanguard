Project Context:

This is a Next.js education platform using:

- Next.js App Router
- TailwindCSS
- Framer Motion
- Clerk authentication
- MongoDB
- Zod for validation

Architecture Rules:

- UI components cannot fetch data directly
- Hooks manage state logic
- Services handle data access
- Routes remain thin
- Client-side state for active quiz sessions
- Server validation for submissions

Project Structure:

app/
features/assessments/
  components/
    quiz-taker/
    question-types/
      multiple-choice.tsx
      true-false.tsx
      short-answer.tsx
      matching.tsx
      essay.tsx
    timer.tsx
    progress-bar.tsx
    results-view.tsx
  hooks/
    use-quiz-session.ts
    use-timer.ts
  services/
    assessments.ts
  types/
    assessment.types.ts

Feature:

Create an interactive quiz and assessment system.

Requirements:

- Question types: Multiple Choice (single/multiple), True/False, Short Answer, Essay, Matching, Fill-in-blank, Code snippet evaluation
- Rich text editor for questions with LaTeX math support
- Image/audio/video embedding in questions
- Time limits per quiz or per question
- Randomized question order and answer choices
- Question banks with tagging and filtering
- Quiz attempts tracking (multiple attempts allowed or single)
- Auto-save answers every 10 seconds
- Immediate feedback option or delayed
- Partial credit for multiple choice
- Anti-cheating: fullscreen enforcement, tab switching detection, copy-paste disable
- Proctoring integration placeholder
- Detailed analytics per question (difficulty index)
- Manual grading interface for essays
- Export results to gradebook

Technical Specifications:

- MongoDB: Quiz { _id, courseId, title, timeLimit, shuffleQuestions, showCorrectAnswers, maxAttempts, passingScore, questions: [{ _id, type, text, mediaUrls, options: [{ text, isCorrect, explanation }], correctAnswer, points, tags, difficulty }] }
- Session state: currentQuestionIndex, answers: { questionId, answer, timeSpent }, startTime, isSubmitted
- Server-side grading logic (prevent client-side manipulation)
- Web Workers for timer accuracy
- Keyboard navigation (arrow keys, number selection)
- Accessibility: ARIA labels, screen reader announcements

Edge Cases:

- Browser crash recovery (localStorage backup of answers)
- Timer expiration auto-submit
- Network failure during submission (queue and retry)
- Handling multiple tabs (session synchronization)
- Graceful handling of proctoring false positives
- Accessibility compliance for time limits (extended time accommodations)

Animations:

- Question slide transitions (left/right)
- Timer warning pulse under 1 minute
- Answer selection feedback (correct: green bounce, incorrect: red shake)
- Progress bar smooth fill
- Results page score celebration (confetti optional)
- Smooth scroll to next question
