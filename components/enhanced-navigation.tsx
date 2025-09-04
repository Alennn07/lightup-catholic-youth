"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, Menu, X, ChevronDown, User, LogOut, Settings, LayoutDashboard } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { useNavigationGuard } from "@/hooks/use-navigation-guard"
import { useSmoothNavigation } from "@/hooks/use-smooth-navigation"
import { useFocusManagement } from "@/hooks/use-focus-management"
import { useRoutePreloading } from "@/components/lazy-page"
import { LanguageSwitcher } from "@/components/language-switcher"
import { GlobalSearch } from "@/components/global-search"
import { SkipLink } from "@/components/skip-link"

export function EnhancedNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { user, logout, isLoading } = useAuth()
  const { safeNavigate, safeGoBack } = useNavigationGuard()
  const { smoothNavigate } = useSmoothNavigation()
  const { skipLinkRef, mainContentRef } = useFocusManagement()
  const { preloadOnHover } = useRoutePreloading()

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/features", label: "Features" },
    { href: "/community", label: "Community" },
    { href: "/search", label: "Search" },
    { href: "/about", label: "About" },
  ]

  const supportItems = [
    { href: "/support#help-center", label: "Help Center" },
    { href: "/support#contact", label: "Contact" },
    { href: "/support#privacy", label: "Privacy" },
  ]

  const handleSignOut = async () => {
    try {
      await logout()
      setIsProfileOpen(false)
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const handleNavigation = useCallback(async (href: string) => {
    await safeNavigate(href)
    setIsOpen(false)
  }, [safeNavigate])

  const handleBackNavigation = useCallback(async () => {
    await safeGoBack('/')
  }, [safeGoBack])

  const handleSmoothNavigation = useCallback(async (href: string) => {
    await smoothNavigate(href, {
      duration: 300,
      scrollToTop: true
    })
    setIsOpen(false)
  }, [smoothNavigate])

  // Preload routes on hover
  const handleMouseEnter = useCallback((href: string) => {
    const cleanup = preloadOnHover(href)
    return cleanup
  }, [preloadOnHover])

  return (
    <>
      <SkipLink ref={skipLinkRef} />
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center space-x-2 flex-shrink-0"
              onClick={() => handleSmoothNavigation('/')}
            >
              <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <span className="text-lg md:text-xl font-bold text-gray-900">LightUp</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden xl:flex items-center space-x-1 ml-8">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavigation(item.href)}
                  onMouseEnter={() => handleMouseEnter(item.href)}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium whitespace-nowrap"
                >
                  {item.label}
                </button>
              ))}

              {/* Support Dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium whitespace-nowrap">
                  <span>Support</span>
                  <ChevronDown className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180" />
                </button>
                
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {supportItems.map((item) => (
                    <button
                      key={item.href}
                      onClick={() => handleNavigation(item.href)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Global Search */}
            <div className="hidden md:block flex-1 max-w-lg mx-6">
              <GlobalSearch 
                placeholder="Search prayers, journal, groups..."
                className="w-full"
              />
            </div>

            {/* Desktop Auth & Profile */}
            <div className="hidden md:flex items-center space-x-2 flex-shrink-0">
              <LanguageSwitcher />
              {isLoading ? (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="w-20 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="w-20 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              ) : (
                <>
                  {user ? (
                    <div className="relative">
                      <button
                        onClick={toggleProfile}
                        className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                          </span>
                        </div>
                        <span className="hidden lg:block text-sm">{user.username ? `@${user.username}` : (user.name || 'Set Your Name')}</span>
                        <ChevronDown className="h-3 w-3 transition-transform duration-200" />
                      </button>

                      {/* Profile Dropdown */}
                      <AnimatePresence>
                        {isProfileOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                          >
                            <div className="p-4 border-b border-gray-100">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                  <span className="text-white text-lg font-semibold">
                                    {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                                  </span>
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {user.username ? `@${user.username}` : (user.name || 'Set Your Name')}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {user.name && user.username ? `${user.name} • Signed in` : 
                                     user.name ? 'Signed in' : 'Click Profile to set your name'}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="p-2">
                              <button
                                onClick={() => handleNavigation('/dashboard')}
                                className="flex items-center space-x-3 w-full px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              >
                                <LayoutDashboard className="h-4 w-4" />
                                <span>Dashboard</span>
                              </button>
                              
                              <button
                                onClick={() => handleNavigation('/profile')}
                                className="flex items-center space-x-3 w-full px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              >
                                <User className="h-4 w-4" />
                                <span>Profile</span>
                              </button>
                              
                              <button
                                onClick={() => handleNavigation('/settings')}
                                className="flex items-center space-x-3 w-full px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              >
                                <Settings className="h-4 w-4" />
                                <span>Settings</span>
                              </button>
                            </div>
                            
                            <div className="p-2 border-t border-gray-100">
                              <button
                                onClick={handleSignOut}
                                className="flex items-center space-x-3 w-full px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                              >
                                <LogOut className="h-4 w-4" />
                                <span>Sign Out</span>
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => handleNavigation('/auth/sign-in')}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => handleNavigation('/auth/sign-up')}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                      >
                        Join Us
                      </button>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation flex-shrink-0"
              aria-label="Toggle mobile menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-t border-gray-200"
              >
                <div className="py-4 space-y-1">
                  {/* Mobile Search */}
                  <div className="px-4 mb-4">
                    <GlobalSearch 
                      placeholder="Search prayers, journal, groups..."
                      className="w-full"
                    />
                  </div>

                  {navItems.map((item) => (
                    <button
                      key={item.href}
                      onClick={() => handleNavigation(item.href)}
                      className="block w-full text-left px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}

                  {/* Mobile Support Section */}
                  <div className="px-4 py-2">
                    <div className="text-sm font-medium text-gray-500 mb-2">Support</div>
                    {supportItems.map((item) => (
                      <button
                        key={item.href}
                        onClick={() => handleNavigation(item.href)}
                        className="block w-full text-left px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors ml-4"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  {/* Mobile Auth Section */}
                  <div className="px-4 pt-4 border-t border-gray-100 space-y-2">
                    {isLoading ? (
                      <div className="space-y-2">
                        <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                        <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                      </div>
                    ) : (
                      <>
                        {user ? (
                          <>
                            <div className="px-4 py-2 bg-gray-50 rounded-lg">
                              <div className="font-medium text-gray-900">
                                {user.username ? `@${user.username}` : (user.name || 'Set Your Name')}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.name && user.username ? `${user.name} • Signed in` : 
                                 user.name ? 'Signed in' : 'Click Profile to set your name'}
                              </div>
                            </div>
                            
                            <button 
                              onClick={() => handleNavigation('/dashboard')}
                              className="w-full text-left px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                              Dashboard
                            </button>
                            
                            <button 
                              onClick={() => handleNavigation('/profile')}
                              className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              Profile
                            </button>
                            
                            <button 
                              onClick={() => handleNavigation('/settings')}
                              className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              Settings
                            </button>
                            
                            <button 
                              onClick={handleSignOut}
                              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              Sign Out
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => handleNavigation('/auth/sign-in')}
                              className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              Sign In
                            </button>
                            <button 
                              onClick={() => handleNavigation('/auth/sign-up')}
                              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                              Join Us
                            </button>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
      
      {/* Main content reference for focus management */}
      <div ref={mainContentRef} tabIndex={-1} id="main-content" className="sr-only" />
    </>
  )
}
