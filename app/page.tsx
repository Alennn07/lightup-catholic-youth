"use client"

import { useState, useEffect } from "react"
import { ModernHero } from "@/components/modern-hero"
import { Navigation } from "@/components/navigation"
import { DailyBibleVerse } from "@/components/daily-bible-verse"
import { Heart, Users, BookOpen } from "lucide-react"
import { CommunitySection } from "@/components/community-section"
import { SimpleFooter } from "@/components/simple-footer"
import { supabase } from "@/lib/supabase"
import { useTranslation } from "@/lib/i18n"

interface Feature {
  id: string
  name: string
  description: string
  icon: any
  color: string
  userCount: number
  rating: number
  category: string
  href: string
}

interface Testimonial {
  name: string
  age: number
  location: string
  testimonial: string
  rating: number
  image: string
}

export default function HomePage() {
  const { t } = useTranslation()
  const [features, setFeatures] = useState<Feature[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRealData()
  }, [])

  const fetchRealData = async () => {
    try {
      // Fetch real feature statistics
      const { data: featuresData, error: featuresError } = await supabase
        .from('features')
        .select('*')
        .limit(3)

      if (!featuresError && featuresData) {
        const realFeatures: Feature[] = featuresData.map((feature: any) => ({
          id: feature.id || '',
          name: feature.name || '',
          description: feature.description || '',
          icon: getIconForFeature(feature.name || ''),
          color: getColorForFeature(feature.name || ''),
          userCount: feature.user_count || 0,
          rating: feature.rating || 0,
          category: feature.category || 'Community',
          href: `/dashboard#${feature.id || ''}`,
        }))
        setFeatures(realFeatures)
      }

      // Fetch real testimonials
      const { data: testimonialsData, error: testimonialsError } = await supabase
        .from('testimonials')
        .select('*')
        .limit(3)

      if (!testimonialsError && testimonialsData) {
        const realTestimonials: Testimonial[] = testimonialsData.map((testimonial: any) => ({
          name: testimonial.name || '',
          age: testimonial.age || 0,
          location: testimonial.location || '',
          testimonial: testimonial.content || '',
          rating: testimonial.rating || 0,
          image: testimonial.image_url || "/placeholder-user.jpg",
        }))
        setTestimonials(realTestimonials)
      }

      // If no real data, show default empty state
      if (!featuresData || featuresData.length === 0) {
        setFeatures([
          {
            id: "prayer-wall",
            name: t("homepage.features.prayerWall"),
            description: t("homepage.features.prayerWallDesc"),
            icon: Heart,
            color: "from-pink-500 to-rose-500",
            userCount: 0,
            rating: 0,
            category: "Community",
            href: "/dashboard#prayer-wall",
          },
          {
            id: "youth-groups",
            name: t("homepage.features.youthGroups"),
            description: t("homepage.features.youthGroupsDesc"),
            icon: Users,
            color: "from-blue-500 to-cyan-500",
            userCount: 0,
            rating: 0,
            category: "Community",
            href: "/dashboard#youth-groups",
          },
          {
            id: "daily-bible-verse",
            name: t("homepage.features.dailyBible"),
            description: t("homepage.features.dailyBibleDesc"),
            icon: BookOpen,
            color: "from-green-500 to-emerald-500",
            userCount: 0,
            rating: 0,
            category: "Spiritual",
            href: "/dashboard#bible-verse",
          },
        ])
      }

      if (!testimonialsData || testimonialsData.length === 0) {
        setTestimonials([
          {
            name: t("homepage.testimonials.beFirst"),
            age: 0,
            location: t("homepage.testimonials.beFirstDesc"),
            testimonial: t("homepage.testimonials.beFirstDesc"),
            rating: 0,
            image: "/placeholder-user.jpg",
          }
        ])
      }

    } catch (error) {
      console.error('Error fetching real data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getIconForFeature = (featureName: string) => {
    switch (featureName.toLowerCase()) {
      case 'prayer wall': return Heart
      case 'youth groups': return Users
      case 'daily bible verse': return BookOpen
      default: return Heart
    }
  }

  const getColorForFeature = (featureName: string) => {
    switch (featureName.toLowerCase()) {
      case 'prayer wall': return "from-pink-500 to-rose-500"
      case 'youth groups': return "from-blue-500 to-cyan-500"
      case 'daily bible verse': return "from-green-500 to-emerald-500"
      default: return "from-purple-500 to-pink-500"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading LightUp...</p>
          </div>
        </div>
      </div>
    )
  }

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
