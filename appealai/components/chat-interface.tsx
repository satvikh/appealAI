"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Send, Mic, MicOff, Bot, User, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  type: "user" | "ai" | "suggestion"
  content: string
  timestamp: Date
  suggestions?: string[]
}

const initialMessages: Message[] = [
  {
    id: "1",
    type: "ai",
    content:
      "Hi! I'm here to help strengthen your parking violation dispute. I've analyzed your case and have a few questions that could help build a stronger argument. Shall we get started?",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: "2",
    type: "ai",
    content:
      "First, can you tell me more about the parking signs in the area? Were they clearly visible when you parked?",
    timestamp: new Date(Date.now() - 4 * 60 * 1000),
    suggestions: [
      "The signs were blocked by tree branches",
      "There were no visible signs",
      "The signs were faded and hard to read",
      "Signs were clearly visible",
    ],
  },
]

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(
      () => {
        const aiResponses = [
          {
            content:
              "That's helpful information. Based on what you've told me, we can argue that the signage was inadequate. Can you describe the exact time you parked and how long you were there?",
            suggestions: [
              "I was there for about 30 minutes",
              "Less than 15 minutes",
              "Over an hour",
              "I'm not sure exactly",
            ],
          },
          {
            content:
              "Perfect! This timing information strengthens your case. Were there any other vehicles parked in the same area that didn't receive tickets?",
            suggestions: [
              "Yes, several other cars",
              "No, the area was empty",
              "I didn't notice",
              "Only my car got a ticket",
            ],
          },
          {
            content:
              "Excellent point! This could indicate selective enforcement. Do you have any photos of the parking area or the signs from that day?",
            suggestions: [
              "Yes, I took photos",
              "No, but I can go back",
              "I have some photos on my phone",
              "I didn't think to take any",
            ],
          },
        ]

        const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: randomResponse.content,
          timestamp: new Date(),
          suggestions: randomResponse.suggestions,
        }

        setMessages((prev) => [...prev, aiMessage])
        setIsTyping(false)
      },
      1500 + Math.random() * 1000,
    )
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // In a real app, this would start/stop voice recording
    if (!isRecording) {
      // Simulate voice input after 3 seconds
      setTimeout(() => {
        setIsRecording(false)
        setInputValue("The parking signs were completely blocked by overgrown tree branches")
      }, 3000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(inputValue)
    }
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={cn("flex", message.type === "user" ? "justify-end" : "justify-start")}>
              <div className={cn("flex gap-3 max-w-[80%]", message.type === "user" ? "flex-row-reverse" : "flex-row")}>
                {/* Avatar */}
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                  )}
                >
                  {message.type === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                {/* Message Content */}
                <div className="space-y-2">
                  <div
                    className={cn(
                      "rounded-lg px-4 py-2",
                      message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                    )}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>

                  {/* Suggestions */}
                  {message.suggestions && (
                    <div className="space-y-2 fade-in">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Lightbulb className="h-3 w-3" />
                        Quick responses:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-xs h-7 bg-transparent hover:bg-primary hover:text-primary-foreground transition-colors"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Timestamp */}
                  <p className="text-xs text-muted-foreground">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-muted rounded-lg px-4 py-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full typing-dot"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full typing-dot"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full typing-dot"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-4">
          {isRecording && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Recording... Speak now</span>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about your case or describe the situation..."
                className="w-full px-3 py-2 pr-12 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                disabled={isRecording}
              />
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className={cn(
                  "absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0",
                  isRecording ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-foreground",
                )}
                onClick={toggleRecording}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            </div>
            <Button
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isRecording}
              className="px-4"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-2 text-xs text-muted-foreground">
            Press Enter to send • Click mic for voice input • Use suggested responses for quick answers
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
