"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Heart, Share2, CheckCircle, Flame, Calendar, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

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
  const { toast } = useToast()

  // Check authentication
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

  // Fetch today's verse and user progress
  const fetchDailyVerse = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('No access token')
      }

      const response = await fetch('/api/daily-bible-verse', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) throw new Error('Failed to fetch verse')
      
      const data = await response.json()
      console.log('✅ Fetched verse data:', data)
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
    if (user) {
      fetchDailyVerse()
    }
  }, [user])

  const handleMarkCompleted = async () => {
    if (!user || !verseData || isUpdating) return
    
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
          verse_id: verseData.verse.reference
        })
      })

      if (!response.ok) throw new Error('Failed to mark as completed')
      
      const result = await response.json()
      console.log('✅ Marked as completed:', result)
      
      // Update local state
      setVerseData(prev => prev ? {
        ...prev,
        user_progress: {
          ...prev.user_progress,
          is_completed: true,
          read_at: new Date().toISOString()
        }
      } : null)
      
      toast({
        title: "Success!",
        description: "Verse marked as completed!",
      })
      
      // Refresh to get updated streak
      setTimeout(() => fetchDailyVerse(), 500)
      
    } catch (error) {
      console.error('Error marking as completed:', error)
      toast({
        title: "Error",
        description: "Failed to mark as completed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleToggleFavorite = async () => {
    if (!user || !verseData || isUpdating) return
    
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
          action: 'toggle_favorite',
          verse_id: verseData.verse.reference
        })
      })

      if (!response.ok) throw new Error('Failed to toggle favorite')
      
      const result = await response.json()
      console.log('✅ Toggle favorite result:', result)
      
      // Update local state
      setVerseData(prev => prev ? {
        ...prev,
        user_progress: {
          ...prev.user_progress,
          is_favorited: result.is_favorited
        }
      } : null)
      
      toast({
        title: result.is_favorited ? "Added to favorites!" : "Removed from favorites!",
        description: result.message,
      })
      
    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast({
        title: "Error",
        description: "Failed to toggle favorite. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading today's verse...</p>
        </div>
      </div>
    )
  }

  if (!verseData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No verse available today.</p>
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
          <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
            Daily Bible Verse
          </CardTitle>
          <p className="text-gray-600 text-lg">
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
              <div className="text-2xl font-bold text-gray-800">
                {verseData.stats.reading_streak}
              </div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </Card>
            
            <Card className="text-center p-4">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="h-6 w-6 text-green-500" />
              </div>
              <div className="text-lg font-bold text-gray-800">
                {new Date(verseData.stats.today_date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
              <div className="text-sm text-gray-600">Today's Date</div>
            </Card>
          </div>

          {/* Bible Verse */}
          <div className="text-center mb-6">
            <blockquote className="text-2xl italic text-gray-800 mb-4 leading-relaxed">
              "{verseData.verse.text}"
            </blockquote>
            <cite className="text-lg text-orange-600 font-semibold">
              - {verseData.verse.reference}
            </cite>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Today's Progress</span>
              <span className="text-sm text-gray-600">
                {verseData.user_progress.is_completed ? 'Completed' : 'Not Started'}
              </span>
            </div>
            <Progress 
              value={verseData.user_progress.is_completed ? 100 : 0} 
              className="h-2"
            />
          </div>

          {/* Reflection */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">Today's Reflection</span>
                <Badge variant="secondary" className="text-xs">Youth Focused</Badge>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {verseData.verse.reflection}
              </p>
            </CardContent>
          </Card>

          {/* Action Prompt */}
          <div className="text-center">
            <p className="text-gray-700 mb-4">
              <strong>Take Action Today:</strong> {verseData.verse.action_prompt}
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

            <Button
              onClick={handleToggleFavorite}
              disabled={isUpdating}
              variant={verseData.user_progress.is_favorited ? 'default' : 'outline'}
              className={`flex items-center gap-2 ${
                verseData.user_progress.is_favorited 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'border-red-300 text-red-600 hover:bg-red-50'
              }`}
            >
              <Heart className="h-4 w-4" />
              {verseData.user_progress.is_favorited ? 'Favorited' : 'Favorite'}
            </Button>

            <Button variant="outline" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>

          {/* Success Message */}
          {verseData.user_progress.is_completed && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
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
  )
}
