import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'
import { db } from '@/lib/prisma'
import { validateRequest, schemas } from '@/lib/validators'

export async function POST(request: NextRequest) {
  let userId: string | null = null
  
  try {
    // Get user ID from Clerk auth - with proper error handling
    try {
      const authResult = await auth()
      userId = authResult.userId
    } catch (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json(
        { message: 'Authentication service unavailable' },
        { status: 503 }
      )
    }
    
    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized - Please sign in to submit an application' },
        { status: 401 }
      )
    }

    // Parse and validate request body using centralized validator
    let body: unknown
    try {
      body = await request.json()
    } catch (parseError) {
      return NextResponse.json(
        { message: 'Invalid request body - Please provide valid JSON' },
        { status: 400 }
      )
    }

    // Debug: Log the raw body
    console.log('[DEBUG] Raw body:', JSON.stringify(body))

    // Extract the actual data from the request body
    const bodyParsed = body as { type?: string; data?: Record<string, unknown> }
    
    if (!bodyParsed.type || !bodyParsed.data) {
      return NextResponse.json(
        { message: 'Invalid request format - missing type or data' },
        { status: 400 }
      )
    }

    const type = bodyParsed.type
    const data = bodyParsed.data
    
    // Debug: Log the extracted data
    console.log('[DEBUG] Type:', type)
    console.log('[DEBUG] Data keys:', Object.keys(data))
    console.log('[DEBUG] Data:', JSON.stringify(data))
    
    // Get the correct schema based on application type
    const admissionType = type === 'graduate' ? 'GRADUATE' : 'UNDERGRADUATE'

    // Validate required fields
    const firstName = data.firstName as string | undefined
    const lastName = data.lastName as string | undefined
    const email = data.email as string | undefined
    
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { message: 'Please fill in all required fields (first name, last name, email)' },
        { status: 400 }
      )
    }

    // Check if user already has a submitted application of this type
    const existingApplication = await db.admissionApplication.findFirst({
      where: {
        userId,
        admissionType: admissionType,
        status: { in: ['SUBMITTED', 'UNDER_REVIEW', 'ACCEPTED'] }
      }
    })

    if (existingApplication) {
      return NextResponse.json(
        { message: 'You already have a submitted application for this program type' },
        { status: 409 }
      )
    }

    // Create the admission application
    const application = await db.admissionApplication.create({
      data: {
        userId,
        admissionType: admissionType,
        applicationTerm: (data.applicationTerm as 'FALL_2025' | 'SPRING_2026' | 'SUMMER_2026' | 'FALL_2026') || 'FALL_2025',
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: (data.phone as string) || null,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth as string) : null,
        gender: (data.gender as string) || null,
        city: (data.city as string) || null,
        state: (data.state as string) || null,
        country: (data.country as string) || null,
        citizenship: (data.citizenship as string) || null,
        isInternational: (data.isInternational as boolean) || false,
        highSchoolName: (data.highSchoolName as string) || null,
        highSchoolCountry: (data.highSchoolCountry as string) || null,
        highSchoolGPA: (data.highSchoolGPA as number) || null,
        satScore: (data.satScore as number) || null,
        actScore: (data.actScore as number) || null,
        undergradSchool: (data.undergradSchool as string) || null,
        undergradDegree: (data.undergradDegree as string) || null,
        undergradMajor: (data.undergradMajor as string) || null,
        undergradGPA: (data.undergradGPA as number) || null,
        greScore: (data.greScore as number) || null,
        gmatScore: (data.gmatScore as number) || null,
        toeflScore: (data.toeflScore as number) || null,
        ieltsScore: (data.ieltsScore as number) || null,
        programOfInterest: (data.programOfInterest as string) || null,
        majorFirstChoice: (data.majorFirstChoice as string) || null,
        majorSecondChoice: (data.majorSecondChoice as string) || null,
        essayContent: (data.essayContent as string) || null,
        extracurriculars: (data.extracurriculars as string) || null,
        workExperience: (data.workExperience as string) || null,
        requestFinancialAid: (data.requestFinancialAid as boolean) || false,
        scholarshipInterest: (data.scholarshipInterest as boolean) || false,
        status: 'SUBMITTED',
        submissionDate: new Date(),
      },
    })

    return NextResponse.json(
      { 
        message: 'Application submitted successfully', 
        application: {
          id: application.id,
          admissionType: application.admissionType,
          status: application.status,
          submissionDate: application.submissionDate
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error submitting application:', error)
    
    // Handle Prisma-specific errors
    if (error instanceof Error) {
      if (error.message.includes('prisma')) {
        return NextResponse.json(
          { message: 'Database error - Please try again later' },
          { status: 503 }
        )
      }
    }
    
    return NextResponse.json(
      { message: 'Internal server error - Please try again later' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  let userId: string | null = null
  
  try {
    try {
      const authResult = await auth()
      userId = authResult.userId
    } catch (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json(
        { message: 'Authentication service unavailable' },
        { status: 503 }
      )
    }
    
    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized - Please sign in to view applications' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const applicationId = searchParams.get('id')

    if (applicationId) {
      const id = parseInt(applicationId, 10)
      
      if (isNaN(id)) {
        return NextResponse.json(
          { message: 'Invalid application ID' },
          { status: 400 }
        )
      }

      const application = await db.admissionApplication.findFirst({
        where: { id: id },
      })

      if (!application || application.userId !== userId) {
        return NextResponse.json(
          { message: 'Application not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ application })
    }

    // Get all applications for the user
    const applications = await db.admissionApplication.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        admissionType: true,
        applicationTerm: true,
        firstName: true,
        lastName: true,
        status: true,
        submissionDate: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    return NextResponse.json({ applications })
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json(
      { message: 'Internal server error - Please try again later' },
      { status: 500 }
    )
  }
}
