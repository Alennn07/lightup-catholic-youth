"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Map, Info, ChevronLeft, ChevronRight, BookOpen, Church } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type LiturgicalDay = {
  date: Date
  season: "ordinary" | "advent" | "christmas" | "lent" | "easter" | "pentecost" | "triduum"
  seasonWeek?: string
  feast: string | null
  feastRank: "solemnity" | "feast" | "memorial" | "optional" | null
  saint: string | null
  saintInfo?: string | null
  readings: {
    first: string
    psalm: string
    second: string | null
    gospel: string
  }
  color: "green" | "purple" | "white" | "red" | "rose" | "gold"
  description: string | null
  prayers?: string | null
  traditions?: string | null
}

const seasonColors = {
  ordinary: "bg-green-100 text-green-800 border-green-200",
  advent: "bg-purple-100 text-purple-800 border-purple-200",
  christmas: "bg-gold-100 text-amber-800 border-amber-200",
  lent: "bg-violet-100 text-violet-800 border-violet-200",
  easter: "bg-white text-yellow-600 border-yellow-300",
  pentecost: "bg-red-100 text-red-800 border-red-200",
  triduum: "bg-black text-white border-gray-700",
}

const seasonNames = {
  ordinary: "Ordinary Time",
  advent: "Advent",
  christmas: "Christmas",
  lent: "Lent",
  easter: "Easter",
  pentecost: "Pentecost",
  triduum: "Sacred Triduum",
}

const feastRankColors = {
  solemnity: "bg-gold-100 text-amber-800 border-amber-200",
  feast: "bg-white text-gray-800 border-gray-200",
  memorial: "bg-blue-100 text-blue-800 border-blue-200",
  optional: "bg-gray-100 text-gray-800 border-gray-200",
}

const feastRankNames = {
  solemnity: "Solemnity",
  feast: "Feast",
  memorial: "Memorial",
  optional: "Optional Memorial",
}

const liturgicalColors = {
  green: { name: "Green", class: "bg-green-500" },
  purple: { name: "Purple", class: "bg-purple-500" },
  white: { name: "White", class: "bg-gray-100" },
  red: { name: "Red", class: "bg-red-500" },
  rose: { name: "Rose", class: "bg-pink-400" },
  gold: { name: "Gold", class: "bg-amber-400" },
}

// Generate a more comprehensive liturgical calendar
const generateLiturgicalCalendar = (): LiturgicalDay[] => {
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  // This is a simplified example - in a real app, this would be based on the actual liturgical calendar
  const liturgicalDays: LiturgicalDay[] = [
    {
      date: new Date(currentYear, currentMonth, 1),
      season: "ordinary",
      seasonWeek: "9th Week in Ordinary Time",
      feast: null,
      feastRank: null,
      saint: "St. Joseph the Worker",
      saintInfo: "Foster father of Jesus and husband of Mary. Patron of workers and the Universal Church.",
      readings: {
        first: "Acts 15:22-31",
        psalm: "Psalm 57:8-12",
        second: null,
        gospel: "John 15:12-17",
      },
      color: "white",
      description: "Optional Memorial of St. Joseph the Worker",
      prayers:
        "Prayer to St. Joseph the Worker: O Glorious Saint Joseph, model of all who labor, obtain for me the grace to work in the spirit of penance in expiation of my many sins...",
      traditions: "Blessing of tools and workplaces, special prayers for workers and those seeking employment.",
    },
    {
      date: new Date(currentYear, currentMonth, 3),
      season: "easter",
      seasonWeek: "5th Week of Easter",
      feast: "Feast of Saints Philip and James, Apostles",
      feastRank: "feast",
      saint: null,
      readings: {
        first: "1 Corinthians 15:1-8",
        psalm: "Psalm 19:2-5",
        second: null,
        gospel: "John 14:6-14",
      },
      color: "red",
      description: "Feast of Saints Philip and James, Apostles",
      prayers:
        "O God, who gladden us each year with the feast day of the Apostles Philip and James, grant us, through their prayers, a share in the Passion and Resurrection of your Only Begotten Son...",
      traditions: "In some countries, this day is celebrated with special processions and the blessing of new crops.",
    },
    {
      date: new Date(currentYear, currentMonth, 13),
      season: "ordinary",
      seasonWeek: "11th Week in Ordinary Time",
      feast: null,
      feastRank: "optional",
      saint: "Our Lady of Fatima",
      saintInfo:
        "Commemorates the apparitions of the Blessed Virgin Mary to three shepherd children in Fatima, Portugal in 1917.",
      readings: {
        first: "Acts 18:23-28",
        psalm: "Psalm 47:2-3, 8-10",
        second: null,
        gospel: "John 16:23-28",
      },
      color: "white",
      description: "Optional Memorial of Our Lady of Fatima",
      prayers:
        "O God, who chose the Mother of your Son to be our Mother also, grant us that, persevering in penance and prayer for the salvation of the world, we may further more effectively each day the reign of Christ...",
      traditions:
        "Processions with the statue of Our Lady of Fatima, recitation of the Rosary, and candlelight vigils.",
    },
    {
      date: new Date(currentYear, currentMonth, 14),
      season: "ordinary",
      seasonWeek: "11th Week in Ordinary Time",
      feast: "Saint Matthias, Apostle",
      feastRank: "feast",
      saint: null,
      readings: {
        first: "Acts 1:15-17, 20-26",
        psalm: "Psalm 113:1-8",
        second: null,
        gospel: "John 15:9-17",
      },
      color: "red",
      description: "Feast of Saint Matthias, Apostle",
      prayers:
        "O God, who assigned Saint Matthias a place in the college of Apostles, grant us, through his intercession, that, rejoicing at how your love has been allotted to us, we may merit to be numbered among the elect...",
      traditions:
        "In some Eastern European countries, this day is associated with predictions about the weather and harvest.",
    },
    {
      date: new Date(currentYear, currentMonth, 15),
      season: "ordinary",
      seasonWeek: "11th Week in Ordinary Time",
      feast: null,
      feastRank: "optional",
      saint: "St. Isidore the Farmer",
      saintInfo:
        "Patron saint of farmers, day laborers, and rural communities. Known for his piety and generosity to the poor.",
      readings: {
        first: "James 5:7-10",
        psalm: "Psalm 37:3-4, 5-6, 30-31",
        second: null,
        gospel: "Matthew 22:34-40",
      },
      color: "white",
      description: "Optional Memorial of St. Isidore the Farmer",
      prayers:
        "Lord God, to whom belongs all creation, and who call us to serve you by caring for the gifts that surround us, inspire us by the example of Saint Isidore to share our food with the hungry...",
      traditions: "Blessing of fields and crops, processions through farmlands, and special prayers for good harvests.",
    },
    {
      date: new Date(currentYear, currentMonth, 22),
      season: "ordinary",
      seasonWeek: "12th Week in Ordinary Time",
      feast: "Saint Rita of Cascia",
      feastRank: "optional",
      saint: "St. Rita of Cascia",
      saintInfo:
        "Patron saint of impossible causes, abused wives, and widows. Known for her patience and devotion through difficult circumstances.",
      readings: {
        first: "Philippians 4:4-7",
        psalm: "Psalm 34:2-3, 4-5, 6-7, 8-9, 10-11",
        second: null,
        gospel: "Matthew 5:1-12a",
      },
      color: "white",
      description: "Optional Memorial of Saint Rita of Cascia, Religious",
      prayers:
        "Bestow on us, we pray, O Lord, the wisdom and strength of the Cross, with which you were pleased to endow Saint Rita, so that, suffering in every tribulation with Christ, we may participate ever more deeply in his Paschal Mystery...",
      traditions:
        "Blessing and distribution of roses, as St. Rita is often depicted with roses. Many pray to her for impossible causes.",
    },
    {
      date: new Date(currentYear, currentMonth, 25),
      season: "ordinary",
      seasonWeek: "12th Week in Ordinary Time",
      feast: "Saint Bede the Venerable",
      feastRank: "optional",
      saint: "St. Bede the Venerable",
      saintInfo:
        "Benedictine monk known as 'The Father of English History' for his Ecclesiastical History of the English People.",
      readings: {
        first: "1 Corinthians 2:10b-16",
        psalm: "Psalm 119:9-14",
        second: null,
        gospel: "Matthew 7:21-29",
      },
      color: "white",
      description: "Optional Memorial of Saint Bede the Venerable, Priest and Doctor of the Church",
      prayers:
        "O God, who bring light to your Church through the learning of Saint Bede, mercifully grant that your servants may always be enlightened by his wisdom and helped by his merits...",
      traditions:
        "Special prayers for scholars, historians, and teachers. In some places, educational institutions hold special events.",
    },
    {
      date: new Date(currentYear, currentMonth, 31),
      season: "ordinary",
      seasonWeek: "13th Week in Ordinary Time",
      feast: "The Visitation of the Blessed Virgin Mary",
      feastRank: "feast",
      saint: null,
      readings: {
        first: "Zephaniah 3:14-18",
        psalm: "Isaiah 12:2-6",
        second: null,
        gospel: "Luke 1:39-56",
      },
      color: "white",
      description: "Feast of the Visitation of the Blessed Virgin Mary",
      prayers:
        "Almighty ever-living God, who, while the Blessed Virgin Mary was carrying your Son in her womb, inspired her to visit Elizabeth, grant us, we pray, that, faithful to the promptings of the Spirit, we may magnify your greatness with the Virgin Mary at all times...",
      traditions:
        "Processions honoring Mary, praying the Magnificat, and in some places, blessing of expectant mothers.",
    },
  ]

  return liturgicalDays
}

export default function LiturgicalCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [liturgicalDays] = useState<LiturgicalDay[]>(generateLiturgicalCalendar())
  const [activeTab, setActiveTab] = useState("calendar")
  const { toast } = useToast()

  const selectedDay = date
    ? liturgicalDays.find(
        (day) =>
          day.date.getDate() === date.getDate() &&
          day.date.getMonth() === date.getMonth() &&
          day.date.getFullYear() === date.getFullYear(),
      )
    : null

  // Function to highlight special liturgical days
  const isSpecialDay = (day: Date) => {
    return liturgicalDays.some(
      (liturgicalDay) =>
        liturgicalDay.date.getDate() === day.getDate() &&
        liturgicalDay.date.getMonth() === day.getMonth() &&
        liturgicalDay.date.getFullYear() === day.getFullYear(),
    )
  }

  // Get the current liturgical season (simplified for example)
  const getCurrentSeason = (): "ordinary" | "advent" | "christmas" | "lent" | "easter" | "pentecost" | "triduum" => {
    const month = new Date().getMonth()
    const day = new Date().getDate()

    // This is a simplified example - in a real app, this would be based on the actual liturgical calendar
    if (month === 11 && day > 15) return "advent" // Late December
    if (month === 11 || month === 0) return "christmas" // December-January
    if (month >= 1 && month <= 2) return "ordinary" // February-March
    if (month === 3) return "lent" // April
    if (month >= 4 && month <= 5) return "easter" // May-June
    if (month === 5) return "pentecost" // June
    if (month >= 6 && month <= 10) return "ordinary" // July-November

    return "ordinary"
  }

  const currentSeason = getCurrentSeason()

  const handleAddToCalendar = () => {
    if (!selectedDay) return

    toast({
      title: "Added to Calendar",
      description: `${selectedDay.feast || selectedDay.saint || "Liturgical day"} has been added to your calendar.`,
      variant: "default",
    })
  }

  const handleShareDay = () => {
    if (!selectedDay) return

    toast({
      title: "Sharing Options",
      description: "Share options would appear here in a real implementation.",
      variant: "default",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-purple-800 flex items-center gap-2">
          <Map className="h-6 w-6" />
          Liturgical Calendar
        </h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="seasons">Liturgical Seasons</TabsTrigger>
          <TabsTrigger value="colors">Liturgical Colors</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="border-purple-100">
                <CardHeader>
                  <CardTitle className="text-lg">Calendar</CardTitle>
                  <CardDescription>Select a date to view liturgical information</CardDescription>
                </CardHeader>
                <CardContent className="pb-0">
                  <div className="space-y-4">
                    <div className={`p-4 rounded-md ${seasonColors[currentSeason]}`}>
                      <h3 className="font-medium mb-1">Current Season</h3>
                      <p>{seasonNames[currentSeason]}</p>
                    </div>

                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border"
                      modifiers={{
                        special: (date) => isSpecialDay(date),
                      }}
                      modifiersStyles={{
                        special: {
                          fontWeight: "bold",
                          textDecoration: "underline",
                          color: "#9333ea",
                        },
                      }}
                    />

                    <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-purple-200"></div>
                        <span>Feast/Saint Day</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span>Selected</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card className="border-purple-100 h-full">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {date
                        ? date.toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Liturgical Information"}
                    </CardTitle>
                    <CardDescription>
                      {selectedDay
                        ? selectedDay.feast || selectedDay.saint || "Ordinary Time"
                        : "Select a date to view details"}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        if (date) {
                          const newDate = new Date(date)
                          newDate.setDate(newDate.getDate() - 1)
                          setDate(newDate)
                        }
                      }}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        if (date) {
                          const newDate = new Date(date)
                          newDate.setDate(newDate.getDate() + 1)
                          setDate(newDate)
                        }
                      }}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {selectedDay ? (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            selectedDay.color === "green"
                              ? "bg-green-100 text-green-800"
                              : selectedDay.color === "purple"
                                ? "bg-purple-100 text-purple-800"
                                : selectedDay.color === "red"
                                  ? "bg-red-100 text-red-800"
                                  : selectedDay.color === "white"
                                    ? "bg-gray-100 text-gray-800"
                                    : selectedDay.color === "rose"
                                      ? "bg-pink-100 text-pink-800"
                                      : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          <span className="text-2xl font-bold">{date?.getDate()}</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-lg">
                            {selectedDay.feast || selectedDay.saint || "Ordinary Time"}
                          </h3>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <Badge className={`${seasonColors[selectedDay.season]}`}>
                              {seasonNames[selectedDay.season]}
                            </Badge>
                            {selectedDay.feastRank && (
                              <Badge className={`${feastRankColors[selectedDay.feastRank]}`}>
                                {feastRankNames[selectedDay.feastRank]}
                              </Badge>
                            )}
                            <Badge
                              variant="outline"
                              className={`border-${selectedDay.color}-300 bg-${selectedDay.color}-50 text-${selectedDay.color}-800`}
                            >
                              {liturgicalColors[selectedDay.color].name} Vestments
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {selectedDay.seasonWeek && (
                        <div className="bg-blue-50 p-4 rounded-md">
                          <p className="text-blue-800 font-medium">{selectedDay.seasonWeek}</p>
                        </div>
                      )}

                      {selectedDay.description && (
                        <div className="bg-purple-50 p-4 rounded-md">
                          <div className="flex items-start gap-2">
                            <Info className="h-5 w-5 text-purple-600 mt-0.5" />
                            <p className="text-purple-800">{selectedDay.description}</p>
                          </div>
                        </div>
                      )}

                      {selectedDay.saintInfo && (
                        <div>
                          <h3 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                            <Church className="h-5 w-5" />
                            About {selectedDay.saint}
                          </h3>
                          <p className="text-gray-700">{selectedDay.saintInfo}</p>
                        </div>
                      )}

                      <div>
                        <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                          <BookOpen className="h-5 w-5" />
                          Today's Readings
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-500">First Reading</p>
                            <p className="font-medium">{selectedDay.readings.first}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Responsorial Psalm</p>
                            <p className="font-medium">{selectedDay.readings.psalm}</p>
                          </div>
                          {selectedDay.readings.second && (
                            <div>
                              <p className="text-sm text-gray-500">Second Reading</p>
                              <p className="font-medium">{selectedDay.readings.second}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-sm text-gray-500">Gospel</p>
                            <p className="font-medium">{selectedDay.readings.gospel}</p>
                          </div>
                        </div>
                      </div>

                \
