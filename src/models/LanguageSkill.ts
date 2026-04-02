import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ILanguageSkill extends Document {
  profileId: number
  language: string
  proficiency: 'BEGINNER' | 'ELEMENTARY' | 'INTERMEDIATE' | 'ADVANCED' | 'NATIVE'
}

const LanguageSkillSchema = new Schema<ILanguageSkill>(
  {
    profileId: { type: Number, required: true },
    language: { type: String, required: true },
    proficiency: { 
      type: String, 
      enum: ['BEGINNER', 'ELEMENTARY', 'INTERMEDIATE', 'ADVANCED', 'NATIVE'],
      required: true 
    },
  },
  { timestamps: true }
)

const LanguageSkillModel = mongoose.models.LanguageSkill
  ? mongoose.models.LanguageSkill as Model<ILanguageSkill>
  : mongoose.model<ILanguageSkill>('LanguageSkill', LanguageSkillSchema)

export { LanguageSkillModel as LanguageSkill }
export default LanguageSkillModel
