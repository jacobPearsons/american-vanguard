import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IProgram extends Document {
  name: string
  slug: string
  description?: string
  shortDescription?: string
  programType: 'UNDERGRADUATE' | 'GRADUATE' | 'TRANSFER' | 'INTERNATIONAL' | 'CERTIFICATE' | 'ONLINE'
  degreeLevel: string
  department?: string
  school?: string
  duration?: string
  durationWeeks?: number
  requirements?: string
  minimumGPA?: number
  requiresGRE: boolean
  requiresGMAT: boolean
  tuitionDomestic?: number
  tuitionInternational?: number
  applicationFee?: number
  isActive: boolean
  isFeatured: boolean
  acceptsApplications: boolean
  availableTerms: string[]
  applicationsCount: number
  acceptanceRate?: number
  createdAt: Date
  updatedAt: Date
}

const ProgramSchema = new Schema<IProgram>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    shortDescription: String,
    programType: { 
      type: String, 
      enum: ['UNDERGRADUATE', 'GRADUATE', 'TRANSFER', 'INTERNATIONAL', 'CERTIFICATE', 'ONLINE'],
      required: true 
    },
    degreeLevel: { type: String, required: true },
    department: String,
    school: String,
    duration: String,
    durationWeeks: Number,
    requirements: String,
    minimumGPA: Number,
    requiresGRE: { type: Boolean, default: false },
    requiresGMAT: { type: Boolean, default: false },
    tuitionDomestic: Number,
    tuitionInternational: Number,
    applicationFee: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    acceptsApplications: { type: Boolean, default: true },
    availableTerms: [{ type: String }],
    applicationsCount: { type: Number, default: 0 },
    acceptanceRate: Number,
  },
  { timestamps: true }
)

const ProgramModel = mongoose.models.Program
  ? mongoose.models.Program as Model<IProgram>
  : mongoose.model<IProgram>('Program', ProgramSchema)

export { ProgramModel as Program }
export default ProgramModel
