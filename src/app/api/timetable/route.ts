import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'

const TimetableEntrySchema = z.object({
  courseCode: z.string().min(1),
  courseName: z.string().min(1),
  day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']),
  startTime: z.string(),
  endTime: z.string(),
  venue: z.string(),
  instructor: z.string(),
  semester: z.string(),
})

// Mock data - replace with DB calls
const mockTimetable = [
  { id: '1', courseCode: 'EEE 501', courseName: 'Advanced Power Systems', day: 'Monday', startTime: '09:00', endTime: '11:00', venue: 'Lecture Hall 1', instructor: 'Dr. Adeyemi', semester: 'Spring 2026' },
  { id: '2', courseCode: 'EEE 501', courseName: 'Advanced Power Systems', day: 'Wednesday', startTime: '09:00', endTime: '11:00', venue: 'Lab 1', instructor: 'Dr. Adeyemi', semester: 'Spring 2026' },
  { id: '3', courseCode: 'EEE 503', courseName: 'Digital Signal Processing', day: 'Tuesday', startTime: '14:00', endTime: '16:00', venue: 'Lecture Hall 2', instructor: 'Prof. Okonkwo', semester: 'Spring 2026' },
  { id: '4', courseCode: 'EEE 503', courseName: 'Digital Signal Processing', day: 'Thursday', startTime: '14:00', endTime: '16:00', venue: 'Lab 2', instructor: 'Prof. Okonkwo', semester: 'Spring 2026' },
  { id: '5', courseCode: 'EEE 505', courseName: 'Control Systems II', day: 'Monday', startTime: '14:00', endTime: '16:00', venue: 'Lecture Hall 3', instructor: 'Dr. Ibrahim', semester: 'Spring 2026' },
  { id: '6', courseCode: 'MATH301', courseName: 'Engineering Mathematics', day: 'Tuesday', startTime: '10:00', endTime: '12:00', venue: 'Lecture Hall 1', instructor: 'Prof. Johnson', semester: 'Spring 2026' },
  { id: '7', courseCode: 'MATH301', courseName: 'Engineering Mathematics', day: 'Friday', startTime: '10:00', endTime: '12:00', venue: 'Tutorial Room 1', instructor: 'Prof. Johnson', semester: 'Spring 2026' },
]

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const day = searchParams.get('day')
    const semester = searchParams.get('semester')

    let timetable = [...mockTimetable]

    if (day) {
      timetable = timetable.filter(t => t.day === day)
    }

    if (semester) {
      timetable = timetable.filter(t => t.semester === semester)
    }

    // Group by day
    const groupedByDay = timetable.reduce((acc, entry) => {
      if (!acc[entry.day]) {
        acc[entry.day] = []
      }
      acc[entry.day].push(entry)
      return acc
    }, {} as Record<string, typeof timetable>)

    return NextResponse.json({ 
      timetable,
      groupedByDay 
    })
  } catch (error) {
    console.error('Timetable GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
