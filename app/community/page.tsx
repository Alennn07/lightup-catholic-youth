"use client"

import { Navigation } from "@/components/navigation"
import { SimpleFooter } from "@/components/simple-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Heart, Users, BookOpen, MessageCircle, Calendar, Music, ArrowRight, MapPin, Clock } from "lucide-react"

const features = [
  {
    id: "prayer-wall",
    name: "Prayer Wall",
    description: "Share prayer requests and support others in their spiritual journey.",
    icon: Heart,
    color: "bg-red-50 text-red-600",
    href: "/dashboard#prayer-wall",
    active: true,
  },
  {
    id: "youth-groups",
    name: "Youth Groups",
    description: "Find and connect with Catholic youth groups in your local area.",
    icon: Users,
    color: "bg-blue-50 text-blue-600",
    href: "/dashboard#youth-groups",
    active: true,
  },
  {
    id: "daily-verse",
    name: "Daily Bible Verse",
    description: "Start each day with inspiring scripture and thoughtful reflections.",
    icon: BookOpen,
    color: "bg-green-50 text-green-600",
    href: "/dashboard#bible-verse",
    active: true,
  },
  {
    id: "faithbot",
    name: "FaithBot",
    description: "Get answers to your faith questions from our AI spiritual companion.",
    icon: MessageCircle,
    color: "bg-purple-50 text-purple-600",
    href: "/dashboard#faithbot",
    active: true,
  },
  {
    id: "events",
    name: "Parish Events",
    description: "Stay updated with local Catholic events and activities.",
    icon: Calendar,
    color: "bg-orange-50 text-orange-600",
    href: "/dashboard#events",
    active: true,
  },
  {
    id: "worship",
    name: "Worship Songs",
    description: "Access a collection of Catholic hymns and contemporary worship music.",
    icon: Music,
    color: "bg-indigo-50 text-indigo-600",
    href: "/dashboard#worship",
    active: true,
  },
]

const recentActivity = [
  {
    type: "prayer",
    user: "Maria S.",
    action: "shared a prayer request",
    time: "2 minutes ago",
    location: "Los Angeles, CA",
  },
  {
    type: "group",
    user: "David C.",
    action: "joined St. Mary's Youth Group",
    time: "15 minutes ago",
    location: "New York, NY",
  },
  {
    type: "verse",
    user: "Isabella R.",
    action: "reflected on today's verse",
    time: "1 hour ago",
    location: "Miami, FL",
  },
  {
    type: "event",
    user: "Michael T.",
    action: "registered for Youth Retreat",
    time: "2 hours ago",
    location: "Chicago, IL",
  },
]

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Community Features</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore all the ways you can connect, grow, and share your faith with other Catholic youth.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {features.map((feature) => (
              <Card key={feature.id} className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${feature.color}`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    {feature.active && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700 border-0">
                        Active
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl text-gray-900">{feature.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  <Link href={feature.href}>
                    <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                      Try Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Recent Community Activity</h2>
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          <span className="font-semibold">{activity.user}</span> {activity.action}
                        </p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{activity.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{activity.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-6">
                  <Link href="/dashboard">
                    <Button variant="outline">
                      Join the Community
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <SimpleFooter />
    </div>
  )
}
