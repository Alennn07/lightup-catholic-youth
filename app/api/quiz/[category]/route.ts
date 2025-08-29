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

    // Try to get questions from database, but always fallback to defaults
    let questions = null
    let dbError = null
    
    try {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('category', category)
        .order('id')
      
      questions = data
      dbError = error
    } catch (error) {
      console.error('Database connection error:', error)
      dbError = error
    }

    // If database fails or no questions, use defaults
    if (dbError || !questions || questions.length === 0) {
      console.log('Using default questions for category:', category)
      const defaultQuestions = getDefaultQuestions(category)
      return NextResponse.json({ questions: defaultQuestions })
    }

    // If no questions in database, return default questions
    if (!questions || questions.length === 0) {
      console.log('No questions found in database for category:', category, 'using default questions')
      const defaultQuestions = getDefaultQuestions(category)
      return NextResponse.json({ questions: defaultQuestions })
    }

    console.log(`Found ${questions.length} questions for category:`, category)
    console.log('Sample question data:', questions[0])
    return NextResponse.json({ questions })
  } catch (error) {
    console.error('Quiz questions API error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function getDefaultQuestions(category: string) {
  // This function provides fallback questions if the database is empty
  // In a production app, you'd want to store these in the database
  const questionSets = {
    "faith-basics": [
      {
        id: 1,
        question: "What are the three theological virtues?",
        options: ["Faith, Hope, and Love", "Faith, Hope, and Charity", "Faith, Love, and Joy", "Faith, Peace, and Love"],
        correctAnswer: 1,
        explanation: "The three theological virtues are Faith, Hope, and Charity (Love). These are gifts from God that help us live in relationship with Him.",
        category: "faith-basics"
      },
      {
        id: 2,
        question: "What is the first sacrament we receive?",
        options: ["First Communion", "Confirmation", "Baptism", "Reconciliation"],
        correctAnswer: 2,
        explanation: "Baptism is the first sacrament we receive, which cleanses us from original sin and makes us members of the Church.",
        category: "faith-basics"
      }
    ],
    "bible-trivia": [
      {
        id: 1,
        question: "How many days and nights did Jesus fast in the desert?",
        options: ["30 days", "40 days", "50 days", "60 days"],
        correctAnswer: 1,
        explanation: "Jesus fasted for 40 days and 40 nights in the desert, just as Moses and Elijah did before Him.",
        category: "bible-trivia"
      },
      {
        id: 2,
        question: "What was the name of Jesus' mother?",
        options: ["Mary", "Elizabeth", "Anna", "Sarah"],
        correctAnswer: 0,
        explanation: "Jesus' mother was Mary, who was chosen by God to be the Mother of Jesus and is honored as the Mother of God.",
        category: "bible-trivia"
      }
    ]
  }

  return questionSets[category as keyof typeof questionSets] || []
}
