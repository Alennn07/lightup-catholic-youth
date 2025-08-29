"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, Star, Clock, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface LiturgicalEvent {
  id: string
  name: string
  date: string
  season: string
  color: string
  description: string
  isFeast: boolean
  category: "season" | "feast" | "memorial"
}

export default function LiturgicalCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentSeason, setCurrentSeason] = useState("")
  const [upcomingEvents, setUpcomingEvents] = useState<LiturgicalEvent[]>([])

  useEffect(() => {
    // Generate a more comprehensive liturgical calendar
    generateLiturgicalCalendar()
  }, [])

  const generateLiturgicalCalendar = () => {
    // This is a simplified example - in a real app, this would be based on the actual liturgical calendar
    const events: LiturgicalEvent[] = [
      // Advent Season
      {
        id: "advent-1",
        name: "First Sunday of Advent",
        date: "December 1",
        season: "Advent",
        color: "from-purple-600 to-blue-600",
        description: "The beginning of the liturgical year and preparation for Christmas",
        isFeast: false,
        category: "season"
      },
      {
        id: "advent-2",
        name: "Immaculate Conception",
        date: "December 8",
        season: "Advent",
        color: "from-blue-500 to-purple-500",
        description: "Solemnity of the Immaculate Conception of the Blessed Virgin Mary",
        isFeast: true,
        category: "feast"
      },
      {
        id: "advent-3",
        name: "Gaudete Sunday",
        date: "December 15",
        season: "Advent",
        color: "from-pink-500 to-rose-500",
        description: "Third Sunday of Advent - Rejoice!",
        isFeast: false,
        category: "season"
      },
      {
        id: "advent-4",
        name: "Christmas Eve",
        date: "December 24",
        season: "Advent",
        color: "from-purple-600 to-blue-600",
        description: "Vigil of the Nativity of the Lord",
        isFeast: false,
        category: "season"
      },
      // Christmas Season
      {
        id: "christmas",
        name: "Christmas Day",
        date: "December 25",
        season: "Christmas",
        color: "from-red-600 to-gold-500",
        description: "The Nativity of Our Lord Jesus Christ",
        isFeast: true,
        category: "feast"
      },
      {
        id: "holy-family",
        name: "Feast of the Holy Family",
        date: "December 29",
        season: "Christmas",
        color: "from-blue-500 to-cyan-500",
        description: "Celebration of Jesus, Mary, and Joseph as a family",
        isFeast: true,
        category: "feast"
      },
      {
        id: "epiphany",
        name: "Epiphany of the Lord",
        date: "January 6",
        season: "Christmas",
        color: "from-gold-500 to-yellow-500",
        description: "The manifestation of Christ to the Magi",
        isFeast: true,
        category: "feast"
      },
      // Lenten Season
      {
        id: "ash-wednesday",
        name: "Ash Wednesday",
        date: "February 14",
        season: "Lent",
        color: "from-gray-600 to-purple-600",
        description: "Beginning of the penitential season of Lent",
        isFeast: false,
        category: "season"
      },
      {
        id: "palm-sunday",
        name: "Palm Sunday",
        date: "March 24",
        season: "Lent",
        color: "from-green-600 to-red-600",
        description: "Commemoration of Jesus' triumphal entry into Jerusalem",
        isFeast: false,
        category: "season"
      },
      {
        id: "holy-thursday",
        name: "Holy Thursday",
        date: "March 28",
        season: "Lent",
        color: "from-white-500 to-gold-500",
        description: "The Last Supper and institution of the Eucharist",
        isFeast: false,
        category: "season"
      },
      {
        id: "good-friday",
        name: "Good Friday",
        date: "March 29",
        season: "Lent",
        color: "from-red-600 to-black-600",
        description: "Commemoration of the Passion and Death of Christ",
        isFeast: false,
        category: "season"
      },
      {
        id: "easter",
        name: "Easter Sunday",
        date: "March 31",
        season: "Easter",
        color: "from-gold-500 to-white-500",
        description: "The Resurrection of Our Lord Jesus Christ",
        isFeast: true,
        category: "feast"
      },
      // Easter Season
      {
        id: "divine-mercy",
        name: "Divine Mercy Sunday",
        date: "April 7",
        season: "Easter",
        color: "from-blue-500 to-purple-500",
        description: "Second Sunday of Easter - Divine Mercy",
        isFeast: false,
        category: "season"
      },
      {
        id: "ascension",
        name: "Ascension of the Lord",
        date: "May 9",
        season: "Easter",
        color: "from-white-500 to-gold-500",
        description: "Christ's ascension into heaven",
        isFeast: true,
        category: "feast"
      },
      {
        id: "pentecost",
        name: "Pentecost Sunday",
        date: "May 19",
        season: "Easter",
        color: "from-red-500 to-orange-500",
        description: "The descent of the Holy Spirit upon the Apostles",
        isFeast: true,
        category: "feast"
      },
      // Ordinary Time
      {
        id: "trinity-sunday",
        name: "Trinity Sunday",
        date: "May 26",
        season: "Ordinary Time",
        color: "from-white-500 to-gold-500",
        description: "Celebration of the Holy Trinity",
        isFeast: true,
        category: "feast"
      },
      {
        id: "corpus-christi",
        name: "Corpus Christi",
        date: "May 30",
        season: "Ordinary Time",
        color: "from-gold-500 to-white-500",
        description: "Solemnity of the Most Holy Body and Blood of Christ",
        isFeast: true,
        category: "feast"
      },
      {
        id: "sacred-heart",
        name: "Sacred Heart of Jesus",
        date: "June 7",
        season: "Ordinary Time",
        color: "from-red-500 to-pink-500",
        description: "Devotion to the Sacred Heart of Jesus",
        isFeast: true,
        category: "feast"
      },
      {
        id: "assumption",
        name: "Assumption of Mary",
        date: "August 15",
        season: "Ordinary Time",
        color: "from-blue-500 to-white-500",
        description: "The bodily assumption of the Blessed Virgin Mary into heaven",
        isFeast: true,
        category: "feast"
      },
      {
        id: "all-saints",
        name: "All Saints' Day",
        date: "November 1",
        season: "Ordinary Time",
        color: "from-white-500 to-gold-500",
        description: "Celebration of all the saints in heaven",
        isFeast: true,
        category: "feast"
      },
      {
        id: "christ-king",
        name: "Christ the King",
        date: "November 24",
        season: "Ordinary Time",
        color: "from-gold-500 to-white-500",
        description: "Solemnity of Our Lord Jesus Christ, King of the Universe",
        isFeast: true,
        category: "feast"
      }
    ]

    // Filter upcoming events (next 30 days)
    const today = new Date()
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000))
    
    const upcoming = events.filter(event => {
      const eventDate = new Date(event.date + ", " + today.getFullYear())
      return eventDate >= today && eventDate <= thirtyDaysFromNow
    }).sort((a, b) => new Date(a.date + ", " + today.getFullYear()).getTime() - new Date(b.date + ", " + today.getFullYear()).getTime())

    setUpcomingEvents(upcoming.slice(0, 6))

    // Determine current season
    const currentMonth = today.getMonth() + 1
    const currentDay = today.getDate()
    
    if ((currentMonth === 12 && currentDay >= 1) || (currentMonth === 1 && currentDay <= 6)) {
      setCurrentSeason("Christmas")
    } else if (currentMonth === 2 || currentMonth === 3 || currentMonth === 4) {
      setCurrentSeason("Lent/Easter")
    } else if (currentMonth === 5 || currentMonth === 6) {
      setCurrentSeason("Easter")
    } else if (currentMonth === 11 || currentMonth === 12) {
      setCurrentSeason("Advent")
    } else {
      setCurrentSeason("Ordinary Time")
    }
  }

  const getSeasonColor = (season: string) => {
    switch (season.toLowerCase()) {
      case "advent": return "from-purple-600 to-blue-600"
      case "christmas": return "from-red-600 to-gold-500"
      case "lent": return "from-purple-600 to-gray-600"
      case "easter": return "from-gold-500 to-white-500"
      case "ordinary time": return "from-green-600 to-emerald-500"
      default: return "from-gray-500 to-slate-500"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Calendar className="h-12 w-12 text-purple-600 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              Liturgical Calendar
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Follow the Church's liturgical seasons and feast days. Stay connected to the rhythm of the Catholic liturgical year.
          </p>
        </motion.div>

        {/* Current Season */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <Star className="h-8 w-8 mr-3" />
                <h2 className="text-2xl font-bold">Current Liturgical Season</h2>
              </div>
              <div className="text-4xl font-bold mb-2">{currentSeason}</div>
              <p className="text-lg opacity-90">
                {currentDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            Upcoming Liturgical Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-0">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge 
                        variant={event.isFeast ? "default" : "secondary"}
                        className={`${
                          event.isFeast 
                            ? "bg-gradient-to-r from-gold-500 to-yellow-500 text-white" 
                            : "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                        }`}
                      >
                        {event.isFeast ? "Feast" : "Season"}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {event.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg text-gray-800">{event.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{event.season}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Liturgical Seasons Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            Understanding Liturgical Seasons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Advent",
                description: "A time of preparation and waiting for the coming of Christ",
                color: "from-purple-600 to-blue-600",
                duration: "4 weeks before Christmas"
              },
              {
                name: "Christmas",
                description: "Celebration of the birth of Jesus Christ",
                color: "from-red-600 to-gold-500",
                duration: "December 25 - January 6"
              },
              {
                name: "Lent",
                description: "A penitential season of prayer, fasting, and almsgiving",
                color: "from-purple-600 to-gray-600",
                duration: "40 days before Easter"
              },
              {
                name: "Easter",
                description: "The most important season celebrating Christ's resurrection",
                color: "from-gold-500 to-white-500",
                duration: "Easter Sunday - Pentecost"
              },
              {
                name: "Ordinary Time",
                description: "Periods of growth and learning in the Christian life",
                color: "from-green-600 to-emerald-500",
                duration: "Two periods during the year"
              }
            ].map((season, index) => (
              <motion.div
                key={season.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="h-full border-0 shadow-md">
                  <CardHeader>
                    <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${season.color} mb-3`}></div>
                    <CardTitle className="text-xl text-gray-800">{season.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-3">{season.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{season.duration}</span>
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
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 shadow-xl">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                Stay Connected to the Liturgical Year
              </h3>
              <p className="text-lg opacity-90 mb-6">
                The liturgical calendar helps us journey through the year with Christ, 
                celebrating His life, death, and resurrection in the rhythm of the seasons.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
                  Learn More About Seasons
                </button>
                <button className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors duration-200">
                  Download Calendar
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
