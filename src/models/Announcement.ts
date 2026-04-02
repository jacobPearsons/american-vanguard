import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IAnnouncement extends Document {
  title: string
  content: string
  type: 'GENERAL' | 'DEPARTMENT' | 'DEADLINE'
  departmentId?: number
  isPinned: boolean
  isActive: boolean
  publishedAt: Date
  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ['GENERAL', 'DEPARTMENT', 'DEADLINE'], default: 'GENERAL' },
    departmentId: Number,
    isPinned: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
    expiresAt: Date,
  },
  { timestamps: true }
)

const AnnouncementModel = mongoose.models.Announcement
  ? mongoose.models.Announcement as Model<IAnnouncement>
  : mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema)

export { AnnouncementModel as Announcement }
export default AnnouncementModel
