import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing quiz database connection...')
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Test 1: Check if quiz_questions table exists
    console.log('🔍 Test 1: Check quiz_questions table')
    const { data: questions, error: questionsError } = await supabase
      .from('quiz_questions')
      .select('*')
      .limit(5)
    
    console.log('Quiz questions test result:', { data: questions, error: questionsError })

    // Test 2: Check table structure
    console.log('🔍 Test 2: Check table structure')
    const { data: structure, error: structureError } = await supabase
      .from('quiz_questions')
      .select('*')
      .limit(1)
    
    console.log('Structure test result:', { data: structure, error: structureError })

    // Test 3: Count questions by category
    console.log('🔍 Test 3: Count questions by category')
    const categories = ['faith-basics', 'bible-trivia', 'church-history', 'modern-faith', 'saints-heroes', 'prayer-worship']
    const categoryCounts: Record<string, number> = {}
    
    for (const category of categories) {
      const { count, error } = await supabase
        .from('quiz_questions')
        .select('*', { count: 'exact', head: true })
        .eq('category', category)
      
      categoryCounts[category] = count || 0
      if (error) {
        console.error(`Error counting ${category}:`, error)
      }
    }

    // Test 4: Check if quiz_progress table exists
    console.log('🔍 Test 4: Check quiz_progress table')
    const { data: progress, error: progressError } = await supabase
      .from('quiz_progress')
      .select('*')
      .limit(5)
    
    console.log('Quiz progress test result:', { data: progress, error: progressError })

    return NextResponse.json({
      success: true,
      tests: {
        quiz_questions_table: { 
          exists: !questionsError, 
          error: questionsError?.message,
          sample_data: questions?.[0] || null,
          total_questions: questions?.length || 0
        },
        table_structure: { 
          success: !structureError, 
          columns: structure ? Object.keys(structure[0] || {}) : [], 
          error: structureError?.message 
        },
        category_counts: categoryCounts,
        quiz_progress_table: { 
          exists: !progressError, 
          error: progressError?.message,
          sample_data: progress?.[0] || null
        }
      }
    })

  } catch (error: any) {
    console.error('❌ Quiz database test failed:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
