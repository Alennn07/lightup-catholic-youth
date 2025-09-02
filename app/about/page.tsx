"use client"

import { Navigation } from "@/components/navigation"
import { BackToTop } from "@/components/back-to-top"
import { SimpleFooter } from "@/components/simple-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, Globe, Shield } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

// Values will be defined inside the component to use translations

export default function AboutPage() {
  const { t } = useTranslation()
  
  const values = [
    {
      icon: Heart,
      title: t("about.values.faithCentered.title"),
      description: t("about.values.faithCentered.description"),
    },
    {
      icon: Users,
      title: t("about.values.communityDriven.title"),
      description: t("about.values.communityDriven.description"),
    },
    {
      icon: Globe,
      title: t("about.values.globallyConnected.title"),
      description: t("about.values.globallyConnected.description"),
    },
    {
      icon: Shield,
      title: t("about.values.safeSecure.title"),
      description: t("about.values.safeSecure.description"),
    },
  ]
  
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{t("about.title")}</h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t("about.subtitle")}
            </p>
          </div>

          {/* Mission */}
          <div className="max-w-4xl mx-auto mb-16">
            <Card className="bg-gray-50 border-0">
              <CardContent className="p-8 md:p-12 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{t("about.mission.title")}</h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {t("about.mission.description")}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">{t("about.values.title")}</h2>
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

      <BackToTop />
      <SimpleFooter />
    </div>
  )
}
