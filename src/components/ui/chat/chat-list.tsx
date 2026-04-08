import React from 'react'
import { User, MessageCircle, Loader2 } from 'lucide-react'

export interface Conversation {
  id: number
  participants: string[]
  otherUserId: string | null
  otherUserName: string
  lastMessage: {
    content: string
    createdAt: string
    isRead: boolean
  } | null
  lastMessageAt: string
}

interface ChatListProps {
  conversations: Conversation[]
  selectedConversation: Conversation | null
  onSelect: (conversation: Conversation) => void
  loading?: boolean
  searchPlaceholder?: string
  emptyText?: string
}

/**
 * Displays a scrollable list of conversations with search functionality.
 * Supports selection highlighting and loading states.
 */
export function ChatList({
  conversations,
  selectedConversation,
  onSelect,
  loading = false,
  searchPlaceholder = 'Search conversations...',
  emptyText = 'No conversations yet'
}: ChatListProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-neutral-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Messages
        </h2>
      </div>

      <div className="p-3 border-b border-neutral-800">
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-600"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-6 h-6 text-yellow-600 animate-spin" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-8 text-center">
            <MessageCircle className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
            <p className="text-neutral-500 text-sm">{emptyText}</p>
          </div>
        ) : (
          conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelect(conv)}
              className={`w-full p-4 text-left border-b border-neutral-800 transition-colors ${
                selectedConversation?.id === conv.id
                  ? 'bg-yellow-600/20'
                  : 'hover:bg-neutral-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center">
                  <User className="w-5 h-5 text-neutral-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-white truncate">{conv.otherUserName}</p>
                    <span className="text-xs text-neutral-500">
                      {conv.lastMessageAt ? formatDate(conv.lastMessageAt) : ''}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-400 truncate mt-1">
                    {conv.lastMessage?.content || 'No messages yet'}
                  </p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}