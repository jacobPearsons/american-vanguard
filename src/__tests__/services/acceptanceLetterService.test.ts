/**
 * Acceptance Letter Service Tests
 * 
 * Tests for PDF generation functionality
 * Following patterns from docs/testing-infrastructure.md
 */

import { 
  generateAcceptanceLetterData, 
  generateAcceptanceLetterPDF, 
  processAcceptance, 
  getAcceptanceLetter, 
  validateAcceptanceReadiness 
} from '@/services/acceptanceLetterService'
import { db } from '@/lib/db'
import { AdmissionStatus, AdmissionType, ApplicationTerm } from '@/types/prisma'

// Mock the database
jest.mock('@/lib/db', () => ({
  db: {
    admissionApplication: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}))

// Mock @react-pdf/renderer
jest.mock('@react-pdf/renderer', () => ({
  pdf: jest.fn().mockImplementation(() => ({
    toBuffer: jest.fn().mockResolvedValue(Buffer.from('mock-pdf-buffer')),
  })),
}))

// Mock dynamic import for PDF component
jest.mock('@/components/admissions/AcceptanceLetterPDF', () => ({
  AcceptanceLetterPDF: jest.fn().mockImplementation(() => null),
}))

describe('acceptanceLetterService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('generateAcceptanceLetterData', () => {
    const mockApplication = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      admissionType: 'REGULAR' as AdmissionType,
      applicationTerm: 'FALL_2024' as ApplicationTerm,
      programOfInterest: 'Computer Science',
      majorFirstChoice: 'Computer Science',
      majorSecondChoice: 'Mathematics',
      highSchoolGPA: 3.8,
      satScore: 1400,
      actScore: 32,
      greScore: null,
      gmatScore: null,
      requestFinancialAid: true,
      scholarshipInterest: true,
      status: 'UNDER_REVIEW' as AdmissionStatus,
      user: {
        id: 'user-1',
        email: 'john.doe@example.com',
      },
    }

    it('should generate acceptance letter data from application', async () => {
      ;(db.admissionApplication.findUnique as jest.Mock).mockResolvedValue(mockApplication)

      const result = await generateAcceptanceLetterData(1)

      expect(result).toBeDefined()
      expect(result?.studentName).toBe('John Doe')
      expect(result?.firstName).toBe('John')
      expect(result?.lastName).toBe('Doe')
      expect(result?.email).toBe('john.doe@example.com')
      expect(result?.applicationId).toBe(1)
      expect(result?.programOfInterest).toBe('Computer Science')
      expect(result?.majorFirstChoice).toBe('Computer Science')
      expect(result?.gpa).toBe(3.8)
      expect(result?.testScores?.sat).toBe(1400)
      expect(result?.testScores?.act).toBe(32)
      expect(result?.financialAidOffered).toBe(true)
      expect(result?.scholarshipAmount).toBe(5000)
      expect(result?.scholarshipType).toBe('Merit Scholarship')
      expect(result?.studentId).toBe('AVI-000001')
    })

    it('should return null when application not found', async () => {
      ;(db.admissionApplication.findUnique as jest.Mock).mockResolvedValue(null)

      const result = await generateAcceptanceLetterData(999)

      expect(result).toBeNull()
    })

    it('should handle missing optional fields', async () => {
      const minimalApplication = {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        admissionType: 'TRANSFER' as AdmissionType,
        applicationTerm: 'SPRING_2024' as ApplicationTerm,
        programOfInterest: null,
        majorFirstChoice: null,
        majorSecondChoice: null,
        highSchoolGPA: null,
        undergradGPA: 3.5,
        satScore: null,
        actScore: null,
        greScore: 310,
        gmatScore: null,
        requestFinancialAid: false,
        scholarshipInterest: false,
        status: 'UNDER_REVIEW' as AdmissionStatus,
        user: {
          id: 'user-2',
          email: 'jane@example.com',
        },
      }
      ;(db.admissionApplication.findUnique as jest.Mock).mockResolvedValue(minimalApplication)

      const result = await generateAcceptanceLetterData(2)

      expect(result).toBeDefined()
      expect(result?.studentName).toBe('Jane Smith')
      expect(result?.programOfInterest).toBe('Undergraduate Program')
      expect(result?.majorFirstChoice).toBe('Undeclared')
      expect(result?.gpa).toBe(3.5)
      expect(result?.testScores?.gre).toBe(310)
      expect(result?.financialAidOffered).toBe(false)
      expect(result?.scholarshipAmount).toBeUndefined()
    })

    it('should calculate correct deadlines', async () => {
      ;(db.admissionApplication.findUnique as jest.Mock).mockResolvedValue(mockApplication)

      const result = await generateAcceptanceLetterData(1)

      expect(result).toBeDefined()
      
      const acceptanceDate = new Date(result!.acceptanceDate)
      const enrollmentDeadline = new Date(result!.enrollmentDeadline)
      const responseRequiredBy = new Date(result!.responseRequiredBy)
      
      // Enrollment deadline should be 30 days from acceptance
      const daysDiff = Math.floor((enrollmentDeadline.getTime() - acceptanceDate.getTime()) / (1000 * 60 * 60 * 24))
      expect(daysDiff).toBe(30)
      
      // Response required by should be 14 days from acceptance
      const responseDaysDiff = Math.floor((responseRequiredBy.getTime() - acceptanceDate.getTime()) / (1000 * 60 * 60 * 24))
      expect(responseDaysDiff).toBe(14)
    })
  })

  describe('generateAcceptanceLetterPDF', () => {
    const mockLetterData = {
      studentName: 'John Doe',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      applicationId: 1,
      admissionType: 'REGULAR' as AdmissionType,
      applicationTerm: 'FALL_2024' as ApplicationTerm,
      programOfInterest: 'Computer Science',
      majorFirstChoice: 'Computer Science',
      acceptanceDate: new Date(),
      enrollmentDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      responseRequiredBy: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      gpa: 3.8,
      testScores: {
        sat: 1400,
        act: 32,
      },
      financialAidOffered: true,
      scholarshipAmount: 5000,
      scholarshipType: 'Merit Scholarship',
      tuitionAmount: 55000,
      institutionName: 'American Vanguard Institute',
      institutionAbbr: 'AVI',
      institutionAddress: '1200 University Boulevard',
      city: 'Cambridge',
      state: 'MA',
      zipCode: '02138',
      country: 'United States',
      deanName: 'Dr. Elizabeth Warren',
      deanTitle: 'Dean of Admissions',
      studentId: 'AVI-000001',
      backgroundCheckCompleted: true,
    }

    it('should generate PDF buffer from letter data', async () => {
      const result = await generateAcceptanceLetterPDF(mockLetterData)

      expect(result).toBeDefined()
      expect(Buffer.isBuffer(result)).toBe(true)
    })

    it('should return null on PDF generation error', async () => {
      // Mock a failure scenario
      jest.spyOn(require('@react-pdf/renderer'), 'pdf').mockImplementationOnce(() => {
        throw new Error('PDF generation failed')
      })

      const result = await generateAcceptanceLetterPDF(mockLetterData)

      expect(result).toBeNull()
    })
  })

  describe('processAcceptance', () => {
    const mockApplication = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      admissionType: 'REGULAR' as AdmissionType,
      applicationTerm: 'FALL_2024' as ApplicationTerm,
      programOfInterest: 'Computer Science',
      majorFirstChoice: 'Computer Science',
      status: 'UNDER_REVIEW' as AdmissionStatus,
    }

    it('should process acceptance and generate PDF', async () => {
      ;(db.admissionApplication.findUnique as jest.Mock).mockResolvedValueOnce(mockApplication)
      ;(db.admissionApplication.findUnique as jest.Mock).mockResolvedValueOnce(mockApplication)
      ;(db.admissionApplication.update as jest.Mock).mockResolvedValue({
        ...mockApplication,
        status: 'ACCEPTED' as AdmissionStatus,
      })

      const result = await processAcceptance(1)

      expect(result.success).toBe(true)
      expect(result.pdfBuffer).toBeDefined()
      expect(result.message).toBe('Acceptance letter generated successfully')
      expect(db.admissionApplication.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({
          status: 'ACCEPTED',
          reviewDate: expect.any(Date),
        }),
      })
    })

    it('should reject if application not found', async () => {
      ;(db.admissionApplication.findUnique as jest.Mock).mockResolvedValue(null)

      const result = await processAcceptance(999)

      expect(result.success).toBe(false)
      expect(result.message).toBe('Application not found')
    })

    it('should reject if application already accepted', async () => {
      ;(db.admissionApplication.findUnique as jest.Mock).mockResolvedValue({
        ...mockApplication,
        status: 'ACCEPTED' as AdmissionStatus,
      })

      const result = await processAcceptance(1)

      expect(result.success).toBe(false)
      expect(result.message).toBe('Application already accepted')
    })
  })

  describe('getAcceptanceLetter', () => {
    const mockApplication = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      admissionType: 'REGULAR' as AdmissionType,
      applicationTerm: 'FALL_2024' as ApplicationTerm,
      programOfInterest: 'Computer Science',
      majorFirstChoice: 'Computer Science',
      status: 'ACCEPTED' as AdmissionStatus,
      user: {
        id: 'user-1',
        email: 'john.doe@example.com',
      },
    }

    it('should return acceptance letter data', async () => {
      ;(db.admissionApplication.findUnique as jest.Mock).mockResolvedValue(mockApplication)

      const result = await getAcceptanceLetter(1)

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(result.data?.studentName).toBe('John Doe')
    })

    it('should return failure when application not found', async () => {
      ;(db.admissionApplication.findUnique as jest.Mock).mockResolvedValue(null)

      const result = await getAcceptanceLetter(999)

      expect(result.success).toBe(false)
      expect(result.message).toBe('Acceptance letter not found')
    })
  })

  describe('validateAcceptanceReadiness', () => {
    const readyApplication = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      majorFirstChoice: 'Computer Science',
      hasTranscript: true,
      hasEssay: true,
      status: 'UNDER_REVIEW' as AdmissionStatus,
    }

    it('should return ready when all requirements met', async () => {
      ;(db.admissionApplication.findUnique as jest.Mock).mockResolvedValue(readyApplication)

      const result = await validateAcceptanceReadiness(1)

      expect(result.ready).toBe(true)
      expect(result.missing).toEqual([])
    })

    it('should return not ready when missing name', async () => {
      ;(db.admissionApplication.findUnique as jest.Mock).mockResolvedValue({
        ...readyApplication,
        firstName: '',
        lastName: '',
      })

      const result = await validateAcceptanceReadiness(1)

      expect(result.ready).toBe(false)
      expect(result.missing).toContain('Full name')
    })

    it('should return not ready when missing email', async () => {
      ;(db.admissionApplication.findUnique as jest.Mock).mockResolvedValue({
        ...readyApplication,
        email: '',
      })

      const result = await validateAcceptanceReadiness(1)

      expect(result.ready).toBe(false)
      expect(result.missing).toContain('Email address')
    })

    it('should return not ready when missing program/major', async () => {
      ;(db.admissionApplication.findUnique as jest.Mock).mockResolvedValue({
        ...readyApplication,
        majorFirstChoice: '',
      })

      const result = await validateAcceptanceReadiness(1)

      expect(result.ready).toBe(false)
      expect(result.missing).toContain('Program/Major selection')
    })

    it('should return not ready when missing transcript', async () => {
      ;(db.admissionApplication.findUnique as jest.Mock).mockResolvedValue({
        ...readyApplication,
        hasTranscript: false,
      })

      const result = await validateAcceptanceReadiness(1)

      expect(result.ready).toBe(false)
      expect(result.missing).toContain('Official transcript')
    })

    it('should return not ready when missing essay', async () => {
      ;(db.admissionApplication.findUnique as jest.Mock).mockResolvedValue({
        ...readyApplication,
        hasEssay: false,
      })

      const result = await validateAcceptanceReadiness(1)

      expect(result.ready).toBe(false)
      expect(result.missing).toContain('Personal statement')
    })

    it('should return ready when already accepted', async () => {
      ;(db.admissionApplication.findUnique as jest.Mock).mockResolvedValue({
        ...readyApplication,
        status: 'ACCEPTED' as AdmissionStatus,
      })

      const result = await validateAcceptanceReadiness(1)

      expect(result.ready).toBe(true)
      expect(result.missing).toEqual([])
    })

    it('should return not ready when rejected', async () => {
      ;(db.admissionApplication.findUnique as jest.Mock).mockResolvedValue({
        ...readyApplication,
        status: 'REJECTED' as AdmissionStatus,
      })

      const result = await validateAcceptanceReadiness(1)

      expect(result.ready).toBe(false)
      expect(result.missing).toContain('Application was rejected')
    })

    it('should return not ready when application not found', async () => {
      ;(db.admissionApplication.findUnique as jest.Mock).mockResolvedValue(null)

      const result = await validateAcceptanceReadiness(999)

      expect(result.ready).toBe(false)
      expect(result.missing).toContain('Application not found')
    })
  })

  describe('snapshots', () => {
    const mockApplication = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      admissionType: 'REGULAR' as AdmissionType,
      applicationTerm: 'FALL_2024' as ApplicationTerm,
      programOfInterest: 'Computer Science',
      majorFirstChoice: 'Computer Science',
      status: 'ACCEPTED' as AdmissionStatus,
      user: {
        id: 'user-1',
        email: 'john.doe@example.com',
      },
    }

    it('should return acceptance letter data structure', async () => {
      ;(db.admissionApplication.findUnique as jest.Mock).mockResolvedValue(mockApplication)

      const result = await generateAcceptanceLetterData(1)
      
      expect(result).toBeDefined()
      expect(result?.studentName).toBe('John Doe')
      expect(result?.applicationId).toBe(1)
      expect(result?.admissionType).toBe('REGULAR')
    })

    it('should return success structure for processAcceptance', async () => {
      ;(db.admissionApplication.findUnique as jest.Mock).mockResolvedValueOnce({
        ...mockApplication,
        status: 'UNDER_REVIEW' as AdmissionStatus,
      })
      ;(db.admissionApplication.findUnique as jest.Mock).mockResolvedValueOnce({
        ...mockApplication,
        status: 'UNDER_REVIEW' as AdmissionStatus,
      })
      ;(db.admissionApplication.update as jest.Mock).mockResolvedValue({
        ...mockApplication,
        status: 'ACCEPTED' as AdmissionStatus,
      })

      const result = await processAcceptance(1)
      
      expect(result).toHaveProperty('success', true)
      expect(result).toHaveProperty('pdfBuffer')
    })

    it('should return success structure for getAcceptanceLetter', async () => {
      ;(db.admissionApplication.findUnique as jest.Mock).mockResolvedValue(mockApplication)

      const result = await getAcceptanceLetter(1)
      
      expect(result).toHaveProperty('success', true)
      expect(result.data).toBeDefined()
    })

    it('should return ready structure for validateAcceptanceReadiness ready', async () => {
      ;(db.admissionApplication.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        majorFirstChoice: 'Computer Science',
        hasTranscript: true,
        hasEssay: true,
        status: 'UNDER_REVIEW' as AdmissionStatus,
      })

      const result = await validateAcceptanceReadiness(1)
      
      expect(result).toHaveProperty('ready', true)
      expect(result).toHaveProperty('missing')
      expect(result.missing).toEqual([])
    })

    it('should return not ready structure for validateAcceptanceReadiness', async () => {
      ;(db.admissionApplication.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        majorFirstChoice: '',
        hasTranscript: false,
        hasEssay: false,
        status: 'UNDER_REVIEW' as AdmissionStatus,
      })

      const result = await validateAcceptanceReadiness(1)
      
      expect(result).toHaveProperty('ready', false)
      expect(result.missing.length).toBeGreaterThan(0)
    })
  })
})