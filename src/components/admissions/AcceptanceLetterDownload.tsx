/**
 * Acceptance Letter Download Component
 * Purpose: Allow students to download their official acceptance letter PDF
 * 
 * Usage: Students can download their acceptance letter when they reach
 * the 'acceptance_letter' stage in the admissions flow (Step 21 in docs/flow.md)
 */

'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileDown, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface AcceptanceLetterDownloadProps {
  applicationId: number
  studentName?: string
  onDownloadSuccess?: () => void
  onDownloadError?: (error: string) => void
}

export function AcceptanceLetterDownload({
  applicationId,
  studentName,
  onDownloadSuccess,
  onDownloadError,
}: AcceptanceLetterDownloadProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isDownloaded, setIsDownloaded] = useState(false)

  const handleDownload = async () => {
    setIsLoading(true)
    setIsDownloaded(false)

    try {
      // Call the API to generate and download the acceptance letter
      const response = await fetch('/api/admissions/acceptance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ applicationId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to generate acceptance letter')
      }

      // Get the PDF blob
      const blob = await response.blob()
      
      // Create a download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `acceptance-letter-${applicationId}.pdf`
      document.body.appendChild(link)
      link.click()
      
      // Clean up
      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)
      
      setIsDownloaded(true)
      toast.success('Acceptance letter downloaded successfully!')
      onDownloadSuccess?.()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      toast.error(errorMessage)
      onDownloadError?.(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-neutral-900 rounded-lg border border-neutral-800">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-2">
          🎓 Your Acceptance Letter
        </h3>
        <p className="text-neutral-400 text-sm">
          {studentName 
            ? `Congratulations, ${studentName}! Your official acceptance letter is ready.`
            : 'Your official acceptance letter is ready for download.'}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {isDownloaded ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin text-yellow-500" />
        ) : (
          <FileDown className="h-5 w-5 text-yellow-500" />
        )}
        
        <Button
          onClick={handleDownload}
          disabled={isLoading}
          className="bg-yellow-600 hover:bg-yellow-700 text-white gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating Letter...
            </>
          ) : isDownloaded ? (
            <>
              <CheckCircle className="h-4 w-4" />
              Downloaded!
            </>
          ) : (
            <>
              <FileDown className="h-4 w-4" />
              Download Acceptance Letter
            </>
          )}
        </Button>
      </div>

      <p className="text-xs text-neutral-500">
        The acceptance letter is an official document. Please save it for your records.
      </p>
    </div>
  )
}

/**
 * Acceptance Letter Status Component
 * Shows the current status of the acceptance letter
 */
export function AcceptanceLetterStatus({
  applicationId,
}: {
  applicationId: number
}) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [letterData, setLetterData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchLetterData = async () => {
    setStatus('loading')
    setError(null)

    try {
      const response = await fetch(`/api/admissions/acceptance?applicationId=${applicationId}`)
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message)
      }

      setLetterData(data.data)
      setStatus('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch letter data')
      setStatus('error')
    }
  }

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        onClick={fetchLetterData}
        disabled={status === 'loading'}
        className="border-neutral-700 text-white hover:bg-neutral-800"
      >
        {status === 'loading' ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <FileDown className="h-4 w-4 mr-2" />
        )}
        View Letter Details
      </Button>

      {status === 'success' && letterData && (
        <div className="p-4 bg-neutral-800 rounded-lg border border-neutral-700">
          <h4 className="font-semibold text-white mb-2">Letter Details</h4>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-neutral-400">Student Name:</dt>
              <dd className="text-white">{letterData.studentName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-400">Program:</dt>
              <dd className="text-white">{letterData.programOfInterest}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-400">Major:</dt>
              <dd className="text-white">{letterData.majorFirstChoice}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-400">Acceptance Date:</dt>
              <dd className="text-white">
                {new Date(letterData.acceptanceDate).toLocaleDateString()}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-400">Enrollment Deadline:</dt>
              <dd className="text-white">
                {new Date(letterData.enrollmentDeadline).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="h-4 w-4" />
          {error || 'Failed to load letter details'}
        </div>
      )}
    </div>
  )
}

export default AcceptanceLetterDownload
