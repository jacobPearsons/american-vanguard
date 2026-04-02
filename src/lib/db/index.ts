export { connectDB, mongoose } from './connection'
export * from './utils'

import { users } from './users'
import { admissions } from './admissions'
import { courses } from './courses'
import { grades } from './grades'
import { payments } from './payments'
import { notifications } from './notifications'
import { faculty } from './faculty'
import { departments } from './departments'
import { registrations } from './registrations'
import { announcements } from './announcements'
import { programs } from './programs'

export const db = {
  user: users,
  admissionApplication: admissions,
  course: courses,
  grade: grades,
  payment: payments,
  notification: notifications,
  faculty,
  department: departments,
  studentRegistration: registrations,
  announcement: announcements,
  program: programs,
}
