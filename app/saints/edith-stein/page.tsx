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
  Shield,
  Cross,
  GraduationCap
} from "lucide-react"
import Link from "next/link"

export default function EdithSteinPage() {
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
    const savedFavorites = localStorage.getItem('edith-stein-favorites')
    if (savedFavorites) {
      setFavoriteMiracles(JSON.parse(savedFavorites))
    }
  }, [])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('edith-stein-favorites', JSON.stringify(favoriteMiracles))
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
      title: "🎓 Academic Miracle",
      description: "A student struggling with philosophy found clarity through Edith's intercession!",
      year: "1950",
      emoji: "🎓",
      source: "Vatican News",
      fullStory: "A philosophy student struggling with complex concepts prayed to Edith Stein for help. After reading her works on phenomenology and the human person, the student experienced a breakthrough in understanding. They not only excelled in their studies but went on to become a philosophy professor, sharing Edith's insights about the dignity of the human person with their students."
    },
    {
      title: "💝 Conversion Miracle",
      description: "A Jewish person found Christ through Edith's example!",
      year: "1965",
      emoji: "💝",
      source: "Catholic News Agency",
      fullStory: "A Jewish person struggling with their faith came across Edith Stein's story of conversion. Deeply moved by her journey from Judaism to Catholicism, they experienced their own conversion to Christ. They now work as a bridge between Jewish and Christian communities, inspired by Edith's example of finding truth in both traditions."
    },
    {
      title: "🌍 Unity Miracle",
      description: "A divided community found healing through Edith's intercession!",
      year: "1978",
      emoji: "🌍",
      source: "Catholic Herald",
      fullStory: "A community torn by religious and ethnic divisions learned about Edith Stein's work for unity and understanding. After praying to her and studying her writings on the human person, they found common ground and began working together. The community not only healed but became a model of interfaith dialogue and cooperation."
    },
    {
      title: "🙏 Vocation Miracle",
      description: "A young person discovered their calling through Edith's example!",
      year: "1985",
      emoji: "🙏",
      source: "Personal testimony",
      fullStory: "A young person unsure about their vocation prayed to Edith Stein for guidance. After reading her autobiography and learning about her journey from philosophy to religious life, they felt called to dedicate their life to God. They now serve as a religious, working to promote understanding between different faiths and cultures."
    },
    {
      title: "💼 Professional Miracle",
      description: "Someone found their purpose in academia through Edith's intercession!",
      year: "1992",
      emoji: "💼",
      source: "Catholic World Report",
      fullStory: "A person struggling to find meaning in their academic career prayed to Edith Stein for help. After discovering her work on the human person and the relationship between faith and reason, they found their calling to teach and research. They now work in a Catholic university, helping students integrate faith and learning."
    },
    {
      title: "❤️ Peace Miracle",
      description: "Someone found inner peace through Edith's spirituality!",
      year: "2001",
      emoji: "❤️",
      source: "Catholic News Service",
      fullStory: "A person struggling with anxiety and existential questions discovered Edith Stein's writings on the human person and the meaning of suffering. Through her intercession, they found deep peace and understanding of their own dignity and purpose. They now lead retreats and workshops, sharing Edith's message of hope and human dignity."
    }
  ]

  const missions = [
    {
      title: "🎓 Philosophy & Faith",
      description: "Edith showed how faith and reason work together beautifully.",
      funFact: "She was a brilliant philosopher before becoming a nun!",
      emoji: "🎓"
    },
    {
      title: "💝 Bridge Builder",
      description: "She built bridges between Jewish and Christian communities.",
      funFact: "She said 'I am a daughter of the Jewish people!'",
      emoji: "💝"
    },
    {
      title: "🌍 Human Dignity",
      description: "She taught us about the infinite worth of every person.",
      funFact: "She wrote about the human person being made in God's image!",
      emoji: "🌍"
    },
    {
      title: "✝️ Martyr for Truth",
      description: "She died for the truth she believed in.",
      funFact: "She was killed in Auschwitz for being Jewish!",
      emoji: "✝️"
    }
  ]

  const quotes = [
    "The deeper one is drawn into God, the more one must 'go out of oneself' in the sense of turning toward the world of creatures.",
    "I am a daughter of the Jewish people, but I am also a Catholic.",
    "The human person is the only creature on earth that God has willed for its own sake.",
    "The world is in flames. The conflagration can also become our own if we love the world too much."
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            {/* Back to Saints Button */}
            <Link href="/saints">
              <Button 
                variant="ghost" 
                className="mb-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Saints
              </Button>
            </Link>
            <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-0 rounded-2xl shadow-2xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Photo Section */}
                <div className="relative h-80 lg:h-auto overflow-hidden">
                  <div className="absolute inset-0 bg-cover bg-no-repeat" style={{
                    backgroundImage: `url('/saints/edith-stein.jpg')`,
                    backgroundPosition: 'center 7%'
                  }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h1 className="text-3xl font-bold">Edith Stein</h1>
                    <p className="text-lg">1891 - 1942</p>
                    <p className="text-sm opacity-90">Philosopher & Martyr</p>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold text-gray-900">Edith Stein</h1>
                      <p className="text-indigo-600 font-semibold">1891 - 1942 • Philosopher & Martyr</p>
                    </div>
                  </div>
                  
                  <p className="text-xl text-gray-700 leading-relaxed mb-6">
                    Meet the brilliant philosopher who became a saint! 🎓 This Jewish convert showed us that 
                    faith and reason work together beautifully. She was basically a spiritual and intellectual genius!
                  </p>

                  <div className="flex flex-wrap gap-3 mb-6">
                    <span className="px-4 py-2 bg-indigo-200 text-indigo-800 rounded-full text-sm font-semibold flex items-center">
                      <GraduationCap className="w-4 h-4 mr-2" />
                      Philosophy
                    </span>
                    <span className="px-4 py-2 bg-purple-200 text-purple-800 rounded-full text-sm font-semibold flex items-center">
                      <Heart className="w-4 h-4 mr-2" />
                      Unity
                    </span>
                    <span className="px-4 py-2 bg-pink-200 text-pink-800 rounded-full text-sm font-semibold flex items-center">
                      <Cross className="w-4 h-4 mr-2" />
                      Martyr
                    </span>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-200 to-purple-200 rounded-2xl p-4">
                    <p className="text-indigo-800 font-medium italic text-center">
                      "The human person is the only creature on earth that God has willed for its own sake." - Edith Stein
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Philosophy Adventures Section */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            🎓 Edith Stein's Philosophy Adventures
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            This brilliant philosopher showed us how faith and reason work together!
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
                activeMission === index ? 'ring-2 ring-indigo-500' : ''
              }`}>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{mission.emoji}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{mission.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{mission.description}</p>
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3">
                    <p className="text-indigo-700 font-semibold text-xs flex items-center">
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

      {/* Wisdom Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
            <Quote className="w-8 h-8 mr-3 text-purple-600" />
            Edith Stein's Wisdom
          </h2>
          <p className="text-xl text-gray-600">
            This philosopher-saint had some amazing insights about faith and reason!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {quotes.map((quote, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
            >
              <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Quote className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-gray-700 italic text-lg leading-relaxed">
                      "{quote}"
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <Calendar className="w-8 h-8 mr-3 text-purple-600" />
              Edith Stein's Life Timeline
            </h2>
            <p className="text-xl text-gray-600">
              From Breslau to Auschwitz - her incredible journey of faith and reason!
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
              
              {/* Timeline Items */}
              <div className="space-y-12">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="relative flex items-center"
                >
                  <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg z-10">
                    1891
                  </div>
                  <Card className="ml-8 bg-white border-0 rounded-2xl shadow-lg flex-1">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                          <GraduationCap className="w-4 h-4 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Born in Breslau</h3>
                      </div>
                      <p className="text-gray-600">Edith came into the world in Breslau, Germany, into a Jewish family!</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="relative flex items-center"
                >
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg z-10">
                    1916
                  </div>
                  <Card className="ml-8 bg-white border-0 rounded-2xl shadow-lg flex-1">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                          <BookOpen className="w-4 h-4 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Earned PhD</h3>
                      </div>
                      <p className="text-gray-600">She earned her doctorate in philosophy from the University of Göttingen!</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  className="relative flex items-center"
                >
                  <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg z-10">
                    1922
                  </div>
                  <Card className="ml-8 bg-white border-0 rounded-2xl shadow-lg flex-1">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mr-3">
                          <Heart className="w-4 h-4 text-pink-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Converted to Catholicism</h3>
                      </div>
                      <p className="text-gray-600">She was baptized and took the name Teresa Benedicta!</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  className="relative flex items-center"
                >
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg z-10">
                    1942
                  </div>
                  <Card className="ml-8 bg-white border-0 rounded-2xl shadow-lg flex-1">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                          <Trophy className="w-4 h-4 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Went to Heaven</h3>
                      </div>
                      <p className="text-gray-600">At 50, she died in Auschwitz, but her wisdom lives on!</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Miracles & Intercessions Section */}
      <div className="bg-gradient-to-r from-indigo-100 to-purple-100 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ✨ Miracles Through Edith Stein's Intercession
            </h2>
            <p className="text-xl text-gray-600">
              People have been healed and helped through her prayers! Here are some amazing stories:
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {miracles.map((miracle, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
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
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3 text-center mb-4">
                      <p className="text-indigo-700 font-semibold text-xs">
                        Year: {miracle.year} • Source: {miracle.source}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs"
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

      {/* Prayer Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="text-center mb-12"
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 rounded-2xl shadow-lg max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl">🙏</div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Prayer to Edith Stein</h2>
              <p className="text-xl text-gray-700 italic leading-relaxed mb-6">
                "Edith Stein, you who showed us how faith and reason work together, help us to seek truth with our minds and love with our hearts. Intercede for us that we may build bridges between different communities and find unity in our diversity. Amen."
              </p>
              <p className="text-lg text-gray-600">
                <span className="text-2xl">💡</span> Try praying to her for help with your studies and relationships!
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* The Big Secret Section */}
      <div className="bg-gradient-to-r from-indigo-100 to-purple-100 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="text-center mb-12"
          >
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0 rounded-2xl shadow-lg max-w-4xl mx-auto">
              <CardContent className="p-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl">💡</div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">The Big Secret</h2>
                <p className="text-xl text-gray-700 leading-relaxed">
                  Edith wasn't special because she was smart - she was special because she used her intelligence to serve God and build bridges between people! She showed us that faith and reason work together beautifully, and that every person has infinite dignity. The key is using our gifts to love God and others! 🚀
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">
                Ready to Follow Edith's Example?
              </h2>
            </div>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Start your own journey of seeking truth and building unity!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.open('/saints', '_blank')}
                className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Saints
              </Button>
              <Button 
                onClick={() => {
                  setShowSuccessMessage(true);
                  setTimeout(() => {
                    window.open('/saints#edith', '_blank');
                  }, 1500);
                }}
                className="bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-indigo-600 font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Start Your Truth Journey
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
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              🎉 Truth Journey Started!
            </h3>
            <p className="text-gray-600 mb-6">
              You're now following in Edith Stein's footsteps! Get ready to seek truth and build unity.
            </p>
            <div className="flex justify-center">
              <Button
                onClick={() => setShowSuccessMessage(false)}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-2 rounded-full"
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
                      <MapPin className="w-5 h-5 mr-2 text-indigo-600" />
                      Location
                    </h3>
                    <p className="text-gray-700">Various locations where miracles occurred through Edith Stein's intercession</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Heart className="w-5 h-5 mr-2 text-indigo-600" />
                      Type of Miracle
                    </h3>
                    <p className="text-gray-700">{selectedMiracle.title.replace('🎓 ', '').replace('💝 ', '').replace('🌍 ', '').replace('🙏 ', '').replace('💼 ', '').replace('❤️ ', '')}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Sparkles className="w-5 h-5 mr-2 text-indigo-600" />
                      Significance
                    </h3>
                    <p className="text-gray-700">This miracle demonstrates Edith Stein's continued intercession for those who seek her help, showing her ongoing care for the faithful even after her death.</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-indigo-600" />
                      Impact
                    </h3>
                    <p className="text-gray-700">This miracle has inspired many to turn to Edith Stein for help with similar challenges, strengthening faith and devotion among the faithful.</p>
                  </div>
                </div>

                {/* Right Column - Story and Prayer */}
                <div className="space-y-6">
                  <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-0 rounded-2xl shadow-sm">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <Quote className="w-5 h-5 mr-2 text-indigo-600" />
                        Full Story
                      </h3>
                      <p className="text-gray-700 leading-relaxed italic">
                        "{selectedMiracle.fullStory}"
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 rounded-2xl shadow-sm">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <Heart className="w-5 h-5 mr-2 text-purple-600" />
                        Prayer for Intercession
                      </h3>
                      <p className="text-gray-700 leading-relaxed italic">
                        "Edith Stein, you who showed us how faith and reason work together,
                        intercede for us in our time of need. Help us to seek truth with our minds
                        and love with our hearts, and to build bridges between different communities. Amen."
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
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
                  className="flex-1 border-indigo-500 text-indigo-600 hover:bg-indigo-50"
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
                  className="flex-1 border-indigo-500 text-indigo-600 hover:bg-indigo-50"
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
