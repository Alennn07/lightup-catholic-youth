"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Heart, 
  Users, 
  BookOpen, 
  Bot, 
  Calendar, 
  PenTool, 
  HelpCircle,
  Lightbulb,
  ArrowRight,
  Play,
  Shield,
  Sparkles,
  CheckCircle,
  Star,
  Menu,
  X,
  ChevronDown,
  LogIn,
  UserPlus,
  Home
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function HomePage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const features = [
    {
      id: "prayer-wall",
      name: "Prayer Wall",
      description: "Share prayers, support others",
      icon: Heart,
      href: "/prayer-wall",
      gradient: "from-pink-500 to-rose-600",
      emoji: "🙏",
      status: "live"
    },
    {
      id: "youth-groups",
      name: "Youth Groups",
      description: "Find your faith community",
      icon: Users,
      href: "/youth-groups",
      gradient: "from-blue-500 to-indigo-600",
      emoji: "👥",
      status: "live"
    },
    {
      id: "daily-bible-verse",
      name: "Daily Scripture",
      description: "Start each day with God's word",
      icon: BookOpen,
      href: "/daily-bible-verse",
      gradient: "from-green-500 to-emerald-600",
      emoji: "📖",
      status: "live"
    },
    {
      id: "faithbot",
      name: "FaithBot AI",
      description: "Ask questions about faith",
      icon: Bot,
      href: "/faithbot",
      gradient: "from-purple-500 to-violet-600",
      emoji: "🤖",
      status: "live"
    },
    {
      id: "liturgical-calendar",
      name: "Liturgical Calendar",
      description: "Follow the Church's seasons",
      icon: Calendar,
      href: "/liturgical-calendar",
      gradient: "from-orange-500 to-amber-600",
      emoji: "📅",
      status: "live"
    },
    {
      id: "faith-journal",
      name: "Faith Journal",
      description: "Reflect and grow spiritually",
      icon: PenTool,
      href: "/faith-journal",
      gradient: "from-indigo-500 to-blue-600",
      emoji: "📓",
      status: "live"
    },
    {
      id: "faith-quiz",
      name: "Faith Quiz",
      description: "Learn through interactive quizzes",
      icon: HelpCircle,
      href: "/faith-quiz",
      gradient: "from-teal-500 to-cyan-600",
      emoji: "❓",
      status: "live"
    }
  ]

  // Different How It Works based on user state
  const howItWorksLoggedIn = [
    {
      step: "01",
      title: "Welcome Back",
      description: "Continue your spiritual journey",
      icon: Home,
      color: "from-blue-500 to-indigo-600"
    },
    {
      step: "02", 
      title: "Explore Features",
      description: "Discover new prayer tools and community",
      icon: Sparkles,
      color: "from-purple-500 to-pink-600"
    },
    {
      step: "03",
      title: "Grow Together",
      description: "Connect with your faith community",
      icon: Users,
      color: "from-green-500 to-emerald-600"
    }
  ]

  const howItWorksNotLoggedIn = [
    {
      step: "01",
      title: "Sign Up",
      description: "Create your free account in seconds",
      icon: UserPlus,
      color: "from-blue-500 to-indigo-600"
    },
    {
      step: "02", 
      title: "Explore Features",
      description: "Discover prayer tools and community",
      icon: Sparkles,
      color: "from-purple-500 to-pink-600"
    },
    {
      step: "03",
      title: "Grow Together",
      description: "Connect with Catholic youth worldwide",
      icon: Users,
      color: "from-green-500 to-emerald-600"
    }
  ]

  const faqs = [
    {
      question: "Is LightUp completely free?",
      answer: "Yes! LightUp is completely free to use. All core features including prayer wall, daily scripture, youth groups, and faith journal are available at no cost."
    },
    {
      question: "How do I join a youth group?",
      answer: "Browse available groups in your area, request to join, and wait for approval from the group leader. It's that simple!"
    },
    {
      question: "Is my personal information safe?",
      answer: "Absolutely. We use enterprise-grade security to protect your personal information and prayer requests. Your privacy is our priority."
    },
    {
      question: "Can I use LightUp on my phone?",
      answer: "Yes! LightUp is fully responsive and works perfectly on all devices - phones, tablets, and computers."
    }
  ]

  // Get appropriate How It Works based on user state
  const currentHowItWorks = user ? howItWorksLoggedIn : howItWorksNotLoggedIn

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading LightUp...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 overflow-hidden">
        {/* Subtle Cross Pattern Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 0h2v60h-2zM0 30h60v2H0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        {/* Floating Particles Animation */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-pulse"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: '3s'
              }}
            ></div>
          ))}
        </div>

        <div className="relative container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center text-white">
            {/* Liturgical Season Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-6">
              <Calendar className="w-4 h-4 mr-2" />
              Advent 2025
            </div>

            {/* Logo */}
            <div className="flex items-center justify-center mb-8">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mr-4 shadow-2xl">
                <Lightbulb className="w-10 h-10 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-5xl font-bold">LightUp</h1>
                <p className="text-blue-200 text-lg font-medium">Catholic Youth Community</p>
              </div>
            </div>
            
            {/* Main Headline - Dynamic based on user state */}
            {user ? (
              <>
                <h2 className="text-6xl md:text-7xl font-bold mb-8 leading-tight font-display">
                  Welcome back,<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                    {user.name || user.email?.split('@')[0] || 'Friend'}!
                  </span>
                </h2>
                
                {/* Subheadline for logged in users */}
                <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto font-body">
                  Continue your spiritual journey with LightUp. 
                  Explore features, connect with your community, and grow in faith.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-6xl md:text-7xl font-bold mb-8 leading-tight font-display">
                  Grow in Faith.<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                    Connect with Purpose.
                  </span>
                </h2>
                
                {/* Subheadline for not logged in users */}
                <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto font-body">
                  Your digital companion for prayer, community, and spiritual growth. 
                  Built for today's Catholic youth.
                </p>
              </>
            )}
            
            {/* Dynamic CTA Buttons based on user state */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              {user ? (
                // User is logged in
                <>
                  <Button 
                    size="lg" 
                    className="bg-white text-blue-700 hover:bg-blue-50 px-12 py-5 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group"
                    onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <Sparkles className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform" />
                    Explore Features
                  </Button>
                  <Link href="/youth-groups">
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-10 py-5 text-xl font-semibold rounded-2xl group"
                    >
                      <Users className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform" />
                      Join Groups
                    </Button>
                  </Link>
                </>
              ) : (
                // User is not logged in
                <>
                  <Link href="/auth/sign-up">
                    <Button 
                      size="lg" 
                      className="bg-white text-blue-700 hover:bg-blue-50 px-12 py-5 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group"
                    >
                      <UserPlus className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform" />
                      Get Started Free
                    </Button>
                  </Link>
                  <Link href="/auth/sign-in">
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-10 py-5 text-xl font-semibold rounded-2xl group"
                    >
                      <LogIn className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform" />
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - 7 Features */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Seven Powerful Features
            </div>
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-heading">
              Everything You Need to Grow
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-body">
              Designed specifically for Catholic youth, these features will transform your spiritual journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {features.map((feature) => {
              const IconComponent = feature.icon
              return (
                <Link key={feature.id} href={feature.href} onClick={() => console.log(`🔍 Clicking on feature: ${feature.name} -> ${feature.href}`)}>
                  <Card className="group h-full bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 overflow-hidden">
                    <CardContent className="p-6">
                      {/* Icon with Animation */}
                      <div className={`w-14 h-14 mb-4 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                      
                      {/* Content */}
                      <div className="mb-4">
                        <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors font-heading">
                          {feature.name}
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed font-body">
                          {feature.description}
                        </p>
                      </div>
                      
                      {/* Emoji & Arrow */}
                      <div className="flex items-center justify-between">
                        <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{feature.emoji}</span>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-2 transition-all duration-300" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Personalized Welcome Section for Logged-in Users */}
      {user && (
        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                Your LightUp Journey
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-6 font-heading">
                Welcome back, {user.name || user.email?.split('@')[0] || 'Friend'}!
              </h3>
              <p className="text-xl text-gray-600 mb-8 font-body">
                Continue growing in faith with your personalized LightUp experience
              </p>
              
              {/* Quick Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <Link href="/prayer-wall">
                  <Card className="group h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0 overflow-hidden">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2 font-heading">Prayer Wall</h4>
                      <p className="text-gray-600 text-sm font-body">Share prayers and support others</p>
                    </CardContent>
                  </Card>
                </Link>
                
                <Link href="/youth-groups">
                  <Card className="group h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0 overflow-hidden">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2 font-heading">Youth Groups</h4>
                      <p className="text-gray-600 text-sm font-body">Connect with your faith community</p>
                    </CardContent>
                  </Card>
                </Link>
                
                <Link href="/daily-bible-verse">
                  <Card className="group h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0 overflow-hidden">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2 font-heading">Daily Scripture</h4>
                      <p className="text-gray-600 text-sm font-body">Start your day with God's word</p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* How It Works Section - Dynamic based on user state */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold text-gray-900 mb-6 font-heading">
                {user ? "Welcome Back" : "How It Works"}
              </h3>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto font-body">
                {user ? "Continue your spiritual journey with LightUp" : "Get started with LightUp in three simple steps"}
              </p>
            </div>
            
            <div className="relative">
              {/* Connection Line */}
              <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {currentHowItWorks.map((step, index) => {
                  const IconComponent = step.icon
                  return (
                    <div key={index} className="text-center group relative">
                      {/* Step Number Circle */}
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                        <span className="text-2xl font-bold text-white">{step.step}</span>
                      </div>
                      
                      {/* Icon Circle */}
                      <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      
                      <h4 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors font-heading">{step.title}</h4>
                      <p className="text-gray-600 text-lg leading-relaxed font-body">{step.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section - Based on Reference */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Left Side - Mission Content */}
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
                <Shield className="w-4 h-4 mr-2" />
                Our Mission
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight font-display">
                Created by Catholic youth,<br />
                <span className="text-blue-600">for Catholic youth</span>
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-8 font-body">
                We understand the unique challenges of staying connected to your faith in today's world. 
                That's why we've built LightUp to be your digital companion on this journey.
              </p>
              
              {/* Scripture Quote */}
              <div className="bg-blue-50 rounded-2xl p-6 border-l-4 border-orange-400">
                <p className="text-lg italic text-gray-800 mb-2 font-display">
                  "Don't let anyone look down on you because you are young, but set an example for the believers in speech, in conduct, in love, in faith and in purity."
                </p>
                <p className="text-sm text-gray-600 font-semibold font-body">1 Timothy 4:12</p>
              </div>
            </div>
            
            {/* Right Side - Youth Community Card */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-96 h-96 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 rounded-3xl flex flex-col items-center justify-center shadow-2xl p-8">
                  <div className="text-center text-white mb-8">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-yellow-300" />
                    </div>
                    <h4 className="text-2xl font-bold mb-2 font-heading">Youth Community</h4>
                    <p className="text-blue-200 font-body">Growing together in faith</p>
                  </div>
                  
                  {/* Feature List */}
                  <div className="space-y-4 w-full">
                    <div className="flex items-center bg-white/10 rounded-xl p-3">
                      <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center mr-3">
                        <Heart className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-white text-sm font-medium font-body">Daily prayer reflections</span>
                    </div>
                    <div className="flex items-center bg-white/10 rounded-xl p-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                        <BookOpen className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-white text-sm font-medium font-body">Scripture study guides</span>
                    </div>
                    <div className="flex items-center bg-white/10 rounded-xl p-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-white text-sm font-medium font-body">Faith-based community</span>
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  <Star className="w-5 h-5" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-pink-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  <Heart className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Enhanced Design */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold text-gray-900 mb-6 font-heading">
                Frequently Asked Questions
              </h3>
              <p className="text-xl text-gray-600 font-body">
                Everything you need to know about LightUp
              </p>
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border-0 overflow-hidden">
                  <CardContent className="p-0">
                    <button
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    >
                      <h4 className="text-lg font-semibold text-gray-900 pr-4 font-heading">{faq.question}</h4>
                      <ChevronDown 
                        className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                          openFaq === index ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openFaq === index && (
                      <div className="px-6 pb-6">
                        <div className="border-t border-gray-100 pt-4">
                          <p className="text-gray-600 leading-relaxed font-body">{faq.answer}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section - No buttons */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto text-white">
            <div className="w-24 h-24 mx-auto mb-8 bg-white/20 rounded-full flex items-center justify-center">
              <Lightbulb className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-5xl md:text-6xl font-bold mb-8 font-display">
              Ready to Light Up your faith journey?
            </h3>
            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto font-body">
              Join Catholic youth who are growing in faith together. 
              Your spiritual journey starts today.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mr-4">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">LightUp</span>
              </div>
              <p className="text-gray-300 text-lg mb-6 max-w-md">
                Connecting Catholic youth worldwide through prayer, community, and spiritual growth.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <span className="text-lg">📷</span>
                </a>
                <a href="#" className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <span className="text-lg">▶️</span>
                </a>
                <a href="#" className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <span className="text-lg">💬</span>
                </a>
              </div>
            </div>

            {/* Platform Links */}
            <div>
              <h4 className="text-xl font-bold mb-6">Platform</h4>
              <div className="space-y-3">
                <Link href="/features" className="block text-gray-300 hover:text-white transition-colors">
                  Features
                </Link>
                <Link href="/youth-groups" className="block text-gray-300 hover:text-white transition-colors">
                  Youth Groups
                </Link>
                <Link href="/prayer-wall" className="block text-gray-300 hover:text-white transition-colors">
                  Prayer Wall
                </Link>
                <Link href="/faithbot" className="block text-gray-300 hover:text-white transition-colors">
                  FaithBot AI
                </Link>
              </div>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="text-xl font-bold mb-6">Support</h4>
              <div className="space-y-3">
                <Link href="/about" className="block text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
                <Link href="/support" className="block text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
                <Link href="/support#privacy" className="block text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/support#terms" className="block text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 LightUp. Made with ❤️ for Catholic youth worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}