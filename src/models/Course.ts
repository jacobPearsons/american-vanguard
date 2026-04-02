import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ICourse extends Document {
  code: string
  name: string
  slug: string
  description?: string
  credits: number
  departmentId: number
  schedule?: any
  maxCapacity: number
  enrolledCount: number
  prerequisites?: any
  isActive: boolean
  semester: string
  academicYear: string
  instructorId?: number
  createdAt: Date
  updatedAt: Date
}

const CourseSchema = new Schema<ICourse>(
  {
    code: { type: String, required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    credits: { type: Number, default: 3 },
    departmentId: { type: Number, required: true },
    schedule: Schema.Types.Mixed,
    maxCapacity: { type: Number, default: 50 },
    enrolledCount: { type: Number, default: 0 },
    prerequisites: Schema.Types.Mixed,
    isActive: { type: Boolean, default: true },
    semester: { type: String, required: true },
    academicYear: { type: String, required: true },
    instructorId: Number,
  },
  { timestamps: true }
)

CourseSchema.virtual('department', {
  ref: 'Department',
  localField: 'departmentId',
  foreignField: 'id',
  justOne: true,
})

CourseSchema.virtual('instructor', {
  ref: 'Faculty',
  localField: 'instructorId',
  foreignField: 'id',
  justOne: true,
})

CourseSchema.set('toJSON', { virtuals: true })
CourseSchema.set('toObject', { virtuals: true })

const CourseModel = mongoose.models.Course
  ? mongoose.models.Course as Model<ICourse>
  : mongoose.model<ICourse>('Course', CourseSchema)

export { CourseModel as Course }
export default CourseModel
