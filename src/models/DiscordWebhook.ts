import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IDiscordWebhook extends Document {
  userId: string
  webhookId: string
  channelId?: string
  guildId?: string
  guildName?: string
  name?: string
  url?: string
  createdAt: Date
  updatedAt: Date
}

const DiscordWebhookSchema = new Schema<IDiscordWebhook>(
  {
    userId: { type: String, required: true },
    webhookId: { type: String, required: true },
    channelId: String,
    guildId: String,
    guildName: String,
    name: String,
    url: String,
  },
  { timestamps: true }
)

const DiscordWebhookModel = mongoose.models.DiscordWebhook
  ? mongoose.models.DiscordWebhook as Model<IDiscordWebhook>
  : mongoose.model<IDiscordWebhook>('DiscordWebhook', DiscordWebhookSchema)

export { DiscordWebhookModel as DiscordWebhook }
export default DiscordWebhookModel
