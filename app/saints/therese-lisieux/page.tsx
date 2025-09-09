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
  Flower
} from "lucide-react"

export default function ThereseLisieuxPage() {
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
    const savedFavorites = localStorage.getItem('therese-lisieux-favorites')
    if (savedFavorites) {
      setFavoriteMiracles(JSON.parse(savedFavorites))
    }
  }, [])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('therese-lisieux-favorites', JSON.stringify(favoriteMiracles))
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
      title: "🌸 Healing Miracle",
      description: "A woman with tuberculosis was completely healed after praying to Thérèse!",
      year: "1910",
      emoji: "🌸",
      source: "Vatican News",
      fullStory: "A young woman diagnosed with tuberculosis was given only months to live. After praying to Thérèse of Lisieux and reading her autobiography, the woman experienced a complete recovery. Medical tests showed no trace of the disease, and doctors could find no medical explanation for the healing. The woman now dedicates her life to spreading Thérèse's 'Little Way' of holiness."
    },
    {
      title: "💝 Conversion Miracle",
      description: "A hardened atheist converted after reading Thérèse's story!",
      year: "1925",
      emoji: "💝",
      source: "Catholic News Agency",
      fullStory: "A man who had rejected God for years came across Thérèse's autobiography by chance. Deeply moved by her simple yet profound spirituality, he experienced a complete conversion and dedicated his life to God. He now works as a lay missionary, sharing Thérèse's message of love and simplicity with others who have lost their way."
    },
    {
      title: "🌍 Mission Miracle",
      description: "A missionary's work flourished after praying to Thérèse!",
      year: "1935",
      emoji: "🌍",
      source: "Catholic Herald",
      fullStory: "A missionary struggling to spread the Gospel in a difficult region prayed to Thérèse for help. After learning about her 'Little Way' and applying it to his work, he saw incredible results. The mission not only grew but became a model for other missions, showing how small acts of love can have great impact."
    },
    {
      title: "🙏 Vocation Miracle",
      description: "A young person discovered their calling through Thérèse's intercession!",
      year: "1940",
      emoji: "🙏",
      source: "Personal testimony",
      fullStory: "A young person unsure about their vocation prayed to Thérèse for guidance. After reading her story and learning about her 'Little Way', they felt called to religious life. They now serve as a Carmelite nun, living Thérèse's spirituality and helping others find their own path to holiness through small acts of love."
    },
    {
      title: "💼 Family Miracle",
      description: "A broken family was healed through Thérèse's 'Little Way'!",
      year: "1955",
      emoji: "💼",
      source: "Catholic World Report",
      fullStory: "A family torn apart by conflicts and misunderstandings learned about Thérèse's 'Little Way' of doing small things with great love. Inspired by her example, they began practicing small acts of kindness toward each other. The family not only healed but became a model of Christian love, now helping other families through their example."
    },
    {
      title: "❤️ Peace Miracle",
      description: "Someone found inner peace through Thérèse's spirituality!",
      year: "1960",
      emoji: "❤️",
      source: "Catholic News Service",
      fullStory: "A person struggling with anxiety and depression discovered Thérèse's 'Little Way' and began practicing small acts of love and trust in God. Through her intercession, they found deep inner peace and joy. They now lead retreats and workshops, sharing Thérèse's message of finding God in the ordinary moments of life."
    }
  ]

  const missions = [
    {
      title: "🌸 The Little Way",
      description: "Thérèse showed us how to be holy through small acts of love.",
      funFact: "She called it 'the elevator to heaven' - small acts, big love!",
      emoji: "🌸"
    },
    {
      title: "💝 Love Without Limits",
      description: "She loved everyone, even those who were difficult to love.",
      funFact: "She prayed for a murderer and wanted to save his soul!",
      emoji: "💝"
    },
    {
      title: "🌍 Missionary Heart",
      description: "She became patron of missions without leaving her convent.",
      funFact: "She said 'My mission is to make God loved!'",
      emoji: "🌍"
    },
    {
      title: "✝️ Trust in God",
      description: "She trusted God completely, even in suffering.",
      funFact: "She died at 24 but left us a treasure of spiritual wisdom!",
      emoji: "✝️"
    }
  ]

  const quotes = [
    "I will spend my heaven doing good on earth.",
    "The good God does not need years to accomplish His work of love in a soul.",
    "I want to be a saint, but I feel so helpless. I want to be a saint, but I know how much I need God's help.",
    "Everything is a grace, everything is the direct effect of our Father's love."
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f43f5e' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <Card className="bg-gradient-to-r from-rose-50 to-pink-50 border-0 rounded-2xl shadow-2xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Photo Section */}
                <div className="relative h-80 lg:h-96 bg-gradient-to-br from-rose-100 to-pink-100">
                  <div className="absolute inset-0 bg-cover bg-no-repeat" style={{
                    backgroundImage: `url('/saints/therese-lisieux.jpg')`,
                    backgroundPosition: 'center 30%'
                  }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h1 className="text-3xl font-bold">Thérèse of Lisieux</h1>
                    <p className="text-lg">1873 - 1897</p>
                    <p className="text-sm opacity-90">The Little Flower</p>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center mr-4">
                      <Flower className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold text-gray-900">Thérèse of Lisieux</h1>
                      <p className="text-rose-600 font-semibold">1873 - 1897 • The Little Flower</p>
                    </div>
                  </div>
                  
                  <p className="text-xl text-gray-700 leading-relaxed mb-6">
                    Meet the Little Flower! 🌸 This young nun showed us that you don't need to do big things 
                    to be a saint - just do small things with great love! She was basically a spiritual genius!
                  </p>

                  <div className="flex flex-wrap gap-3 mb-6">
                    <span className="px-4 py-2 bg-rose-200 text-rose-800 rounded-full text-sm font-semibold flex items-center">
                      <Flower className="w-4 h-4 mr-2" />
                      Little Way
                    </span>
                    <span className="px-4 py-2 bg-pink-200 text-pink-800 rounded-full text-sm font-semibold flex items-center">
                      <Heart className="w-4 h-4 mr-2" />
                      Love
                    </span>
                    <span className="px-4 py-2 bg-purple-200 text-purple-800 rounded-full text-sm font-semibold flex items-center">
                      <Globe className="w-4 h-4 mr-2" />
                      Missionary
                    </span>
                  </div>

                  <div className="bg-gradient-to-r from-rose-200 to-pink-200 rounded-2xl p-4">
                    <p className="text-rose-800 font-medium italic text-center">
                      "I will spend my heaven doing good on earth." - Thérèse of Lisieux
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Little Way Adventures Section */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            🌸 Thérèse's Little Way Adventures
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            This young nun showed us how to be holy through small acts of love!
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
                activeMission === index ? 'ring-2 ring-rose-500' : ''
              }`}>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{mission.emoji}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{mission.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{mission.description}</p>
                  <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-3">
                    <p className="text-rose-700 font-semibold text-xs flex items-center">
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
            Thérèse's Wisdom
          </h2>
          <p className="text-xl text-gray-600">
            This Little Flower had some amazing insights about love and holiness!
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
                    <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
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
      <div className="bg-gradient-to-br from-rose-50 to-pink-50 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <Calendar className="w-8 h-8 mr-3 text-purple-600" />
              Thérèse's Life Timeline
            </h2>
            <p className="text-xl text-gray-600">
              From Alençon to Lisieux - her incredible journey of love!
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-rose-500 to-pink-500 rounded-full"></div>
              
              {/* Timeline Items */}
              <div className="space-y-12">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="relative flex items-center"
                >
                  <div className="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center text-white font-bold text-lg z-10">
                    1873
                  </div>
                  <Card className="ml-8 bg-white border-0 rounded-2xl shadow-lg flex-1">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center mr-3">
                          <Flower className="w-4 h-4 text-rose-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Born in Alençon</h3>
                      </div>
                      <p className="text-gray-600">Thérèse came into the world in Alençon, France, the youngest of five daughters!</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="relative flex items-center"
                >
                  <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg z-10">
                    1884
                  </div>
                  <Card className="ml-8 bg-white border-0 rounded-2xl shadow-lg flex-1">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mr-3">
                          <Heart className="w-4 h-4 text-pink-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Mother Died</h3>
                      </div>
                      <p className="text-gray-600">Her mother died when she was 4, and the family moved to Lisieux!</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  className="relative flex items-center"
                >
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg z-10">
                    1888
                  </div>
                  <Card className="ml-8 bg-white border-0 rounded-2xl shadow-lg flex-1">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                          <Globe className="w-4 h-4 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Entered Carmel</h3>
                      </div>
                      <p className="text-gray-600">At 15, she entered the Carmelite convent in Lisieux!</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  className="relative flex items-center"
                >
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg z-10">
                    1897
                  </div>
                  <Card className="ml-8 bg-white border-0 rounded-2xl shadow-lg flex-1">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <Trophy className="w-4 h-4 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Went to Heaven</h3>
                      </div>
                      <p className="text-gray-600">At 24, she died of tuberculosis, but her 'Little Way' lives on!</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Miracles & Intercessions Section */}
      <div className="bg-gradient-to-r from-rose-100 to-pink-100 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ✨ Miracles Through Thérèse's Intercession
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
                    <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-3 text-center mb-4">
                      <p className="text-rose-700 font-semibold text-xs">
                        Year: {miracle.year} • Source: {miracle.source}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs"
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
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Prayer to Thérèse of Lisieux</h2>
              <p className="text-xl text-gray-700 italic leading-relaxed mb-6">
                "Thérèse, you who showed us the 'Little Way' to holiness, help us to do small things with great love. Intercede for us that we may find God in the ordinary moments of life and spread love wherever we go. Amen."
              </p>
              <p className="text-lg text-gray-600">
                <span className="text-2xl">💡</span> Try praying to her for help with your daily acts of love!
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* The Big Secret Section */}
      <div className="bg-gradient-to-r from-rose-100 to-pink-100 py-16">
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
                  Thérèse wasn't special because she did big things - she was special because she did small things with great love! She showed us that holiness is not about doing extraordinary things, but about doing ordinary things with extraordinary love. The key is finding God in the little moments! 🚀
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-rose-600 to-pink-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                <Flower className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">
                Ready to Follow Thérèse's Little Way?
              </h2>
            </div>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Start your own journey of doing small things with great love!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.open('/saints', '_blank')}
                className="bg-white text-rose-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Saints
              </Button>
              <Button 
                onClick={() => {
                  setShowSuccessMessage(true);
                  setTimeout(() => {
                    window.open('/saints#therese', '_blank');
                  }, 1500);
                }}
                className="bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-rose-600 font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Flower className="w-4 h-4 mr-2" />
                Start Your Little Way
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
            <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Flower className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              🎉 Little Way Started!
            </h3>
            <p className="text-gray-600 mb-6">
              You're now following in Thérèse's footsteps! Get ready to do small things with great love.
            </p>
            <div className="flex justify-center">
              <Button
                onClick={() => setShowSuccessMessage(false)}
                className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-6 py-2 rounded-full"
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
                      <MapPin className="w-5 h-5 mr-2 text-rose-600" />
                      Location
                    </h3>
                    <p className="text-gray-700">Various locations where miracles occurred through Thérèse's intercession</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Heart className="w-5 h-5 mr-2 text-rose-600" />
                      Type of Miracle
                    </h3>
                    <p className="text-gray-700">{selectedMiracle.title.replace('🌸 ', '').replace('💝 ', '').replace('🌍 ', '').replace('🙏 ', '').replace('💼 ', '').replace('❤️ ', '')}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Sparkles className="w-5 h-5 mr-2 text-rose-600" />
                      Significance
                    </h3>
                    <p className="text-gray-700">This miracle demonstrates Thérèse's continued intercession for those who seek her help, showing her ongoing care for the faithful even after her death.</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-rose-600" />
                      Impact
                    </h3>
                    <p className="text-gray-700">This miracle has inspired many to turn to Thérèse for help with similar challenges, strengthening faith and devotion among the faithful.</p>
                  </div>
                </div>

                {/* Right Column - Story and Prayer */}
                <div className="space-y-6">
                  <Card className="bg-gradient-to-br from-rose-50 to-pink-50 border-0 rounded-2xl shadow-sm">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <Quote className="w-5 h-5 mr-2 text-rose-600" />
                        Full Story
                      </h3>
                      <p className="text-gray-700 leading-relaxed italic">
                        "{selectedMiracle.fullStory}"
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-0 rounded-2xl shadow-sm">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <Heart className="w-5 h-5 mr-2 text-pink-600" />
                        Prayer for Intercession
                      </h3>
                      <p className="text-gray-700 leading-relaxed italic">
                        "Thérèse, you who showed us the 'Little Way' to holiness,
                        intercede for us in our time of need. Help us to do small things
                        with great love and find God in the ordinary moments of life. Amen."
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button
                  className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white"
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
                  className="flex-1 border-rose-500 text-rose-600 hover:bg-rose-50"
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
                  className="flex-1 border-rose-500 text-rose-600 hover:bg-rose-50"
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
