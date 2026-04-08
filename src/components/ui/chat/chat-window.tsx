import React from 'react'
import { User, MessageCircle } from 'lucide-react'

export interface Conversation {
  id: number
  otherUserName: string
  [key: string]: unknown
}

interface ChatWindowProps {
  selectedConversation: Conversation | null
  messages: React.ReactNode
  emptyStateText?: string
  emptyStateSubtext?: string
}

/**
 * Chat window container that displays the conversation header,
 * message thread area, and handles empty state display.
 */
export function ChatWindow({
  selectedConversation,
  messages,
  emptyStateText = 'Select a conversation',
  emptyStateSubtext = 'Choose a conversation to start messaging'
}: ChatWindowProps) {
  if (!selectedConversation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
          <p className="text-neutral-500 text-lg">{emptyStateText}</p>
          <p className="text-neutral-600 text-sm mt-2">{emptyStateSubtext}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center">
            <User className="w-5 h-5 text-neutral-400" />
          </div>
          <div>
            <p className="font-medium text-white">{selectedConversation.otherUserName}</p>
            <p className="text-xs text-neutral-500">Online</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {messages}
      </div>
    </div>
  )
}