"use client"

import { Navigation } from "@/components/navigation"
import { LiturgicalCalendar } from "@/components/liturgical-calendar"

export default function LiturgicalCalendarPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Liturgical Calendar
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Follow the Church's liturgical seasons and feast days throughout the year
          </p>
        </div>
        <LiturgicalCalendar />
      </div>
    </div>
  )
}
