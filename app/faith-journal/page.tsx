"use client"

import { FaithJournal } from "@/components/faith-journal"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function FaithJournalPage() {
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
            Faith Journal
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Reflect on your spiritual journey and grow in faith
          </p>
        </div>
        <FaithJournal />
      </div>
    </div>
  )
}
