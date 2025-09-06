"use client"

import { useState, useEffect } from "react"

interface LiturgicalSeason {
  name: string
  year: number
  color: string
  description: string
}

export function useLiturgicalSeason() {
  const [season, setSeason] = useState<LiturgicalSeason>({
    name: "Ordinary Time",
    year: new Date().getFullYear(),
    color: "from-green-600 to-emerald-500",
    description: "The season of growth and learning"
  })

  useEffect(() => {
    const calculateCurrentSeason = () => {
      const today = new Date()
      const currentYear = today.getFullYear()
      const currentMonth = today.getMonth() + 1
      const currentDay = today.getDate()
      
      // Get Easter date for the current year
      const easterDate = getEasterDate(currentYear)
      const easterMonth = easterDate.getMonth() + 1
      const easterDay = easterDate.getDate()
      
      // Calculate liturgical seasons based on Easter
      const ashWednesday = getAshWednesday(easterDate)
      const palmSunday = getPalmSunday(easterDate)
      const ascension = getAscension(easterDate)
      const pentecost = getPentecost(easterDate)
      const adventStart = getAdventStart(currentYear)
      const christmasStart = new Date(currentYear, 11, 25) // December 25
      const epiphany = new Date(currentYear, 0, 6) // January 6
      
      // Determine current season
      if (isDateInRange(today, adventStart, christmasStart)) {
        setSeason({
          name: "Advent",
          year: currentYear,
          color: "from-purple-600 to-blue-600",
          description: "Preparation for the coming of Christ"
        })
      } else if (isDateInRange(today, christmasStart, epiphany)) {
        setSeason({
          name: "Christmas",
          year: currentYear,
          color: "from-red-600 to-gold-500",
          description: "Celebration of the birth of Christ"
        })
      } else if (isDateInRange(today, ashWednesday, palmSunday)) {
        setSeason({
          name: "Lent",
          year: currentYear,
          color: "from-purple-600 to-gray-600",
          description: "Season of penance and preparation"
        })
      } else if (isDateInRange(today, palmSunday, ascension)) {
        setSeason({
          name: "Easter",
          year: currentYear,
          color: "from-gold-500 to-white-500",
          description: "Celebration of the resurrection"
        })
      } else {
        setSeason({
          name: "Ordinary Time",
          year: currentYear,
          color: "from-green-600 to-emerald-500",
          description: "The season of growth and learning"
        })
      }
    }

    // Calculate initial season
    calculateCurrentSeason()
    
    // Update every day at midnight
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    
    const timeUntilMidnight = tomorrow.getTime() - now.getTime()
    
    const timeoutId = setTimeout(() => {
      calculateCurrentSeason()
      // Then update every 24 hours
      setInterval(calculateCurrentSeason, 24 * 60 * 60 * 1000)
    }, timeUntilMidnight)

    return () => clearTimeout(timeoutId)
  }, [])

  return season
}

// Helper functions for liturgical calculations
function getEasterDate(year: number): Date {
  // Algorithm to calculate Easter Sunday
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const n = Math.floor((h + l - 7 * m + 114) / 31)
  const p = (h + l - 7 * m + 114) % 31
  
  return new Date(year, n - 1, p + 1)
}

function getAshWednesday(easterDate: Date): Date {
  const ashWednesday = new Date(easterDate)
  ashWednesday.setDate(ashWednesday.getDate() - 46) // 46 days before Easter
  return ashWednesday
}

function getPalmSunday(easterDate: Date): Date {
  const palmSunday = new Date(easterDate)
  palmSunday.setDate(palmSunday.getDate() - 7) // 7 days before Easter
  return palmSunday
}

function getAscension(easterDate: Date): Date {
  const ascension = new Date(easterDate)
  ascension.setDate(ascension.getDate() + 39) // 39 days after Easter
  return ascension
}

function getPentecost(easterDate: Date): Date {
  const pentecost = new Date(easterDate)
  pentecost.setDate(pentecost.getDate() + 49) // 49 days after Easter
  return pentecost
}

function getAdventStart(year: number): Date {
  // Advent starts on the Sunday closest to November 30
  const november30 = new Date(year, 10, 30) // November 30
  const dayOfWeek = november30.getDay() // 0 = Sunday, 1 = Monday, etc.
  
  // Find the Sunday before or on November 30
  const daysToSubtract = dayOfWeek === 0 ? 0 : dayOfWeek
  const adventStart = new Date(november30)
  adventStart.setDate(adventStart.getDate() - daysToSubtract)
  
  return adventStart
}

function isDateInRange(date: Date, start: Date, end: Date): boolean {
  return date >= start && date <= end
}
