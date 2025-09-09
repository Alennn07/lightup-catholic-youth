"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Mountain, 
  ArrowLeft, 
  Heart, 
  Users, 
  BookOpen, 
  Zap,
  Star,
  Quote,
  MapPin,
  Calendar,
  Trophy,
  Sparkles,
  Lightbulb
} from "lucide-react"
import Link from "next/link"

export default function PierGiorgioPage() {
  const [activeAdventure, setActiveAdventure] = useState(0)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const adventures = [
    {
      title: "🏔️ Mountain Climbing",
      description: "Pier Giorgio climbed over 100 peaks! His favorite was the Matterhorn.",
      funFact: "He once climbed 3 mountains in one day!",
      emoji: "⛰️"
    },
    {
      title: "🤝 Helping the Poor",
      description: "He secretly gave away his money and clothes to help those in need.",
      funFact: "His family only discovered this after he died!",
      emoji: "❤️"
    },
    {
      title: "🎓 University Life",
      description: "He studied engineering but spent more time helping others than studying.",
      funFact: "He failed some exams because he was too busy helping people!",
      emoji: "📚"
    },
    {
      title: "👥 Friend Squad",
      description: "He had tons of friends and was always organizing fun activities.",
      funFact: "He started a Catholic youth group called 'The Company of the Sacred Heart'!",
      emoji: "🎉"
    }
  ]

  const quotes = [
    "The higher we go, the better we hear the voice of Christ.",
    "I want to live, not just exist!",
    "To live without faith, without a heritage to defend, without battling for truth, is not living but existing.",
    "Jesus comes to me every morning in Holy Communion. I repay him in my very small way by visiting the poor."
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-green-300 rounded-full"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-emerald-300 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-teal-300 rounded-full"></div>
          <div className="absolute bottom-32 right-1/3 w-14 h-14 bg-green-400 rounded-full"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-12">
          {/* Back Button */}
          <Link href="/saints">
            <Button 
              variant="ghost" 
              className="mb-8 text-green-600 hover:text-green-700 hover:bg-green-100"
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
            <Card className="bg-gradient-to-br from-green-100 to-emerald-100 border-0 rounded-3xl shadow-2xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Photo Section */}
                <div className="relative h-80 lg:h-auto overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-no-repeat"
                    style={{
                      backgroundImage: `url('/saints/Photos/pier-giorgio-frassati.jpg')`,
                      backgroundPosition: 'center 19%'
                    }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  
                  {/* Floating Elements */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                    <Mountain className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                    <Heart className="w-6 h-6 text-red-500" />
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-4">
                      <Mountain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold text-gray-900">Pier Giorgio Frassati</h1>
                      <p className="text-green-600 font-semibold">1901 - 1925 • Verso l'alto!</p>
                    </div>
                  </div>
                  
                  <p className="text-xl text-gray-700 leading-relaxed mb-6">
                    Meet the coolest saint ever! 🎉 This guy was basically a Catholic influencer before social media existed. 
                    He climbed mountains, helped the poor, and had the best friend group ever!
                  </p>

                  <div className="flex flex-wrap gap-3 mb-6">
                    <span className="px-4 py-2 bg-green-200 text-green-800 rounded-full text-sm font-semibold flex items-center">
                      <Mountain className="w-4 h-4 mr-2" />
                      Mountain Climber
                    </span>
                    <span className="px-4 py-2 bg-blue-200 text-blue-800 rounded-full text-sm font-semibold flex items-center">
                      <Heart className="w-4 h-4 mr-2" />
                      Social Justice
                    </span>
                    <span className="px-4 py-2 bg-purple-200 text-purple-800 rounded-full text-sm font-semibold flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      Friend Magnet
                    </span>
                  </div>

                  <div className="bg-gradient-to-r from-green-200 to-emerald-200 rounded-2xl p-4">
                    <p className="text-green-800 font-medium italic text-center">
                      "I want to live, not just exist!" - Pier Giorgio
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Adventures Section */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            🎯 Pier Giorgio's Epic Adventures
          </h2>
          <p className="text-xl text-gray-600">
            This guy was basically a Catholic superhero! Here's what made him so awesome:
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adventures.map((adventure, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="group"
            >
              <Card 
                className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                onClick={() => setActiveAdventure(index)}
              >
                <CardContent className="p-6">
                  <div className="text-4xl mb-4 text-center">{adventure.emoji}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                    {adventure.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-center">
                    {adventure.description}
                  </p>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3">
                    <p className="text-green-700 font-semibold text-center text-sm">
                      💡 Fun Fact: {adventure.funFact}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quotes Section */}
      <div className="bg-gradient-to-r from-green-100 to-emerald-100 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              💬 Pier Giorgio's Wisdom
            </h2>
            <p className="text-xl text-gray-600">
              This guy had some seriously inspiring things to say!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quotes.map((quote, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              >
                <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
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
      </div>

      {/* Timeline Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            📅 Pier Giorgio's Life Timeline
          </h2>
          <p className="text-xl text-gray-600">
            From Turin to the mountains - his incredible journey!
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
          
          <div className="space-y-8">
            {[
              {
                year: "1901",
                title: "Born in Turin, Italy",
                description: "Pier Giorgio came into the world in a wealthy family, but he had a heart for the poor from the start!",
                icon: <Sparkles className="w-6 h-6" />
              },
              {
                year: "1918",
                title: "Started University",
                description: "He began studying engineering, but spent more time helping others than hitting the books!",
                icon: <BookOpen className="w-6 h-6" />
              },
              {
                year: "1922",
                title: "Founded Youth Group",
                description: "Created 'The Company of the Sacred Heart' - basically the coolest Catholic friend group ever!",
                icon: <Users className="w-6 h-6" />
              },
              {
                year: "1925",
                title: "Went to Heaven",
                description: "At just 24, he died from polio. But his legacy lives on as the patron of youth and students!",
                icon: <Trophy className="w-6 h-6" />
              }
            ].map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                className="relative flex items-start space-x-6"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg z-10">
                  {event.year}
                </div>
                <Card className="flex-1 bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="text-green-600">
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

      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            🤔 Why Pier Giorgio Became a Saint?
          </h2>
          <p className="text-xl text-gray-600">
            Let's discover what made him so special and what we can learn!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Question 1 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-4">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">What Made Him Extra Special?</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-gray-700 font-medium mb-2">🏔️ <strong>Ordinary Life, Extraordinary Love</strong></p>
                    <p className="text-gray-600 text-sm">He wasn't a priest or monk - just a regular university student who loved God with his whole heart!</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-gray-700 font-medium mb-2">❤️ <strong>Secret Service</strong></p>
                    <p className="text-gray-600 text-sm">He secretly helped the poor every day, giving away his money and clothes without anyone knowing!</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-gray-700 font-medium mb-2">🎯 <strong>Daily Mass & Prayer</strong></p>
                    <p className="text-gray-600 text-sm">He never missed daily Mass and spent hours in prayer, even with his busy social life!</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-gray-700 font-medium mb-2">👥 <strong>Influenced Everyone</strong></p>
                    <p className="text-gray-600 text-sm">His friends said being around him made them want to be better people!</p>
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
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">What Can We Learn?</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-gray-700 font-medium mb-2">🌅 <strong>Start Your Day Right</strong></p>
                    <p className="text-gray-600 text-sm">Begin each day with prayer and Mass - it sets the tone for everything else!</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-gray-700 font-medium mb-2">🤝 <strong>Help Others Secretly</strong></p>
                    <p className="text-gray-600 text-sm">Do good deeds without expecting recognition - true charity is quiet!</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-gray-700 font-medium mb-2">🎉 <strong>Have Fun & Be Holy</strong></p>
                    <p className="text-gray-600 text-sm">You can enjoy life, have friends, and still be close to God - they're not opposites!</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-gray-700 font-medium mb-2">⛰️ <strong>Keep Climbing Higher</strong></p>
                    <p className="text-gray-600 text-sm">Always strive to be better - "Verso l'alto" means never settling for mediocrity!</p>
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
          <Card className="bg-gradient-to-r from-green-100 to-emerald-100 border-0 rounded-2xl shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">💡 The Big Secret</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Pier Giorgio wasn't special because he was perfect - he was special because he <strong>tried every day</strong> to be better! 
                He showed us that holiness isn't about being extraordinary, it's about loving God and others in ordinary ways, 
                but with extraordinary dedication! 🌟
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              🚀 Ready to Follow Pier Giorgio's Example?
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Start your own "Verso l'alto" journey today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/saints">
                <Button 
                  size="lg"
                  className="bg-white text-green-600 hover:bg-green-50 font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <Mountain className="w-5 h-5 mr-2" />
                  Back to Saints
                </Button>
              </Link>
              <Button 
                size="lg"
                onClick={() => {
                  setShowSuccessMessage(true);
                  setTimeout(() => {
                    window.open('/saints#pier', '_blank');
                  }, 1500);
                }}
                className="bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-green-600 font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Heart className="w-5 h-5 mr-2" />
                Start Your Journey
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
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mountain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">🚀 Journey Started!</h3>
            <p className="text-gray-600 mb-6">
              You're now ready to follow Pier Giorgio's example! Let's start climbing towards holiness together!
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
                  window.open('/saints#pier', '_blank');
                }}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                Go to Progress Tracker
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
