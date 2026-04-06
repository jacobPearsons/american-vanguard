# University Website UI Documentation

> Source of truth for university website UI components and types. Use this when building similar projects.

---

## Table of Contents

1. [Design System](#design-system)
2. [Main Pages](#main-pages)
3. [Core Components](#core-components)
4. [Types Reference](#types-reference)
5. [Component Patterns](#component-patterns)
6. [LMS Features](#lms-features)

---

## Design System

### Color Palette

| Token | Usage | Hex |
|-------|-------|-----|
| `bg-neutral-950` | Main background | `#0a0a0a` |
| `bg-neutral-900` | Section backgrounds | `#171717` |
| `border-neutral-800` | Card borders | `#262626` |
| `text-white` | Primary text | `#fff` |
| `text-neutral-300/400` | Secondary text | `#d4d4d4` / `#a3a3a3` |
| `text-yellow-500/600/800` | Accent color | `#eab308` |

### Typography

- **Headings**: `text-4xl md:text-5xl font-bold text-white`
- **Subheadings**: `text-3xl font-bold text-white`
- **Body**: `text-neutral-400`
- **Small**: `text-sm text-neutral-400`

### Spacing System

- Container: `container px-4 md:px-6`
- Section padding: `w-full py-20` or `py-12`
- Grid gap: `gap-6` or `gap-4`
- Card padding: `p-6 rounded-2xl`

### Border Radius

- Cards: `rounded-2xl` or `rounded-xl`
- Buttons/Inputs: `rounded-lg` or `rounded-full`
- Avatars: `rounded-full`

---

## Main Pages

### 1. About Page (`/about`)

**Hero Section:**
```tsx
<section className="w-full pt-32 pb-20 relative overflow-hidden">
  <div className="absolute inset-0 z-0">
    <Image src="/american.png" alt="..." fill className="object-cover opacity-20" />
    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-neutral-950/60" />
  </div>
  <div className="container px-4 md:px-6 relative z-10">
    <div className="max-w-3xl">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Title</h1>
      <p className="text-xl text-neutral-300">Description</p>
    </div>
  </div>
</section>
```

**Sections:**
- History (2-column with image)
- Mission & Values (4-column grid with icons)
- Leadership (3-column with circular avatars)

### 2. Academics Page (`/academics`)

**Structure:**
1. Hero Section (same pattern)
2. Program Types: 4-column grid
3. Colleges & Schools: 3-column grid with icon, description, tags
4. Academic Experience: 2-column with list + image
5. Online Learning: 3-column grid

**Tags pattern:**
```tsx
<span className="text-xs px-2 py-1 rounded-full bg-yellow-900/30 text-yellow-300">
  {program}
</span>
```

### 3. Campus Page (`/campus`)

**Sections:**
1. Student Organizations (4-column)
2. Campus Facilities (3-column with icon + description)
3. Housing (2-column with list + image)
4. Athletics (3-column)

### 4. Contact Page (`/contact`)

**Structure:**
1. Hero
2. Contact Info: 4-column grid (MapPin, Phone, Mail, Clock)
3. Form Section: 2-column (form + quick links)
4. Map Section

**Form inputs:**
```tsx
<input
  type="text"
  className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:border-yellow-500"
/>
```

### 5. Admissions Page (`/admissions`)

Uses client component wrapper with:
- Admission type selection modal
- Undergraduate/Graduate form flows
- Acceptance letter generation

### 6. Faculty Page (`/faculty`)

**Structure:**
- Search input
- Filters (department, school dropdowns)
- Grid of FacultyCard components

---

## Core Components

### Navbar

```tsx
<header className="fixed right-0 left-0 top-0 py-4 px-4 bg-black/40 backdrop-blur-lg z-[100] flex items-center border-b-[1px] border-neutral-900 justify-between">
  <aside className="flex items-center gap-3">
    <Image src="/logo.png" width={60} height={60} alt="..." className="rounded-md" />
  </aside>
  <nav className="hidden md:block">
    <ul className="flex items-center gap-6 list-none">
      <li><Link href="/">Home</Link></li>
      <li><Link href="/about">About</Link></li>
      {/* ... */}
    </ul>
  </nav>
  <aside className="flex items-center gap-4">
    <button>🔔</button>
    <Link href="/apply" className="apply-button">Apply Now</Link>
    <UserButton />
  </aside>
</header>
```

### Footer

```tsx
<footer className="w-full bg-neutral-950 border-t border-neutral-800">
  <div className="container px-4 md:px-6 py-12">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {/* Brand + Social */}
      {/* Academics Links */}
      {/* Admissions Links */}
      {/* Contact Info */}
    </div>
  </div>
</footer>
```

### Dashboard Header

```tsx
<div className="flex items-center justify-between">
  <div>
    <h1 className="text-3xl font-bold text-white">{title}</h1>
    {description && <p className="text-neutral-400 mt-1">{description}</p>}
  </div>
  {action && (
    <Link href={action.href}>
      <Button className="bg-emerald-600 hover:bg-emerald-700">
        {action.icon && <action.icon className="h-4 w-4 mr-2" />}
        {action.label}
      </Button>
    </Link>
  )}
</div>
```

### Stats Display

```tsx
// 4-column grid with icon, value, label, change
<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
  {stats.map((stat) => (
    <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50">
      <stat.icon className="h-8 w-8 text-yellow-500 mb-2" />
      <div className="text-2xl font-bold text-white">{stat.value}</div>
      <div className="text-sm text-neutral-400">{stat.label}</div>
      <div className="text-xs text-neutral-500">{stat.change}</div>
    </div>
  ))}
</div>
```

### Admin Table

```tsx
<div className="overflow-x-auto">
  <table className="w-full">
    <thead>
      <tr className="border-b border-neutral-800">
        {columns.map((col) => (
          <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">
            {col.label}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.map((item) => (
        <tr className="border-b border-neutral-800 hover:bg-neutral-800/50">
          {columns.map((col) => (
            <td className="py-3 px-4 text-white">
              {col.render ? col.render(item) : item[col.key]}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

### Notification Card

```tsx
<div className={`p-4 rounded-lg border ${
  notification.isRead 
    ? 'bg-neutral-900 border-neutral-800' 
    : 'bg-neutral-800 border-yellow-600/50'
}`}>
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <Bell className="w-4 h-4 text-yellow-600" />
      <h4 className="font-medium text-white text-sm">{title}</h4>
    </div>
    {!isRead && <span className="w-2 h-2 rounded-full bg-yellow-500" />}
  </div>
  <p className="text-sm text-neutral-400">{message}</p>
</div>
```

### Faculty Card

```tsx
<div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg">
  <div className="h-48 bg-gray-200 relative">
    {photoUrl ? <img src={photoUrl} className="w-full h-full object-cover" /> : <div>{initials}</div>}
  </div>
  <div className="p-4">
    <h3 className="font-semibold text-lg text-gray-900">{name}</h3>
    <p className="text-sm text-gray-600">{title}</p>
    <p className="text-sm text-gray-500">{department}</p>
  </div>
</div>
```

### Course Card

```tsx
<div className="bg-white rounded-lg shadow-md p-4">
  <div className="flex justify-between items-start mb-2">
    <div>
      <h3 className="font-semibold text-lg">{code}</h3>
      <p className="text-gray-600">{name}</p>
    </div>
    <span className="text-sm bg-gray-100 px-2 py-1 rounded">{credits} credits</span>
  </div>
  <div className="mb-3">
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div className={`h-2 rounded-full ${capacityColor}`} style={{ width: `${percentage}%` }} />
    </div>
  </div>
  <Button className="w-full">{isRegistered ? 'Drop' : 'Add Course'}</Button>
</div>
```

---

## Types Reference

### Dashboard Types (`src/types/dashboard.ts`)

```typescript
interface DashboardStats {
  enrolledCourses: number
  totalCredits: number
  gpa: number
  pendingPayments: number
}

interface EnrolledCourse {
  id: number
  code: string
  name: string
  credits: number
  department: string
  instructor: string
  status: 'ENROLLED' | 'DROPPED' | 'COMPLETED'
  semester: string
}

interface Grade {
  id: number
  courseCode: string
  courseName: string
  score: number
  grade: string
  semester: string
  academicYear: string
}

interface Exam {
  id: number
  courseCode: string
  courseName: string
  date: string
  time: string
  venue: string
  type: 'Midterm' | 'Final' | 'Quiz'
}

interface PaymentStatus {
  id: number | string
  amount: number
  description: string
  status: 'pending' | 'paid' | 'overdue'
  dueDate: string
  paidAt: string | null
}

interface DashboardNotification {
  id: number | string
  title: string
  message: string
  type: 'ADMISSION_RECEIVED' | 'ADMISSION_ACCEPTED' | ... | 'ENGLISH_TEST_INVITE'
  isRead: boolean
  createdAt: string
}
```

### Admission Types (`src/types/admission.ts`)

```typescript
type ApplicationTerm = 'Fall 2025' | 'Spring 2026' | 'Summer 2026' | 'Fall 2026'

interface UndergraduateFormData {
  applicationTerm: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  dateOfBirth?: string
  gender?: string
  city?: string
  state?: string
  country?: string
  citizenship?: string
  isInternational: boolean
  highSchoolName: string
  highSchoolCountry: string
  highSchoolGPA?: number
  satScore?: number
  actScore?: number
  majorFirstChoice: string
  majorSecondChoice?: string
  toeflScore?: number
  ieltsScore?: number
  essayContent: string
  extracurriculars?: string
  requestFinancialAid: boolean
  scholarshipInterest: boolean
}
```

### Component-Admission Types (`src/components/admissions/types.ts`)

```typescript
type AdmissionType = 'UNDERGRADUATE' | 'GRADUATE' | 'TRANSFER' | 'INTERNATIONAL'

type ApplicationTerm = 'FALL_2025' | 'SPRING_2026' | 'SUMMER_2026' | 'FALL_2026'

type AdmissionStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'DOCUMENTS_REQUESTED' | 'ACCEPTED' | 'REJECTED' | 'WAITLISTED' | 'DEFERRED' | 'ENROLLED'
```

### Faculty Types

```typescript
interface Department {
  id: number
  name: string
  school: string
}

interface FacultyMember {
  id: number
  firstName: string
  lastName: string
  title: string
  photoUrl?: string | null
  researchArea?: string | null
  department: { name: string; school: string }
}
```

### LMS Course Types

```typescript
interface Course {
  id: number
  code: string
  name: string
  description?: string
  credits: number
  maxCapacity: number
  enrolledCount: number
  schedule?: Schedule[]
  department: { id: number; name: string }
  instructor?: FacultyMember | null
  semester: string
  academicYear: string
  isActive: boolean
}

interface CourseModule {
  id: number
  title: string
  type: 'video' | 'document' | 'quiz' | 'assignment'
  duration?: string
  completed: boolean
  content: string
}

interface CourseProgress {
  courseId: number
  progress: number // percentage 0-100
  completedModules: number
  totalModules: number
}

interface CourseAnnouncement {
  id: number
  courseId: number
  title: string
  content: string
  publishedAt: Date
  isPinned: boolean
}
```

---

## Component Patterns

### Grid Systems

**4-column (stats, contact info):**
```tsx
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6
```

**3-column (cards, features):**
```tsx
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
```

**2-column (hero content, split sections):**
```tsx
grid grid-cols-1 lg:grid-cols-2 gap-12
```

### Card Pattern

```tsx
<div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50">
  <Icon className="h-10 w-10 text-yellow-500 mb-4" />
  <h3 className="text-lg font-semibold text-white mb-2">Title</h3>
  <p className="text-neutral-400 text-sm">Description</p>
</div>
```

### Icon Pattern

```tsx
import { IconName } from 'lucide-react'
<IconName className="h-10 w-10 text-yellow-500" />
```

### Button Patterns

**Primary (yellow):**
```tsx
<Button className="bg-yellow-600 hover:bg-yellow-700 gap-2">
  Label <ArrowRight className="h-4 w-4" />
</Button>
```

**Secondary (emerald for dashboard):**
```tsx
<Button className="bg-emerald-600 hover:bg-emerald-700">
  Label
</Button>
```

**Apply Now button:**
```tsx
<Link href="/apply" className="relative inline-flex h-10 overflow-hidden rounded-full p-[2px]">
  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(...)]" />
  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-yellow-950 px-4 py-1 text-sm font-medium text-white backdrop-blur-3xl">
    Apply Now
  </span>
</Link>
```

### Input Patterns

```tsx
<input
  type="text"
  className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:border-yellow-500"
/>

<select className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-yellow-500">
  <option value="">Select...</option>
</select>

<textarea
  rows={5}
  className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:border-yellow-500"
/>
```

---

## LMS Features

### Implementation Status

| Feature | Status | Location |
|---------|--------|----------|
| 5 pilot courses | ✅ Done | `prisma/seed.ts` |
| 100 students | ✅ Done | `prisma/seed.ts` |
| Course catalog (public) | ✅ Done | `/courses` |
| Course catalog (student) | ✅ Done | `/student/courses` |
| Search/filter | ✅ Done | `CourseFilters.tsx` |
| Progress tracking (% per course) | ✅ Done | `/student/elearning` |
| Announcements (global) | ✅ Done | Navbar bell icon |
| Announcements (course-level) | ✅ Done | `course-announcements.tsx` |
| Course preview page | ✅ Done | `/courses/[slug]` with syllabus, instructor, facilities |
| Syllabus | ✅ Done | Course model + preview page |
| Instructor bio | ✅ Done | Course preview page |
| Facility tags | ✅ Done | Course model + preview page |
| Basic forum | ✅ Done | `/student/forum`, API, forum models |

### Implementation Details

#### Course Catalog (`/student/courses`)
- Uses `CourseCatalog`, `CourseFilters`, `CourseCard` components
- Search by code/name
- Filter by department, semester
- Register/drop functionality
- API: `/api/courses`, `/api/courses/my`, `/api/courses/register`

#### E-Learning (`/student/elearning`)
- Course progress with percentage
- Module types: video, document, quiz, assignment
- Assignments with due dates and grades
- Quizzes with status (available, completed, locked)
- Upcoming deadlines sidebar

#### Missing Features (TODO)

1. **Course Preview Page** (`/courses/[slug]`)
   - Syllabus display
   - Instructor bio with photo
   - Facility/lab tags
   - Course-level announcements
   - Enrollment button

2. **Course-Level Announcements**
   - Announcements filtered by course
   - Pin/unpin functionality
   - Course-specific notifications

3. **Discussion Forum**
   - Course discussion threads
   - Post replies
   - Student interaction

4. **Public Course Catalog** (`/courses`)
   - Non-authenticated view
   - Course search without registration
   - Course preview for prospective students

5. **Seed Data**
   - 5 pilot courses
   - 100 students with registrations
   - Sample progress data

---

## File Locations

### Pages
- `/src/app/about/page.tsx`
- `/src/app/academics/page.tsx`
- `/src/app/campus/page.tsx`
- `/src/app/contact/page.tsx`
- `/src/app/admissions/page.tsx`
- `/src/app/faculty/page.tsx`
- `/src/app/courses/page.tsx` - Public course catalog
- `/src/app/courses/[slug]/page.tsx` - Course preview page

### Student LMS Pages
- `/src/app/student/courses/page.tsx` - Course registration
- `/src/app/student/courses/[id]/page.tsx` - Student course detail
- `/src/app/student/courses/[id]/content/page.tsx` - **NEW** - Course content reader with markdown
- `/src/app/student/courses/[id]/materials/page.tsx` - **NEW** - Course materials manager
- `/src/app/student/elearning/page.tsx` - E-learning with progress
- `/src/app/student/grades/page.tsx` - Grades view
- `/src/app/student/forum/page.tsx` - Discussion forum
- `/src/app/student/forum/[id]/page.tsx` - Forum thread view

### Public Course Pages
- `/src/app/courses/page.tsx` - Public course catalog
- `/src/app/courses/[slug]/page.tsx` - Course preview page
- `/src/app/courses/discover/page.tsx` - **NEW** - Extended course discovery with filters

### API Routes
- `/src/app/api/courses/route.ts` - Course catalog
- `/src/app/api/courses/[slug]/route.ts` - Single course
- `/src/app/api/courses/register/route.ts` - Course registration
- `/src/app/api/forum/threads/route.ts` - Forum threads
- `/src/app/api/forum/threads/[id]/route.ts` - Single thread
- `/src/app/api/forum/threads/[id]/posts/route.ts` - Thread replies

### LMS Pages
- `/src/app/student/courses/page.tsx` - Course registration
- `/src/app/student/elearning/page.tsx` - E-learning with progress
- `/src/app/student/grades/page.tsx` - Grades view

### Core Components
- `/src/components/global/navbar.tsx`
- `/src/components/global/footer.tsx`

### Dashboard Components
- `/src/components/dashboard/dashboard-header.tsx`
- `/src/components/dashboard/StatsDisplay.tsx`
- `/src/components/dashboard/NotificationGrid.tsx`
- `/src/components/dashboard/dashboard-section.tsx`

### Admin Components
- `/src/components/admin/AdminTable.tsx`
- `/src/components/admin/AdminModal.tsx`

### Card Components
- `/src/components/faculty/FacultyCard.tsx`
- `/src/components/courses/CourseCard.tsx`

### LMS Components
- `/src/components/courses/CourseCatalog.tsx`
- `/src/components/courses/CourseFilters.tsx`
- `/src/components/courses/CourseCard.tsx`
- `/src/components/courses/RegisteredCourses.tsx`
- `/src/components/courses/public-catalog.tsx` - Public course catalog
- `/src/components/courses/course-preview.tsx` - Course preview (syllabus, instructor, facilities)
- `/src/components/courses/course-materials.tsx` - Course materials/LMS

### E-Learning Components
- `/src/components/elearning/course-progress.tsx` - Course progress tracking
- `/src/components/elearning/student-course-detail.tsx` - Student course detail view
- `/src/components/elearning/student-schedule.tsx` - Student class schedule
- `/src/components/elearning/assignment-list.tsx` - Assignment list with status
- `/src/components/elearning/content-viewer.tsx` - **NEW** - Reader with markdown, theme, font controls
- `/src/components/elearning/material-manager.tsx` - **NEW** - Course materials browser

### Course Discovery
- `/src/components/courses/course-discover.tsx` - **NEW** - Extended filters, grid/list view, bookmarks
- `/src/components/courses/course-filters-extended.tsx` - Included in discover

### Forum Components
- `/src/components/forum/forum-list.tsx` - Forum thread list
- `/src/components/forum/forum-thread.tsx` - Single thread view with replies

### Announcement Components
- `/src/components/announcements/course-announcements.tsx` - Course-level announcements

---

*Last updated: 2026-04-06*