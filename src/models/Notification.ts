import mongoose, { Schema, Document, Model } from 'mongoose'

export interface INotification extends Document {
  userId: string
  title: string
  message: string
  type: 'ADMISSION_RECEIVED' | 'ADMISSION_ACCEPTED' | 'ADMISSION_REJECTED' | 'ADMISSION_WAITLISTED' | 'DOCUMENT_REQUESTED' | 'INTERVIEW_SCHEDULED' | 'DECISION_MADE' | 'ENROLLMENT_DEADLINE' | 'PROFILE_VIEWED' | 'MESSAGE' | 'ENGLISH_TEST_INVITE'
  data?: any
  link?: string
  isRead: boolean
  readAt?: Date
  createdAt: Date
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['ADMISSION_RECEIVED', 'ADMISSION_ACCEPTED', 'ADMISSION_REJECTED', 'ADMISSION_WAITLISTED', 'DOCUMENT_REQUESTED', 'INTERVIEW_SCHEDULED', 'DECISION_MADE', 'ENROLLMENT_DEADLINE', 'PROFILE_VIEWED', 'MESSAGE', 'ENGLISH_TEST_INVITE'],
      required: true 
    },
    data: Schema.Types.Mixed,
    link: String,
    isRead: { type: Boolean, default: false },
    readAt: Date,
  },
  { timestamps: true }
)

const NotificationModel = mongoose.models.Notification
  ? mongoose.models.Notification as Model<INotification>
  : mongoose.model<INotification>('Notification', NotificationSchema)

export { NotificationModel as Notification }
export default NotificationModel
