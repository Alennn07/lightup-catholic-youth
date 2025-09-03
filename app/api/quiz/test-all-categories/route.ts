import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing all quiz categories...')
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const categories = [
      "faith-basics",
      "bible-trivia", 
      "church-history",
      "modern-faith",
      "saints-heroes",
      "prayer-worship"
    ]

    const results: Record<string, any> = {}

    for (const category of categories) {
      try {
        const { data: questions, error } = await supabase
          .from('quiz_questions')
          .select('*')
          .eq('category', category)
          .order('id')
        
        results[category] = {
          success: !error,
          count: questions?.length || 0,
          error: error?.message || null,
          sample_question: questions?.[0] || null
        }
      } catch (error: any) {
        results[category] = {
          success: false,
          count: 0,
          error: error.message,
          sample_question: null
        }
      }
    }

    // Get total count
    const { count: totalQuestions, error: totalError } = await supabase
      .from('quiz_questions')
      .select('*', { count: 'exact', head: true })

    return NextResponse.json({
      success: true,
      total_questions: totalQuestions || 0,
      total_error: totalError?.message || null,
      categories: results,
      summary: {
        categories_with_questions: Object.values(results).filter((r: any) => r.count > 0).length,
        total_categories: categories.length,
        categories_needing_questions: Object.values(results).filter((r: any) => r.count === 0).length
      }
    })

  } catch (error: any) {
    console.error('❌ Quiz categories test failed:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
