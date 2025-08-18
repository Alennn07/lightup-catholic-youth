"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Star, MapPin } from "lucide-react"

interface TestimonialCardProps {
  name: string
  age: number
  location: string
  testimonial: string
  rating: number
  image: string
  index?: number
}

export default function TestimonialCard({
  name,
  age,
  location,
  testimonial,
  rating,
  image,
  index = 0,
}: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Card className="h-full bg-white hover:shadow-xl transition-all duration-300 group">
        <CardContent className="p-6">
          {/* Rating */}
          <div className="flex items-center mb-4">
            {[...Array(rating)].map((_, i) => (
              <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            ))}
          </div>

          {/* Testimonial */}
          <blockquote className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial}"</blockquote>

          {/* User Info */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">
                {name}, {age}
              </h4>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                {location}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
