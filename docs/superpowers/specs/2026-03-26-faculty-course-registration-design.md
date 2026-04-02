# Faculty Directory & Course Registration System Design

> **For agentic workers:** This spec covers two features - Faculty Directory and Course Registration. Implement in phases.

## 1. Faculty Directory

### Purpose
Provide a searchable, filterable directory of faculty members organized by department.

### Architecture

**Pages:**
- `/faculty` - Main directory page with search and filters
- `/faculty/[slug]` - Individual faculty profile page (future)

**Components:**
- `FacultyCard` - Display individual faculty member (name, title, department, photo)
- `FacultySearch` - Search input for filtering by name
- `FacultyFilters` - Filter dropdowns (department, school)
- `FacultyGrid` - Responsive grid layout for faculty cards

**Data Model (new Prisma models):**
```prisma
model Department {
  id          Int       @id @default(autoincrement())
  name        String    // e.g., "Computer Science", "Electrical Engineering"
  slug        String    @unique
  school      String    // e.g., "Sciences", "Engineering"
  description String?
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
  title           String    // e.g., "Professor", "Associate Professor", "Lecturer"
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

**API Endpoints:**
- `GET /api/faculty` - List all faculty with filters
- `GET /api/faculty/[id]` - Get single faculty (future)

### Design

**Search:**
- Input field that filters faculty by name (first or last)
- Debounced search (300ms)

**Filters:**
- Department dropdown (populated from Department model)
- School dropdown (Sciences, Engineering)

**Grid Layout:**
- 3 columns on desktop, 2 on tablet, 1 on mobile
- Cards show: photo, name, title, department, research area

---

## 2. Course Registration

### Purpose
Allow students to browse courses, view prerequisites, check capacity, and register/drop courses.

### Architecture

**Pages:**
- `/student/courses` - Course catalog and registration page
- `/student/courses/my` - Student's registered courses

**Components:**
- `CourseCatalog` - Browse available courses
- `CourseCard` - Display course info (code, name, credits, schedule, capacity)
- `CourseRegistrationForm` - Add/remove courses
- `PrerequisiteWarning` - Show when prerequisites not met
- `CapacityIndicator` - Visual indicator of seats available
- `RegisteredCourses` - List of student's current courses

**Data Model (new Prisma models):**
```prisma
model Course {
  id              Int       @id @default(autoincrement())
  code            String    // e.g., "CSE 101"
  name            String
  slug            String    @unique
  description     String?   @db.Text
  credits         Int       @default(3)
  departmentId    Int
  department      Department @relation(fields: [departmentId], references: [id])
  
  // Schedule
  schedule        Json?     // Array of {day, startTime, endTime, venue}
  
  // Capacity
  maxCapacity     Int       @default(50)
  enrolledCount  Int       @default(0)
  
  // Prerequisites
  prerequisites   Json?     // Array of prerequisite course codes
  
  // Metadata
  isActive        Boolean   @default(true)
  semester        String    // e.g., "Fall 2025", "Spring 2026"
  academicYear   String    // e.g., "2025/2026"
  
  // Instructor
  instructorId    Int?
  instructor      Faculty?  @relation(fields: [instructorId], references: [id])
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model StudentRegistration {
  id              Int       @id @default(autoincrement())
  studentId       String    // Clerk user ID
  courseId        Int
  course          Course    @relation(fields: [courseId], references: [id])
  status          RegStatus @default(ENROLLED)
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

**API Endpoints:**
- `GET /api/courses` - List available courses (with filters)
- `GET /api/courses/[id]` - Get course details
- `POST /api/courses/register` - Register for a course
- `DELETE /api/courses/register/[id]` - Drop a course
- `GET /api/courses/my` - Get student's registered courses
- `POST /api/courses/prerequisites` - Check prerequisites

### Design

**Course Catalog:**
- Grid/list view of available courses
- Filter by: department, credits, semester
- Search by: course code, name
- Show: capacity indicator (e.g., "25/50 seats")

**Registration Flow:**
1. Student views course catalog
2. Clicks "Add Course" on a course
3. System checks:
   - Prerequisites met (if not, show warning but allow override)
   - Capacity available
   - No scheduling conflicts
4. If valid, add to registered courses
5. Update enrolledCount on course

**My Courses View:**
- List of currently enrolled courses
- "Drop" button for each course
- Show total credits registered

**Prerequisite Handling:**
- When adding course, fetch prerequisite course IDs
- Check if student has completed any of those courses (via StudentRegistration where status=COMPLETED)
- Show warning but don't block - let student decide

**Capacity Management:**
- Display current/max (e.g., "25/50 seats")
- Visual indicator: green (<75%), yellow (75-90%), red (>90%)
- Block registration when max reached

---

## 3. Implementation Phases

### Phase 1: Faculty Directory
1. Add Prisma models (Department, Faculty)
2. Seed initial departments (Sciences, Engineering)
3. Create API endpoints
4. Build UI components
5. Create `/faculty` page

### Phase 2: Course Registration Backend
1. Add Prisma models (Course, StudentRegistration)
2. Create API endpoints
3. Add prerequisite checking logic

### Phase 3: Course Registration UI
1. Build course catalog component
2. Build registration form
3. Build "my courses" view
4. Integrate with student dashboard

---

## 4. Existing UI Integration

The student dashboard already has:
- `CourseRegistrationTab` component showing registered courses
- `StudentSidebar` with Course Registration menu items
- Mock data structure for courses

We will:
- Replace mock data with real API calls
- Add `/student/courses` page with full registration UI
- Update sidebar to link to `/student/courses`

---

## 5. Testing Approach

- Unit tests for prerequisite checking logic
- Integration tests for registration API
- Component tests for UI components
- Manual testing of registration flow
