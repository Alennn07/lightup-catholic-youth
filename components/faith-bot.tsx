"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircle, Send, Bot, User, BookOpen, Heart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "@/lib/i18n"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: string
}

export function FaithBot() {
  const { t, language } = useTranslation()
  const [messages, setMessages] = useState<Message[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Advanced features state
  const [mode, setMode] = useState('chat')
  const [context, setContext] = useState('general')
  const [tone, setTone] = useState('casual')
  const [length, setLength] = useState('medium')
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  // Initialize messages after component mounts to avoid hydration mismatch
  useEffect(() => {
    setMessages([
      {
        id: "1",
        content:
          "Hi there! 👋 Welcome to FaithBot! I'm so happy you're here to learn about Catholic faith. How can I help you today? Feel free to ask me anything about Catholicism, prayers, saints, or just say hello! 🙏✨",
        sender: "bot",
        timestamp: new Date().toISOString(),
      },
    ])
  }, [])
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
      console.log("FaithBot Frontend: Sending message:", inputMessage);
      console.log("FaithBot Frontend: Making API call to /api/faithbot");
      
      const response = await fetch("/api/faithbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: inputMessage,
          conversationHistory: messages.slice(-5), // Send last 5 messages for context
          mode: mode,
          context: context,
          tone: tone,
          length: length,
          language: language
        }),
      })

      console.log("FaithBot Frontend: Response status:", response.status);
      console.log("FaithBot Frontend: Response ok:", response.ok);

      if (!response.ok) throw new Error("Failed to get response")

      const data = await response.json()
      console.log("FaithBot Frontend: Response data:", data);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: "bot",
        timestamp: data.timestamp,
      }

      console.log("FaithBot Frontend: Bot message created:", botMessage);
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("FaithBot Frontend: Error occurred:", error);
      toast({
        title: t("common.error"),
        description: t("faithbot.errors.failedToGetResponse"),
        variant: "destructive",
      })
    } finally {
      console.log("FaithBot Frontend: Setting loading to false");
      setIsLoading(false)
    }
  }

  const quickQuestions = [
    "Hi there! 👋",
    "hru?",
    "yo gimme 5 bible secrets lol",
    "make script abt hope vid rn",
    "pray for exams plz",
    "sup bro write a caption abt faith",
    "What is the Eucharist?",
    "How do I pray the rosary?",
    "What are the sacraments?"
  ]

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question)
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 via-white to-rose-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-4 md:py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-rose-500 rounded-full mb-4 shadow-lg">
            <MessageCircle className="h-8 w-8 text-white" />
          </div>
                     <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{t("faithbot.title")}</h1>
           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
             {t("faithbot.subtitle")}
           </p>
        </div>

        {/* Quick Questions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("faithbot.quickQuestions")}</h3>
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

        {/* Quick Mode Buttons */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("faithbot.quickModes")}</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
              onClick={() => setMode('prayer')}
            >
              🙏 {t("faithbot.prayerWriter")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
              onClick={() => setMode('bible-study')}
            >
              📖 {t("faithbot.bibleStudy")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
              onClick={() => setMode('sermon-writer')}
            >
              🎤 {t("faithbot.sermonWriter")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100"
              onClick={() => setMode('youth-content')}
            >
              ✨ {t("faithbot.youthContent")}
            </Button>
          </div>
        </div>



        {/* Advanced Controls */}
        <div className="mb-6 bg-white rounded-xl shadow-md border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{t("faithbot.advancedSettings")}</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm"
            >
              {showAdvanced ? t("faithbot.hideAdvanced") : t("faithbot.showAdvanced")}
            </Button>
          </div>
          
          {showAdvanced && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Mode Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t("faithbot.mode")}</label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="chat">{t("faithbot.chat")}</option>
                  <option value="prayer">{t("faithbot.prayerWriter")}</option>
                  <option value="bible-study">{t("faithbot.bibleStudy")}</option>
                  <option value="sermon-writer">{t("faithbot.sermonWriter")}</option>
                  <option value="youth-content">{t("faithbot.youthContent")}</option>
                </select>
              </div>

                            {/* Context Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t("faithbot.context")}</label>
                <select
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="general">{t("faithbot.general")}</option>
                  <option value="sacramental">{t("faithbot.sacramental")}</option>
                  <option value="pastoral">{t("faithbot.pastoral")}</option>
                  <option value="educational">{t("faithbot.educational")}</option>
                </select>
              </div>

              {/* Tone Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t("faithbot.tone")}</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="casual">{t("faithbot.casual")}</option>
                  <option value="formal">{t("faithbot.formal")}</option>
                  <option value="encouraging">{t("faithbot.encouraging")}</option>
                  <option value="reflective">{t("faithbot.reflective")}</option>
                </select>
              </div>

                               {/* Length Selection */}
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">{t("faithbot.length")}</label>
                   <select
                     value={length}
                     onChange={(e) => setLength(e.target.value)}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                   >
                     <option value="short">{t("faithbot.short")}</option>
                     <option value="medium">{t("faithbot.medium")}</option>
                     <option value="long">{t("faithbot.long")}</option>
                   </select>
                 </div>


              </div>
            )}
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
                      {typeof window !== 'undefined' ? new Date(message.timestamp).toLocaleTimeString() : message.timestamp}
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
               
               {/* Auto-scroll anchor */}
               <div ref={messagesEndRef} />
             </div>
           </ScrollArea>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex gap-2">
                             <Input
                 value={inputMessage}
                 onChange={(e) => setInputMessage(e.target.value)}
                 placeholder={t("faithbot.placeholder")}
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
             <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("faithbot.features.biblicalKnowledge")}</h3>
             <p className="text-gray-600">{t("faithbot.features.biblicalKnowledgeDesc")}</p>
           </div>
           
           <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-200">
             <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
               <Heart className="h-6 w-6 text-white" />
             </div>
             <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("faithbot.features.prayerGuidance")}</h3>
             <p className="text-gray-600">{t("faithbot.features.prayerGuidanceDesc")}</p>
           </div>
           
           <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-200">
             <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
               <MessageCircle className="h-6 w-6 text-white" />
             </div>
             <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("faithbot.features.creativeContent")}</h3>
             <p className="text-gray-600">{t("faithbot.features.creativeContentDesc")}</p>
           </div>
         </div>
      </div>
    </div>
  )
}
