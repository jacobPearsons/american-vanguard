'use server'

import { db } from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'

// Get user dashboard data - simplified version
export const getDashboardData = async () => {
  try {
    const user = await currentUser()
    
    if (!user) {
      return null
    }
    
    // Find or create user in database
    let dbUser = await db.user.findFirst({
      where: {
        clerkId: user.id,
      },
    })
    
    // Create user if doesn't exist
    if (!dbUser) {
      try {
        dbUser = await db.user.create({
          data: {
            clerkId: user.id,
            email: user.emailAddresses[0]?.emailAddress || '',
            name: user.fullName || '',
            tier: 'Free',
            credits: '10',
          },
        })
      } catch (createError) {
        console.log('User creation skipped - database not migrated yet')
      }
    }
    
    // Return mock data for now since database needs migration
    return {
      user: dbUser,
      stats: {
        profileViews: 156,
        applications: 23,
        savedJobs: 12,
        interviews: 4,
      },
      recentApplications: [
        { id: 1, job: 'Senior Software Engineer', company: 'TechCorp Inc.', status: 'Interview', date: '2 days ago' },
        { id: 2, job: 'Product Designer', company: 'DesignHub', status: 'Pending', date: '3 days ago' },
        { id: 3, job: 'Data Scientist', company: 'DataMinds', status: 'Rejected', date: '5 days ago' },
      ],
      profileCompletion: 45,
    }
  } catch (error) {
    console.log('Dashboard data fetch - using mock data (database not set up)')
    return {
      user: null,
      stats: {
        profileViews: 0,
        applications: 0,
        savedJobs: 0,
        interviews: 0,
      },
      recentApplications: [],
      profileCompletion: 0,
    }
  }
}

// Get recommended jobs for user - simplified version
export const getRecommendedJobs = async () => {
  try {
    // Try to fetch from database
    const jobs = await (db as any).job?.findMany?.({
      where: {
        status: 'PUBLISHED',
        isActive: true,
      },
      take: 5,
    })
    
    if (jobs) return jobs
  } catch (error) {
    console.log('Jobs fetch - using mock data')
  }
  
  // Return mock data
  return [
    {
      id: 1,
      title: 'Full Stack Developer',
      company: 'StartupXYZ',
      location: 'Remote',
      salary: '$100k - $140k',
      tags: ['React', 'Node.js', 'TypeScript'],
    },
    {
      id: 2,
      title: 'UX Designer',
      company: 'DesignStudio',
      location: 'New York, NY',
      salary: '$90k - $120k',
      tags: ['Figma', 'UI/UX'],
    },
  ]
}

// Get user applications - simplified version
export const getUserApplications = async () => {
  try {
    const user = await currentUser()
    if (!user) return []
    
    const applications = await (db as any).jobApplication?.findMany?.({
      where: {
        userId: user.id,
      },
    })
    
    if (applications) return applications
  } catch (error) {
    console.log('Applications fetch - using mock data')
  }
  
  return []
}

// Get upcoming interviews - simplified version
export const getUpcomingInterviews = async () => {
  try {
    const user = await currentUser()
    if (!user) return []
    
    const interviews = await (db as any).interview?.findMany?.({
      where: {
        application: {
          userId: user.id,
        },
        status: 'SCHEDULED',
      },
    })
    
    if (interviews) return interviews
  } catch (error) {
    console.log('Interviews fetch - using mock data')
  }
  
  return []
}
