```md
# AI Prompting Guidelines for Engineering

This document defines how developers should instruct AI models to generate code.

These rules dramatically improve:

- code quality
- architecture clarity
- creativity
- maintainability

The AI must behave like a **senior engineer**, not a code generator.

---

# Core Principle

AI must generate code through **structured reasoning phases**, not immediate output.

AI responses must follow this order:

1. Architecture Plan
2. Component Structure
3. Data Flow Design
4. Implementation
5. Refactoring Pass

Skipping steps results in poor code.

---

# 1. Always Define the Problem Clearly

Prompt must include:

- feature description
- user interaction
- expected behavior
- constraints

Bad prompt:

"create dashboard"

Good prompt:

"Create a dashboard that displays user metrics, recent activity, and notifications using reusable components."

Reasoning:

AI needs context to design architecture.

---

# 2. Request Architecture First

Never allow AI to immediately generate code.

Prompt structure:


First describe the architecture before writing code.


Expected output:

- folder structure
- component hierarchy
- state flow

Reasoning:

Architecture determines code quality.

---

# 3. Force Separation of Concerns

Always instruct AI to separate:

- UI components
- hooks
- services
- utilities

Prompt example:


Ensure the code separates components, hooks, and services.


Reasoning:

Prevents monolithic files.

---

# 4. Require Modular Components

Prompt must specify:


Create small reusable components.


Avoid:

Single large page components.

Reasoning:

AI tends to generate large components by default.

---

# 5. Specify the Tech Stack Explicitly

AI must know the exact environment.

Example:


Use Next.js App Router, TailwindCSS, Framer Motion, Clerk authentication, and PostgreSQL with RLS.


Reasoning:

AI must optimize for the correct framework conventions.

---

# 6. Enforce Clean Code Constraints

Add strict limits.

Example:


Functions must remain under 20 lines where possible.
Components must remain under 200 lines.


Reasoning:

AI respects explicit constraints.

---

# 7. Require Typed Code

Prompt:


Use TypeScript with clear types.


Reasoning:

Typed code prevents ambiguous logic.

---

# 8. Require Comments Explaining Intent

Prompt:


Add comments explaining the reasoning behind key logic.


Avoid:

Over-commenting trivial code.

Reasoning:

Future developers must understand decisions.

---

# 9. Force Refactoring Step

Prompt must end with:


Refactor the code to remove duplication and simplify logic.


Reasoning:

AI often writes redundant code initially.

---

# 10. Request Production-Ready Output

Prompt must explicitly request:


Return clean production-ready code.


Checklist:

- no unused imports
- consistent naming
- organized structure

Reasoning:

AI sometimes leaves rough draft artifacts.

---

# Example High-Quality Prompt


Create a feature using Next.js App Router.

Follow these rules:

First describe the architecture.

Then list the component structure.

Then explain the data flow.

Then implement the code.

Use:

TailwindCSS

Framer Motion animations

Clerk authentication

PostgreSQL RLS secure queries.

Requirements:

modular components

reusable hooks

service-based data fetching

components under 200 lines

functions under 20 lines

Finally refactor the code for clarity and remove duplication.


---

# Final AI Rule

AI must behave as:

- an architect first
- an engineer second
- a code generator last

This ensures that generated software remains scalable and maintainable.
