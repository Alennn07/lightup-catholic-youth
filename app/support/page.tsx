"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { BackToTop } from "@/components/back-to-top"
import { SmartBackButton } from "@/components/smart-back-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  HelpCircle,
  Mail,
  Shield,
  MessageCircle,
  BookOpen,
  Phone,
  Clock,
  MapPin,
  FileText,
  Users,
  Heart,
  Calendar,
  PenTool,
  Bot,
  Send,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState("help-center")
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'bot',
      message: 'Hi! I\'m your AI Support Assistant. How can I help you today?',
      timestamp: new Date()
    }
  ])
  const [userInput, setUserInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  
  // Smart Help Center State
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [completedGuides, setCompletedGuides] = useState<string[]>([])
  const [userProgress, setUserProgress] = useState<{[key: string]: number}>({})
  
  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    priority: 'Low - General question',
    message: ''
  })

  // Auto-minimize AI chat when navigating away
  useEffect(() => {
    const handleBeforeUnload = () => {
      setIsChatOpen(false)
    }
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsChatOpen(false)
      }
    }

    const handleTabChange = () => {
      setIsChatOpen(false)
    }

    // Auto-minimize when user clicks on other tabs or navigates
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (isChatOpen && !target.closest('.ai-chat-container')) {
        setIsChatOpen(false)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleTabChange)
    document.addEventListener('click', handleClickOutside)
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleTabChange)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isChatOpen])

  // Smart Help Center Data
  const helpCategories = [
    { id: 'all', name: 'All Topics', icon: '📚' },
    { id: 'getting-started', name: 'Getting Started', icon: '🚀' },
    { id: 'features', name: 'Features', icon: '⭐' },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: '🔧' },
    { id: 'account', name: 'Account', icon: '👤' }
  ]

  const helpCards = [
    {
      id: 'getting-started',
      category: 'getting-started',
      title: 'Getting Started',
      description: 'New to LightUp? Learn how to create your account and start your faith journey.',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      steps: [
        'Create your account with Google or email',
        'Complete your profile with your interests',
        'Explore youth groups in your area',
        'Start your first prayer session',
        'Join the community and make connections'
      ],
      estimatedTime: '5 minutes',
      difficulty: 'Beginner'
    },
    {
      id: 'youth-groups',
      category: 'features',
      title: 'Youth Groups',
      description: 'Find and join Catholic youth groups in your area. Learn about group features and management.',
      icon: Users,
      color: 'from-green-500 to-green-600',
      steps: [
        'Browse available youth groups',
        'Filter by location and interests',
        'Request to join a group',
        'Participate in group activities',
        'Create your own group (if eligible)'
      ],
      estimatedTime: '10 minutes',
      difficulty: 'Easy'
    },
    {
      id: 'faithbot-ai',
      category: 'features',
      title: 'FaithBot AI',
      description: 'Get instant answers to your Catholic faith questions from our AI assistant.',
      icon: Bot,
      color: 'from-purple-500 to-purple-600',
      steps: [
        'Click on FaithBot in the navigation',
        'Type your faith-related question',
        'Get instant, accurate answers',
        'Ask follow-up questions',
        'Save important responses'
      ],
      estimatedTime: '2 minutes',
      difficulty: 'Easy'
    },
    {
      id: 'prayer-wall',
      category: 'features',
      title: 'Prayer Wall',
      description: 'Share prayer requests and pray for others in your Catholic community.',
      icon: Heart,
      color: 'from-red-500 to-red-600',
      steps: [
        'Visit the Prayer Wall page',
        'Read existing prayer requests',
        'Add your own prayer request',
        'Pray for others and mark as prayed',
        'Share encouraging messages'
      ],
      estimatedTime: '5 minutes',
      difficulty: 'Easy'
    },
    {
      id: 'faith-journal',
      category: 'features',
      title: 'Faith Journal',
      description: 'Document your spiritual journey with private reflections and prayers.',
      icon: PenTool,
      color: 'from-orange-500 to-orange-600',
      steps: [
        'Navigate to Faith Journal',
        'Create your first journal entry',
        'Set daily reflection reminders',
        'Track your spiritual growth',
        'Export your journal entries'
      ],
      estimatedTime: '8 minutes',
      difficulty: 'Easy'
    },
    {
      id: 'account-settings',
      category: 'account',
      title: 'Account Settings',
      description: 'Manage your profile, privacy settings, and account preferences.',
      icon: FileText,
      color: 'from-indigo-500 to-indigo-600',
      steps: [
        'Go to your profile page',
        'Update personal information',
        'Change privacy settings',
        'Manage notification preferences',
        'Update profile picture'
      ],
      estimatedTime: '3 minutes',
      difficulty: 'Easy'
    },
    {
      id: 'troubleshooting-login',
      category: 'troubleshooting',
      title: 'Login Issues',
      description: 'Having trouble logging in? Find solutions for common login problems.',
      icon: Shield,
      color: 'from-red-500 to-red-600',
      steps: [
        'Check your internet connection',
        'Clear browser cache and cookies',
        'Try using incognito/private mode',
        'Reset your password if needed',
        'Contact support if issues persist'
      ],
      estimatedTime: '5 minutes',
      difficulty: 'Easy'
    },
    {
      id: 'troubleshooting-groups',
      category: 'troubleshooting',
      title: 'Group Joining Problems',
      description: 'Can\'t join a youth group? Here are common solutions.',
      icon: Users,
      color: 'from-orange-500 to-orange-600',
      steps: [
        'Verify the group is still active',
        'Check if you meet age requirements',
        'Ensure your profile is complete',
        'Contact the group administrator',
        'Try refreshing the page'
      ],
      estimatedTime: '7 minutes',
      difficulty: 'Medium'
    },
    {
      id: 'troubleshooting-performance',
      category: 'troubleshooting',
      title: 'App Performance Issues',
      description: 'Is the app running slowly? Try these optimization tips.',
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
      steps: [
        'Close other browser tabs',
        'Update your browser to latest version',
        'Clear browser cache and cookies',
        'Restart your device',
        'Check your internet speed'
      ],
      estimatedTime: '4 minutes',
      difficulty: 'Easy'
    }
  ]

  // Smart Help Functions
  const filteredCards = helpCards.filter(card => {
    const matchesSearch = card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         card.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         card.steps.some(step => step.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || card.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleCardExpansion = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId)
  }

  const markGuideComplete = (cardId: string) => {
    if (!completedGuides.includes(cardId)) {
      setCompletedGuides([...completedGuides, cardId])
    } else {
      setCompletedGuides(completedGuides.filter(id => id !== cardId))
    }
  }

  const updateProgress = (cardId: string, stepIndex: number) => {
    setUserProgress({...userProgress, [cardId]: stepIndex + 1})
  }

  const getProgressPercentage = (cardId: string) => {
    const progress = userProgress[cardId] || 0
    const totalSteps = helpCards.find(card => card.id === cardId)?.steps.length || 0
    return totalSteps > 0 ? (progress / totalSteps) * 100 : 0
  }

  // Contact Form Handlers
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Form data object for developer visibility
    const formData = {
      ...contactForm,
      category: selectedCategory,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }
    
    // 🔍 DEVELOPER: Form data is logged here - check browser console!
    console.log('📝 CONTACT FORM SUBMISSION:', formData)
    console.log('📊 Form Data Summary:', {
      'User Name': formData.name,
      'Email': formData.email,
      'Category': formData.category,
      'Priority': formData.priority,
      'Message Length': formData.message.length,
      'Submitted At': formData.timestamp
    })
    
    alert('Message sent successfully! We\'ll get back to you within 24 hours.')
    setContactForm({ name: '', email: '', priority: 'Low - General question', message: '' })
    setSelectedCategory('other')
  }


  // Contact Form Functions
  const handleFormChange = (field: string, value: string) => {
    setContactForm(prev => ({ ...prev, [field]: value }))
  }



  // AI Response Logic
  const getAIResponse = (userMessage: string) => {
    const message = userMessage.toLowerCase()
    
    if (message.includes('create an account') || message.includes('sign up') || message.includes('register')) {
      return "To create an account:\n\n1. Click 'Sign Up' on the homepage\n2. Enter your email and create a password\n3. Verify your email address\n4. Complete your profile\n\nNeed help with any step? I'm here to guide you!"
    } else if (message.includes('forgot my password') || message.includes('password reset')) {
      return "No worries! Here's how to reset your password:\n\n1. Go to the Sign In page\n2. Click 'Forgot Password'\n3. Enter your email address\n4. Check your email for reset instructions\n5. Follow the link to create a new password\n\nCheck your spam folder if you don't see the email!"
    } else if (message.includes('join youth groups') || message.includes('youth group')) {
      return "Joining youth groups is easy:\n\n1. Visit the 'Youth Groups' page\n2. Browse groups in your area\n3. Click 'Request to Join' on any group\n4. Wait for approval from the group leader\n5. Start connecting with fellow Catholics!\n\nGroups are a great way to grow in faith together!"
    } else if (message.includes('post prayer requests') || message.includes('prayer wall')) {
      return "Sharing prayer requests:\n\n1. Go to the 'Prayer Wall' page\n2. Click 'Share Prayer Request'\n3. Write your prayer intention\n4. Choose to post anonymously or with your name\n5. Submit and others will pray for you\n\nYou can also pray for others by clicking on their requests!"
    } else if (message.includes('journal private') || message.includes('diary')) {
      return "Yes, your Faith Journal is completely private! 🔒\n\n• Only you can see your entries\n• Your thoughts and prayers are secure\n• No one else can access your journal\n• Perfect for personal reflection\n\nWrite freely about your faith journey - it's your sacred space!"
    } else if (message.includes('delete my account') || message.includes('delete account')) {
      return "To delete your account:\n\n1. Go to Settings in your profile\n2. Scroll to 'Account Management'\n3. Click 'Delete Account'\n4. Confirm your decision\n\n⚠️ This will permanently remove all your data including prayers, journal entries, and group memberships. This action cannot be undone."
    } else if (message.includes('contact support') || message.includes('support team')) {
      return "I can connect you with our support team:\n\n📧 Email: lightuphelps@gmail.com\n📱 Response time: Within 24 hours\n\nOr you can:\n• Use the Contact tab above\n• Click the email buttons in Privacy section\n• I can help you draft your message right now!"
    } else if (message.includes('faithbot') || message.includes('ai')) {
      return "FaithBot is our AI assistant for Catholic questions! 🤖\n\n• Ask about Catholic teachings\n• Get help with faith questions\n• Learn about saints and traditions\n• Available 24/7 on the FaithBot page\n\nIt's like having a knowledgeable friend to guide your faith journey!"
    } else if (message.includes('help') || message.includes('support')) {
      return "I'm here to help! You can ask me about:\n\n• Account issues\n• Feature guidance\n• Technical problems\n• Faith-related questions\n\nWhat specific help do you need? I'll guide you step by step!"
    } else {
      return "I understand you need help! While I'm learning, I can connect you with our support team for personalized assistance. Would you like me to help you contact them?"
    }
  }

  const handleSendMessage = (messageText?: string) => {
    const messageToSend = messageText || userInput
    if (!messageToSend.trim()) return

    const newMessage = {
      id: Date.now(),
      type: 'user',
      message: messageToSend,
      timestamp: new Date()
    }

    setChatMessages(prev => [...prev, newMessage])
    setUserInput('')
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'bot',
        message: getAIResponse(messageToSend),
        timestamp: new Date()
      }
      setChatMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const quickActions = [
    { text: "How do I create an account?", icon: Users },
    { text: "I forgot my password", icon: Shield },
    { text: "How to join youth groups?", icon: Heart },
    { text: "How to post prayer requests?", icon: MessageCircle },
    { text: "Is my journal private?", icon: BookOpen },
    { text: "How to delete my account?", icon: FileText },
    { text: "How to contact support?", icon: Mail },
    { text: "What is FaithBot?", icon: Bot }
  ]

  const handleQuickAction = (actionText: string) => {
    // Auto-send the message directly
    handleSendMessage(actionText)
  }

  // Handle URL hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash && ['help-center', 'contact', 'privacy'].includes(hash)) {
        setActiveTab(hash)
        // Smooth scroll to the tabs section
        setTimeout(() => {
          const tabsElement = document.getElementById('support-tabs')
          if (tabsElement) {
            tabsElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 100)
      }
    }

    // Check initial hash
    handleHashChange()

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange)
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <div className="mb-6">
            <SmartBackButton
              fallbackPath="/"
              showHomeButton={true}
            />
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
              <HelpCircle className="h-3 w-3 mr-1" />
              Support Center
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How can we help you?
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get help with your faith journey, find answers to common questions, and connect with our support team.
            </p>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" id="support-tabs">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="help-center" id="help-center">Help Center</TabsTrigger>
              <TabsTrigger value="contact" id="contact">Contact</TabsTrigger>
              <TabsTrigger value="privacy" id="privacy">Privacy</TabsTrigger>
            </TabsList>

            {/* Help Center Tab */}
            <TabsContent value="help-center" className="space-y-6">
              {/* Smart Search and Filters */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <HelpCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search help topics, guides, or ask a question..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 overflow-x-auto">
                    {helpCategories.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`whitespace-nowrap ${
                          selectedCategory === category.id
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 hover:bg-blue-50"
                        }`}
                      >
                        <span className="mr-2">{category.icon}</span>
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{completedGuides.length} guides completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>{filteredCards.length} topics available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>AI-powered assistance</span>
                  </div>
                </div>
              </div>

              {/* Smart Help Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCards.map((card) => {
                  const IconComponent = card.icon
                  const isExpanded = expandedCard === card.id
                  const isCompleted = completedGuides.includes(card.id)
                  const progress = getProgressPercentage(card.id)
                  
                  return (
                    <Card 
                      key={card.id} 
                      className={`hover:shadow-xl transition-all duration-300 cursor-pointer ${
                        isExpanded ? 'ring-2 ring-blue-500 shadow-xl' : 'hover:shadow-lg'
                      } ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-white'}`}
                      onClick={() => toggleCardExpansion(card.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-lg flex items-center justify-center mb-3`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          {isCompleted && (
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              ✓ Completed
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg font-semibold">{card.title}</CardTitle>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {card.description}
                        </p>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        {/* Progress Bar */}
                        {progress > 0 && (
                          <div className="mb-4">
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                              <span>Progress</span>
                              <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`bg-gradient-to-r ${card.color} h-2 rounded-full transition-all duration-300`}
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {/* Card Meta Info */}
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{card.estimatedTime}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {card.difficulty}
                          </Badge>
                        </div>

                        {/* Expanded Content */}
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <h4 className="font-semibold text-gray-800 mb-3">Step-by-Step Guide:</h4>
                            <div className="space-y-3">
                              {card.steps.map((step, index) => (
                                <div key={index} className="flex items-start gap-3">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                                    userProgress[card.id] > index 
                                      ? `bg-gradient-to-r ${card.color} text-white` 
                                      : 'bg-gray-100 text-gray-600'
                                  }`}>
                                    {userProgress[card.id] > index ? '✓' : index + 1}
                                  </div>
                                  <p className="text-sm text-gray-700 flex-1">{step}</p>
                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      updateProgress(card.id, index)
                                    }}
                                    className={`text-xs px-3 py-1 ${
                                      userProgress[card.id] > index 
                                        ? 'bg-green-500 text-white hover:bg-green-600' 
                                        : `bg-gradient-to-r ${card.color} text-white hover:opacity-90`
                                    } border-0 shadow-sm`}
                                  >
                                    {userProgress[card.id] > index ? '✓ Done' : '✓ Mark Done'}
                                  </Button>
                                </div>
                              ))}
                            </div>
                            
                            <div className="flex gap-2 mt-4">
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  markGuideComplete(card.id)
                                }}
                                className={`flex-1 font-semibold ${
                                  isCompleted 
                                    ? 'bg-green-100 text-green-800 hover:bg-green-200 border-green-300' 
                                    : `bg-gradient-to-r ${card.color} text-white hover:opacity-90 border-0 shadow-md`
                                }`}
                              >
                                {isCompleted ? '✓ Completed' : '✓ Mark Complete'}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSearchQuery('')
                                  setSelectedCategory('all')
                                  setExpandedCard(null)
                                  setUserProgress({...userProgress, [card.id]: 0})
                                  setCompletedGuides(completedGuides.filter(id => id !== card.id))
                                }}
                                className="px-3 border-gray-300 text-gray-700 hover:bg-gray-50"
                              >
                                Reset
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Collapsed View Button */}
                        {!isExpanded && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleCardExpansion(card.id)
                            }}
                          >
                            {progress > 0 ? `Continue (${Math.round(progress)}%)` : 'View Guide'}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* No Results */}
              {filteredCards.length === 0 && (
                <div className="text-center py-12">
                  <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No help topics found</h3>
                  <p className="text-gray-500 mb-4">
                    Try adjusting your search terms or category filter
                  </p>
                  <Button 
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedCategory('all')
                    }}
                    variant="outline"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent value="contact" className="space-y-6">
              {/* AI-Powered Contact Assistant */}
              <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-8 border border-blue-100">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bot className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">AI-Powered Contact Assistant</h2>
                  <p className="text-gray-600 text-lg">Get instant help with our intelligent support system</p>
                </div>

                {/* Smart Contact Form */}
                <div className="max-w-4xl mx-auto">
                  <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-8">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Side - Smart Form */}
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Tell us what you need help with</h3>
                            
                            {/* Smart Category Selection */}
                            <div className="mb-6">
                              <label className="text-sm font-medium text-gray-700 mb-3 block">What's your inquiry about?</label>
                              <div className="grid grid-cols-2 gap-3">
                                {[
                                  { id: 'account', label: 'Account Issues', icon: '👤', color: 'from-blue-500 to-blue-600' },
                                  { id: 'technical', label: 'Technical Support', icon: '🔧', color: 'from-green-500 to-green-600' },
                                  { id: 'feature', label: 'Feature Request', icon: '💡', color: 'from-purple-500 to-purple-600' },
                                  { id: 'bug', label: 'Bug Report', icon: '🐛', color: 'from-red-500 to-red-600' },
                                  { id: 'other', label: 'Other', icon: '❓', color: 'from-gray-500 to-gray-600' }
                                ].map((category) => (
                                  <button
                                    key={category.id}
                                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                      selectedCategory === category.id
                                        ? `border-blue-500 bg-blue-50 shadow-md`
                                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                    }`}
                                    onClick={() => setSelectedCategory(category.id)}
                                  >
                                    <div className="text-2xl mb-2">{category.icon}</div>
                                    <div className="text-sm font-medium text-gray-700">{category.label}</div>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Smart Form Fields */}
                            <form name="contactForm" onSubmit={handleFormSubmit} className="space-y-4">
                              <div>
                                <label className="text-sm font-medium text-gray-700">Your Name</label>
                                <input
                                  type="text"
                                  name="name"
                                  value={contactForm.name}
                                  onChange={(e) => handleFormChange('name', e.target.value)}
                                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50"
                                  placeholder="Enter your full name"
                                  required
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700">Email Address</label>
                                <input
                                  type="email"
                                  name="email"
                                  value={contactForm.email}
                                  onChange={(e) => handleFormChange('email', e.target.value)}
                                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50"
                                  placeholder="your.email@example.com"
                                  required
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700">Priority Level</label>
                                <select 
                                  name="priority"
                                  value={contactForm.priority}
                                  onChange={(e) => handleFormChange('priority', e.target.value)}
                                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50"
                                >
                                  <option>Low - General question</option>
                                  <option>Medium - Need assistance</option>
                                  <option>High - Urgent issue</option>
                                  <option>Critical - App not working</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700">Describe your issue</label>
                                <textarea
                                  name="message"
                                  value={contactForm.message}
                                  onChange={(e) => handleFormChange('message', e.target.value)}
                                  rows={4}
                                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 resize-none"
                                  placeholder="Please provide as much detail as possible..."
                                  required
                                />
                              </div>
                            </form>
                          </div>
                        </div>

                        {/* Right Side - AI Suggestions & Quick Actions */}
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">AI Suggestions</h3>
                            
                            {/* Smart Suggestions Based on Category */}
                            <div className="space-y-3 mb-6">
                              {selectedCategory === 'account' && (
                                <>
                                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                                    <div className="flex items-start gap-3">
                                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                                      <div>
                                        <div className="font-medium text-blue-800">Check your login credentials</div>
                                        <div className="text-sm text-blue-600">Make sure your email and password are correct</div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                                    <div className="flex items-start gap-3">
                                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                                      <div>
                                        <div className="font-medium text-blue-800">Try password reset</div>
                                        <div className="text-sm text-blue-600">Use the "Forgot Password" link on the login page</div>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                              {selectedCategory === 'technical' && (
                                <>
                                  <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                                    <div className="flex items-start gap-3">
                                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                                      <div>
                                        <div className="font-medium text-green-800">Clear browser cache</div>
                                        <div className="text-sm text-green-600">This often resolves loading and performance issues</div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                                    <div className="flex items-start gap-3">
                                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                                      <div>
                                        <div className="font-medium text-green-800">Check internet connection</div>
                                        <div className="text-sm text-green-600">Ensure you have a stable internet connection</div>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                              {selectedCategory === 'feature' && (
                                <>
                                  <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                                    <div className="flex items-start gap-3">
                                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                                      <div>
                                        <div className="font-medium text-purple-800">Describe your feature idea clearly</div>
                                        <div className="text-sm text-purple-600">Explain what you want and how it would help users</div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                                    <div className="flex items-start gap-3">
                                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                                      <div>
                                        <div className="font-medium text-purple-800">Explain the use case</div>
                                        <div className="text-sm text-purple-600">Describe when and why users would need this feature</div>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                              {selectedCategory === 'bug' && (
                                <>
                                  <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                                    <div className="flex items-start gap-3">
                                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                                      <div>
                                        <div className="font-medium text-red-800">Describe the bug clearly</div>
                                        <div className="text-sm text-red-600">What happened vs what you expected to happen</div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                                    <div className="flex items-start gap-3">
                                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                                      <div>
                                        <div className="font-medium text-red-800">Include steps to reproduce</div>
                                        <div className="text-sm text-red-600">Step-by-step instructions to recreate the issue</div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                                    <div className="flex items-start gap-3">
                                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                                      <div>
                                        <div className="font-medium text-red-800">Add device/browser info</div>
                                        <div className="text-sm text-red-600">Include your device type, browser, and version</div>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                              {selectedCategory === 'other' && (
                                <>
                                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <div className="flex items-start gap-3">
                                      <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                                      <div>
                                        <div className="font-medium text-gray-800">Be specific about your inquiry</div>
                                        <div className="text-sm text-gray-600">Provide detailed information about what you need help with</div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <div className="flex items-start gap-3">
                                      <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                                      <div>
                                        <div className="font-medium text-gray-800">Include relevant details</div>
                                        <div className="text-sm text-gray-600">Mention your device, browser, and any error messages</div>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>

                            {/* Quick Actions */}
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-3">Quick Actions</h4>
                              <div className="space-y-2">
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left h-auto p-4"
                                  onClick={() => setActiveTab('help-center')}
                                >
                                  <HelpCircle className="w-5 h-5 mr-3 text-blue-600" />
                                  <div>
                                    <div className="font-medium">Browse Help Center</div>
                                    <div className="text-sm text-gray-500">Find answers in our knowledge base</div>
                                  </div>
                                </Button>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left h-auto p-4"
                                  onClick={() => setIsChatOpen(true)}
                                >
                                  <MessageCircle className="w-5 h-5 mr-3 text-green-600" />
                                  <div>
                                    <div className="font-medium">Live Chat Support</div>
                                    <div className="text-sm text-gray-500">Get instant help from our AI assistant</div>
                                  </div>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <Button
                            type="submit"
                            form="contactForm"
                            size="lg"
                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <Send className="w-5 h-5 mr-2" />
                            Send Message with AI Analysis
                          </Button>
                          <Button
                            size="lg"
                            variant="outline"
                            className="px-8 py-4 rounded-xl border-2 border-gray-300 hover:border-gray-400"
                            onClick={() => {
                              setContactForm({ name: '', email: '', priority: 'Low - General question', message: '' })
                              setSelectedCategory('other')
                            }}
                          >
                            Clear Form
                          </Button>
                        </div>
                        <p className="text-sm text-gray-500 mt-3 text-center">
                          Our AI will analyze your message and provide instant suggestions before sending
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Contact Information Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                  <Card className="text-center p-6 bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                    <Mail className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-800 mb-2">Email Support</h4>
                    <p className="text-sm text-gray-600 mb-3">lightuphelps@gmail.com</p>
                    <Button size="sm" variant="outline" className="text-xs">
                      Send Email
                    </Button>
                  </Card>
                  <Card className="text-center p-6 bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                    <Phone className="w-8 h-8 text-green-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-800 mb-2">Phone Support</h4>
                    <p className="text-sm text-gray-600 mb-3">+1 (555) 123-4567</p>
                    <Button size="sm" variant="outline" className="text-xs">
                      Call Now
                    </Button>
                  </Card>
                  <Card className="text-center p-6 bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                    <Clock className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-800 mb-2">Support Hours</h4>
                    <p className="text-sm text-gray-600 mb-3">Mon-Fri: 9AM-6PM EST</p>
                    <Button size="sm" variant="outline" className="text-xs">
                      View Schedule
                    </Button>
                  </Card>
                  <Card className="text-center p-6 bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                    <MapPin className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-800 mb-2">Office Location</h4>
                    <p className="text-sm text-gray-600 mb-3">123 Faith Street, Catholic City</p>
                    <Button size="sm" variant="outline" className="text-xs">
                      Get Directions
                    </Button>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    Privacy Policy
                  </CardTitle>
                  <p className="text-sm text-gray-600">Effective Date: December 2024</p>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Our Commitment */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-900">Our Commitment to You</h3>
                    <p className="text-gray-700 leading-relaxed">
                      At LightUp, we believe your privacy is sacred. As a platform built for Catholic youth, 
                      we understand that your faith journey is deeply personal. This Privacy Policy explains 
                      how we collect, use, and protect your information while you grow in faith and connect 
                      with your community.
                    </p>
                  </div>

                  {/* Information We Collect */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">Information We Collect</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Account Information:</h4>
                        <p className="text-gray-700 text-sm">
                          Name, email address, and password (stored securely), parish information and location 
                          (if you choose to share), profile information like your bio and interests.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Faith Content:</h4>
                        <p className="text-gray-700 text-sm">
                          Prayer requests and responses, personal journal entries, youth group posts and discussions, 
                          quiz responses and faith journey progress, event participation and RSVPs.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Technical Data:</h4>
                        <p className="text-gray-700 text-sm">
                          Device information and browser type, IP address and general location, usage patterns 
                          and feature interactions, uploaded images and media files.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* How We Use Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">How We Use Your Information</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">Core Services:</h4>
                        <p className="text-gray-700 text-sm">
                          Create and maintain your account, enable community features and group participation, 
                          personalize your faith journey experience, send important updates and notifications.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">Community Building:</h4>
                        <p className="text-gray-700 text-sm">
                          Connect you with like-minded Catholic youth, facilitate prayer requests and spiritual 
                          support, organize events and youth group activities, provide faith-based content and resources.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Data Sharing */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">Who We Share Your Information With</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">We Don't Sell Your Data:</h4>
                        <p className="text-gray-700 text-sm">
                          We never sell, rent, or trade your personal information. We don't share your data with 
                          advertisers or marketers. Your faith content remains private to you and your chosen community.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">Required Service Providers:</h4>
                        <p className="text-gray-700 text-sm">
                          <strong>Supabase:</strong> Our secure database and authentication provider<br/>
                          <strong>Vercel:</strong> Our hosting platform (data processing only)<br/>
                          <strong>Google:</strong> For OAuth login (with your permission)<br/>
                          <strong>Gmail:</strong> For sending verification and notification emails
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Data Protection */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">How We Protect Your Data</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">Technical Safeguards:</h4>
                        <p className="text-gray-700 text-sm">
                          All data is encrypted in transit and at rest, Row Level Security (RLS) ensures data isolation, 
                          regular security audits and updates, secure authentication and access controls.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">Operational Safeguards:</h4>
                        <p className="text-gray-700 text-sm">
                          Limited access to authorized team members only, regular staff training on data protection, 
                          incident response procedures in place, regular backups and disaster recovery.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* User Rights */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">Your Rights and Choices</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">Access and Control:</h4>
                        <p className="text-gray-700 text-sm">
                          View and update your profile information, download your data (prayer requests, journal entries, etc.), 
                          delete your account and all associated data, control your privacy settings and visibility.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">Account Deletion:</h4>
                        <p className="text-gray-700 text-sm">
                          You can delete your account anytime. All your data will be permanently removed within 30 days. 
                          Some data may be retained for legal compliance.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Children's Privacy */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">Children's Privacy</h3>
                    <p className="text-gray-700 text-sm">
                      LightUp is designed for users 13 and older. We don't knowingly collect information from children 
                      under 13. If you're under 18, please get parental permission before creating an account.
                    </p>
                  </div>

                  {/* Contact Information */}
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Contact Us</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">Privacy Questions:</h4>
                        <p className="text-gray-700 text-sm">
                          Email: <span 
                            onClick={() => {
                              const email = 'lightuphelps@gmail.com';
                              const subject = 'Privacy Policy Question';
                              const body = 'Hi! I have a question about the Privacy Policy. Please help me with:';
                              const fullText = `To: ${email}\nSubject: ${subject}\n\n${body}`;
                              
                              navigator.clipboard.writeText(fullText).then(() => {
                                alert('Email details copied to clipboard! You can now paste them into your email client.');
                              }).catch(() => {
                                const textArea = document.createElement('textarea');
                                textArea.value = fullText;
                                document.body.appendChild(textArea);
                                textArea.select();
                                document.execCommand('copy');
                                document.body.removeChild(textArea);
                                alert('Email details copied to clipboard! You can now paste them into your email client.');
                              });
                            }}
                            className="text-blue-600 hover:underline font-medium cursor-pointer"
                          >
                            lightuphelps@gmail.com
                          </span><br/>
                          Subject: "Privacy Policy Question"
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">Data Requests:</h4>
                        <p className="text-gray-700 text-sm">
                          Email: <span 
                            onClick={() => {
                              const email = 'lightuphelps@gmail.com';
                              const subject = 'Data Request';
                              const body = 'Hi! I would like to request my data. Please provide:';
                              const fullText = `To: ${email}\nSubject: ${subject}\n\n${body}`;
                              
                              navigator.clipboard.writeText(fullText).then(() => {
                                alert('Email details copied to clipboard! You can now paste them into your email client.');
                              }).catch(() => {
                                const textArea = document.createElement('textarea');
                                textArea.value = fullText;
                                document.body.appendChild(textArea);
                                textArea.select();
                                document.execCommand('copy');
                                document.body.removeChild(textArea);
                                alert('Email details copied to clipboard! You can now paste them into your email client.');
                              });
                            }}
                            className="text-blue-600 hover:underline font-medium cursor-pointer"
                          >
                            lightuphelps@gmail.com
                          </span><br/>
                          Subject: "Data Request" (include your account email)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          const email = 'lightuphelps@gmail.com';
                          const subject = 'Privacy Policy Question';
                          const body = 'Hi! I have a question about the Privacy Policy. Please help me with:';
                          const fullText = `To: ${email}\nSubject: ${subject}\n\n${body}`;
                          
                          navigator.clipboard.writeText(fullText).then(() => {
                            alert('Email details copied to clipboard! You can now paste them into your email client.');
                          }).catch(() => {
                            // Fallback for older browsers
                            const textArea = document.createElement('textarea');
                            textArea.value = fullText;
                            document.body.appendChild(textArea);
                            textArea.select();
                            document.execCommand('copy');
                            document.body.removeChild(textArea);
                            alert('Email details copied to clipboard! You can now paste them into your email client.');
                          });
                        }}
                        className="flex items-center justify-center"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Contact Privacy Officer
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          const email = 'lightuphelps@gmail.com';
                          const subject = 'Data Request';
                          const body = 'Hi! I would like to request my data. Please provide:';
                          const fullText = `To: ${email}\nSubject: ${subject}\n\n${body}`;
                          
                          navigator.clipboard.writeText(fullText).then(() => {
                            alert('Email details copied to clipboard! You can now paste them into your email client.');
                          }).catch(() => {
                            // Fallback for older browsers
                            const textArea = document.createElement('textarea');
                            textArea.value = fullText;
                            document.body.appendChild(textArea);
                            textArea.select();
                            document.execCommand('copy');
                            document.body.removeChild(textArea);
                            alert('Email details copied to clipboard! You can now paste them into your email client.');
                          });
                        }}
                        className="flex items-center justify-center"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Request My Data
                      </Button>
                    </div>
                  </div>

                  {/* Trust Statement */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">Your Trust Matters</h4>
                    <p className="text-gray-700 text-sm">
                      We're committed to protecting your privacy because we understand that your faith journey is sacred. 
                      If you have any questions or concerns about this Privacy Policy, please don't hesitate to reach out. 
                      We're here to help and ensure your experience with LightUp is both meaningful and secure.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <BackToTop />

      {/* AI Support Assistant Chat */}
      <div className="fixed bottom-4 left-4 z-40 ai-chat-container">
        {/* Chat Toggle Button */}
        {!isChatOpen && (
          <Button
            onClick={() => setIsChatOpen(true)}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Bot className="w-7 h-7 text-white" />
          </Button>
        )}

        {/* Chat Interface - Mobile First */}
        {isChatOpen && (
          <div className="w-[calc(100vw-2rem)] max-w-md h-[calc(100vh-2rem)] max-h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bot className="w-6 h-6" />
                  <div>
                    <span className="font-semibold text-lg">AI Assistant</span>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs opacity-90">Online</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => setIsChatOpen(false)}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 p-2"
                  title="Minimize"
                >
                  <ChevronDown className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl ${
                      msg.type === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="text-sm leading-relaxed whitespace-pre-line">{msg.message}</div>
                    <div className="text-xs opacity-70 mt-2">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions - Compact */}
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <div className="mb-2">
                <h4 className="text-xs font-medium text-gray-600 mb-2">Quick Questions:</h4>
                <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction(action.text)}
                      className="w-full h-8 p-2 text-left justify-start whitespace-normal text-xs leading-tight bg-white hover:bg-blue-50 border-gray-300 hover:border-blue-300"
                    >
                      <action.icon className="w-3 h-3 mr-2 flex-shrink-0 text-blue-600" />
                      <span className="text-left text-gray-700 truncate">{action.text}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Input Area - Mobile Optimized */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!userInput.trim()}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-3 rounded-xl"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

