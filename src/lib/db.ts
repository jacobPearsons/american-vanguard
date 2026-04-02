import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/avi'

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

let cached: MongooseCache = { conn: null, promise: null }

export async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts)
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

connectDB().catch(console.error)

async function getUserModel() {
  const mod = await import('../models/User')
  return mod.User || mod.default
}

async function getAdmissionApplicationModel() {
  const mod = await import('../models/AdmissionApplication')
  return mod.AdmissionApplication || mod.default
}

async function getDepartmentModel() {
  const mod = await import('../models/Department')
  return mod.Department || mod.default
}

async function getFacultyModel() {
  const mod = await import('../models/Faculty')
  return mod.Faculty || mod.default
}

async function getCourseModel() {
  const mod = await import('../models/Course')
  return mod.Course || mod.default
}

async function getStudentRegistrationModel() {
  const mod = await import('../models/StudentRegistration')
  return mod.StudentRegistration || mod.default
}

async function getAnnouncementModel() {
  const mod = await import('../models/Announcement')
  return mod.Announcement || mod.default
}

async function getGradeModel() {
  const mod = await import('../models/Grade')
  return mod.Grade || mod.default
}

async function getProgramModel() {
  const mod = await import('../models/Program')
  return mod.Program || mod.default
}

async function getNotificationModel() {
  const mod = await import('../models/Notification')
  return mod.Notification || mod.default
}

async function getNotificationPreferencesModel() {
  const mod = await import('../models/NotificationPreferences')
  return mod.NotificationPreferences || mod.default
}

async function getPaymentModel() {
  const mod = await import('../models/Payment')
  return mod.Payment || mod.default
}

async function getLibraryMaterialModel() {
  const mod = await import('../models/LibraryMaterial')
  return mod.LibraryMaterial || mod.default
}

async function getPublicationModel() {
  const mod = await import('../models/Publication')
  return mod.Publication || mod.default
}

async function getResumeModel() {
  const mod = await import('../models/Resume')
  return mod.Resume || mod.default
}

async function getEnglishTestQuestionModel() {
  const mod = await import('../models/EnglishTestQuestion')
  return mod.EnglishTestQuestion || mod.default
}

async function getEnglishTestResultModel() {
  const mod = await import('../models/EnglishTestResult')
  return mod.EnglishTestResult || mod.default
}

async function getUserProfileModel() {
  const mod = await import('../models/UserProfile')
  return mod.UserProfile || mod.default
}

async function getEducationModel() {
  const mod = await import('../models/Education')
  return mod.Education || mod.default
}

async function getWorkExperienceModel() {
  const mod = await import('../models/WorkExperience')
  return mod.WorkExperience || mod.default
}

async function getLanguageSkillModel() {
  const mod = await import('../models/LanguageSkill')
  return mod.LanguageSkill || mod.default
}

async function getDiscordWebhookModel() {
  const mod = await import('../models/DiscordWebhook')
  return mod.DiscordWebhook || mod.default
}

async function getConnectionModel() {
  const mod = await import('../models/Connection')
  return mod.Connection || mod.default
}

async function getWorkflowModel() {
  const mod = await import('../models/Workflow')
  return mod.Workflow || mod.default
}

function convertPrismaOperators(where: any): any {
  if (!where || typeof where !== 'object') return where

  const converted: any = {}
  for (const key of Object.keys(where)) {
    const value = where[key]
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      if (value.in !== undefined) {
        converted[key] = { $in: value.in }
      } else if (value.notIn !== undefined) {
        converted[key] = { $nin: value.notIn }
      } else if (value.gte !== undefined) {
        converted[key] = { $gte: value.gte }
      } else if (value.lte !== undefined) {
        converted[key] = { $lte: value.lte }
      } else if (value.gt !== undefined) {
        converted[key] = { $gt: value.gt }
      } else if (value.lt !== undefined) {
        converted[key] = { $lt: value.lt }
      } else if (value.contains !== undefined) {
        converted[key] = { $regex: value.contains, $options: 'i' }
      } else if (value.startsWith !== undefined) {
        converted[key] = { $regex: `^${value.startsWith}`, $options: 'i' }
      } else if (value.endsWith !== undefined) {
        converted[key] = { $regex: `${value.endsWith}$`, $options: 'i' }
      } else if (value.equals !== undefined) {
        converted[key] = value.equals
      } else if (value.not !== undefined) {
        converted[key] = { $ne: value.not }
      } else {
        converted[key] = convertPrismaOperators(value)
      }
    } else {
      converted[key] = value
    }
  }
  return converted
}

function handleQuery(query: any) {
  const result: any = {}
  if (query.where) result.where = convertPrismaOperators(query.where)
  if (query.select) result.select = query.select
  if (query.orderBy) result.orderBy = query.orderBy
  if (query.include) result.include = query.include
  return result
}

function transformResult(doc: any): any {
  if (!doc) return doc
  if (doc._id) {
    doc.id = doc._id.toString()
  }
  return doc
}

function transformResults(docs: any[]): any[] {
  return docs.map(transformResult)
}

async function applyInclude(modelQuery: any, include: any) {
  if (!include) return modelQuery
  
  const populate: string[] = []
  for (const key of Object.keys(include)) {
    if (include[key] === true) {
      populate.push(key)
    } else if (typeof include[key] === 'object') {
      populate.push({
        path: key,
        ...include[key]
      })
    }
  }
  
  if (populate.length > 0) {
    return modelQuery.populate(populate)
  }
  return modelQuery
}

export const db = {
  user: {
    findUnique: async (query: { where: { clerkId: string } }) => {
      const User = await getUserModel()
      return User.findOne(query.where)
    },
    findFirst: async (query: any) => {
      const User = await getUserModel()
      const q = handleQuery(query)
      return User.findOne(q.where)
    },
    findMany: async (query: any) => {
      const User = await getUserModel()
      const q = handleQuery(query)
      let builder = User.find(q.where || {})
      if (q.orderBy) {
        const sortField = Object.keys(q.orderBy)[0]
        const sortOrder = Object.values(q.orderBy)[0] === 'desc' ? -1 : 1
        builder = builder.sort({ [sortField]: sortOrder })
      }
      return builder
    },
    create: async (data: any) => {
      const User = await getUserModel()
      return User.create(data)
    },
    update: async (query: { where: { clerkId: string }; data: any }) => {
      const User = await getUserModel()
      return User.findOneAndUpdate(query.where, query.data, { new: true })
    },
    upsert: async (query: { where: { clerkId: string }; create: any; update: any }) => {
      const User = await getUserModel()
      return User.findOneAndUpdate(query.where, query.update, { new: true, upsert: true })
    },
  },

  admissionApplication: {
    findFirst: async (query: any): Promise<any> => {
      const AdmissionApplication = await getAdmissionApplicationModel()
      const q = handleQuery(query)
      let queryBuilder = AdmissionApplication.find(q.where || {})
      
      if (q.orderBy) {
        const sortField = Object.keys(q.orderBy)[0]
        const sortOrder = Object.values(q.orderBy)[0] === 'desc' ? -1 : 1
        queryBuilder = queryBuilder.sort({ [sortField]: sortOrder })
      }
      
      if (q.select) {
        queryBuilder = queryBuilder.select(q.select) as any
      }
      
      const results = await queryBuilder.limit(1) as any[]
      return results[0] || null
    },
    findMany: async (query: any): Promise<any[]> => {
      const AdmissionApplication = await getAdmissionApplicationModel()
      const q = handleQuery(query)
      let queryBuilder: any = AdmissionApplication.find(q.where || {})
      
      if (q.orderBy) {
        const sortField = Object.keys(q.orderBy)[0]
        const sortOrder = Object.values(q.orderBy)[0] === 'desc' ? -1 : 1
        queryBuilder = queryBuilder.sort({ [sortField]: sortOrder })
      }
      
      return await queryBuilder
    },
    create: async (data: any) => {
      const AdmissionApplication = await getAdmissionApplicationModel()
      return AdmissionApplication.create(data)
    },
    update: async (query: { where: any; data: any }) => {
      const AdmissionApplication = await getAdmissionApplicationModel()
      return AdmissionApplication.findOneAndUpdate(query.where, query.data, { new: true })
    },
    findUnique: async (query: { where: { id: number } }) => {
      const AdmissionApplication = await getAdmissionApplicationModel()
      return AdmissionApplication.findOne(query.where)
    },
  },

  department: {
    findFirst: async (query: any) => {
      const Department = await getDepartmentModel()
      const q = handleQuery(query)
      return Department.findOne(q.where)
    },
    findMany: async (query: any) => {
      const Department = await getDepartmentModel()
      const q = handleQuery(query)
      return Department.find(q.where || {})
    },
    create: async (data: any) => {
      const Department = await getDepartmentModel()
      return Department.create(data)
    },
    update: async (query: { where: any; data: any }) => {
      const Department = await getDepartmentModel()
      return Department.findOneAndUpdate(query.where, query.data, { new: true })
    },
  },

  faculty: {
    findFirst: async (query: any) => {
      const Faculty = await getFacultyModel()
      const q = handleQuery(query)
      let result = Faculty.findOne(q.where)
      result = await applyInclude(result, q.include)
      return result
    },
    findUnique: async (query: { where: { id: number }; include?: any }) => {
      const Faculty = await getFacultyModel()
      let result = Faculty.findOne(query.where)
      result = await applyInclude(result, query.include)
      return result
    },
    findMany: async (query: any) => {
      const Faculty = await getFacultyModel()
      const q = handleQuery(query)
      let result = Faculty.find(q.where || {})
      if (q.orderBy) {
        const sortField = Object.keys(q.orderBy)[0]
        const sortOrder = Object.values(q.orderBy)[0] === 'desc' ? -1 : 1
        result = result.sort({ [sortField]: sortOrder })
      }
      result = await applyInclude(result, q.include)
      return result
    },
    create: async (data: any) => {
      const Faculty = await getFacultyModel()
      return Faculty.create(data)
    },
    update: async (query: { where: any; data: any }) => {
      const Faculty = await getFacultyModel()
      return Faculty.findOneAndUpdate(query.where, query.data, { new: true })
    },
  },

  course: {
    findFirst: async (query: any) => {
      const Course = await getCourseModel()
      const q = handleQuery(query)
      let result = Course.findOne(q.where)
      result = await applyInclude(result, q.include)
      return result
    },
    findUnique: async (query: { where: { id: number }; include?: any }) => {
      const Course = await getCourseModel()
      let result = Course.findOne(query.where)
      result = await applyInclude(result, query.include)
      return result
    },
    findMany: async (query: any) => {
      const Course = await getCourseModel()
      const q = handleQuery(query)
      let result = Course.find(q.where || {})
      if (q.orderBy) {
        const sortField = Object.keys(q.orderBy)[0]
        const sortOrder = Object.values(q.orderBy)[0] === 'desc' ? -1 : 1
        result = result.sort({ [sortField]: sortOrder })
      }
      result = await applyInclude(result, q.include)
      return result
    },
    create: async (data: any) => {
      const Course = await getCourseModel()
      return Course.create(data)
    },
    update: async (query: { where: any; data: any }) => {
      const Course = await getCourseModel()
      return Course.findOneAndUpdate(query.where, query.data, { new: true })
    },
    delete: async (query: { where: any }) => {
      const Course = await getCourseModel()
      return Course.deleteOne(query.where)
    },
  },

  studentRegistration: {
    findFirst: async (query: any) => {
      const StudentRegistration = await getStudentRegistrationModel()
      const q = handleQuery(query)
      let result = StudentRegistration.findOne(q.where)
      result = await applyInclude(result, q.include)
      return result
    },
    findUnique: async (query: { where: any; include?: any }) => {
      const StudentRegistration = await getStudentRegistrationModel()
      let result = StudentRegistration.findOne(query.where)
      result = await applyInclude(result, query.include)
      return result
    },
    findMany: async (query: any) => {
      const StudentRegistration = await getStudentRegistrationModel()
      const q = handleQuery(query)
      let result = StudentRegistration.find(q.where || {})
      result = await applyInclude(result, q.include)
      return result
    },
    create: async (data: any) => {
      const StudentRegistration = await getStudentRegistrationModel()
      return StudentRegistration.create(data)
    },
    update: async (query: { where: any; data: any }) => {
      const StudentRegistration = await getStudentRegistrationModel()
      return StudentRegistration.findOneAndUpdate(query.where, query.data, { new: true })
    },
  },

  announcement: {
    findFirst: async (query: any) => {
      const Announcement = await getAnnouncementModel()
      const q = handleQuery(query)
      return Announcement.findOne(q.where)
    },
    findMany: async (query: any) => {
      const Announcement = await getAnnouncementModel()
      const q = handleQuery(query)
      return Announcement.find(q.where || {})
    },
    create: async (data: any) => {
      const Announcement = await getAnnouncementModel()
      return Announcement.create(data)
    },
    update: async (query: { where: any; data: any }) => {
      const Announcement = await getAnnouncementModel()
      return Announcement.findOneAndUpdate(query.where, query.data, { new: true })
    },
  },

  grade: {
    findFirst: async (query: any) => {
      const Grade = await getGradeModel()
      const q = handleQuery(query)
      let result = Grade.findOne(q.where)
      result = await applyInclude(result, q.include)
      return result
    },
    findMany: async (query: any) => {
      const Grade = await getGradeModel()
      const q = handleQuery(query)
      let result = Grade.find(q.where || {})
      if (q.orderBy) {
        const sortField = Object.keys(q.orderBy)[0]
        const sortOrder = Object.values(q.orderBy)[0] === 'desc' ? -1 : 1
        result = result.sort({ [sortField]: sortOrder })
      }
      result = await applyInclude(result, q.include)
      return result
    },
    create: async (data: any) => {
      const Grade = await getGradeModel()
      return Grade.create(data)
    },
    update: async (query: { where: any; data: any }) => {
      const Grade = await getGradeModel()
      return Grade.findOneAndUpdate(query.where, query.data, { new: true })
    },
    delete: async (query: { where: any }) => {
      const Grade = await getGradeModel()
      return Grade.deleteOne(query.where)
    },
  },

  program: {
    findFirst: async (query: any) => {
      const Program = await getProgramModel()
      const q = handleQuery(query)
      return Program.findOne(q.where)
    },
    findMany: async (query: any) => {
      const Program = await getProgramModel()
      const q = handleQuery(query)
      return Program.find(q.where || {})
    },
    create: async (data: any) => {
      const Program = await getProgramModel()
      return Program.create(data)
    },
    update: async (query: { where: any; data: any }) => {
      const Program = await getProgramModel()
      return Program.findOneAndUpdate(query.where, query.data, { new: true })
    },
  },

  notification: {
    findFirst: async (query: any) => {
      const Notification = await getNotificationModel()
      const q = handleQuery(query)
      return Notification.findOne(q.where)
    },
    findMany: async (query: any) => {
      const Notification = await getNotificationModel()
      const q = handleQuery(query)
      return Notification.find(q.where || {})
    },
    create: async (data: any) => {
      const Notification = await getNotificationModel()
      return Notification.create(data)
    },
    update: async (query: { where: any; data: any }) => {
      const Notification = await getNotificationModel()
      return Notification.findOneAndUpdate(query.where, query.data, { new: true })
    },
    delete: async (query: { where: any }) => {
      const Notification = await getNotificationModel()
      return Notification.deleteOne(query.where)
    },
  },

  notificationPreferences: {
    findUnique: async (query: { where: { userId: string } }) => {
      const NotificationPreferences = await getNotificationPreferencesModel()
      return NotificationPreferences.findOne(query.where)
    },
    findFirst: async (query: any) => {
      const NotificationPreferences = await getNotificationPreferencesModel()
      const q = handleQuery(query)
      return NotificationPreferences.findOne(q.where)
    },
    create: async (data: any) => {
      const NotificationPreferences = await getNotificationPreferencesModel()
      return NotificationPreferences.create(data)
    },
    update: async (query: { where: { userId: string }; data: any }) => {
      const NotificationPreferences = await getNotificationPreferencesModel()
      return NotificationPreferences.findOneAndUpdate(query.where, query.data, { new: true })
    },
    upsert: async (query: { where: { userId: string }; create: any; update: any }) => {
      const NotificationPreferences = await getNotificationPreferencesModel()
      return NotificationPreferences.findOneAndUpdate(query.where, query.update, { new: true, upsert: true })
    },
  },

  payment: {
    findMany: async (query: any) => {
      const Payment = await getPaymentModel()
      const q = handleQuery(query)
      return Payment.find(q.where || {})
    },
    create: async (data: any) => {
      const Payment = await getPaymentModel()
      return Payment.create(data)
    },
    update: async (query: { where: any; data: any }) => {
      const Payment = await getPaymentModel()
      return Payment.findOneAndUpdate(query.where, query.data, { new: true })
    },
    updateMany: async (query: { where: any; data: any }) => {
      const Payment = await getPaymentModel()
      return Payment.updateMany(query.where, query.data)
    },
  },

  libraryMaterial: {
    findFirst: async (query: any) => {
      const LibraryMaterial = await getLibraryMaterialModel()
      const q = handleQuery(query)
      return LibraryMaterial.findOne(q.where)
    },
    findMany: async (query: any) => {
      const LibraryMaterial = await getLibraryMaterialModel()
      const q = handleQuery(query)
      return LibraryMaterial.find(q.where || {})
    },
    create: async (data: any) => {
      const LibraryMaterial = await getLibraryMaterialModel()
      return LibraryMaterial.create(data)
    },
  },

  publication: {
    findFirst: async (query: any) => {
      const Publication = await getPublicationModel()
      const q = handleQuery(query)
      return Publication.findOne(q.where)
    },
    findMany: async (query: any) => {
      const Publication = await getPublicationModel()
      const q = handleQuery(query)
      return Publication.find(q.where || {})
    },
    create: async (data: any) => {
      const Publication = await getPublicationModel()
      return Publication.create(data)
    },
  },

  resume: {
    findFirst: async (query: any) => {
      const Resume = await getResumeModel()
      const q = handleQuery(query)
      return Resume.findOne(q.where)
    },
    findUnique: async (query: { where: { userId: string } }) => {
      const Resume = await getResumeModel()
      return Resume.findOne(query.where)
    },
    create: async (data: any) => {
      const Resume = await getResumeModel()
      return Resume.create(data)
    },
    update: async (query: { where: any; data: any }) => {
      const Resume = await getResumeModel()
      return Resume.findOneAndUpdate(query.where, query.data, { new: true })
    },
  },

  englishTestQuestion: {
    findFirst: async (query: any) => {
      const EnglishTestQuestion = await getEnglishTestQuestionModel()
      const q = handleQuery(query)
      return EnglishTestQuestion.findOne(q.where)
    },
    findMany: async (query: any) => {
      const EnglishTestQuestion = await getEnglishTestQuestionModel()
      const q = handleQuery(query)
      return EnglishTestQuestion.find(q.where || {})
    },
    create: async (data: any) => {
      const EnglishTestQuestion = await getEnglishTestQuestionModel()
      return EnglishTestQuestion.create(data)
    },
  },

  englishTestResult: {
    findFirst: async (query: any) => {
      const EnglishTestResult = await getEnglishTestResultModel()
      const q = handleQuery(query)
      return EnglishTestResult.findOne(q.where)
    },
    findMany: async (query: any) => {
      const EnglishTestResult = await getEnglishTestResultModel()
      const q = handleQuery(query)
      return EnglishTestResult.find(q.where || {})
    },
    create: async (data: any) => {
      const EnglishTestResult = await getEnglishTestResultModel()
      return EnglishTestResult.create(data)
    },
  },

  userProfile: {
    findFirst: async (query: any) => {
      const UserProfile = await getUserProfileModel()
      const q = handleQuery(query)
      return UserProfile.findOne(q.where)
    },
    findUnique: async (query: { where: { userId: string } }) => {
      const UserProfile = await getUserProfileModel()
      return UserProfile.findOne(query.where)
    },
    create: async (data: any) => {
      const UserProfile = await getUserProfileModel()
      return UserProfile.create(data)
    },
    update: async (query: { where: any; data: any }) => {
      const UserProfile = await getUserProfileModel()
      return UserProfile.findOneAndUpdate(query.where, query.data, { new: true })
    },
  },

  education: {
    findFirst: async (query: any) => {
      const Education = await getEducationModel()
      const q = handleQuery(query)
      return Education.findOne(q.where)
    },
    findMany: async (query: any) => {
      const Education = await getEducationModel()
      const q = handleQuery(query)
      return Education.find(q.where || {})
    },
    create: async (data: any) => {
      const Education = await getEducationModel()
      return Education.create(data)
    },
  },

  workExperience: {
    findFirst: async (query: any) => {
      const WorkExperience = await getWorkExperienceModel()
      const q = handleQuery(query)
      return WorkExperience.findOne(q.where)
    },
    findMany: async (query: any) => {
      const WorkExperience = await getWorkExperienceModel()
      const q = handleQuery(query)
      return WorkExperience.find(q.where || {})
    },
    create: async (data: any) => {
      const WorkExperience = await getWorkExperienceModel()
      return WorkExperience.create(data)
    },
  },

  languageSkill: {
    findFirst: async (query: any) => {
      const LanguageSkill = await getLanguageSkillModel()
      const q = handleQuery(query)
      return LanguageSkill.findOne(q.where)
    },
    findMany: async (query: any) => {
      const LanguageSkill = await getLanguageSkillModel()
      const q = handleQuery(query)
      return LanguageSkill.find(q.where || {})
    },
    create: async (data: any) => {
      const LanguageSkill = await getLanguageSkillModel()
      return LanguageSkill.create(data)
    },
  },

  discordWebhook: {
    findFirst: async (query: any) => {
      const DiscordWebhook = await getDiscordWebhookModel()
      const q = handleQuery(query)
      return DiscordWebhook.findOne(q.where)
    },
    findMany: async (query: any) => {
      const DiscordWebhook = await getDiscordWebhookModel()
      const q = handleQuery(query)
      return DiscordWebhook.find(q.where || {})
    },
    create: async (data: any) => {
      const DiscordWebhook = await getDiscordWebhookModel()
      return DiscordWebhook.create(data)
    },
    update: async (query: { where: any; data: any }) => {
      const DiscordWebhook = await getDiscordWebhookModel()
      return DiscordWebhook.findOneAndUpdate(query.where, query.data, { new: true })
    },
    delete: async (query: { where: any }) => {
      const DiscordWebhook = await getDiscordWebhookModel()
      return DiscordWebhook.deleteOne(query.where)
    },
  },

  connection: {
    findFirst: async (query: any) => {
      const Connection = await getConnectionModel()
      const q = handleQuery(query)
      return Connection.findOne(q.where)
    },
    findMany: async (query: any) => {
      const Connection = await getConnectionModel()
      const q = handleQuery(query)
      return Connection.find(q.where || {})
    },
    create: async (data: any) => {
      const Connection = await getConnectionModel()
      return Connection.create(data)
    },
    update: async (query: { where: any; data: any }) => {
      const Connection = await getConnectionModel()
      return Connection.findOneAndUpdate(query.where, query.data, { new: true })
    },
    delete: async (query: { where: any }) => {
      const Connection = await getConnectionModel()
      return Connection.deleteOne(query.where)
    },
  },

  workflow: {
    findFirst: async (query: any) => {
      const Workflow = await getWorkflowModel()
      const q = handleQuery(query)
      return Workflow.findOne(q.where)
    },
    findMany: async (query: any) => {
      const Workflow = await getWorkflowModel()
      const q = handleQuery(query)
      return Workflow.find(q.where || {})
    },
    create: async (data: any) => {
      const Workflow = await getWorkflowModel()
      return Workflow.create(data)
    },
    update: async (query: { where: any; data: any }) => {
      const Workflow = await getWorkflowModel()
      return Workflow.findOneAndUpdate(query.where, query.data, { new: true })
    },
    delete: async (query: { where: any }) => {
      const Workflow = await getWorkflowModel()
      return Workflow.deleteOne(query.where)
    },
  },
}

export default mongoose
