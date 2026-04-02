import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IAdmissionApplication extends Document {
  userId: string
  admissionType: 'UNDERGRADUATE' | 'GRADUATE' | 'TRANSFER' | 'INTERNATIONAL'
  applicationTerm: 'FALL_2025' | 'SPRING_2026' | 'SUMMER_2026' | 'FALL_2026'
  currentStage: string
  status: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  dateOfBirth?: Date
  gender?: string
  city?: string
  state?: string
  country?: string
  citizenship?: string
  isInternational: boolean
  highSchoolName?: string
  highSchoolCountry?: string
  highSchoolGPA?: number
  satScore?: number
  actScore?: number
  undergradSchool?: string
  undergradDegree?: string
  undergradMajor?: string
  undergradGPA?: number
  greScore?: number
  gmatScore?: number
  toeflScore?: number
  ieltsScore?: number
  programOfInterest?: string
  majorFirstChoice?: string
  majorSecondChoice?: string
  hasTranscript?: boolean
  hasRecommendation?: boolean
  hasEssay?: boolean
  hasTestScores?: boolean
  essayTopic?: string
  essayContent?: string
  extracurriculars?: string
  workExperience?: string
  currentAddress?: string
  postalCode?: string
  requestFinancialAid: boolean
  scholarshipInterest: boolean
  submissionDate?: Date
  reviewedBy?: string
  reviewNotes?: string
  reviewDate?: Date
  createdAt: Date
  updatedAt: Date
}

const AdmissionApplicationSchema = new Schema<IAdmissionApplication>(
  {
    userId: { type: String, required: true, index: true },
    admissionType: { 
      type: String, 
      enum: ['UNDERGRADUATE', 'GRADUATE', 'TRANSFER', 'INTERNATIONAL'],
      required: true 
    },
    applicationTerm: { 
      type: String, 
      enum: ['FALL_2025', 'SPRING_2026', 'SUMMER_2026', 'FALL_2026'],
      required: true 
    },
    currentStage: { type: String, default: 'PROGRAM_DISCOVERY' },
    status: { type: String, default: 'DRAFT' },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    dateOfBirth: Date,
    gender: String,
    city: String,
    state: String,
    country: String,
    citizenship: String,
    isInternational: { type: Boolean, default: false },
    highSchoolName: String,
    highSchoolCountry: String,
    highSchoolGPA: Number,
    satScore: Number,
    actScore: Number,
    undergradSchool: String,
    undergradDegree: String,
    undergradMajor: String,
    undergradGPA: Number,
    greScore: Number,
    gmatScore: Number,
    toeflScore: Number,
    ieltsScore: Number,
    programOfInterest: String,
    majorFirstChoice: String,
    majorSecondChoice: String,
    hasTranscript: { type: Boolean, default: false },
    hasRecommendation: { type: Boolean, default: false },
    hasEssay: { type: Boolean, default: false },
    hasTestScores: { type: Boolean, default: false },
    essayTopic: String,
    essayContent: String,
    extracurriculars: String,
    workExperience: String,
    currentAddress: String,
    postalCode: String,
    requestFinancialAid: { type: Boolean, default: false },
    scholarshipInterest: { type: Boolean, default: false },
    submissionDate: Date,
    reviewedBy: String,
    reviewNotes: String,
    reviewDate: Date,
  },
  { timestamps: true }
)

const AdmissionApplicationModel = mongoose.models.AdmissionApplication 
  ? mongoose.models.AdmissionApplication as Model<IAdmissionApplication>
  : mongoose.model<IAdmissionApplication>('AdmissionApplication', AdmissionApplicationSchema)

export { AdmissionApplicationModel as AdmissionApplication }
export default AdmissionApplicationModel
