"use client"

import { PrayerWall } from "@/components/prayer-wall"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PrayerWallPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/features">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Features
            </Button>
          </Link>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Prayer Wall
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Share your prayer requests and pray for others in our community
          </p>
        </div>
        <PrayerWall />
      </div>
    </div>
  )
}
