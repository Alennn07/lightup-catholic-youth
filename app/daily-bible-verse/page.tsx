"use client"

import { DailyBibleVerse } from "@/components/daily-bible-verse"
import { Navigation } from "@/components/navigation"

export default function DailyBibleVersePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Daily Bible Verse
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Today's scripture and reflection to inspire your faith journey
          </p>
        </div>
        <DailyBibleVerse />
      </div>
    </div>
  )
}
