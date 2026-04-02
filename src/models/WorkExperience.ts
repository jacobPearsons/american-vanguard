import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IWorkExperience extends Document {
  profileId: number
  companyName: string
  jobTitle: string
  location?: string
  startDate: Date
  endDate?: Date
  isCurrent: boolean
  description?: string
}

const WorkExperienceSchema = new Schema<IWorkExperience>(
  {
    profileId: { type: Number, required: true },
    companyName: { type: String, required: true },
    jobTitle: { type: String, required: true },
    location: String,
    startDate: { type: Date, required: true },
    endDate: Date,
    isCurrent: { type: Boolean, default: false },
    description: String,
  },
  { timestamps: true }
)

const WorkExperienceModel = mongoose.models.WorkExperience
  ? mongoose.models.WorkExperience as Model<IWorkExperience>
  : mongoose.model<IWorkExperience>('WorkExperience', WorkExperienceSchema)

export { WorkExperienceModel as WorkExperience }
export default WorkExperienceModel
