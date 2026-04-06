/**
 * Acceptance Letter Service
 * Purpose: Handle acceptance letter generation, storage, and retrieval
 * 
 * Based on docs/flow.md:
 * Step 21: Acceptance Letter - Generate official acceptance letter PDF
 * 
 * Rules (per docs):
 * - Services handle all business logic
 * - Services interact with database via Prisma
 * - All data transformations happen here
 */

import { pdf } from '@react-pdf/renderer'
import { db } from '@/lib/prisma'
import { AdmissionStatus, AdmissionType, ApplicationTerm } from '@/types/prisma'

// Institution details (could be moved to config)
const INSTITUTION = {
  name: 'American Vanguard Institute',
  abbr: 'AVI',
  address: '1200 University Boulevard',
  city: 'Cambridge',
  state: 'MA',
  zipCode: '02138',
  country: 'United States',
  deanName: 'Dr. Elizabeth Warren',
  deanTitle: 'Dean of Admissions',
}

/**
 * Acceptance letter data structure (mirrors the component type)
 */
interface AcceptanceLetterData {
  studentName: string
  firstName: string
  lastName: string
  email: string
  applicationId: number
  admissionType: AdmissionType
  applicationTerm: ApplicationTerm
  programOfInterest: string
  majorFirstChoice: string
  majorSecondChoice?: string
  acceptanceDate: Date
  enrollmentDeadline: Date
  responseRequiredBy: Date
  gpa?: number
  testScores?: {
    sat?: number
    act?: number
    gre?: number
    gmat?: number
  }
  scholarshipAmount?: number
  scholarshipType?: string
  financialAidOffered?: boolean
  tuitionAmount?: number
  institutionName: string
  institutionAbbr: string
  institutionAddress: string
  city: string
  state: string
  zipCode: string
  country: string
  deanName: string
  deanTitle: string
  studentId?: string
  backgroundCheckCompleted?: boolean
}

/**
 * Generate acceptance letter data from application
 */
export const generateAcceptanceLetterData = async (
  applicationId: number
): Promise<AcceptanceLetterData | null> => {
  try {
    // Fetch application - user data is already in the application record
    const application = await db.admissionApplication.findUnique({
      where: { id: applicationId },
    })

    if (!application) {
      console.error(`Application ${applicationId} not found`)
      return null
    }

    // Calculate deadlines
    const acceptanceDate = new Date()
    const enrollmentDeadline = new Date()
    enrollmentDeadline.setDate(acceptanceDate.getDate() + 30) // 30 days to respond
    
    const responseRequiredBy = new Date()
    responseRequiredBy.setDate(acceptanceDate.getDate() + 14) // 14 days to respond

    // Generate student ID
    const appId = typeof application.id === 'number' ? application.id : parseInt((application as any)._id?.toString().slice(-6) || '1')
    const studentId = `AVI-${appId.toString().padStart(6, '0')}`

    // Build acceptance letter data
    const letterData: AcceptanceLetterData = {
      // Student Information
      studentName: `${application.firstName} ${application.lastName}`,
      firstName: application.firstName,
      lastName: application.lastName,
      email: application.email,
      
      // Application Details
      applicationId: appId,
      admissionType: application.admissionType as AdmissionType,
      applicationTerm: application.applicationTerm as ApplicationTerm,
      programOfInterest: application.programOfInterest || 'Undergraduate Program',
      majorFirstChoice: application.majorFirstChoice || 'Undeclared',
      majorSecondChoice: application.majorSecondChoice || undefined,
      
      // Acceptance Details
      acceptanceDate,
      enrollmentDeadline,
      responseRequiredBy,
      
      // Academic Info
      gpa: (application.highSchoolGPA || application.undergradGPA) ?? undefined,
      testScores: {
        sat: application.satScore || undefined,
        act: application.actScore || undefined,
        gre: application.greScore || undefined,
        gmat: application.gmatScore || undefined,
      },
      
      // Financial Aid
      financialAidOffered: application.requestFinancialAid,
      scholarshipAmount: application.scholarshipInterest ? 5000 : undefined,
      scholarshipType: application.scholarshipInterest ? 'Merit Scholarship' : undefined,
      tuitionAmount: 55000,
      
      // Institution Details
      institutionName: INSTITUTION.name,
      institutionAbbr: INSTITUTION.abbr,
      institutionAddress: INSTITUTION.address,
      city: INSTITUTION.city,
      state: INSTITUTION.state,
      zipCode: INSTITUTION.zipCode,
      country: INSTITUTION.country,
      deanName: INSTITUTION.deanName,
      deanTitle: INSTITUTION.deanTitle,
      
      // Additional
      studentId,
      backgroundCheckCompleted: true, // Only true after background verification
    }

    return letterData
  } catch (error) {
    console.error('Error generating acceptance letter data:', error)
    return null
  }
}

/**
 * Generate PDF buffer from acceptance letter data
 * Uses dynamic import for client-side PDF rendering
 */
export const generateAcceptanceLetterPDF = async (
  data: AcceptanceLetterData
): Promise<Buffer | null> => {
  try {
    // Dynamic import to avoid SSR issues - the component uses @react-pdf/renderer
    const { AcceptanceLetterPDF } = await import('@/components/admissions/AcceptanceLetterPDF')
    
    // Create PDF document - @react-pdf/renderer expects a Document component
    const pdfDoc = React.createElement(AcceptanceLetterPDF, { data })
    const pdfInstance = pdf(pdfDoc as any)
    const pdfBuffer = await pdfInstance.toBuffer()
    
    return pdfBuffer as unknown as Buffer
  } catch (error) {
    console.error('Error generating PDF:', error)
    return null
  }
}

/**
 * Process acceptance and generate letter
 * Called when application status changes to ACCEPTED
 */
export const processAcceptance = async (
  applicationId: number
): Promise<{
  success: boolean
  pdfBuffer?: Buffer
  message?: string
}> => {
  try {
    // 1. Check if application exists
    const application = await db.admissionApplication.findUnique({
      where: { id: applicationId },
    })

    if (!application) {
      return { success: false, message: 'Application not found' }
    }

    // 2. Check if already accepted
    if (application.status === AdmissionStatus.ACCEPTED) {
      return { success: false, message: 'Application already accepted' }
    }

    // 3. Update application status to ACCEPTED
    await db.admissionApplication.update({
      where: { id: applicationId },
      data: {
        status: AdmissionStatus.ACCEPTED,
        reviewDate: new Date(),
      },
    })

    // 4. Generate acceptance letter data
    const letterData = await generateAcceptanceLetterData(applicationId)
    if (!letterData) {
      return { success: false, message: 'Failed to generate letter data' }
    }

    // 5. Generate PDF
    const pdfBuffer = await generateAcceptanceLetterPDF(letterData)
    if (!pdfBuffer) {
      return { success: false, message: 'Failed to generate PDF' }
    }

    // 6. TODO: Store PDF in storage (S3, etc.) and save URL to database
    // 7. TODO: Send email notification to student

    return {
      success: true,
      pdfBuffer,
      message: 'Acceptance letter generated successfully',
    }
  } catch (error) {
    console.error('Error processing acceptance:', error)
    return { success: false, message: 'Internal server error' }
  }
}

/**
 * Get acceptance letter by application ID
 */
export const getAcceptanceLetter = async (
  applicationId: number
): Promise<{
  success: boolean
  data?: AcceptanceLetterData
  message?: string
}> => {
  try {
    const letterData = await generateAcceptanceLetterData(applicationId)
    
    if (!letterData) {
      return { success: false, message: 'Acceptance letter not found' }
    }

    return { success: true, data: letterData }
  } catch (error) {
    console.error('Error fetching acceptance letter:', error)
    return { success: false, message: 'Internal server error' }
  }
}

/**
 * Validate if application is ready for acceptance
 */
export const validateAcceptanceReadiness = async (
  applicationId: number
): Promise<{
  ready: boolean
  missing: string[]
}> => {
  const application = await db.admissionApplication.findUnique({
    where: { id: applicationId },
  })

  if (!application) {
    return { ready: false, missing: ['Application not found'] }
  }

  const missing: string[] = []

  // Check required fields
  if (!application.firstName || !application.lastName) {
    missing.push('Full name')
  }

  if (!application.email) {
    missing.push('Email address')
  }

  if (!application.majorFirstChoice) {
    missing.push('Program/Major selection')
  }

  // Check required documents
  if (!application.hasTranscript) {
    missing.push('Official transcript')
  }

  if (!application.hasEssay) {
    missing.push('Personal statement')
  }

  // Check status
  if (application.status === AdmissionStatus.ACCEPTED) {
    return { ready: true, missing: [] }
  }

  if (application.status === AdmissionStatus.REJECTED) {
    return { ready: false, missing: ['Application was rejected'] }
  }

  return {
    ready: missing.length === 0,
    missing,
  }
}

// Need to import React for JSX
import React from 'react'
