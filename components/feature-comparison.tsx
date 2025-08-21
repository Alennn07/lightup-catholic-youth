"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X, Star, Users, TrendingUp } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface App {
  id: string
  name: string
  description: string
  rating: number
  userCount: number
  features: string[]
  pricing: string
  category: string
}

export default function FeatureComparison() {
  const [apps, setApps] = useState<App[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRealApps()
  }, [])

  const fetchRealApps = async () => {
    try {
      // Fetch real app data from database
      const { data: appsData, error } = await supabase
        .from('apps')
        .select('*')
        .order('rating', { ascending: false })

      if (!error && appsData && appsData.length > 0) {
        const realApps: App[] = appsData.map((app: any) => ({
          id: app.id,
          name: app.name || '',
          description: app.description || '',
          rating: app.rating || 0,
          userCount: app.user_count || 0,
          features: app.features || [],
          pricing: app.pricing || 'Free',
          category: app.category || 'General'
        }))
        setApps(realApps)
      } else {
        // If no real data, show default empty state
        setApps([
          {
            id: "lightup",
            name: "LightUp",
            description: "Your Catholic youth community platform",
            rating: 0,
            userCount: 0,
            features: ["Prayer Wall", "Youth Groups", "Daily Bible Verse", "FaithBot AI"],
            pricing: "Free",
            category: "Catholic Youth"
          },
          {
            id: "other-apps",
            name: "Other Apps",
            description: "Generic faith and community apps",
            rating: 0,
            userCount: 0,
            features: ["Basic features", "Limited community", "Generic content"],
            pricing: "Mixed",
            category: "General"
          }
        ])
      }
    } catch (error) {
      console.error('Error fetching apps:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading comparison...</p>
      </div>
    )
  }

  const allFeatures = [...new Set(apps.flatMap(app => app.features))]

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          How LightUp Compares
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          See how LightUp stands out from other faith and community apps
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header Row */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center font-semibold text-gray-600">Features</div>
            {apps.map((app) => (
              <div key={app.id} className="text-center">
                <div className="font-bold text-lg text-gray-800">{app.name}</div>
                <div className="text-sm text-gray-500">{app.description}</div>
              </div>
            ))}
          </div>

          {/* Rating Row */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="flex items-center font-semibold text-gray-600">
              <Star className="h-4 w-4 mr-2 text-yellow-500" />
              Rating
            </div>
            {apps.map((app) => (
              <div key={app.id} className="text-center">
                <div className="flex items-center justify-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="font-semibold">{app.rating}</span>
                </div>
              </div>
            ))}
          </div>

          {/* User Count Row */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="flex items-center font-semibold text-gray-600">
              <Users className="h-4 w-4 mr-2 text-blue-500" />
              Users
            </div>
            {apps.map((app) => (
              <div key={app.id} className="text-center">
                <div className="flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="font-semibold">{app.userCount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Features Rows */}
          {allFeatures.map((feature) => (
            <div key={feature} className="grid grid-cols-3 gap-4 mb-4">
              <div className="font-semibold text-gray-600">{feature}</div>
              {apps.map((app) => (
                <div key={app.id} className="text-center">
                  {app.features.includes(feature) ? (
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  ) : (
                    <X className="h-5 w-5 text-red-500 mx-auto" />
                  )}
                </div>
              ))}
            </div>
          ))}

          {/* Pricing Row */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="font-semibold text-gray-600">Pricing</div>
            {apps.map((app) => (
              <div key={app.id} className="text-center">
                <Badge variant="outline" className="px-3 py-1">
                  {app.pricing}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-8">
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Ready to join LightUp?
            </h3>
            <p className="text-gray-600 mb-4">
              Start your faith journey with our Catholic youth community
            </p>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Get Started Free
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
