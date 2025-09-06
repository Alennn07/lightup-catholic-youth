"use client"

import { Calendar } from "lucide-react"
import { useLiturgicalSeason } from "@/hooks/use-liturgical-season"

export function LiturgicalSeasonBadge() {
  const season = useLiturgicalSeason()

  return (
    <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-6">
      <Calendar className="w-4 h-4 mr-2" />
      {season.name} {season.year}
    </div>
  )
}
