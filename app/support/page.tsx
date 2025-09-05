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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">Getting Started</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      New to LightUp? Learn how to create your account and start your faith journey.
                    </p>
                    <Button variant="outline" size="sm" className="border-gray-400 text-gray-700 hover:bg-gray-50 hover:border-gray-500 bg-white">View Guide</Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <CardTitle className="text-lg">Youth Groups</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Find and join Catholic youth groups in your area. Learn about group features and management.
                    </p>
                    <Button variant="outline" size="sm" className="border-gray-400 text-gray-700 hover:bg-gray-50 hover:border-gray-500 bg-white">Learn More</Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                      <MessageCircle className="w-6 h-6 text-purple-600" />
                    </div>
                    <CardTitle className="text-lg">FaithBot AI</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Get instant answers to your Catholic faith questions from our AI assistant.
                    </p>
                    <Button variant="outline" size="sm" className="border-gray-400 text-gray-700 hover:bg-gray-50 hover:border-gray-500 bg-white">Try FaithBot</Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-2">
                      <Heart className="w-6 h-6 text-red-600" />
                    </div>
                    <CardTitle className="text-lg">Prayer Wall</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Share prayer requests and pray for others in your Catholic community.
                    </p>
                    <Button variant="outline" size="sm" className="border-gray-400 text-gray-700 hover:bg-gray-50 hover:border-gray-500 bg-white">Visit Prayer Wall</Button>
                  </CardContent>
                </Card>



                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                      <PenTool className="w-6 h-6 text-orange-600" />
                    </div>
                    <CardTitle className="text-lg">Faith Journal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Document your spiritual journey with private reflections and prayers.
                    </p>
                    <Button variant="outline" size="sm" className="border-gray-400 text-gray-700 hover:bg-gray-50 hover:border-gray-500 bg-white">Start Journaling</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent value="contact" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-blue-600" />
                      Get in Touch
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-500" />
                      <div>
                        <div className="font-medium">Email Support</div>
                        <div className="text-sm text-gray-600">lightuphelps@gmail.com</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <div>
                        <div className="font-medium">Phone Support</div>
                        <div className="text-sm text-gray-600">+1 (555) 123-4567</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <div>
                        <div className="font-medium">Support Hours</div>
                        <div className="text-sm text-gray-600">Mon-Fri: 9AM-6PM EST</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-500" />
                      <div>
                        <div className="font-medium">Office Location</div>
                        <div className="text-sm text-gray-600">123 Faith Street, City, State</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Send us a Message</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Subject</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>General Question</option>
                        <option>Technical Issue</option>
                        <option>Feature Request</option>
                        <option>Account Help</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Message</label>
                      <textarea
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="How can we help you?"
                      />
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Send Message
                    </Button>
                  </CardContent>
                </Card>
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
      <div className="fixed bottom-4 left-4 z-40">
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
