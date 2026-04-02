# Component Design Rules
### Frontend Engineering Standard

This document defines the rules for designing UI components.

The goal is to ensure that all components remain:

- reusable
- composable
- predictable
- maintainable

These rules apply to applications built with:

- Next.js
- TailwindCSS
- Framer Motion
- Lucide-React


---

# Core Principle

A component must represent **a single conceptual unit of UI behavior**.

Components must not combine unrelated responsibilities.

Bad example:

UserCard + data fetching + analytics tracking + form logic.

Good example:

UserCard → purely UI display component.

---

# 1. Component Responsibility

Each component must have **one responsibility**.

Allowed responsibilities:

- rendering UI
- managing local UI state
- handling user interaction

Not allowed:

- direct database access
- business logic processing
- authentication decisions
- large data transformations

These must exist in:

- services
- hooks
- server logic

Reasoning:

UI must remain a presentation layer.

---

# 2. Component Size Limit

Components must remain small.

Guidelines:

Ideal size:

100–150 lines

Maximum acceptable size:

250 lines

If exceeded:

Split the component.

Example:

Bad:


DashboardPage.tsx


Good:


DashboardPage
DashboardHeader
StatsSection
RecentActivity
NotificationsPanel


Reasoning:

Smaller components increase clarity and reusability.

---

# 3. Component Hierarchy

Components must follow predictable hierarchy.

Structure:


Page
Layout
Section
Component
Primitive


Examples of primitives:


Button
Input
Badge
Card
Avatar


Higher-level components compose primitives.

Reasoning:

Design systems emerge naturally from primitives.

---

# 4. Smart vs Dumb Components

Two categories exist.

### Presentation Components

Also called **dumb components**.

Responsibilities:

- render UI
- receive props
- emit events

They contain **no business logic**.

Example:


ProfileCard
NotificationItem
ProductTile


---

### Logic Components

Also called **smart components**.

Responsibilities:

- orchestrate hooks
- pass data to presentation components

Example:


UserProfileContainer
DashboardDataProvider


Rule:

Presentation components must **never fetch data directly**.

---

# 5. Props Design Rules

Props must be:

- minimal
- descriptive
- predictable

Bad:


data
item
thing


Good:


userProfile
notificationList
productPrice


Rules:

- avoid prop overloading
- prefer explicit naming

Reasoning:

Readable props prevent misuse.

---

# 6. Component Reusability

Reusable components must not depend on page context.

Bad:


DashboardUserCard


Good:


UserCard


If specialization is required:

Use composition.

Example:

<UserCard> <DashboardBadge /> </UserCard> ```

Reasoning:

Context-free components scale better.

7. Styling Rules

All components must use Tailwind utilities.

Avoid:

inline styles

scattered CSS files

Prefer:

className="flex items-center gap-4 p-4 rounded-xl"

If styles repeat frequently:

Extract into components.

Example:

PrimaryButton
SecondaryButton

Reasoning:

Consistency improves UI maintainability.

8. Animation Rules

Animations must be handled through Framer Motion.

Rules:

animation logic must be reusable

define animation presets

Example:

animations/fadeIn.ts
animations/slideUp.ts

Components should reference presets.

Bad:

Random animation objects inside components.

Good:

<motion.div variants={fadeIn} />

Reasoning:

Centralized animations maintain consistency.

9. Component Naming Rules

Component names must describe purpose.

Bad:

Box
Stuff
Widget

Good:

UserProfileCard
OrderSummaryPanel
NavigationSidebar

Naming structure:

[Domain][Purpose]

Example:

PaymentForm
MessageList
ProductGallery

Reasoning:

Readable naming reduces cognitive load.

10. Folder Organization

Components must be organized logically.

Global components:

components/

Feature components:

features/dashboard/components/

Example structure:

components/
  Button.tsx
  Card.tsx
  Modal.tsx

features/
  dashboard/
    components/
      StatsCard.tsx
      ActivityFeed.tsx

Reasoning:

Prevents massive component folders.

11. Component Composition

Prefer composition over configuration.

Bad:

<Button type="primary" size="large" shape="rounded" />

Good:

<PrimaryButton>

Reasoning:

Simplifies component APIs.

12. Component Testing Awareness

Components must be easy to test.

Avoid:

hidden state logic

implicit dependencies

Prefer:

clear props

explicit events

Example event:

onSubmit
onClick
onClose

Reasoning:

Predictable components are testable components.

Final Component Rule

A component must be:

small

composable

readable

reusable

context independent
