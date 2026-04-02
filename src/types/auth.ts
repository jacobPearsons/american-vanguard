/**
 * Authentication Types
 * 
 * Defines types for native authentication system
 * Following architecture from docs/backend-architecture-framework.md
 */

export interface User {
  id: string
  email: string
  passwordHash: string
  firstName: string
  lastName: string
  matricNumber?: string
  role: 'student' | 'staff' | 'admin'
  isActive: boolean
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  matricNumber?: string
  role: 'student' | 'staff' | 'admin'
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  matricNumber?: string
  role?: 'student' | 'staff'
}

export interface AuthResponse {
  success: boolean
  message: string
  user?: AuthUser
  error?: string
}

export interface SessionUser {
  userId: string
  email: string
  firstName: string
  lastName: string
  matricNumber?: string
  role: 'student' | 'staff' | 'admin'
  iat: number
  exp: number
}
