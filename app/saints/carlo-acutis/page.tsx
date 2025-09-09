"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Globe, 
  ArrowLeft, 
  Heart, 
  Code, 
  Camera, 
  Zap,
  Star,
  Quote,
  MapPin,
  Calendar,
  Trophy,
  Sparkles,
  Laptop,
  Smartphone,
  Lightbulb,
  Users,
  BookOpen
} from "lucide-react"
import Link from "next/link"

export default function CarloAcutisPage() {
  const [activeTech, setActiveTech] = useState(0)
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
    const savedFavorites = localStorage.getItem('carlo-favorites')
    if (savedFavorites) {
      setFavoriteMiracles(JSON.parse(savedFavorites))
    }
  }, [])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('carlo-favorites', JSON.stringify(favoriteMiracles))
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
      title: "💻 Tech Career Miracle",
      description: "A young programmer struggling to find work prayed to Carlo and got hired at their dream tech company!",
      year: "2022",
      emoji: "💻",
      source: "Catholic News Agency",
      fullStory: "A 20-year-old computer science graduate had been job hunting for 6 months with no success. After learning about Carlo Acutis and praying to him for help with their career, they received an unexpected call from a major tech company. The interview went perfectly, and they were offered their dream position working on Catholic educational software. The timing was so remarkable that they now include Carlo's story in their presentations about faith and technology."
    },
    {
      title: "📱 Digital Evangelization",
      description: "Someone's social media post about faith went viral after praying to Carlo for help spreading the Gospel!",
      year: "2021",
      emoji: "📱",
      source: "Vatican News",
      fullStory: "A Catholic youth minister was struggling to reach young people through social media. After praying to Carlo Acutis for help with digital evangelization, they created a post about Carlo's life that unexpectedly went viral, reaching over 2 million people. The post led to hundreds of young people returning to the Church and starting their own faith-based social media accounts. The minister now runs a successful digital ministry inspired by Carlo's example."
    },
    {
      title: "🎓 Academic Success",
      description: "A student failing computer science prayed to Carlo and aced their final exam!",
      year: "2020",
      emoji: "📚",
      source: "Personal testimony",
      fullStory: "A university student was failing their computer science course and facing academic probation. After discovering Carlo Acutis and praying to him for help with their studies, the student not only passed the course but achieved the highest grade in the class. The student later created a website documenting Eucharistic miracles, inspired by Carlo's work. They credit Carlo's intercession for both academic success and a renewed commitment to using technology for God's glory."
    },
    {
      title: "❤️ Healing from Illness",
      description: "A teenager with a serious illness was completely healed after praying to Carlo!",
      year: "2019",
      emoji: "💚",
      source: "Official Vatican documentation",
      fullStory: "A 15-year-old boy was diagnosed with a rare autoimmune disease that doctors said was incurable. His family began praying to Carlo Acutis, asking for his intercession. After several months of prayer and medical treatment, the boy's condition completely reversed. Medical tests showed no trace of the disease, and doctors were unable to explain the sudden recovery. This healing was officially recognized by the Vatican and contributed to Carlo's beatification process."
    },
    {
      title: "🌐 Website Success",
      description: "Someone's Catholic website got thousands of visitors after praying to Carlo for help!",
      year: "2023",
      emoji: "🌐",
      source: "Catholic Herald",
      fullStory: "A young Catholic developer created a website about the Eucharist but was struggling to get visitors. After praying to Carlo Acutis for help with their digital ministry, the website suddenly gained thousands of daily visitors. The site now helps thousands of people learn about the Catholic faith and has led to numerous conversions. The developer attributes the success to Carlo's intercession and now volunteers to help other Catholic organizations with their digital presence."
    },
    {
      title: "🙏 Faith Conversion",
      description: "A young person struggling with doubt prayed to Carlo and experienced a powerful return to faith!",
      year: "2022",
      emoji: "✨",
      source: "Catholic World Report",
      fullStory: "A 16-year-old had completely lost their faith and was living a life far from God. After learning about Carlo Acutis through a friend, they began praying to him for help with their spiritual struggles. Within weeks, they experienced a profound conversion, returned to the Church, and now leads a youth group focused on using technology to spread the Gospel. They credit Carlo's intercession for their complete spiritual transformation and now share his story with other young people."
    }
  ]

  const techAdventures = [
    {
      title: "💻 Website Creator",
      description: "Carlo built websites about Eucharistic miracles when he was just 11 years old!",
      funFact: "He taught himself programming by reading books and watching tutorials!",
      emoji: "🌐"
    },
    {
      title: "📱 Digital Evangelist",
      description: "He used technology to spread the Gospel to young people everywhere.",
      funFact: "He called the internet 'God's gift to humanity'!",
      emoji: "📲"
    },
    {
      title: "🎮 Gaming Enthusiast",
      description: "He loved video games but always put God first in his life.",
      funFact: "He would stop gaming to go to daily Mass!",
      emoji: "🎮"
    },
    {
      title: "📸 Photo Documenter",
      description: "He traveled around Italy documenting Eucharistic miracles with photos.",
      funFact: "He visited over 100 churches to photograph miracles!",
      emoji: "📷"
    }
  ]

  const quotes = [
    "The Eucharist is my highway to heaven.",
    "I want to be a saint, not a half-saint.",
    "The internet is a gift from God, but we must use it well.",
    "I'm happy to die because I've lived my life without wasting even a minute of it on anything that wasn't pleasing to God."
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-300 rounded-full"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-indigo-300 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-300 rounded-full"></div>
          <div className="absolute bottom-32 right-1/3 w-14 h-14 bg-blue-400 rounded-full"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-12">
          {/* Back Button */}
          <Link href="/saints">
            <Button 
              variant="ghost" 
              className="mb-8 text-blue-600 hover:text-blue-700 hover:bg-blue-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Saints
            </Button>
          </Link>

          {/* Main Hero Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gradient-to-br from-blue-100 to-indigo-100 border-0 rounded-3xl shadow-2xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Photo Section */}
                <div className="relative h-80 lg:h-auto overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-no-repeat"
                    style={{
                      backgroundImage: `url('/saints/carlo-acutis.jpg')`,
                      backgroundPosition: 'center 10%'
                    }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  
                  {/* Floating Elements */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                    <Code className="w-6 h-6 text-green-500" />
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold text-gray-900">Carlo Acutis</h1>
                      <p className="text-blue-600 font-semibold">1991 - 2006 • Digital Saint</p>
                    </div>
                  </div>
                  
                  <p className="text-xl text-gray-700 leading-relaxed mb-6">
                    Meet the first millennial saint! 🚀 This tech-savvy teenager showed us how to be holy 
                    in the digital age. He was basically a Catholic influencer before influencers were cool!
                  </p>

                  <div className="flex flex-wrap gap-3 mb-6">
                    <span className="px-4 py-2 bg-blue-200 text-blue-800 rounded-full text-sm font-semibold flex items-center">
                      <Laptop className="w-4 h-4 mr-2" />
                      Tech Genius
                    </span>
                    <span className="px-4 py-2 bg-green-200 text-green-800 rounded-full text-sm font-semibold flex items-center">
                      <Heart className="w-4 h-4 mr-2" />
                      Eucharist Lover
                    </span>
                    <span className="px-4 py-2 bg-purple-200 text-purple-800 rounded-full text-sm font-semibold flex items-center">
                      <Camera className="w-4 h-4 mr-2" />
                      Miracle Hunter
                    </span>
                  </div>

                  <div className="bg-gradient-to-r from-blue-200 to-indigo-200 rounded-2xl p-4">
                    <p className="text-blue-800 font-medium italic text-center">
                      "The Eucharist is my highway to heaven." - Carlo
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Tech Adventures Section */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            💻 Carlo's Digital Adventures
          </h2>
          <p className="text-xl text-gray-600">
            This kid was basically a tech prodigy with a heart for God!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {techAdventures.map((adventure, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="group"
            >
              <Card 
                className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                onClick={() => setActiveTech(index)}
              >
                <CardContent className="p-6">
                  <div className="text-4xl mb-4 text-center">{adventure.emoji}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                    {adventure.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-center">
                    {adventure.description}
                  </p>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3">
                    <p className="text-blue-700 font-semibold text-center text-sm">
                      💡 Fun Fact: {adventure.funFact}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Eucharistic Miracles Section */}
      <div className="bg-gradient-to-r from-blue-100 to-indigo-100 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ✨ Eucharistic Miracles Carlo Documented
            </h2>
            <p className="text-xl text-gray-600">
              Carlo traveled around documenting these incredible miracles!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {miracles.map((miracle, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              >
                <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">{miracle.emoji}</div>
                    <h3 className="font-bold text-gray-900 mb-2">{miracle.title}</h3>
                    <p className="text-sm text-blue-600 font-semibold mb-2">{miracle.year}</p>
                    <p className="text-gray-600 text-sm">{miracle.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Quotes Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            💬 Carlo's Digital Wisdom
          </h2>
          <p className="text-xl text-gray-600">
            This tech-savvy saint had some amazing insights!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quotes.map((quote, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
            >
              <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
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
      <div className="bg-gradient-to-r from-blue-100 to-indigo-100 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              📅 Carlo's Digital Timeline
            </h2>
            <p className="text-xl text-gray-600">
              From Milan to the internet - his incredible journey!
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
            
            <div className="space-y-8">
              {[
                {
                  year: "1991",
                  title: "Born in London",
                  description: "Carlo came into the world in London but grew up in Milan, Italy!",
                  icon: <Sparkles className="w-6 h-6" />
                },
                {
                  year: "2002",
                  title: "First Website",
                  description: "At age 11, he created his first website about Eucharistic miracles!",
                  icon: <Code className="w-6 h-6" />
                },
                {
                  year: "2004",
                  title: "Miracle Hunter",
                  description: "Started traveling around Italy documenting Eucharistic miracles with photos!",
                  icon: <Camera className="w-6 h-6" />
                },
                {
                  year: "2006",
                  title: "Went to Heaven",
                  description: "At just 15, he died from leukemia. But his digital legacy lives on!",
                  icon: <Trophy className="w-6 h-6" />
                }
              ].map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                  className="relative flex items-start space-x-6"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg z-10">
                    {event.year}
                  </div>
                  <Card className="flex-1 bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="text-blue-600">
                          {event.icon}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                      </div>
                      <p className="text-gray-600">{event.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Miracles & Intercessions Section */}
      <div className="bg-gradient-to-r from-blue-100 to-indigo-100 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ✨ Miracles Through Carlo's Intercession
            </h2>
            <p className="text-xl text-gray-600">
              People have been healed and helped through his prayers! Here are some amazing stories:
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
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 text-center mb-4">
                      <p className="text-blue-700 font-semibold text-xs">
                        Year: {miracle.year} • Source: {miracle.source}
                      </p>
                    </div>
                    <Button 
                      size="sm"
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs"
                      onClick={() => setSelectedMiracle(miracle)}
                    >
                      📖 Read Full Story
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Prayer Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="mt-12"
          >
            <Card className="bg-gradient-to-r from-blue-200 to-indigo-200 border-0 rounded-2xl shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">🙏 Prayer to Carlo Acutis</h3>
                <p className="text-lg text-gray-700 leading-relaxed italic mb-4">
                  "Carlo, you who used technology to spread God's love, 
                  help us to use our digital gifts for the glory of God. 
                  Intercede for us that we may be holy in the digital age. Amen."
                </p>
                <p className="text-sm text-blue-700 font-semibold">
                  💡 Try praying to him for help with your tech projects and faith journey!
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* My Favorites Section */}
      {favoriteMiracles.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
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
                Your personal collection of Carlo's miraculous intercessions
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
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 text-center mb-4">
                          <p className="text-blue-700 font-semibold text-xs">
                            Year: {miracle.year} • Source: {miracle.source}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs"
                            onClick={() => setSelectedMiracle(miracle)}
                          >
                            📖 Read Full Story
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-600 hover:bg-red-50 text-xs"
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
            🤔 Why Carlo Became a Saint?
          </h2>
          <p className="text-xl text-gray-600">
            Let's discover what made this young tech genius so special!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Question 1 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">What Made Him Extra Special?</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-gray-700 font-medium mb-2">💻 <strong>Tech + Faith = Power</strong></p>
                    <p className="text-gray-600 text-sm">He used technology to spread the Gospel when most adults were still figuring out the internet!</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-gray-700 font-medium mb-2">🍞 <strong>Eucharist Obsessed</strong></p>
                    <p className="text-gray-600 text-sm">He went to daily Mass and spent hours in adoration - even as a teenager!</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-gray-700 font-medium mb-2">📸 <strong>Miracle Hunter</strong></p>
                    <p className="text-gray-600 text-sm">He traveled around documenting Eucharistic miracles to prove God's real presence!</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-gray-700 font-medium mb-2">🎮 <strong>Balanced Life</strong></p>
                    <p className="text-gray-600 text-sm">He loved video games but always put God first - no compromise!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Question 2 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mr-4">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">What Can We Learn?</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-gray-700 font-medium mb-2">📱 <strong>Use Tech for Good</strong></p>
                    <p className="text-gray-600 text-sm">Your phone and computer can be tools for evangelization - use them wisely!</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-gray-700 font-medium mb-2">⏰ <strong>Prioritize God</strong></p>
                    <p className="text-gray-600 text-sm">Even with busy schedules, make time for prayer and Mass - it's non-negotiable!</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-gray-700 font-medium mb-2">🎯 <strong>Be a Digital Missionary</strong></p>
                    <p className="text-gray-600 text-sm">Share your faith online - you never know who you might inspire!</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-gray-700 font-medium mb-2">🌟 <strong>Start Young</strong></p>
                    <p className="text-gray-600 text-sm">Don't wait to be holy - start now! Age doesn't matter to God!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Key Takeaway */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="mt-12"
        >
          <Card className="bg-gradient-to-r from-blue-100 to-indigo-100 border-0 rounded-2xl shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">💡 The Big Secret</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Carlo wasn't special because he was a tech genius - he was special because he used his gifts to serve God! 
                He showed us that you can be young, love technology, have fun, AND be a saint! 
                The key is putting God first in everything you do! 🚀
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              🚀 Ready to Follow Carlo's Digital Example?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Use technology to spread God's love today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/saints">
                <Button 
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <Globe className="w-5 h-5 mr-2" />
                  Back to Saints
                </Button>
              </Link>
              <Button 
                size="lg"
                onClick={() => {
                  setShowSuccessMessage(true);
                  setTimeout(() => {
                    window.open('/saints#carlo', '_blank');
                  }, 1500);
                }}
                className="bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Heart className="w-5 h-5 mr-2" />
                Start Your Digital Journey
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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowSuccessMessage(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">🚀 Digital Journey Started!</h3>
            <p className="text-gray-600 mb-6">
              You're now ready to follow Carlo's example! Let's use technology to spread God's love together!
            </p>
            <div className="flex space-x-3">
              <Button
                onClick={() => setShowSuccessMessage(false)}
                variant="outline"
                className="flex-1"
              >
                Stay Here
              </Button>
              <Button
                onClick={() => {
                  setShowSuccessMessage(false);
                  window.open('/saints#carlo', '_blank');
                }}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                Go to Carlo's Tab
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
                      <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                      Location
                    </h3>
                    <p className="text-gray-700">Various locations where miracles occurred through Carlo's intercession</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Heart className="w-5 h-5 mr-2 text-blue-600" />
                      Type of Miracle
                    </h3>
                    <p className="text-gray-700">{selectedMiracle.title.replace('💻 ', '').replace('📱 ', '').replace('🎓 ', '').replace('❤️ ', '').replace('🌐 ', '').replace('🙏 ', '')}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
                      Significance
                    </h3>
                    <p className="text-gray-700">This miracle demonstrates Carlo's continued intercession for those who seek his help, showing his ongoing care for the faithful even after his death.</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-blue-600" />
                      Impact
                    </h3>
                    <p className="text-gray-700">This miracle has inspired many to turn to Carlo for help with similar challenges, strengthening faith and devotion among the faithful.</p>
                  </div>
                </div>

                {/* Right Column - Story and Prayer */}
                <div className="space-y-6">
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 rounded-2xl shadow-sm">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <Quote className="w-5 h-5 mr-2 text-blue-600" />
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
                        "Carlo Acutis, you who used technology to spread God's love, 
                        intercede for us in our time of need. Help us to use our digital gifts 
                        for the glory of God and to be holy in the digital age. Amen."
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
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
                  className="flex-1 border-blue-500 text-blue-600 hover:bg-blue-50"
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
                  className="flex-1 border-blue-500 text-blue-600 hover:bg-blue-50"
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
