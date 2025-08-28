"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Heart, Share2, CheckCircle, Flame, Trophy, Star, Calendar, RefreshCw, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

interface Verse {
  id: string
  text: string
  reference: string
  book: string
  chapter: number
  verse: number
  theme: string
  reflection: string
  action_prompt: string
}

interface UserProgress {
  is_completed: boolean
  read_at: string | null
  is_favorited: boolean
}

interface Stats {
  reading_streak: number
  today_date: string
}

interface DailyVerseData {
  verse: Verse
  user_progress: UserProgress
  stats: Stats
}

export function DailyBibleVerse() {
  const [verseData, setVerseData] = useState<DailyVerseData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const { toast } = useToast()

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Auth check error:', error)
      } finally {
        setIsAuthLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Fetch today's verse and user progress
  const fetchDailyVerse = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      const token = await supabase.auth.getSession()
      if (!token.data.session?.access_token) {
        throw new Error('No access token')
      }

      const response = await fetch('/api/daily-bible-verse', {
        headers: {
          'Authorization': `Bearer ${token.data.session.access_token}`
        }
      })

      if (!response.ok) throw new Error('Failed to fetch verse')
      
      const data = await response.json()
      setVerseData(data)
    } catch (error) {
      console.error('Error fetching daily verse:', error)
      toast({
        title: "Error",
        description: "Failed to load today's verse. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user && !isAuthLoading) {
      fetchDailyVerse()
    }
  }, [user, isAuthLoading])

  // Handle marking verse as completed
  const handleMarkCompleted = async () => {
    if (!user) return
    
    setIsUpdating(true)
    try {
      const token = await supabase.auth.getSession()
      if (!token.data.session?.access_token) {
        throw new Error('No access token')
      }

      const response = await fetch('/api/daily-bible-verse/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.data.session.access_token}`
        },
        body: JSON.stringify({
          action: 'mark_completed',
          verse_id: verseData?.verse?.reference || 'Proverbs 17:17'
        })
      })

      const result = await response.json()
      
      if (result.success) {
        toast({
          title: "Success! 🎉",
          description: result.message,
          duration: 3000,
        })
        // Update local state to show as completed
        setVerseData(prev => prev ? {
          ...prev,
          user_progress: {
            ...prev.user_progress,
            is_completed: true,
            read_at: new Date().toISOString()
          },
          stats: {
            ...prev.stats,
            reading_streak: (prev.stats.reading_streak || 0) + 1
          }
        } : null)
        
        // REMOVED: No more auto-refresh that causes the loop
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to mark verse as completed",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error marking verse as completed:', error)
      toast({
        title: "Error",
        description: "Failed to mark verse as completed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Handle toggling favorite
  const handleToggleFavorite = async () => {
    if (!user) return
    
    setIsUpdating(true)
    try {
      const token = await supabase.auth.getSession()
      if (!token.data.session?.access_token) {
        throw new Error('No access token')
      }

      const response = await fetch('/api/daily-bible-verse/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.data.session.access_token}`
        },
        body: JSON.stringify({
          action: 'toggle_favorite',
          verse_id: verseData?.verse?.reference || 'Proverbs 17:17',
          verse_text: verseData?.verse?.text || 'A friend loves at all times, and a brother is born for a time of adversity.'
        })
      })

      const result = await response.json()
      
      if (result.success) {
        toast({
          title: "Success! ❤️",
          description: result.message,
          duration: 3000,
        })
        // Toggle local state
        setVerseData(prev => prev ? {
          ...prev,
          user_progress: {
            ...prev.user_progress,
            is_favorited: !prev.user_progress.is_favorited
          }
        } : null)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update favorite status",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast({
        title: "Error",
        description: "Failed to update favorite status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Handle sharing
  const handleShare = async () => {
    if (!verseData) return

    const shareText = `"${verseData.verse.text}" - ${verseData.verse.reference}\n\n${verseData.verse.reflection}\n\n${verseData.verse.action_prompt}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Daily Bible Verse",
          text: shareText,
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareText)
        toast({
          title: "Copied to clipboard",
          description: "Verse copied to your clipboard",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to copy verse",
          variant: "destructive",
        })
      }
    }
  }

  // Loading state
  if (isLoading || isAuthLoading) {
    return (
      <div className="bg-gradient-to-br from-amber-50 via-white to-rose-50 rounded-2xl border border-amber-100">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-rose-500 rounded-full mb-4 shadow-lg">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Daily Bible Verse</h2>
            <p className="text-lg text-gray-600">Today's scripture to inspire your faith journey</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="animate-pulse space-y-6">
              <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-5 bg-gray-200 rounded w-1/2 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
              <div className="space-y-3 mt-6">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="bg-gradient-to-br from-amber-50 via-white to-rose-50 rounded-2xl border border-amber-100">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-rose-500 rounded-full mb-4 shadow-lg">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Daily Bible Verse</h2>
            <p className="text-lg text-gray-600">Today's scripture to inspire your faith journey</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
            <div className="mb-6">
              <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Sign in to Access Daily Verses</h3>
              <p className="text-gray-600 mb-6">
                Join us to get personalized daily Bible verses, track your reading progress, and build a daily faith habit.
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <Link href="/auth/sign-in">
                <Button size="lg" variant="outline" className="border-amber-300 text-amber-600 hover:bg-amber-50">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white">
                  Join Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // No verse data
  if (!verseData) {
    return (
      <div className="bg-gradient-to-br from-amber-50 via-white to-rose-50 rounded-2xl border border-amber-100">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-rose-500 rounded-full mb-4 shadow-lg">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Daily Bible Verse</h2>
            <p className="text-lg text-gray-600">Today's scripture to inspire your faith journey</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
            <p className="text-gray-600 mb-6 text-lg">Failed to load today's verse</p>
            <Button
              onClick={fetchDailyVerse}
              variant="outline"
              className="border-amber-300 text-amber-600 hover:bg-amber-50 hover:border-amber-400 font-semibold px-6 py-2 rounded-xl"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 via-white to-rose-50 rounded-2xl border border-amber-100">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-rose-500 rounded-full mb-4 shadow-lg">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Daily Bible Verse</h2>
          <p className="text-lg text-gray-600">Today's scripture to inspire your faith journey</p>
          
          {/* Theme Badge */}
          {verseData.verse.theme && (
            <div className="mt-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                {verseData.verse.theme}
              </Badge>
            </div>
          )}
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center mb-2">
                <Flame className="h-6 w-6 text-orange-500 mr-2" />
                <span className="text-2xl font-bold text-gray-800">{verseData.stats.reading_streak}</span>
              </div>
              <p className="text-sm text-gray-600">Day Streak</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="h-6 w-6 text-yellow-500 mr-2" />
                <span className="text-2xl font-bold text-gray-800">1</span>
              </div>
              <p className="text-sm text-gray-600">Total Completed</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="h-6 w-6 text-green-500 mr-2" />
                <span className="text-2xl font-bold text-gray-800">
                  {new Date(verseData.stats.today_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <p className="text-sm text-gray-600">Today's Date</p>
            </CardContent>
          </Card>
        </div>

        {/* Verse Content */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-8">
            {/* Verse Text */}
            <div className="text-center mb-8">
              <blockquote className="text-2xl font-medium text-gray-800 mb-4 leading-relaxed italic">
                "{verseData.verse.text}"
              </blockquote>
              <cite className="text-lg text-amber-600 font-semibold">
                - {verseData.verse.reference}
              </cite>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Today's Progress</span>
                <span className="text-sm text-gray-500">
                  {verseData.user_progress.is_completed ? 'Completed' : 'Not Started'}
                </span>
              </div>
              <Progress 
                value={verseData.user_progress.is_completed ? 100 : 0} 
                className="h-2"
              />
            </div>

            {/* Reflection */}
            <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <h4 className="text-lg font-semibold text-amber-800">Today's Reflection</h4>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Youth Focused
                </Badge>
              </div>
              <p className="text-gray-700 leading-relaxed text-base mb-4">
                {verseData.verse.reflection}
              </p>
              
              {/* Action Prompt */}
              <div className="p-4 bg-white rounded-lg border border-amber-200">
                <p className="text-sm text-amber-700 font-medium mb-2 flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Take Action Today:
                </p>
                <p className="text-sm text-gray-600">
                  {verseData.verse.action_prompt}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {/* Mark as Completed Button */}
              <Button
                onClick={handleMarkCompleted}
                disabled={isUpdating || verseData.user_progress.is_completed}
                size="lg"
                className={`${
                  verseData.user_progress.is_completed 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                {verseData.user_progress.is_completed ? (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Completed Today!
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Mark as Completed
                  </>
                )}
              </Button>

              {/* Favorite Button */}
              <Button
                onClick={handleToggleFavorite}
                disabled={isUpdating}
                variant="outline"
                size="lg"
                className={`${
                  verseData.user_progress.is_favorited
                    ? 'border-rose-300 text-rose-600 hover:bg-rose-50'
                    : 'border-amber-300 text-amber-600 hover:bg-amber-50'
                }`}
              >
                <Heart className={`h-5 w-5 mr-2 ${verseData.user_progress.is_favorited ? 'fill-current' : ''}`} />
                {verseData.user_progress.is_favorited ? 'Favorited' : 'Favorite'}
              </Button>

              {/* Share Button */}
              <Button 
                onClick={handleShare} 
                variant="outline" 
                size="lg"
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                <Share2 className="h-5 w-5 mr-2" />
                Share
              </Button>
            </div>

            {/* Completion Message */}
            {verseData.user_progress.is_completed && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200 text-center">
                <div className="flex items-center justify-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">
                    Amazing! You've completed today's verse and maintained your {verseData.stats.reading_streak}-day streak! 🎉
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
