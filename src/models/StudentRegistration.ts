import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IStudentRegistration extends Document {
  studentId: string
  courseId: number
  status: 'ENROLLED' | 'DROPPED' | 'COMPLETED'
  semester: string
  academicYear: string
  enrolledAt: Date
  droppedAt?: Date
}

const StudentRegistrationSchema = new Schema<IStudentRegistration>(
  {
    studentId: { type: String, required: true },
    courseId: { type: Number, required: true },
    status: { type: String, enum: ['ENROLLED', 'DROPPED', 'COMPLETED'], default: 'ENROLLED' },
    semester: { type: String, required: true },
    academicYear: { type: String, required: true },
    enrolledAt: { type: Date, default: Date.now },
    droppedAt: Date,
  },
  { timestamps: true }
)

StudentRegistrationSchema.index({ studentId: 1, courseId: 1, academicYear: 1, semester: 1 }, { unique: true })

StudentRegistrationSchema.virtual('course', {
  ref: 'Course',
  localField: 'courseId',
  foreignField: 'id',
  justOne: true,
})

StudentRegistrationSchema.set('toJSON', { virtuals: true })
StudentRegistrationSchema.set('toObject', { virtuals: true })

const StudentRegistrationModel = mongoose.models.StudentRegistration
  ? mongoose.models.StudentRegistration as Model<IStudentRegistration>
  : mongoose.model<IStudentRegistration>('StudentRegistration', StudentRegistrationSchema)

export { StudentRegistrationModel as StudentRegistration }
export default StudentRegistrationModel
