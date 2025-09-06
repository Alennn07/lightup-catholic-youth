"use client"

import { Star } from "lucide-react"

interface CustomLogoProps {
  textColor?: string
  taglineColor?: string
}

export function CustomLogo({ textColor = "text-white", taglineColor = "text-blue-200" }: CustomLogoProps) {
  return (
    <div className="relative inline-block">
      {/* Main Logo Text */}
      <h1 className={`text-6xl sm:text-7xl md:text-8xl ${textColor} leading-tight`} style={{ fontFamily: 'TAN Nightingale, serif', fontWeight: 'normal' }}>
        LightUp
      </h1>
      
      {/* Top Right Sparkles */}
      <div className="absolute -top-2 -right-4 sm:-right-6">
        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 absolute -top-1 -right-2" />
      </div>
      
      {/* Bottom Left Decorative Elements */}
      <div className="absolute -bottom-2 -left-2">
        {/* Curved Line */}
        <svg 
          width="120" 
          height="40" 
          viewBox="0 0 120 40" 
          className="absolute -bottom-1 -left-1"
        >
          <path
            d="M 0 35 Q 20 25 40 30 Q 60 35 80 30 L 100 30"
            stroke="#FCD34D"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        
        {/* Three Parallel Lines */}
        <div className="absolute -bottom-1 left-8 space-y-1">
          <div className="w-8 h-0.5 bg-yellow-400"></div>
          <div className="w-6 h-0.5 bg-yellow-400"></div>
          <div className="w-4 h-0.5 bg-yellow-400"></div>
        </div>
        
        {/* Bottom Right Star */}
        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 absolute -bottom-1 left-20" />
      </div>
    </div>
  )
}
