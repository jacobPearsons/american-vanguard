# Comprehensive Code Quality Refactor - Design Document

**Date:** 2026-04-02  
**Project:** American Vanguard Institute (AVI)  
**Type:** Refactoring / Code Quality Improvement

---

## Executive Summary

This document outlines a comprehensive refactoring plan to address code quality issues identified in the AVI codebase. The refactor focuses on four main areas: theme consistency, component modularization, database layer improvements, and shared component creation.

---

## Current State Analysis

### Technology Stack
- Next.js 14 (App Router)
- Clerk Authentication
- MongoDB with Mongoose ORM
- Tailwind CSS + Radix UI
- Framer Motion for animations

### Existing Architecture (Good)
- ✅ Services layer (`src/services/`)
- ✅ Hooks layer (`src/hooks/`)
- ✅ Types layer (`src/types/`)
- ✅ Animations layer (`src/animations/`)

### Issues Identified

| Issue | File(s) | Severity | Lines Affected |
|-------|---------|----------|-----------------|
| Theme Inconsistency | `src/app/admin/*` | High | All admin pages |
| Component Size Violation | `DashboardClient.tsx` | High | 369 lines |
| Monolithic Database Layer | `db.ts` | Medium | 828 lines |
| Code Duplication | Admin pages | Medium | Multiple |

---

## Phase 1: Admin Theme Consistency

### Goal
Unify the visual design across all admin pages to match the dark theme of the main application.

### Changes

1. **Create AdminLayout Component**
   - Wraps all admin pages
   - Provides consistent dark background (`bg-neutral-950`)
   - Includes navigation sidebar

2. **Update Admin Pages**
   - `/admin/announcements`
   - `/admin/courses`
   - `/admin/exams`
   - `/admin/grades`

### New Components

```typescript
// src/components/admin/AdminLayout.tsx
- Wraps content in dark container
- Provides consistent padding/margins
- Includes optional sidebar
```

---

## Phase 2: Dashboard Component Split

### Goal
Reduce `DashboardClient.tsx` from 369 lines to under 200 lines by extracting focused sub-components.

### New Component Structure

```
src/components/dashboard/
├── DashboardClient.tsx        # Orchestrator (~80 lines)
├── QuickActions.tsx           # Quick action grid (~40 lines)
├── EnrolledCoursesList.tsx   # Course cards (~50 lines)
├── RecentGradesList.tsx      # Grade display (~50 lines)
├── PaymentStatusList.tsx     # Payment status (~50 lines)
├── UpcomingExamsList.tsx    # Exam schedule (~50 lines)
├── NotificationGrid.tsx      # Notifications (~50 lines)
├── StatsDisplay.tsx          # Stats tiles (~30 lines)
└── index.ts                  # Barrel exports
```

### Component Responsibilities

| Component | Purpose | Props |
|-----------|---------|-------|
| `DashboardClient` | Orchestrates all sub-components, handles loading/error states | `userId`, `userName` |
| `QuickActions` | Renders grid of quick action links | - |
| `EnrolledCoursesList` | Displays enrolled courses | `courses[]` |
| `RecentGradesList` | Displays recent grades with colors | `grades[]` |
| `PaymentStatusList` | Shows payment statuses | `payments[]` |
| `UpcomingExamsList` | Shows exam schedule | `exams[]` |
| `NotificationGrid` | Displays notification cards | `notifications[]` |
| `StatsDisplay` | Shows stats tiles | `stats[]` |

---

## Phase 3: Database Layer Modularization

### Goal
Split the monolithic `db.ts` (828 lines) into modular, per-model files.

### New Directory Structure

```
src/lib/db/
├── index.ts              # Main export (~50 lines)
├── connection.ts        # MongoDB connection logic
├── users.ts              # User model operations
├── admissions.ts         # AdmissionApplication operations
├── courses.ts            # Course operations
├── grades.ts            # Grade operations
├── payments.ts           # Payment operations
├── notifications.ts      # Notification operations
├── faculty.ts           # Faculty operations
├── departments.ts        # Department operations
├── registrations.ts     # StudentRegistration operations
├── announcements.ts     # Announcement operations
├── programs.ts          # Program operations
└── utils.ts             # Shared query utilities
```

### Migration Strategy
1. Create new directory structure
2. Move each model to its own file
3. Update imports in all consuming files
4. Remove original `db.ts`

---

## Phase 4: Shared Admin Components

### Goal
Create reusable components to eliminate duplication across admin pages.

### New Components

```
src/components/admin/
├── AdminLayout.tsx       # Page wrapper
├── AdminCard.tsx         # Content card
├── AdminTable.tsx        # Data table
├── AdminModal.tsx        # Modal dialog
├── AdminStats.tsx        # Statistics
├── AdminHeader.tsx       # Page header
├── AdminSearch.tsx       # Search input
├── AdminFilter.tsx       # Filter dropdown
└── index.ts              # Barrel exports
```

### Component Specifications

#### AdminLayout
- Props: `title`, `description`, `children`
- Dark background container
- Consistent spacing

#### AdminCard
- Props: `title`, `children`, `className`
- Card with optional title
- Dark border styling

#### AdminTable
- Props: `data[]`, `columns[]`, `onRowClick`
- Sortable columns
- Pagination support

#### AdminModal
- Props: `open`, `onClose`, `title`, `children`
- Overlay backdrop
- Close on escape

---

## Implementation Order

1. **Phase 1:** Admin Theme Consistency
   - Quick win
   - Establishes patterns for later phases

2. **Phase 2:** Dashboard Component Split
   - Follows established patterns
   - Most visible improvement

3. **Phase 3:** Database Modularization
   - Technical refactoring
   - Improves maintainability

4. **Phase 4:** Shared Admin Components
   - Final polish
   - Reduces future duplication

---

## Testing Requirements

- All existing tests must pass
- Manual testing of admin pages
- Verify dashboard functionality
- Check database operations

---

## Success Criteria

| Metric | Before | After |
|--------|--------|-------|
| DashboardClient lines | 369 | <200 |
| db.ts lines | 828 | ~50 (modular) |
| Admin theme consistency | 0% | 100% |
| Shared components | 0 | 9 |

---

## Rollback Plan

If issues arise:
1. Git stash changes
2. Restore original files
3. Address issues incrementally

---

*Document generated for comprehensive code quality refactoring*
