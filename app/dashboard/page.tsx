"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Navigation } from "@/components/navigation"
import { DailyBibleVerse } from "@/components/daily-bible-verse"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Sparkles, 
  Activity,
  Heart,
  BookOpen,
  PenTool
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface UserStats {
  daysActive: number
  prayersShared: number
  bibleVersesRead: number
  journalEntries: number
  username: string
}

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [userStats, setUserStats] = useState<UserStats>({
    daysActive: 1,
    prayersShared: 0,
    bibleVersesRead: 0,
    journalEntries: 0,
    username: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  // SUPER FAST: Calculate user display name instantly
  const userDisplayName = useMemo(() => {
    return user?.name || user?.email?.split('@')[0] || 'User'
  }, [user?.name, user?.email])

  // SUPER FAST: Set basic stats immediately
  useEffect(() => {
    if (user?.id && !isLoading) {
      const accountCreated = new Date(user.created_at || Date.now())
      const daysActive = Math.ceil((Date.now() - accountCreated.getTime()) / (1000 * 60 * 60 * 24))
      
      setUserStats({
        daysActive: Math.max(1, daysActive),
        prayersShared: 0,
        bibleVersesRead: 0,
        journalEntries: 0,
        username: userDisplayName
      })
    }
  }, [user?.id, user?.created_at, userDisplayName, isLoading])

  // SUPER FAST: Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/sign-in')
    }
  }, [user, authLoading, router])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 pb-8">
          <div className="text-center">
            <div className="h-12 bg-gray-200 rounded-lg w-96 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-80 mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return <div>User not found!</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-8">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Welcome back, {userDisplayName}!
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Continue your faith journey with our Catholic youth community
          </p>
          
          {/* Streak Badge */}
          <div className="mt-6">
            <Badge
              variant="outline"
              className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200 px-4 py-2 text-sm font-medium"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {userStats.daysActive} day{userStats.daysActive !== 1 ? 's' : ''} active!
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white shadow-lg border border-gray-100">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-2">{userStats.daysActive}</div>
              <div className="text-gray-600 font-medium">Days Active</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border border-gray-100">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-2">{userStats.prayersShared}</div>
              <div className="text-gray-600 font-medium">Prayers Shared</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border border-gray-100">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-2">{userStats.bibleVersesRead}</div>
              <div className="text-gray-600 font-medium">Bible Verses Read</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border border-gray-100">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <PenTool className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-2">{userStats.journalEntries}</div>
              <div className="text-gray-600 font-medium">Journal Entries</div>
            </CardContent>
          </Card>
        </div>

        {/* Section Divider */}
        <div className="flex items-center justify-center mb-12">
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          <div className="mx-4 text-gray-400 text-sm font-medium">
            Explore Features
          </div>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </div>

        {/* Features Call-to-Action */}
        <div className="text-center mb-12">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Discover All Our Features
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Access prayer wall, youth groups, daily Bible verses, FaithBot AI, faith journal, 
                faith quiz, and many more tools to support your faith journey.
              </p>
              <Button 
                onClick={() => router.push('/features')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl"
              >
                Explore Features
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Daily Bible Verse Section - Only show when user is signed in */}
        {user && (
          <div className="mb-8">
            <DailyBibleVerse />
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-12 border-t border-gray-100">
          <p className="text-gray-500 text-sm">
            Continue your faith journey with LightUp Catholic Youth Platform
          </p>
        </div>
      </div>
    </div>
  )
}
