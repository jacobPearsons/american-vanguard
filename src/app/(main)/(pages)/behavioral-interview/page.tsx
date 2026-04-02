/**
 * Behavioral Interview Page
 * Purpose: Behavioral interview scheduling and assessment
 * 
 * Architecture (per docs):
 * - UI: Only handles display and user input
 * - Hook: Manages all state logic
 * - Service: Handles data access
 * 
 * Flow: Resume Screening → HR Interview → Skills Test → Verification → Behavioral Interview
 */

'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Clock, 
  Play,
  CheckCircle,
  XCircle,
  AlertCircle,
  CalendarPlus,
  FileText,
  Brain,
  MessageSquare,
  Timer,
  ArrowRight,
  Lock,
  Target,
  Heart,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import { useInterview } from '@/hooks/useInterview'
import { useVerification } from '@/hooks/useVerification'
import type { InterviewStatus } from '@/types/interview'

/**
 * Get status badge
 */
const getStatusBadge = (status: InterviewStatus) => {
  const colors: Record<InterviewStatus, string> = {
    'scheduled': 'bg-yellow-500',
    'completed': 'bg-green-500',
    'cancelled': 'bg-red-500',
    'no_show': 'bg-gray-500',
    'rescheduled': 'bg-yellow-500',
  }
  return <Badge className={`${colors[status]} text-white`}>{status}</Badge>
}

/**
 * Format date
 */
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Behavioral Competencies for Interview
 */
const BEHAVIORAL_COMPETENCIES = [
  { 
    id: 'leadership', 
    name: 'Leadership', 
    icon: <Target className="w-5 h-5" />,
    color: 'bg-purple-500/20 text-purple-400'
  },
  { 
    id: 'teamwork', 
    name: 'Teamwork & Collaboration', 
    icon: <Users className="w-5 h-5" />,
    color: 'bg-yellow-500/20 text-yellow-400'
  },
  { 
    id: 'communication', 
    name: 'Communication', 
    icon: <MessageSquare className="w-5 h-5" />,
    color: 'bg-green-500/20 text-green-400'
  },
  { 
    id: 'problem-solving', 
    name: 'Problem Solving', 
    icon: <Zap className="w-5 h-5" />,
    color: 'bg-yellow-500/20 text-yellow-400'
  },
  { 
    id: 'adaptability', 
    name: 'Adaptability', 
    icon: <Brain className="w-5 h-5" />,
    color: 'bg-orange-500/20 text-orange-400'
  },
  { 
    id: 'empathy', 
    name: 'Empathy & EQ', 
    icon: <Heart className="w-5 h-5" />,
    color: 'bg-pink-500/20 text-pink-400'
  },
]

/**
 * Sample STAR Questions
 */
const STAR_QUESTIONS = [
  "Tell me about a time you led a team through a challenging project.",
  "Describe a situation where you had to work with a difficult team member.",
  "Share an example of how you handled a major setback.",
  "Tell me about a time you went above and beyond for a customer.",
  "Describe a situation where you had to make a quick decision with limited information.",
]

/**
 * Behavioral Interview Page Component
 */
export default function BehavioralInterviewPage() {
  const { interviews, loading } = useInterview()
  const { summary, loadSummary } = useVerification()
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    loadSummary('user-123')
  }, [loadSummary])

  useEffect(() => {
    if (summary?.canAccessInterview) {
      setVerified(true)
    }
  }, [summary])

  const behavioralInterviews = interviews.filter(i => 
    i.interviewType === 'behavioral'
  )

  if (!verified) {
    return (
      <div className="min-h-screen bg-neutral-950 p-6">
        <div className="container max-w-lg mx-auto text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-neutral-800 rounded-full mb-6">
            <Lock className="w-10 h-10 text-neutral-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Access Restricted</h1>
          <p className="text-neutral-400 mb-8">
            You need a verification code to access the Behavioral Interview.
            Complete the skills test and obtain your code first.
          </p>
          <div className="space-y-4">
            <Link href="/profile">
              <Button className="w-full max-w-xs bg-emerald-600 hover:bg-emerald-700">
                <Brain className="w-4 h-4 mr-2" />
                Take Skills Test
              </Button>
            </Link>
            <Link href="/verify">
              <Button variant="outline" className="w-full max-w-xs border-neutral-700 text-neutral-400">
                <Lock className="w-4 h-4 mr-2" />
                Enter Verification Code
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 p-6">
      <div className="container max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Users className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Behavioral Interview</h1>
              <p className="text-neutral-400">Showcase your soft skills and experiences</p>
            </div>
          </div>
        </div>

        {/* Verification Status */}
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-8 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-green-300">Verification code accepted</span>
        </div>

        {/* Competencies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {BEHAVIORAL_COMPETENCIES.map((competency) => (
            <Card key={competency.id} className="bg-neutral-900 border-neutral-800 hover:border-neutral-700 transition-colors">
              <CardContent className="pt-6">
                <div className={`w-10 h-10 rounded-lg ${competency.color} flex items-center justify-center mb-3`}>
                  {competency.icon}
                </div>
                <h3 className="text-white font-medium mb-1">{competency.name}</h3>
                <p className="text-neutral-400 text-sm">Assess your {competency.name.toLowerCase()}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* STAR Method Tips */}
        <Card className="bg-neutral-900 border-neutral-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              STAR Method Framework
            </CardTitle>
            <CardDescription className="text-neutral-400">
              Structure your answers using the STAR method
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-neutral-800/50 rounded-lg">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-yellow-400 font-bold">S</span>
                </div>
                <h4 className="text-white font-medium mb-1">Situation</h4>
                <p className="text-neutral-400 text-sm">Describe the context</p>
              </div>
              <div className="text-center p-4 bg-neutral-800/50 rounded-lg">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-400 font-bold">T</span>
                </div>
                <h4 className="text-white font-medium mb-1">Task</h4>
                <p className="text-neutral-400 text-sm">Explain your responsibility</p>
              </div>
              <div className="text-center p-4 bg-neutral-800/50 rounded-lg">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-yellow-400 font-bold">A</span>
                </div>
                <h4 className="text-white font-medium mb-1">Action</h4>
                <p className="text-neutral-400 text-sm">Describe what you did</p>
              </div>
              <div className="text-center p-4 bg-neutral-800/50 rounded-lg">
                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-400 font-bold">R</span>
                </div>
                <h4 className="text-white font-medium mb-1">Result</h4>
                <p className="text-neutral-400 text-sm">Share the outcome</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sample Questions */}
        <Card className="bg-neutral-900 border-neutral-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Sample Questions
            </CardTitle>
            <CardDescription className="text-neutral-400">
              Practice answering these common behavioral questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {STAR_QUESTIONS.map((question, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-3 bg-neutral-800/50 rounded-lg"
                >
                  <span className="w-6 h-6 bg-neutral-700 rounded-full flex items-center justify-center text-xs text-white shrink-0">
                    {index + 1}
                  </span>
                  <p className="text-neutral-300">{question}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Scheduled Interviews */}
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CalendarPlus className="w-5 h-5" />
              Scheduled Behavioral Interviews
            </CardTitle>
            <CardDescription className="text-neutral-400">
              Your upcoming behavioral assessments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {behavioralInterviews.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-neutral-500 mx-auto mb-4" />
                <p className="text-neutral-400 mb-4">No behavioral interviews scheduled</p>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <CalendarPlus className="w-4 h-4 mr-2" />
                  Request Interview
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {behavioralInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{interview.candidateName}</p>
                        <p className="text-neutral-400 text-sm">{formatDate(interview.scheduledAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(interview.status)}
                      <Button variant="ghost" size="sm">
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Box */}
        <div className="mt-8 p-4 bg-neutral-900 border border-neutral-800 rounded-lg">
          <div className="flex items-start gap-3">
            <Heart className="w-5 h-5 text-pink-400 mt-0.5" />
            <div>
              <h4 className="text-white font-medium mb-1">Preparation Tips</h4>
              <ul className="text-neutral-400 text-sm space-y-1">
                <li>• Research the company culture and values</li>
                <li>• Prepare specific examples from past experiences</li>
                <li>• Use the STAR method to structure your answers</li>
                <li>• Be authentic and honest about your experiences</li>
                <li>• Have questions ready for the interviewer</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
