"use client"

import { useState } from "react"
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
  Smartphone
} from "lucide-react"
import Link from "next/link"

export default function CarloAcutisPage() {
  const [activeTech, setActiveTech] = useState(0)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

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

  const miracles = [
    {
      name: "Lanciano Miracle",
      year: "8th Century",
      description: "Bread and wine became actual flesh and blood",
      emoji: "🍞➡️❤️"
    },
    {
      name: "Buenos Aires Miracle",
      year: "1996",
      description: "Host turned into human heart tissue",
      emoji: "❤️‍🩹"
    },
    {
      name: "Tixtla Miracle",
      year: "2006",
      description: "Blood appeared on a host during Mass",
      emoji: "🩸"
    },
    {
      name: "Sokolka Miracle",
      year: "2008",
      description: "Host showed signs of heart muscle tissue",
      emoji: "💓"
    }
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
                      backgroundImage: `url('/saints/Photos/carlo-acutis.jpg')`,
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
                    <h3 className="font-bold text-gray-900 mb-2">{miracle.name}</h3>
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
    </div>
  )
}
