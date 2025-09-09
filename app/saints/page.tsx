"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Mountain, 
  Globe, 
  Flame, 
  CheckCircle, 
  ArrowRight,
  Heart,
  BookOpen,
  Users,
  Dumbbell,
  UserCheck,
  Calendar,
  Quote,
  Lightbulb,
  Target
} from "lucide-react"

// CardGrid Component for Carlo Acutis Tab
function CardGrid() {
  const eucharisticMiracles = [
    {
      id: 1,
      title: "Miracle of Lanciano",
      description: "The first and most scientifically studied Eucharistic miracle where bread and wine became actual flesh and blood.",
      icon: Heart,
      gradient: "from-red-500 to-pink-600"
    },
    {
      id: 2,
      title: "Miracle of Buenos Aires",
      description: "A host that turned into human heart tissue, showing signs of severe trauma and inflammation.",
      icon: BookOpen,
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      id: 3,
      title: "Miracle of Sokolka",
      description: "A host that transformed into human heart muscle tissue, scientifically verified by multiple experts.",
      icon: Users,
      gradient: "from-green-500 to-emerald-600"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {eucharisticMiracles.map((miracle) => {
        const IconComponent = miracle.icon
        return (
          <Card key={miracle.id} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 bg-white rounded-2xl shadow-lg">
            <CardHeader className="pb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${miracle.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {miracle.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {miracle.description}
              </p>
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold group-hover:scale-105 transition-all duration-300"
                size="sm"
              >
                Explore
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

// ProgressTracker Component for Pier Giorgio Frassati Tab
function ProgressTracker() {
  const [goals, setGoals] = useState([
    { id: 1, name: "Prayer", completed: false, progress: 0 },
    { id: 2, name: "Study", completed: false, progress: 0 },
    { id: 3, name: "Service", completed: false, progress: 0 },
    { id: 4, name: "Fitness", completed: false, progress: 0 },
    { id: 5, name: "Friendship", completed: false, progress: 0 }
  ])

  const handleGoalToggle = (goalId: number) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, completed: !goal.completed, progress: !goal.completed ? 100 : 0 }
        : goal
    ))
  }

  const completedGoals = goals.filter(goal => goal.completed).length
  const mountainHeight = (completedGoals / goals.length) * 100

  return (
    <div className="space-y-8 mt-8">
      {/* Mountain Progress Visual */}
      <div className="flex justify-center mb-8">
        <div className="relative w-32 h-32">
          <Mountain 
            className={`w-full h-full text-gray-300 transition-all duration-500 ${
              completedGoals > 0 ? 'text-blue-500' : ''
            }`} 
            style={{
              filter: `drop-shadow(0 0 ${mountainHeight}px rgba(59, 130, 246, 0.5))`
            }}
          />
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            {completedGoals}/{goals.length}
          </div>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map((goal) => (
          <Card key={goal.id} className="hover:shadow-lg transition-all duration-300 border-0 bg-white rounded-xl shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Checkbox
                  checked={goal.completed}
                  onCheckedChange={() => handleGoalToggle(goal.id)}
                  className="w-5 h-5"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{goal.name}</h3>
                  <Progress 
                    value={goal.progress} 
                    className="h-2 bg-gray-200"
                  />
                </div>
                {goal.completed && (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0 rounded-xl">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Verso l'alto Progress</h3>
          <p className="text-gray-600 mb-4">
            {completedGoals === goals.length 
              ? "🎉 You've reached the summit! Keep climbing higher!" 
              : `Keep climbing! ${goals.length - completedGoals} more goals to reach the top.`
            }
          </p>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${mountainHeight}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// JourneyTabs Component for 7-Day Journey Tab
function JourneyTabs() {
  const [currentDay, setCurrentDay] = useState(1)
  
  const journeyData = [
    {
      day: 1,
      quote: "The saints are not perfect, but they are faithful.",
      reflection: "What does faithfulness mean to you in your daily life?",
      challenge: "Choose one small act of kindness to perform today."
    },
    {
      day: 2,
      quote: "Holiness is not the luxury of a few, but a simple duty for you and me.",
      reflection: "How can you make holiness accessible in your everyday routine?",
      challenge: "Spend 5 minutes in silent prayer before starting your day."
    },
    {
      day: 3,
      quote: "The world promises you comfort, but you were not made for comfort. You were made for greatness.",
      reflection: "What greatness is God calling you to in this season?",
      challenge: "Step out of your comfort zone with one courageous action."
    },
    {
      day: 4,
      quote: "Prayer is not asking for what you think you want, but asking to be changed in ways you can't imagine.",
      reflection: "How has prayer changed you recently?",
      challenge: "Write down three things you're grateful for today."
    },
    {
      day: 5,
      quote: "The saints were not saints because of what they did, but because of who they became.",
      reflection: "Who is God calling you to become?",
      challenge: "Practice patience in a situation that normally frustrates you."
    },
    {
      day: 6,
      quote: "Faith is not a feeling, it's a decision.",
      reflection: "What decision of faith can you make today?",
      challenge: "Share your faith with someone through a simple act of love."
    },
    {
      day: 7,
      quote: "The journey of a thousand miles begins with a single step.",
      reflection: "What's the next step in your spiritual journey?",
      challenge: "Commit to one spiritual practice for the next week."
    }
  ]

  const currentDayData = journeyData.find(day => day.day === currentDay) || journeyData[0]

  return (
    <div className="space-y-8 mt-8">
      {/* Day Selector */}
      <div className="flex flex-wrap gap-2 justify-center">
        {Array.from({ length: 7 }, (_, i) => i + 1).map((day) => (
          <Button
            key={day}
            variant={currentDay === day ? "default" : "outline"}
            onClick={() => setCurrentDay(day)}
            className={`rounded-xl font-semibold transition-all duration-300 ${
              currentDay === day 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                : 'hover:bg-blue-50 hover:border-blue-300'
            }`}
          >
            Day {day}
          </Button>
        ))}
      </div>

      {/* Current Day Content */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 rounded-2xl shadow-lg">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
              <Calendar className="w-4 h-4 mr-2" />
              Day {currentDay}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Walk with the New Saints</h3>
          </div>

          {/* Quote Section */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <div className="flex items-start space-x-3">
              <Quote className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
              <blockquote className="text-lg italic text-gray-800 leading-relaxed">
                "{currentDayData.quote}"
              </blockquote>
            </div>
          </div>

          {/* Reflection Section */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <div className="flex items-start space-x-3">
              <Lightbulb className="w-6 h-6 text-yellow-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Reflection Question</h4>
                <p className="text-gray-700 leading-relaxed">{currentDayData.reflection}</p>
              </div>
            </div>
          </div>

          {/* Challenge Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-start space-x-3">
              <Target className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Today's Challenge</h4>
                <p className="text-gray-700 leading-relaxed">{currentDayData.challenge}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentDay(Math.max(1, currentDay - 1))}
              disabled={currentDay === 1}
              className="rounded-xl"
            >
              Previous Day
            </Button>
            <Button
              onClick={() => setCurrentDay(Math.min(7, currentDay + 1))}
              disabled={currentDay === 7}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl"
            >
              Next Day
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Main Saints Page Component
export default function SaintsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-semibold mb-6">
            <Flame className="w-4 h-4 mr-2" />
            New Saints for a New Generation
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Walk with the Saints
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Discover the inspiring stories of modern saints who show us how to live our faith in today's world
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="carlo" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white rounded-2xl shadow-lg p-2 mb-8">
            <TabsTrigger 
              value="carlo" 
              className="rounded-xl font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
            >
              <Globe className="w-4 h-4 mr-2" />
              Carlo Acutis
            </TabsTrigger>
            <TabsTrigger 
              value="pier" 
              className="rounded-xl font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white"
            >
              <Mountain className="w-4 h-4 mr-2" />
              Pier Giorgio
            </TabsTrigger>
            <TabsTrigger 
              value="journey" 
              className="rounded-xl font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
            >
              <Flame className="w-4 h-4 mr-2" />
              7-Day Journey
            </TabsTrigger>
          </TabsList>

          {/* Carlo Acutis Tab */}
          <TabsContent value="carlo" className="space-y-8">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0 rounded-2xl shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Globe className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  ✨ Carlo Acutis – Patron of the Internet & Youth
                </h2>
                <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                  A young Italian who used technology to spread the Gospel and documented Eucharistic miracles around the world. 
                  His life shows us how to be saints in the digital age.
                </p>
                {/* TODO: Connect to Supabase for Carlo Acutis content and user progress tracking */}
              </CardContent>
            </Card>
            <CardGrid />
          </TabsContent>

          {/* Pier Giorgio Frassati Tab */}
          <TabsContent value="pier" className="space-y-8">
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-0 rounded-2xl shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mountain className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  ⛰️ Pier Giorgio Frassati – Verso l'alto
                </h2>
                <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                  "Verso l'alto" (To the heights) was his motto. A young man who combined deep faith with love for the outdoors, 
                  social justice, and friendship. His life inspires us to reach for the heights of holiness.
                </p>
                {/* TODO: Connect to Supabase for progress tracking and goal management */}
              </CardContent>
            </Card>
            <ProgressTracker />
          </TabsContent>

          {/* 7-Day Journey Tab */}
          <TabsContent value="journey" className="space-y-8">
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-0 rounded-2xl shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Flame className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  🔥 Walk with the New Saints
                </h2>
                <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                  A 7-day spiritual journey inspired by the lives of modern saints. Each day offers reflection, 
                  prayer, and practical challenges to help you grow in holiness.
                </p>
                {/* TODO: Connect to Supabase for journey progress, user reflections, and challenge completion tracking */}
              </CardContent>
            </Card>
            <JourneyTabs />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
