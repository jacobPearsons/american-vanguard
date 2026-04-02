# Project Structure Blueprint
### Repository Architecture Standard

This document defines the **canonical folder structure** for all projects in this codebase.

Its purpose is to prevent:

- messy repositories
- uncontrolled file growth
- tangled dependencies
- architectural drift

Every project must start from this blueprint.

Stack Target:

- Next.js (App Router)
- TypeScript
- TailwindCSS
- Framer Motion
- Bun
- Clerk Authentication
- PostgreSQL with Row Level Security (RLS)

---

# Core Principles

The repository must prioritize:

1. **Feature Isolation**
2. **Predictable Structure**
3. **Separation of Concerns**
4. **Scalable Growth**
5. **Developer Discoverability**

A developer must be able to understand the project layout in **under 30 seconds**.

---

# Root Directory Structure


/
app
components
features
hooks
services
lib
types
animations
styles
config
public
scripts
docs


Each folder exists for a specific responsibility.

New folders should **not be introduced without justification**.

---

# 1. `app/` — Application Routing Layer

Purpose:

Defines application routes using **Next.js App Router**.

Rules:

- Route files orchestrate components only.
- Avoid complex logic.
- Avoid large UI blocks.

Example:


app/
layout.tsx
page.tsx

dashboard/
page.tsx

profile/
page.tsx


Allowed responsibilities:

- route layout composition
- feature entry points
- server-side data triggers

Not allowed:

- heavy business logic
- complex UI construction

Reason:

Routes must remain **thin controllers**.

---

# 2. `components/` — Global Reusable UI

Purpose:

Holds **generic UI components used across the application**.

Examples:


components/
Button.tsx
Card.tsx
Modal.tsx
Input.tsx
Avatar.tsx


Rules:

Components here must be:

- reusable
- context independent
- purely UI focused

Avoid placing feature-specific components here.

Reason:

Prevents component pollution.

---

# 3. `features/` — Feature Modules

Purpose:

Encapsulates domain-specific functionality.

Each feature is self-contained.

Example:


features/
dashboard/
components/
hooks/
services/
types/

notifications/
components/
hooks/
services/


Rules:

Features may include:

- UI components
- hooks
- service logic
- feature-specific types

Features must **not directly depend on other features**.

Reason:

Encourages modular architecture.

---

# 4. `hooks/` — Global Hooks

Purpose:

Reusable React hooks shared across features.

Examples:


hooks/
useDebounce.ts
useWindowSize.ts
useTheme.ts


Rules:

Hooks here must be **generic utilities**.

Feature-specific hooks belong inside the feature folder.

Reason:

Avoids mixing global and domain logic.

---

# 5. `services/` — Data Access Layer

Purpose:

Handles all external communication.

Responsibilities:

- API calls
- database interactions
- external services

Examples:


services/
userService.ts
analyticsService.ts


Rules:

UI components must **never call APIs directly**.

All data flows through services.

Reason:

Maintains clean data architecture.

---

# 6. `lib/` — Utilities and Helpers

Purpose:

Holds small reusable functions.

Examples:


lib/
formatDate.ts
generateSlug.ts
validateEmail.ts


Rules:

Utilities must:

- be pure functions
- contain no side effects

Reason:

Ensures predictable behavior.

---

# 7. `types/` — Shared Type Definitions

Purpose:

Central location for TypeScript types.

Examples:


types/
user.ts
dashboard.ts
api.ts


Rules:

Types must be descriptive and reusable.

Avoid defining identical types across multiple files.

Reason:

Improves consistency across the codebase.

---

# 8. `animations/` — Motion Presets

Purpose:

Centralized Framer Motion animation definitions.

Example:


animations/
fade.ts
slide.ts
scale.ts


Usage example:


<motion.div variants={fadeIn} />


Rules:

Animations must be defined here instead of inside components.

Reason:

Ensures animation consistency.

---

# 9. `styles/` — Global Styling

Purpose:

Holds application-wide styles.

Examples:


styles/
globals.css


Rules:

- Tailwind should handle most styling.
- Avoid excessive custom CSS.

Reason:

Maintain design consistency.

---

# 10. `config/` — Application Configuration

Purpose:

Centralizes configuration.

Examples:


config/
site.ts
env.ts
navigation.ts


Rules:

Do not hardcode configuration values in components.

Reason:

Improves maintainability.

---

# 11. `public/` — Static Assets

Purpose:

Static files served directly.

Examples:


public/
images/
icons/
fonts/


Rules:

Avoid storing large unnecessary files.

Reason:

Controls repository size.

---

# 12. `scripts/` — Automation

Purpose:

Project automation scripts.

Examples:


scripts/
seed-db.ts
generate-types.ts


Rules:

Scripts must remain isolated from application logic.

Reason:

Keeps operational tasks separate.

---

# 13. `docs/` — Engineering Documentation

Purpose:

Stores architectural documentation.

Examples:


docs/
ai-code-discipline.md
frontend-lifecycle.md
component-design-rules.md
ai-prompting-guidelines.md
project-structure-blueprint.md


Reason:

Documentation must live with the codebase.

---

# Naming Conventions

Files must follow consistent naming.

Components:


PascalCase


Example:


UserCard.tsx


Hooks:


useSomething.ts


Example:


useAuth.ts


Utilities:


camelCase


Example:


formatDate.ts


---

# Import Discipline

Avoid deep relative imports.

Bad:


../../../components/Button


Good:


@/components/Button


Use path aliases.

Reason:

Improves code readability.

---

# Feature Development Workflow

Every new feature must follow this sequence:

1. Create feature directory
2. Define types
3. Implement service layer
4. Implement hooks
5. Build UI components
6. Integrate into route
7. Add animations
8. Refactor

Reason:

Enforces consistent development patterns.

---

# Repository Health Rules

Before merging code:

- remove unused files
- check naming consistency
- confirm folder placement
- simplify large components
- eliminate duplicated utilities

Reason:

Prevent long-term repository decay.

---

# Final Principle

A repository must be designed as a **long-term system**, not a temporary project.

Good architecture makes future development:

- faster
- safer
- easier to maintain
