"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Brain, 
  Trophy, 
  Lightbulb, 
  BookOpen, 
  Heart, 
  Users, 
  Star, 
  CheckCircle, 
  XCircle,
  ArrowRight,
  RefreshCw,
  Home
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  category: string
}

interface QuizCategory {
  id: string
  name: string
  description: string
  icon: any
  color: string
  questionCount: number
  difficulty: "Easy" | "Medium" | "Hard"
}

const quizCategories: QuizCategory[] = [
  {
    id: "faith-basics",
    name: "Faith Fundamentals",
    description: "Test your knowledge of basic Catholic beliefs and teachings",
    icon: Heart,
    color: "from-pink-500 to-rose-500",
    questionCount: 5,
    difficulty: "Easy"
  },
  {
    id: "bible-trivia",
    name: "Bible Trivia",
    description: "Fun facts and stories from the Bible",
    icon: BookOpen,
    color: "from-blue-500 to-cyan-500",
    questionCount: 5,
    difficulty: "Medium"
  },
  {
    id: "church-history",
    name: "Church History",
    description: "Important events and figures in Catholic history",
    icon: Users,
    color: "from-purple-500 to-indigo-500",
    questionCount: 5,
    difficulty: "Medium"
  },
  {
    id: "modern-faith",
    name: "Modern Faith",
    description: "Contemporary Catholic life and youth ministry",
    icon: Lightbulb,
    color: "from-green-500 to-emerald-500",
    questionCount: 5,
    difficulty: "Easy"
  },
  {
    id: "saints-heroes",
    name: "Saints & Heroes",
    description: "Inspiring stories of Catholic saints and role models",
    icon: Star,
    color: "from-yellow-500 to-orange-500",
    questionCount: 5,
    difficulty: "Medium"
  },
  {
    id: "prayer-worship",
    name: "Prayer & Worship",
    description: "Different forms of prayer and liturgical practices",
    icon: Heart,
    color: "from-red-500 to-pink-500",
    questionCount: 5,
    difficulty: "Easy"
  }
]

const quizQuestions: Record<string, QuizQuestion[]> = {
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
    },
    {
      id: 3,
      question: "How many sacraments are there in the Catholic Church?",
      options: ["5", "6", "7", "8"],
      correctAnswer: 2,
      explanation: "There are 7 sacraments: Baptism, Confirmation, Eucharist, Reconciliation, Anointing of the Sick, Holy Orders, and Matrimony.",
      category: "faith-basics"
    },
    {
      id: 4,
      question: "What does 'Catholic' mean?",
      options: ["Holy", "Universal", "Traditional", "Ancient"],
      correctAnswer: 1,
      explanation: "'Catholic' comes from the Greek word 'katholikos' meaning 'universal' - the Church is for all people everywhere.",
      category: "faith-basics"
    },
    {
      id: 5,
      question: "Who is the patron saint of youth?",
      options: ["St. Francis of Assisi", "St. Thérèse of Lisieux", "St. John Bosco", "St. Teresa of Calcutta"],
      correctAnswer: 2,
      explanation: "St. John Bosco is the patron saint of youth, known for his work with young people and founding the Salesian order.",
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
    },
    {
      id: 3,
      question: "How many apostles did Jesus have?",
      options: ["10", "11", "12", "13"],
      correctAnswer: 2,
      explanation: "Jesus had 12 apostles, representing the 12 tribes of Israel and symbolizing the new people of God.",
      category: "bible-trivia"
    },
    {
      id: 4,
      question: "What was the first miracle Jesus performed?",
      options: ["Walking on water", "Raising Lazarus", "Turning water into wine", "Feeding the 5000"],
      correctAnswer: 2,
      explanation: "Jesus' first miracle was turning water into wine at the wedding at Cana, showing His divine power and care for people's needs.",
      category: "bible-trivia"
    },
    {
      id: 5,
      question: "What city was Jesus born in?",
      options: ["Nazareth", "Jerusalem", "Bethlehem", "Jericho"],
      correctAnswer: 2,
      explanation: "Jesus was born in Bethlehem, fulfilling the prophecy that the Messiah would come from the city of David.",
      category: "bible-trivia"
    }
  ],
  "church-history": [
    {
      id: 1,
      question: "Who was the first Pope of the Catholic Church?",
      options: ["St. Paul", "St. Peter", "St. John", "St. James"],
      correctAnswer: 1,
      explanation: "St. Peter was the first Pope, chosen by Jesus to be the rock upon which He would build His Church.",
      category: "church-history"
    },
    {
      id: 2,
      question: "In what year did the Second Vatican Council begin?",
      options: ["1955", "1962", "1969", "1975"],
      correctAnswer: 1,
      explanation: "The Second Vatican Council began in 1962 under Pope John XXIII, bringing important reforms and updates to the Church.",
      category: "church-history"
    },
    {
      id: 3,
      question: "What is the oldest Catholic university in the world?",
      options: ["University of Paris", "University of Bologna", "University of Oxford", "University of Salamanca"],
      correctAnswer: 1,
      explanation: "The University of Bologna, founded in 1088, is the oldest Catholic university in the world.",
      category: "church-history"
    },
    {
      id: 4,
      question: "Who founded the Jesuit order?",
      options: ["St. Francis Xavier", "St. Ignatius of Loyola", "St. Peter Faber", "St. Aloysius Gonzaga"],
      correctAnswer: 1,
      explanation: "St. Ignatius of Loyola founded the Society of Jesus (Jesuits) in 1540, known for education and missionary work.",
      category: "church-history"
    },
    {
      id: 5,
      question: "What year was the Catholic Church officially established?",
      options: ["33 AD", "100 AD", "313 AD", "1054 AD"],
      correctAnswer: 0,
      explanation: "The Catholic Church was officially established on Pentecost in 33 AD, when the Holy Spirit descended upon the apostles.",
      category: "church-history"
    }
  ],
  "modern-faith": [
    {
      id: 1,
      question: "What is the theme of World Youth Day 2023?",
      options: ["'Rise Up and Go'", "'Be Not Afraid'", "'Come and See'", "'Follow Me'"],
      correctAnswer: 0,
      explanation: "The theme of World Youth Day 2023 was 'Rise Up and Go', encouraging young people to be active in their faith.",
      category: "modern-faith"
    },
    {
      id: 2,
      question: "What social media platform has the Pope used to reach young people?",
      options: ["Instagram", "TikTok", "Twitter", "All of the above"],
      correctAnswer: 3,
      explanation: "Pope Francis uses multiple social media platforms including Instagram, TikTok, and Twitter to connect with young people worldwide.",
      category: "modern-faith"
    },
    {
      id: 3,
      question: "What is the name of the Pope's document focused on young people?",
      options: ["'Christus Vivit'", "'Evangelii Gaudium'", "'Laudato Si'", "'Amoris Laetitia'"],
      correctAnswer: 0,
      explanation: "'Christus Vivit' (Christ is Alive) is Pope Francis' apostolic exhortation specifically written for and about young people.",
      category: "modern-faith"
    },
    {
      id: 4,
      question: "What percentage of Catholics worldwide are under 30?",
      options: ["About 25%", "About 40%", "About 60%", "About 75%"],
      correctAnswer: 1,
      explanation: "About 40% of Catholics worldwide are under 30, making youth ministry a crucial part of the Church's mission.",
      category: "modern-faith"
    },
    {
      id: 5,
      question: "What is the Catholic Church's stance on environmental protection?",
      options: ["It's not important", "It's optional", "It's a moral obligation", "It's only for scientists"],
      correctAnswer: 2,
      explanation: "The Catholic Church teaches that caring for creation is a moral obligation, as outlined in Pope Francis' encyclical 'Laudato Si'.",
      category: "modern-faith"
    }
  ],
  "saints-heroes": [
    {
      id: 1,
      question: "Who is the patron saint of the internet?",
      options: ["St. Isidore of Seville", "St. John Paul II", "St. Thérèse of Lisieux", "St. Maximilian Kolbe"],
      correctAnswer: 0,
      explanation: "St. Isidore of Seville is the patron saint of the internet, chosen because he compiled the first encyclopedia.",
      category: "saints-heroes"
    },
    {
      id: 2,
      question: "Which saint is known as the 'Little Flower'?",
      options: ["St. Rose of Lima", "St. Thérèse of Lisieux", "St. Teresa of Avila", "St. Clare of Assisi"],
      correctAnswer: 1,
      explanation: "St. Thérèse of Lisieux is known as the 'Little Flower' because of her 'little way' of spiritual childhood and trust in God.",
      category: "saints-heroes"
    },
    {
      id: 3,
      question: "Who was the youngest saint ever canonized?",
      options: ["St. Maria Goretti", "St. Dominic Savio", "St. Jacinta Marto", "St. Francisco Marto"],
      correctAnswer: 1,
      explanation: "St. Dominic Savio was canonized at the age of 15, making him the youngest saint ever canonized by the Church.",
      category: "saints-heroes"
    },
    {
      id: 4,
      question: "Which saint is known for working with youth and founded the Salesians?",
      options: ["St. John Bosco", "St. Francis de Sales", "St. Philip Neri", "St. Vincent de Paul"],
      correctAnswer: 0,
      explanation: "St. John Bosco founded the Salesian order and dedicated his life to educating and caring for young people.",
      category: "saints-heroes"
    },
    {
      id: 5,
      question: "Who is the patron saint of students?",
      options: ["St. Thomas Aquinas", "St. Catherine of Alexandria", "St. Joseph of Cupertino", "St. Albert the Great"],
      correctAnswer: 1,
      explanation: "St. Catherine of Alexandria is the patron saint of students, known for her wisdom and defense of the faith.",
      category: "saints-heroes"
    }
  ],
  "prayer-worship": [
    {
      id: 1,
      question: "What is the most important prayer in the Catholic Church?",
      options: ["The Hail Mary", "The Our Father", "The Glory Be", "The Act of Contrition"],
      correctAnswer: 1,
      explanation: "The Our Father (Lord's Prayer) is the most important prayer, taught by Jesus Himself to His disciples.",
      category: "prayer-worship"
    },
    {
      id: 2,
      question: "How many mysteries are there in the Rosary?",
      options: ["15", "20", "25", "30"],
      correctAnswer: 1,
      explanation: "There are 20 mysteries in the Rosary: 5 Joyful, 5 Luminous, 5 Sorrowful, and 5 Glorious mysteries.",
      category: "prayer-worship"
    },
    {
      id: 3,
      question: "What is the liturgical color for Lent?",
      options: ["Red", "Green", "Purple", "White"],
      correctAnswer: 2,
      explanation: "Purple is the liturgical color for Lent, symbolizing penance, preparation, and royalty.",
      category: "prayer-worship"
    },
    {
      id: 4,
      question: "What is the name of the prayer asking for Mary's intercession?",
      options: ["The Our Father", "The Hail Mary", "The Glory Be", "The Magnificat"],
      correctAnswer: 1,
      explanation: "The Hail Mary is the prayer asking for Mary's intercession, beginning with the angel Gabriel's greeting to Mary.",
      category: "prayer-worship"
    },
    {
      id: 5,
      question: "What is the highest form of prayer in the Catholic Church?",
      options: ["Vocal prayer", "Meditation", "Contemplation", "The Mass"],
      correctAnswer: 3,
      explanation: "The Mass is the highest form of prayer, as it is the re-presentation of Christ's sacrifice on the cross.",
      category: "prayer-worship"
    }
  ]
}

export function FaithQuiz() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const { toast } = useToast()

  const currentQuestions = selectedCategory ? quizQuestions[selectedCategory] : []
  const currentQuestion = currentQuestions[currentQuestionIndex]

  useEffect(() => {
    if (selectedCategory && !showResult) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleAnswer(-1) // Time's up, mark as wrong
            return 30
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [selectedCategory, showResult, currentQuestionIndex])

  const startQuiz = async (categoryId: string) => {
    setSelectedCategory(categoryId)
    setCurrentQuestionIndex(0)
    setScore(0)
    setShowResult(false)
    setQuizCompleted(false)
    setTimeLeft(30)
    setSelectedAnswer(null)
    
    // Fetch questions for this category from API
    try {
      const questions = await fetchQuestionsForCategory(categoryId)
      if (questions && questions.length > 0) {
        // Update the questions state if you want to use API questions
        // For now, we'll keep using the hardcoded questions
        console.log(`Loaded ${questions.length} questions for ${categoryId}`)
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error)
      // Continue with hardcoded questions as fallback
    }
  }

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return // Prevent multiple answers

    setSelectedAnswer(answerIndex)
    
    if (answerIndex === currentQuestion.correctAnswer) {
      setScore(score + 1)
      toast({
        title: "Correct! 🎉",
        description: "Great job! You got it right.",
      })
    } else {
      toast({
        title: "Not quite right",
        description: `The correct answer is: ${currentQuestion.options[currentQuestion.correctAnswer]}`,
        variant: "destructive",
      })
    }

    setTimeout(() => {
      if (currentQuestionIndex < currentQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setSelectedAnswer(null)
        setTimeLeft(30)
      } else {
        // Quiz completed - save results to API
        const timeSpent = 30 - timeLeft + (currentQuestions.length - 1) * 30 // Calculate total time
        saveQuizResults(selectedCategory!, score + (answerIndex === currentQuestion.correctAnswer ? 1 : 0), currentQuestions.length, timeSpent)
        
        setQuizCompleted(true)
        setShowResult(true)
      }
    }, 2000)
  }

  const resetQuiz = () => {
    setSelectedCategory(null)
    setCurrentQuestionIndex(0)
    setScore(0)
    setShowResult(false)
    setQuizCompleted(false)
    setTimeLeft(30)
    setSelectedAnswer(null)
  }

  const getScoreMessage = () => {
    const percentage = (score / currentQuestions.length) * 100
    if (percentage >= 90) return "Outstanding! You're a faith expert! 🏆"
    if (percentage >= 80) return "Excellent! Great knowledge of your faith! 🌟"
    if (percentage >= 70) return "Good job! You know your faith well! 👍"
    if (percentage >= 60) return "Not bad! Keep learning and growing! 📚"
    return "Keep studying! Every saint was once a beginner! 💪"
  }

  // API Functions
  const fetchQuizData = async () => {
    try {
      const response = await fetch('/api/quiz')
      if (!response.ok) throw new Error('Failed to fetch quiz data')
      const data = await response.json()
      console.log('Quiz data fetched:', data)
      // You can use this data to show user progress, achievements, etc.
      return data
    } catch (error) {
      console.error('Error fetching quiz data:', error)
      toast({
        title: "Error",
        description: "Failed to load quiz data. Please try again.",
        variant: "destructive",
      })
    }
  }

  const saveQuizResults = async (category: string, score: number, totalQuestions: number, timeSpent: number) => {
    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          score,
          totalQuestions,
          timeSpent
        })
      })
      
      if (!response.ok) throw new Error('Failed to save results')
      const data = await response.json()
      console.log('Quiz results saved:', data)
      
      // Show success message
      toast({
        title: "Results Saved! 🎉",
        description: data.message || "Your quiz results have been saved successfully!",
      })
      
      return data
    } catch (error) {
      console.error('Error saving results:', error)
      toast({
        title: "Error",
        description: "Failed to save quiz results. Please try again.",
        variant: "destructive",
      })
    }
  }

  const fetchQuestionsForCategory = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/quiz/${categoryId}?userId=${user?.id}`)
      if (!response.ok) throw new Error('Failed to fetch questions')
      const data = await response.json()
      console.log(`Questions for ${categoryId}:`, data)
      return data.questions
    } catch (error) {
      console.error('Error fetching questions:', error)
      toast({
        title: "Error",
        description: "Failed to load quiz questions. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Load quiz data when component mounts
  useEffect(() => {
    if (selectedCategory) {
      fetchQuestionsForCategory(selectedCategory)
    }
  }, [selectedCategory])

  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
              <Brain className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Faith Challenge
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Test your knowledge of the Catholic faith with fun, interactive quizzes! 
              Choose a category and challenge yourself to learn more about your faith.
            </p>
          </div>

          {/* Quiz Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {quizCategories.map((category) => (
              <Card 
                key={category.id} 
                className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => startQuiz(category.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <category.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800 mb-2">
                    {category.name}
                  </CardTitle>
                  <p className="text-gray-600 text-sm mb-3">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <Badge variant="outline" className="text-xs">
                      {category.questionCount} questions
                    </Badge>
                    <Badge 
                      variant={category.difficulty === "Easy" ? "default" : category.difficulty === "Medium" ? "secondary" : "destructive"}
                      className="text-xs"
                    >
                      {category.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    onClick={() => startQuiz(category.id)}
                  >
                    Start Quiz
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-8 bg-white rounded-2xl px-8 py-6 shadow-lg">
              <div>
                <div className="text-3xl font-bold text-blue-600">{Object.keys(quizQuestions).length}</div>
                <div className="text-gray-600">Quiz Categories</div>
              </div>
              <div className="w-px h-12 bg-gray-200"></div>
              <div>
                <div className="text-3xl font-bold text-purple-600">{Object.values(quizQuestions).flat().length}</div>
                <div className="text-gray-600">Total Questions</div>
              </div>
              <div className="w-px h-12 bg-gray-200"></div>
              <div>
                <div className="text-3xl font-bold text-green-600">∞</div>
                <div className="text-gray-600">Learning Fun</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* Result Header */}
            <div className="mb-8">
              <div className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br ${
                score >= currentQuestions.length * 0.8 ? 'from-green-400 to-emerald-500' : 
                score >= currentQuestions.length * 0.6 ? 'from-yellow-400 to-orange-500' : 
                'from-red-400 to-pink-500'
              } flex items-center justify-center shadow-lg`}>
                {score >= currentQuestions.length * 0.8 ? (
                  <Trophy className="h-12 w-12 text-white" />
                ) : score >= currentQuestions.length * 0.6 ? (
                  <Star className="h-12 w-12 text-white" />
                ) : (
                  <Heart className="h-12 w-12 text-white" />
                )}
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Quiz Complete!
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                {getScoreMessage()}
              </p>
            </div>

            {/* Score Display */}
            <Card className="mb-8">
              <CardContent className="p-8">
                <div className="text-6xl font-bold text-blue-600 mb-4">
                  {score}/{currentQuestions.length}
                </div>
                <div className="text-2xl text-gray-600 mb-6">
                  {Math.round((score / currentQuestions.length) * 100)}%
                </div>
                <Progress value={(score / currentQuestions.length) * 100} className="h-3 mb-6" />
                <div className="text-gray-500">
                  {score >= currentQuestions.length * 0.8 ? "Perfect score! You're amazing!" :
                   score >= currentQuestions.length * 0.6 ? "Great job! Keep learning!" :
                   "Good effort! Every question is a learning opportunity!"}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={resetQuiz}
                variant="outline"
                size="lg"
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Try Another Quiz
              </Button>
              <Button 
                onClick={() => startQuiz(selectedCategory)}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Retry This Quiz
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Quiz Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Button 
                variant="ghost" 
                onClick={resetQuiz}
                className="mr-4 text-gray-600 hover:text-gray-800"
              >
                <Home className="h-5 w-5 mr-2" />
                Back to Categories
              </Button>
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {quizCategories.find(c => c.id === selectedCategory)?.name}
                </h1>
                <p className="text-gray-600">
                  Question {currentQuestionIndex + 1} of {currentQuestions.length}
                </p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%` }}
              ></div>
            </div>

            {/* Timer */}
            <div className="mb-6">
              <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md">
                <div className={`w-3 h-3 rounded-full ${timeLeft > 10 ? 'bg-green-500' : timeLeft > 5 ? 'bg-yellow-500' : 'bg-red-500'} animate-pulse`}></div>
                <span className="font-mono text-lg font-bold text-gray-700">
                  {timeLeft}s
                </span>
              </div>
            </div>
          </div>

          {/* Question Card */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 leading-relaxed mb-6">
                  {currentQuestion.question}
                </h2>
              </div>

              {/* Answer Options */}
              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                    variant="outline"
                    className={`w-full justify-start text-left p-4 h-auto text-lg border-2 transition-all duration-200 ${
                      selectedAnswer === index
                        ? index === currentQuestion.correctAnswer
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-red-500 bg-red-50 text-red-700'
                        : selectedAnswer !== null && index === currentQuestion.correctAnswer
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center w-full">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 ${
                        selectedAnswer === index
                          ? index === currentQuestion.correctAnswer
                            ? 'border-green-500 bg-green-500 text-white'
                            : 'border-red-500 bg-red-500 text-white'
                          : 'border-gray-300 bg-white'
                      }`}>
                        {selectedAnswer === index ? (
                          index === currentQuestion.correctAnswer ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <XCircle className="h-5 w-5" />
                          )
                        ) : (
                          <span className="text-sm font-bold text-gray-600">
                            {String.fromCharCode(65 + index)}
                          </span>
                        )}
                      </div>
                      <span className="flex-1">{option}</span>
                    </div>
                  </Button>
                ))}
              </div>

              {/* Explanation */}
              {selectedAnswer !== null && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Explanation:</h4>
                  <p className="text-blue-700">{currentQuestion.explanation}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Score Display */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-6 bg-white rounded-2xl px-6 py-4 shadow-lg">
              <div>
                <div className="text-2xl font-bold text-blue-600">{score}</div>
                <div className="text-gray-600">Correct</div>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div>
                <div className="text-2xl font-bold text-gray-400">{currentQuestionIndex - score}</div>
                <div className="text-gray-600">Incorrect</div>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round((score / (currentQuestionIndex + 1)) * 100)}%
                </div>
                <div className="text-gray-600">Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
