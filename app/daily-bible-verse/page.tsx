"use client"

import { DailyBibleVerse } from "@/components/daily-bible-verse"
import { Navigation } from "@/components/navigation"
import { BackToTop } from "@/components/back-to-top"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DailyBibleVersePage() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        
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
      <BackToTop />
    </div>
  )
}
