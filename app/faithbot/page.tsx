"use client"

import { FaithBot } from "@/components/faith-bot"
import { Navigation } from "@/components/navigation"

export default function FaithBotPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            FaithBot AI
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get answers to your faith questions with our AI assistant
          </p>
        </div>
        <FaithBot />
      </div>
    </div>
  )
}
