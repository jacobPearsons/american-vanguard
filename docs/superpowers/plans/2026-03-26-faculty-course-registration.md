# Faculty Directory & Course Registration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement faculty directory with search/filter and course registration system with prerequisites and capacity limits

**Architecture:** Two-phase implementation - Phase 1: Faculty Directory, Phase 2: Course Registration. Database models added to Prisma schema, API routes created, UI components built following existing patterns.

**Tech Stack:** Next.js 14, Prisma, PostgreSQL, React, Tailwind CSS, Radix UI

---

## Phase 1: Faculty Directory

### Task 1: Add Prisma Models for Department and Faculty

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add new models to schema**

```prisma
// ============================================
// FACULTY & DEPARTMENTS
// ============================================

model Department {
  id          Int       @id @default(autoincrement())
  name        String
  slug        String    @unique
  school      String
  description String?   @db.Text
  faculty     Faculty[]
  courses     Course[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Faculty {
  id              Int       @id @default(autoincrement())
  firstName       String
  lastName        String
  email           String?
  phone           String?
  title           String
  departmentId    Int
  department      Department @relation(fields: [departmentId], references: [id])
  photoUrl        String?
  bio             String?   @db.Text
  researchArea    String?
  office          String?
  isActive        Boolean   @default(true)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

- [ ] **Step 2: Add Course and StudentRegistration models**

```prisma
// ============================================
// COURSES & REGISTRATION
// ============================================

model Course {
  id              Int       @id @default(autoincrement())
  code            String
  name            String
  slug            String    @unique
  description     String?   @db.Text
  credits         Int       @default(3)
  departmentId    Int
  department      Department @relation(fields: [departmentId], references: [id])
  schedule        Json?
  maxCapacity     Int       @default(50)
  enrolledCount  Int       @default(0)
  prerequisites   Json?
  isActive        Boolean   @default(true)
  semester        String
  academicYear    String
  instructorId    Int?
  instructor      Faculty?  @relation(fields: [instructorId], references: [id])
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  registrations   StudentRegistration[]
}

model StudentRegistration {
  id              Int       @id @default(autoincrement())
  studentId       String
  courseId        Int
  course          Course    @relation(fields: [courseId], references: [id])
  status          RegStatus @default(ENROLLED)
  semester        String
  academicYear    String
  enrolledAt      DateTime  @default(now())
  droppedAt       DateTime?
  @@unique([studentId, courseId, academicYear, semester])
}

enum RegStatus {
  ENROLLED
  DROPPED
  COMPLETED
}
```

- [ ] **Step 3: Run Prisma generate and migrate**

Run: `npx prisma generate && npx prisma db push`

- [ ] **Step 4: Commit**
```bash
git add prisma/schema.prisma
git commit -m "feat: add department, faculty, course, and registration models"
```

---

### Task 2: Create Faculty API Routes

**Files:**
- Create: `src/app/api/faculty/route.ts`
- Create: `src/app/api/departments/route.ts`

- [ ] **Step 1: Create GET /api/faculty**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const departmentId = searchParams.get('departmentId')
    const school = searchParams.get('school')

    const where: any = { isActive: true }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (departmentId) {
      where.departmentId = parseInt(departmentId, 10)
    }

    if (school) {
      where.department = { school }
    }

    const faculty = await db.faculty.findMany({
      where,
      include: { department: true },
      orderBy: { lastName: 'asc' },
    })

    return NextResponse.json({ faculty })
  } catch (error) {
    console.error('Error fetching faculty:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Create GET /api/departments**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const school = searchParams.get('school')

    const where: any = {}
    if (school) where.school = school

    const departments = await db.department.findMany({
      where,
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({ departments })
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
```

- [ ] **Step 3: Commit**
```bash
git add src/app/api/faculty/route.ts src/app/api/departments/route.ts
git commit -m "feat: add faculty and departments API routes"
```

---

### Task 3: Create Faculty UI Components

**Files:**
- Create: `src/components/faculty/FacultyCard.tsx`
- Create: `src/components/faculty/FacultySearch.tsx`
- Create: `src/components/faculty/FacultyFilters.tsx`
- Create: `src/components/faculty/FacultyGrid.tsx`
- Create: `src/components/faculty/index.ts`

- [ ] **Step 1: Create FacultyCard**
```typescript
import React from 'react'

interface FacultyCardProps {
  faculty: {
    id: number
    firstName: string
    lastName: string
    title: string
    photoUrl?: string | null
    researchArea?: string | null
    department: { name: string; school: string }
  }
}

export const FacultyCard: React.FC<FacultyCardProps> = ({ faculty }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200 relative">
        {faculty.photoUrl ? (
          <img src={faculty.photoUrl} alt={`${faculty.firstName} ${faculty.lastName}`} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl text-gray-400">{faculty.firstName[0]}{faculty.lastName[0]}</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900">{faculty.firstName} {faculty.lastName}</h3>
        <p className="text-sm text-gray-600">{faculty.title}</p>
        <p className="text-sm text-gray-500 mt-1">{faculty.department.name}</p>
        {faculty.researchArea && <p className="text-xs text-gray-400 mt-2">{faculty.researchArea}</p>}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create FacultySearch**
```typescript
'use client'
import React, { useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'

interface FacultySearchProps {
  onSearch: (search: string) => void
}

export const FacultySearch: React.FC<FacultySearchProps> = ({ onSearch }) => {
  const [value, setValue] = useState('')
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    onSearch(e.target.value)
  }, [onSearch])

  return <Input type="text" placeholder="Search faculty by name..." value={value} onChange={handleChange} className="max-w-md" />
}
```

- [ ] **Step 3: Create FacultyFilters**
```typescript
'use client'
import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Department { id: number; name: string; school: string }

interface FacultyFiltersProps {
  departments: Department[]
  selectedDepartment: string
  selectedSchool: string
  onDepartmentChange: (id: string) => void
  onSchoolChange: (school: string) => void
}

const schools = ['Sciences', 'Engineering']

export const FacultyFilters: React.FC<FacultyFiltersProps> = ({ departments, selectedDepartment, selectedSchool, onDepartmentChange, onSchoolChange }) => {
  return (
    <div className="flex gap-4">
      <Select value={selectedSchool} onValueChange={onSchoolChange}>
        <SelectTrigger className="w-48"><SelectValue placeholder="Select School" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Schools</SelectItem>
          {schools.map((school) => <SelectItem key={school} value={school}>{school}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
        <SelectTrigger className="w-48"><SelectValue placeholder="Select Department" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Departments</SelectItem>
          {departments.map((dept) => <SelectItem key={dept.id} value={dept.id.toString()}>{dept.name}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  )
}
```

- [ ] **Step 4: Create FacultyGrid**
```typescript
import React from 'react'
import { FacultyCard } from './FacultyCard'

interface FacultyMember {
  id: number
  firstName: string
  lastName: string
  title: string
  photoUrl?: string | null
  researchArea?: string | null
  department: { name: string; school: string }
}

interface FacultyGridProps {
  faculty: FacultyMember[]
}

export const FacultyGrid: React.FC<FacultyGridProps> = ({ faculty }) => {
  if (faculty.length === 0) {
    return <div className="text-center py-12"><p className="text-gray-500">No faculty members found.</p></div>
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {faculty.map((member) => <FacultyCard key={member.id} faculty={member} />)}
    </div>
  )
}
```

- [ ] **Step 5: Create index export**
```typescript
export { FacultyCard } from './FacultyCard'
export { FacultySearch } from './FacultySearch'
export { FacultyFilters } from './FacultyFilters'
export { FacultyGrid } from './FacultyGrid'
```

- [ ] **Step 6: Commit**
```bash
git add src/components/faculty/
git commit -m "feat: add faculty UI components"
```

---

### Task 4: Create Faculty Page

**Files:**
- Create: `src/app/faculty/page.tsx`

- [ ] **Step 1: Create faculty page**

```typescript
'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { FacultySearch, FacultyFilters, FacultyGrid } from '@/components/faculty'
import { Navbar } from '@/components/global/navbar'
import { Footer } from '@/components/global/footer'

interface Department { id: number; name: string; school: string }
interface FacultyMember { id: number; firstName: string; lastName: string; title: string; photoUrl?: string | null; researchArea?: string | null; department: { name: string; school: string } }

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<FacultyMember[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [departmentId, setDepartmentId] = useState('all')
  const [school, setSchool] = useState('all')

  const fetchFaculty = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (departmentId !== 'all') params.set('departmentId', departmentId)
    if (school !== 'all') params.set('school', school)
    const res = await fetch(`/api/faculty?${params.toString()}`)
    const data = await res.json()
    setFaculty(data.faculty || [])
    setLoading(false)
  }, [search, departmentId, school])

  const fetchDepartments = useCallback(async () => {
    const res = await fetch('/api/departments')
    const data = await res.json()
    setDepartments(data.departments || [])
  }, [])

  useEffect(() => { fetchDepartments() }, [fetchDepartments])
  useEffect(() => { const t = setTimeout(() => fetchFaculty(), 300); return () => clearTimeout(t) }, [fetchFaculty])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Faculty Directory</h1>
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <FacultySearch onSearch={setSearch} />
          <FacultyFilters departments={departments} selectedDepartment={departmentId} selectedSchool={school} onDepartmentChange={setDepartmentId} onSchoolChange={setSchool} />
        </div>
        {loading ? <div className="text-center py-12"><p className="text-gray-500">Loading...</p></div> : <FacultyGrid faculty={faculty} />}
      </main>
      <Footer />
    </div>
  )
}
```

- [ ] **Step 2: Commit**
```bash
git add src/app/faculty/page.tsx
git commit -m "feat: add faculty directory page"
```

---

## Phase 2: Course Registration

### Task 5: Create Course API Routes

**Files:**
- Create: `src/app/api/courses/route.ts`
- Create: `src/app/api/courses/register/route.ts`
- Create: `src/app/api/courses/my/route.ts`

- [ ] **Step 1: Create GET /api/courses**
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const departmentId = searchParams.get('departmentId')
    const semester = searchParams.get('semester')
    const academicYear = searchParams.get('academicYear')

    const where: any = { isActive: true }

    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (departmentId && departmentId !== 'all') where.departmentId = parseInt(departmentId, 10)
    if (semester) where.semester = semester
    if (academicYear) where.academicYear = academicYear

    const courses = await db.course.findMany({
      where,
      include: { department: true, instructor: true },
      orderBy: { code: 'asc' },
    })

    return NextResponse.json({ courses })
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Create POST/DELETE /api/courses/register**
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  let userId: string | null = null
  try {
    const authResult = await auth()
    userId = authResult.userId
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { courseId, semester, academicYear } = body

    if (!courseId || !semester || !academicYear) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    const course = await db.course.findUnique({ where: { id: courseId } })
    if (!course) return NextResponse.json({ message: 'Course not found' }, { status: 404 })
    if (course.enrolledCount >= course.maxCapacity) return NextResponse.json({ message: 'Course is full' }, { status: 400 })

    const existingReg = await db.studentRegistration.findUnique({
      where: { studentId_courseId_academicYear_semester: { studentId: userId, courseId, academicYear, semester } },
    })

    if (existingReg && existingReg.status === 'ENROLLED') {
      return NextResponse.json({ message: 'Already registered for this course' }, { status: 409 })
    }

    let registration
    if (existingReg) {
      registration = await db.studentRegistration.update({ where: { id: existingReg.id }, data: { status: 'ENROLLED', droppedAt: null } })
    } else {
      registration = await db.studentRegistration.create({ data: { studentId: userId, courseId, semester, academicYear, status: 'ENROLLED' } })
    }

    await db.course.update({ where: { id: courseId }, data: { enrolledCount: { increment: 1 } } })

    return NextResponse.json({ message: 'Successfully registered', registration }, { status: 201 })
  } catch (error) {
    console.error('Error registering for course:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  let userId: string | null = null
  try {
    const authResult = await auth()
    userId = authResult.userId
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const registrationId = searchParams.get('id')
    if (!registrationId) return NextResponse.json({ message: 'Registration ID required' }, { status: 400 })

    const id = parseInt(registrationId, 10)
    const registration = await db.studentRegistration.findUnique({ where: { id } })
    if (!registration || registration.studentId !== userId) return NextResponse.json({ message: 'Registration not found' }, { status: 404 })

    const updated = await db.studentRegistration.update({ where: { id }, data: { status: 'DROPPED', droppedAt: new Date() } })
    await db.course.update({ where: { id: registration.courseId }, data: { enrolledCount: { decrement: 1 } } })

    return NextResponse.json({ message: 'Course dropped successfully', registration: updated })
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
```

- [ ] **Step 3: Create GET /api/courses/my**
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

    const where: any = { studentId: userId, status: 'ENROLLED' }
    if (semester) where.semester = semester
    if (academicYear) where.academicYear = academicYear

    const registrations = await db.studentRegistration.findMany({
      where,
      include: { course: { include: { department: true, instructor: true } } },
      orderBy: { enrolledAt: 'desc' },
    })

    return NextResponse.json({ registrations })
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
```

- [ ] **Step 4: Commit**
```bash
git add src/app/api/courses/
git commit -m "feat: add course registration API routes"
```

---

### Task 6: Create Course UI Components

**Files:**
- Create: `src/components/courses/CourseCard.tsx`
- Create: `src/components/courses/CourseCatalog.tsx`
- Create: `src/components/courses/RegisteredCourses.tsx`
- Create: `src/components/courses/CourseFilters.tsx`
- Create: `src/components/courses/index.ts`

- [ ] **Step 1: Create CourseCard**
```typescript
import React from 'react'
import { Button } from '@/components/ui/button'

interface CourseCardProps {
  course: {
    id: number; code: string; name: string; credits: number; maxCapacity: number; enrolledCount: number; schedule?: any; department: { name: string }; instructor?: { firstName: string; lastName: string } | null
  }
  isRegistered: boolean
  onRegister: (courseId: number) => void
  onDrop: (courseId: number) => void
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, isRegistered, onRegister, onDrop }) => {
  const capacityPercentage = (course.enrolledCount / course.maxCapacity) * 100
  const capacityColor = capacityPercentage < 75 ? 'bg-green-500' : capacityPercentage < 90 ? 'bg-yellow-500' : 'bg-red-500'
  const scheduleInfo = course.schedule ? (course.schedule as any[]).map((s) => `${s.day} ${s.startTime}-${s.endTime}`).join(', ') : 'TBA'

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-start mb-2">
        <div><h3 className="font-semibold text-lg">{course.code}</h3><p className="text-gray-600">{course.name}</p></div>
        <span className="text-sm bg-gray-100 px-2 py-1 rounded">{course.credits} credits</span>
      </div>
      <p className="text-sm text-gray-500 mb-2">{course.department.name}</p>
      <div className="mb-3"><p className="text-sm text-gray-600">{scheduleInfo}</p></div>
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1"><span>Capacity</span><span>{course.enrolledCount}/{course.maxCapacity}</span></div>
        <div className="w-full bg-gray-200 rounded-full h-2"><div className={`h-2 rounded-full ${capacityColor}`} style={{ width: `${capacityPercentage}%` }} /></div>
      </div>
      {isRegistered ? <Button variant="destructive" onClick={() => onDrop(course.id)} className="w-full">Drop Course</Button> : <Button onClick={() => onRegister(course.id)} disabled={course.enrolledCount >= course.maxCapacity} className="w-full">{course.enrolledCount >= course.maxCapacity ? 'Full' : 'Add Course'}</Button>}
    </div>
  )
}
```

- [ ] **Step 2: Create CourseCatalog**
```typescript
'use client'
import React from 'react'
import { CourseCard } from './CourseCard'

interface Course { id: number; code: string; name: string; credits: number; maxCapacity: number; enrolledCount: number; schedule?: any; department: { name: string }; instructor?: { firstName: string; lastName: string } | null }

interface CourseCatalogProps {
  courses: Course[]
  registeredCourseIds: number[]
  onRegister: (courseId: number) => void
  onDrop: (courseId: number) => void
}

export const CourseCatalog: React.FC<CourseCatalogProps> = ({ courses, registeredCourseIds, onRegister, onDrop }) => {
  if (courses.length === 0) return <div className="text-center py-12"><p className="text-gray-500">No courses available.</p></div>
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map((course) => <CourseCard key={course.id} course={course} isRegistered={registeredCourseIds.includes(course.id)} onRegister={onRegister} onDrop={onDrop} />)}
    </div>
  )
}
```

- [ ] **Step 3: Create RegisteredCourses**
```typescript
'use client'
import React from 'react'
import { Button } from '@/components/ui/button'

interface RegisteredCourse { id: number; course: { id: number; code: string; name: string; credits: number } }

interface RegisteredCoursesProps {
  courses: RegisteredCourse[]
  onDrop: (registrationId: number) => void
}

export const RegisteredCourses: React.FC<RegisteredCoursesProps> = ({ courses, onDrop }) => {
  const totalCredits = courses.reduce((sum, r) => sum + r.course.credits, 0)
  if (courses.length === 0) return <div className="text-center py-8"><p className="text-gray-500">No registered courses yet.</p></div>
  return (
    <div>
      <div className="mb-4 p-4 bg-yellow-50 rounded-lg"><p className="font-medium">Total Credits: <span>{totalCredits}</span></p><p className="text-sm text-gray-600">Registered Courses: <span>{courses.length}</span></p></div>
      <div className="space-y-3">
        {courses.map((reg) => (
          <div key={reg.id} className="flex justify-between items-center p-4 bg-white border rounded-lg">
            <div><p className="font-medium">{reg.course.code}</p><p className="text-sm text-gray-600">{reg.course.name}</p><p className="text-xs text-gray-500">{reg.course.credits} credits</p></div>
            <Button variant="destructive" size="sm" onClick={() => onDrop(reg.id)}>Drop</Button>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create CourseFilters**
```typescript
'use client'
import React from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Department { id: number; name: string }

interface CourseFiltersProps {
  search: string; departmentId: string; semester: string
  onSearchChange: (value: string) => void
  onDepartmentChange: (value: string) => void
  onSemesterChange: (value: string) => void
  departments: Department[]
}

export const CourseFilters: React.FC<CourseFiltersProps> = ({ search, departmentId, semester, onSearchChange, onDepartmentChange, onSemesterChange, departments }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <Input placeholder="Search courses..." value={search} onChange={(e) => onSearchChange(e.target.value)} className="max-w-xs" />
      <Select value={departmentId} onValueChange={onDepartmentChange}>
        <SelectTrigger className="w-48"><SelectValue placeholder="Department" /></SelectTrigger>
        <SelectContent><SelectItem value="all">All Departments</SelectItem>{departments.map((dept) => <SelectItem key={dept.id} value={dept.id.toString()}>{dept.name}</SelectItem>)}</SelectContent>
      </Select>
      <Select value={semester} onValueChange={onSemesterChange}>
        <SelectTrigger className="w-40"><SelectValue placeholder="Semester" /></SelectTrigger>
        <SelectContent><SelectItem value="Fall 2025">Fall 2025</SelectItem><SelectItem value="Spring 2026">Spring 2026</SelectItem></SelectContent>
      </Select>
    </div>
  )
}
```

- [ ] **Step 5: Create index export**
```typescript
export { CourseCard } from './CourseCard'
export { CourseCatalog } from './CourseCatalog'
export { RegisteredCourses } from './RegisteredCourses'
export { CourseFilters } from './CourseFilters'
```

- [ ] **Step 6: Commit**
```bash
git add src/components/courses/
git commit -m "feat: add course UI components"
```

---

### Task 7: Create Course Registration Page

**Files:**
- Create: `src/app/student/courses/page.tsx`

- [ ] **Step 1: Create student courses page**
```typescript
'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { CourseCatalog, RegisteredCourses, CourseFilters } from '@/components/courses'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Course { id: number; code: string; name: string; credits: number; maxCapacity: number; enrolledCount: number; schedule?: any; department: { name: string }; instructor?: { firstName: string; lastName: string } | null }
interface Registration { id: number; course: Course }

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [departmentId, setDepartmentId] = useState('all')
  const [semester, setSemester] = useState('Fall 2025')
  const [academicYear] = useState('2025/2026')

  const fetchCourses = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (departmentId !== 'all') params.set('departmentId', departmentId)
    params.set('semester', semester)
    params.set('academicYear', academicYear)
    const res = await fetch(`/api/courses?${params.toString()}`)
    const data = await res.json()
    setCourses(data.courses || [])
    setLoading(false)
  }, [search, departmentId, semester, academicYear])

  const fetchMyCourses = useCallback(async () => {
    const params = new URLSearchParams()
    params.set('semester', semester)
    params.set('academicYear', academicYear)
    const res = await fetch(`/api/courses/my?${params.toString()}`)
    const data = await res.json()
    setRegistrations(data.registrations || [])
  }, [semester, academicYear])

  useEffect(() => { fetchCourses() }, [fetchCourses])
  useEffect(() => { fetchMyCourses() }, [fetchMyCourses])

  const handleRegister = async (courseId: number) => {
    const res = await fetch('/api/courses/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ courseId, semester, academicYear }) })
    if (res.ok) { fetchCourses(); fetchMyCourses() }
  }

  const handleDrop = async (registrationId: number) => {
    const res = await fetch(`/api/courses/register?id=${registrationId}`, { method: 'DELETE' })
    if (res.ok) { fetchCourses(); fetchMyCourses() }
  }

  const registeredCourseIds = registrations.map((r) => r.course.id)

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Course Registration</h1>
        <Tabs defaultValue="catalog">
          <TabsList>
            <TabsTrigger value="catalog">Course Catalog</TabsTrigger>
            <TabsTrigger value="my">My Courses ({registrations.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="catalog">
            <div className="mb-6"><CourseFilters search={search} departmentId={departmentId} semester={semester} onSearchChange={setSearch} onDepartmentChange={setDepartmentId} onSemesterChange={setSemester} departments={[]} /></div>
            {loading ? <div className="text-center py-12"><p className="text-gray-500">Loading courses...</p></div> : <CourseCatalog courses={courses} registeredCourseIds={registeredCourseIds} onRegister={handleRegister} onDrop={(id) => handleDrop(id)} />}
          </TabsContent>
          <TabsContent value="my"><RegisteredCourses courses={registrations} onDrop={handleDrop} /></TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**
```bash
git add src/app/student/courses/page.tsx
git commit -m "feat: add student course registration page"
```

---

### Task 8: Seed Database with Initial Data

**Files:**
- Create: `prisma/seed.ts`

- [ ] **Step 1: Create seed script**

```typescript
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const departments = await Promise.all([
    prisma.department.upsert({ where: { slug: 'computer-science' }, update: {}, create: { name: 'Computer Science', slug: 'computer-science', school: 'Sciences', description: 'Department of Computer Science' } }),
    prisma.department.upsert({ where: { slug: 'electrical-engineering' }, update: {}, create: { name: 'Electrical Engineering', slug: 'electrical-engineering', school: 'Engineering', description: 'Department of Electrical Engineering' } }),
    prisma.department.upsert({ where: { slug: 'mechanical-engineering' }, update: {}, create: { name: 'Mechanical Engineering', slug: 'mechanical-engineering', school: 'Engineering', description: 'Department of Mechanical Engineering' } }),
    prisma.department.upsert({ where: { slug: 'physics' }, update: {}, create: { name: 'Physics', slug: 'physics', school: 'Sciences', description: 'Department of Physics' } }),
  ])

  const faculty = await Promise.all([
    prisma.faculty.upsert({ where: { id: 1 }, update: {}, create: { firstName: 'John', lastName: 'Smith', title: 'Professor', email: 'john.smith@university.edu', departmentId: departments[0].id, researchArea: 'Artificial Intelligence', office: 'Room 301' } }),
    prisma.faculty.upsert({ where: { id: 2 }, update: {}, create: { firstName: 'Sarah', lastName: 'Johnson', title: 'Associate Professor', email: 'sarah.johnson@university.edu', departmentId: departments[1].id, researchArea: 'Power Systems', office: 'Room 205' } }),
    prisma.faculty.upsert({ where: { id: 3 }, update: {}, create: { firstName: 'Michael', lastName: 'Chen', title: 'Lecturer', email: 'michael.chen@university.edu', departmentId: departments[0].id, researchArea: 'Machine Learning', office: 'Room 410' } }),
  ])

  await Promise.all([
    prisma.course.upsert({ where: { slug: 'cse-101' }, update: {}, create: { code: 'CSE 101', name: 'Introduction to Computer Science', slug: 'cse-101', credits: 3, departmentId: departments[0].id, maxCapacity: 50, semester: 'Fall 2025', academicYear: '2025/2026', schedule: [{ day: 'Monday', startTime: '09:00', endTime: '11:00', venue: 'LT 1' }], instructorId: faculty[0].id } }),
    prisma.course.upsert({ where: { slug: 'eee-201' }, update: {}, create: { code: 'EEE 201', name: 'Circuit Analysis', slug: 'eee-201', credits: 4, departmentId: departments[1].id, maxCapacity: 40, semester: 'Fall 2025', academicYear: '2025/2026', schedule: [{ day: 'Tuesday', startTime: '11:00', endTime: '13:00', venue: 'LT 2' }], instructorId: faculty[1].id } }),
    prisma.course.upsert({ where: { slug: 'cse-202' }, update: {}, create: { code: 'CSE 202', name: 'Data Structures', slug: 'cse-202', credits: 3, departmentId: departments[0].id, maxCapacity: 45, semester: 'Fall 2025', academicYear: '2025/2026', schedule: [{ day: 'Monday', startTime: '14:00', endTime: '16:00', venue: 'Lab 1' }], instructorId: faculty[2].id, prerequisites: ['cse-101'] } }),
  ])

  console.log('Seed completed successfully!')
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(async () => { await prisma.$disconnect() })
```

- [ ] **Step 2: Run seed**

Run: `npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts`

- [ ] **Step 3: Commit**
```bash
git add prisma/seed.ts
git commit -m "feat: add database seed script"
```

---

## Summary

**Phase 1 - Faculty Directory:**
- [ ] Task 1: Prisma models (Department, Faculty, Course, StudentRegistration)
- [ ] Task 2: Faculty API routes  
- [ ] Task 3: Faculty UI components
- [ ] Task 4: Faculty page

**Phase 2 - Course Registration:**
- [ ] Task 5: Course API routes
- [ ] Task 6: Course UI components
- [ ] Task 7: Course registration page
- [ ] Task 8: Seed database
