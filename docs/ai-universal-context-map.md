# AI Universal Context Map
### Global Repository Intelligence System

This document provides a structured map of the entire repository.

The goal of the Universal Context Map is to allow AI systems to understand the full project architecture instantly.

Large codebases often fail with AI assistance because the model lacks global context.

The Universal Context Map solves this problem by defining:

system architecture  
module relationships  
feature ownership  
data flow  
service boundaries  
dependency structure  

This document acts as the global mental model of the repository.

---

# Core Principle

AI performs best when it understands the structure of the system it is modifying.

Without context AI may:

duplicate logic  
misplace files  
violate architecture boundaries  
create incompatible integrations  

The Universal Context Map ensures the AI understands the system before generating code.

---

# Repository Overview

The repository contains multiple architectural layers.

Frontend Layer  
Backend Layer  
Service Layer  
Database Layer  
Infrastructure Layer  

Each layer has specific responsibilities.

The AI must never mix responsibilities across layers.

---

# High-Level Architecture

The system architecture follows a modular design.

Frontend Application
↓
API Layer
↓
Controller Layer
↓
Service Layer
↓
Data Access Layer
↓
Database

Each layer communicates only with adjacent layers.

Direct communication between non-adjacent layers must be avoided.

---

# Repository Structure

Example repository structure:


apps
frontend
backend

packages
ui
shared
config

services
auth
notifications
analytics

database
models
migrations

infrastructure
docker
ci
monitoring

docs


This structure separates responsibilities and improves maintainability.

---

# Frontend System Map

The frontend system contains the following modules:

UI Components  
Feature Modules  
State Management  
API Integration  
Animation Layer

Responsibilities:

Components handle rendering.

Feature modules coordinate UI logic.

API layer handles backend communication.

Animations provide visual feedback.

The frontend must follow rules defined in:

frontend-lifecycle.md  
component-design-rules.md

---

# Backend System Map

The backend system follows a layered architecture.

Routes
↓
Controllers
↓
Services
↓
Database Models

Responsibilities:

Routes define API endpoints.

Controllers validate requests.

Services implement business logic.

Models handle database interaction.

The backend must follow:

backend-request-lifecycle.md  
backend-architecture.md

---

# Service Ownership Map

Each service is responsible for a specific domain.

Example domains:

Authentication  
User Management  
Notifications  
Analytics  
Messaging

Each service owns its data and business logic.

Services must remain independent whenever possible.

---

# Feature Ownership Map

Features must have clear ownership.

Example feature mapping:

Authentication → Auth Service  
User Profiles → User Service  
Messaging → Messaging Service  
Notifications → Notification Service  

This prevents feature logic from spreading across multiple modules.

---

# Data Flow Map

The system follows a predictable data flow.

User Action
↓
Frontend Component
↓
API Request
↓
Route Handler
↓
Controller
↓
Service Logic
↓
Database Query
↓
Response Returned

AI must maintain this flow when implementing new features.

---

# Dependency Map

Dependencies must follow strict direction rules.

Frontend depends on:

UI libraries  
shared utilities  

Backend depends on:

services  
database models  

Services depend on:

database layer  
shared utilities

Higher layers must not depend on lower layers.

---

# Database Map

The database system contains structured data models.

Examples:

Users  
Sessions  
Messages  
Notifications  
Audit Logs

Relationships between models must be clearly defined.

Indexes must be used for frequently queried fields.

---

# Infrastructure Map

Infrastructure supports system deployment and monitoring.

Components include:

container configuration  
CI/CD pipelines  
monitoring tools  
logging systems

Infrastructure must follow:

production-deployment.md  
observability-architecture.md

---

# Security Boundaries

Security responsibilities are enforced at multiple layers.

Frontend

form validation  
authentication UI  

Backend

authentication middleware  
authorization checks  
input validation  

Database

secure queries  
restricted access

Security rules must follow:

security-hardening.md

---

# Observability Map

The system must emit observability signals.

Observability layers include:

application logs  
error tracking  
performance metrics  
request tracing

Observability must follow:

observability-architecture.md

---

# Agent Responsibility Map

The multi-agent system operates within this architecture.

Architecture Agent → system design  
Feature Builder Agent → feature implementation  
Security Agent → vulnerability detection  
Performance Agent → optimization  
Refactoring Agent → code health  
Testing Agent → test coverage  
Observability Agent → monitoring

Agents must operate within their defined domains.

---

# Autonomous Engineering Integration

The AI Autonomous Engineer coordinates development tasks.

Responsibilities include:

roadmap planning  
task generation  
pull request creation  
system improvements

The autonomous engineer must use this context map before generating code.

---

# Context Usage Protocol

Before generating code AI must review the Universal Context Map.

Steps include:

identify affected layer  
identify relevant services  
identify related features  
verify dependency rules  
verify data flow

Only after this analysis should code generation begin.

---

# Continuous Context Updates

The context map must evolve with the repository.

Updates are required when:

new services are introduced  
architecture changes occur  
database schemas evolve  
infrastructure changes

Maintaining the context map ensures long-term accuracy.

---

# Final Principle

AI cannot produce reliable code without understanding the system it modifies.

The Universal Context Map provides the global intelligence layer that allows AI to operate effectively within large and complex repositories.
