import { type NextRequest, NextResponse } from "next/server"

interface Feature {
  id: string
  name: string
  description: string
  category: string
  status: "available" | "coming-soon"
  users: string
  rating: number
  keyFeatures: string[]
  benefits: string[]
  highlights: string[]
  dashboardPath: string
  usageStats: {
    dailyActiveUsers: number
    totalInteractions: number
    averageSessionTime: string
    userSatisfaction: number
  }
}

// Mock database of features with usage statistics
const featuresDatabase: Feature[] = [
  {
    id: "daily-bible-verse",
    name: "Daily Bible Verse",
    description: "Start each day with inspiring scripture and reflection to guide your spiritual journey.",
    category: "spiritual-growth",
    status: "available",
    users: "12,500",
    rating: 4.8,
    keyFeatures: ["Daily verses", "Multiple translations", "Reflection prompts", "Share verses"],
    benefits: ["Daily inspiration", "Spiritual growth", "Easy sharing"],
    highlights: ["New verse every day", "Beautiful typography", "Offline access"],
    dashboardPath: "/dashboard#bible-verse",
    usageStats: {
      dailyActiveUsers: 8420,
      totalInteractions: 156780,
      averageSessionTime: "3m 45s",
      userSatisfaction: 4.8,
    },
  },
  {
    id: "prayer-wall",
    name: "Prayer Wall",
    description: "Share prayer requests and pray for others in our supportive Catholic youth community.",
    category: "community",
    status: "available",
    users: "8,200",
    rating: 4.9,
    keyFeatures: ["Submit requests", "Pray for others", "Anonymous option", "Prayer tracking"],
    benefits: ["Community support", "Spiritual connection", "Anonymous sharing"],
    highlights: ["Real-time updates", "Prayer counter", "Supportive community"],
    dashboardPath: "/dashboard#prayer-wall",
    usageStats: {
      dailyActiveUsers: 5630,
      totalInteractions: 89450,
      averageSessionTime: "5m 12s",
      userSatisfaction: 4.9,
    },
  },
  {
    id: "faithbot-ai",
    name: "FaithBot AI",
    description: "Get instant answers to Catholic faith questions from our AI assistant.",
    category: "guidance",
    status: "available",
    users: "9,100",
    rating: 4.5,
    keyFeatures: ["24/7 availability", "Catholic teachings", "Instant answers", "Scripture references"],
    benefits: ["Learn anytime", "Deepen understanding", "Quick guidance"],
    highlights: ["AI-powered", "Catholic doctrine", "Always available"],
    dashboardPath: "/dashboard#faithbot",
    usageStats: {
      dailyActiveUsers: 6890,
      totalInteractions: 234560,
      averageSessionTime: "4m 28s",
      userSatisfaction: 4.5,
    },
  },
  {
    id: "youth-groups",
    name: "Youth Group Finder",
    description: "Discover and connect with Catholic youth groups in your area.",
    category: "community",
    status: "available",
    users: "6,800",
    rating: 4.7,
    keyFeatures: ["Location-based", "Group details", "Contact info", "Event listings"],
    benefits: ["Find community", "Make friends", "Local connections"],
    highlights: ["GPS-powered", "Real groups", "Easy contact"],
    dashboardPath: "/dashboard#youth-groups",
    usageStats: {
      dailyActiveUsers: 3240,
      totalInteractions: 45670,
      averageSessionTime: "6m 15s",
      userSatisfaction: 4.7,
    },
  },
  {
    id: "faith-journal",
    name: "Faith Journal",
    description: "Document your spiritual journey with private reflections and prayers.",
    category: "spiritual-growth",
    status: "available",
    users: "5,400",
    rating: 4.6,
    keyFeatures: ["Private entries", "Mood tracking", "Prayer logs", "Reflection prompts"],
    benefits: ["Track growth", "Private space", "Spiritual insights"],
    highlights: ["100% private", "Mood insights", "Growth tracking"],
    dashboardPath: "/dashboard#faith-journal",
    usageStats: {
      dailyActiveUsers: 4120,
      totalInteractions: 78920,
      averageSessionTime: "8m 33s",
      userSatisfaction: 4.6,
    },
  },
  {
    id: "parish-calendar",
    name: "Parish Calendar",
    description: "Stay updated with parish events, masses, and youth activities.",
    category: "parish-life",
    status: "available",
    users: "7,300",
    rating: 4.4,
    keyFeatures: ["Event listings", "RSVP system", "Reminders", "Mass times"],
    benefits: ["Stay informed", "Never miss events", "Easy planning"],
    highlights: ["Real-time updates", "RSVP tracking", "Reminder system"],
    dashboardPath: "/dashboard#parish-calendar",
    usageStats: {
      dailyActiveUsers: 2890,
      totalInteractions: 34560,
      averageSessionTime: "4m 52s",
      userSatisfaction: 4.4,
    },
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    let filteredFeatures = [...featuresDatabase]

    // Filter by category
    if (category && category !== "all") {
      filteredFeatures = filteredFeatures.filter((feature) => feature.category === category)
    }

    // Filter by status
    if (status) {
      filteredFeatures = filteredFeatures.filter((feature) => feature.status === status)
    }

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase()
      filteredFeatures = filteredFeatures.filter(
        (feature) =>
          feature.name.toLowerCase().includes(searchLower) ||
          feature.description.toLowerCase().includes(searchLower) ||
          feature.keyFeatures.some((kf) => kf.toLowerCase().includes(searchLower)),
      )
    }

    // Calculate summary statistics
    const totalUsers = featuresDatabase.reduce((sum, feature) => {
      return sum + Number.parseInt(feature.users.replace(/[,K+]/g, "")) * (feature.users.includes("K") ? 1000 : 1)
    }, 0)

    const availableFeatures = featuresDatabase.filter((f) => f.status === "available")
    const averageRating = availableFeatures.reduce((sum, f) => sum + f.rating, 0) / availableFeatures.length

    const summary = {
      totalFeatures: featuresDatabase.length,
      availableFeatures: availableFeatures.length,
      comingSoonFeatures: featuresDatabase.filter((f) => f.status === "coming-soon").length,
      totalUsers: totalUsers,
      averageRating: Math.round(averageRating * 10) / 10,
      categories: [
        { name: "spiritual-growth", count: featuresDatabase.filter((f) => f.category === "spiritual-growth").length },
        { name: "community", count: featuresDatabase.filter((f) => f.category === "community").length },
        { name: "guidance", count: featuresDatabase.filter((f) => f.category === "guidance").length },
        { name: "parish-life", count: featuresDatabase.filter((f) => f.category === "parish-life").length },
        { name: "worship", count: featuresDatabase.filter((f) => f.category === "worship").length },
        { name: "liturgical", count: featuresDatabase.filter((f) => f.category === "liturgical").length },
        { name: "creative", count: featuresDatabase.filter((f) => f.category === "creative").length },
      ],
    }

    return NextResponse.json({
      success: true,
      features: filteredFeatures,
      summary: summary,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Features API Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch features",
        features: featuresDatabase,
        summary: null,
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { featureId, feedback, rating, email } = body

    // Validate required fields
    if (!featureId || !feedback) {
      return NextResponse.json({ success: false, error: "Feature ID and feedback are required" }, { status: 400 })
    }

    // Find the feature
    const feature = featuresDatabase.find((f) => f.id === featureId)
    if (!feature) {
      return NextResponse.json({ success: false, error: "Feature not found" }, { status: 404 })
    }

    // In a real app, you would save this to a database
    const feedbackEntry = {
      id: `feedback_${Date.now()}`,
      featureId,
      feedback,
      rating: rating || null,
      email: email || null,
      timestamp: new Date().toISOString(),
      status: "pending",
    }

    console.log("New feedback received:", feedbackEntry)

    return NextResponse.json({
      success: true,
      message: "Thank you for your feedback! We'll review it and use it to improve our features.",
      feedbackId: feedbackEntry.id,
    })
  } catch (error) {
    console.error("Features Feedback API Error:", error)
    return NextResponse.json({ success: false, error: "Failed to submit feedback" }, { status: 500 })
  }
}
