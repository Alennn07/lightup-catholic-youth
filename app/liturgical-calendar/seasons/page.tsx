"use client"

import { Navigation } from "@/components/navigation"
import { motion } from "framer-motion"
import { Calendar, Star, Clock, Heart, Cross, Crown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function LiturgicalSeasonsPage() {
  const seasons = [
    {
      name: "Advent",
      description: "A time of preparation and waiting for the coming of Christ",
      color: "from-purple-600 to-blue-600",
      duration: "4 weeks before Christmas",
      startDate: "Late November/Early December",
      endDate: "December 24",
      significance: "Preparation for Christmas, spiritual renewal, hope and anticipation",
      practices: ["Advent wreath", "Daily prayers", "Acts of charity", "Reflection on Christ's coming"],
      icon: Heart,
      category: "Preparation"
    },
    {
      name: "Christmas",
      description: "Celebration of the birth of Jesus Christ",
      color: "from-red-600 to-gold-500",
      duration: "December 25 - January 6",
      startDate: "December 25",
      endDate: "January 6 (Epiphany)",
      significance: "The Incarnation, God becoming human, joy and celebration",
      practices: ["Nativity scenes", "Christmas Mass", "Family gatherings", "Gift giving"],
      icon: Star,
      category: "Celebration"
    },
    {
      name: "Lent",
      description: "A penitential season of prayer, fasting, and almsgiving",
      color: "from-purple-600 to-gray-600",
      duration: "40 days before Easter",
      startDate: "Ash Wednesday",
      endDate: "Holy Thursday",
      significance: "Preparation for Easter, repentance, spiritual discipline",
      practices: ["Fasting", "Prayer", "Almsgiving", "Stations of the Cross", "Confession"],
      icon: Cross,
      category: "Penitential"
    },
    {
      name: "Easter",
      description: "The most important season celebrating Christ's resurrection",
      color: "from-gold-500 to-white-500",
      duration: "Easter Sunday - Pentecost",
      startDate: "Easter Sunday",
      endDate: "Pentecost Sunday",
      significance: "Christ's victory over death, new life, hope and joy",
      practices: ["Easter Mass", "Easter eggs", "Spring celebrations", "Joyful worship"],
      icon: Crown,
      category: "Celebration"
    },
    {
      name: "Ordinary Time",
      description: "Periods of growth and learning in the Christian life",
      color: "from-green-600 to-emerald-500",
      duration: "Two periods during the year",
      startDate: "After Epiphany and After Pentecost",
      endDate: "Before Advent and Before Lent",
      significance: "Growth in faith, learning, living out our baptismal call",
      practices: ["Regular Mass attendance", "Scripture study", "Service to others", "Faith formation"],
      icon: Calendar,
      category: "Growth"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Liturgical Seasons
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover the beautiful rhythm of the Catholic liturgical year and how each season 
            helps us grow closer to Christ throughout the year.
          </p>
        </motion.div>

        {/* Seasons Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seasons.map((season, index) => (
              <motion.div
                key={season.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${season.color} flex items-center justify-center`}>
                        <season.icon className="h-8 w-8 text-white" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {season.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl text-gray-800 mb-2">{season.name}</CardTitle>
                    <p className="text-gray-600 text-sm leading-relaxed">{season.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{season.duration}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p><strong>Significance:</strong> {season.significance}</p>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p><strong>Key Practices:</strong></p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        {season.practices.map((practice, idx) => (
                          <li key={idx} className="text-gray-500">{practice}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 shadow-xl">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                Live the Liturgical Year
              </h3>
              <p className="text-lg opacity-90 mb-6">
                Each liturgical season offers unique opportunities to grow in faith, 
                deepen your relationship with God, and experience the beauty of Catholic tradition.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => window.history.back()}
                  className="px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
                >
                  Back to Calendar
                </button>
                <button className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors duration-200">
                  Download Full Calendar
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
