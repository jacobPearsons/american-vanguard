# Faculty Profiles, Campus Announcements & Dashboard Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement faculty profiles with bio/publications/courses, campus announcements modal system, and improve student dashboard with data visualization and grades view

**Architecture:** Phase 1: Faculty Profiles, Phase 2: Campus Announcements, Phase 3: Dashboard Improvements

**Tech Stack:** Next.js 14, Prisma, React, Tailwind CSS

---

## Phase 1: Faculty Profiles

### Task 1: Add Publication Model & Update Faculty Schema

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add Publication and Announcement models**

```prisma
// Add to schema.prisma (before enums):

model Publication {
  id          Int       @id @default(autoincrement())
  title       String
  journal     String?
  year        Int
  url         String?
  facultyId   Int
  faculty     Faculty   @relation(fields: [facultyId], references: [id], onDelete: Cascade)
  createdAt   DateTime  @default(now())
}

model Announcement {
  id            Int               @id @default(autoincrement())
  title         String
  content       String            @db.Text
  type          AnnouncementType
  departmentId  Int?
  department    Department?       @relation(fields: [departmentId], references: [id])
  isPinned      Boolean           @default(false)
  isActive      Boolean           @default(true)
  publishedAt   DateTime          @default(now())
  expiresAt     DateTime?
  createdAt     DateTime          @default(now())
  updatedAt     DateTime          @updatedAt
}

enum AnnouncementType {
  GENERAL
  DEPARTMENT
  DEADLINE
}
```

- [ ] **Step 2: Add new fields to Faculty model**

```prisma
// Add to Faculty model:
officeHours   String?   // e.g., "Mon/Wed 10am-12pm"
```

- [ ] **Step 3: Run Prisma generate and push**

Run: `npx prisma generate && npx prisma db push`

- [ ] **Step 4: Commit**
```bash
git add prisma/schema.prisma
git commit -m "feat: add publication, announcement models and faculty office hours"
```

---

### Task 2: Create Faculty Profile API Routes

**Files:**
- Create: `src/app/api/faculty/[id]/route.ts`
- Create: `src/app/api/publications/route.ts`
- Create: `src/app/api/announcements/route.ts`

- [ ] **Step 1: Create GET /api/faculty/[id]**
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10)
    
    const faculty = await db.faculty.findUnique({
      where: { id },
      include: {
        department: true,
        courses: {
          where: { isActive: true },
          include: { department: true }
        },
        publications: {
          orderBy: { year: 'desc' }
        }
      }
    })

    if (!faculty) {
      return NextResponse.json({ message: 'Faculty not found' }, { status: 404 })
    }

    return NextResponse.json({ faculty })
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Create POST /api/publications (for seeding)**
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, journal, year, url, facultyId } = body

    const publication = await db.publication.create({
      data: { title, journal, year, url, facultyId }
    })

    return NextResponse.json({ publication }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
```

- [ ] **Step 3: Create GET /api/announcements**
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const departmentId = searchParams.get('departmentId')

    const where: any = {
      isActive: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } }
      ]
    }

    if (type) where.type = type
    if (departmentId) where.departmentId = parseInt(departmentId, 10)

    const announcements = await db.announcement.findMany({
      where,
      include: { department: true },
      orderBy: [
        { isPinned: 'desc' },
        { publishedAt: 'desc' }
      ],
      take: 20
    })

    return NextResponse.json({ announcements })
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
```

- [ ] **Step 4: Commit**
```bash
git add src/app/api/faculty/ src/app/api/publications/ src/app/api/announcements/
git commit -m "feat: add faculty profile, publications and announcements API routes"
```

---

### Task 3: Create Faculty Profile UI Components

**Files:**
- Create: `src/components/faculty/FacultyProfile.tsx`
- Create: `src/components/faculty/PublicationsList.tsx`
- Create: `src/components/faculty/CoursesTaught.tsx`
- Create: `src/components/faculty/ContactInfo.tsx`

- [ ] **Step 1: Create FacultyProfile component**
```typescript
'use client'
import React from 'react'
import Image from 'next/image'

interface FacultyProfileProps {
  faculty: {
    id: number
    firstName: string
    lastName: string
    title: string
    photoUrl?: string | null
    bio?: string | null
    office?: string | null
    officeHours?: string | null
    department: { name: string; school: string }
    publications: Array<{ id: number; title: string; journal?: string; year: number; url?: string }>
    courses: Array<{ id: number; code: string; name: string; credits: number }>
  }
  onClose?: () => void
}

export const FacultyProfile: React.FC<FacultyProfileProps> = ({ faculty, onClose }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
      {/* Header */}
      <div className="relative h-48 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-t-lg">
        <button onClick={onClose} className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2">
          ✕
        </button>
      </div>
      
      <div className="px-6 pb-6">
        {/* Profile Photo */}
        <div className="relative -mt-16 mb-4">
          <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
            {faculty.photoUrl ? (
              <Image src={faculty.photoUrl} alt={faculty.firstName} width={128} height={128} className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
                {faculty.firstName[0]}{faculty.lastName[0]}
              </div>
            )}
          </div>
        </div>

        {/* Name & Title */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold">{faculty.firstName} {faculty.lastName}</h1>
          <p className="text-lg text-gray-600">{faculty.title}</p>
          <p className="text-gray-500">{faculty.department.name} • {faculty.department.school}</p>
        </div>

        {/* Bio */}
        {faculty.bio && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Biography</h2>
            <p className="text-gray-700">{faculty.bio}</p>
          </div>
        )}

        {/* Contact Info */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          {faculty.email && (
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-gray-900">{faculty.email}</p>
            </div>
          )}
          {faculty.phone && (
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-gray-900">{faculty.phone}</p>
            </div>
          )}
          {faculty.office && (
            <div>
              <p className="text-sm text-gray-500">Office</p>
              <p className="text-gray-900">{faculty.office}</p>
            </div>
          )}
          {faculty.officeHours && (
            <div>
              <p className="text-sm text-gray-500">Office Hours</p>
              <p className="text-gray-900">{faculty.officeHours}</p>
            </div>
          )}
        </div>

        {/* Publications */}
        {faculty.publications.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Publications</h2>
            <ul className="space-y-2">
              {faculty.publications.map((pub) => (
                <li key={pub.id} className="text-gray-700">
                  <span className="font-medium">{pub.title}</span>
                  {pub.journal && <span className="text-gray-500"> - {pub.journal}</span>}
                  <span className="text-gray-400"> ({pub.year})</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Courses Taught */}
        {faculty.courses.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Courses Taught</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {faculty.courses.map((course) => (
                <div key={course.id} className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium">{course.code}</p>
                  <p className="text-sm text-gray-600">{course.name}</p>
                  <p className="text-xs text-gray-400">{course.credits} credits</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Update FacultyCard to link to profile**

Modify `src/components/faculty/FacultyCard.tsx` to add click handler or Link to profile page.

- [ ] **Step 3: Create faculty detail page**

Create `src/app/faculty/[id]/page.tsx`:
```typescript
'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { FacultyProfile } from '@/components/faculty/FacultyProfile'

export default function FacultyDetailPage() {
  const params = useParams()
  const [faculty, setFaculty] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/faculty/${params.id}`)
      .then(res => res.json())
      .then(data => setFaculty(data.faculty))
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) return <div className="p-8">Loading...</div>
  if (!faculty) return <div>Faculty not found</div>

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <FacultyProfile faculty={faculty} />
    </div>
  )
}
```

- [ ] **Step 4: Commit**
```bash
git add src/components/faculty/ src/app/faculty/\[id\]/
git commit -m "feat: add faculty profile UI components and detail page"
```

---

## Phase 2: Campus Announcements

### Task 4: Create Announcement Modal Component

**Files:**
- Create: `src/components/announcements/AnnouncementModal.tsx`
- Create: `src/components/announcements/AnnouncementBell.tsx`
- Create: `src/components/announcements/index.ts`

- [ ] **Step 1: Create AnnouncementBell component**
```typescript
'use client'
import React, { useState, useEffect } from 'react'

interface Announcement {
  id: number
  title: string
  content: string
  type: 'GENERAL' | 'DEPARTMENT' | 'DEADLINE'
  isPinned: boolean
  publishedAt: string
}

interface AnnouncementBellProps {
  onClick: () => void
}

export const AnnouncementBell: React.FC<AnnouncementBellProps> = ({ onClick }) => {
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    fetch('/api/announcements?type=GENERAL')
      .then(res => res.json())
      .then(data => setUnread(data.announcements?.length || 0))
  }, [])

  return (
    <button onClick={onClick} className="relative p-2 hover:bg-gray-100 rounded-full">
      <span className="text-xl">🔔</span>
      {unread > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {unread}
        </span>
      )}
    </button>
  )
}
```

- [ ] **Step 2: Create AnnouncementModal component**
```typescript
'use client'
import React, { useState, useEffect } from 'react'

interface Announcement {
  id: number
  title: string
  content: string
  type: 'GENERAL' | 'DEPARTMENT' | 'DEADLINE'
  isPinned: boolean
  publishedAt: string
  department?: { name: string } | null
}

interface AnnouncementModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AnnouncementModal: React.FC<AnnouncementModalProps> = ({ isOpen, onClose }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      setLoading(true)
      fetch('/api/announcements')
        .then(res => res.json())
        .then(data => setAnnouncements(data.announcements || []))
        .finally(() => setLoading(false))
    }
  }, [isOpen])

  if (!isOpen) return null

  const filtered = filter === 'all' 
    ? announcements 
    : announcements.filter(a => a.type === filter)

  const typeColors = {
    GENERAL: 'bg-yellow-100 text-yellow-800',
    DEPARTMENT: 'bg-green-100 text-green-800',
    DEADLINE: 'bg-red-100 text-red-800'
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Announcements</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b flex gap-2">
          {['all', 'GENERAL', 'DEPARTMENT', 'DEADLINE'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-sm ${filter === f ? 'bg-yellow-600 text-white' : 'bg-gray-100'}`}
            >
              {f === 'all' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="p-4 overflow-y-auto max-h-[50vh]">
          {loading ? (
            <p className="text-center py-8">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No announcements</p>
          ) : (
            <div className="space-y-4">
              {filtered.map(ann => (
                <div key={ann.id} className={`p-4 rounded-lg ${ann.isPinned ? 'border-l-4 border-yellow-500 bg-yellow-50' : 'bg-gray-50'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{ann.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${typeColors[ann.type]}`}>
                      {ann.type}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{ann.content}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(ann.publishedAt).toLocaleDateString()}
                    {ann.department && ` • ${ann.department.name}`}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Add to Navbar**

Modify `src/components/global/navbar.tsx` to include AnnouncementBell.

- [ ] **Step 4: Commit**
```bash
git add src/components/announcements/
git commit -m "feat: add campus announcements modal system"
```

---

### Task 5: Seed Announcements

**Files:**
- Modify: `prisma/seed.ts`

- [ ] **Step 1: Add announcement seeding**

```typescript
// Add to seed.ts after courses:
await Promise.all([
  prisma.announcement.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Fall 2025 Registration Open',
      content: 'Course registration for Fall 2025 semester is now open. Please log in to register your courses.',
      type: 'DEADLINE',
      isPinned: true,
      publishedAt: new Date(),
    }
  }),
  prisma.announcement.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: 'New Computer Lab Opening',
      content: 'The department is excited to announce the opening of our new AI research lab.',
      type: 'DEPARTMENT',
      departmentId: departments[0].id,
      publishedAt: new Date(),
    }
  }),
])

console.log('Created announcements')
```

- [ ] **Step 2: Run seed**

Run: `bunx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts`

- [ ] **Step 3: Commit**
```bash
git add prisma/seed.ts
git commit -m "feat: add announcement seed data"
```

---

## Phase 3: Student Dashboard Improvements

### Task 6: Add Grades Model & API

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `src/app/api/grades/route.ts`

- [ ] **Step 1: Add Grade model**
```prisma
model Grade {
  id            Int       @id @default(autoincrement())
  studentId     String
  courseId      Int
  course        Course    @relation(fields: [courseId], references: [id])
  score         Int
  grade         String    // A, B, C, D, F
  semester      String
  academicYear  String
  createdAt     DateTime  @default(now())
  
  @@unique([studentId, courseId, semester, academicYear])
}
```

- [ ] **Step 2: Run Prisma generate and push**
Run: `npx prisma generate && npx prisma db push`

- [ ] **Step 3: Create GET /api/grades**
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  let userId: string | null = null
  try {
    const authResult = await auth()
    userId = authResult.userId
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const semester = searchParams.get('semester')
    const academicYear = searchParams.get('academicYear')

    const where: any = { studentId: userId }
    if (semester) where.semester = semester
    if (academicYear) where.academicYear = academicYear

    const grades = await db.grade.findMany({
      where,
      include: { course: true },
      orderBy: { semester: 'desc' }
    })

    // Calculate GPA
    const gradePoints: Record<string, number> = { 'A': 4.0, 'B': 3.0, 'C': 2.0, 'D': 1.0, 'F': 0.0 }
    const gpa = grades.length > 0
      ? grades.reduce((sum, g) => sum + (gradePoints[g.grade] || 0), 0) / grades.length
      : 0

    return NextResponse.json({ grades, gpa: gpa.toFixed(2) })
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
```

- [ ] **Step 4: Commit**
```bash
git add prisma/schema.prisma src/app/api/grades/
git commit -m "feat: add grades model and API"
```

---

### Task 7: Create Grades View Component

**Files:**
- Create: `src/components/dashboard/GradesView.tsx`
- Modify: `src/app/student/dashboard/page.tsx`

- [ ] **Step 1: Create GradesView component**
```typescript
'use client'
import React, { useState, useEffect } from 'react'

interface Grade {
  id: number
  score: number
  grade: string
  semester: string
  course: { code: string; name: string; credits: number }
}

export const GradesView: React.FC = () => {
  const [grades, setGrades] = useState<Grade[]>([])
  const [gpa, setGpa] = useState<string>('0.00')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/grades')
      .then(res => res.json())
      .then(data => {
        setGrades(data.grades || [])
        setGpa(data.gpa || '0.00')
      })
      .finally(() => setLoading(false))
  }, [])

  const gradeColors: Record<string, string> = {
    'A': 'bg-green-100 text-green-800',
    'B': 'bg-yellow-100 text-yellow-800',
    'C': 'bg-yellow-100 text-yellow-800',
    'D': 'bg-orange-100 text-orange-800',
    'F': 'bg-red-100 text-red-800'
  }

  if (loading) return <div className="p-4">Loading grades...</div>

  return (
    <div>
      {/* GPA Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-6 text-white mb-6">
        <p className="text-sm opacity-80">Current GPA</p>
        <p className="text-4xl font-bold">{gpa}</p>
        <p className="text-sm opacity-80 mt-2">{grades.length} courses completed</p>
      </div>

      {/* Grades Table */}
      {grades.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No grades available yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Course</th>
                <th className="px-4 py-2 text-left">Credits</th>
                <th className="px-4 py-2 text-center">Score</th>
                <th className="px-4 py-2 text-center">Grade</th>
                <th className="px-4 py-2 text-left">Semester</th>
              </tr>
            </thead>
            <tbody>
              {grades.map(grade => (
                <tr key={grade.id} className="border-t">
                  <td className="px-4 py-3">
                    <p className="font-medium">{grade.course.code}</p>
                    <p className="text-sm text-gray-500">{grade.course.name}</p>
                  </td>
                  <td className="px-4 py-3">{grade.course.credits}</td>
                  <td className="px-4 py-3 text-center">{grade.score}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded ${gradeColors[grade.grade] || 'bg-gray-100'}`}>
                      {grade.grade}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{grade.semester}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Update DashboardTabs to include Grades tab**

Modify `src/components/features/student-dashboard/DashboardTabs.tsx` to add grades tab, or create new tab in dashboard page.

- [ ] **Step 3: Commit**
```bash
git add src/components/dashboard/GradesView.tsx
git commit -m "feat: add grades view component to student dashboard"
```

---

### Task 8: Improve Dashboard Stats & Visualization

**Files:**
- Modify: `src/components/features/student-dashboard/StatsWidget.tsx`
- Modify: `src/app/student/dashboard/page.tsx`

- [ ] **Step 1: Add progress bars and better visualization**

Update StatsWidget to show:
- Fee payment progress bar
- Course registration progress
- Visual indicators for capacity

- [ ] **Step 2: Commit**
```bash
git add src/components/features/student-dashboard/
git commit -m "feat: improve dashboard stats visualization"
```

---

### Task 9: Add Grade Seed Data

**Files:**
- Modify: `prisma/seed.ts`

- [ ] **Step 1: Add grade seeding**
```typescript
// Add after announcements:
await prisma.grade.createMany({
  data: [
    { studentId: 'demo-user', courseId: 1, score: 85, grade: 'A', semester: 'Spring 2025', academicYear: '2024/2025' },
    { studentId: 'demo-user', courseId: 2, score: 78, grade: 'B', semester: 'Spring 2025', academicYear: '2024/2025' },
    { studentId: 'demo-user', courseId: 3, score: 92, grade: 'A', semester: 'Spring 2025', academicYear: '2024/2025' },
  ]
})
console.log('Created grades')
```

- [ ] **Step 2: Run seed**
Run: `bunx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts`

- [ ] **Step 3: Commit**
```bash
git add prisma/seed.ts
git commit -m "feat: add grade seed data"
```

---

## Summary

**Phase 1 - Faculty Profiles:**
- [ ] Task 1: Add Publication model & update schema
- [ ] Task 2: Create Faculty Profile API routes
- [ ] Task 3: Create Faculty Profile UI components

**Phase 2 - Campus Announcements:**
- [ ] Task 4: Create Announcement Modal component
- [ ] Task 5: Seed Announcements

**Phase 3 - Dashboard Improvements:**
- [ ] Task 6: Add Grades Model & API
- [ ] Task 7: Create Grades View Component
- [ ] Task 8: Improve Dashboard Stats & Visualization
- [ ] Task 9: Add Grade Seed Data
