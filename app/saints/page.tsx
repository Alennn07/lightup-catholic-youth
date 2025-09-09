"use client"

import { useState } from "react"
import { motion } from "framer-motion"
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
  const [selectedMiracle, setSelectedMiracle] = useState<number | null>(null)
  const [favoriteMiracles, setFavoriteMiracles] = useState<number[]>([])
  const [showLearnMoreModal, setShowLearnMoreModal] = useState<number | null>(null)

  const eucharisticMiracles = [
    {
      id: 1,
      title: "Miracle of Lanciano",
      description: "The first and most scientifically studied Eucharistic miracle where bread and wine became actual flesh and blood.",
      icon: Heart,
      gradient: "from-red-500 to-pink-600",
      details: {
        year: "8th Century",
        location: "Lanciano, Italy",
        scientificTests: "Multiple DNA tests, blood type analysis, and histological studies",
        significance: "First documented Eucharistic miracle with extensive scientific verification",
        prayer: "Lord, help us to believe in Your real presence in the Eucharist, just as You revealed Yourself to the faithful in Lanciano.",
        facts: [
          "The host became human heart muscle tissue",
          "The wine became human blood of type AB",
          "The blood remained fresh for over 1200 years",
          "Scientific tests were conducted in 1970-1971 and 1981"
        ]
      }
    },
    {
      id: 2,
      title: "Miracle of Buenos Aires",
      description: "A host that turned into human heart tissue, showing signs of severe trauma and inflammation.",
      icon: BookOpen,
      gradient: "from-blue-500 to-indigo-600",
      details: {
        year: "1996",
        location: "Buenos Aires, Argentina",
        scientificTests: "DNA analysis, histological examination, and medical imaging",
        significance: "Modern miracle showing the suffering of Christ in the Eucharist",
        prayer: "Jesus, help us to understand the depth of Your love and sacrifice through this miraculous sign.",
        facts: [
          "The host became human heart tissue with signs of severe trauma",
          "Blood type was identified as AB (same as Lanciano)",
          "Tissue showed signs of inflammation and suffering",
          "Occurred during Mass in a parish church"
        ]
      }
    },
    {
      id: 3,
      title: "Miracle of Sokolka",
      description: "A host that transformed into human heart muscle tissue, scientifically verified by multiple experts.",
      icon: Users,
      gradient: "from-green-500 to-emerald-600",
      details: {
        year: "2008",
        location: "Sokolka, Poland",
        scientificTests: "Multiple independent scientific examinations and DNA analysis",
        significance: "Recent miracle confirming the ongoing reality of Eucharistic miracles",
        prayer: "Holy Spirit, strengthen our faith in the real presence of Christ in the Eucharist.",
        facts: [
          "The host became human heart muscle tissue",
          "Blood type was identified as AB (consistent with other miracles)",
          "Multiple independent scientists confirmed the findings",
          "The miracle occurred during a regular Mass"
        ]
      }
    }
  ]

  const handleExplore = (miracleId: number) => {
    setSelectedMiracle(selectedMiracle === miracleId ? null : miracleId)
  }

  const handleLearnMore = (miracleId: number) => {
    setShowLearnMoreModal(miracleId)
  }

  const handleToggleFavorite = (miracleId: number) => {
    setFavoriteMiracles(prev => 
      prev.includes(miracleId) 
        ? prev.filter(id => id !== miracleId)
        : [...prev, miracleId]
    )
  }

  const handleShare = async (miracle: any) => {
    const shareData = {
      title: `${miracle.title} - Eucharistic Miracle`,
      text: `${miracle.description}\n\nLearn more about this amazing miracle on LightUp!`,
      url: window.location.href
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`)
        alert('Miracle information copied to clipboard! You can now share it with your friends.')
      }
    } catch (error) {
      console.error('Error sharing:', error)
      // Fallback to copying to clipboard
      try {
        await navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`)
        alert('Miracle information copied to clipboard! You can now share it with your friends.')
      } catch (clipboardError) {
        alert('Unable to share. Please copy the URL manually.')
      }
    }
  }

  return (
    <div className="space-y-8 mt-8">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eucharisticMiracles.map((miracle) => {
          const IconComponent = miracle.icon
          const isSelected = selectedMiracle === miracle.id
          
          return (
            <Card key={miracle.id} className={`group hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 bg-white rounded-2xl shadow-lg ${
              isSelected ? 'ring-2 ring-blue-500 shadow-2xl' : ''
            }`}>
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
                  onClick={() => handleExplore(miracle.id)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold group-hover:scale-105 transition-all duration-300"
                  size="sm"
                >
                  {isSelected ? 'Hide Details' : 'Explore'}
                  <ArrowRight className={`w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Detailed Information for Selected Miracle */}
      {selectedMiracle && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mt-8"
        >
          {(() => {
            const miracle = eucharisticMiracles.find(m => m.id === selectedMiracle)
            if (!miracle) return null

            return (
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 rounded-2xl shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">{miracle.title} - Detailed Information</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedMiracle(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Basic Information */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">📅 Year</h4>
                        <p className="text-gray-700">{miracle.details.year}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">📍 Location</h4>
                        <p className="text-gray-700">{miracle.details.location}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">🔬 Scientific Tests</h4>
                        <p className="text-gray-700">{miracle.details.scientificTests}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">✨ Significance</h4>
                        <p className="text-gray-700">{miracle.details.significance}</p>
                      </div>
                    </div>

                    {/* Prayer and Facts */}
                    <div className="space-y-6">
                      <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <Heart className="w-5 h-5 mr-2 text-red-500" />
                          Prayer
                        </h4>
                        <p className="text-gray-700 italic leading-relaxed">"{miracle.details.prayer}"</p>
                      </div>
                      
                      <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
                          Key Facts
                        </h4>
                        <ul className="space-y-2">
                          {miracle.details.facts.map((fact, index) => (
                            <li key={index} className="flex items-start">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                              <span className="text-gray-700 text-sm">{fact}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-gray-200">
                    <Button 
                      onClick={() => handleLearnMore(miracle.id)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Learn More
                    </Button>
                    <Button 
                      onClick={() => handleToggleFavorite(miracle.id)}
                      variant="outline" 
                      className={`rounded-xl transition-all duration-300 ${
                        favoriteMiracles.includes(miracle.id) 
                          ? 'bg-red-50 border-red-300 text-red-600 hover:bg-red-100' 
                          : 'hover:bg-red-50 hover:border-red-300 hover:text-red-600'
                      }`}
                    >
                      <Heart className={`w-4 h-4 mr-2 ${favoriteMiracles.includes(miracle.id) ? 'fill-current' : ''}`} />
                      {favoriteMiracles.includes(miracle.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                    </Button>
                    <Button 
                      onClick={() => handleShare(miracle)}
                      variant="outline" 
                      className="rounded-xl hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Share with Friends
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })()}
        </motion.div>
      )}

      {/* Learn More Modal */}
      {showLearnMoreModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowLearnMoreModal(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const miracle = eucharisticMiracles.find(m => m.id === showLearnMoreModal)
              if (!miracle) return null

              return (
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">Learn More About {miracle.title}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowLearnMoreModal(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </Button>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">📚 Additional Resources</h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <BookOpen className="w-5 h-5 text-blue-500" />
                          <span className="text-gray-700">Official Vatican documentation and scientific reports</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Heart className="w-5 h-5 text-red-500" />
                          <span className="text-gray-700">Prayer guides and spiritual reflections</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Users className="w-5 h-5 text-green-500" />
                          <span className="text-gray-700">Community discussions and testimonies</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">🔬 Scientific Evidence</h4>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        This miracle has been extensively studied by scientists and medical professionals. 
                        The findings consistently show human tissue and blood, with no natural explanation 
                        for the transformation that occurred.
                      </p>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 italic">
                          "The scientific evidence points to a supernatural origin that cannot be explained 
                          by natural processes." - Dr. Linoli, Chief of Laboratory of Pathological Anatomy
                        </p>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">🙏 Spiritual Significance</h4>
                      <p className="text-gray-700 leading-relaxed">
                        This miracle serves as a powerful reminder of Christ's real presence in the Eucharist. 
                        It strengthens our faith and helps us understand the profound mystery of the 
                        transubstantiation that occurs at every Mass.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-4">
                      <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Read Full Documentation
                      </Button>
                      <Button variant="outline" className="rounded-xl">
                        <Heart className="w-4 h-4 mr-2" />
                        Join Prayer Group
                      </Button>
                      <Button variant="outline" className="rounded-xl">
                        <Users className="w-4 h-4 mr-2" />
                        Discuss with Community
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })()}
          </motion.div>
        </motion.div>
      )}
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
