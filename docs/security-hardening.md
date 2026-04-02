# Security Hardening Framework
### Backend Security Standards

This document defines the security rules for the backend architecture.

Its objective is to ensure that all backend endpoints are:

- resistant to common web attacks
- secure by default
- compliant with authentication best practices
- safe for production environments

Stack context:

Node.js  
Express  
Passport.js  
MongoDB  
Session-based authentication  

Security must be implemented as **a layered defense system**.

---

# Core Security Philosophy

Security must follow the principle of **Defense in Depth**.

Multiple security layers must protect the application.

Security layers:

Client
↓
Transport Security
↓
Request Security Middleware
↓
Authentication
↓
Authorization
↓
Validation
↓
Service Logic
↓
Database Security

No layer should be solely trusted.

---

# Authentication Attack Prevention

Authentication systems are primary attack targets.

The backend must prevent the following attacks:

Brute Force Attacks  
Credential Stuffing  
Session Hijacking  
Timing Attacks  
User Enumeration

---

## Brute Force Protection

Login endpoints must implement request throttling.

Strategy:

- limit login attempts per IP
- limit attempts per user account
- temporarily block repeated failures

Example policy:

5 failed login attempts within 15 minutes  
↓  
Account locked for 30 minutes

Implementation approach:

Rate limiter middleware should protect:

POST /auth/login

---

## Credential Stuffing Protection

Attackers may attempt to reuse leaked credentials.

Defense mechanisms:

- enforce strong password policies
- apply login rate limits
- implement CAPTCHA after repeated failures

Additional detection:

Unusual login patterns should trigger alerts.

---

## User Enumeration Prevention

Attackers should not determine whether a user exists.

Bad response example:


User does not exist


Correct response:


Invalid credentials


Responses must remain identical for:

- incorrect username
- incorrect password

---

## Timing Attack Prevention

Authentication responses should avoid measurable timing differences.

Strategy:

Password verification must always execute hashing comparisons.

Example:

Even if user does not exist, simulate password comparison.

---

# Password Security Policies

Passwords must follow strong security requirements.

Minimum password rules:

Minimum length: 12 characters  
Must include:

- uppercase letters
- lowercase letters
- numbers
- special characters

Example valid password:


A9!strongSecurePass


Weak passwords must be rejected.

---

## Password Hashing

Passwords must never be stored in plaintext.

Required hashing process:

password
↓
salt generation
↓
bcrypt hashing
↓
stored hash

Recommended configuration:

bcrypt cost factor: 12 or higher

Rules:

- never log passwords
- never return password hashes in responses

---

## Password Reset Security

Password reset systems must follow secure workflows.

Reset flow:

User requests password reset  
↓  
Generate secure random token  
↓  
Store hashed token in database  
↓  
Send token via email link  
↓  
Token expires within 15 minutes

Reset tokens must:

- be single-use
- expire quickly
- be cryptographically secure

---

# Session Security

Session management must prevent hijacking and fixation attacks.

Session architecture:

Client Cookie
↓
Session ID
↓
Server Session Store

Session data must never be stored entirely in cookies.

Recommended setup:

express-session  
connect-mongo session store

---

## Secure Cookie Configuration

Session cookies must include the following flags:

httpOnly: true  
secure: true (HTTPS only)  
sameSite: strict or lax  

Example configuration:


cookie: {
httpOnly: true,
secure: true,
sameSite: "lax"
}


Purpose:

Prevent XSS and CSRF attacks.

---

## Session Expiration

Sessions must expire automatically.

Recommended policy:

Idle timeout: 30 minutes  
Absolute session lifetime: 24 hours

After expiration:

User must reauthenticate.

---

## Session Regeneration

Session IDs must regenerate after authentication.

Flow:

User logs in  
↓  
Old session destroyed  
↓  
New session created

This prevents **session fixation attacks**.

---

# CSRF Protection

Session-based authentication is vulnerable to CSRF attacks.

Protection methods:

Use CSRF tokens for all state-changing requests.

Example protected routes:

POST /profile/update  
POST /auth/logout  
POST /payment/process

CSRF tokens must be:

- unique per session
- verified by middleware

---

# Rate Limiting Strategy

Rate limiting prevents abuse and automated attacks.

Sensitive endpoints require strict limits.

Protected routes:

/auth/login  
/auth/register  
/auth/reset-password

Example configuration:

Login endpoint:

5 requests per minute per IP

General API:

100 requests per minute per IP

Admin endpoints:

20 requests per minute

Implementation approach:

Rate limiting middleware applied at route level.

---

# API Abuse Prevention

APIs must prevent excessive automated traffic.

Strategies:

IP throttling  
user-based throttling  
request burst limits

Example policy:

100 requests per minute  
burst allowance: 20

After limit exceeded:

Return HTTP 429 Too Many Requests.

---

# Input Validation Security

All incoming data must be validated.

Validation must prevent:

- injection attacks
- malformed input
- unexpected data structures

Examples:

Email must match RFC-compliant format.

Usernames must allow only safe characters.

Reject payloads exceeding size limits.

---

# MongoDB Security Practices

Database access must follow strict rules.

---

## Query Sanitization

All queries must sanitize user input.

Example risk:

NoSQL injection.

Example malicious payload:


{ "$gt": "" }


Defense:

Use schema validation and input sanitization.

---

## Database Access Restrictions

Database users must have minimal privileges.

Example roles:

Application user:

- read/write only required collections

Admin user:

- restricted to maintenance operations

Principle:

Least privilege access.

---

## Sensitive Data Protection

Sensitive data must be encrypted or hashed.

Examples:

Passwords → hashed  
Reset tokens → hashed  
API secrets → encrypted

Never store sensitive information in plaintext.

---

# Logging Security

Logs must avoid exposing sensitive information.

Never log:

- passwords
- session tokens
- authentication secrets

Safe log example:

User login attempt recorded.

Unsafe log example:

Logging entire request body.

---

# Security Headers

HTTP responses must include security headers.

Recommended headers:

Content-Security-Policy  
X-Frame-Options  
X-Content-Type-Options  
Strict-Transport-Security

These headers prevent:

- clickjacking
- MIME sniffing
- insecure resource loading

---

# Dependency Security

Dependencies must be monitored for vulnerabilities.

Security workflow:

Regularly run vulnerability scans.

Update outdated dependencies promptly.

Avoid unmaintained packages.

---

# Security Testing

Security must be validated through automated testing.

Testing methods:

Unit tests  
Integration tests  
Security tests

Example tests:

Login brute force protection  
Session expiration  
Password reset flow

Testing framework:

Jest

---

# Incident Response Strategy

Security incidents must follow a defined response plan.

Steps:

1. detect suspicious activity
2. temporarily disable affected endpoints
3. investigate logs
4. patch vulnerabilities
5. notify affected users if necessary

Rapid response reduces impact.

---

# Security Review Checklist

Before deploying new features verify:

Authentication rules implemented  
Rate limiting enabled  
Input validation present  
Sensitive data protected  
Session security configured  

If any item fails the review, deployment must be blocked.

---

# Final Security Principle

Security must be **designed into the architecture**, not added later.

Every endpoint must assume that:

- requests may be malicious
- users may attempt privilege escalation
- attackers will probe the system continuously

A secure backend is built by enforcing security at every layer.