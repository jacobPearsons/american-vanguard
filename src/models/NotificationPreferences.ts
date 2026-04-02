import mongoose, { Schema, Document, Model } from 'mongoose'

export interface INotificationPreferences extends Document {
  userId: string
  emailAdmissionUpdates: boolean
  emailApplicationStatus: boolean
  emailDeadlines: boolean
  emailNewFeatures: boolean
  emailMarketing: boolean
  pushAdmissionUpdates: boolean
  pushApplicationStatus: boolean
  pushDeadlines: boolean
  pushMessages: boolean
  createdAt: Date
  updatedAt: Date
}

const NotificationPreferencesSchema = new Schema<INotificationPreferences>(
  {
    userId: { type: String, required: true, unique: true },
    emailAdmissionUpdates: { type: Boolean, default: true },
    emailApplicationStatus: { type: Boolean, default: true },
    emailDeadlines: { type: Boolean, default: true },
    emailNewFeatures: { type: Boolean, default: true },
    emailMarketing: { type: Boolean, default: false },
    pushAdmissionUpdates: { type: Boolean, default: true },
    pushApplicationStatus: { type: Boolean, default: true },
    pushDeadlines: { type: Boolean, default: true },
    pushMessages: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const NotificationPreferencesModel = mongoose.models.NotificationPreferences
  ? mongoose.models.NotificationPreferences as Model<INotificationPreferences>
  : mongoose.model<INotificationPreferences>('NotificationPreferences', NotificationPreferencesSchema)

export { NotificationPreferencesModel as NotificationPreferences }
export default NotificationPreferencesModel
