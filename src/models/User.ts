import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IUser extends Document {
  clerkId: string
  email: string
  name?: string
  firstName?: string
  lastName?: string
  profileImage?: string
  phone?: string
  dateOfBirth?: Date
  address?: string
  city?: string
  country?: string
  nationality?: string
  isVerified: boolean
  emailVerified: boolean
  englishTestScore?: number
  englishTestDate?: Date
  englishTestLevel?: string
  tier: string
  credits: string
  googleResourceId?: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: String,
    firstName: String,
    lastName: String,
    profileImage: String,
    phone: String,
    dateOfBirth: Date,
    address: String,
    city: String,
    country: String,
    nationality: String,
    isVerified: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    englishTestScore: Number,
    englishTestDate: Date,
    englishTestLevel: String,
    tier: { type: String, default: 'Free' },
    credits: { type: String, default: '10' },
    googleResourceId: String,
  },
  { timestamps: true }
)

const UserModel = mongoose.models.User 
  ? mongoose.models.User as Model<IUser>
  : mongoose.model<IUser>('User', UserSchema)

export { UserModel as User }
export default UserModel
