import { NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's quiz progress
    const { data: userProgress, error: progressError } = await supabase
      .from('quiz_progress')
      .select('*')
      .eq('user_id', session.user.id)

    if (progressError) {
      console.error('Error fetching user progress:', progressError)
    }

    // Return quiz categories and user progress
    const quizData = {
      categories: [
        {
          id: "faith-basics",
          name: "Faith Fundamentals",
          description: "Test your knowledge of basic Catholic beliefs and teachings",
          questionCount: 5,
          difficulty: "Easy",
          userScore: userProgress?.find(p => p.category === 'faith-basics')?.best_score || 0,
          completed: userProgress?.find(p => p.category === 'faith-basics')?.completed || false
        },
        {
          id: "bible-trivia",
          name: "Bible Trivia",
          description: "Fun facts and stories from the Bible",
          questionCount: 5,
          difficulty: "Medium",
          userScore: userProgress?.find(p => p.category === 'faith-basics')?.best_score || 0,
          completed: userProgress?.find(p => p.category === 'faith-basics')?.completed || false
        },
        {
          id: "church-history",
          name: "Church History",
          description: "Important events and figures in Catholic history",
          questionCount: 5,
          difficulty: "Medium",
          userScore: userProgress?.find(p => p.category === 'faith-basics')?.best_score || 0,
          completed: userProgress?.find(p => p.category === 'faith-basics')?.completed || false
        },
        {
          id: "modern-faith",
          name: "Modern Faith",
          description: "Contemporary Catholic life and youth ministry",
          questionCount: 5,
          difficulty: "Easy",
          userScore: userProgress?.find(p => p.category === 'faith-basics')?.best_score || 0,
          completed: userProgress?.find(p => p.category === 'faith-basics')?.completed || false
        },
        {
          id: "saints-heroes",
          name: "Saints & Heroes",
          description: "Inspiring stories of Catholic saints and role models",
          questionCount: 5,
          difficulty: "Medium",
          userScore: userProgress?.find(p => p.category === 'faith-basics')?.best_score || 0,
          completed: userProgress?.find(p => p.category === 'faith-basics')?.completed || false
        },
        {
          id: "prayer-worship",
          name: "Prayer & Worship",
          description: "Different forms of prayer and liturgical practices",
          questionCount: 5,
          difficulty: "Easy",
          userScore: userProgress?.find(p => p.category === 'faith-basics')?.best_score || 0,
          completed: userProgress?.find(p => p.category === 'faith-basics')?.completed || false
        }
      ],
      userProgress: userProgress || []
    }

    return NextResponse.json(quizData)
  } catch (error) {
    console.error('Quiz API error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { category, score, totalQuestions, timeSpent } = body

    if (!category || score === undefined || !totalQuestions) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Calculate percentage and determine if it's a new best score
    const percentage = Math.round((score / totalQuestions) * 100)
    
    // Check if user already has progress for this category
    const { data: existingProgress } = await supabase
      .from('quiz_progress')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('category', category)
      .single()

    if (existingProgress) {
      // Update existing progress if new score is better
      if (percentage > existingProgress.best_score) {
        const { error: updateError } = await supabase
          .from('quiz_progress')
          .update({
            best_score: percentage,
            attempts: existingProgress.attempts + 1,
            last_attempted: new Date().toISOString(),
            time_spent: timeSpent || 0
          })
          .eq('id', existingProgress.id)

        if (updateError) {
          console.error('Error updating quiz progress:', updateError)
          return NextResponse.json({ error: "Failed to update progress" }, { status: 500 })
        }
      } else {
        // Just increment attempts
        const { error: updateError } = await supabase
          .from('quiz_progress')
          .update({
            attempts: existingProgress.attempts + 1,
            last_attempted: new Date().toISOString()
          })
          .eq('id', existingProgress.id)

        if (updateError) {
          console.error('Error updating quiz attempts:', updateError)
        }
      }
    } else {
      // Create new progress record
      const { error: insertError } = await supabase
        .from('quiz_progress')
        .insert({
          user_id: session.user.id,
          category,
          best_score: percentage,
          attempts: 1,
          completed: percentage >= 80, // Mark as completed if score is 80% or higher
          first_attempted: new Date().toISOString(),
          last_attempted: new Date().toISOString(),
          time_spent: timeSpent || 0
        })

      if (insertError) {
        console.error('Error creating quiz progress:', insertError)
        return NextResponse.json({ error: "Failed to save progress" }, { status: 500 })
      }
    }

    // Return success response with updated stats
    return NextResponse.json({
      success: true,
      message: "Quiz results saved successfully",
      score: percentage,
      isNewBest: !existingProgress || percentage > existingProgress.best_score
    })

  } catch (error) {
    console.error('Quiz submission error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
