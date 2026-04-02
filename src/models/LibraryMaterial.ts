import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ILibraryMaterial extends Document {
  title: string
  description?: string
  fileUrl: string
  fileType: string
  courseId: number
  category: string
  departmentId: number
  uploadedBy?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const LibraryMaterialSchema = new Schema<ILibraryMaterial>(
  {
    title: { type: String, required: true },
    description: String,
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true },
    courseId: { type: Number, required: true },
    category: { type: String, required: true },
    departmentId: { type: Number, required: true },
    uploadedBy: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const LibraryMaterialModel = mongoose.models.LibraryMaterial
  ? mongoose.models.LibraryMaterial as Model<ILibraryMaterial>
  : mongoose.model<ILibraryMaterial>('LibraryMaterial', LibraryMaterialSchema)

export { LibraryMaterialModel as LibraryMaterial }
export default LibraryMaterialModel
