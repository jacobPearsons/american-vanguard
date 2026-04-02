# Backend Request Lifecycle
### Express Request Processing Standard

This document defines the **exact lifecycle of every backend request**.

It ensures that all endpoints follow a **predictable and secure flow**.

Stack:

- Node.js
- Express
- Passport.js
- MongoDB
- Session-based authentication
- Jest testing

The request lifecycle enforces **strict separation of concerns**.

---

# Core Principle

Every request must pass through the following layers:

Client Request
↓
Route
↓
Security Middleware
↓
Session Handling
↓
Authentication (Passport)
↓
Validation
↓
Controller
↓
Service
↓
Database Model
↓
Response Formatter
↓
Client Response

No layer should bypass another.

---

# 1. Client Request

A request originates from the client.

Examples:

POST /api/auth/login  
GET /api/users/me  
PUT /api/profile  

Request contains:

- headers
- cookies
- body
- query parameters

These must never be trusted directly.

---

# 2. Route Layer

Routes are the **entry points of the API**.

Location:

routes/


Example:

router.post(
"/login",
validateLogin,
authController.login
)


Responsibilities:

- define endpoint
- attach middleware
- forward request to controller

Routes must not contain:

- database logic
- password hashing
- complex processing

Routes act as **traffic controllers**.

---

# 3. Security Middleware

Security middleware runs before business logic.

Typical middleware:

middleware/
corsMiddleware.js
rateLimiter.js
helmetMiddleware.js


Responsibilities:

- enforce CORS rules
- prevent request flooding
- apply security headers

Purpose:

Protect the application before processing requests.

---

# 4. Session Handling

Session middleware manages authenticated user sessions.

Example stack:

express-session
connect-mongo


Session lifecycle:

User Login  
↓  
Session Created  
↓  
Session ID stored in cookie  
↓  
Session data stored in MongoDB  

Session cookies must include:

httpOnly
secure
sameSite


Purpose:

Prevent session hijacking.

---

# 5. Authentication Layer (Passport)

Authentication is handled by Passport strategies.

Structure:

auth/
passport.config.js
strategies/


Example strategy:

local.strategy.js


Authentication flow:

Request  
↓  
Passport Strategy  
↓  
Credential Verification  
↓  
User Object Attached to Request

Example result:

req.user


Controllers must rely on `req.user` for authenticated data.

---

# 6. Validation Layer

Validation ensures incoming data is safe.

Location:

validators/


Example validator:

auth.validator.js


Validation checks:

- required fields
- data formats
- field lengths
- allowed values

Example validation rules:

Email must be valid  
Password must meet strength requirements  

If validation fails:

return 400 Bad Request


Controllers should **never validate raw input**.

---

# 7. Controller Layer

Controllers manage request orchestration.

Location:

controllers/


Example:

auth.controller.js


Controller responsibilities:

- receive validated request
- call service layer
- return formatted response

Example structure:

async function login(req, res) {
const user = await authService.login(req.body)
res.json(user)
}


Controllers must not contain:

- database queries
- password hashing
- heavy logic

They coordinate the workflow.

---

# 8. Service Layer

Services implement **business logic**.

Location:

services/


Example:

auth.service.js


Responsibilities:

- verify password
- create sessions
- enforce business rules
- interact with database models

Example logic:

validate password
hash new password
update user record


Services must remain **framework independent**.

---

# 9. Database Layer

The database layer handles data persistence.

Location:

models/


Example model:

user.model.js


Models define:

- schema
- indexes
- model methods

Example schema:

User  
- email  
- passwordHash  
- createdAt  

Rules:

Models must not contain request logic.

---

# 10. Response Formatter

Before sending responses, data should be sanitized.

Purpose:

Remove sensitive data.

Example fields removed:

- passwordHash
- session secrets
- internal metadata

Example response:

{
id,
email,
createdAt
}


This ensures safe API responses.

---

# 11. Client Response

The server sends the final response.

Possible responses:

200 OK  
201 Created  
400 Bad Request  
401 Unauthorized  
404 Not Found  
500 Internal Server Error  

Responses must include:

- status code
- structured JSON
- clear message

Example:

{
success: true,
data: user
}


---

# Example Full Request Flow

Example endpoint:

POST /api/auth/login

Request lifecycle:

Client Request  
↓  
Route (/login)  
↓  
Security Middleware  
↓  
Session Middleware  
↓  
Passport Authentication  
↓  
Validation (validateLogin)  
↓  
Controller (authController.login)  
↓  
Service (authService.login)  
↓  
User Model Query  
↓  
Password Verification  
↓  
Session Creation  
↓  
Sanitized Response  
↓  
Client Response

---

# Backend Endpoint Blueprint

Every endpoint must follow this structure.

Route

router.post(
"/endpoint",
securityMiddleware,
passportMiddleware,
validator,
controller
)


Controller

async function handler(req, res) {
const result = await service.process(req.body)
res.json(result)
}


Service

async function process(data) {
const record = await Model.create(data)
return record
}


This blueprint ensures **consistent endpoint structure**.

---

# Error Handling Lifecycle

Errors must follow a central flow.

Service Error  
↓  
Controller Catch  
↓  
Error Middleware  
↓  
Structured Response

Example error response:

{
success: false,
message: "Invalid credentials"
}


This prevents leaking sensitive information.

---

# Testing Lifecycle

Endpoints must be tested using Jest.

Test types:

Unit Tests

- services
- validators
- middleware

Integration Tests

- API endpoints
- authentication flow

Example test:

tests/unit/auth.service.test.js


Testing ensures request lifecycle remains stable.

---

# Final Principle

Every request must move through the system in a **predictable and secure pipeline**.

Breaking the lifecycle leads to:

- security risks
- unmaintainable code
- inconsistent APIs

Strict adherence ensures the backend remains:

- scalable
- secure
- easy to extend