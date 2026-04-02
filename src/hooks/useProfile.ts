/**
 * useProfile Hook
 * Purpose: Manage profile form state and submission
 * 
 * Data Flow: Service → Hook State → UI Component
 * 
 * Rules (per docs):
 * - Hooks manage state logic
 * - Components display state
 * - State must be predictable
 */

import { useState, useCallback, useRef } from 'react'
import type { ProfileData, Resume, EnglishTest, ProfileFormData, TestQuestion } from '@/types/profile'
import { submitProfileData, getProfileData, validateProfileData } from '@/services/profileService'

interface UseProfileReturn {
  // State
  profileData: ProfileData
  resume: Resume | null
  englishTest: EnglishTest
  isSubmitting: boolean
  submitMessage: string
  errors: Record<string, string>
  fileInputRef: React.RefObject<HTMLInputElement | null>
  
  // Test State
  testQuestions: TestQuestion[]
  currentQuestion: number
  selectedAnswer: string
  showResult: boolean
  score: number
  testStarted: boolean
  newSkill: string
  
  // Actions
  updateProfileField: (field: keyof ProfileData, value: unknown) => void
  setResume: (resume: Resume | null) => void
  updateEnglishTest: (field: keyof EnglishTest, value: unknown) => void
  addSkill: (skill: string) => void
  removeSkill: (skill: string) => void
  handleFileUpload: () => void
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  submitProfile: () => Promise<{ success: boolean; error?: string }>
  loadProfile: () => Promise<void>
  startTest: () => void
  submitAnswer: () => void
  nextQuestion: () => void
  setSelectedAnswer: (answer: string) => void
  setNewSkill: (skill: string) => void
  getLevelColor: (level: string) => string
}

// Initial profile data
const initialProfileData: ProfileData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  address: '',
  city: '',
  country: '',
  nationality: '',
  jobTitle: '',
  summary: '',
  skills: [],
  experienceYears: 0,
  expectedSalary: '',
  remoteWork: false,
  relocate: false,
}

const initialEnglishTest: EnglishTest = {
  hasTakenTest: false,
  score: 0,
  level: 'Not Taken',
  testDate: null,
}

// Mock English proficiency test questions
const testQuestions: TestQuestion[] = [
  {
    id: 1,
    question: "What is the correct form of the verb? 'She _____ to the store yesterday.'",
    options: ["go", "goes", "went", "gone"],
    correctAnswer: "went",
    category: "Grammar"
  },
  {
    id: 2,
    question: "Choose the correct spelling:",
    options: ["Accomodate", "Accommodate", "Acommodate", "Acomodate"],
    correctAnswer: "Accommodate",
    category: "Vocabulary"
  },
  {
    id: 3,
    question: "Select the correct sentence:",
    options: [
      "Me and him went to the store.",
      "Him and I went to the store.",
      "He and I went to the store.",
      "Me and he went to the store."
    ],
    correctAnswer: "He and I went to the store.",
    category: "Grammar"
  },
  {
    id: 4,
    question: "What does 'ubiquitous' mean?",
    options: ["Rare", "Everywhere", "Important", "Different"],
    correctAnswer: "Everywhere",
    category: "Vocabulary"
  },
  {
    id: 5,
    question: "Complete the sentence: 'If I _____ more money, I would buy a new car.'",
    options: ["have", "had", "will have", "would have"],
    correctAnswer: "had",
    category: "Grammar"
  }
]

/**
 * Hook for managing profile form
 * 
 * @returns Object containing profile state and actions
 * 
 * Usage:
 * const { profileData, updateProfileField, submitProfile } = useProfile()
 */
export const useProfile = (): UseProfileReturn => {
  const [profileData, setProfileData] = useState<ProfileData>(initialProfileData)
  const [resume, setResume] = useState<Resume | null>(null)
  const [englishTest, setEnglishTest] = useState<EnglishTest>(initialEnglishTest)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // Test state
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [testStarted, setTestStarted] = useState(false)
  const [newSkill, setNewSkill] = useState('')
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  /**
   * Update a profile field
   */
  const updateProfileField = useCallback((
    field: keyof ProfileData,
    value: unknown
  ) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user makes changes
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }, [errors])

  /**
   * Update English test data
   */
  const updateEnglishTest = useCallback((
    field: keyof EnglishTest,
    value: unknown
  ) => {
    setEnglishTest(prev => ({
      ...prev,
      [field]: value
    }))
  }, [])

  /**
   * Add a skill
   */
  const addSkill = useCallback(() => {
    if (newSkill && !profileData.skills.includes(newSkill)) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill]
      }))
      setNewSkill('')
    }
  }, [newSkill, profileData.skills])

  /**
   * Remove a skill
   */
  const removeSkill = useCallback((skill: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }))
  }, [])

  /**
   * Trigger file input click
   */
  const handleFileUpload = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  /**
   * Handle file selection
   */
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setResume({
        name: file.name,
        size: file.size,
        uploaded: true,
        url: URL.createObjectURL(file)
      })
    }
  }, [])

  /**
   * Submit profile data
   */
  const submitProfile = useCallback(async () => {
    try {
      setIsSubmitting(true)
      setSubmitMessage('')
      
      const formData: ProfileFormData = {
        profile: profileData,
        resume,
        englishTest,
      }
      
      // Validate first
      const validation = validateProfileData(formData)
      if (!validation.valid) {
        const errorMap: Record<string, string> = {}
        validation.errors.forEach(error => {
          errorMap.general = error
        })
        setErrors(errorMap)
        return { success: false, error: validation.errors[0] }
      }
      
      // Submit via service
      const result = await submitProfileData(formData)
      
      if (result.success) {
        setSubmitMessage(result.message || 'Profile saved successfully')
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save profile'
      return { success: false, error: message }
    } finally {
      setIsSubmitting(false)
    }
  }, [profileData, resume, englishTest])

  /**
   * Start the English test
   */
  const startTest = useCallback(() => {
    setTestStarted(true)
    setCurrentQuestion(0)
    setScore(0)
    setShowResult(false)
    setSelectedAnswer('')
  }, [])

  /**
   * Submit an answer
   */
  const submitAnswer = useCallback(() => {
    if (selectedAnswer === testQuestions[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1)
    }
    setShowResult(true)
  }, [selectedAnswer, currentQuestion])

  /**
   * Move to next question
   */
  const nextQuestion = useCallback(() => {
    if (currentQuestion < testQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setShowResult(false)
      setSelectedAnswer('')
    } else {
      // Test completed
      const finalScore = score + (selectedAnswer === testQuestions[currentQuestion].correctAnswer ? 1 : 0)
      const percentage = (finalScore / testQuestions.length) * 100
      let level = 'Beginner'
      if (percentage >= 90) level = 'Advanced'
      else if (percentage >= 70) level = 'Upper Intermediate'
      else if (percentage >= 50) level = 'Intermediate'
      else if (percentage >= 30) level = 'Elementary'
      
      setEnglishTest({
        hasTakenTest: true,
        score: percentage,
        level,
        testDate: new Date()
      })
    }
  }, [currentQuestion, score, selectedAnswer])

  /**
   * Get color for English test level
   */
  const getLevelColor = useCallback((level: string) => {
    switch(level) {
      case 'Advanced': return 'bg-emerald-500'
      case 'Upper Intermediate': return 'bg-green-500'
      case 'Intermediate': return 'bg-yellow-500'
      case 'Elementary': return 'bg-orange-500'
      default: return 'bg-red-500'
    }
  }, [])

  /**
   * Load existing profile data
   */
  const loadProfile = useCallback(async () => {
    try {
      const data = await getProfileData()
      if (data) {
        setProfileData(data.profile)
        setResume(data.resume)
        setEnglishTest(data.englishTest)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }, [])

  return {
    profileData,
    resume,
    englishTest,
    isSubmitting,
    submitMessage,
    errors,
    fileInputRef,
    // Test state
    testQuestions,
    currentQuestion,
    selectedAnswer,
    showResult,
    score,
    testStarted,
    newSkill,
    // Actions
    updateProfileField,
    setResume,
    updateEnglishTest,
    addSkill,
    removeSkill,
    handleFileUpload,
    handleFileChange,
    submitProfile,
    loadProfile,
    startTest,
    submitAnswer,
    nextQuestion,
    setSelectedAnswer,
    setNewSkill,
    getLevelColor,
  }
}
