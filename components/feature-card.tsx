"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight, Users, Star } from "lucide-react"

interface FeatureCardProps {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  userCount: number
  rating: number
  category: string
  href: string
  index?: number
}

export default function FeatureCard({
  id,
  name,
  description,
  icon: Icon,
  color,
  userCount,
  rating,
  category,
  href,
  index = 0,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <Card className="h-full bg-white/80 backdrop-blur-sm border-0 hover:shadow-xl transition-all duration-300 group">
        <CardHeader>
          <div className="flex items-start justify-between mb-4">
            <div
              className={`p-4 bg-gradient-to-r ${color} rounded-xl group-hover:scale-110 transition-transform duration-300`}
            >
              <Icon className="h-8 w-8 text-white" />
            </div>
            <Badge variant="outline" className="bg-gray-50">
              {category}
            </Badge>
          </div>
          <CardTitle className="text-xl text-gray-800 mb-2">{name}</CardTitle>
          <CardDescription className="text-gray-600 leading-relaxed">{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Stats */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-gray-600">
              <Users className="h-4 w-4" />
              {userCount.toLocaleString()} users
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-gray-700">{rating}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Popularity</span>
              <span className="text-gray-700 font-medium">{Math.round((userCount / 15000) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`bg-gradient-to-r ${color} h-2 rounded-full transition-all duration-1000`}
                style={{ width: `${Math.round((userCount / 15000) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Action Button */}
          <Link href={href}>
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white group-hover:shadow-lg transition-all duration-300">
              Try Now
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  )
}
