It is written so both AI and developers can follow it strictly.

# Frontend Application Lifecycle Protocol
### Supplement to: AI Code Discipline Protocol

This document defines the **strict lifecycle and operational rules** for frontend development.

It ensures that every application built using this stack remains:

- scalable
- maintainable
- predictable
- secure
- modular

Primary Stack:

- Next.js
- TailwindCSS
- Framer Motion
- Bun
- Clerk Authentication
- PostgreSQL with Row Level Security (RLS)

This protocol governs **how frontend logic must be structured throughout the lifecycle of an application**.

---

# Core Principle

Frontend code must follow **predictable phases** of operation.

Every feature must move through the same lifecycle:

1. Architecture Definition
2. Routing Structure
3. Data Access Layer
4. State Initialization
5. UI Composition
6. Interaction Layer
7. Animation Layer
8. Error Handling
9. Security Enforcement
10. Optimization
11. Cleanup

No phase should be skipped.

---

# 1. Architecture Definition

Objective:
Define how the application is structured before implementing UI.

Rules:

- Features must be modular.
- Each module must have clear boundaries.
- Avoid monolithic page logic.

Standard directory layout:


src/

app/ → Next.js routes
components/ → reusable UI components
features/ → feature modules
hooks/ → reusable hooks
services/ → API and server interaction
lib/ → utilities and helpers
types/ → shared types
styles/ → global styles
animations/ → animation presets


Feature example:


features/
dashboard/
components/
hooks/
services/
types/


Reasoning:

Feature isolation prevents cross-dependency chaos.

---

# 2. Routing Lifecycle

Next.js routing defines **entry points to the application**.

Rules:

- Routes must only orchestrate components.
- No heavy logic in route files.
- All business logic must live in services or hooks.

Example responsibility:

Route file:


app/dashboard/page.tsx


Allowed:

- layout composition
- feature entry
- data fetch trigger

Not allowed:

- complex data transformation
- large UI blocks
- business logic

Reasoning:

Routes must remain **thin controllers**.

---

# 3. Authentication Lifecycle

Authentication must be resolved **before application logic runs**.

Using Clerk:

Flow:


User Visit
→ Clerk Session Check
→ Auth Context Created
→ Protected Routes Verified


Rules:

- Never trust client-only authentication.
- Use Clerk session validation.
- Sensitive queries must rely on **PostgreSQL RLS**, not frontend checks.

Reasoning:

Frontend security is advisory.  
Database security is authoritative.

---

# 4. Data Access Lifecycle

All data must pass through a **service layer**.

Never fetch data directly inside UI components.

Structure:


services/
userService.ts
dashboardService.ts


Example responsibility:

Service:


fetchDashboardData()
updateProfile()
getUserSettings()


Rules:

- Services handle API communication.
- Components only consume results.
- No fetch logic inside UI files.

Reasoning:

Separation ensures maintainable data flow.

---

# 5. State Initialization

State must be predictable.

Flow:


Server Data
→ Service Layer
→ Hook State
→ UI Component


Example structure:


hooks/useDashboardData.ts


Responsibilities:

- call service
- manage loading state
- manage error state
- expose clean data

Rules:

- Hooks manage state
- Components display state

Reasoning:

Prevents UI components from becoming logic-heavy.

---

# 6. UI Composition Lifecycle

UI must follow **component hierarchy discipline**.

Hierarchy:


Page
→ Layout
→ Section
→ Component
→ Primitive


Example:


DashboardPage
DashboardLayout
StatsSection
StatsCard


Rules:

Components must be:

- reusable
- single responsibility
- small

Max guideline:

Component file length should ideally remain under **200 lines**.

Reasoning:

Large components become difficult to maintain.

---

# 7. Styling Lifecycle

Styling must follow predictable rules.

Using Tailwind.

Rules:

- Prefer utility classes
- Avoid custom CSS unless necessary
- Use consistent spacing scale
- Avoid inline styles

Structure:


styles/globals.css


Tailwind rules:

- no duplicated class patterns
- extract reusable patterns into components

Reasoning:

Tailwind encourages consistent design systems.

---

# 8. Animation Lifecycle

Animations must be **intentional and minimal**.

Using Framer Motion.

Rules:

- Animations must improve UX.
- Avoid decorative overuse.
- Define animation presets.

Example:


animations/
fade.ts
slide.ts


Component usage:


<motion.div variants={fadeIn}>


Reasoning:

Centralized animations ensure consistency.

---

# 9. Interaction Lifecycle

User interaction must follow predictable patterns.

Flow:


User Action
→ Event Handler
→ Hook
→ Service
→ Database
→ Response
→ State Update
→ UI Update


Rules:

- UI events must not contain business logic.
- Events call hooks.
- Hooks call services.

Reasoning:

This avoids fragile UI code.

---

# 10. Error Handling Lifecycle

Errors must be handled at multiple layers.

Layers:

1. UI feedback
2. hook handling
3. service handling

Example flow:


Service Error
→ Hook catches error
→ UI displays message


Rules:

- Never allow silent failures.
- Show user-friendly feedback.

Reasoning:

Improves reliability.

---

# 11. Security Lifecycle

Security must be layered.

Stack enforcement:

Frontend

- Clerk session awareness

Backend

- PostgreSQL Row Level Security

Rules:

- Never rely on client authorization.
- Always assume requests can be manipulated.

Example:

RLS policy controls access to rows based on user ID.

Reasoning:

Database-level protection is mandatory.

---

# 12. Performance Lifecycle

Optimization happens after functionality.

Priority order:

1. correctness
2. readability
3. performance

Optimization rules:

- use server components where possible
- lazy load heavy components
- memoize expensive computations
- avoid unnecessary re-renders

Reasoning:

Premature optimization damages maintainability.

---

# 13. Cleanup Lifecycle

Applications must clean resources.

Examples:

- cancel async requests
- remove event listeners
- prevent memory leaks

React tools:


useEffect cleanup
AbortController


Reasoning:

Prevents degraded performance over time.

---

# 14. Refactoring Phase

Before finalizing any feature:

Checklist:

- remove unused code
- ensure naming clarity
- enforce folder structure
- simplify large functions
- check component size

Reasoning:

Code quality must be intentional.

---

# 15. Final Output Standard

Every feature must end with:

- modular architecture
- clean components
- isolated services
- predictable state flow
- secure data access
- optimized rendering

Frontend code must remain:

- readable
- maintainable
- scalable

---

# Final Principle

Frontend architecture must prioritize:

1. clarity
2. predictability
3. separation of concerns
4. maintainability
5. security

Every decision should move the codebase closer to **long-term stability rather than short-ter
