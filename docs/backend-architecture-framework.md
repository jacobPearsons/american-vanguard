# Backend Architecture Framework
### Scalable Backend Engineering Standard

This document defines the **backend architecture discipline** for this project.

The objective is to build a backend that is:

- scalable
- secure
- modular
- testable
- maintainable

Primary stack:

- Node.js
- Express
- Passport.js
- MongoDB
- Session-based authentication
- Jest for testing

This framework enforces **clear separation between routes, middleware, controllers, services, and data models**.

---

# Core Architecture Philosophy

The backend must follow **layered architecture**.

All requests must pass through predictable layers.

Request lifecycle:

Client Request
↓
Route
↓
Middleware
↓
Validation
↓
Controller
↓
Service
↓
Database Model
↓
Response

Each layer must have **one responsibility only**.

---

# Project Folder Structure

The backend must follow this structure.


src/

app.js
server.js

config/
controllers/
services/
routes/
middleware/
models/
validators/
auth/
utils/
tests/


This layout prevents the repository from becoming disorganized.

---

# Server Entry Layer

### server.js

Responsible for starting the server.

Example responsibilities:

- start Express server
- connect database
- load environment variables

Rules:

- no application logic
- no routes
- no controllers

---

### app.js

Responsible for application configuration.

Responsibilities:

- configure middleware
- mount routes
- initialize authentication
- configure sessions

Reason:

Separates **server startup from application logic**.

---

# Routing Layer

Routes define **API endpoints**.

Example:


routes/
auth.routes.js
user.routes.js
notification.routes.js


Rules:

Routes must only:

- define endpoints
- attach middleware
- forward requests to controllers

Example:


router.post("/login", validateLogin, authController.login)


Routes must not contain:

- business logic
- database queries
- complex transformations

---

# Middleware Layer

Middleware handles **cross-cutting concerns**.

Examples:


middleware/
authMiddleware.js
errorMiddleware.js
sessionMiddleware.js
loggerMiddleware.js


Common middleware responsibilities:

- authentication checks
- request logging
- security enforcement
- session management

Middleware must remain **small and reusable**.

---

# Validation Layer

Input validation must occur **before controllers execute**.

Folder:


validators/


Examples:


auth.validator.js
user.validator.js


Validation responsibilities:

- check request body
- sanitize input
- enforce schema

Example validation:


email must be valid
password minimum length
username allowed characters


Reason:

Controllers must receive **clean validated data**.

---

# Controller Layer

Controllers orchestrate request handling.

Example:


controllers/
auth.controller.js
user.controller.js


Responsibilities:

- receive request
- call services
- return responses

Controllers must not contain:

- database queries
- password hashing
- heavy business logic

Example pattern:


async function login(req, res) {
const user = await authService.login(req.body)
res.json(user)
}


Reason:

Controllers remain thin.

---

# Service Layer

Services contain **core business logic**.

Example:


services/
auth.service.js
user.service.js


Responsibilities:

- business rules
- data transformations
- service orchestration

Example:


verify password
create session
generate tokens


Rules:

Services interact with **models only**.

---

# Data Model Layer

Models represent database collections.

Example:


models/
user.model.js
notification.model.js


Example schema:


User

email

passwordHash

createdAt


Rules:

Models must contain:

- schema definitions
- indexes
- model methods

Models must not contain:

- request logic
- controller logic

---

# Authentication Architecture

Authentication uses **Passport.js strategies**.

Structure:


auth/
passport.config.js
strategies/


Example strategies:


local.strategy.js
jwt.strategy.js


Authentication flow:

User Login
↓
Passport Local Strategy
↓
Verify Credentials
↓
Create Session
↓
Serialize User
↓
Store Session

---

# Password Security

Passwords must never be stored in plaintext.

Hashing process:


password
↓
bcrypt hash
↓
stored in database


Security rules:

- use strong hashing
- never expose hashes
- enforce minimum password strength

---

# Session Management

Sessions must use secure storage.

Recommended setup:


express-session
connect-mongo


Session store example:


MongoDB session store


Security configuration:


httpOnly cookies
secure cookies
session expiration


Reason:

Protect against session hijacking.

---

# Cookie Security

Cookie configuration must include:


httpOnly
secure
sameSite


Purpose:

- prevent XSS attacks
- protect session tokens

---

# Error Handling System

Centralized error handling must exist.

Example:


middleware/errorMiddleware.js


Responsibilities:

- capture thrown errors
- log errors
- send safe responses

Rules:

Never expose internal stack traces.

---

# Logging System

Request logging should be implemented.

Example tools:


morgan
winston


Logs should capture:

- request method
- endpoint
- response time
- status code

---

# Security Middleware

Security protections should include:


helmet
rate limiting
CORS control


Purpose:

Protect against common web attacks.

---

# Unit Testing Architecture

Testing must use **Jest**.

Structure:


tests/

unit/
integration/


Example tests:


auth.service.test.js
user.controller.test.js


Testing targets:

- services
- controllers
- middleware

Tests must not depend on real databases when possible.

---

# Backend Feature Workflow

Every new backend feature must follow this sequence.

1. Define model schema
2. Implement service logic
3. Implement controller
4. Define validation
5. Create route
6. Add middleware
7. Write tests

Reason:

Maintains development discipline.

---

# Dependency Rules

Dependencies must follow this direction:

Routes → Controllers → Services → Models

Reverse dependencies are forbidden.

Example violation:

Model importing controller.

---

# Code Quality Rules

Functions should:

- remain small
- remain readable
- follow clear naming

Examples:

Good:


createUser
validatePassword
sendResetEmail


Bad:


handleStuff
doProcess
thingManager


---

# Final Backend Principle

The backend must always prioritize:

1. security
2. modularity
3. scalability
4. testability
5. maintainability

Every new feature must follow this architecture.