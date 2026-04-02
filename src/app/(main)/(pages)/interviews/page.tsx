/**
 * Interviews Page
 * Purpose: Interview scheduling and management interface
 * 
 * Architecture (per docs):
 * - UI: Only handles display and user input
 * - Hook: Manages all state logic
 * - Service: Handles data access
 * 
 * Flow: Database → Service → Hook → UI Component
 */

'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Calendar, 
  Clock, 
  Video, 
  Users,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
  CalendarPlus,
  TrendingUp,
  UserCheck
} from 'lucide-react'
import Link from 'next/link'
import { useInterview } from '@/hooks/useInterview'
import type { InterviewType, InterviewStatus } from '@/types/interview'
import { INTERVIEW_TYPE_LABELS, INTERVIEW_STATUS_COLORS } from '@/types/interview'

/**
 * Get status badge
 */
const getStatusBadge = (status: InterviewStatus) => {
  const color = INTERVIEW_STATUS_COLORS[status]
  return (
    <Badge className={`${color} text-white`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

/**
 * Format interview type for display
 */
const formatInterviewType = (type: InterviewType) => {
  return INTERVIEW_TYPE_LABELS[type] || type
}

/**
 * Format date for display
 */
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Interviews Page Component
 */
export default function InterviewsPage() {
  const {
    interviews,
    upcomingInterviews,
    stats,
    loading,
    error,
    loadInterviews,
    loadStats
  } = useInterview()

  const [filter, setFilter] = useState<InterviewType | 'all'>('all')

  useEffect(() => {
    loadInterviews(filter === 'all' ? undefined : filter)
    loadStats()
  }, [filter, loadInterviews, loadStats])

  const handleFilterChange = (newFilter: InterviewType | 'all') => {
    setFilter(newFilter)
  }

  if (loading && interviews.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-950 p-6 flex items-center justify-center">
        <div className="text-white">Loading interviews...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 p-6">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Interviews</h1>
            <p className="text-neutral-400">
              Schedule and manage candidate interviews
            </p>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <CalendarPlus className="w-4 h-4 mr-2" />
            Schedule Interview
          </Button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-neutral-900 border-neutral-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-500/20 rounded-lg">
                    <Calendar className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.upcoming}</p>
                    <p className="text-sm text-neutral-400">Upcoming</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-neutral-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.completed}</p>
                    <p className="text-sm text-neutral-400">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-neutral-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-500/20 rounded-lg">
                    <XCircle className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.cancelled}</p>
                    <p className="text-sm text-neutral-400">Cancelled</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-neutral-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <UserCheck className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.total}</p>
                    <p className="text-sm text-neutral-400">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('all')}
            className={filter === 'all' ? 'bg-emerald-600' : 'border-neutral-700 text-neutral-400'}
          >
            All
          </Button>
          <Button
            variant={filter === 'hr' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('hr')}
            className={filter === 'hr' ? 'bg-emerald-600' : 'border-neutral-700 text-neutral-400'}
          >
            HR Interview
          </Button>
          <Button
            variant={filter === 'technical' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('technical')}
            className={filter === 'technical' ? 'bg-emerald-600' : 'border-neutral-700 text-neutral-400'}
          >
            Technical
          </Button>
          <Button
            variant={filter === 'behavioral' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('behavioral')}
            className={filter === 'behavioral' ? 'bg-emerald-600' : 'border-neutral-700 text-neutral-400'}
          >
            Behavioral
          </Button>
          <Button
            variant={filter === 'final' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('final')}
            className={filter === 'final' ? 'bg-emerald-600' : 'border-neutral-700 text-neutral-400'}
          >
            Final
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-neutral-900 border-neutral-800">
            <TabsTrigger value="all" className="data-[state=active]:bg-emerald-600">All Interviews</TabsTrigger>
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-emerald-600">Upcoming</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  All Interviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="bg-red-500/20 text-red-400 p-4 rounded-lg mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                  </div>
                )}

                {interviews.length === 0 ? (
                  <div className="text-center py-8 text-neutral-400">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No interviews found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {interviews.map((interview) => (
                      <div
                        key={interview.id}
                        className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-lg hover:bg-neutral-800 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                            <span className="text-emerald-400 font-bold">
                              {interview.candidateName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-medium">{interview.candidateName}</p>
                            <p className="text-neutral-400 text-sm">{interview.jobTitle}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-white text-sm">{formatInterviewType(interview.interviewType)}</p>
                            <p className="text-neutral-400 text-xs">{formatDate(interview.scheduledAt)}</p>
                          </div>
                          {getStatusBadge(interview.status)}
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/interviews/${interview.id}`}>
                              <Clock className="w-4 h-4 text-neutral-400" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upcoming">
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Interviews
                </CardTitle>
                <CardDescription className="text-neutral-400">
                  Scheduled interviews
                </CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingInterviews.length === 0 ? (
                  <div className="text-center py-8 text-neutral-400">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No upcoming interviews</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingInterviews.map((interview) => (
                      <div
                        key={interview.id}
                        className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-lg hover:bg-neutral-800 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                            <span className="text-emerald-400 font-bold">
                              {interview.candidateName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-medium">{interview.candidateName}</p>
                            <p className="text-neutral-400 text-sm">{interview.jobTitle}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-white text-sm">{formatInterviewType(interview.interviewType)}</p>
                            <p className="text-neutral-400 text-xs">{formatDate(interview.scheduledAt)}</p>
                          </div>
                          {getStatusBadge(interview.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
