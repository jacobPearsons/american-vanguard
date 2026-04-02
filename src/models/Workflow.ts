import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IWorkflow extends Document {
  userId: string
  name: string
  description?: string
  isActive: boolean
  nodes?: any
  edges?: any
  googleResourceId?: string
  createdAt: Date
  updatedAt: Date
}

const WorkflowSchema = new Schema<IWorkflow>(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    description: String,
    isActive: { type: Boolean, default: true },
    nodes: Schema.Types.Mixed,
    edges: Schema.Types.Mixed,
    googleResourceId: String,
  },
  { timestamps: true }
)

const WorkflowModel = mongoose.models.Workflow
  ? mongoose.models.Workflow as Model<IWorkflow>
  : mongoose.model<IWorkflow>('Workflow', WorkflowSchema)

export { WorkflowModel as Workflow }
export default WorkflowModel
