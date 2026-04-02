import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IFaculty extends Document {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  title: string
  departmentId: number
  photoUrl?: string
  bio?: string
  researchArea?: string
  office?: string
  officeHours?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const FacultySchema = new Schema<IFaculty>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: String,
    phone: String,
    title: { type: String, required: true },
    departmentId: { type: Number, required: true },
    photoUrl: String,
    bio: String,
    researchArea: String,
    office: String,
    officeHours: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

FacultySchema.virtual('department', {
  ref: 'Department',
  localField: 'departmentId',
  foreignField: 'id',
  justOne: true,
})

FacultySchema.virtual('courses', {
  ref: 'Course',
  localField: 'id',
  foreignField: 'instructorId',
})

FacultySchema.virtual('publications', {
  ref: 'Publication',
  localField: 'id',
  foreignField: 'facultyId',
})

FacultySchema.set('toJSON', { virtuals: true })
FacultySchema.set('toObject', { virtuals: true })

const FacultyModel = mongoose.models.Faculty
  ? mongoose.models.Faculty as Model<IFaculty>
  : mongoose.model<IFaculty>('Faculty', FacultySchema)

export { FacultyModel as Faculty }
export default FacultyModel
