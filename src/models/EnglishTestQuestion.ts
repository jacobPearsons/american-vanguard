import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IEnglishTestQuestion extends Document {
  question: string
  questionType: 'READING' | 'WRITING' | 'LISTENING' | 'SPEAKING' | 'GRAMMAR' | 'VOCABULARY' | 'MULTIPLE_CHOICE'
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  options?: any
  correctAnswer: string
  explanation?: string
  category: 'GRAMMAR' | 'VOCABULARY' | 'READING' | 'WRITING' | 'LISTENING' | 'SPEAKING' | 'COMPREHENSION'
  points: number
  isActive: boolean
  createdAt: Date
}

const EnglishTestQuestionSchema = new Schema<IEnglishTestQuestion>(
  {
    question: { type: String, required: true },
    questionType: { 
      type: String, 
      enum: ['READING', 'WRITING', 'LISTENING', 'SPEAKING', 'GRAMMAR', 'VOCABULARY', 'MULTIPLE_CHOICE'],
      required: true 
    },
    difficulty: { type: String, enum: ['EASY', 'MEDIUM', 'HARD'], required: true },
    options: Schema.Types.Mixed,
    correctAnswer: { type: String, required: true },
    explanation: String,
    category: { 
      type: String, 
      enum: ['GRAMMAR', 'VOCABULARY', 'READING', 'WRITING', 'LISTENING', 'SPEAKING', 'COMPREHENSION'],
      required: true 
    },
    points: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const EnglishTestQuestionModel = mongoose.models.EnglishTestQuestion
  ? mongoose.models.EnglishTestQuestion as Model<IEnglishTestQuestion>
  : mongoose.model<IEnglishTestQuestion>('EnglishTestQuestion', EnglishTestQuestionSchema)

export { EnglishTestQuestionModel as EnglishTestQuestion }
export default EnglishTestQuestionModel
