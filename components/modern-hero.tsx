"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Heart, Users, BookOpen, MessageCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function ModernHero() {
  const { user, isLoading } = useAuth()

  return (
    <section className="pt-24 pb-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              A place for Catholic youth to <span className="text-blue-600">connect</span> and{" "}
              <span className="text-purple-600">grow</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Share prayers, find community, explore your faith, and connect with other young Catholics around the
              world.
            </p>

            {/* CTA - Different buttons for logged in vs logged out users */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
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
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Link href="/profile">
                    <Button size="lg" variant="outline" className="border-2 border-gray-400 text-gray-800 hover:bg-gray-100 hover:border-gray-600 hover:text-gray-900 px-8 bg-white font-medium">
                      View Profile
                    </Button>
                  </Link>
                </>
              ) : (
                // Not logged in - show sign up and sign in buttons
                <>
                  <Link href="/auth/sign-up">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/auth/sign-in">
                    <Button size="lg" variant="outline" className="border-2 border-gray-400 text-gray-800 hover:bg-gray-100 hover:border-gray-600 hover:text-gray-900 px-8 bg-white font-medium">
                      Sign In
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
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Heart className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">Prayer Wall</h3>
                  <p className="text-xs text-gray-600 mt-1">Share & support</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">Youth Groups</h3>
                  <p className="text-xs text-gray-600 mt-1">Find community</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">Daily Verse</h3>
                  <p className="text-xs text-gray-600 mt-1">Scripture & reflection</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">FaithBot</h3>
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
