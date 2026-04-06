# LMS Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the missing LMS features: public course catalog, course preview page with syllabus/instructor/facilities, basic forum, course-level announcements, and seed data for 5 pilot courses with 100 students

**Architecture:** Create new pages for public catalog and course preview. Add forum components to student dashboard. Create seed script for database. Extend announcement model for course-level filtering.

**Tech Stack:** Next.js 14, Prisma, PostgreSQL, Tailwind CSS

---

## Task 1: Public Course Catalog Page

**Files:**
- Create: `src/app/courses/page.tsx`
- Create: `src/components/courses/public-catalog.tsx` (already created)
- Modify: `src/components/global/navbar.tsx` - add link to `/courses`

- [ ] **Step 1: Add courses link to navbar**

```tsx
// In navbar.tsx nav section, add:
<li>
  <Link href="/courses" className="text-neutral-300 hover:text-white transition-colors text-sm font-medium flex items-center gap-1">
    <GraduationCap className="h-4 w-4" />
    Courses
  </Link>
</li>
```

- [ ] **Step 2: Create courses page**

```tsx
// src/app/courses/page.tsx
import Navbar from '@/components/global/navbar'
import { Footer } from '@/components/global/footer'
import { PublicCourseCatalog } from '@/components/courses/public-catalog'
import { CourseFilters } from '@/components/courses'
import { useState, useEffect } from 'react'

interface Course {
  id: number
  code: string
  name: string
  credits: number
  maxCapacity: number
  enrolledCount: number
  department: { name: string }
  instructor?: { firstName: string; lastName: string } | null
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [departmentId, setDepartmentId] = useState('all')

  useEffect(() => {
    const fetchCourses = async () => {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (departmentId !== 'all') params.set('departmentId', departmentId)
      params.set('semester', 'Fall 2025')
      
      const res = await fetch(`/api/courses?${params.toString()}`)
      const data = await res.json()
      setCourses(data.courses || [])
      setLoading(false)
    }
    fetchCourses()
  }, [search, departmentId])

  return (
    <main className="flex flex-col min-h-screen bg-neutral-950">
      <Navbar />
      <section className="pt-32 pb-12">
        <div className="container px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Course Catalog</h1>
          <p className="text-xl text-neutral-300 mb-8">Explore our course offerings</p>
          <CourseFilters
            search={search}
            departmentId={departmentId}
            semester="Fall 2025"
            onSearchChange={setSearch}
            onDepartmentChange={setDepartmentId}
            onSemesterChange={() => {}}
            departments={[]}
          />
        </div>
      </section>
      <section className="pb-20">
        <div className="container px-4 md:px-6">
          <PublicCourseCatalog courses={courses} loading={loading} />
        </div>
      </section>
      <Footer />
    </main>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/courses/page.tsx src/components/global/navbar.tsx
git commit -m "feat: add public course catalog page"
```

---

## Task 2: Course Preview Page with Syllabus, Instructor Bio, Facility Tags

**Files:**
- Create: `src/app/courses/[slug]/page.tsx`
- Create: `src/components/courses/course-preview.tsx`
- Modify: `prisma/schema.prisma` - add syllabus, facilityTags to Course

- [ ] **Step 1: Update Prisma schema**

```prisma
// In model Course, add:
syllabus        String?   @db.Text
facilityTags    String[]  // e.g., ["Computer Lab", "Engineering Workshop", "Library"]
```

- [ ] **Step 2: Create course preview component**

```tsx
// src/components/courses/course-preview.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { GraduationCap, Clock, Users, MapPin, BookOpen, User, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Course {
  id: number
  code: string
  name: string
  description: string
  credits: number
  maxCapacity: number
  enrolledCount: number
  syllabus: string | null
  facilityTags: string[]
  department: { name: string }
  instructor?: {
    firstName: string
    lastName: string
    title: string
    photoUrl?: string | null
    researchArea?: string | null
  } | null
}

export function CoursePreview() {
  const params = useParams()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/courses/${params.slug}`)
      .then(res => res.json())
      .then(data => {
        setCourse(data.course)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.slug])

  if (loading) return <div className="animate-pulse">Loading...</div>
  if (!course) return <div>Course not found</div>

  const isFull = course.enrolledCount >= course.maxCapacity

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-yellow-500 font-semibold">{course.code}</span>
            <h1 className="text-3xl font-bold text-white mt-2">{course.name}</h1>
            <p className="text-neutral-400 mt-2">{course.department.name}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-white">{course.credits}</p>
            <p className="text-neutral-400">Credits</p>
          </div>
        </div>
      </div>

      {/* Description */}
      {course.description && (
        <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
          <h2 className="text-xl font-semibold text-white mb-4">About This Course</h2>
          <p className="text-neutral-300">{course.description}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800 text-center">
          <Users className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{course.enrolledCount}</p>
          <p className="text-neutral-400 text-sm">Enrolled</p>
        </div>
        <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800 text-center">
          <MapPin className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{course.maxCapacity}</p>
          <p className="text-neutral-400 text-sm">Capacity</p>
        </div>
        <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800 text-center">
          <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">15</p>
          <p className="text-neutral-400 text-sm">Weeks</p>
        </div>
      </div>

      {/* Facility Tags */}
      {course.facilityTags && course.facilityTags.length > 0 && (
        <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
          <h2 className="text-xl font-semibold text-white mb-4">Facilities & Resources</h2>
          <div className="flex flex-wrap gap-2">
            {course.facilityTags.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-yellow-900/30 text-yellow-300 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Instructor */}
      {course.instructor && (
        <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
          <h2 className="text-xl font-semibold text-white mb-4">Instructor</h2>
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center">
              {course.instructor.photoUrl ? (
                <img src={course.instructor.photoUrl} className="w-full h-full object-cover rounded-full" />
              ) : (
                <User className="w-8 h-8 text-neutral-500" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                {course.instructor.firstName} {course.instructor.lastName}
              </h3>
              <p className="text-yellow-500">{course.instructor.title}</p>
              {course.instructor.researchArea && (
                <p className="text-neutral-400 text-sm mt-2">{course.instructor.researchArea}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Syllabus */}
      {course.syllabus && (
        <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
          <h2 className="text-xl font-semibold text-white mb-4">Syllabus</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-neutral-300 whitespace-pre-wrap">{course.syllabus}</p>
          </div>
        </div>
      )}

      {/* Enroll Button */}
      <Button 
        className="w-full bg-yellow-600 hover:bg-yellow-700 py-6 text-lg"
        disabled={isFull}
      >
        {isFull ? 'Course Full' : 'Enroll Now'}
      </Button>
    </div>
  )
}
```

- [ ] **Step 3: Create API route for single course**

```ts
// src/app/api/courses/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const course = await db.course.findUnique({
      where: { slug: params.slug },
      include: { 
        department: true, 
        instructor: true 
      }
    })
    
    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 })
    }
    
    return NextResponse.json({ course })
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
```

- [ ] **Step 4: Create page**

```tsx
// src/app/courses/[slug]/page.tsx
import Navbar from '@/components/global/navbar'
import { Footer } from '@/components/global/footer'
import { CoursePreview } from '@/components/courses/course-preview'

export default function CoursePage() {
  return (
    <main className="flex flex-col min-h-screen bg-neutral-950">
      <Navbar />
      <section className="pt-32 pb-20">
        <div className="container px-4 md:px-6">
          <CoursePreview />
        </div>
      </section>
      <Footer />
    </main>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add prisma/schema.schema src/app/courses/ src/components/courses/course-preview.tsx
git commit -m "feat: add course preview page with syllabus, instructor, facilities"
```

---

## Task 3: Basic Forum Component

**Files:**
- Create: `src/app/student/forum/page.tsx`
- Create: `src/components/forum/forum-list.tsx`
- Create: `src/components/forum/forum-thread.tsx`
- Modify: `prisma/schema.prisma` - add ForumThread, ForumPost models

- [ ] **Step 1: Update Prisma schema**

```prisma
model ForumThread {
  id          Int         @id @default(autoincrement())
  courseId    Int?
  course      Course?     @relation(fields: [courseId], references: [id])
  title       String
  content     String      @db.Text
  authorId    String
  authorName  String
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  isPinned    Boolean     @default(false)
  isLocked    Boolean     @default(false)
  posts       ForumPost[]
}

model ForumPost {
  id          Int         @id @default(autoincrement())
  threadId    Int
  thread      ForumThread @relation(fields: [threadId], references: [id])
  content     String      @db.Text
  authorId    String
  authorName  String
  createdAt   DateTime    @default(now())
}
```

- [ ] **Step 2: Create forum list component**

```tsx
// src/components/forum/forum-list.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MessageSquare, Pin, Lock, Clock } from 'lucide-react'

interface Thread {
  id: number
  title: string
  authorName: string
  createdAt: string
  isPinned: boolean
  isLocked: boolean
  postCount: number
  courseName?: string
}

export function ForumList() {
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/forum/threads')
      .then(res => res.json())
      .then(data => {
        setThreads(data.threads || [])
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-4">
      {threads.length === 0 ? (
        <div className="text-center py-12 text-neutral-400">
          <MessageSquare className="w-12 h-12 mx-auto mb-4" />
          <p>No discussions yet. Start a new thread!</p>
        </div>
      ) : (
        threads.map(thread => (
          <Link key={thread.id} href={`/student/forum/${thread.id}`}>
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 hover:border-yellow-500/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-neutral-800 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {thread.isPinned && <Pin className="w-4 h-4 text-yellow-500" />}
                    {thread.isLocked && <Lock className="w-4 h-4 text-neutral-500" />}
                    <h3 className="text-white font-semibold">{thread.title}</h3>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-neutral-400">
                    <span>{thread.authorName}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(thread.createdAt).toLocaleDateString()}
                    </span>
                    {thread.courseName && (
                      <span className="text-yellow-600">{thread.courseName}</span>
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-white">{thread.postCount}</p>
                  <p className="text-xs text-neutral-500">replies</p>
                </div>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  )
}
```

- [ ] **Step 3: Create API routes for forum**

```ts
// src/app/api/forum/threads/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const threads = await db.forumThread.findMany({
    include: { 
      course: { select: { name: true } },
      _count: { select: { posts: true } }
    },
    orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }]
  })
  
  return NextResponse.json({ 
    threads: threads.map(t => ({
      ...t,
      postCount: t._count.posts,
      courseName: t.course?.name
    }))
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  
  const thread = await db.forumThread.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: body.authorId,
      authorName: body.authorName,
      courseId: body.courseId
    }
  })
  
  return NextResponse.json({ thread }, { status: 201 })
}
```

- [ ] **Step 4: Create forum page**

```tsx
// src/app/student/forum/page.tsx
import { StudentLayout } from '@/components/features/student-dashboard'
import { ForumList } from '@/components/forum/forum-list'
import { Button } from '@/components/ui/button'
import { MessageSquare, Plus } from 'lucide-react'

export default function ForumPage() {
  return (
    <StudentLayout studentName="Student">
      <div className="min-h-screen bg-neutral-950">
        <div className="bg-neutral-900 border-b border-neutral-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-yellow-500" />
              Discussion Forum
            </h1>
            <Button className="bg-yellow-600 hover:bg-yellow-700 gap-2">
              <Plus className="w-4 h-4" />
              New Thread
            </Button>
          </div>
        </div>
        
        <div className="p-6">
          <ForumList />
        </div>
      </div>
    </StudentLayout>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add prisma/schema.prisma src/app/student/forum src/components/forum src/app/api/forum
git commit -m "feat: add basic discussion forum"
```

---

## Task 4: Course-Level Announcements

**Files:**
- Modify: `prisma/schema.prisma` - add courseId to Announcement
- Create: `src/components/announcements/course-announcements.tsx`
- Modify: `src/app/student/elearning/page.tsx` - add announcements tab

- [ ] **Step 1: Update schema**

```prisma
// In Announcement model, add:
courseId      Int?
course        Course?    @relation(fields: [courseId], references: [id])
```

- [ ] **Step 2: Create course announcements component**

```tsx
// src/components/announcements/course-announcements.tsx
'use client'

import { useState, useEffect } from 'react'
import { Bell, Pin, Clock } from 'lucide-react'

interface Announcement {
  id: number
  title: string
  content: string
  publishedAt: string
  isPinned: boolean
  type: string
}

interface CourseAnnouncementsProps {
  courseId: number
}

export function CourseAnnouncements({ courseId }: CourseAnnouncementsProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/announcements?courseId=${courseId}`)
      .then(res => res.json())
      .then(data => {
        setAnnouncements(data.announcements || [])
        setLoading(false)
      })
  }, [courseId])

  if (loading) return <div>Loading...</div>

  const pinned = announcements.filter(a => a.isPinned)
  const regular = announcements.filter(a => !a.isPinned)

  return (
    <div className="space-y-4">
      {pinned.map(a => (
        <AnnouncementCard key={a.id} announcement={a} isPinned />
      ))}
      {regular.map(a => (
        <AnnouncementCard key={a.id} announcement={a} />
      ))}
      {announcements.length === 0 && (
        <p className="text-center py-8 text-neutral-400">No announcements</p>
      )}
    </div>
  )
}

function AnnouncementCard({ announcement, isPinned = false }: { announcement: Announcement; isPinned?: boolean }) {
  return (
    <div className={`p-4 rounded-xl border ${isPinned ? 'bg-yellow-900/20 border-yellow-600/50' : 'bg-neutral-900 border-neutral-800'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {isPinned && <Pin className="w-4 h-4 text-yellow-500" />}
          <Bell className="w-4 h-4 text-yellow-600" />
          <h3 className="font-semibold text-white">{announcement.title}</h3>
        </div>
        <span className="text-xs px-2 py-1 bg-neutral-800 text-neutral-400 rounded">
          {announcement.type}
        </span>
      </div>
      <p className="text-neutral-400 text-sm mt-2">{announcement.content}</p>
      <div className="flex items-center gap-1 mt-3 text-xs text-neutral-500">
        <Clock className="w-3 h-3" />
        {new Date(announcement.publishedAt).toLocaleDateString()}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Update API to filter by course**

```ts
// In src/app/api/announcements/route.ts GET, add:
if (searchParams.get('courseId')) {
  where.courseId = parseInt(searchParams.get('courseId')!)
}
```

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma src/components/announcements/course-announcements.tsx src/app/api/announcements/route.ts
git commit -m "feat: add course-level announcements"
```

---

## Task 5: Seed Data - 5 Pilot Courses + 100 Students

**Files:**
- Create: `prisma/seed.ts`

- [ ] **Step 1: Create seed script**

```ts
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create 5 pilot courses
  const courses = await Promise.all([
    prisma.course.upsert({
      where: { slug: 'eee-501-advanced-power-systems' },
      update: {},
      create: {
        code: 'EEE 501',
        name: 'Advanced Power Systems',
        slug: 'eee-501-advanced-power-systems',
        description: 'Advanced study of power system analysis, fault analysis, and stability.',
        credits: 3,
        maxCapacity: 30,
        enrolledCount: 25,
        semester: 'Fall 2025',
        academicYear: '2025/2026',
        syllabus: 'Week 1-4: Power System Fundamentals\nWeek 5-8: Fault Analysis\nWeek 9-12: Power System Stability\nWeek 13-15: Economic Operation',
        facilityTags: ['Power Lab', 'Computer Center', 'Research Library'],
        departmentId: 1,
        isActive: true
      }
    }),
    prisma.course.upsert({
      where: { slug: 'eee-503-digital-signal-processing' },
      update: {},
      create: {
        code: 'EEE 503',
        name: 'Digital Signal Processing',
        slug: 'eee-503-digital-signal-processing',
        description: 'Theory and application of digital signal processing techniques.',
        credits: 3,
        maxCapacity: 35,
        enrolledCount: 30,
        semester: 'Fall 2025',
        academicYear: '2025/2026',
        syllabus: 'Week 1-3: Discrete Signals\nWeek 4-6: Z-Transform\nWeek 7-10: DFT and FFT\nWeek 11-15: Filter Design',
        facilityTags: ['DSP Lab', 'Computer Center'],
        departmentId: 1,
        isActive: true
      }
    }),
    prisma.course.upsert({
      where: { slug: 'eee-505-control-systems-ii' },
      update: {},
      create: {
        code: 'EEE 505',
        name: 'Control Systems II',
        slug: 'eee-505-control-systems-ii',
        description: 'Advanced control systems design and state-space methods.',
        credits: 3,
        maxCapacity: 30,
        enrolledCount: 22,
        semester: 'Fall 2025',
        academicYear: '2025/2026',
        syllabus: 'Week 1-4: State Space Analysis\nWeek 5-8: Controllability and Observability\nWeek 9-12: Design Techniques\nWeek 13-15: Optimal Control',
        facilityTags: ['Control Lab', 'Robotics Lab'],
        departmentId: 1,
        isActive: true
      }
    }),
    prisma.course.upsert({
      where: { slug: 'csc-401-data-structures' },
      update: {},
      create: {
        code: 'CSC 401',
        name: 'Data Structures',
        slug: 'csc-401-data-structures',
        description: 'Fundamental data structures and algorithmic techniques.',
        credits: 3,
        maxCapacity: 40,
        enrolledCount: 35,
        semester: 'Fall 2025',
        academicYear: '2025/2026',
        syllabus: 'Week 1-3: Arrays and Linked Lists\nWeek 4-6: Trees and Graphs\nWeek 7-10: Sorting and Searching\nWeek 11-15: Advanced Algorithms',
        facilityTags: ['Computer Lab', 'Software Lab'],
        departmentId: 2,
        isActive: true
      }
    }),
    prisma.course.upsert({
      where: { slug: 'mae-301-thermodynamics' },
      update: {},
      create: {
        code: 'MAE 301',
        name: 'Thermodynamics',
        slug: 'mae-301-thermodynamics',
        description: 'Principles of thermodynamics and heat transfer.',
        credits: 3,
        maxCapacity: 30,
        enrolledCount: 20,
        semester: 'Fall 2025',
        academicYear: '2025/2026',
        syllabus: 'Week 1-4: Basic Concepts\nWeek 5-8: First and Second Laws\nWeek 9-12: Thermodynamic Cycles\nWeek 13-15: Heat Transfer',
        facilityTags: ['Thermal Lab', 'Materials Lab'],
        departmentId: 3,
        isActive: true
      }
    })
  ])

  console.log('Created 5 pilot courses')

  // Create 100 mock students with registrations
  const studentIds = []
  for (let i = 1; i <= 100; i++) {
    const userId = `student_${i}`
    studentIds.push(userId)
    
    // Assign each student to 3-5 random courses
    const numCourses = Math.floor(Math.random() * 3) + 3
    const shuffled = [...courses].sort(() => 0.5 - Math.random())
    const selectedCourses = shuffled.slice(0, numCourses)
    
    for (const course of selectedCourses) {
      await prisma.studentRegistration.upsert({
        where: {
          studentId_courseId_academicYear_semester: {
            studentId: userId,
            courseId: course.id,
            academicYear: '2025/2026',
            semester: 'Fall 2025'
          }
        },
        update: {},
        create: {
          studentId: userId,
          courseId: course.id,
          semester: 'Fall 2025',
          academicYear: '2025/2026',
          status: 'ENROLLED'
        }
      })
    }
  }

  console.log('Created 100 students with course registrations')

  // Create some forum threads
  await prisma.forumThread.create({
    data: {
      title: 'Welcome to Fall 2025!',
      content: 'This is the official discussion forum for our courses. Feel free to ask questions and help each other out.',
      authorId: 'admin',
      authorName: 'Administrator',
      isPinned: true
    }
  })

  await prisma.forumThread.create({
    data: {
      title: 'Study group for EEE 501',
      content: 'Anyone interested in forming a study group for Advanced Power Systems?',
      authorId: 'student_1',
      authorName: 'John Doe',
      courseId: courses[0].id
    }
  })

  console.log('Created sample forum threads')

  console.log('Seed complete!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

- [ ] **Step 2: Add seed script to package.json**

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

- [ ] **Step 3: Run seed**

```bash
npx prisma db seed
```

- [ ] **Step 4: Commit**

```bash
git add prisma/seed.ts package.json
git commit -m "feat: add seed data for 5 pilot courses and 100 students"
```

---

## Summary

| Task | Files to Create/Modify |
|------|----------------------|
| 1. Public Course Catalog | `src/app/courses/page.tsx`, navbar |
| 2. Course Preview Page | `src/app/courses/[slug]/page.tsx`, `course-preview.tsx`, API route |
| 3. Basic Forum | Forum models, `forum-list.tsx`, forum pages, API |
| 4. Course Announcements | Schema, `course-announcements.tsx`, API |
| 5. Seed Data | `prisma/seed.ts` |

**Plan complete and saved to `docs/superpowers/plans/2026-04-06-lms-features.md`.**