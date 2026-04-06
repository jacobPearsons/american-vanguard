import { z } from 'zod'
import { NextResponse } from 'next/server'

export const profileUpdateSchema = z.object({
  profileImage: z.string().url().optional().nullable(),
  bio: z.string().max(500).optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  address: z.string().max(255).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
  dateOfBirth: z.string().datetime().optional().nullable(),
})

export const notificationsFilterSchema = z.object({
  filter: z.enum(['all', 'unread']).optional(),
})

export const notificationActionSchema = z.object({
  action: z.literal('markAllRead'),
})

export const gradeQuerySchema = z.object({
  courseId: z.string().optional(),
  semester: z.string().optional(),
  academicYear: z.string().optional(),
})

export const gradeCreateSchema = z.object({
  studentId: z.number().int().positive(),
  courseId: z.number().int().positive(),
  score: z.number().min(0).max(100),
  semester: z.string().min(1),
  academicYear: z.string().min(1),
})

export const gradeUpdateSchema = z.object({
  id: z.number().int().positive(),
  score: z.number().min(0).max(100),
})

export const libraryQuerySchema = z.object({
  search: z.string().optional(),
  courseId: z.string().optional(),
  departmentId: z.string().optional(),
  category: z.string().optional(),
})

export const libraryCreateSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(1000).optional().nullable(),
  fileUrl: z.string().url(),
  fileType: z.string().max(50),
  courseId: z.number().int().positive().optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  departmentId: z.number().int().positive().optional().nullable(),
})

export function createApiResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status })
}

export function createErrorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}
