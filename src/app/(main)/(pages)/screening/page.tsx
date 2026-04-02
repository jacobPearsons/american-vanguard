/**
 * Screening Page
 * Purpose: Resume screening management interface
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
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search,
  Eye,
  Filter,
  TrendingUp,
  Users,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { useScreening } from '@/hooks/useScreening'
import type { ScreeningStatus } from '@/types/screening'

/**
 * Get status badge color
 */
const getStatusBadge = (status: ScreeningStatus) => {
  switch (status) {
    case 'pending':
      return <Badge className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>
    case 'in_review':
      return <Badge className="bg-yellow-500"><Search className="w-3 h-3 mr-1" /> In Review</Badge>
    case 'approved':
      return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Approved</Badge>
    case 'rejected':
      return <Badge className="bg-red-500"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

/**
 * Screening Page Component
 */
export default function ScreeningPage() {
  const {
    screenings,
    stats,
    loading,
    error,
    loadScreenings,
    loadStats
  } = useScreening()

  const [filter, setFilter] = useState<ScreeningStatus | 'all'>('all')

  useEffect(() => {
    loadScreenings(filter === 'all' ? undefined : filter)
    loadStats()
  }, [filter, loadScreenings, loadStats])

  const handleFilterChange = (newFilter: ScreeningStatus | 'all') => {
    setFilter(newFilter)
  }

  if (loading && screenings.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-950 p-6 flex items-center justify-center">
        <div className="text-white">Loading screenings...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 p-6">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Resume Screening</h1>
          <p className="text-neutral-400">
            Review and evaluate candidate applications
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card className="bg-neutral-900 border-neutral-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-500/20 rounded-lg">
                    <FileText className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.total}</p>
                    <p className="text-sm text-neutral-400">Total Applications</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-neutral-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-500/20 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.pending}</p>
                    <p className="text-sm text-neutral-400">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-neutral-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-500/20 rounded-lg">
                    <Search className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.inReview}</p>
                    <p className="text-sm text-neutral-400">In Review</p>
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
                    <p className="text-2xl font-bold text-white">{stats.approved}</p>
                    <p className="text-sm text-neutral-400">Approved</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-neutral-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.averageScore}%</p>
                    <p className="text-sm text-neutral-400">Avg Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('all')}
            className={filter === 'all' ? 'bg-emerald-600' : 'border-neutral-700 text-neutral-400'}
          >
            All
          </Button>
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('pending')}
            className={filter === 'pending' ? 'bg-emerald-600' : 'border-neutral-700 text-neutral-400'}
          >
            Pending
          </Button>
          <Button
            variant={filter === 'in_review' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('in_review')}
            className={filter === 'in_review' ? 'bg-emerald-600' : 'border-neutral-700 text-neutral-400'}
          >
            In Review
          </Button>
          <Button
            variant={filter === 'approved' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('approved')}
            className={filter === 'approved' ? 'bg-emerald-600' : 'border-neutral-700 text-neutral-400'}
          >
            Approved
          </Button>
          <Button
            variant={filter === 'rejected' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('rejected')}
            className={filter === 'rejected' ? 'bg-emerald-600' : 'border-neutral-700 text-neutral-400'}
          >
            Rejected
          </Button>
        </div>

        {/* Applications List */}
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5" />
              Applications
            </CardTitle>
            <CardDescription className="text-neutral-400">
              {filter === 'all' ? 'All applications' : `Showing ${filter.replace('_', ' ')} applications`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-500/20 text-red-400 p-4 rounded-lg mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            {screenings.length === 0 ? (
              <div className="text-center py-8 text-neutral-400">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No applications found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {screenings.map((screening) => (
                  <div
                    key={screening.id}
                    className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-lg hover:bg-neutral-800 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                        <span className="text-emerald-400 font-bold">
                          {screening.candidateName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{screening.candidateName}</p>
                        <p className="text-neutral-400 text-sm">{screening.jobTitle}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {screening.score !== null && (
                        <div className="text-right">
                          <p className="text-white font-medium">{screening.score}%</p>
                          <p className="text-neutral-400 text-xs">Score</p>
                        </div>
                      )}
                      {getStatusBadge(screening.status)}
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/screening/${screening.id}`}>
                          <Eye className="w-4 h-4 text-neutral-400" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
