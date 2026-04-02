# AI Development Workflow
### Human + AI Engineering Collaboration Protocol

This document defines the **standard workflow for building software with AI assistance**.

The objective is to ensure that AI becomes a **high-level engineering collaborator**, not just a code generator.

This workflow maximizes:

- productivity
- architecture quality
- creativity
- maintainability
- system stability

It must be followed whenever AI contributes to development.

---

# Core Philosophy

AI must operate in **structured collaboration cycles**, not isolated prompts.

The development process is divided into **five engineering phases**:

1. Problem Framing
2. System Design
3. Feature Construction
4. Refinement
5. Integration

Each phase must be completed before moving forward.

---

# Phase 1 — Problem Framing

Purpose:

Clearly define the feature before any design or code is generated.

Developer responsibilities:

- describe the feature
- define expected behavior
- outline user interactions
- define constraints

Example prompt structure:


Feature: Notifications System

Users should receive real-time notifications when actions occur.
Notifications must display in a dropdown panel and persist in the database.

Requirements:

unread state

animation on arrival

ability to mark as read


AI responsibilities:

- restate the feature requirements
- identify missing information
- clarify expected behavior

Reason:

Misunderstood problems produce poor architecture.

---

# Phase 2 — System Design

Purpose:

Create architecture before writing code.

AI must generate:

1. feature architecture
2. component hierarchy
3. state flow
4. service structure

Example output:

Architecture:


features/notifications
components
hooks
services
types


Component hierarchy:


NotificationDropdown
NotificationList
NotificationItem


Data flow:


UI → Hook → Service → Database


Rules:

No code should be written yet.

Reason:

Architecture determines code quality.

---

# Phase 3 — Feature Construction

Purpose:

Build the feature according to the architecture.

Development order must follow this sequence.

### Step 1 — Types

Define data models.

Example:


Notification
NotificationStatus
NotificationResponse


Reason:

Types establish system contracts.

---

### Step 2 — Service Layer

Implement data access.

Responsibilities:

- API communication
- database interaction
- external services

Example:


notificationService.ts


Rules:

UI must never directly fetch data.

---

### Step 3 — Hooks

Implement state management.

Example:


useNotifications.ts


Responsibilities:

- loading state
- error state
- data transformation
- service calls

Reason:

Hooks isolate logic from UI.

---

### Step 4 — Components

Create UI components.

Hierarchy:


NotificationDropdown
NotificationList
NotificationItem


Rules:

Components must remain:

- small
- reusable
- readable

---

### Step 5 — Route Integration

Integrate the feature into the application.

Example:


app/dashboard/page.tsx


Responsibilities:

- import feature
- orchestrate layout

Reason:

Routes act as entry points.

---

# Phase 4 — Refinement

Purpose:

Improve code quality before final integration.

AI must perform a **refactoring pass**.

Checklist:

- remove duplicate logic
- simplify functions
- enforce naming consistency
- split large components
- confirm correct folder placement

Example refactoring improvements:

Before:


large component with mixed logic


After:


logic moved to hook
UI simplified


Reason:

AI-generated code often needs cleanup.

---

# Phase 5 — Integration

Purpose:

Ensure the feature works within the system.

Checklist:

- confirm feature folder structure
- validate imports
- test UI behavior
- confirm service interactions
- verify security rules

Example security verification:

- Clerk session available
- PostgreSQL RLS policies respected

Reason:

Integration failures often occur at system boundaries.

---

# Creative Exploration Stage

AI should occasionally propose improvements.

Allowed suggestions:

- UX improvements
- performance optimizations
- animation enhancements
- architectural improvements

Example suggestion:


Consider adding optimistic UI updates for notifications.


Rules:

Suggestions must be optional.

Reason:

Creativity must not disrupt stability.

---

# AI Collaboration Rules

AI must follow these behavior rules.

---

### Rule 1 — Think Before Coding

AI must analyze the problem before generating code.

---

### Rule 2 — Respect Architecture

AI must follow the project blueprint.

---

### Rule 3 — Generate Modular Code

AI must prefer small components and functions.

---

### Rule 4 — Avoid Overengineering

AI must implement the simplest solution that satisfies requirements.

---

### Rule 5 — Refactor Before Completion

AI must perform a final cleanup pass.

---

# Developer Responsibilities

Developers must guide AI properly.

Responsibilities:

- provide clear feature descriptions
- enforce architecture discipline
- review generated code
- approve final integration

AI assists development.

It does not replace engineering judgment.

---

# Example Full AI Collaboration Prompt


We are implementing a new feature.

Follow the AI development workflow.

First restate the feature requirements.

Then design the feature architecture.

Then describe component hierarchy.

Then define the data flow.

Then implement the feature following the project structure blueprint.

Finally refactor the code.

Stack:

Next.js
TailwindCSS
Framer Motion
Clerk authentication
PostgreSQL with RLS


---

# Final Principle

AI should behave as:

1. Architect
2. System Designer
3. Engineer
4. Code Generator

Never in the reverse order.

Following this workflow ensures that AI helps **bring ideas to life without sacrificing e
