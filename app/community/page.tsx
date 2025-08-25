"use client"

import { Navigation } from "@/components/navigation"
import { SimpleFooter } from "@/components/simple-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { Heart, Users, BookOpen, MessageCircle, Calendar, Music, ArrowRight, MapPin, Clock, Star, Globe, Church, Cross, Lightbulb, Award, TrendingUp, Bookmark, Share2, ThumbsUp, MessageSquare } from "lucide-react"

const communityStats = [
  { label: "Active Members", value: "2,847", icon: Users, color: "text-blue-600" },
  { label: "Prayer Requests", value: "156", icon: Heart, color: "text-red-600" },
  { label: "Youth Groups", value: "89", icon: Church, color: "text-green-600" },
  { label: "Faith Stories", value: "324", icon: BookOpen, color: "text-purple-600" },
]

const featuredYouthGroups = [
  {
    name: "St. Mary's Youth Ministry",
    location: "Los Angeles, CA",
    members: 45,
    description: "A vibrant community focused on service, prayer, and fellowship. We meet every Sunday after Mass.",
    image: "/placeholder-logo.png",
    tags: ["Service", "Prayer", "Fellowship"],
    rating: 4.8,
  },
  {
    name: "Sacred Heart Young Adults",
    location: "New York, NY",
    members: 32,
    description: "Building authentic relationships through faith, study, and social activities. All are welcome!",
    image: "/placeholder-logo.png",
    tags: ["Study", "Social", "Authentic"],
    rating: 4.9,
  },
  {
    name: "Divine Mercy Youth",
    location: "Chicago, IL",
    members: 28,
    description: "Spreading God's mercy through community service and evangelization. Join our mission!",
    image: "/placeholder-logo.png",
    tags: ["Service", "Evangelization", "Mercy"],
    rating: 4.7,
  },
]

const faithSpotlight = [
  {
    title: "Finding God in College Life",
    author: "Sarah M.",
    excerpt: "How I discovered that faith isn't just for Sundays, but for every moment of my college journey...",
    likes: 23,
    comments: 8,
    time: "2 hours ago",
    category: "Personal Story",
  },
  {
    title: "Praying the Rosary with Friends",
    author: "Michael T.",
    excerpt: "We started a weekly Rosary group in our dorm, and it's changed everything about our friendship...",
    likes: 18,
    comments: 12,
    time: "5 hours ago",
    category: "Prayer Life",
  },
  {
    title: "Serving at the Local Food Bank",
    author: "Isabella R.",
    excerpt: "Our youth group's monthly service project has taught me what it means to be Christ's hands and feet...",
    likes: 31,
    comments: 15,
    time: "1 day ago",
    category: "Service",
  },
]

const upcomingEvents = [
  {
    title: "National Catholic Youth Conference",
    date: "Dec 15-17, 2024",
    location: "Indianapolis, IN",
    attendees: 23,
    type: "Conference",
    image: "/placeholder-logo.png",
  },
  {
    title: "Advent Prayer Retreat",
    date: "Dec 8, 2024",
    location: "Local Parish",
    attendees: 12,
    type: "Retreat",
    image: "/placeholder-logo.png",
  },
  {
    title: "Christmas Caroling",
    date: "Dec 24, 2024",
    location: "Nursing Home",
    attendees: 18,
    type: "Service",
    image: "/placeholder-logo.png",
  },
]

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200 rounded-full px-6 py-3 mb-6">
              <Cross className="h-5 w-5 text-blue-600" />
              <span className="text-blue-700 font-medium">Catholic Youth Community</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Connect. Grow. <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Serve.</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Join thousands of Catholic youth across the country as we journey together in faith, 
              build authentic friendships, and make a difference in our communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200">
                <Users className="mr-2 h-5 w-5" />
                Join Our Community
              </Button>
              <Button variant="outline" className="h-12 px-8 border-2 border-gray-300 hover:border-gray-400">
                <Globe className="mr-2 h-5 w-5" />
                Explore Groups
              </Button>
            </div>
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {communityStats.map((stat, index) => (
              <Card key={index} className="text-center bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Featured Youth Groups */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Youth Groups</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover amazing Catholic youth communities near you and across the country
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredYouthGroups.map((group, index) => (
                <Card key={index} className="bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-200 group">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={group.image} alt={group.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 font-bold">
                          {group.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 mb-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{group.rating}</span>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          {group.members} members
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
                      {group.name}
                    </CardTitle>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      {group.location}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{group.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {group.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Faith Stories Spotlight */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Faith Stories</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Real stories from real Catholic youth about their faith journey
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {faithSpotlight.map((story, index) => (
                <Card key={index} className="bg-white border-0 shadow-sm hover:shadow-md transition-all duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                        {story.category}
                      </Badge>
                      <span className="text-sm text-gray-500">{story.time}</span>
                    </div>
                    <CardTitle className="text-lg text-gray-900 line-clamp-2">{story.title}</CardTitle>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                          {story.author.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span>{story.author}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 line-clamp-3">{story.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{story.likes}</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                          <MessageSquare className="h-4 w-4" />
                          <span>{story.comments}</span>
                        </button>
                      </div>
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                        Read More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Join exciting Catholic youth events and make memories that last a lifetime
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEvents.map((event, index) => (
                <Card key={index} className="bg-white border-0 shadow-sm hover:shadow-md transition-all duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                        {event.type}
                      </Badge>
                      <span className="text-sm text-gray-500">{event.attendees} attending</span>
                    </div>
                    <CardTitle className="text-lg text-gray-900">{event.title}</CardTitle>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                      <Bookmark className="mr-2 h-4 w-4" />
                      Register Interest
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-xl">
              <CardContent className="p-12">
                <Lightbulb className="h-16 w-16 mx-auto mb-6 text-yellow-300" />
                <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                  Join our growing community of Catholic youth who are living their faith boldly 
                  and making a positive impact in the world.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="h-12 px-8 bg-white text-blue-600 hover:bg-gray-100 font-medium shadow-lg">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Start Your Journey
                  </Button>
                  <Button variant="outline" className="h-12 px-8 border-white text-white hover:bg-white hover:text-blue-600">
                    <Share2 className="mr-2 h-5 w-5" />
                    Invite Friends
                  </Button>
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
