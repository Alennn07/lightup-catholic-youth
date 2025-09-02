"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
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
  MessageCircle
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useTranslation } from "@/lib/i18n"
import { useToast } from "@/hooks/use-toast"

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

  // SUPER FAST: Calculate user display name instantly
  const userDisplayName = useMemo(() => {
    return user?.name || user?.email?.split('@')[0] || 'User'
  }, [user?.name, user?.email])

  // Fetch user insights
  const fetchInsights = useCallback(async () => {
    if (!user?.id) return
    
    setLoadingInsights(true)
    try {
      const response = await fetch(`/api/insights?userId=${user.id}`)
      if (response.ok) {
        const { insights: fetchedInsights } = await response.json()
        setInsights(fetchedInsights || [])
      }
    } catch (error) {
      console.error('Error fetching insights:', error)
    } finally {
      setLoadingInsights(false)
    }
  }, [user?.id])

  // Fetch weekly challenges
  const fetchWeeklyChallenges = useCallback(async () => {
    if (!user?.id) return
    
    try {
      const response = await fetch(`/api/weekly-challenges?userId=${user.id}`)
      if (response.ok) {
        const { challenges } = await response.json()
        setWeeklyChallenges(challenges || [])
      }
    } catch (error) {
      console.error('Error fetching weekly challenges:', error)
    }
  }, [user?.id])

  // Handle prayer session completion
  const handlePrayerSessionComplete = useCallback((session: any) => {
    // Update user stats
    setUserStats(prev => ({
      ...prev,
      prayersShared: prev.prayersShared + 1
    }))
    
    // Refresh insights
    fetchInsights()
    
    toast({
      title: "Prayer Session Saved! 🙏",
      description: `Your ${session.duration_minutes}-minute prayer session has been recorded.`,
    })
  }, [fetchInsights, toast])

  // Handle challenge participation
  const handleJoinChallenge = useCallback(async (challengeId: string) => {
    if (!user?.id) return
    
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
        fetchWeeklyChallenges()
      }
    } catch (error) {
      console.error('Error joining challenge:', error)
      toast({
        title: "Error",
        description: "Failed to join challenge. Please try again.",
        variant: "destructive"
      })
    }
  }, [user?.id, fetchWeeklyChallenges, toast])

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

  // Fetch insights and challenges when user is available
  useEffect(() => {
    if (user?.id) {
      fetchInsights()
      fetchWeeklyChallenges()
    }
  }, [user?.id, fetchInsights, fetchWeeklyChallenges])

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
      
      <div className="container mx-auto px-3 sm:px-4 pt-16 sm:pt-20 md:pt-24 pb-4 sm:pb-6 md:pb-8">
        {/* Welcome Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4 px-2">
            {t("dashboard.welcomeBack", { name: userDisplayName })}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-2">
            {t("dashboard.subtitle")}
          </p>
          
          {/* Streak Badge */}
          <div className="mt-4 sm:mt-6">
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
              <div className="text-2xl font-bold text-gray-800 mb-2">{userStats.bibleVersesRead}</div>
              <div className="text-gray-600 font-medium">Bible Verses Read</div>
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
                          onClick={() => setShowPrayerModal(true)}
                        >
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
                          onClick={() => {
                            // For weekly challenge, redirect to community page to share prayer requests
                            router.push('/community')
                          }}
                        >
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
                  <Button variant="outline" size="sm">
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
                        <p className="text-sm text-gray-500">Progress: 2/5 completed</p>
                      </div>
                    </div>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '40%'}}></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Heart className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Pray for 10 minutes daily</p>
                        <p className="text-sm text-gray-500">Streak: 3 days</p>
                      </div>
                    </div>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{width: '30%'}}></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Join a youth group event</p>
                        <p className="text-sm text-gray-500">Next event: This Saturday</p>
                      </div>
                    </div>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '0%'}}></div>
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
                    <p className="text-xs text-gray-500">Completed</p>
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded-lg border border-indigo-100">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold text-lg">📖</span>
                    </div>
                    <p className="text-sm font-medium text-gray-800">Bible Reader</p>
                    <p className="text-xs text-gray-500">5 verses</p>
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded-lg border border-indigo-100">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold text-lg">🤝</span>
                    </div>
                    <p className="text-sm font-medium text-gray-800">Community</p>
                    <p className="text-xs text-gray-500">Active</p>
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded-lg border border-indigo-100">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold text-lg">💫</span>
                    </div>
                    <p className="text-sm font-medium text-gray-800">Next Goal</p>
                    <p className="text-xs text-gray-500">Prayer Streak</p>
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
                    <div className="text-2xl font-bold text-blue-600 mb-1">{userStats.prayersShared + userStats.bibleVersesRead + userStats.journalEntries}</div>
                    <div className="text-sm text-gray-600">Total Activities</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border border-green-100">
                    <div className="text-2xl font-bold text-green-600 mb-1">{Math.min(100, Math.floor((userStats.daysActive / 30) * 100))}%</div>
                    <div className="text-sm text-gray-600">Monthly Goal</div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-white">Prayer Warrior</Badge>
                  <Badge variant="outline" className="bg-white">Scripture Reader</Badge>
                  <Badge variant="outline" className="bg-white">Community Member</Badge>
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
                    onClick={() => router.push('/prayer-wall')}
                  >
                    <Heart className="h-6 w-6 text-red-500" />
                    <span className="text-sm font-medium">Prayer Wall</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center space-y-2 border-2 hover:border-green-300 hover:bg-green-50"
                    onClick={() => router.push('/youth-groups')}
                  >
                    <Users className="h-6 w-6 text-green-500" />
                    <span className="text-sm font-medium">Youth Groups</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center space-y-2 border-2 hover:border-purple-300 hover:bg-purple-50"
                    onClick={() => router.push('/faithbot')}
                  >
                    <MessageCircle className="h-6 w-6 text-purple-500" />
                    <span className="text-sm font-medium">FaithBot AI</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center space-y-2 border-2 hover:border-orange-300 hover:bg-orange-50"
                    onClick={() => router.push('/faith-journal')}
                  >
                    <PenTool className="h-6 w-6 text-orange-500" />
                    <span className="text-sm font-medium">Faith Journal</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Community Activity Feed */}
        {user && (
          <div className="mb-8">
            <Card className="bg-white shadow-lg border border-gray-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Community Activity</h3>
                  <Button variant="ghost" size="sm" onClick={() => router.push('/community')}>
                    View All
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Heart className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">
                        <span className="font-medium">Sarah M.</span> shared a prayer request
                      </p>
                      <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">
                        <span className="font-medium">St. Mary's Youth</span> has a new event
                      </p>
                      <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <MessageCircle className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">
                        <span className="font-medium">Michael T.</span> shared a faith story
                      </p>
                      <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                    </div>
                  </div>
                </div>
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
  )
}
