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
  Heart, 
  BookOpen, 
  MessageCircle, 
  Users, 
  PenTool, 
  Zap, 
  Sparkles,
  Activity
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
    return user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'
  }, [user?.user_metadata?.name, user?.email])

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

  // SUPER FAST: Simple feature click handler
  const handleFeatureClick = useCallback((featureId: string, featureName: string) => {
    // No analytics tracking to keep it fast
    console.log(`Feature clicked: ${featureName}`)
  }, [])

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
            Quick Actions
          </div>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Prayer Wall */}
          <Card 
            className="bg-white shadow-lg border border-gray-100 cursor-pointer"
            onClick={() => handleFeatureClick('prayer-wall', 'Prayer Wall')}
          >
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Prayer Wall</h3>
              <p className="text-gray-600 mb-6">Share prayer requests and pray for others</p>
              <Button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600">
                Open Prayer Wall
              </Button>
            </CardContent>
          </Card>

          {/* Youth Groups */}
          <Card 
            className="bg-white shadow-lg border border-gray-100 cursor-pointer"
            onClick={() => handleFeatureClick('youth-groups', 'Youth Groups')}
          >
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Youth Groups</h3>
              <p className="text-gray-600 mb-6">Find and join Catholic youth groups</p>
              <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                Find Groups
              </Button>
            </CardContent>
          </Card>

          {/* Daily Bible Verse */}
          <Card 
            className="bg-white shadow-lg border border-gray-100 cursor-pointer"
            onClick={() => handleFeatureClick('daily-bible-verse', 'Daily Bible Verse')}
          >
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Daily Bible Verse</h3>
              <p className="text-gray-600 mb-6">Today's scripture and reflection</p>
              <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                Read Verse
              </Button>
            </CardContent>
          </Card>

          {/* FaithBot AI */}
          <Card 
            className="bg-white shadow-lg border border-gray-100 cursor-pointer"
            onClick={() => handleFeatureClick('faithbot', 'FaithBot AI')}
          >
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">FaithBot AI</h3>
              <p className="text-gray-600 mb-6">Get answers to your faith questions</p>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                Ask FaithBot
              </Button>
            </CardContent>
          </Card>

          {/* Faith Journal */}
          <Card 
            className="bg-white shadow-lg border border-gray-100 cursor-pointer"
            onClick={() => handleFeatureClick('faith-journal', 'Faith Journal')}
          >
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <PenTool className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Faith Journal</h3>
              <p className="text-gray-600 mb-6">Reflect on your spiritual journey</p>
              <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                Write Entry
              </Button>
            </CardContent>
          </Card>

          {/* Faith Quiz */}
          <Card 
            className="bg-white shadow-lg border border-gray-100 cursor-pointer"
            onClick={() => handleFeatureClick('faith-quiz', 'Faith Quiz')}
          >
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Faith Quiz</h3>
              <p className="text-gray-600 mb-6">Test your knowledge and learn</p>
              <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                Take Quiz
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Section Divider */}
        <div className="flex items-center justify-center mb-12">
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          <div className="mx-4 text-gray-400 text-sm font-medium">
            Daily Inspiration
          </div>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </div>

        {/* Daily Bible Verse Section */}
        <div className="mb-8">
          <DailyBibleVerse />
        </div>

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
