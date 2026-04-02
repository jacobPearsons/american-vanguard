import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IEnglishTestResult extends Document {
  userId: string
  testType: 'PLACEMENT' | 'CERTIFICATION' | 'SKILLS_ASSESSMENT'
  score: number
  totalQuestions: number
  correctAnswers: number
  duration: number
  breakdown?: any
  level: 'BEGINNER' | 'ELEMENTARY' | 'INTERMEDIATE' | 'UPPER_INTERMEDIATE' | 'ADVANCED' | 'NATIVE'
  passed: boolean
  completedAt: Date
  certificateUrl?: string
}

const EnglishTestResultSchema = new Schema<IEnglishTestResult>(
  {
    userId: { type: String, required: true },
    testType: { 
      type: String, 
      enum: ['PLACEMENT', 'CERTIFICATION', 'SKILLS_ASSESSMENT'],
      required: true 
    },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    duration: { type: Number, required: true },
    breakdown: Schema.Types.Mixed,
    level: { 
      type: String, 
      enum: ['BEGINNER', 'ELEMENTARY', 'INTERMEDIATE', 'UPPER_INTERMEDIATE', 'ADVANCED', 'NATIVE'],
      required: true 
    },
    passed: { type: Boolean, required: true },
    completedAt: { type: Date, default: Date.now },
    certificateUrl: String,
  },
  { timestamps: true }
)

const EnglishTestResultModel = mongoose.models.EnglishTestResult
  ? mongoose.models.EnglishTestResult as Model<IEnglishTestResult>
  : mongoose.model<IEnglishTestResult>('EnglishTestResult', EnglishTestResultSchema)

export { EnglishTestResultModel as EnglishTestResult }
export default EnglishTestResultModel
