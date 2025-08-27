"use client"

import { Navigation } from "@/components/navigation"
import { SimpleFooter } from "@/components/simple-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Heart, Users, BookOpen, MessageCircle, Calendar, Music, ArrowRight, MapPin, Clock, Star, Globe, Church, Cross, Lightbulb, Award, TrendingUp, Bookmark, Share2, ThumbsUp, MessageSquare, Plus, CheckCircle } from "lucide-react"

const communityStats = [
  { label: "Active Members", value: "2,847", icon: Users, color: "text-blue-600" },
  { label: "Prayer Requests", value: "156", icon: Heart, color: "text-red-600" },
  { label: "Youth Groups", value: "89", icon: Church, color: "text-green-600" },
  { label: "Faith Stories", value: "324", icon: BookOpen, color: "text-purple-600" },
]

const featuredYouthGroups = [
  {
    id: 1,
    name: "St. Mary's Youth Ministry",
    location: "Los Angeles, CA",
    members: 45,
    description: "A vibrant community focused on service, prayer, and fellowship. We meet every Sunday after Mass.",
    image: "/placeholder-logo.png",
    tags: ["Service", "Prayer", "Fellowship"],
    rating: 4.8,
    isJoined: false,
  },
  {
    id: 2,
    name: "Sacred Heart Young Adults",
    location: "New York, NY",
    members: 32,
    description: "Building authentic relationships through faith, study, and social activities. All are welcome!",
    image: "/placeholder-logo.png",
    tags: ["Study", "Social", "Authentic"],
    rating: 4.9,
    isJoined: false,
  },
  {
    id: 3,
    name: "Divine Mercy Youth",
    location: "Chicago, IL",
    members: 28,
    description: "Spreading God's mercy through community service and evangelization. Join our mission!",
    image: "/placeholder-logo.png",
    tags: ["Service", "Evangelization", "Mercy"],
    rating: 4.7,
    isJoined: false,
  },
]

const faithSpotlight = [
  {
    id: 1,
    title: "Finding God in College Life",
    author: "Sarah M.",
    excerpt: "How I discovered that faith isn't just for Sundays, but for every moment of my college journey...",
    likes: 23,
    comments: 8,
    time: "2 hours ago",
    category: "Personal Story",
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: 2,
    title: "Praying the Rosary with Friends",
    author: "Michael T.",
    excerpt: "We started a weekly Rosary group in our dorm, and it's changed everything about our friendship...",
    likes: 18,
    comments: 12,
    time: "5 hours ago",
    category: "Prayer Life",
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: 3,
    title: "Serving at the Local Food Bank",
    author: "Isabella R.",
    excerpt: "Our youth group's monthly service project has taught me what it means to be Christ's hands and feet...",
    likes: 31,
    comments: 15,
    time: "1 day ago",
    category: "Service",
    isLiked: false,
    isBookmarked: false,
  },
]

const upcomingEvents = [
  {
    id: 1,
    title: "National Catholic Youth Conference",
    date: "Dec 15-17, 2024",
    location: "Indianapolis, IN",
    attendees: 23,
    type: "Conference",
    image: "/placeholder-logo.png",
    isRegistered: false,
    maxAttendees: 100,
    owner: "admin@lightup.com",
  },
  {
    id: 2,
    title: "Advent Prayer Retreat",
    date: "Dec 8, 2024",
    location: "Local Parish",
    attendees: 12,
    type: "Retreat",
    image: "/placeholder-logo.png",
    isRegistered: false,
    maxAttendees: 50,
    owner: "admin@lightup.com",
  },
  {
    id: 3,
    title: "Christmas Caroling",
    date: "Dec 24, 2024",
    location: "Nursing Home",
    attendees: 18,
    type: "Service",
    image: "/placeholder-logo.png",
    isRegistered: false,
    maxAttendees: 30,
    owner: "admin@lightup.com",
  },
]

export default function CommunityPage() {
  const { toast } = useToast()
  const { user, getAccessToken } = useAuth()
  const [groups, setGroups] = useState(featuredYouthGroups)
  const [stories, setStories] = useState(faithSpotlight)
  const [events, setEvents] = useState(upcomingEvents)
  const [isJoiningCommunity, setIsJoiningCommunity] = useState(false)
  const [isExploringGroups, setIsExploringGroups] = useState(false)
  const [showRegistrationForm, setShowRegistrationForm] = useState<number | null>(null)
  const [showCreateEventForm, setShowCreateEventForm] = useState(false)
  const [isLoadingEvents, setIsLoadingEvents] = useState(false)
  const [registrationData, setRegistrationData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    parish: "",
    diocese: "",
    emergencyContact: "",
    dietaryRestrictions: "",
    specialNeeds: "",
    agreeToTerms: false,
    agreeToPhotoRelease: false,
  })

  // Fetch events from backend
  const fetchEvents = async () => {
    try {
      setIsLoadingEvents(true)
      const response = await fetch('/api/events')
      if (response.ok) {
        const data = await response.json()
        if (data.events && data.events.length > 0) {
          // Transform backend data to match frontend format
          const transformedEvents = data.events.map((event: any) => ({
            id: event.id,
            title: event.title,
            date: new Date(event.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            }),
            location: event.location,
            attendees: event.attendees,
            type: event.type,
            image: "/placeholder-logo.png",
            isRegistered: false, // Will be updated based on user's registration
            maxAttendees: event.max_attendees,
            owner: event.owner_email,
            description: event.description,
            requirements: event.requirements,
            contactEmail: event.contact_email,
            contactPhone: event.contact_phone,
          }))
          setEvents(transformedEvents)
        }
      }
    } catch (error) {
      console.error('Error fetching events:', error)
      // Keep using local events if backend fails
    } finally {
      setIsLoadingEvents(false)
    }
  }

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents()
  }, [])

  // Handle joining youth groups
  const handleJoinGroup = (groupId: number) => {
    setGroups(prev => prev.map(group => 
      group.id === groupId 
        ? { ...group, isJoined: !group.isJoined, members: group.isJoined ? group.members - 1 : group.members + 1 }
        : group
    ))
    
    const group = groups.find(g => g.id === groupId)
    if (group) {
      toast({
        title: group.isJoined ? "Left Group" : "Joined Group!",
        description: group.isJoined 
          ? `You've left ${group.name}` 
          : `Welcome to ${group.name}! You're now part of our community.`,
        variant: group.isJoined ? "default" : "default",
      })
    }
  }

  // Handle story interactions
  const handleLikeStory = (storyId: number) => {
    setStories(prev => prev.map(story => 
      story.id === storyId 
        ? { ...story, isLiked: !story.isLiked, likes: story.isLiked ? story.likes - 1 : story.likes + 1 }
        : story
    ))
    
    const story = stories.find(s => s.id === storyId)
    if (story) {
      toast({
        title: story.isLiked ? "Unliked" : "Liked!",
        description: story.isLiked 
          ? `You've unliked "${story.title}"` 
          : `You liked "${story.title}"`,
        variant: "default",
      })
    }
  }

  const handleBookmarkStory = (storyId: number) => {
    setStories(prev => prev.map(story => 
      story.id === storyId 
        ? { ...story, isBookmarked: !story.isBookmarked }
        : story
    ))
    
    const story = stories.find(s => s.id === storyId)
    if (story) {
      toast({
        title: story.isBookmarked ? "Removed from Bookmarks" : "Bookmarked!",
        description: story.isBookmarked 
          ? `"${story.title}" removed from your bookmarks` 
          : `"${story.title}" added to your bookmarks`,
        variant: "default",
      })
    }
  }

  // Handle event registration
  const handleEventRegistration = (eventId: number) => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to register for events.",
        variant: "destructive",
      })
      return
    }
    
    const event = events.find(e => e.id === eventId)
    if (event && event.attendees >= event.maxAttendees) {
      toast({
        title: "Event Full",
        description: "This event has reached maximum capacity.",
        variant: "destructive",
      })
      return
    }
    
    // Show the registration form instead of directly registering
    setShowRegistrationForm(eventId)
  }

  const handleRegistrationSubmit = async (eventId: number) => {
    // Validate required fields
    if (!registrationData.name || !registrationData.email || !registrationData.age || !registrationData.emergencyContact) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (!registrationData.agreeToTerms) {
      toast({
        title: "Terms Agreement Required",
        description: "You must agree to the terms and conditions.",
        variant: "destructive",
      })
      return
    }

    try {
      // Get access token for authentication
      const accessToken = await getAccessToken()
      if (!accessToken) {
        toast({
          title: "Authentication Error",
          description: "Please sign in again to continue.",
          variant: "destructive",
        })
        return
      }

      const response = await fetch('/api/events/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          eventId,
          ...registrationData
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Registration failed')
      }

      const result = await response.json()
      
      // Update local state
      setEvents(prev => prev.map(event => 
        event.id === eventId 
          ? { 
              ...event, 
              isRegistered: true, 
              attendees: event.attendees + 1 
            }
          : event
      ))
      
      toast({
        title: "Registration Successful! 🎉",
        description: result.message || `You're now registered for this event!`,
        variant: "default",
      })
      
      // Reset form and close modal
      setShowRegistrationForm(null)
      setRegistrationData({
        name: "",
        email: "",
        phone: "",
        age: "",
        parish: "",
        diocese: "",
        emergencyContact: "",
        dietaryRestrictions: "",
        specialNeeds: "",
        agreeToTerms: false,
        agreeToPhotoRelease: false,
      })
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle community actions
  const handleJoinCommunity = async () => {
    setIsJoiningCommunity(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    toast({
      title: "Welcome to the Community! 🎉",
      description: "You're now part of our growing Catholic youth family. Check your email for next steps!",
      variant: "default",
    })
    setIsJoiningCommunity(false)
  }

  const handleExploreGroups = async () => {
    setIsExploringGroups(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast({
      title: "Exploring Groups... 🔍",
      description: "We're finding the best youth groups near you. This may take a moment.",
      variant: "default",
    })
    setIsExploringGroups(false)
  }

  const handleStartJourney = () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to start your faith journey with us.",
        variant: "destructive",
      })
      return
    }
    
    toast({
      title: "Journey Started! 🚀",
      description: "Your faith journey begins now. We'll guide you through personalized recommendations.",
      variant: "default",
    })
  }

  const handleInviteFriends = () => {
    if (navigator.share) {
      navigator.share({
        title: "Join LightUp - Catholic Youth Platform",
        text: "I found this amazing Catholic youth community! Join me on LightUp to connect, grow, and serve together.",
        url: window.location.origin,
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.origin)
      toast({
        title: "Link Copied! 📋",
        description: "The website link has been copied to your clipboard. Share it with your friends!",
        variant: "default",
      })
    }
  }

  const handleReadMore = (storyId: number) => {
    const story = stories.find(s => s.id === storyId)
    if (story) {
      toast({
        title: "Story Preview",
        description: `This is a preview of "${story.title}". Full story coming soon with comments and discussions!`,
        variant: "default",
      })
    }
  }

  const handleLearnMoreGroup = (groupId: number) => {
    const group = groups.find(g => g.id === groupId)
    if (group) {
      toast({
        title: "Group Details",
        description: `Learn more about ${group.name}. Full group page with events, members, and activities coming soon!`,
        variant: "default",
      })
    }
  }

  const handleCreateEvent = () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to create events.",
        variant: "destructive",
      })
      return
    }
    setShowCreateEventForm(true)
  }

  const handleDeleteEvent = async (eventId: number) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete event')
      }

      // Update local state
      setEvents(prev => prev.filter(e => e.id !== eventId))
      
      toast({
        title: "Event Deleted",
        description: "Event has been removed successfully.",
        variant: "default",
      })
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
  }

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
              <Button 
                className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={handleJoinCommunity}
                disabled={isJoiningCommunity}
              >
                {isJoiningCommunity ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Joining...
                  </>
                ) : (
                  <>
                    <Users className="mr-2 h-5 w-5" />
                    Join Our Community
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="h-12 px-8 border-2 border-gray-300 hover:border-gray-400"
                onClick={handleExploreGroups}
                disabled={isExploringGroups}
              >
                {isExploringGroups ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600 mr-2"></div>
                    Exploring...
                  </>
                ) : (
                  <>
                    <Globe className="mr-2 h-5 w-5" />
                    Explore Groups
                  </>
                )}
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
              {groups.map((group, index) => (
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
                    <div className="space-y-2">
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => handleLearnMoreGroup(group.id)}
                      >
                        Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                      <Button 
                        variant={group.isJoined ? "outline" : "secondary"}
                        className="w-full"
                        onClick={() => handleJoinGroup(group.id)}
                      >
                        {group.isJoined ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Joined
                          </>
                        ) : (
                          <>
                            <Plus className="mr-2 h-4 w-4" />
                            Join Group
                          </>
                        )}
                      </Button>
                    </div>
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
              {stories.map((story, index) => (
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
                        <button 
                          className={`flex items-center space-x-1 transition-colors ${story.isLiked ? 'text-blue-600' : 'hover:text-blue-600'}`}
                          onClick={() => handleLikeStory(story.id)}
                        >
                          <ThumbsUp className={`h-4 w-4 ${story.isLiked ? 'fill-current' : ''}`} />
                          <span>{story.likes}</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                          <MessageSquare className="h-4 w-4" />
                          <span>{story.comments}</span>
                        </button>
                          </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`${story.isBookmarked ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
                          onClick={() => handleBookmarkStory(story.id)}
                        >
                          <Bookmark className={`h-4 w-4 ${story.isBookmarked ? 'fill-current' : ''}`} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-blue-600 hover:text-blue-700"
                          onClick={() => handleReadMore(story.id)}
                        >
                          Read More
                        </Button>
                          </div>
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
            
            {isLoadingEvents ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading events...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {events.map((event, index) => (
                <Card key={index} className="bg-white border-0 shadow-sm hover:shadow-md transition-all duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                        {event.type}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {event.attendees}/{event.maxAttendees} attending
                      </span>
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
                    <Button 
                      className={`w-full ${event.isRegistered 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-orange-600 hover:bg-orange-700'
                      } text-white`}
                      onClick={() => handleEventRegistration(event.id)}
                    >
                      {event.isRegistered ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Registered
                        </>
                      ) : (
                        <>
                          <Bookmark className="mr-2 h-4 w-4" />
                          Register Interest
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
                  ))}
                </div>
            )}
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
                  <Button 
                    className="h-12 px-8 bg-white text-blue-600 hover:bg-gray-100 font-medium shadow-lg"
                    onClick={handleStartJourney}
                  >
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Start Your Journey
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-12 px-8 border-white text-white hover:bg-white hover:text-blue-600"
                    onClick={handleInviteFriends}
                  >
                    <Share2 className="mr-2 h-5 w-5" />
                    Invite Friends
                    </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Registration Form Modal */}
      {showRegistrationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Event Registration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name *</label>
                  <input
                    type="text"
                    value={registrationData.name}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-2 border rounded mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Age *</label>
                  <input
                    type="number"
                    value={registrationData.age}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, age: e.target.value }))}
                    className="w-full p-2 border rounded mt-1"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Parish *</label>
                  <input
                    type="text"
                    value={registrationData.parish}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, parish: e.target.value }))}
                    className="w-full p-2 border rounded mt-1"
                    placeholder="e.g., St. Mary's"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Diocese *</label>
                  <input
                    type="text"
                    value={registrationData.diocese}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, diocese: e.target.value }))}
                    className="w-full p-2 border rounded mt-1"
                    placeholder="e.g., Los Angeles"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Email *</label>
                <input
                  type="email"
                  value={registrationData.email}
                  onChange={(e) => setRegistrationData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-2 border rounded mt-1"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Emergency Contact *</label>
                <input
                  type="text"
                  value={registrationData.emergencyContact}
                  onChange={(e) => setRegistrationData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                  className="w-full p-2 border rounded mt-1"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={registrationData.agreeToTerms}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                    className="rounded"
                    required
                  />
                  <span className="text-sm">I agree to the terms and conditions *</span>
                </label>
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button 
                  onClick={() => setShowRegistrationForm(null)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleRegistrationSubmit(showRegistrationForm)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Submit Registration
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <SimpleFooter />
    </div>
  )
}
