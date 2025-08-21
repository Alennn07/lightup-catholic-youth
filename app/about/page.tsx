"use client"

import { Navigation } from "@/components/navigation"
import { SimpleFooter } from "@/components/simple-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, Globe, Shield } from "lucide-react"

const values = [
  {
    icon: Heart,
    title: "Faith-Centered",
    description:
      "Everything we do is rooted in Catholic teachings and values, helping young people grow closer to God.",
  },
  {
    icon: Users,
    title: "Community-Driven",
    description:
      "We believe in the power of community and connection to strengthen faith and build lasting friendships.",
  },
  {
    icon: Globe,
    title: "Globally Connected",
    description: "Connecting Catholic youth from around the world, transcending geographical boundaries.",
  },
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "Providing a safe, moderated environment where young Catholics can share and grow together.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About LightUp</h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              LightUp was created to provide Catholic youth with a digital space to connect, grow in faith, and build
              meaningful relationships with other young Catholics around the world.
            </p>
          </div>

          {/* Mission */}
          <div className="max-w-4xl mx-auto mb-16">
            <Card className="bg-gray-50 border-0">
              <CardContent className="p-8 md:p-12 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  To empower Catholic youth to deepen their faith, build authentic community, and discover their purpose
                  through meaningful connections and spiritual growth tools designed for the digital age.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="bg-white border border-gray-100 shadow-sm">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                      <value.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Story */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Story</h2>
            <div className="prose prose-lg mx-auto text-gray-600">
              <p className="mb-6">
                LightUp began with a simple observation: young Catholics needed a dedicated space online where they
                could authentically connect with their faith and with each other.
              </p>
              <p className="mb-6">
                In a world where social media often feels superficial and disconnected from spiritual values, we wanted
                to create something different—a platform that would help young people grow in their relationship with
                God while building genuine friendships with others who share their beliefs.
              </p>
              <p>
                Today, LightUp serves thousands of Catholic youth worldwide, providing tools for prayer, community
                connection, spiritual growth, and faith exploration. We're committed to maintaining a safe, welcoming
                environment where every young Catholic can feel at home.
              </p>
            </div>
          </div>
        </div>
      </div>

      <SimpleFooter />
    </div>
  )
}
