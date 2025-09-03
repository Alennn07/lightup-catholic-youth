import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

// Force this route to be dynamic since it uses request.url
export const dynamic = 'force-dynamic'

export async function GET(request: Request, { params }: { params: { category: string } }) {
  try {
    // Get user ID from query parameters instead of session
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    console.log('🔍 Quiz API called with userId:', userId)
    
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Set up Supabase client
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

    const { category } = params

    // Validate category
    const validCategories = [
      "faith-basics",
      "bible-trivia", 
      "church-history",
      "modern-faith",
      "saints-heroes",
      "prayer-worship"
    ]

    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 })
    }

    // Get questions from database
    const { data: questions, error: dbError } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('category', category)
      .order('id')
    
    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({ 
        error: 'Failed to fetch quiz questions',
        details: dbError.message 
      }, { status: 500 })
    }

    // If no questions in database, return error (no fallback)
    if (!questions || questions.length === 0) {
      console.log('No questions found in database for category:', category)
      return NextResponse.json({ 
        error: 'No questions available for this category',
        message: 'Please contact an administrator to add questions for this category'
      }, { status: 404 })
    }

    console.log(`Found ${questions.length} questions for category:`, category)
    console.log('Sample question data:', questions[0])
    return NextResponse.json({ questions })
  } catch (error) {
    console.error('Quiz questions API error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


