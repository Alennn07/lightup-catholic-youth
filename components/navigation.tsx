"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, Menu, X, ChevronDown, User, LogOut, Settings, LayoutDashboard } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { logIfEnabled } from "@/lib/performance-monitor"
import { GlobalSearch } from "@/components/global-search"
import { NavbarLogo } from "@/components/navbar-logo"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { user, logout, isLoading } = useAuth()

  // Force re-render when user data changes
  useEffect(() => {
    logIfEnabled(`Navigation: User data updated: ${JSON.stringify(user)}`)
  }, [user])

  const toggleMenu = () => setIsOpen(!isOpen)
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen)

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/features", label: "Features" },
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
      logIfEnabled(`Error signing out: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error')
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <NavbarLogo textColor="text-gray-800" />
          </Link>

          {/* Medium Screen Navigation (shows only key items) */}
          <div className="hidden md:flex xl:hidden items-center space-x-1 ml-4">
            <Link
              href="/"
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium whitespace-nowrap"
            >
              Home
            </Link>
            <Link
              href="/features"
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium whitespace-nowrap"
            >
              Features
            </Link>
          </div>

          {/* Large Screen Navigation (shows all items) */}
          <div className="hidden xl:flex items-center space-x-1 ml-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}

            {/* Support Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium whitespace-nowrap">
                <span>Support</span>
                <ChevronDown className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {supportItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    {item.label}
                  </Link>
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
                            <Link
                              href="/dashboard"
                              className="flex items-center space-x-3 w-full px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              <LayoutDashboard className="h-4 w-4" />
                              <span>Dashboard</span>
                            </Link>
                            
                            <Link
                              href="/profile"
                              className="flex items-center space-x-3 w-full px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              <User className="h-4 w-4" />
                              <span>Profile</span>
                            </Link>
                            
                            <Link
                              href="/settings"
                              className="flex items-center space-x-3 w-full px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              <Settings className="h-4 w-4" />
                              <span>Settings</span>
                            </Link>
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
                    {/* Sign In Button */}
                    <Link href="/auth/sign-in">
                      <Button size="sm" variant="ghost" className="text-gray-600 hover:text-gray-900">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/sign-up">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                        Join Us
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation flex-shrink-0"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-4 text-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}

                {/* Mobile Support Section */}
                <div className="px-4 py-3">
                  <div className="text-base font-medium text-gray-500 mb-3">Support</div>
                  {supportItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-3 text-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors ml-4"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                {/* Mobile Auth Section */}
                <div className="px-4 pt-5 border-t border-gray-100 space-y-3">
                  {isLoading ? (
                    <div className="space-y-3">
                      <div className="w-full h-14 bg-gray-200 rounded-lg animate-pulse"></div>
                      <div className="w-full h-14 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                  ) : (
                    <>
                      {user ? (
                        <>
                          <div className="px-4 py-3 bg-gray-50 rounded-lg">
                            <div className="font-medium text-lg text-gray-900">
                              {user.username ? `@${user.username}` : (user.name || 'Set Your Name')}
                            </div>
                            <div className="text-base text-gray-500">
                              {user.name && user.username ? `${user.name} • Signed in` : 
                               user.name ? 'Signed in' : 'Click Profile to set your name'}
                            </div>
                          </div>
                          
                          <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start bg-blue-50 text-blue-600 hover:bg-blue-100 h-12 text-lg">
                              <LayoutDashboard className="w-5 h-5 mr-3" />
                              Dashboard
                            </Button>
                          </Link>
                          
                          <Link href="/profile" onClick={() => setIsOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start h-12 text-lg">
                              <Settings className="w-5 h-5 mr-3" />
                              Settings
                            </Button>
                          </Link>
                          
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 h-12 text-lg"
                            onClick={handleSignOut}
                          >
                            <LogOut className="w-5 h-5 mr-3" />
                            Sign Out
                          </Button>
                        </>
                      ) : (
                        <>
                          <Link href="/auth/sign-in" onClick={() => setIsOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start h-12 text-lg">
                              Sign In
                            </Button>
                          </Link>
                          <Link href="/auth/sign-up" onClick={() => setIsOpen(false)}>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg">
                              Join Us
                            </Button>
                          </Link>
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
  )
}
