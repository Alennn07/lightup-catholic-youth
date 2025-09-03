"use client"

import { useState, useEffect, useCallback, useMemo, useTransition } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Navigation } from "@/components/navigation"
import { PrayerSessionModal } from "@/components/prayer-session-modal"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Sparkles, 
  Activity,
  Heart,
  BookOpen,
  PenTool,
  TrendingUp,
  Users,
  MessageCircle,
  Loader2,
  RefreshCw
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useTranslation } from "@/lib/i18n"
import { useToast } from "@/hooks/use-toast"
import { ErrorBoundary, ApiErrorBoundary } from "@/components/error-boundary"

interface UserStats {
  daysActive: number
  prayersShared: number
  bibleVersesRead: number
  journalEntries: number
  username: string
}

export default function DashboardPage() {
  const { t } = useTranslation()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [userStats, setUserStats] = useState<UserStats>({
    daysActive: 1,
    prayersShared: 0,
    bibleVersesRead: 0,
    journalEntries: 0,
    username: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [insights, setInsights] = useState<any[]>([])
  const [weeklyChallenges, setWeeklyChallenges] = useState<any[]>([])
  const [showPrayerModal, setShowPrayerModal] = useState(false)
  const [loadingInsights, setLoadingInsights] = useState(false)
  const [recentSessions, setRecentSessions] = useState<any[]>([])
  const [loadingSessions, setLoadingSessions] = useState(false)
  const [prayerStreakDays, setPrayerStreakDays] = useState(0)
  const [bibleCompletedToday, setBibleCompletedToday] = useState(false)
  const [bibleCompletedThisWeek, setBibleCompletedThisWeek] = useState(0)
  const [totalActivities, setTotalActivities] = useState(0)
  const [communityActivity, setCommunityActivity] = useState<any[]>([])
  const [loadingCommunity, setLoadingCommunity] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [loadingNotifications, setLoadingNotifications] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [optimisticUpdates, setOptimisticUpdates] = useState<{[key: string]: any}>({})
  const [cache, setCache] = useState<{[key: string]: {data: any, timestamp: number}}>({})

  // SUPER FAST: Calculate user display name instantly
  const userDisplayName = useMemo(() => {
    return user?.name || user?.email?.split('@')[0] || 'User'
  }, [user?.name, user?.email])

  // Cache management with 5-minute TTL
  const CACHE_TTL = 5 * 60 * 1000 // 5 minutes
  const getCachedData = useCallback((key: string) => {
    const cached = cache[key]
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data
    }
    return null
  }, [cache])

  const setCachedData = useCallback((key: string, data: any) => {
    setCache(prev => ({
      ...prev,
      [key]: { data, timestamp: Date.now() }
    }))
  }, [])

  // Optimistic update helper
  const applyOptimisticUpdate = useCallback((key: string, update: any) => {
    setOptimisticUpdates(prev => ({ ...prev, [key]: update }))
  }, [])

  const clearOptimisticUpdate = useCallback((key: string) => {
    setOptimisticUpdates(prev => {
      const { [key]: removed, ...rest } = prev
      return rest
    })
  }, [])

  // Fetch user insights with caching
  const fetchInsights = useCallback(async (forceRefresh = false) => {
    if (!user?.id) return
    
    const cacheKey = `insights-${user.id}`
    if (!forceRefresh) {
      const cached = getCachedData(cacheKey)
      if (cached) {
        setInsights(cached)
        return
      }
    }
    
    setLoadingInsights(true)
    try {
      const response = await fetch(`/api/insights?userId=${user.id}`)
      if (response.ok) {
        const { insights: fetchedInsights } = await response.json()
        const insightsData = fetchedInsights || []
        setInsights(insightsData)
        setCachedData(cacheKey, insightsData)
      }
    } catch (error) {
      console.error('Error fetching insights:', error)
    } finally {
      setLoadingInsights(false)
    }
  }, [user?.id, getCachedData, setCachedData])

  // Fetch recent prayer sessions with caching
  const fetchRecentSessions = useCallback(async (forceRefresh = false) => {
    if (!user?.id) return
    
    const cacheKey = `sessions-${user.id}`
    if (!forceRefresh) {
      const cached = getCachedData(cacheKey)
      if (cached) {
        setRecentSessions(cached.sessions)
        setUserStats(prev => ({ ...prev, prayersShared: cached.stats?.sessionCount ?? prev.prayersShared }))
        setPrayerStreakDays(cached.streak)
        return
      }
    }
    
    setLoadingSessions(true)
    try {
      const response = await fetch(`/api/prayer-sessions?userId=${user.id}&limit=50`)
      if (response.ok) {
        const { sessions, stats } = await response.json()
        const safeSessions = sessions || []
        const recentSessionsData = safeSessions.slice(0, 5)
        setRecentSessions(recentSessionsData)

        // Update counters from server stats
        setUserStats(prev => ({
          ...prev,
          prayersShared: stats?.sessionCount ?? prev.prayersShared,
        }))

        // Compute prayer streak: consecutive days ending today with >= 10 minutes total
        const minutesByDay = new Map<string, number>()
        for (const s of safeSessions) {
          const day = new Date(s.created_at).toISOString().split('T')[0]
          minutesByDay.set(day, (minutesByDay.get(day) || 0) + (s.duration_minutes || 0))
        }
        let streak = 0
        const today = new Date()
        while (true) {
          const dayKey = new Date(today.getTime() - streak * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0]
          const mins = minutesByDay.get(dayKey) || 0
          if (mins >= 10) {
            streak += 1
          } else {
            break
          }
        }
        setPrayerStreakDays(streak)
        
        // Cache the data
        setCachedData(cacheKey, { sessions: recentSessionsData, stats, streak })
      }
    } catch (error) {
      console.error('Error fetching recent sessions:', error)
    } finally {
      setLoadingSessions(false)
    }
  }, [user?.id, getCachedData, setCachedData])

  // Fetch Bible verse completion metrics with caching
  const fetchBibleProgress = useCallback(async (forceRefresh = false) => {
    if (!user?.id) return
    
    const cacheKey = `bible-progress-${user.id}`
    if (!forceRefresh) {
      const cached = getCachedData(cacheKey)
      if (cached) {
        setBibleCompletedToday(cached.completedToday)
        setBibleCompletedThisWeek(cached.completedCount)
        return
      }
    }
    
    try {
      const response = await fetch(`/api/daily-bible-verse/progress?userId=${user.id}&days=7`)
      if (response.ok) {
        const data = await response.json()
        const completedToday = Boolean(data.completedToday)
        const completedCount = Number(data.completedCount || 0)
        setBibleCompletedToday(completedToday)
        setBibleCompletedThisWeek(completedCount)
        setCachedData(cacheKey, { completedToday, completedCount })
      }
    } catch (e) {
      console.error('Error fetching bible progress', e)
    }
  }, [user?.id, getCachedData, setCachedData])

  // Fetch aggregate user stats with caching
  const fetchUserStats = useCallback(async (forceRefresh = false) => {
    if (!user?.id) return
    
    const cacheKey = `user-stats-${user.id}`
    if (!forceRefresh) {
      const cached = getCachedData(cacheKey)
      if (cached) {
        setUserStats(prev => ({
          ...prev,
          bibleVersesRead: cached.bibleCompletions7d || 0,
          journalEntries: cached.journalEntries || 0,
        }))
        setTotalActivities(cached.totalActivities)
        return
      }
    }
    
    try {
      const response = await fetch(`/api/users/stats?userId=${user.id}`)
      if (response.ok) {
        const stats = await response.json()
        const totalActivitiesCount = (stats.totalPrayerSessions || 0) + (stats.bibleCompletions7d || 0) + (stats.journalEntries || 0)
        
        setUserStats(prev => ({
          ...prev,
          bibleVersesRead: stats.bibleCompletions7d || 0,
          journalEntries: stats.journalEntries || 0,
        }))
        setTotalActivities(totalActivitiesCount)
        
        setCachedData(cacheKey, { ...stats, totalActivities: totalActivitiesCount })
      }
    } catch (e) {
      console.error('Error fetching user aggregate stats', e)
    }
  }, [user?.id, getCachedData, setCachedData])

  // Fetch community activity with caching and parallel requests
  const fetchCommunityActivity = useCallback(async (forceRefresh = false) => {
    if (!user?.id) return
    
    const cacheKey = 'community-activity'
    if (!forceRefresh) {
      const cached = getCachedData(cacheKey)
      if (cached) {
        setCommunityActivity(cached)
        return
      }
    }
    
    setLoadingCommunity(true)
    try {
      // Parallel fetch of prayer requests and events
      const [prayerResponse, eventsResponse] = await Promise.all([
        fetch('/api/prayer-requests?limit=3'),
        fetch('/api/events?limit=2')
      ])
      
      const [prayerData, eventsData] = await Promise.all([
        prayerResponse.ok ? prayerResponse.json() : [],
        eventsResponse.ok ? eventsResponse.json() : []
      ])
      
      // Combine and format activity
      const activities = [
        ...(prayerData.slice(0, 2).map((req: any) => ({
          type: 'prayer',
          user: req.name || 'Anonymous',
          action: 'shared a prayer request',
          time: req.created_at,
          icon: Heart,
          color: 'blue'
        }))),
        ...(eventsData.slice(0, 1).map((event: any) => ({
          type: 'event',
          user: event.organizer || 'Youth Group',
          action: 'has a new event',
          time: event.created_at,
          icon: Users,
          color: 'green'
        })))
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      
      const finalActivities = activities.slice(0, 3)
      setCommunityActivity(finalActivities)
      setCachedData(cacheKey, finalActivities)
    } catch (e) {
      console.error('Error fetching community activity', e)
    } finally {
      setLoadingCommunity(false)
    }
  }, [user?.id, getCachedData, setCachedData])

  // Fetch notifications with caching
  const fetchNotifications = useCallback(async (forceRefresh = false) => {
    if (!user?.id) return
    
    const cacheKey = `notifications-${user.id}`
    if (!forceRefresh) {
      const cached = getCachedData(cacheKey)
      if (cached) {
        setNotifications(cached)
        return
      }
    }
    
    setLoadingNotifications(true)
    try {
      const response = await fetch(`/api/notifications?userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        const notificationsData = data.notifications || []
        setNotifications(notificationsData)
        setCachedData(cacheKey, notificationsData)
      }
    } catch (e) {
      console.error('Error fetching notifications', e)
    } finally {
      setLoadingNotifications(false)
    }
  }, [user?.id, getCachedData, setCachedData])

  // Fetch weekly challenges with caching
  const fetchWeeklyChallenges = useCallback(async (forceRefresh = false) => {
    if (!user?.id) return
    
    const cacheKey = `challenges-${user.id}`
    if (!forceRefresh) {
      const cached = getCachedData(cacheKey)
      if (cached) {
        setWeeklyChallenges(cached)
        return
      }
    }
    
    try {
      const response = await fetch(`/api/weekly-challenges?userId=${user.id}`)
      if (response.ok) {
        const { challenges } = await response.json()
        const challengesData = challenges || []
        setWeeklyChallenges(challengesData)
        setCachedData(cacheKey, challengesData)
      }
    } catch (error) {
      console.error('Error fetching weekly challenges:', error)
    }
  }, [user?.id, getCachedData, setCachedData])

  // Handle prayer session completion with optimistic updates
  const handlePrayerSessionComplete = useCallback((session: any) => {
    // Optimistic UI update
    applyOptimisticUpdate('prayer-session', { 
      prayersShared: userStats.prayersShared + 1,
      totalActivities: totalActivities + 1 
    })
    
    // Update user stats immediately
    setUserStats(prev => ({
      ...prev,
      prayersShared: prev.prayersShared + 1
    }))
    setTotalActivities(prev => prev + 1)
    
    // Refresh data in background with cache invalidation
    startTransition(() => {
      fetchInsights(true) // Force refresh
      fetchRecentSessions(true) // Force refresh
      fetchUserStats(true) // Force refresh
    })
    
    // Clear optimistic update after a delay
    setTimeout(() => clearOptimisticUpdate('prayer-session'), 2000)
    
    toast({
      title: "Prayer Session Saved! 🙏",
      description: `Your ${session.duration_minutes}-minute prayer session has been recorded.`,
    })
  }, [userStats.prayersShared, totalActivities, applyOptimisticUpdate, clearOptimisticUpdate, fetchInsights, fetchRecentSessions, fetchUserStats, toast])

  // Handle challenge participation with optimistic updates
  const handleJoinChallenge = useCallback(async (challengeId: string) => {
    if (!user?.id) return
    
    // Optimistic UI update
    applyOptimisticUpdate('challenge-join', { challengeId, isCompleted: true })
    
    try {
      const response = await fetch('/api/weekly-challenges', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId,
          currentCount: 1,
          isCompleted: true
        })
      })
      
      if (response.ok) {
        toast({
          title: "Challenge Accepted! 🎯",
          description: "You've joined the weekly challenge. Keep up the great work!",
        })
        
        // Refresh challenges in background
        startTransition(() => {
          fetchWeeklyChallenges(true) // Force refresh
        })
      } else {
        // Revert optimistic update on failure
        clearOptimisticUpdate('challenge-join')
        throw new Error('Failed to join challenge')
      }
    } catch (error) {
      console.error('Error joining challenge:', error)
      clearOptimisticUpdate('challenge-join')
      toast({
        title: "Error",
        description: "Failed to join challenge. Please try again.",
        variant: "destructive"
      })
    }
  }, [user?.id, applyOptimisticUpdate, clearOptimisticUpdate, fetchWeeklyChallenges, toast])

  // Manual refresh function
  const refreshAllData = useCallback(() => {
    if (!user?.id) return
    
    startTransition(() => {
      Promise.all([
        fetchInsights(true),
        fetchWeeklyChallenges(true),
        fetchRecentSessions(true),
        fetchUserStats(true),
        fetchBibleProgress(true),
        fetchCommunityActivity(true),
        fetchNotifications(true)
      ]).catch(error => {
        console.error('Error refreshing data:', error)
        toast({
          title: "Refresh Failed",
          description: "Some data couldn't be refreshed. Please try again.",
          variant: "destructive"
        })
      })
    })
  }, [user?.id, fetchInsights, fetchWeeklyChallenges, fetchRecentSessions, fetchUserStats, fetchBibleProgress, fetchCommunityActivity, fetchNotifications, toast])

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

  // PARALLEL DATA FETCHING: All API calls happen simultaneously
  useEffect(() => {
    if (user?.id) {
      // Execute all fetches in parallel for maximum speed
      Promise.all([
        fetchInsights(),
        fetchWeeklyChallenges(),
        fetchRecentSessions(),
        fetchUserStats(),
        fetchBibleProgress(),
        fetchCommunityActivity(),
        fetchNotifications()
      ]).catch(error => {
        console.error('Error in parallel data fetching:', error)
        setError('Failed to load some data. Please refresh the page.')
      })
    }
  }, [user?.id, fetchInsights, fetchWeeklyChallenges, fetchRecentSessions, fetchBibleProgress, fetchUserStats, fetchCommunityActivity, fetchNotifications])

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

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 pb-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <h2 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h2>
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return <div>User not found!</div>
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation />
        
        <div className="container mx-auto px-3 sm:px-4 pt-16 sm:pt-20 md:pt-24 pb-4 sm:pb-6 md:pb-8">
          {/* Welcome Header with Notifications */}
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4 px-2">
              {t("dashboard.welcomeBack", { name: userDisplayName })}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-2">
              {t("dashboard.subtitle")}
            </p>
            
            {/* Notifications */}
            {notifications.length > 0 && (
              <div className="mt-4 max-w-md mx-auto">
                {notifications.slice(0, 2).map((notif, idx) => (
                  <div key={idx} className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
                    <p className="text-sm text-blue-800">{notif.message}</p>
                  </div>
                ))}
              </div>
            )}
            
            {/* Streak Badge with Refresh Button */}
            <div className="mt-4 sm:mt-6 flex items-center justify-center gap-4">
              <Badge
                variant="outline"
                className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200 px-4 py-2 text-sm font-medium"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {userStats.daysActive} day{userStats.daysActive !== 1 ? 's' : ''} active!
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshAllData}
                disabled={isPending}
                className="text-gray-500 hover:text-gray-700"
              >
                <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-12">
          <Card className="bg-white shadow-lg border border-gray-100">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-2">{userStats.daysActive}</div>
              <div className="text-gray-600 font-medium">Days Active</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border border-gray-100">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-2">{userStats.prayersShared}</div>
              <div className="text-gray-600 font-medium">Prayers Shared</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border border-gray-100">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">{bibleCompletedThisWeek}/5</div>
              <div className="text-gray-600 font-medium">Verses this week</div>
              <div className="text-xs text-green-600 mt-1">{bibleCompletedToday ? 'Completed today ✅' : 'Not yet today'}</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border border-gray-100">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <PenTool className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-2">{userStats.journalEntries}</div>
              <div className="text-gray-600 font-medium">Journal Entries</div>
            </CardContent>
          </Card>
        </div>

        {/* Personalized Faith Insights */}
        {user && (
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Your Faith Insights</h3>
                    <p className="text-gray-600 text-sm">Personalized recommendations for your spiritual growth</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {loadingInsights ? (
                    <div className="col-span-2 p-4 bg-white rounded-lg border border-amber-100 text-center">
                      <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-full mb-3"></div>
                        <div className="h-8 bg-gray-200 rounded w-24 mx-auto"></div>
                      </div>
                    </div>
                  ) : insights.length > 0 ? (
                    insights.map((insight, index) => (
                      <div key={index} className="p-4 bg-white rounded-lg border border-amber-100">
                        <h4 className="font-semibold text-gray-800 mb-2">{insight.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-amber-600 border-amber-300 hover:bg-amber-50"
                          disabled={isPending}
                          onClick={() => {
                            if (insight.action_text === 'Start Prayer') {
                              setShowPrayerModal(true)
                            } else if (insight.action_text === 'Read Scripture') {
                              router.push('/daily-bible-verse')
                            } else if (insight.action_text === 'Practice Gratitude') {
                              router.push('/faith-journal')
                            } else if (insight.action_url) {
                              router.push(insight.action_url)
                            }
                          }}
                        >
                          {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                          {insight.action_text || 'Take Action'}
                        </Button>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="p-4 bg-white rounded-lg border border-amber-100">
                        <h4 className="font-semibold text-gray-800 mb-2">Today's Focus</h4>
                        <p className="text-sm text-gray-600 mb-3">Take a moment to connect with God through prayer today.</p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-amber-600 border-amber-300 hover:bg-amber-50"
                          disabled={isPending}
                          onClick={() => setShowPrayerModal(true)}
                        >
                          {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                          Start Prayer
                        </Button>
                      </div>
                      
                      <div className="p-4 bg-white rounded-lg border border-orange-100">
                        <h4 className="font-semibold text-gray-800 mb-2">Weekly Challenge</h4>
                        <p className="text-sm text-gray-600 mb-3">Share one prayer request with the community this week.</p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-orange-600 border-orange-300 hover:bg-orange-50"
                          disabled={isPending}
                          onClick={() => {
                            // For weekly challenge, redirect to community page to share prayer requests
                            router.push('/community')
                          }}
                        >
                          {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                          Join Challenge
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Prayer Sessions */}
        {user && (
          <div className="mb-8">
            <Card className="bg-white shadow-lg border border-gray-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Heart className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Recent Prayer Sessions</h3>
                      <p className="text-gray-600 text-sm">Your last few prayer times</p>
                    </div>
                  </div>
                </div>

                {loadingSessions ? (
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                  </div>
                ) : recentSessions.length === 0 ? (
                  <p className="text-gray-600">No sessions yet. Start one above to begin your prayer journey!</p>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {recentSessions.map((s: any, idx: number) => (
                      <div key={idx} className="py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                            <Heart className="h-4 w-4 text-rose-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-800 capitalize">{s.session_type || 'guided'}</div>
                            <div className="text-xs text-gray-500">{new Date(s.created_at).toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-700 font-medium">{s.duration_minutes} min</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Spiritual Goals & Challenges */}
        {user && (
          <div className="mb-8">
            <Card className="bg-white shadow-lg border border-gray-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Spiritual Goals</h3>
                      <p className="text-gray-600 text-sm">Set and track your faith journey milestones</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={isPending}
                    onClick={() => router.push('/faith-journal')}
                  >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Set New Goal
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Read 5 Bible verses this week</p>
                        <p className="text-sm text-gray-500">Progress: {bibleCompletedThisWeek}/5 completed</p>
                      </div>
                    </div>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: `${Math.min(100, (bibleCompletedThisWeek / 5) * 100)}%`}}></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Heart className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Pray for 10 minutes daily</p>
                        <p className="text-sm text-gray-500">Streak: {prayerStreakDays} day{prayerStreakDays === 1 ? '' : 's'}</p>
                      </div>
                    </div>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{width: `${Math.min(100, prayerStreakDays * 10)}%`}}></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Join a youth group event</p>
                        <p className="text-sm text-gray-500">
                          {communityActivity.find(a => a.type === 'event') 
                            ? `Next event: ${new Date(communityActivity.find(a => a.type === 'event')?.time).toLocaleDateString()}`
                            : 'No upcoming events'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: communityActivity.find(a => a.type === 'event') ? '25%' : '0%'}}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Faith Milestones & Achievements */}
        {user && (
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Faith Milestones</h3>
                    <p className="text-gray-600 text-sm">Celebrate your spiritual achievements</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg border border-indigo-100">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold text-lg">🏆</span>
                    </div>
                    <p className="text-sm font-medium text-gray-800">First Week</p>
                    <p className="text-xs text-gray-500">{userStats.daysActive >= 7 ? 'Completed' : `${7 - userStats.daysActive} days left`}</p>
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded-lg border border-indigo-100">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold text-lg">📖</span>
                    </div>
                    <p className="text-sm font-medium text-gray-800">Bible Reader</p>
                    <p className="text-xs text-gray-500">{bibleCompletedThisWeek} verses</p>
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded-lg border border-indigo-100">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold text-lg">🤝</span>
                    </div>
                    <p className="text-sm font-medium text-gray-800">Community</p>
                    <p className="text-xs text-gray-500">{communityActivity.length > 0 ? 'Active' : 'Join us!'}</p>
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded-lg border border-indigo-100">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold text-lg">💫</span>
                    </div>
                    <p className="text-sm font-medium text-gray-800">Next Goal</p>
                    <p className="text-xs text-gray-500">{prayerStreakDays >= 3 ? 'Keep going!' : 'Build streak'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Faith Journey Progress Tracker */}
        {user && (
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Your Faith Journey</h3>
                      <p className="text-gray-600">Track your spiritual growth and milestones</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    Level {Math.floor(userStats.daysActive / 7) + 1}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-white rounded-lg border border-purple-100">
                    <div className="text-2xl font-bold text-purple-600 mb-1">{userStats.daysActive}</div>
                    <div className="text-sm text-gray-600">Days of Faith</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border border-blue-100">
                    <div className="text-2xl font-bold text-blue-600 mb-1">{totalActivities}</div>
                    <div className="text-sm text-gray-600">Total Activities</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border border-green-100">
                    <div className="text-2xl font-bold text-green-600 mb-1">{Math.min(100, Math.floor((userStats.daysActive / 30) * 100))}%</div>
                    <div className="text-sm text-gray-600">Monthly Goal</div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {userStats.prayersShared > 0 && <Badge variant="outline" className="bg-white">Prayer Warrior</Badge>}
                  {bibleCompletedThisWeek > 0 && <Badge variant="outline" className="bg-white">Scripture Reader</Badge>}
                  {userStats.journalEntries > 0 && <Badge variant="outline" className="bg-white">Journal Keeper</Badge>}
                  {communityActivity.length > 0 && <Badge variant="outline" className="bg-white">Community Member</Badge>}
                  {prayerStreakDays >= 3 && <Badge variant="outline" className="bg-white">Streak Master</Badge>}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions Panel */}
        {user && (
          <div className="mb-8">
            <Card className="bg-white shadow-lg border border-gray-100">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center space-y-2 border-2 hover:border-blue-300 hover:bg-blue-50"
                    disabled={isPending}
                    onClick={() => router.push('/prayer-wall')}
                  >
                    {isPending ? <Loader2 className="h-6 w-6 animate-spin text-red-500" /> : <Heart className="h-6 w-6 text-red-500" />}
                    <span className="text-sm font-medium">Prayer Wall</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center space-y-2 border-2 hover:border-green-300 hover:bg-green-50"
                    disabled={isPending}
                    onClick={() => router.push('/youth-groups')}
                  >
                    {isPending ? <Loader2 className="h-6 w-6 animate-spin text-green-500" /> : <Users className="h-6 w-6 text-green-500" />}
                    <span className="text-sm font-medium">Youth Groups</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center space-y-2 border-2 hover:border-purple-300 hover:bg-purple-50"
                    disabled={isPending}
                    onClick={() => router.push('/faithbot')}
                  >
                    {isPending ? <Loader2 className="h-6 w-6 animate-spin text-purple-500" /> : <MessageCircle className="h-6 w-6 text-purple-500" />}
                    <span className="text-sm font-medium">FaithBot AI</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center space-y-2 border-2 hover:border-orange-300 hover:bg-orange-50"
                    disabled={isPending}
                    onClick={() => router.push('/faith-journal')}
                  >
                    {isPending ? <Loader2 className="h-6 w-6 animate-spin text-orange-500" /> : <PenTool className="h-6 w-6 text-orange-500" />}
                    <span className="text-sm font-medium">Faith Journal</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Community Activity Feed - Now Dynamic */}
        {user && (
          <div className="mb-8">
            <Card className="bg-white shadow-lg border border-gray-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Community Activity</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    disabled={isPending}
                    onClick={() => router.push('/community')}
                  >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    View All
                  </Button>
                </div>
                {loadingCommunity ? (
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                  </div>
                ) : communityActivity.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-3">No recent community activity</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={isPending}
                      onClick={() => router.push('/community')}
                    >
                      {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Join the Community
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {communityActivity.map((activity, idx) => {
                      const IconComponent = activity.icon
                      const timeAgo = new Date(activity.time).toLocaleString()
                      return (
                        <div key={idx} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className={`w-8 h-8 bg-${activity.color}-100 rounded-full flex items-center justify-center`}>
                            <IconComponent className={`h-4 w-4 text-${activity.color}-600`} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-800">
                              <span className="font-medium">{activity.user}</span> {activity.action}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{timeAgo}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

          {/* Footer */}
          <div className="text-center pt-12 border-t border-gray-100">
            <p className="text-gray-500 text-sm">
              Continue your faith journey with LightUp Catholic Youth Platform
            </p>
          </div>
        </div>

        {/* Prayer Session Modal */}
        {user && (
          <PrayerSessionModal
            isOpen={showPrayerModal}
            onClose={() => setShowPrayerModal(false)}
            userId={user.id}
            onSessionComplete={handlePrayerSessionComplete}
          />
        )}
      </div>
    </ErrorBoundary>
  )
}
