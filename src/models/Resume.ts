import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IResume extends Document {
  userId: string
  fileName: string
  fileUrl: string
  fileType: string
  fileSize: number
  parsedData?: any
  isUploaded: boolean
  isVerified: boolean
  uploadedAt: Date
  updatedAt: Date
}

const ResumeSchema = new Schema<IResume>(
  {
    userId: { type: String, required: true, unique: true },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    parsedData: Schema.Types.Mixed,
    isUploaded: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
)

const ResumeModel = mongoose.models.Resume
  ? mongoose.models.Resume as Model<IResume>
  : mongoose.model<IResume>('Resume', ResumeSchema)

export { ResumeModel as Resume }
export default ResumeModel
