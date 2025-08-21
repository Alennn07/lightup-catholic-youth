"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, User } from "lucide-react"
import Image from "next/image"

interface TestimonialCardProps {
  name: string
  age: number
  location: string
  testimonial: string
  rating: number
  image: string
}

export function TestimonialCard({
  name,
  age,
  location,
  testimonial,
  rating,
  image,
}: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -5 }}
    >
      <Card className="h-full bg-white/80 backdrop-blur-sm border-0 hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className="relative">
              <Image
                src={image}
                alt={name}
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
              {age > 0 && (
                <Badge variant="outline" className="absolute -bottom-1 -right-1 text-xs px-1 py-0">
                  {age}
                </Badge>
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800 mb-1">{name}</h4>
              {location && location !== "Join our community" && (
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-3 w-3 mr-1" />
                  {location}
                </div>
              )}
            </div>
          </div>

          {/* Rating */}
          {rating > 0 && (
            <div className="flex items-center mb-3">
              {[...Array(rating)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              ))}
              {[...Array(5 - rating)].map((_, i) => (
                <Star key={i + rating} className="h-4 w-4 text-gray-300" />
              ))}
            </div>
          )}

          {/* Testimonial Content */}
          <div className="relative">
            <div className="text-gray-600 leading-relaxed mb-4">
              {testimonial}
            </div>
            
            {/* Quote marks */}
            <div className="absolute -top-2 -left-2 text-4xl text-blue-200 font-serif">
              "
            </div>
            <div className="absolute -bottom-2 -right-2 text-4xl text-blue-200 font-serif">
              "
            </div>
          </div>

          {/* Call to action for empty testimonials */}
          {name === "Be the first!" && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700 text-center">
                Share your experience and inspire others in our community!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
