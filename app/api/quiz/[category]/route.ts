import { NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
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

    // Get questions for the category
    const { data: questions, error } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('category', category)
      .order('id')

    if (error) {
      console.error('Error fetching questions:', error)
      return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 })
    }

    // If no questions in database, return default questions
    if (!questions || questions.length === 0) {
      const defaultQuestions = getDefaultQuestions(category)
      return NextResponse.json({ questions: defaultQuestions })
    }

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
