"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Heart, Share2, CheckCircle, Flame, Calendar, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { generateShareImage, downloadImage } from "@/lib/generate-share-image"
import { SharePreviewModal } from "@/components/share-preview-modal"
import { logIfEnabled, logPerformanceIfEnabled } from "@/lib/performance-monitor"

interface Verse {
  id: string
  text: string
  reference: string
  theme: string
  reflection: string
  action: string
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

// 🚀 CACHE for better performance
const verseCache = new Map<string, DailyVerseData>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export function DailyBibleVerse() {
  const [verseData, setVerseData] = useState<DailyVerseData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [user, setUser] = useState<any>(null)
  const { toast } = useToast()

  // 🚀 OPTIMIZED: Check authentication with caching
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Auth check error:', error)
      }
    }

    checkAuth()
  }, [])

  // 🚀 OPTIMIZED: Memoized client date to prevent recalculation
  const clientDate = useMemo(() => {
    const now = new Date()
    return now.toLocaleDateString('en-CA')
  }, [])

  // 🚀 OPTIMIZED: Concurrent data fetching with caching
  const fetchDailyVerse = useCallback(async () => {
    if (!user) return
    
          // Check cache first
      const cacheKey = `${user.id}-${clientDate}`
      const cachedData = verseCache.get(cacheKey)
      
      if (cachedData && (Date.now() - (cachedData as any).timestamp) < CACHE_DURATION) {
        logIfEnabled('🚀 Using cached data for better performance')
        setVerseData(cachedData)
        setIsLoading(false)
        return
      }
    
    setIsLoading(true)
    const startTime = Date.now()
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('No access token')
      }

      logIfEnabled(`📱 Client sending date: ${clientDate}`)
      logIfEnabled(`📱 Client local time: ${new Date().toLocaleString()}`)
      logIfEnabled(`📱 Client timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`)
      
      // 🚀 CONCURRENT API CALLS for better performance
      const [verseResponse, userProfileResponse] = await Promise.all([
        fetch(`/api/daily-bible-verse?date=${clientDate}`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        }),
        // Fetch user profile data concurrently if needed
        fetch(`/api/users/profile?userId=${user.id}`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        }).catch(() => null) // Don't fail if profile fetch fails
      ])

      if (!verseResponse.ok) throw new Error('Failed to fetch verse')
      
      const data = await verseResponse.json()
      logIfEnabled(`✅ Fetched verse data: ${JSON.stringify(data).substring(0, 100)}...`)
      
      // Add timestamp for caching
      const dataWithTimestamp = { ...data, timestamp: Date.now() }
      
      // Cache the data
      verseCache.set(cacheKey, dataWithTimestamp)
      
      setVerseData(data)
      
      const endTime = Date.now()
      const duration = endTime - startTime
      logPerformanceIfEnabled('Daily Verse Fetch', duration)
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      logIfEnabled(`Error fetching daily verse: ${errorMessage}`, 'error')
      toast({
        title: "Error",
        description: "Failed to load today's verse. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [user, clientDate, toast])

  useEffect(() => {
    if (user) {
      fetchDailyVerse()
    }
  }, [user, fetchDailyVerse])

  // 🚀 OPTIMIZED: Optimistic UI update for better perceived performance
  const handleMarkCompleted = useCallback(async () => {
    if (!user || !verseData) return
    
    // Optimistic update - update UI immediately
    const optimisticData = {
      ...verseData,
      user_progress: {
        ...verseData.user_progress,
        is_completed: true
      },
      stats: {
        ...verseData.stats,
        reading_streak: verseData.stats.reading_streak + 1
      }
    }
    
    setVerseData(optimisticData)
    setIsUpdating(true)
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('No access token')
      }
      
      const response = await fetch('/api/daily-bible-verse/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          action: 'mark_completed',
          date: clientDate
        })
      })

      if (!response.ok) throw new Error('Failed to mark as completed')
      
      const result = await response.json()
      logIfEnabled(`✅ Marked as completed: ${JSON.stringify(result).substring(0, 100)}...`)
      
      // Update cache with new data
      const cacheKey = `${user.id}-${clientDate}`
      const updatedData = { ...optimisticData, timestamp: Date.now() }
      verseCache.set(cacheKey, updatedData)
      
      toast({
        title: "Success!",
        description: "Verse marked as completed. Great job!",
        variant: "default",
      })
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      logIfEnabled(`Error marking as completed: ${errorMessage}`, 'error')
      
      // Revert optimistic update on error
      setVerseData(verseData)
      
      toast({
        title: "Error",
        description: "Failed to mark as completed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }, [user, verseData, clientDate, toast])

  const handleShare = useCallback(() => {
    if (!verseData) return
    setShowShareModal(true)
  }, [verseData])

  const getShareData = useCallback(() => {
    if (!verseData) return null
    
    return {
      verse: verseData.verse.text,
      reference: verseData.verse.reference,
      reflection: verseData.verse.reflection,
      theme: verseData.verse.theme
    }
  }, [verseData])

  // 🚀 OPTIMIZED: Memoized loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading today's verse...</p>
        </div>
      </div>
    )
  }

  if (!verseData) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No verse available today.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-12 w-12 text-purple-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-foreground mb-2">
            Daily Bible Verse
          </CardTitle>
          <p className="text-muted-foreground text-lg">
            Today's scripture to inspire your faith journey
          </p>
          <Badge variant="secondary" className="mt-3">
            {verseData.verse.theme}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="text-center p-4">
              <div className="flex items-center justify-center mb-2">
                <Flame className="h-6 w-6 text-orange-500" />
              </div>
              <div className="text-2xl font-bold text-foreground">
                {verseData.stats.reading_streak}
              </div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </Card>
            
            <Card className="text-center p-4">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="h-6 w-6 text-green-500" />
              </div>
              <div className="text-lg font-bold text-foreground">
                {new Date().toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
              <div className="text-sm text-muted-foreground">Today's Date</div>
            </Card>
          </div>

          {/* Bible Verse */}
          <div className="text-center mb-6">
            <blockquote className="text-2xl italic text-foreground mb-4 leading-relaxed">
              "{verseData.verse.text}"
            </blockquote>
            <cite className="text-lg text-orange-600 font-semibold">
              - {verseData.verse.reference}
            </cite>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">Today's Progress</span>
              <span className="text-sm text-muted-foreground">
                {verseData.user_progress.is_completed ? 'Completed' : 'Not Started'}
              </span>
            </div>
            <Progress 
              value={verseData.user_progress.is_completed ? 100 : 0} 
              className="h-2"
            />
          </div>

          {/* Reflection */}
          <Card className="bg-accent/50 border-accent">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-accent-foreground">Today's Reflection</span>
                <Badge variant="secondary" className="text-xs">Youth Focused</Badge>
              </div>
              <p className="text-foreground leading-relaxed">
                {verseData.verse.reflection}
              </p>
            </CardContent>
          </Card>

          {/* Action Prompt */}
          <div className="text-center">
            <p className="text-foreground mb-4">
              <strong>Take Action Today:</strong> {verseData.verse.action}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={handleMarkCompleted}
              disabled={isUpdating || verseData.user_progress.is_completed}
              className={`flex items-center gap-2 ${
                verseData.user_progress.is_completed 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              <CheckCircle className="h-4 w-4" />
              {verseData.user_progress.is_completed ? 'Completed Today!' : 'Mark as Completed'}
            </Button>

            <Button variant="outline" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Favorite
            </Button>

            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>

          {/* Success Message */}
          {verseData.user_progress.is_completed && (
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-green-800 dark:text-green-200">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">
                  Amazing! You've completed today's verse and maintained your {verseData.stats.reading_streak}-day streak! 🎉
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Share Preview Modal */}
      <SharePreviewModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        data={getShareData()}
      />
    </div>
  )
}
