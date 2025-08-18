"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FeatureCard from "@/components/feature-card"
import { FeatureComparison } from "@/components/feature-comparison"
import {
  Search,
  Users,
  Star,
  BookOpen,
  Heart,
  Calendar,
  BrainCircuit,
  Music,
  Church,
  PenTool,
  Award,
  Camera,
} from "lucide-react"

const categories = ["All", "Spiritual", "Community", "Guidance", "Events", "Worship", "Education"]

const featuresData = [
  {
    id: "daily-bible-verse",
    name: "Daily Bible Verse",
    description: "Start each day with inspiring scripture and thoughtful reflections tailored for young Catholics.",
    icon: BookOpen,
    color: "from-blue-500 to-cyan-500",
    userCount: 12500,
    rating: 4.9,
    category: "Spiritual",
    href: "/dashboard#bible-verse",
  },
  {
    id: "prayer-wall",
    name: "Prayer Wall",
    description: "Share prayer requests and pray for others in your Catholic youth community worldwide.",
    icon: Heart,
    color: "from-red-500 to-pink-500",
    userCount: 8900,
    rating: 4.8,
    category: "Community",
    href: "/dashboard#prayer-wall",
  },
  {
    id: "youth-group-finder",
    name: "Youth Group Finder",
    description: "Discover and connect with Catholic youth groups in your area and join local communities.",
    icon: Users,
    color: "from-green-500 to-emerald-500",
    userCount: 6700,
    rating: 4.7,
    category: "Community",
    href: "/dashboard#youth-groups",
  },
  {
    id: "parish-calendar",
    name: "Parish Calendar",
    description: "Stay updated with parish events, masses, and special celebrations in your local area.",
    icon: Calendar,
    color: "from-purple-500 to-violet-500",
    userCount: 5400,
    rating: 4.6,
    category: "Events",
    href: "/dashboard#parish-calendar",
  },
  {
    id: "faithbot-ai",
    name: "FaithBot AI",
    description: "Get instant answers to Catholic faith questions from our intelligent AI assistant.",
    icon: BrainCircuit,
    color: "from-orange-500 to-amber-500",
    userCount: 9200,
    rating: 4.8,
    category: "Guidance",
    href: "/dashboard#faithbot",
  },
  {
    id: "worship-songs",
    name: "Worship Songs",
    description: "Access a comprehensive library of Catholic worship songs and hymns for personal prayer.",
    icon: Music,
    color: "from-indigo-500 to-blue-500",
    userCount: 4300,
    rating: 4.5,
    category: "Worship",
    href: "/dashboard#worship-songs",
  },
  {
    id: "liturgical-calendar",
    name: "Liturgical Calendar",
    description: "Follow the Catholic liturgical year with daily readings, saints, and seasonal information.",
    icon: Church,
    color: "from-teal-500 to-cyan-500",
    userCount: 7800,
    rating: 4.7,
    category: "Spiritual",
    href: "/dashboard#liturgical-calendar",
  },
  {
    id: "faith-journal",
    name: "Faith Journal",
    description: "Document your spiritual journey with private reflections and prayer experiences.",
    icon: PenTool,
    color: "from-pink-500 to-rose-500",
    userCount: 3600,
    rating: 4.6,
    category: "Spiritual",
    href: "/dashboard#faith-journal",
  },
  {
    id: "faith-challenge",
    name: "Faith Challenge",
    description: "Test your knowledge of the Catholic faith with fun, interactive quizzes across multiple categories.",
    icon: Award,
    color: "from-yellow-500 to-orange-500",
    userCount: 2800,
    rating: 4.4,
    category: "Education",
    href: "/dashboard#faith-quiz",
  },
  {
    id: "verse-snap",
    name: "Verse Snap Generator",
    description: "Create beautiful, shareable images with Bible verses and inspirational quotes.",
    icon: Camera,
    color: "from-violet-500 to-purple-500",
    userCount: 5100,
    rating: 4.5,
    category: "Spiritual",
    href: "/dashboard#verse-snap",
  },
]

export default function FeaturesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [activeTab, setActiveTab] = useState("features")

  const filteredFeatures = useMemo(() => {
    return featuresData.filter((feature) => {
      const matchesSearch =
        feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feature.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "All" || feature.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  const totalUsers = featuresData.reduce((sum, feature) => sum + (feature.userCount || 0), 0)
  const averageRating = featuresData.reduce((sum, feature) => sum + (feature.rating || 0), 0) / featuresData.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
              <Star className="h-3 w-3 mr-1" />
              All Features
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Discover Every{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Feature
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Explore our comprehensive suite of tools designed specifically for Catholic youth to grow in faith and
              community.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-white/80 backdrop-blur-sm border-0">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{featuresData.length}</div>
                  <div className="text-gray-600">Total Features</div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border-0">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">{totalUsers.toLocaleString()}</div>
                  <div className="text-gray-600">Active Users</div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border-0">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{averageRating.toFixed(1)}</div>
                  <div className="text-gray-600">Average Rating</div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="features">Our Features</TabsTrigger>
              <TabsTrigger value="comparison">App Comparison</TabsTrigger>
            </TabsList>

            <TabsContent value="features" className="space-y-8">
              {/* Search and Filter */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col md:flex-row gap-4 mb-8"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search features..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/80 backdrop-blur-sm border-0"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={
                        selectedCategory === category
                          ? "bg-gradient-to-r from-blue-600 to-purple-600"
                          : "bg-white/80 backdrop-blur-sm border-0"
                      }
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </motion.div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredFeatures.map((feature, index) => (
                  <FeatureCard
                    key={feature.id}
                    id={feature.id}
                    name={feature.name}
                    description={feature.description}
                    icon={feature.icon}
                    color={feature.color}
                    userCount={feature.userCount}
                    rating={feature.rating}
                    category={feature.category}
                    href={feature.href}
                    index={index}
                  />
                ))}
              </div>

              {filteredFeatures.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg">No features found matching your criteria.</div>
                  <Button
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedCategory("All")
                    }}
                    className="mt-4"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="comparison">
              <FeatureComparison />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
