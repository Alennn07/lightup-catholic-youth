"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, Menu, X, ChevronDown, User, LogOut, Settings, LayoutDashboard } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { logIfEnabled } from "@/lib/performance-monitor"

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
    { href: "/community", label: "Community" },
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
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">LightUp</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium"
              >
                {item.label}
              </Link>
            ))}

            {/* Support Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium">
                <span>Support</span>
                <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {supportItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Auth & Profile */}
          <div className="hidden md:flex items-center space-x-3">
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
                      className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                        </span>
                      </div>
                      <span>{user.username ? `@${user.username}` : (user.name || 'Set Your Name')}</span>
                      <ChevronDown className="h-4 w-4 transition-transform duration-200" />
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
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Link href="/auth/sign-in">Sign In</Link>
                    </Button>
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
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
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
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}

                {/* Mobile Support Section */}
                <div className="px-4 py-2">
                  <div className="text-sm font-medium text-gray-500 mb-2">Support</div>
                  {supportItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors ml-4"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
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
                          
                          <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start bg-blue-50 text-blue-600 hover:bg-blue-100">
                              <LayoutDashboard className="w-4 h-4 mr-2" />
                              Dashboard
                            </Button>
                          </Link>
                          
                          <Link href="/profile" onClick={() => setIsOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start">
                              <Settings className="w-4 h-4 mr-2" />
                              Settings
                            </Button>
                          </Link>
                          
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={handleSignOut}
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                          </Button>
                        </>
                      ) : (
                        <>
                          <Link href="/auth/sign-in" onClick={() => setIsOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start">
                              Sign In
                            </Button>
                          </Link>
                          <Link href="/auth/sign-up" onClick={() => setIsOpen(false)}>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
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
