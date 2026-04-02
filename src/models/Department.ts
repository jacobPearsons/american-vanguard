import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IDepartment extends Document {
  name: string
  slug: string
  school: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

const DepartmentSchema = new Schema<IDepartment>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    school: { type: String, required: true },
    description: String,
  },
  { timestamps: true }
)

const DepartmentModel = mongoose.models.Department
  ? mongoose.models.Department as Model<IDepartment>
  : mongoose.model<IDepartment>('Department', DepartmentSchema)

export { DepartmentModel as Department }
export default DepartmentModel
