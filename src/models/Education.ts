import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IEducation extends Document {
  profileId: number
  institution: string
  degree: string
  fieldOfStudy?: string
  startDate: Date
  endDate?: Date
  isCurrent: boolean
  grade?: string
  description?: string
}

const EducationSchema = new Schema<IEducation>(
  {
    profileId: { type: Number, required: true },
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    fieldOfStudy: String,
    startDate: { type: Date, required: true },
    endDate: Date,
    isCurrent: { type: Boolean, default: false },
    grade: String,
    description: String,
  },
  { timestamps: true }
)

const EducationModel = mongoose.models.Education
  ? mongoose.models.Education as Model<IEducation>
  : mongoose.model<IEducation>('Education', EducationSchema)

export { EducationModel as Education }
export default EducationModel
