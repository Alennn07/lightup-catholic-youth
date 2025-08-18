"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import { Navigation } from "@/components/navigation"
import { DailyBibleVerse } from "@/components/daily-bible-verse"
import { PrayerWall } from "@/components/prayer-wall"
import { YouthGroupFinder } from "@/components/youth-group-finder"
import { FaithJournal } from "@/components/faith-journal"
import { FaithBot } from "@/components/faith-bot"
import ParishCalendar from "@/components/parish-calendar"
import { FaithQuiz } from "@/components/faith-quiz"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Heart,
  Users,
  Calendar,
  PenTool,
  MessageCircle,
  Sparkles,
  TrendingUp,
  Clock,
  ArrowRight,
  Loader2,
  Brain,
} from "lucide-react"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  // Using the singleton supabase client from lib/supabase.ts

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user) {
          // Redirect to sign-in if not authenticated
          router.push("/auth/sign-in")
          return
        }
        setUser(session.user)
      } catch (error) {
        console.error("Auth error:", error)
        router.push("/auth/sign-in")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT") {
          router.push("/auth/sign-in")
        } else if (session?.user) {
          setUser(session.user)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth, router])

  // Handle hash navigation from features page
  useEffect(() => {
    if (!user) return // Only handle hash navigation when user is authenticated
    
    const hash = window.location.hash.replace("#", "")
    if (hash) {
      setActiveTab(hash)
      // Scroll to the section after a brief delay
      setTimeout(() => {
        const element = document.getElementById(hash)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      }, 100)
    }
  }, [user])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // Don't render dashboard content if user is not authenticated
  if (!user) {
    return null
  }

  const stats = [
    { label: "Days Active", value: "47", icon: Calendar, color: "text-blue-600" },
    { label: "Prayers Shared", value: "23", icon: Heart, color: "text-red-500" },
    { label: "Bible Verses Read", value: "156", icon: BookOpen, color: "text-green-600" },
    { label: "Journal Entries", value: "31", icon: PenTool, color: "text-purple-600" },
  ]

  const quickActions = [
    { label: "Daily Verse", icon: BookOpen, tab: "bible-verse", color: "bg-blue-100 text-blue-600" },
    { label: "Prayer Wall", icon: Heart, tab: "prayer-wall", color: "bg-red-100 text-red-600" },
    { label: "Youth Groups", icon: Users, tab: "youth-groups", color: "bg-green-100 text-green-600" },
    { label: "Faith Journal", icon: PenTool, tab: "faith-journal", color: "bg-purple-100 text-purple-600" },
    { label: "FaithBot", icon: MessageCircle, tab: "faithbot", color: "bg-orange-100 text-orange-600" },
    { label: "Parish Events", icon: Calendar, tab: "parish-calendar", color: "bg-indigo-100 text-indigo-600" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />

      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                  Welcome back, <span className="text-blue-600">{user.email?.split('@')[0] || 'User'}</span>! 🙏
                </h1>
                <p className="text-gray-600 text-lg">Continue your faith journey with today's activities</p>
              </div>
              <div className="mt-4 md:mt-0">
                <Badge
                  variant="outline"
                  className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200"
                >
                  <Sparkles className="h-4 w-4 mr-1" />
                  47 day streak!
                </Badge>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {quickActions.map((action) => (
                    <Button
                      key={action.tab}
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent hover:bg-white/50"
                      onClick={() => setActiveTab(action.tab)}
                    >
                      <div className={`p-2 rounded-lg ${action.color}`}>
                        <action.icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium">{action.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8 bg-white/80 backdrop-blur-sm">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="bible-verse" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Bible</span>
              </TabsTrigger>
              <TabsTrigger value="prayer-wall" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Prayer</span>
              </TabsTrigger>
              <TabsTrigger value="youth-groups" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Groups</span>
              </TabsTrigger>
              <TabsTrigger value="faith-journal" className="flex items-center gap-2">
                <PenTool className="h-4 w-4" />
                <span className="hidden sm:inline">Journal</span>
              </TabsTrigger>
              <TabsTrigger value="faithbot" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <span className="hidden sm:inline">FaithBot</span>
              </TabsTrigger>
              <TabsTrigger value="faith-quiz" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline">Challenge</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="bg-white/80 backdrop-blur-sm border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                        Today's Bible Verse
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <DailyBibleVerse />
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Card className="bg-white/80 backdrop-blur-sm border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-red-500" />
                        Recent Prayer Requests
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">Please pray for my upcoming exams 🙏</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />2 hours ago • 12 prayers
                          </div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">Healing for my grandmother</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />5 hours ago • 28 prayers
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full bg-transparent"
                          onClick={() => setActiveTab("prayer-wall")}
                        >
                          View All Prayers
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-green-600" />
                      Upcoming Parish Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                        <h4 className="font-semibold text-blue-800">Youth Mass</h4>
                        <p className="text-sm text-blue-600">Sunday, 6:00 PM</p>
                        <p className="text-xs text-blue-500 mt-1">St. Mary's Parish</p>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                        <h4 className="font-semibold text-green-800">Bible Study</h4>
                        <p className="text-sm text-green-600">Wednesday, 7:00 PM</p>
                        <p className="text-xs text-green-500 mt-1">Parish Hall</p>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                        <h4 className="font-semibold text-purple-800">Volunteer Day</h4>
                        <p className="text-sm text-purple-600">Saturday, 9:00 AM</p>
                        <p className="text-xs text-purple-500 mt-1">Community Center</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="bible-verse" id="bible-verse">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <DailyBibleVerse />
              </motion.div>
            </TabsContent>

            <TabsContent value="prayer-wall" id="prayer-wall">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <PrayerWall />
              </motion.div>
            </TabsContent>

            <TabsContent value="youth-groups" id="youth-groups">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <YouthGroupFinder />
              </motion.div>
            </TabsContent>

            <TabsContent value="faith-journal" id="faith-journal">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <FaithJournal />
              </motion.div>
            </TabsContent>

            <TabsContent value="faithbot" id="faithbot">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <FaithBot />
              </motion.div>
            </TabsContent>

            <TabsContent value="faith-quiz" id="faith-quiz">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <FaithQuiz />
              </motion.div>
            </TabsContent>

            <TabsContent value="parish-calendar" id="parish-calendar">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <ParishCalendar />
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
