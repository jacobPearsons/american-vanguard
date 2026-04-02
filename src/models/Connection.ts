import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IConnection extends Document {
  userId: string
  type: 'DISCORD' | 'SLACK' | 'NOTION' | 'GOOGLE'
  accessToken?: string
  refreshToken?: string
  expiresAt?: Date
  metadata?: any
  createdAt: Date
  updatedAt: Date
}

const ConnectionSchema = new Schema<IConnection>(
  {
    userId: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['DISCORD', 'SLACK', 'NOTION', 'GOOGLE'],
      required: true 
    },
    accessToken: String,
    refreshToken: String,
    expiresAt: Date,
    metadata: Schema.Types.Mixed,
  },
  { timestamps: true }
)

const ConnectionModel = mongoose.models.Connection
  ? mongoose.models.Connection as Model<IConnection>
  : mongoose.model<IConnection>('Connection', ConnectionSchema)

export { ConnectionModel as Connection }
export default ConnectionModel
