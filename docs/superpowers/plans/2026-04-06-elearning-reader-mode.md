# E-Learning Platform - Course Content & Reader Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement task-by-task.

**Goal:** Implement course discovery/browse with source-out functionality and core course content reader with markdown/document rendering.

**Architecture:** 
- Course discovery with filtering by department, level, topic
- Content viewer with markdown rendering, PDF support, and progress tracking
- Reading mode with customizable preferences

**Tech Stack:** Next.js 14, Tailwind CSS, React Markdown, @react-pdf/renderer

---

## Task 1: Course Discovery & Browse

**Files:**
- Create: `src/app/courses/discover/page.tsx`
- Create: `src/components/courses/course-discover.tsx`
- Create: `src/components/courses/course-filters-extended.tsx`

- [ ] **Step 1: Create extended course filters**

```tsx
// src/components/courses/course-filters-extended.tsx
// Extended filters for course discovery:
- Department multi-select
- Course level (Undergraduate, Graduate, Doctoral)
- Topic/Tags
- Availability (Open, Full, Upcoming)
- Credits range
- Search by description keywords
```

- [ ] **Step 2: Create course discovery component**

```tsx
// src/components/courses/course-discover.tsx
// Features:
- Grid/list view toggle
- Quick preview on hover
- Save/bookmark courses
- Share course links
- Compare courses side-by-side
```

- [ ] **Step 3: Create discover page**

```tsx
// src/app/courses/discover/page.tsx
// Page with:
- Hero with search
- Featured courses carousel
- Browse by department
- Popular courses
- Upcoming courses
```

---

## Task 2: Course Content Reader

**Files:**
- Create: `src/app/student/courses/[id]/content/[moduleId]/page.tsx`
- Create: `src/components/elearning/content-viewer.tsx`
- Create: `src/components/elearning/reader-toolbar.tsx`
- Create: `src/components/elearning/reading-progress.tsx`

- [ ] **Step 1: Create content viewer component**

```tsx
// src/components/elearning/content-viewer.tsx
// Features:
- Markdown rendering
- PDF viewer integration
- Code syntax highlighting
- Image galleries
- Embedded videos
- Table of contents
- Font size adjustment
- Dark/sepia/light reading modes
- Progress tracking per section
```

- [ ] **Step 2: Create reader toolbar**

```tsx
// src/components/elearning/reader-toolbar.tsx
// Controls:
- Font size (A- to A+)
- Theme (dark, sepia, light)
- Fullscreen mode
- Table of contents toggle
- Bookmark this section
- Mark as complete
```

- [ ] **Step 3: Create reading progress component**

```tsx
// src/components/elearning/reading-progress.tsx
// Shows:
- Time spent reading
- Scroll progress percentage
- Estimated time remaining
- Completion status
```

- [ ] **Step 4: Create content page**

```tsx
// src/app/student/courses/[id]/content/[moduleId]/page.tsx
// Full page with viewer, toolbar, and progress
```

---

## Task 3: Course Material Manager

**Files:**
- Create: `src/app/student/courses/[id]/materials/page.tsx`
- Create: `src/components/elearning/material-manager.tsx`

- [ ] **Step 1: Create material manager**

```tsx
// src/components/elearning/material-manager.tsx
// Features:
- Upload materials (admin/faculty)
- Download materials
- Material categories (Lecture Notes, Readings, Assignments, References)
- Search within materials
- Recent materials quick access
```

---

**Plan saved to:** `docs/superpowers/plans/2026-04-06-elearning-reader-mode.md