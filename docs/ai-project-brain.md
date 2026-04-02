# AI Project Brain
### Central Intelligence for the Codebase

This document orchestrates the entire engineering documentation system.

It acts as the **entry point for AI understanding of the project**.

AI must read this document first before generating any code.

Purpose:

- load system architecture
- enforce coding standards
- enforce security rules
- ensure consistent code generation
- maintain architectural integrity

This document connects all documentation that defines the engineering system.

---

# Core Principle

AI must not generate code until it understands the system.

Before implementing any feature AI must load:

1. architecture documents
2. development standards
3. security rules
4. production requirements
5. observability architecture

All documents must be respected.

---

# Engineering Documentation Map

The project documentation is divided into functional layers.

Architecture  
Development  
Security  
Production  
Observability  
AI Collaboration

Each layer has dedicated documents.

---

# Architecture Layer

These documents define how the system is structured.

AI must load them first.

Documents:

project-blueprint.md  
frontend-lifecycle.md  
backend-request-lifecycle.md  

These documents define:

- project structure
- frontend architecture
- backend request lifecycle
- component organization
- API structure

AI must never violate these architectural rules.

---

# Development Standards Layer

These documents enforce clean code and consistent engineering patterns.

Documents:

component-design-rules.md  
backend-architecture.md  

These documents define:

- component patterns
- backend service patterns
- code organization rules
- modularity requirements

AI must follow these rules when generating code.

---

# AI Engineering Layer

These documents teach AI how to collaborate with developers.

Documents:

ai-dev-workflow.md  
ai-prompting-guidelines.md  
ai-context-engineering.md  

These documents define:

- how AI should reason about the codebase
- how prompts should be structured
- how context should be loaded

AI must follow these workflows when generating solutions.

---

# Security Layer

Security rules must always override feature convenience.

Document:

security-hardening.md

This document defines:

- authentication protection
- password security rules
- rate limiting strategies
- session protection
- database security

AI must enforce these rules automatically.

---

# Production Layer

Production deployment rules are defined in:

production-deployment.md

This document defines:

- environment configuration
- Docker architecture
- CI/CD pipelines
- secrets management
- scaling strategies

AI-generated code must remain compatible with these deployment requirements.

---

# Observability Layer

Observability ensures the system can be monitored and debugged.

Document:

observability-architecture.md

This document defines:

- metrics architecture
- logging standards
- distributed tracing
- debugging strategies

AI-generated services must expose observability signals.

---

# Technology Stack

The system is built on the following technologies.

Frontend:

Next.js  
Tailwind CSS  
Framer Motion

Backend:

Express.js  
Passport.js  
MongoDB  
PostgreSQL

Runtime:

Bun

AI must generate code compatible with this stack.

---

# AI Code Generation Workflow

Before generating code AI must follow this reasoning process.

Step 1

Load this document.

Step 2

Load architecture documents.

Step 3

Analyze repository structure.

Step 4

Search for existing implementations.

Step 5

Plan feature architecture.

Step 6

Generate code.

Step 7

Validate against architecture rules.

Skipping these steps leads to inconsistent code.

---

# Feature Implementation Protocol

Every feature must be mapped across system layers.

Example feature flow:

Frontend component  
↓  
API endpoint  
↓  
Controller  
↓  
Service  
↓  
Database operation

AI must plan all layers before writing code.

---

# Code Consistency Rules

AI must enforce the following rules.

Do not duplicate logic.

Reuse existing utilities and components.

Respect project structure.

Follow lifecycle documents.

Respect security policies.

Code must remain consistent with existing patterns.

---

# Architecture Protection Rules

AI must never:

- introduce conflicting frameworks
- violate project structure
- bypass security middleware
- place logic in the wrong layer
- break request lifecycle patterns

Architecture stability is critical for long-term maintainability.

---

# Context Loading Strategy

When implementing a feature AI must load context from:

1. this document
2. relevant architecture documents
3. relevant code modules
4. related components
5. related services

Only relevant context should be loaded to avoid context overflow.

---

# AI Collaboration Protocol

Developers must guide AI using structured prompts.

Recommended prompt structure:

Architecture context  
Relevant files  
Feature request  
Constraints

Providing structured context significantly improves AI output.

---

# Repository Awareness

AI must analyze the repository before writing code.

Key areas to inspect:

components  
pages or app directory  
API routes  
services  
models  
utilities

Understanding existing code prevents duplication.

---

# AI Self-Validation

After generating code AI must validate the result.

Checklist:

Code follows architecture rules  
Code respects security policies  
Code placed in correct directory  
Observability signals included  
Tests generated when needed

If validation fails the code must be regenerated.

---

# Engineering System Philosophy

This repository is designed as an **AI-assisted engineering system**.

The goal is to allow AI to produce:

- scalable architecture
- production-ready code
- secure systems
- maintainable projects

All contributors must respect this system.

---

# Final Principle

AI must behave like a senior engineer.

It must understand the system before modifying it.

Context-aware AI produces better software.