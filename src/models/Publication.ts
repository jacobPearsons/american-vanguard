import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IPublication extends Document {
  title: string
  journal?: string
  year: number
  url?: string
  facultyId: number
  createdAt: Date
}

const PublicationSchema = new Schema<IPublication>(
  {
    title: { type: String, required: true },
    journal: String,
    year: { type: Number, required: true },
    url: String,
    facultyId: { type: Number, required: true },
  },
  { timestamps: true }
)

const PublicationModel = mongoose.models.Publication
  ? mongoose.models.Publication as Model<IPublication>
  : mongoose.model<IPublication>('Publication', PublicationSchema)

export { PublicationModel as Publication }
export default PublicationModel
