import React from 'react'

export interface Message {
  id: number
  senderId: string
  content: string
  createdAt: string
  isRead: boolean
}

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
  timestampFormat?: (dateStr: string) => string
}

/**
 * Individual message bubble component.
 * Displays message content with alignment and styling based on sender.
 */
export function MessageBubble({
  message,
  isOwn,
  timestampFormat
}: MessageBubbleProps) {
  const formatTime = timestampFormat || ((dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  })

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] px-4 py-2 rounded-lg ${
          isOwn
            ? 'bg-yellow-600 text-white'
            : 'bg-neutral-800 text-neutral-200'
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <p className={`text-xs mt-1 ${isOwn ? 'text-yellow-100' : 'text-neutral-500'}`}>
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  )
}