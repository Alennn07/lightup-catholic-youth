"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Star } from "lucide-react"
import Link from "next/link"

interface FeatureCardProps {
  id: string
  name: string
  description: string
  category: string
  userCount: number
  rating: number
  icon: any
  color: string
  href: string
}

export function FeatureCard({
  id,
  name,
  description,
  category,
  userCount,
  rating,
  icon: Icon,
  color,
  href,
}: FeatureCardProps) {
  const IconComponent = Icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -5 }}
    >
      <Card className="h-full bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${color} flex items-center justify-center shadow-md`}>
              <IconComponent className="h-6 w-6 text-white" />
            </div>
            <Badge variant="outline" className="text-xs font-medium border-gray-200 text-gray-600">
              {category}
            </Badge>
          </div>
          <CardTitle className="text-lg font-bold text-gray-800 mb-3 line-clamp-2">
            {name}
          </CardTitle>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {description}
          </p>
        </CardHeader>
        
        <CardContent className="pt-0">
          {/* Stats */}
          <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-blue-500" />
              <span className="font-medium">{userCount.toLocaleString()} users</span>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-2 text-yellow-500" />
              <span className="font-semibold text-gray-700">{rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Progress bar for user adoption */}
          <div className="mb-5">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span className="font-medium">Adoption</span>
              <span className="font-medium">{userCount > 0 ? Math.min(100, Math.round((userCount / 1000) * 100)) : 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full bg-gradient-to-r ${color} transition-all duration-300`}
                style={{ width: `${userCount > 0 ? Math.min(100, Math.round((userCount / 1000) * 100)) : 0}%` }}
              />
            </div>
          </div>

          {/* Action Button */}
          <Link href={href} className="block">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 group-hover:shadow-lg transition-all duration-300 font-medium">
              Explore {name}
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  )
}
