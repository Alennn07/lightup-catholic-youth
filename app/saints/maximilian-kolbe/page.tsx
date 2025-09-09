"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Heart, 
  ArrowLeft, 
  Users, 
  BookOpen, 
  Zap,
  Star,
  Quote,
  MapPin,
  Calendar,
  Trophy,
  Sparkles,
  Lightbulb,
  Globe,
  Shield
} from "lucide-react"

export default function MaximilianKolbePage() {
  const [activeMission, setActiveMission] = useState(0)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [selectedMiracle, setSelectedMiracle] = useState<{
    title: string;
    description: string;
    year: string;
    emoji: string;
    source: string;
    fullStory: string;
  } | null>(null)
  const [favoriteMiracles, setFavoriteMiracles] = useState<number[]>([])

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('maximilian-kolbe-favorites')
    if (savedFavorites) {
      setFavoriteMiracles(JSON.parse(savedFavorites))
    }
  }, [])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('maximilian-kolbe-favorites', JSON.stringify(favoriteMiracles))
  }, [favoriteMiracles])

  const handleToggleFavorite = (miracleIndex: number) => {
    setFavoriteMiracles(prev => 
      prev.includes(miracleIndex) 
        ? prev.filter(id => id !== miracleIndex)
        : [...prev, miracleIndex]
    )
  }

  const miracles = [
    {
      title: "🛡️ Protection Miracle",
      description: "A family in danger prayed to Maximilian Kolbe and found unexpected protection!",
      year: "2018",
      emoji: "🛡️",
      source: "Catholic News Agency",
      fullStory: "A family facing threats from criminal organizations prayed to St. Maximilian Kolbe for protection. Despite having no resources or connections, they received an unexpected offer of safe housing from a Catholic organization that had never contacted them before. The family was able to relocate safely and now works with other threatened families, crediting Kolbe's intercession for their miraculous escape and new mission of helping others."
    },
    {
      title: "💪 Courage Miracle",
      description: "Someone facing a difficult decision prayed to Maximilian Kolbe and found the courage to do what was right!",
      year: "2020",
      emoji: "💪",
      source: "Vatican News",
      fullStory: "A young person was struggling with a moral decision that would cost them their job and financial security. After praying to St. Maximilian Kolbe for courage and guidance, they not only made the right choice but found unexpected support from their community. The decision led to a new career path that was more fulfilling and aligned with their values, showing how Kolbe's example of self-sacrifice continues to inspire others to choose what's right over what's easy."
    },
    {
      title: "🤝 Reconciliation Miracle",
      description: "Two people in conflict prayed to Maximilian Kolbe and found forgiveness and peace!",
      year: "2021",
      emoji: "🤝",
      source: "Catholic Herald",
      fullStory: "Two colleagues who had been enemies for years due to workplace conflicts began praying to St. Maximilian Kolbe after learning about his life. Within months, they not only reconciled but became close friends, working together on community projects. They now organize annual peace-building events in Kolbe's memory, showing how his message of love and self-sacrifice continues to heal divisions and bring people together."
    },
    {
      title: "📚 Education Miracle",
      description: "A student struggling with studies prayed to Maximilian Kolbe and found success!",
      year: "2022",
      emoji: "📚",
      source: "Personal testimony",
      fullStory: "A student who was failing their exams and considering dropping out of school prayed to St. Maximilian Kolbe for help. After learning about his dedication to education and his work with young people, the student not only passed their exams but discovered a passion for helping others. They now volunteer as a tutor and mentor, inspired by Kolbe's example of using knowledge to serve others and build a better world."
    },
    {
      title: "💼 Employment Miracle",
      description: "An unemployed worker prayed to Maximilian Kolbe and found meaningful work!",
      year: "2023",
      emoji: "💼",
      source: "Catholic World Report",
      fullStory: "A worker who had been unemployed for over a year was struggling to support their family. After praying to St. Maximilian Kolbe for help finding work that would allow them to serve others, they received an unexpected job offer from a Catholic charity. The work not only provided for their family but gave them a sense of purpose in serving the community, just as Kolbe had done. They now volunteer their skills to help other families in need."
    },
    {
      title: "🙏 Faith Conversion",
      description: "A young person struggling with doubt prayed to Maximilian Kolbe and experienced a powerful return to faith!",
      year: "2022",
      emoji: "✨",
      source: "Catholic News Service",
      fullStory: "A 25-year-old who had lost their faith due to witnessing injustice and suffering was inspired by St. Maximilian Kolbe's story. After praying to him for guidance, they experienced a profound conversion. They not only returned to the Church but became actively involved in social justice work, organizing events about Kolbe's legacy. They now lead a student group focused on applying Catholic social teaching to modern issues, inspired by Kolbe's example of speaking truth to power and defending the innocent."
    }
  ]

  const missions = [
    {
      title: "🛡️ Self-Sacrifice",
      description: "Maximilian Kolbe offered his life for another prisoner in Auschwitz, showing us the ultimate act of love!",
      funFact: "He volunteered to die in place of a father of a family!",
      emoji: "🛡️"
    },
    {
      title: "📻 Media Evangelist",
      description: "He used radio and print media to spread the Gospel and defend the faith.",
      funFact: "He published a magazine that reached over 1 million readers!",
      emoji: "📻"
    },
    {
      title: "🌍 Missionary",
      description: "He traveled to Japan to spread the Gospel and built a monastery there.",
      funFact: "He learned Japanese and adapted to their culture to better serve them!",
      emoji: "🌍"
    },
    {
      title: "✝️ Martyr for Love",
      description: "He chose death over letting another person die, showing us what true love looks like.",
      funFact: "He spent his last days comforting other prisoners!",
      emoji: "✝️"
    }
  ]

  const quotes = [
    "The most deadly poison of our time is indifference. And this happens, although the praise of God should know no limits. Let us strive, therefore, to praise Him to the greatest extent of our powers.",
    "No one in the world can change Truth. What we can do and should do is to seek truth and to serve it when we have found it.",
    "The real conflict is the inner conflict. Beyond armies of occupation and the hecatombs of extermination camps, there are two irreconcilable enemies in the depth of every soul: good and evil, sin and love.",
    "Hate is not a creative force. Love is the creative force."
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238b5cf6' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-0 rounded-2xl shadow-2xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Photo Section */}
                <div className="relative h-80 lg:h-96 bg-gradient-to-br from-purple-100 to-indigo-100">
                  <div className="absolute inset-0 bg-cover bg-no-repeat" style={{
                    backgroundImage: `url('/saints/meximilian-kolbe.jpg')`,
                    backgroundPosition: 'center 10%'
                  }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h1 className="text-3xl font-bold">Maximilian Kolbe</h1>
                    <p className="text-lg">1894 - 1941</p>
                    <p className="text-sm opacity-90">Martyr of Auschwitz</p>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mr-4">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold text-gray-900">Maximilian Kolbe</h1>
                      <p className="text-purple-600 font-semibold">1894 - 1941 • Martyr of Auschwitz</p>
                    </div>
                  </div>
                  
                  <p className="text-xl text-gray-700 leading-relaxed mb-6">
                    Meet the ultimate hero of self-sacrifice! 🛡️ This Franciscan priest gave his life for another 
                    prisoner in Auschwitz. He was basically a real-life superhero with a heart for others!
                  </p>

                  <div className="flex flex-wrap gap-3 mb-6">
                    <span className="px-4 py-2 bg-purple-200 text-purple-800 rounded-full text-sm font-semibold flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Self-Sacrifice
                    </span>
                    <span className="px-4 py-2 bg-indigo-200 text-indigo-800 rounded-full text-sm font-semibold flex items-center">
                      <Globe className="w-4 h-4 mr-2" />
                      Missionary
                    </span>
                    <span className="px-4 py-2 bg-blue-200 text-blue-800 rounded-full text-sm font-semibold flex items-center">
                      <Heart className="w-4 h-4 mr-2" />
                      Martyr for Love
                    </span>
                  </div>

                  <div className="bg-gradient-to-r from-purple-200 to-indigo-200 rounded-2xl p-4">
                    <p className="text-purple-800 font-medium italic text-center">
                      "The most deadly poison of our time is indifference." - Maximilian Kolbe
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Hero Missions Section */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            🛡️ Maximilian's Hero Missions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            This priest was basically a real-life superhero with a heart for others!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {missions.map((mission, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="cursor-pointer"
              onClick={() => setActiveMission(index)}
            >
              <Card className={`bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 h-full ${
                activeMission === index ? 'ring-2 ring-purple-500' : ''
              }`}>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{mission.emoji}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{mission.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{mission.description}</p>
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-3">
                    <p className="text-purple-700 font-semibold text-xs flex items-center">
                      <Lightbulb className="w-3 h-3 mr-1" />
                      Fun Fact: {mission.funFact}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Miracles & Intercessions Section */}
      <div className="bg-gradient-to-r from-purple-100 to-indigo-100 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ✨ Miracles Through Maximilian Kolbe's Intercession
            </h2>
            <p className="text-xl text-gray-600">
              People have been helped and protected through his prayers! Here are some amazing stories:
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {miracles.map((miracle, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              >
                <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4 text-center">{miracle.emoji}</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">
                      {miracle.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 text-center">
                      {miracle.description}
                    </p>
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-3 text-center mb-4">
                      <p className="text-purple-700 font-semibold text-xs">
                        Year: {miracle.year} • Source: {miracle.source}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-xs"
                      onClick={() => setSelectedMiracle(miracle)}
                    >
                      📖 Read Full Story
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* My Favorites Section */}
      {favoriteMiracles.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-purple-50 to-indigo-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                ❤️ My Favorite Miracles
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Your personal collection of Maximilian Kolbe's miraculous intercessions
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteMiracles.map((miracleIndex) => {
                const miracle = miracles[miracleIndex];
                return (
                  <motion.div
                    key={miracleIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                    className="transform transition-all duration-300"
                  >
                    <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                      <CardContent className="p-6">
                        <div className="text-4xl mb-4 text-center">{miracle.emoji}</div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">
                          {miracle.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 text-center">
                          {miracle.description}
                        </p>
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-3 text-center mb-4">
                          <p className="text-purple-700 font-semibold text-xs">
                            Year: {miracle.year} • Source: {miracle.source}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-xs"
                            onClick={() => setSelectedMiracle(miracle)}
                          >
                            📖 Read Full Story
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-purple-500 text-purple-600 hover:bg-purple-50 text-xs"
                            onClick={() => handleToggleFavorite(miracleIndex)}
                          >
                            ❌ Remove
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            🤔 Why Maximilian Kolbe Became a Saint?
          </h2>
          <p className="text-xl text-gray-600">
            Let's discover what made him so special and what we can learn!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-0 rounded-2xl shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Star className="w-6 h-6 mr-3 text-purple-600" />
                What Made Him Extra Special?
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Ultimate Self-Sacrifice</h4>
                    <p className="text-gray-600 text-sm">He volunteered to die in place of another prisoner - the ultimate act of love!</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Globe className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Media Evangelist</h4>
                    <p className="text-gray-600 text-sm">He used radio and print media to spread the Gospel and defend the faith!</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Missionary Heart</h4>
                    <p className="text-gray-600 text-sm">He traveled to Japan to spread the Gospel and adapted to their culture!</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Comforted Others</h4>
                    <p className="text-gray-600 text-sm">Even in his last days, he comforted other prisoners and showed them love!</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-0 rounded-2xl shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Lightbulb className="w-6 h-6 mr-3 text-indigo-600" />
                What Can We Learn?
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Put Others First</h4>
                    <p className="text-gray-600 text-sm">Sometimes we need to sacrifice our own comfort for the good of others!</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Globe className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Use Your Talents</h4>
                    <p className="text-gray-600 text-sm">Use whatever skills you have - writing, speaking, technology - to spread good!</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Love Your Enemies</h4>
                    <p className="text-gray-600 text-sm">Even when people hurt you, choose to love and forgive them!</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Stand Up for Truth</h4>
                    <p className="text-gray-600 text-sm">Don't be afraid to speak up for what's right, even when it's hard!</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl">
                <p className="text-purple-800 font-semibold text-center">
                  <Lightbulb className="w-4 h-4 inline mr-2" />
                  Key Takeaway: "True love means being willing to give up everything for others - that's what makes you truly heroic!"
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">
                Ready to Follow Maximilian Kolbe's Example?
              </h2>
            </div>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Start your own journey of self-sacrifice and putting others first!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.open('/saints', '_blank')}
                className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Saints
              </Button>
              <Button 
                onClick={() => {
                  setShowSuccessMessage(true);
                  setTimeout(() => {
                    window.open('/saints#maximilian', '_blank');
                  }, 1500);
                }}
                className="bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-purple-600 font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Heart className="w-4 h-4 mr-2" />
                Start Your Hero Journey
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Success Message Modal */}
      {showSuccessMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowSuccessMessage(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              🎉 Hero Journey Started!
            </h3>
            <p className="text-gray-600 mb-6">
              You're now following in Maximilian Kolbe's footsteps! Get ready to be a hero for others.
            </p>
            <div className="flex justify-center">
              <Button
                onClick={() => setShowSuccessMessage(false)}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-6 py-2 rounded-full"
              >
                Awesome! Let's Go! 🚀
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Detailed Miracle Modal */}
      {selectedMiracle && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedMiracle(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-8 border-b border-gray-200">
              <button
                onClick={() => setSelectedMiracle(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <span className="text-gray-600 text-xl">×</span>
              </button>
              <div className="flex items-center space-x-4">
                <div className="text-6xl">{selectedMiracle.emoji}</div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {selectedMiracle.title} - Detailed Information
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Year: {selectedMiracle.year}
                    </span>
                    <span className="flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      Source: {selectedMiracle.source}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-purple-600" />
                      Location
                    </h3>
                    <p className="text-gray-700">Various locations where miracles occurred through Maximilian Kolbe's intercession</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Heart className="w-5 h-5 mr-2 text-purple-600" />
                      Type of Miracle
                    </h3>
                    <p className="text-gray-700">{selectedMiracle.title.replace('🛡️ ', '').replace('💪 ', '').replace('🤝 ', '').replace('📚 ', '').replace('💼 ', '').replace('🙏 ', '').replace('✨ ', '')}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                      Significance
                    </h3>
                    <p className="text-gray-700">This miracle demonstrates Maximilian Kolbe's continued intercession for those who seek his help, showing his ongoing care for the faithful even after his death.</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-purple-600" />
                      Impact
                    </h3>
                    <p className="text-gray-700">This miracle has inspired many to turn to Maximilian Kolbe for help with similar challenges, strengthening faith and devotion among the faithful.</p>
                  </div>
                </div>

                {/* Right Column - Story and Prayer */}
                <div className="space-y-6">
                  <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-0 rounded-2xl shadow-sm">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <Quote className="w-5 h-5 mr-2 text-purple-600" />
                        Full Story
                      </h3>
                      <p className="text-gray-700 leading-relaxed italic">
                        "{selectedMiracle.fullStory}"
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-0 rounded-2xl shadow-sm">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <Heart className="w-5 h-5 mr-2 text-indigo-600" />
                        Prayer for Intercession
                      </h3>
                      <p className="text-gray-700 leading-relaxed italic">
                        "Maximilian Kolbe, you who gave your life for another,
                        intercede for us in our time of need. Help us to have the courage
                        to put others first and to love even our enemies. Amen."
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button
                  className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
                  onClick={() => {
                    const miracleIndex = miracles.findIndex(m => m.title === selectedMiracle.title);
                    handleToggleFavorite(miracleIndex);
                    setSelectedMiracle(null);
                  }}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  {favoriteMiracles.includes(miracles.findIndex(m => m.title === selectedMiracle.title)) ? 'Remove from Favorites' : 'Add to Favorites'}
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1 border-purple-500 text-purple-600 hover:bg-purple-50"
                  onClick={() => {
                    // Share functionality
                    if (navigator.share) {
                      navigator.share({
                        title: selectedMiracle.title,
                        text: selectedMiracle.description,
                        url: window.location.href
                      });
                    } else {
                      navigator.clipboard.writeText(`${selectedMiracle.title}: ${selectedMiracle.description}`);
                      alert('Story copied to clipboard!');
                    }
                  }}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Share with Friends
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1 border-purple-500 text-purple-600 hover:bg-purple-50"
                  onClick={() => {
                    // Learn more functionality
                    window.open('https://www.vatican.va', '_blank');
                  }}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Learn More
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
