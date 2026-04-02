/**
 * Technical Interview Page
 * Purpose: Technical interview scheduling and assessment
 * 
 * Architecture (per docs):
 * - UI: Only handles display and user input
 * - Hook: Manages all state logic
 * - Service: Handles data access
 * 
 * Flow: Resume Screening → HR Interview → Skills Test → Verification → Technical Interview
 */

'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Code, 
  Clock, 
  Play,
  CheckCircle,
  XCircle,
  AlertCircle,
  CalendarPlus,
  FileText,
  Brain,
  Lightbulb,
  Timer,
  ArrowRight,
  Lock
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
 * Technical Topics for Interview
 */
const TECHNICAL_TOPICS = [
  { id: 'algorithms', name: 'Algorithms & Data Structures', icon: '🧮' },
  { id: 'system-design', name: 'System Design', icon: '🏗️' },
  { id: 'frontend', name: 'Frontend Development', icon: '🎨' },
  { id: 'backend', name: 'Backend Development', icon: '⚙️' },
  { id: 'databases', name: 'Databases', icon: '🗄️' },
  { id: 'devops', name: 'DevOps & Cloud', icon: '☁️' },
]

/**
 * Technical Interview Page Component
 */
export default function TechnicalInterviewPage() {
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

  const technicalInterviews = interviews.filter(i => 
    i.interviewType === 'technical'
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
            You need a verification code to access the Technical Interview.
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
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Code className="w-8 h-8 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Technical Interview</h1>
              <p className="text-neutral-400">Demonstrate your technical skills</p>
            </div>
          </div>
        </div>

        {/* Verification Status */}
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-8 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-green-300">Verification code accepted</span>
        </div>

        {/* Technical Topics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {TECHNICAL_TOPICS.map((topic) => (
            <Card key={topic.id} className="bg-neutral-900 border-neutral-800 hover:border-neutral-700 transition-colors">
              <CardContent className="pt-6">
                <div className="text-3xl mb-3">{topic.icon}</div>
                <h3 className="text-white font-medium mb-1">{topic.name}</h3>
                <p className="text-neutral-400 text-sm">Assess your proficiency</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Scheduled Interviews */}
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CalendarPlus className="w-5 h-5" />
              Scheduled Technical Interviews
            </CardTitle>
            <CardDescription className="text-neutral-400">
              Your upcoming technical assessments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {technicalInterviews.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-neutral-500 mx-auto mb-4" />
                <p className="text-neutral-400 mb-4">No technical interviews scheduled</p>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <CalendarPlus className="w-4 h-4 mr-2" />
                  Request Interview
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {technicalInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                        <Code className="w-5 h-5 text-yellow-400" />
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
            <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div>
              <h4 className="text-white font-medium mb-1">Preparation Tips</h4>
              <ul className="text-neutral-400 text-sm space-y-1">
                <li>• Review algorithms and data structures</li>
                <li>• Practice system design problems</li>
                <li>• Be ready to write code in a live environment</li>
                <li>• Have questions ready for the interviewer</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
