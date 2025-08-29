"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { FeatureCard } from "@/components/feature-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Sparkles, 
  Search,
  Heart,
  BookOpen,
  MessageCircle,
  Calendar,
  PenTool,
  MapPin,
  Users2,
  Zap
} from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Feature {
  id: string
  name: string
  description: string
  category: string
  userCount: number
  rating: number
  icon: any
  color: string
  href: string
}

export default function FeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchRealFeatures()
  }, [])

  const fetchRealFeatures = async () => {
    try {
      const { data: featuresData, error } = await supabase
        .from('features')
        .select('*')
        .order('user_count', { ascending: false })

      if (!error && featuresData) {
        console.log('📊 Raw features data from database:', featuresData)
        
        const realFeatures: Feature[] = featuresData.map((feature: any) => {
          const href = getFeatureHref(feature.name || '')
          console.log(`🔍 Feature: "${feature.name}" -> Href: "${href}"`)
          return {
            id: feature.id,
            name: feature.name || '',
            description: feature.description || '',
            category: feature.category || 'Community',
            userCount: feature.user_count || 0,
            rating: feature.rating || 0,
            icon: getIconForFeature(feature.name || ''),
            color: getColorForFeature(feature.name || ''),
            href: href,
          }
        })
        
        console.log('🎯 Final processed features:', realFeatures)
        setFeatures(realFeatures)
      } else {
        // If no real data, show default empty state
        setFeatures([
          {
            id: "prayer-wall",
            name: "Prayer Wall",
            description: "Share prayer requests and pray for others in your Catholic youth community.",
            category: "Community",
            userCount: 0,
            rating: 0,
            icon: Heart,
            color: "from-pink-500 to-rose-500",
            href: "/prayer-wall",
          },
          {
            id: "youth-groups",
            name: "Youth Groups",
            description: "Discover and connect with Catholic youth groups in your area.",
            category: "Community",
            userCount: 0,
            rating: 0,
            icon: Users2,
            color: "from-blue-500 to-cyan-500",
            href: "/youth-groups",
          },
          {
            id: "daily-bible-verse",
            name: "Daily Bible Verse",
            description: "Start each day with inspiring scripture and thoughtful reflections.",
            category: "Spiritual",
            userCount: 0,
            rating: 0,
            icon: BookOpen,
            color: "from-green-500 to-emerald-500",
            href: "/daily-bible-verse",
          },
          {
            id: "faithbot",
            name: "FaithBot AI",
            description: "Get answers to your faith questions with our AI-powered assistant.",
            category: "Spiritual",
            userCount: 0,
            rating: 0,
            icon: MessageCircle,
            color: "from-purple-500 to-pink-500",
            href: "/faithbot",
          },

          {
            id: "faith-journal",
            name: "Faith Journal",
            description: "Reflect on your spiritual journey with personal journaling.",
            category: "Personal",
            userCount: 0,
            rating: 0,
            icon: PenTool,
            color: "from-orange-500 to-red-500",
            href: "/faith-journal",
          },
          {
            id: "faith-quiz",
            name: "Faith Quiz",
            description: "Test your knowledge and learn more about your faith.",
            category: "Educational",
            userCount: 0,
            rating: 0,
            icon: Zap,
            color: "from-yellow-500 to-orange-500",
            href: "/faith-quiz",
          },
          {
            id: "youth-group-finder",
            name: "Youth Group Finder",
            description: "Find and connect with Catholic youth groups in your area.",
            category: "Community",
            userCount: 0,
            rating: 0,
            icon: MapPin,
            color: "from-teal-500 to-green-500",
            href: "/youth-groups",
          }
        ])
      }
    } catch (error) {
      console.error('Error fetching features:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getIconForFeature = (featureName: string) => {
    const lowerName = featureName.toLowerCase()
    
    // More specific matching for FaithBot
    if (lowerName.includes('faithbot') || lowerName.includes('faith bot') || lowerName.includes('ai')) {
      return MessageCircle
    }
    
    switch (lowerName) {
      case 'prayer wall': return Heart
      case 'youth groups': return Users2
      case 'daily bible verse': return BookOpen
      case 'faithbot': return MessageCircle

      case 'faith journal': return PenTool
      case 'faith quiz': return Zap
      case 'youth group finder': return MapPin
      default: return Sparkles
    }
  }

  const getColorForFeature = (featureName: string) => {
    const lowerName = featureName.toLowerCase()
    
    // More specific matching for FaithBot
    if (lowerName.includes('faithbot') || lowerName.includes('faith bot') || lowerName.includes('ai')) {
      return "from-purple-500 to-pink-500"
    }
    
    switch (lowerName) {
      case 'prayer wall': return "from-pink-500 to-rose-500"
      case 'youth groups': return "from-blue-500 to-cyan-500"
      case 'daily bible verse': return "from-green-500 to-emerald-500"
      case 'faithbot': return "from-purple-500 to-pink-500"

      case 'faith journal': return "from-orange-500 to-red-500"
      case 'faith quiz': return "from-yellow-500 to-orange-500"
      case 'youth group finder': return "from-teal-500 to-green-500"
      default: return "from-purple-500 to-pink-500"
    }
  }

  const getFeatureHref = (featureName: string) => {
    const lowerName = featureName.toLowerCase()
    
    console.log('🔍 getFeatureHref called with:', featureName, '-> lowerName:', lowerName)
    
    // EXACT MATCH for Daily Bible Verse first (to avoid confusion)
    if (lowerName === 'daily bible verse') {
      console.log('🎯 Daily Bible Verse exact match, returning /daily-bible-verse')
      return "/daily-bible-verse"
    }
    
    // More specific matching for FaithBot (but exclude Daily Bible Verse)
    if (lowerName.includes('faithbot') || lowerName.includes('faith bot') || lowerName.includes('ai')) {
      console.log('🎯 FaithBot detected, returning /faithbot')
      return "/faithbot"
    }
    
    switch (lowerName) {
      case 'prayer wall': 
        console.log('🎯 Prayer Wall detected, returning /prayer-wall')
        return "/prayer-wall"
      case 'youth groups': 
        console.log('🎯 Youth Groups detected, returning /youth-groups')
        return "/youth-groups"
      case 'daily bible verse': 
        console.log('🎯 Daily Bible Verse detected, returning /daily-bible-verse')
        return "/daily-bible-verse"
      case 'faithbot': 
        console.log('🎯 FaithBot detected, returning /faithbot')
        return "/faithbot"

      case 'faith journal': 
        console.log('🎯 Faith Journal detected, returning /faith-journal')
        return "/faith-journal"
      case 'faith quiz': 
        console.log('🎯 Faith Quiz detected, returning /faith-quiz')
        return "/faith-quiz"
      case 'youth group finder': 
        console.log('🎯 Youth Group Finder detected, returning /youth-groups')
        return "/youth-groups"
      default: 
        console.log('❌ No match found, returning / (dashboard)')
        return "/"
    }
  }

  const filteredFeatures = activeTab === "all" 
    ? features.filter(feature => 
        feature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feature.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : features.filter(feature => 
        feature.category.toLowerCase() === activeTab.toLowerCase() &&
        (feature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         feature.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )

  const totalUsers = features.reduce((sum, feature) => sum + (feature.userCount || 0), 0)
  const averageRating = features.length > 0 
    ? features.reduce((sum, feature) => sum + (feature.rating || 0), 0) / features.length 
    : 0

  const categories = ["all", "community", "spiritual", "personal", "educational"]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 pb-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading features...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="text-center mb-16 mt-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Our Features
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover all the tools and features designed to help Catholic youth grow in faith, 
            build community, and deepen their relationship with God.
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{features.length}</div>
              <div className="text-gray-600 font-medium">Total Features</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{totalUsers.toLocaleString()}</div>
              <div className="text-gray-600 font-medium">Total Users</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{averageRating.toFixed(1)}</div>
              <div className="text-gray-600 font-medium">Average Rating</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          {/* Search Box */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-gray-900 placeholder:text-gray-500"
            />
          </div>

          {/* Category Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8 bg-gray-100 p-1 rounded-lg border border-gray-200">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category}
                  value={category} 
                  className="text-gray-600 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-md font-medium py-2"
                >
                  {category === "all" ? "All" : category.charAt(0).toUpperCase() + category.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* All Features Tab */}
            <TabsContent value="all" className="space-y-8">
              {filteredFeatures.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg mb-4">No features found matching your search.</div>
                  <Button
                    onClick={() => setSearchQuery("")}
                    variant="outline"
                    className="px-6"
                  >
                    Clear Search
                  </Button>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredFeatures.map((feature, index) => (
                    <motion.div
                      key={feature.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                    >
                      <FeatureCard
                        id={feature.id}
                        name={feature.name}
                        description={feature.description}
                        category={feature.category}
                        userCount={feature.userCount}
                        rating={feature.rating}
                        icon={feature.icon}
                        color={feature.color}
                        href={feature.href}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </TabsContent>

            {/* Individual Category Tabs */}
            {categories.slice(1).map((category) => (
              <TabsContent key={category} value={category} className="space-y-8">
                {filteredFeatures.filter(f => f.category.toLowerCase() === category.toLowerCase()).length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-500 text-lg">No {category} features found.</div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFeatures
                      .filter(f => f.category.toLowerCase() === category.toLowerCase())
                      .map((feature, index) => (
                        <FeatureCard
                          key={feature.id}
                          id={feature.id}
                          name={feature.name}
                          description={feature.description}
                          category={feature.category}
                          userCount={feature.userCount}
                          rating={feature.rating}
                          icon={feature.icon}
                          color={feature.color}
                          href={feature.href}
                        />
                      ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
