"use client"

import { FaithQuiz } from "@/components/faith-quiz"
import { Navigation } from "@/components/navigation"
import { SmartBackButton } from "@/components/smart-back-button"

export default function FaithQuizPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-8">
        {/* Back Button */}
        <div className="mb-6">
          <SmartBackButton
            fallbackPath="/features"
            showHomeButton={true}
          />
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Faith Quiz
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Test your knowledge and learn more about your faith
          </p>
        </div>
        <FaithQuiz />
      </div>
    </div>
  )
}
