"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
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
  Target,
  Check,
  Home,
  ArrowLeft
} from "lucide-react"



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
  const [goals, setGoals] = useState([
    { id: 1, name: "Prayer", description: "Daily conversation with God", completed: false },
    { id: 2, name: "Study", description: "Learn about your faith", completed: false },
    { id: 3, name: "Service", description: "Help those in need", completed: false },
    { id: 4, name: "Fitness", description: "Take care of your body", completed: false },
    { id: 5, name: "Friendship", description: "Build meaningful relationships", completed: false }
  ])
  const [selectedSaint, setSelectedSaint] = useState<string | null>(null)

  // Load goals from localStorage on component mount
  useEffect(() => {
    const savedGoals = localStorage.getItem('saints-goals')
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals))
    }
  }, [])

  // Save goals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('saints-goals', JSON.stringify(goals))
  }, [goals])

  const handleGoalToggle = (goalId: number) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, completed: !goal.completed }
        : goal
    ))
  }

  const saints = [
    {
      id: "carlo",
      name: "Carlo Acutis",
      title: "Digital Saint",
      years: "1991 - 2006",
      description: "A young Italian who used technology to spread the Gospel and documented Eucharistic miracles around the world.",
      icon: Globe,
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50",
      tags: ["Technology", "Youth", "Eucharist", "Digital Evangelization"],
      photo: "/saints/carlo-acutis.jpg"
    },
    {
      id: "pier",
      name: "Pier Giorgio Frassati",
      title: "Verso l'alto",
      years: "1901 - 1925",
      description: "A young man who combined deep faith with love for the outdoors, social justice, and friendship.",
      icon: Mountain,
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-50 to-emerald-50",
      tags: ["Mountains", "Social Justice", "Friendship", "Adventure"],
      photo: "/saints/pier-giorgio-frassati.jpg"
    },
    {
      id: "oscar",
      name: "Oscar Romero",
      title: "Martyr for Justice",
      years: "1917 - 1980",
      description: "Archbishop martyr who stood up for the poor and oppressed. He gave his life for social justice.",
      icon: Heart,
      gradient: "from-red-500 to-orange-600",
      bgGradient: "from-red-50 to-orange-50",
      tags: ["Justice", "Social Justice", "Martyr", "Voice of the Poor"],
      photo: "/saints/oscar-romero.jpg"
    },
    {
      id: "maximilian",
      name: "Maximilian Kolbe",
      title: "Martyr of Auschwitz",
      years: "1894 - 1941",
      description: "Franciscan priest who offered his life for another prisoner in Auschwitz. A true hero of self-sacrifice.",
      icon: Heart,
      gradient: "from-purple-500 to-indigo-600",
      bgGradient: "from-purple-50 to-indigo-50",
      tags: ["Self-Sacrifice", "Protection", "Courage", "Love"],
      photo: "/saints/meximilian-kolbe.jpg"
    },
    {
      id: "teresa",
      name: "Mother Teresa",
      title: "Saint of the Gutters",
      years: "1910 - 1997",
      description: "Missionary of Charity who served the poorest of the poor. She showed us that small acts of love can change the world.",
      icon: Heart,
      gradient: "from-yellow-500 to-orange-600",
      bgGradient: "from-yellow-50 to-orange-50",
      tags: ["Service", "Compassion", "Love", "Missionary"],
      photo: "/saints/mother-teresa.jpg"
    },
    {
      id: "maria",
      name: "Maria Goretti",
      title: "Martyr of Purity",
      years: "1890 - 1902",
      description: "Young martyr who chose death over sin at age 11. She forgave her attacker and showed us the power of purity.",
      icon: Heart,
      gradient: "from-pink-500 to-rose-600",
      bgGradient: "from-pink-50 to-rose-50",
      tags: ["Purity", "Forgiveness", "Youth", "Martyr"],
      photo: "/saints/maria-goretti.jpg"
    },
    {
      id: "therese",
      name: "Thérèse of Lisieux",
      title: "Little Flower",
      years: "1873 - 1897",
      description: "Little Flower who showed us the Little Way of doing small things with great love. She became a Doctor of the Church.",
      icon: Heart,
      gradient: "from-rose-500 to-pink-600",
      bgGradient: "from-rose-50 to-pink-50",
      tags: ["Little Way", "Love", "Simplicity", "Doctor of Church"],
      photo: "/saints/therese-lisieux.jpg"
    },
    {
      id: "edith",
      name: "Edith Stein",
      title: "Philosopher & Martyr",
      years: "1891 - 1942",
      description: "Jewish philosopher who converted to Catholicism and became a Carmelite nun. She was martyred in Auschwitz.",
      icon: Heart,
      gradient: "from-indigo-500 to-purple-600",
      bgGradient: "from-indigo-50 to-purple-50",
      tags: ["Philosophy", "Conversion", "Martyr", "Intellectual"],
      photo: "/saints/edith-stein.jpg"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-between items-center mb-8">
            <Button 
              onClick={() => window.open('/', '_blank')}
              className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-full px-6 py-3 transition-all duration-300"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
            <div className="text-right">
              <h1 className="text-2xl font-bold">LightUp Catholic Youth</h1>
              <p className="text-blue-100 text-sm">Walk with the Saints</p>
            </div>
          </div>
          <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-semibold mb-6">
            <Flame className="w-4 h-4 mr-2" />
            New Saints for a New Generation
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Walk with the Saints
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Discover the inspiring stories of modern saints who show us how to live our faith in today's world
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Saints Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {saints.map((saint, index) => {
            const IconComponent = saint.icon
            return (
              <motion.div
                key={saint.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <Card className={`bg-gradient-to-br ${saint.bgGradient} border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer h-full`}
                      onClick={() => setSelectedSaint(selectedSaint === saint.id ? null : saint.id)}>
                  <CardContent className="p-6 text-center h-full flex flex-col">
                    {/* Photo Section */}
                    <div className="relative h-32 mb-4 rounded-xl overflow-hidden">
                      <div 
                        className="absolute inset-0 bg-cover bg-no-repeat"
                        style={{
                          backgroundImage: `url('${saint.photo}')`,
                          backgroundPosition: 'center 20%'
                        }}
                      ></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <h3 className="text-lg font-bold text-white truncate">{saint.name}</h3>
                        <p className="text-white/90 text-xs">{saint.years}</p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center justify-center mb-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${saint.gradient} flex items-center justify-center`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{saint.title}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
                        {saint.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-4 justify-center">
                        {saint.tags.slice(0, 2).map((tag, tagIndex) => (
                          <span 
                            key={tagIndex}
                            className="px-2 py-1 bg-white/60 text-gray-700 rounded-full text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Read More Button */}
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation()
                          // Map saint IDs to correct page paths
                          const pageMap: { [key: string]: string } = {
                            'carlo': '/saints/carlo-acutis',
                            'pier': '/saints/pier-giorgio', 
                            'oscar': '/saints/oscar-romero',
                            'maximilian': '/saints/maximilian-kolbe',
                            'teresa': '/saints/mother-teresa',
                            'maria': '/saints/maria-goretti',
                            'therese': '/saints/therese-lisieux',
                            'edith': '/saints/edith-stein'
                          }
                          const pagePath = pageMap[saint.id] || `/saints/${saint.id}`
                          window.open(pagePath, '_blank')
                        }}
                        className={`w-full bg-gradient-to-r ${saint.gradient} hover:opacity-90 text-white font-semibold px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg`}
                        size="sm"
                      >
                        <IconComponent className="w-4 h-4 mr-2" />
                        Read More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>



      </div>
    </div>
  )
}
