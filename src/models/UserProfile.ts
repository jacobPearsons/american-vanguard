import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IUserProfile extends Document {
  userId: string
  summary?: string
  skills?: string[]
  remoteWork: boolean
  relocate: boolean
  preferredLocations?: string[]
  createdAt: Date
  updatedAt: Date
}

const UserProfileSchema = new Schema<IUserProfile>(
  {
    userId: { type: String, required: true, unique: true },
    summary: String,
    skills: [{ type: String }],
    remoteWork: { type: Boolean, default: false },
    relocate: { type: Boolean, default: false },
    preferredLocations: [{ type: String }],
  },
  { timestamps: true }
)

const UserProfileModel = mongoose.models.UserProfile
  ? mongoose.models.UserProfile as Model<IUserProfile>
  : mongoose.model<IUserProfile>('UserProfile', UserProfileSchema)

export { UserProfileModel as UserProfile }
export default UserProfileModel
