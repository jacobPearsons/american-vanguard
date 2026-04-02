'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/global/navbar'
import { db } from '@/lib/db'
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ArrowRight,
  GraduationCap,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface ApplicationStatus {
  id: number
  admissionType: string
  applicationTerm: string
  currentStage: string
  status: string
  firstName: string
  lastName: string
  createdAt: Date
  updatedAt: Date
}

const STAGES = [
  { key: 'PROGRAM_DISCOVERY', name: 'Program Discovery', description: 'Browse and select your program' },
  { key: 'PERSONAL_INFO', name: 'Personal Information', description: 'Complete your personal details' },
  { key: 'ACADEMIC_INFO', name: 'Academic Background', description: 'Submit your academic records' },
  { key: 'DOCUMENTS', name: 'Documents Upload', description: 'Upload required documents' },
  { key: 'REVIEW', name: 'Review & Submit', description: 'Review your application' },
  { key: 'SUBMITTED', name: 'Submitted', description: 'Application submitted successfully' },
  { key: 'UNDER_REVIEW', name: 'Under Review', description: 'Your application is being reviewed' },
  { key: 'INTERVIEW', name: 'Interview', description: 'Interview scheduled (if required)' },
  { key: 'DECISION', name: 'Decision', description: 'Admission decision released' },
]

export default function ApplicationStatusPage() {
  const { isLoaded, userId } = useAuth()
  const router = useRouter()
  const [application, setApplication] = useState<ApplicationStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push('/sign-in?redirect_url=/apply/status')
    }
  }, [isLoaded, userId, router])

  useEffect(() => {
    async function fetchApplication() {
      if (!userId) return
      
      try {
        const response = await fetch(`/api/application/status?userId=${userId}`)
        const data = await response.json()
        
        if (data.application) {
          setApplication(data.application)
        }
      } catch (error) {
        console.error('Error fetching application:', error)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchApplication()
    }
  }, [userId])

  const getStageIndex = (stage: string) => {
    return STAGES.findIndex(s => s.key === stage)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUBMITTED': return 'text-blue-400'
      case 'UNDER_REVIEW': return 'text-yellow-400'
      case 'ACCEPTED':
      case 'ENROLLED': return 'text-green-400'
      case 'REJECTED': return 'text-red-400'
      default: return 'text-neutral-400'
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className="flex flex-col min-h-screen bg-neutral-950">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="flex flex-col min-h-screen bg-neutral-950">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-24 px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">No Application Found</h2>
            <p className="text-neutral-400 mb-8">
              You haven't started an application yet. Begin your journey to American Vanguard Institute today.
            </p>
            <div className="flex flex-col gap-4">
              <Link href="/apply">
                <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-neutral-900 font-semibold">
                  Start Application
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentStageIndex = getStageIndex(application.currentStage)

  return (
    <div className="flex flex-col min-h-screen bg-neutral-950">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Application Status</h1>
            <p className="text-neutral-400">
              Track your admission application progress
            </p>
          </div>

          {/* Application Info Card */}
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">
                  {application.admissionType === 'UNDERGRADUATE' ? 'Undergraduate' : 'Graduate'} Application
                </h2>
                <p className="text-neutral-400 text-sm">
                  {application.applicationTerm.replace('_', ' ')}
                </p>
              </div>
              <div className={`px-4 py-2 rounded-full ${
                application.status === 'SUBMITTED' ? 'bg-blue-500/20' :
                application.status === 'ACCEPTED' ? 'bg-green-500/20' :
                'bg-yellow-500/20'
              }`}>
                <span className={`font-semibold ${getStatusColor(application.status)}`}>
                  {application.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-neutral-500 mb-1">Applicant Name</p>
                <p className="text-white">{application.firstName} {application.lastName}</p>
              </div>
              <div>
                <p className="text-neutral-500 mb-1">Application ID</p>
                <p className="text-white font-mono">#{application.id}</p>
              </div>
              <div>
                <p className="text-neutral-500 mb-1">Submitted</p>
                <p className="text-white">{new Date(application.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-neutral-500 mb-1">Last Updated</p>
                <p className="text-white">{new Date(application.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Progress Timeline */}
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Application Progress</h3>
            
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-neutral-800">
                <div 
                  className="w-full bg-yellow-500 transition-all duration-500"
                  style={{ height: `${Math.min(100, (currentStageIndex / (STAGES.length - 1)) * 100)}%` }}
                />
              </div>

              {/* Stages */}
              <div className="space-y-6">
                {STAGES.map((stage, index) => {
                  const isCompleted = index <= currentStageIndex
                  const isCurrent = index === currentStageIndex
                  
                  return (
                    <div key={stage.key} className="relative flex items-start gap-4 pl-2">
                      {/* Icon */}
                      <div className={`
                        relative z-10 w-12 h-12 rounded-full flex items-center justify-center
                        ${isCompleted ? 'bg-yellow-500' : 'bg-neutral-800'}
                        ${isCurrent ? 'ring-4 ring-yellow-500/30' : ''}
                      `}>
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6 text-neutral-900" />
                        ) : (
                          <span className="text-neutral-400 font-medium">{index + 1}</span>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 pt-2">
                        <h4 className={`font-medium ${isCompleted ? 'text-white' : 'text-neutral-400'}`}>
                          {stage.name}
                        </h4>
                        <p className="text-sm text-neutral-500">{stage.description}</p>
                        
                        {isCurrent && (
                          <span className="inline-flex items-center gap-1 mt-2 text-xs text-yellow-500">
                            <Clock className="w-3 h-3" />
                            In Progress
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            {application.status === 'DRAFT' && (
              <Link href="/apply" className="flex-1">
                <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-neutral-900 font-semibold">
                  Continue Application
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
            
            <Link href="/dashboard" className="flex-1">
              <Button variant="outline" className="w-full border-neutral-700 text-white hover:bg-neutral-800">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
