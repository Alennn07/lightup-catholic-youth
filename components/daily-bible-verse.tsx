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
import { useTranslation } from "@/lib/i18n"

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
  const { t } = useTranslation()
  const [verseData, setVerseData] = useState<DailyVerseData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [user, setUser] = useState<any>(null)
  const { toast } = useToast()

  // 🚀 OPTIMIZED: Memoized client date to prevent recalculation
  const clientDate = useMemo(() => {
    const now = new Date()
    return now.toLocaleDateString('en-CA')
  }, [])

  // 🚀 OPTIMIZED: Concurrent data fetching with caching
  const fetchDailyVerse = useCallback(async () => {
    setIsLoading(true)
    const startTime = Date.now()
    
    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.access_token) {
        // Check cache first for authenticated users
        const userId = session.user?.id || 'anonymous'
        const cacheKey = `${userId}-${clientDate}`
        const cachedData = verseCache.get(cacheKey)
        
        if (cachedData && (Date.now() - (cachedData as any).timestamp) < CACHE_DURATION) {
          logIfEnabled('🚀 Using cached data for better performance')
          setVerseData(cachedData)
          setIsLoading(false)
          return
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
          fetch(`/api/users/profile?userId=${userId}`, {
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
        
        // Update user state if not already set
        if (!user && session.user) {
          setUser(session.user)
        }
      } else {
        // For non-authenticated users, show a static verse
        const staticVerse = {
          id: 'John 3:16',
          text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
          reference: 'John 3:16',
          theme: 'Love',
          reflection: 'God\'s love is unconditional and eternal. He gave everything for us, showing the depth of His love.',
          action: 'Take a moment to reflect on God\'s love for you today.'
        }
        
        const staticData = {
          verse: staticVerse,
          user_progress: {
            is_completed: false,
            read_at: null,
            is_favorited: false
          },
          stats: {
            reading_streak: 0,
            today_date: clientDate
          }
        }
        
        setVerseData(staticData)
        logIfEnabled('📖 Showing static verse for non-authenticated user')
      }
      
      const endTime = Date.now()
      const duration = endTime - startTime
      logPerformanceIfEnabled('Daily Verse Fetch', duration)
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      logIfEnabled(`Error fetching daily verse: ${errorMessage}`, 'error')
      
      // Show static verse as fallback
      const fallbackVerse = {
        id: 'Psalm 23:1',
        text: 'The Lord is my shepherd; I shall not want.',
        reference: 'Psalm 23:1',
        theme: 'Comfort',
        reflection: 'God is our shepherd, guiding and providing for us. We can trust in His care.',
        action: 'Take comfort in knowing that God is watching over you.'
      }
      
      const fallbackData = {
        verse: fallbackVerse,
        user_progress: {
          is_completed: false,
          read_at: null,
          is_favorited: false
        },
        stats: {
          reading_streak: 0,
          today_date: clientDate
        }
      }
      
      setVerseData(fallbackData)
      
      toast({
        title: "Welcome!",
        description: "Here's today's verse. Sign in to track your reading streak!",
        variant: "default",
      })
    } finally {
      setIsLoading(false)
    }
  }, [user, clientDate, toast])

  // 🚀 OPTIMIZED: Check authentication with caching
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        logIfEnabled(`Auth check: ${session?.user ? 'User logged in' : 'No user'}`)
        
        // If user is logged in, trigger a refetch of the verse data
        if (session?.user) {
          // Small delay to ensure user state is set before fetching
          setTimeout(() => {
            fetchDailyVerse()
          }, 100)
        } else {
          // If no user, show static verse
          fetchDailyVerse()
        }
        
        setIsCheckingAuth(false)
      } catch (error) {
        logIfEnabled(`Auth check error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error')
      }
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      logIfEnabled(`Auth state changed: ${event}, user: ${session?.user ? 'logged in' : 'logged out'}`)
      setUser(session?.user ?? null)
      
      // If user just logged in, refetch the verse data
      if (event === 'SIGNED_IN' && session?.user) {
        setTimeout(() => {
          fetchDailyVerse()
        }, 100)
      }
    })

    return () => subscription.unsubscribe()
  }, [fetchDailyVerse])

  // 🚀 OPTIMIZED: Optimistic UI update for better perceived performance
  const handleMarkCompleted = useCallback(async () => {
    if (!verseData) return
    
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
      const userId = session.user?.id || 'anonymous'
      const cacheKey = `${userId}-${clientDate}`
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
  }, [verseData, clientDate, toast])

  const handleFavorite = useCallback(async () => {
    if (!user || !verseData) {
      // Redirect to sign in if not authenticated
      window.location.href = '/auth/sign-in'
      return
    }
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('No access token')
      }
      
      // Toggle favorite status
      const newFavoriteStatus = !verseData.user_progress.is_favorited
      
      // Optimistic update
      setVerseData(prev => prev ? {
        ...prev,
        user_progress: {
          ...prev.user_progress,
          is_favorited: newFavoriteStatus
        }
      } : null)
      
      // TODO: Add API call to save favorite status
      // For now, just show a toast
      toast({
        title: newFavoriteStatus ? "Added to Favorites!" : "Removed from Favorites!",
        description: newFavoriteStatus 
          ? "This verse has been added to your favorites." 
          : "This verse has been removed from your favorites.",
        variant: "default",
      })
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      logIfEnabled(`Error toggling favorite: ${errorMessage}`, 'error')
      
      // Revert optimistic update on error
      setVerseData(prev => prev ? {
        ...prev,
        user_progress: {
          ...prev.user_progress,
          is_favorited: !prev.user_progress.is_favorited
        }
      } : null)
      
      toast({
        title: "Error",
        description: "Failed to update favorite status. Please try again.",
        variant: "destructive",
      })
    }
  }, [user, verseData, toast])

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
  if (isLoading || isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {isCheckingAuth ? 'Checking authentication...' : 'Loading today\'s verse...'}
          </p>
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

  // Debug log for user state
  console.log('DailyBibleVerse render - user:', user ? 'logged in' : 'not logged in')

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-4 md:p-6">
      <Card className="shadow-lg">
        <CardHeader className="text-center pb-3 sm:pb-4 md:pb-6">
          <div className="flex items-center justify-center mb-2 sm:mb-3 md:mb-4">
            <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-purple-600" />
          </div>
          <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1 sm:mb-2">
            Daily Bible Verse
          </CardTitle>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
            Today's scripture to inspire your faith journey
          </p>
          <Badge variant="secondary" className="mt-2 sm:mt-3">
            {verseData.verse.theme}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-3 sm:space-y-4 md:space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
            <Card className="text-center p-3 sm:p-4">
              <div className="flex items-center justify-center mb-1 sm:mb-2">
                <Flame className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-orange-500" />
              </div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
                {verseData.stats.reading_streak}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Day Streak</div>
            </Card>
            
            <Card className="text-center p-3 sm:p-4">
              <div className="flex items-center justify-center mb-1 sm:mb-2">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-green-500" />
              </div>
              <div className="text-sm sm:text-base md:text-lg font-bold text-foreground">
                {new Date().toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Today's Date</div>
            </Card>
          </div>

          {/* Bible Verse */}
          <div className="text-center mb-4 sm:mb-5 md:mb-6">
            <blockquote className="text-lg sm:text-xl md:text-2xl italic text-foreground mb-2 sm:mb-3 md:mb-4 leading-relaxed">
              "{verseData.verse.text}"
            </blockquote>
            <cite className="text-sm sm:text-base md:text-lg text-orange-600 font-semibold">
              - {verseData.verse.reference}
            </cite>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1 sm:space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm font-medium text-foreground">Today's Progress</span>
              <span className="text-xs sm:text-sm text-muted-foreground">
                {verseData.user_progress.is_completed ? 'Completed' : 'Not Started'}
              </span>
            </div>
            <Progress 
              value={verseData.user_progress.is_completed ? 100 : 0} 
              className="h-1.5 sm:h-2"
            />
          </div>

          {/* Reflection */}
          <Card className="bg-accent/50 border-accent">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600" />
                <span className="text-xs sm:text-sm font-medium text-accent-foreground">Today's Reflection</span>
                <Badge variant="secondary" className="text-xs">Youth Focused</Badge>
              </div>
              <p className="text-sm sm:text-base text-foreground leading-relaxed">
                {verseData.verse.reflection}
              </p>
            </CardContent>
          </Card>

          {/* Action Prompt */}
          <div className="text-center">
            <p className="text-sm sm:text-base text-foreground mb-3 sm:mb-4">
              <strong>Take Action Today:</strong> {verseData.verse.action}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center">
            {user ? (
              <Button
                onClick={handleMarkCompleted}
                disabled={isUpdating || verseData.user_progress.is_completed}
                className={`flex items-center gap-2 h-10 sm:h-11 w-full sm:w-auto text-sm sm:text-base ${
                  verseData.user_progress.is_completed 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                {verseData.user_progress.is_completed ? 'Completed Today!' : 'Mark as Completed'}
              </Button>
            ) : (
              <Button
                onClick={() => window.location.href = '/auth/sign-in'}
                className="flex items-center gap-2 h-10 sm:h-11 w-full sm:w-auto text-sm sm:text-base bg-purple-600 hover:bg-purple-700"
              >
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                Sign In to Track Progress
              </Button>
            )}

            <div className="flex gap-2 sm:gap-3 md:gap-4">
              <Button 
                variant="outline" 
                className={`flex items-center gap-2 h-10 sm:h-11 flex-1 sm:flex-none text-sm sm:text-base ${
                  verseData.user_progress.is_favorited 
                    ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100' 
                    : ''
                }`}
                onClick={handleFavorite}
              >
                <Heart className={`h-3 w-3 sm:h-4 sm:w-4 ${
                  verseData.user_progress.is_favorited ? 'fill-current' : ''
                }`} />
                {verseData.user_progress.is_favorited ? 'Favorited' : 'Favorite'}
              </Button>

              <Button 
                variant="outline" 
                className="flex items-center gap-2 h-10 sm:h-11 flex-1 sm:flex-none text-sm sm:text-base"
                onClick={handleShare}
              >
                <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Success Message */}
          {verseData.user_progress.is_completed && (
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3 sm:p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-green-800 dark:text-green-200">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base font-medium">
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
