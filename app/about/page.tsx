"use client"

import { Navigation } from "@/components/navigation"
import { BackToTop } from "@/components/back-to-top"
import { SimpleFooter } from "@/components/simple-footer"
import { SmartBackButton } from "@/components/smart-back-button"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Users, Globe, Shield, Star, BookOpen, Sparkles, Quote } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import { motion } from "framer-motion"
import VolunteerForm from "@/components/volunteer-form"

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-yellow-400/10 to-orange-400/10 rounded-full blur-3xl"></div>
      </div>

      <Navigation />

      <div className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <SmartBackButton
              fallbackPath="/"
              showHomeButton={true}
            />
          </motion.div>

          {/* Hero Section - Premium Glass Design */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-20"
          >
            {/* Premium Glass Badge */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-8 py-4 mb-12 shadow-2xl"
            >
              <Sparkles className="w-6 h-6 text-purple-600" />
              <span className="text-gray-800 font-semibold text-lg font-nunito-sans">Empowering Catholic Youth</span>
            </motion.div>

            {/* Premium Typography with Animation - Mobile Optimized */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mb-12"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-gray-900 mb-6 font-outfit tracking-tight px-2">
                Building Faith
              </h1>
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: 0.8 }}
                className="flex items-center justify-center gap-4 sm:gap-6 mb-6 px-4"
              >
                <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-pink-500" />
                </motion.div>
                <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
              </motion.div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent font-outfit tracking-tight px-2">
                One Connection at a Time
              </h2>
            </motion.div>

            {/* Premium Mission Statement - Mobile Optimized */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="max-w-4xl mx-auto mb-16 px-4"
            >
              <p className="text-lg sm:text-xl md:text-2xl text-gray-700 leading-relaxed font-nunito-sans font-light">
                We're not just another app - we're a movement. A place where young Catholics can find their tribe, 
                grow in their faith, and make a real difference in the world.
              </p>
            </motion.div>

            {/* Premium Feature Showcase - Glass Morphism - Mobile Optimized */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="relative max-w-6xl mx-auto px-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                <motion.div
                  whileHover={{ y: -10, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500 group">
                    <CardContent className="p-6 sm:p-8 text-center">
                      <motion.div 
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg"
                      >
                        <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </motion.div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 font-outfit">Prayer & Reflection</h3>
                      <p className="text-gray-700 font-nunito-sans text-base sm:text-lg">Daily moments with God</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  whileHover={{ y: -10, scale: 1.02 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Card className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500 group">
                    <CardContent className="p-6 sm:p-8 text-center">
                      <motion.div 
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg"
                      >
                        <Users className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </motion.div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 font-outfit">Community</h3>
                      <p className="text-gray-700 font-nunito-sans text-base sm:text-lg">Connect with like-minded peers</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  whileHover={{ y: -10, scale: 1.02 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="sm:col-span-2 md:col-span-1"
                >
                  <Card className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500 group">
                    <CardContent className="p-6 sm:p-8 text-center">
                      <motion.div 
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg"
                      >
                        <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </motion.div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 font-outfit">Growth</h3>
                      <p className="text-gray-700 font-nunito-sans text-base sm:text-lg">Learn and deepen your faith</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Values Section - Premium Glass */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-outfit">Our Values</h2>
              <p className="text-xl text-gray-700 font-nunito-sans font-light">The principles that guide everything we do</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -15, scale: 1.05 }}
                >
                  <Card className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500 group h-full">
                    <CardContent className="p-8 text-center h-full flex flex-col">
                      <motion.div 
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl"
                      >
                        <value.icon className="h-8 w-8 text-white" />
                      </motion.div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 font-outfit">{value.title}</h3>
                      <p className="text-gray-700 leading-relaxed font-nunito-sans flex-grow">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Story Section - Premium Timeline */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto mb-20"
          >
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-outfit">Our Journey</h2>
              <p className="text-xl text-gray-700 font-nunito-sans font-light">From idea to impact</p>
            </motion.div>
            
            {/* Premium Timeline - Mobile Optimized */}
            <div className="relative">
              {/* Premium Timeline Line - Desktop Only - Continuous */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-2 h-full bg-gradient-to-b from-purple-500 via-pink-500 to-green-500 rounded-full shadow-lg z-0"></div>
              
              {/* Desktop Timeline Icons - Positioned on the continuous line */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-2 h-full z-10">
                {/* Icon 1 - The Spark - Aligned with first card */}
                <motion.div 
                  whileHover={{ scale: 1.2 }}
                  className="absolute top-[20%] transform -translate-y-1/2 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl -ml-5 cursor-pointer"
                >
                  <Heart className="w-6 h-6 text-white" />
                </motion.div>
                {/* Icon 2 - The Vision - Aligned with second card */}
                <motion.div 
                  whileHover={{ scale: 1.2 }}
                  className="absolute top-[50%] transform -translate-y-1/2 w-12 h-12 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl -ml-5 cursor-pointer"
                >
                  <Star className="w-6 h-6 text-white" />
                </motion.div>
                {/* Icon 3 - The Reality - Aligned with third card */}
                <motion.div 
                  whileHover={{ scale: 1.2 }}
                  className="absolute top-[80%] transform -translate-y-1/2 w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl -ml-5 cursor-pointer"
                >
                  <Users className="w-6 h-6 text-white" />
                </motion.div>
              </div>
              
              {/* Timeline Items - Mobile First */}
              <div className="space-y-16 md:space-y-20">
                {/* Item 1 */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="flex flex-col md:flex-row md:items-center relative"
                >
                  <div className="w-full md:w-1/2 md:pr-12 text-center md:text-right">
                    <Card className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500 group">
                      <CardContent className="p-6 md:p-8">
                        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                          <div className="w-16 h-16 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <Heart className="w-8 h-8 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <h3 className="text-3xl sm:text-2xl font-bold text-gray-900 font-outfit">The Spark</h3>
                        </div>
                        <p className="text-gray-700 font-nunito-sans text-xl sm:text-lg leading-relaxed">
                          A group of young Catholics noticed their peers struggling to stay connected to their faith in our digital world.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="w-full md:w-1/2 md:pl-12"></div>
                </motion.div>

                {/* Item 2 */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="flex flex-col md:flex-row md:items-center relative"
                >
                  <div className="w-full md:w-1/2 md:pr-12"></div>
                  
                  
                  <div className="w-full md:w-1/2 md:pl-12 text-center md:text-left">
                    <Card className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500 group">
                      <CardContent className="p-6 md:p-8">
                        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                          <div className="w-16 h-16 sm:w-12 sm:h-12 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                            <Star className="w-8 h-8 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <h3 className="text-3xl sm:text-2xl font-bold text-gray-900 font-outfit">The Vision</h3>
                        </div>
                        <p className="text-gray-700 font-nunito-sans text-xl sm:text-lg leading-relaxed">
                          We dreamed of creating a space where faith meets technology, where young Catholics could grow together.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>

                {/* Item 3 */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  viewport={{ once: true }}
                  className="flex flex-col md:flex-row md:items-center relative"
                >
                  <div className="w-full md:w-1/2 md:pr-12 text-center md:text-right">
                    <Card className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500 group">
                      <CardContent className="p-6 md:p-8">
                        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                          <div className="w-16 h-16 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                            <Users className="w-8 h-8 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <h3 className="text-3xl sm:text-2xl font-bold text-gray-900 font-outfit">The Reality</h3>
                        </div>
                        <p className="text-gray-700 font-nunito-sans text-xl sm:text-lg leading-relaxed">
                          Today, thousands of young Catholics worldwide are growing in faith and building meaningful connections through LightUp.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="w-full md:w-1/2 md:pl-12"></div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Continue the Journey - Perfect Story Conclusion */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative w-full"
          >
            {/* Journey Container */}
            <div className="relative bg-gradient-to-br from-white/30 via-white/20 to-white/10 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl overflow-hidden">
              {/* Subtle Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 left-10 w-32 h-32 border border-purple-300 rounded-full"></div>
                <div className="absolute bottom-10 right-10 w-24 h-24 border border-pink-300 rounded-full"></div>
                <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-blue-300 rounded-full"></div>
              </div>

              <div className="relative p-12 md:p-20 text-center">
                {/* Story Continuation Header */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="mb-12"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-6 py-3 mb-8 shadow-lg"
                  >
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                    >
                      <Star className="w-3 h-3 text-white" />
                    </motion.div>
                    <span className="text-gray-800 font-semibold font-nunito-sans">The Story Continues</span>
                  </motion.div>

                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-outfit">
                    Continue the Journey
                  </h2>
                  <p className="text-xl text-gray-700 font-nunito-sans font-light max-w-3xl mx-auto leading-relaxed">
                    The story doesn't end here. Help us write the next chapter and reach more young Catholics around the world.
                  </p>
                </motion.div>

                {/* Dynamic Impact - Real Community Growth */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="mb-12"
                >
                  <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-8 shadow-lg">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 font-outfit">Growing Community</h3>
                      <p className="text-gray-700 font-nunito-sans">
                        Every day, more young Catholics are finding their faith home with us. 
                        Be part of this beautiful journey.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Volunteer Form */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  viewport={{ once: true }}
                  className="flex justify-center"
                >
                  <VolunteerForm />
                </motion.div>

                {/* Inspirational Quote */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  viewport={{ once: true }}
                  className="mt-12"
                >
                  <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-8 max-w-3xl mx-auto">
                    <p className="text-gray-800 italic text-lg font-nunito-sans leading-relaxed">
                      "The future belongs to those who believe in the beauty of their dreams and are willing to work together to make them reality."
                    </p>
                    <p className="text-gray-600 text-sm mt-4 font-nunito-sans">Join us in building something beautiful for Catholic youth worldwide</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <BackToTop />
      <SimpleFooter />
    </div>
  )
}
