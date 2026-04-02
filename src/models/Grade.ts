import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IGrade extends Document {
  studentId: string
  courseId: number
  score: number
  grade: string
  semester: string
  academicYear: string
  createdAt: Date
}

const GradeSchema = new Schema<IGrade>(
  {
    studentId: { type: String, required: true },
    courseId: { type: Number, required: true },
    score: { type: Number, required: true },
    grade: { type: String, required: true },
    semester: { type: String, required: true },
    academicYear: { type: String, required: true },
  },
  { timestamps: true }
)

GradeSchema.index({ studentId: 1, courseId: 1, semester: 1, academicYear: 1 }, { unique: true })

GradeSchema.virtual('course', {
  ref: 'Course',
  localField: 'courseId',
  foreignField: 'id',
  justOne: true,
})

GradeSchema.set('toJSON', { virtuals: true })
GradeSchema.set('toObject', { virtuals: true })

const GradeModel = mongoose.models.Grade
  ? mongoose.models.Grade as Model<IGrade>
  : mongoose.model<IGrade>('Grade', GradeSchema)

export { GradeModel as Grade }
export default GradeModel
