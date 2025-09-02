"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Heart, Users, BookOpen, MessageCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useTranslation } from "@/lib/i18n"

export function ModernHero() {
  const { user, isLoading } = useAuth()
  const { t } = useTranslation()

  return (
    <section className="pt-20 sm:pt-24 pb-12 sm:pb-16 bg-white">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              {t("homepage.hero.title")}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
              {t("homepage.hero.subtitle")}
            </p>

            {/* CTA - Different buttons for logged in vs logged out users */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4">
              {isLoading ? (
                // Loading state - show skeleton buttons
                <>
                  <div className="w-32 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="w-32 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                </>
              ) : user ? (
                // Logged in user - show dashboard and profile buttons
                <>
                  <Link href="/dashboard">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 h-12 w-full sm:w-auto">
                      {t("navigation.dashboard")}
                    </Button>
                  </Link>
                  <Link href="/profile">
                    <Button size="lg" variant="outline" className="border-2 border-gray-400 text-gray-800 hover:bg-gray-100 hover:border-gray-600 hover:text-gray-900 px-6 sm:px-8 bg-white font-medium h-12 w-full sm:w-auto">
                      {t("navigation.profile")}
                    </Button>
                  </Link>
                </>
              ) : (
                // Not logged in - show sign up and sign in buttons
                <>
                  <Link href="/auth/sign-up">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 h-12 w-full sm:w-auto">
                      {t("homepage.hero.getStarted")}
                    </Button>
                  </Link>
                  <Link href="/auth/sign-in">
                    <Button size="lg" variant="outline" className="border-2 border-gray-400 text-gray-800 hover:bg-gray-100 hover:border-gray-600 hover:text-gray-900 px-6 sm:px-8 bg-white font-medium h-12 w-full sm:w-auto">
                      {t("navigation.signIn")}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>

          {/* Feature Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-16"
          >
            <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-100">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Heart className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">{t("homepage.features.prayerWall")}</h3>
                  <p className="text-xs text-gray-600 mt-1">Share & support</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">{t("homepage.features.youthGroups")}</h3>
                  <p className="text-xs text-gray-600 mt-1">Find community</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">{t("homepage.features.dailyBible")}</h3>
                  <p className="text-xs text-gray-600 mt-1">Scripture & reflection</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">{t("homepage.features.faithBot")}</h3>
                  <p className="text-xs text-gray-600 mt-1">Ask questions</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
