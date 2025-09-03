import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

// Force this route to be dynamic since it uses request.url
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const limit = parseInt(searchParams.get("limit") || "10")
    const period = searchParams.get("period") || "all" // all, week, month

    if (!category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 })
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let dateFilter = ''
    if (period === 'week') {
      dateFilter = 'last_attempted >= NOW() - INTERVAL \'7 days\''
    } else if (period === 'month') {
      dateFilter = 'last_attempted >= NOW() - INTERVAL \'30 days\''
    }

    // Build the query
    let query = supabase
      .from('quiz_progress')
      .select(`
        *,
        users!inner(
          username,
          avatar_url,
          parish
        )
      `)
      .order('best_score', { ascending: false })
      .limit(50)

    if (category) {
      query = query.eq('category', category)
    }

    if (dateFilter) {
      query = query.filter(dateFilter)
    }

    const { data: leaderboard, error } = await query

    if (error) {
      console.error('Error fetching leaderboard:', error)
      return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 })
    }

    // Get user's own ranking
    const { data: userRanking } = await supabase
      .from('quiz_progress')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('category', category || 'faith-basics')
      .single()

    // Calculate achievements
    const { data: userAchievements } = await supabase
      .from('quiz_progress')
      .select('*')
      .eq('user_id', session.user.id)

    const achievements = calculateAchievements(userAchievements || [])

    return NextResponse.json({
      leaderboard: leaderboard || [],
      userRanking,
      achievements,
      timeframe,
      category
    })

  } catch (error) {
    console.error('Leaderboard API error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function calculateAchievements(progress: any[]) {
  const achievements = []
  
  // Quiz Master - Complete all categories with 90%+
  const highScores = progress.filter(p => p.best_score >= 90)
  if (highScores.length >= 6) {
    achievements.push({
      id: 'quiz-master',
      name: 'Quiz Master',
      description: 'Achieved 90% or higher in all quiz categories',
      icon: '🏆',
      unlocked: true
    })
  }

  // First Steps - Complete first quiz
  if (progress.length > 0) {
    achievements.push({
      id: 'first-steps',
      name: 'First Steps',
      description: 'Completed your first quiz',
      icon: '🎯',
      unlocked: true
    })
  }

  // Persistent Learner - Take 10+ quizzes
  const totalAttempts = progress.reduce((sum, p) => sum + p.attempts, 0)
  if (totalAttempts >= 10) {
    achievements.push({
      id: 'persistent-learner',
      name: 'Persistent Learner',
      description: 'Taken 10 or more quizzes',
      icon: '📚',
      unlocked: true
    })
  }

  // Speed Demon - Complete quiz in under 2 minutes
  const fastQuizzes = progress.filter(p => p.time_spent && p.time_spent < 120)
  if (fastQuizzes.length > 0) {
    achievements.push({
      id: 'speed-demon',
      name: 'Speed Demon',
      description: 'Completed a quiz in under 2 minutes',
      icon: '⚡',
      unlocked: true
    })
  }

  // Perfect Score - Get 100% on any quiz
  const perfectScores = progress.filter(p => p.best_score === 100)
  if (perfectScores.length > 0) {
    achievements.push({
      id: 'perfect-score',
      name: 'Perfect Score',
      description: 'Achieved 100% on a quiz',
      icon: '💯',
      unlocked: true
    })
  }

  return achievements
}
