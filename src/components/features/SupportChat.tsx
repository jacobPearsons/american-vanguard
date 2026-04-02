'use client'

import React, { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, Minimize2, Maximize2, User, Bot, Phone, Mail } from 'lucide-react'

interface Message {
  id: number
  sender: 'user' | 'support'
  text: string
  timestamp: Date
}

const defaultGreetings = [
  "Hello! How can I help you today?",
  "Hi there! What questions do you have?",
  "Welcome! How can we assist you?"
]

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = defaultGreetings[Math.floor(Math.random() * defaultGreetings.length)]
      setMessages([{
        id: 1,
        sender: 'support',
        text: greeting,
        timestamp: new Date()
      }])
    }
  }, [isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: inputText,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      const responses = [
        "Thank you for your message. Our team will look into this and get back to you shortly.",
        "I understand. Let me check that for you.",
        "Great question! Here's what I can tell you...",
        "I'll connect you with a support representative. Please wait a moment.",
      ]
      const supportMessage: Message = {
        id: Date.now() + 1,
        sender: 'support',
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      }
      setMessages(prev => [...prev, supportMessage])
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-yellow-600 rounded-full shadow-lg flex items-center justify-center hover:bg-yellow-700 transition-colors z-50"
      >
        <MessageCircle className="w-6 h-6 text-white" />
        <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
          1
        </span>
      </button>
    )
  }

  return (
    <div className={`fixed bottom-6 right-6 bg-white rounded-xl shadow-2xl z-50 transition-all ${
      isMinimized ? 'w-72 h-14' : 'w-80 h-[500px]'
    }`}>
      {isMinimized ? (
        <div className="p-3 flex items-center justify-between cursor-pointer" onClick={() => setIsMinimized(false)}>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-yellow-600" />
            <span className="font-medium text-gray-800">Support Chat</span>
          </div>
          <Maximize2 className="w-4 h-4 text-gray-400" />
        </div>
      ) : (
        <>
          <div className="bg-yellow-600 p-4 rounded-t-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Student Support</h3>
                <p className="text-xs text-yellow-200">Online • Usually responds in minutes</p>
              </div>
            </div>
            <button onClick={() => setIsMinimized(true)} className="text-white hover:text-yellow-200">
              <Minimize2 className="w-5 h-5" />
            </button>
          </div>

          <div className="h-[340px] overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <div className="flex items-start gap-2">
                    {message.sender === 'support' && (
                      <Bot className="w-4 h-4 text-yellow-600 mt-1 flex-shrink-0" />
                    )}
                    {message.sender === 'user' && (
                      <User className="w-4 h-4 text-yellow-200 mt-1 flex-shrink-0" />
                    )}
                    <p className="text-sm">{message.text}</p>
                  </div>
                  <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-yellow-200' : 'text-gray-400'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleSend}
                disabled={!inputText.trim()}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="flex justify-center gap-4 mt-3 text-gray-400">
              <button className="flex items-center gap-1 text-xs hover:text-gray-600">
                <Phone className="w-3 h-3" />
                <span>Call</span>
              </button>
              <button className="flex items-center gap-1 text-xs hover:text-gray-600">
                <Mail className="w-3 h-3" />
                <span>Email</span>
              </button>
            </div>
          </div>
        </>
      )}

      <button
        onClick={() => setIsOpen(false)}
        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  )
}