"use client"

import { Navigation } from "@/components/navigation"
import { BackToTop } from "@/components/back-to-top"
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
} from "lucide-react"

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
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
          <Tabs defaultValue="help-center" className="w-full">
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
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Information We Collect</h3>
                    <p className="text-gray-600">
                      We collect information you provide directly to us, such as when you create an account, 
                      use our services, or contact us for support. This may include your name, email address, 
                      parish information, and any other information you choose to provide.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">How We Use Your Information</h3>
                    <p className="text-gray-600">
                      We use the information we collect to provide, maintain, and improve our services, 
                      to communicate with you, and to ensure the security of our platform. Your faith-related 
                      content is kept private and secure.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Data Security</h3>
                    <p className="text-gray-600">
                      We implement appropriate security measures to protect your personal information 
                      against unauthorized access, alteration, disclosure, or destruction. Your spiritual 
                      journey data is encrypted and stored securely.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Your Rights</h3>
                    <p className="text-gray-600">
                      You have the right to access, update, or delete your personal information. 
                      You can also control your privacy settings and choose what information to share 
                      with the community.
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button variant="outline" className="mr-4">
                      <FileText className="w-4 h-4 mr-2" />
                      Download Full Policy
                    </Button>
                    <Button variant="outline">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Privacy Officer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <BackToTop />
    </div>
  )
}
