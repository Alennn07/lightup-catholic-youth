"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Heart, Share2, RefreshCw, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

interface BibleVerse {
  id?: number
  verse: string
  reference: string
  reflection: string
  date: string
  category?: string
  dayOfWeek?: number
  timestamp?: string
}

export function DailyBibleVerse() {
  const [verse, setVerse] = useState<BibleVerse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const { toast } = useToast()
  // Using the singleton supabase client from lib/supabase.ts

  // Get category display name
  const getCategoryDisplay = (category?: string) => {
    if (!category) return ""
    const categoryMap: { [key: string]: string } = {
      "identity": "Identity & Self-Worth",
      "peer-pressure": "Peer Pressure & Standing Strong",
      "anxiety": "Anxiety & Worry",
      "friendship": "Friendship & Relationships",
      "future": "Future & Dreams",
      "courage": "Courage & Overcoming Fear",
      "trust": "Faith & Trust",
      "leadership": "Youth Leadership",
      "strength": "Inner Strength",
      "burdens": "Carrying Burdens",
      "rest": "Finding Rest",
      "love": "God's Love"
    }
    return categoryMap[category] || category
  }

  // Get day name
  const getDayName = (dayOfWeek?: number) => {
    if (dayOfWeek === undefined) return ""
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return days[dayOfWeek]
  }

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
      } catch (error) {
        console.error("Auth error:", error)
      } finally {
        setIsAuthLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const fetchVerse = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/bible-verse")
      if (!response.ok) throw new Error("Failed to fetch verse")
      const data = await response.json()
      setVerse(data)
    } catch (error) {
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
    fetchVerse()
  }, [])

  const handleLike = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like and save verses",
        variant: "destructive",
      })
      return
    }

    setIsLiked(!isLiked)
    toast({
      title: isLiked ? "Removed from favorites" : "Added to favorites",
      description: isLiked ? "Verse removed from your favorites" : "Verse saved to your favorites",
    })
  }

  const handleShare = async () => {
    if (!verse) return

    const shareText = `"${verse.verse}" - ${verse.reference}\n\n${verse.reflection}`

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

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-amber-50 via-white to-rose-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-rose-500 rounded-full mb-4 shadow-lg">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Daily Bible Verse</h1>
            <p className="text-lg text-gray-600">Today's scripture to inspire your faith journey</p>
          </div>

          {/* Loading Skeleton */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
            <div className="animate-pulse space-y-4">
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

  if (!verse) {
    return (
      <div className="bg-gradient-to-br from-amber-50 via-white to-rose-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-rose-500 rounded-full mb-4 shadow-lg">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Daily Bible Verse</h1>
            <p className="text-lg text-gray-600">Today's scripture to inspire your faith journey</p>
          </div>

          {/* Error State */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
            <p className="text-gray-600 mb-6 text-lg">Failed to load today's verse</p>
            <Button
              onClick={fetchVerse}
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
    <div className="bg-gradient-to-br from-amber-50 via-white to-rose-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-rose-500 rounded-full mb-4 shadow-lg">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Daily Bible Verse</h1>
          <p className="text-lg text-gray-600">Today's scripture to inspire your faith journey</p>
          
          {/* Category and Day Badge */}
          {verse?.category && (
            <div className="mt-4 flex justify-center items-center gap-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {getCategoryDisplay(verse.category)}
              </span>
              {verse.dayOfWeek !== undefined && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {getDayName(verse.dayOfWeek)}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Verse Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="text-center mb-8">
            <blockquote className="text-2xl font-medium text-gray-800 mb-4 leading-relaxed italic">"{verse.verse}"</blockquote>
            <cite className="text-lg text-amber-600 font-semibold">- {verse.reference}</cite>
          </div>

          <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <h4 className="text-lg font-semibold text-amber-800">Today's Reflection</h4>
              <span className="text-xs text-amber-600 bg-amber-200 px-2 py-1 rounded-full">Youth Focused</span>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg">{verse.reflection}</p>
            
            {/* Action Prompt */}
            <div className="mt-4 p-4 bg-white rounded-lg border border-amber-200">
              <p className="text-sm text-amber-700 font-medium mb-2">💭 Take Action Today:</p>
              <p className="text-sm text-gray-600">
                {verse.category === 'identity' && "Write down 3 things that make you unique and special."}
                {verse.category === 'peer-pressure' && "Identify one situation where you can stand up for your faith."}
                {verse.category === 'anxiety' && "Write down your biggest worry and pray about it for 5 minutes."}
                {verse.category === 'friendship' && "Reach out to a friend who might be going through a hard time."}
                {verse.category === 'future' && "Spend 10 minutes dreaming with God about your future."}
                {verse.category === 'courage' && "Do one thing today that scares you but is good for you."}
                {verse.category === 'trust' && "Make a decision today and trust God with the outcome."}
                {verse.category === 'leadership' && "Look for one way to serve or help someone today."}
                {verse.category === 'strength' && "Identify a challenge and ask God for strength to face it."}
                {verse.category === 'burdens' && "Write down your biggest burden and give it to God in prayer."}
                {verse.category === 'rest' && "Take 5 minutes today to be still and breathe deeply."}
                {verse.category === 'love' && "Show love to someone who is hard to love today."}
                {!verse.category && "Take a moment to reflect on how this verse applies to your life today."}
              </p>
            </div>
          </div>

          {/* Interactive Buttons */}
          <div className="flex justify-center gap-4">
            {user ? (
              // Authenticated user - can like and share
              <>
                <Button
                  onClick={handleLike}
                  variant="ghost"
                  size="lg"
                  className={`text-amber-600 hover:bg-amber-50 hover:text-amber-700 ${isLiked ? "text-rose-500" : ""}`}
                >
                  <Heart className={`h-5 w-5 mr-2 ${isLiked ? "fill-current" : ""}`} />
                  {isLiked ? "Liked" : "Like"}
                </Button>
                <Button 
                  onClick={handleShare} 
                  variant="ghost" 
                  size="lg" 
                  className="text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                >
                  <Share2 className="h-5 w-5 mr-2" />
                  Share
                </Button>
              </>
            ) : (
              // Non-authenticated user - show sign-in prompts
              <>
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-gray-400 cursor-not-allowed"
                  disabled
                >
                  <Lock className="h-5 w-5 mr-2" />
                  Like
                </Button>
                <Button 
                  variant="ghost" 
                  size="lg" 
                  className="text-gray-400 cursor-not-allowed"
                  disabled
                >
                  <Lock className="h-5 w-5 mr-2" />
                  Share
                </Button>
              </>
            )}
          </div>

          {/* Sign-in prompt for non-authenticated users */}
          {!user && !isAuthLoading && (
            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm mb-3">
                Sign in to like, save, and share verses
              </p>
              <div className="flex justify-center gap-3">
                <Link href="/auth/sign-in">
                  <Button size="sm" variant="outline" className="border-amber-300 text-amber-600 hover:bg-amber-50">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                    Join Us
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
