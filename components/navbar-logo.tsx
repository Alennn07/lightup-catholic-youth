"use client"

import { Star } from "lucide-react"

interface NavbarLogoProps {
  textColor?: string
}

export function NavbarLogo({ textColor = "text-gray-800" }: NavbarLogoProps) {
  return (
    <div className="flex items-center space-x-2">
      {/* Main Logo Text - Compact Version */}
      <h1 className={`text-2xl md:text-3xl ${textColor} leading-tight`} style={{ fontFamily: 'TAN Nightingale, serif', fontWeight: 'normal' }}>
        LightUp
      </h1>
      
      {/* Small Sparkle */}
      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
    </div>
  )
}
