"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Upload, MessageCircle, Send, Shield, Paperclip, Mic, MicOff, Zap } from "lucide-react"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "⚡ Welcome to AppealAI - your advanced dispute resolution system. Upload your parking ticket or housing charge notice, and I'll analyze it to craft a professional dispute letter. What violation would you like to contest?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isListening, setIsListening] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      const newMessage: Message = {
        id: Date.now().toString(),
        type: "user",
        content: `📎 Document uploaded: ${file.name}`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, newMessage])

      // Simulate AI response
      setTimeout(() => {
        setIsTyping(true)
        setTimeout(() => {
          const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            type: "ai",
            content:
              "🔍 Document analysis complete. I've processed your violation notice and identified key dispute opportunities. Tell me: Were you parked in compliance with posted signage? Any mitigating circumstances I should factor into your defense strategy?",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, aiResponse])
          setIsTyping(false)
          scrollToBottom()
        }, 2000)
      }, 500)
    }
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "⚡ Analyzing your case... I've identified several strong legal arguments for your dispute. Let me gather additional context to maximize your success rate.",
        "🎯 Excellent information. I'm generating a customized dispute letter optimized for your jurisdiction's requirements. This approach typically yields higher success rates.",
        "✨ Perfect! I've created a comprehensive legal argument based on your case specifics. Would you like me to explain the strategic reasoning behind each dispute point?",
        "🚀 Case analysis complete. I've detected multiple viable defense angles and crafted a professional dispute letter. Your case shows strong merit - finalizing optimization now.",
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: randomResponse,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
      scrollToBottom()
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleVoiceInput = () => {
    setIsListening(!isListening)
    // Voice input simulation - in real app would use Web Speech API
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false)
        setInputValue("I was parked legally but the signage was obscured by construction equipment")
      }, 3000)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b glow-border bg-card/30 backdrop-blur-md sticky top-0 z-10 electric-gradient">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Zap className="h-8 w-8 electric-text pulse-glow" />
              <div className="absolute inset-0 h-8 w-8 electric-text opacity-50 animate-ping" />
            </div>
            <span className="text-2xl font-serif font-bold electric-text">AppealAI</span>
          </div>
          <div className="text-sm text-accent font-medium">UPLOAD • ANALYZE • DISPUTE</div>
        </div>
      </header>

      <div className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
        <Card className="h-full flex flex-col glow-effect bg-card/50 backdrop-blur-sm border-primary/30">
          {/* Messages Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 min-h-[500px]">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-xl p-4 backdrop-blur-sm ${
                    message.type === "user"
                      ? "bg-primary/80 text-primary-foreground glow-effect"
                      : "bg-muted/60 text-foreground glow-border"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <span className="text-xs opacity-70 mt-2 block">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted/60 rounded-xl p-4 max-w-[80%] glow-border backdrop-blur-sm">
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="h-4 w-4 electric-text pulse-glow" />
                    <span className="text-sm text-accent">AI analyzing</span>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full typing-dot"></div>
                      <div className="w-2 h-2 rounded-full typing-dot"></div>
                      <div className="w-2 h-2 rounded-full typing-dot"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-primary/30 p-4 space-y-4 bg-card/30 backdrop-blur-sm">
            {/* File Upload */}
            <div className="flex items-center justify-center">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full max-w-md glow-border bg-muted/30 hover:bg-primary/20 hover:glow-effect transition-all duration-300"
              >
                <Upload className="mr-2 h-4 w-4 electric-text" />
                <span className="electric-text">
                  {uploadedFile ? `✓ ${uploadedFile.name}` : "UPLOAD VIOLATION NOTICE"}
                </span>
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Message Input */}
            <div className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe your situation or ask for analysis..."
                  className="pr-12 min-h-[44px] bg-input/50 border-primary/30 glow-border backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:glow-effect transition-all duration-300"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute right-8 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-primary/20"
                >
                  <Paperclip className="h-4 w-4 text-accent" />
                </Button>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={toggleVoiceInput}
                className={`h-11 w-11 p-0 glow-border transition-all duration-300 ${
                  isListening ? "bg-destructive/20 border-destructive/50 neon-glow" : "hover:bg-accent/20"
                }`}
              >
                {isListening ? (
                  <MicOff className="h-4 w-4 text-destructive" />
                ) : (
                  <Mic className="h-4 w-4 text-accent" />
                )}
              </Button>

              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="h-11 w-11 p-0 bg-primary hover:bg-primary/80 glow-effect disabled:opacity-50 disabled:glow-none transition-all duration-300"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {[
                "🚗 Legal parking compliance",
                "⚠️ Signage visibility issues",
                "🚨 Emergency circumstances",
                "⚡ Generate dispute letter",
              ].map((action) => (
                <Button
                  key={action}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputValue(action.split(" ").slice(1).join(" "))}
                  className="text-xs glow-border bg-muted/20 hover:bg-primary/20 hover:glow-effect transition-all duration-300 text-accent"
                >
                  {action}
                </Button>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <footer className="border-t glow-border bg-card/20 backdrop-blur-md py-4 electric-gradient">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-accent flex items-center justify-center">
            <Shield className="inline h-4 w-4 mr-2 pulse-glow" />
            DEMO SYSTEM • CONSULT QUALIFIED ATTORNEY FOR LEGAL MATTERS
          </p>
        </div>
      </footer>
    </div>
  )
}
