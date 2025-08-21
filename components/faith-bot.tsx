"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircle, Send, Bot, User, BookOpen, Heart } from "lucide-react"
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">FaithBot AI Assistant</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your friendly AI companion for Catholic faith questions. Ask anything about Catholicism, prayers, saints, and more!
          </p>
        </div>

        {/* Quick Questions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Questions</h3>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                onClick={() => handleQuickQuestion(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Messages */}
          <ScrollArea className="h-96 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.sender === "bot" && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-r from-amber-500 to-rose-500 text-white">
                        <Bot className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>

                  {message.sender === "user" && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-r from-amber-500 to-rose-500 text-white">
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 text-gray-900 rounded-lg px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me anything about Catholic faith..."
                className="flex-1 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:ring-amber-500"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-200">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Biblical Knowledge</h3>
            <p className="text-gray-600">Get answers about Bible stories, verses, and teachings</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-200">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Prayer Guidance</h3>
            <p className="text-gray-600">Learn about different prayers and how to pray</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-200">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Faith Conversations</h3>
            <p className="text-gray-600">Have meaningful discussions about your faith journey</p>
          </div>
        </div>
      </div>
    </div>
  )
}
