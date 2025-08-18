"use client"

import { ModernHero } from "@/components/modern-hero"
import { Navigation } from "@/components/navigation"
import { DailyBibleVerse } from "@/components/daily-bible-verse"
import { Heart, Users, BookOpen } from "lucide-react"
import { CommunitySection } from "@/components/community-section"
import { SimpleFooter } from "@/components/simple-footer"

const features = [
  {
    id: "prayer-wall",
    name: "Prayer Wall",
    description: "Share prayer requests and pray for others in your Catholic youth community.",
    icon: Heart,
    color: "from-pink-500 to-rose-500",
    userCount: 12300,
    rating: 4.9,
    category: "Community",
    href: "/dashboard#prayer-wall",
  },
  {
    id: "youth-groups",
    name: "Youth Group Finder",
    description: "Discover and connect with Catholic youth groups in your area.",
    icon: Users,
    color: "from-blue-500 to-cyan-500",
    userCount: 5600,
    rating: 4.7,
    category: "Community",
    href: "/dashboard#youth-groups",
  },
  {
    id: "daily-bible-verse",
    name: "Daily Bible Verse",
    description: "Start each day with inspiring scripture and thoughtful reflections.",
    icon: BookOpen,
    color: "from-green-500 to-emerald-500",
    userCount: 8500,
    rating: 4.8,
    category: "Spiritual",
    href: "/dashboard#bible-verse",
  },
]

const testimonials = [
  {
    name: "Maria Rodriguez",
    age: 19,
    location: "Los Angeles, CA",
    testimonial:
      "LightUp has completely transformed my prayer life. The Prayer Wall feature helps me feel connected to other young Catholics around the world.",
    rating: 5,
    image: "/young-latina-woman.png",
  },
  {
    name: "David Chen",
    age: 17,
    location: "New York, NY",
    testimonial:
      "Finding a youth group was so hard until I discovered LightUp. Now I'm part of an amazing Catholic community!",
    rating: 5,
    image: "/young-asian-man.png",
  },
  {
    name: "Isabella Santos",
    age: 20,
    location: "Miami, FL",
    testimonial:
      "The daily Bible verses and FaithBot AI have helped me understand my faith so much better. This app is a game-changer!",
    rating: 5,
    image: "/young-hispanic-woman.png",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <ModernHero />
      
      {/* Daily Bible Verse Section - Visible to Everyone */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Today's Bible Verse
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start your day with inspiration from God's Word. A daily verse to guide and encourage your faith journey.
            </p>
          </div>
          <DailyBibleVerse />
        </div>
      </section>
      
      <CommunitySection />
      <SimpleFooter />
    </div>
  )
}
