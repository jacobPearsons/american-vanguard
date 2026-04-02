import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IPayment extends Document {
  amount: number
  studentId: string
  description?: string
  reference: string
  status: string
  paymentType?: string
  paidAt?: Date
  createdAt: Date
  updatedAt: Date
}

const PaymentSchema = new Schema<IPayment>(
  {
    amount: { type: Number, required: true },
    studentId: { type: String, required: true },
    description: String,
    reference: { type: String, required: true, unique: true },
    status: { type: String, default: 'pending' },
    paymentType: String,
    paidAt: Date,
  },
  { timestamps: true }
)

const PaymentModel = mongoose.models.Payment
  ? mongoose.models.Payment as Model<IPayment>
  : mongoose.model<IPayment>('Payment', PaymentSchema)

export { PaymentModel as Payment }
export default PaymentModel
