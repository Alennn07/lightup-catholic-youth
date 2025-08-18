"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Heart, Users, BookOpen, Calendar, BrainCircuit, Music } from "lucide-react"

const featuredItems = [
  {
    icon: Heart,
    title: "Prayer Wall",
    description: "Share prayer requests and support others",
    color: "from-red-500 to-pink-500",
  },
  {
    icon: Users,
    title: "Youth Groups",
    description: "Find and join Catholic youth communities",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: BookOpen,
    title: "Daily Bible Verse",
    description: "Start each day with God's word",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Calendar,
    title: "Parish Events",
    description: "Stay updated with local activities",
    color: "from-purple-500 to-violet-500",
  },
  {
    icon: BrainCircuit,
    title: "FaithBot AI",
    description: "Get instant answers to faith questions",
    color: "from-orange-500 to-amber-500",
  },
  {
    icon: Music,
    title: "Worship Songs",
    description: "Access Catholic hymns and songs",
    color: "from-indigo-500 to-blue-500",
  },
]

export function FeaturedSection() {
  return (
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Everything You Need in{" "}
          <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">One Place</span>
        </h2>
        <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
          Discover all the tools and features designed to help Catholic youth grow in faith and community.
        </p>
        <Link href="/dashboard">
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            Try Dashboard Now
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredItems.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 group">
              <CardContent className="p-6">
                <div
                  className={`w-16 h-16 mb-6 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-blue-100">{item.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
