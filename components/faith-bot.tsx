"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircle, Send, Bot, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: string
}

export function FaithBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hi there! 👋 Welcome to FaithBot! I'm so happy you're here to learn about Catholic faith. How can I help you today? Feel free to ask me anything about Catholicism, prayers, saints, or just say hello! 🙏✨",
      sender: "bot",
      timestamp: new Date().toISOString(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/faithbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputMessage }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const data = await response.json()

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: "bot",
        timestamp: data.timestamp,
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from FaithBot",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const quickQuestions = [
    "Hi there! 👋",
    "What is the Eucharist?",
    "How do I pray the rosary?",
    "What are the sacraments?",
    "Who is Mary?",
    "What is Lent?",
    "What is Mass?",
    "What is prayer?",
    "Who are the saints?"
  ]

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question)
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 via-white to-rose-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-rose-500 rounded-full mb-4 shadow-lg">
            <MessageCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">FaithBot</h1>
          <p className="text-lg text-gray-600">Your Catholic AI spiritual assistant</p>
        </div>

        {/* Chat Interface */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 h-[600px] flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-rose-50">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Bot className="h-5 w-5 text-amber-500" />
              Catholic Q&A Assistant
            </h2>
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col p-6 space-y-4 overflow-hidden">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.sender === "bot" && (
                      <Avatar className="h-10 w-10 bg-gradient-to-br from-amber-400 to-rose-500 flex-shrink-0">
                        <AvatarFallback className="bg-transparent">
                          <Bot className="h-5 w-5 text-white" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[80%] rounded-xl p-4 ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md"
                          : "bg-gray-50 text-gray-800 border border-gray-200 shadow-sm"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </div>
                    {message.sender === "user" && (
                      <Avatar className="h-10 w-10 bg-gradient-to-br from-blue-500 to-cyan-500 flex-shrink-0">
                        <AvatarFallback className="bg-transparent">
                          <User className="h-5 w-5 text-white" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <Avatar className="h-10 w-10 bg-gradient-to-br from-amber-400 to-rose-500 flex-shrink-0">
                      <AvatarFallback className="bg-transparent">
                        <Bot className="h-5 w-5 text-white" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-50 text-gray-800 border border-gray-200 rounded-xl p-4 shadow-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600 font-medium">Quick questions to get started:</p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question) => (
                    <Button
                      key={question}
                      onClick={() => handleQuickQuestion(question)}
                      variant="outline"
                      size="sm"
                      className="bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 hover:border-amber-300 text-xs rounded-lg transition-colors"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me about Catholic faith..."
                className="flex-1 bg-white border-gray-200 focus:border-amber-400 focus:ring-amber-400 rounded-lg"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
