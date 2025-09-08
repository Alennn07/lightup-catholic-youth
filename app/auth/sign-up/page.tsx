"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Mail, Lock, User, Calendar, MapPin, Building, ArrowLeft, Eye, EyeOff, Sparkles } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { useTranslation } from "@/lib/i18n"
import { ErrorBoundary } from "@/components/error-boundary"
import { CustomLogo } from "@/components/custom-logo"
import { validateEmailDomain } from "@/lib/email-validation"

export default function SignUpPage() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    parish: "",
    diocese: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const router = useRouter()
  const { toast } = useToast()
  const { user, refreshUserData } = useAuth()

  // Redirect if user is already logged in
  React.useEffect(() => {
    if (user) {
      toast({
        title: "Already Logged In",
        description: "You are already logged in. Redirecting to dashboard...",
        variant: "default",
      })
      router.push("/")
    }
  }, [user, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🚀 Form submission started with data:', formData)
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      return
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    // Validate email domain
    const emailValidation = validateEmailDomain(formData.email)
    if (!emailValidation.isValid) {
      toast({
        title: "Email not allowed",
        description: emailValidation.error || "Invalid email domain",
        variant: "destructive",
      })
      return
    }

    // Validate username format
    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      toast({
        title: "Invalid username",
        description: "Username can only contain letters, numbers, and underscores.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    console.log('🔐 Calling register function...')
    console.log('🔍 Debug: About to call register with data:', {
      name: formData.name,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      age: parseInt(formData.age),
      parish: formData.parish,
      diocese: formData.diocese
    })

    try {
      console.log('🔍 Debug: Calling registration API...')
      
      const response = await fetch('/api/auth/register-auto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          age: parseInt(formData.age),
          parish: formData.parish,
          diocese: formData.diocese
        })
      })
      
      const result = await response.json()
      console.log('🔍 Debug: API response:', result)
      console.log('🔍 Debug: Response status:', response.status)
      console.log('🔍 Debug: Response ok:', response.ok)
      
      if (!response.ok) {
        console.log('🔍 Debug: Handling error response with code:', result.code)
        // Handle specific error codes
        if (result.code === 'USER_ALREADY_EXISTS') {
          toast({
            title: "Account Already Exists",
            description: result.error,
            variant: "destructive",
          })
          // Redirect to sign-in page
          router.push("/auth/sign-in")
          return
        }
        
        if (result.code === 'USERNAME_TAKEN') {
          toast({
            title: "Username Taken",
            description: result.error,
            variant: "destructive",
          })
          return
        }
        
        if (result.code === 'WEAK_PASSWORD') {
          toast({
            title: "Weak Password",
            description: result.error,
            variant: "destructive",
          })
          return
        }
        
        if (result.code === 'INVALID_EMAIL') {
          toast({
            title: "Invalid Email",
            description: result.error,
            variant: "destructive",
          })
          return
        }
        
        // Handle USER_ALREADY_EXISTS (user already exists)
        if (result.code === 'USER_ALREADY_EXISTS' || 
            (result.code === 'AUTH_ERROR' && result.error?.includes('already been registered'))) {
          toast({
            title: "Account Already Exists",
            description: "This email is already registered. Please sign in instead.",
            variant: "destructive",
          })
          // Redirect to sign-in page
          router.push("/auth/sign-in")
          return
        }
        
        // Generic error - show the actual error message from API
        console.log('🔍 Debug: No specific error code found, showing generic error')
        toast({
          title: "Registration Failed",
          description: result.error || 'Something went wrong. Please try again.',
          variant: "destructive",
        })
        return
      }

      console.log('✅ Registration successful!')
      
      // Check if auto-login is enabled
      if (result.autoLogin && result.session) {
        console.log('🔄 Auto-login enabled, setting session...')
        
        // Set the session directly using the returned session data
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: result.session.access_token,
          refresh_token: result.session.refresh_token
        })
        
        if (sessionError) {
          console.error('❌ Failed to set session:', sessionError)
          toast({
            title: "Account Created! 🎉",
            description: "Please sign in to continue.",
            variant: "default",
          })
          router.push("/auth/sign-in")
        } else {
          console.log('✅ Auto-login successful!')
          toast({
            title: "Welcome to LightUp! ✨",
            description: "Your account has been created and you're now logged in!",
            variant: "default",
          })
          // Refresh user data to ensure auth context is updated
          await refreshUserData()
          // Small delay to ensure auth context updates
          setTimeout(() => {
            router.push("/")
          }, 500)
        }
      } else {
        // Fallback to manual sign-in
        console.log('🔄 Auto-login not available, signing in manually...')
        try {
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
          })
          
          if (signInError) {
            console.error('❌ Auto sign-in failed:', signInError)
            toast({
              title: "Account Created! 🎉",
              description: "Please sign in to continue.",
              variant: "default",
            })
            router.push("/auth/sign-in")
          } else {
            console.log('✅ Auto sign-in successful!')
            toast({
              title: "Welcome to LightUp! ✨",
              description: "Your account has been created and you're now logged in!",
              variant: "default",
            })
            // Refresh user data to ensure auth context is updated
            await refreshUserData()
            // Small delay to ensure auth context updates
            setTimeout(() => {
              router.push("/")
            }, 500)
          }
        } catch (signInException) {
          console.error('❌ Exception during auto sign-in:', signInException)
          toast({
            title: "Account Created! 🎉",
            description: "Please sign in to continue.",
            variant: "default",
          })
          router.push("/auth/sign-in")
        }
      }
    } catch (error: any) {
      console.error('❌ Registration error in component:', error)
      console.log('🔍 Error type:', typeof error)
      console.log('🔍 Error message:', error?.message)
      console.log('🔍 Full error object:', error)
      
      // Handle specific error types
      let errorTitle = "Registration failed"
      let errorDescription = "Failed to create account. Please try again."
      
      if (error.message?.includes("Email already registered")) {
        errorTitle = "Email already registered"
        errorDescription = "An account with this email already exists. Please sign in instead."
      } else if (error.message?.includes("Username taken")) {
        errorTitle = "Username taken"
        errorDescription = "This username is already taken. Please choose a different one."
      } else if (error.message?.includes("Email not confirmed")) {
        errorTitle = "Email verification required"
        errorDescription = "Please check your email and click the verification link to complete registration."
      } else if (error.message?.includes("Password should be at least")) {
        errorTitle = "Password too weak"
        errorDescription = "Please choose a stronger password with at least 6 characters."
      } else if (error.message?.includes("Invalid email")) {
        errorTitle = "Invalid email format"
        errorDescription = "Please enter a valid email address."
      } else if (error.message) {
        errorDescription = error.message
      }
      
      console.log('📝 Showing error toast:', { errorTitle, errorDescription })
      console.log('🔍 About to call toast function...')
      
      try {
        toast({
          title: errorTitle,
          description: errorDescription,
          variant: "destructive",
        })
        console.log('✅ Toast function called successfully')
      } catch (toastError) {
        console.error('❌ Toast error:', toastError)
      }
    } finally {
      console.log('🏁 Setting loading to false')
      setIsLoading(false)
    }
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-200/15 rounded-full blur-3xl"></div>
      </div>

      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors backdrop-blur-sm bg-white/90 rounded-full px-4 py-2 border border-gray-200 shadow-sm hover:shadow-md"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Home</span>
      </Link>

      <div className="relative z-10 w-full max-w-md mx-3 sm:mx-4">
        <div className="text-center mb-4 sm:mb-6 md:mb-10">
          <div className="flex flex-col items-center justify-center mb-4 sm:mb-6">
            <div className="scale-75 sm:scale-90 md:scale-100">
              <CustomLogo textColor="text-gray-800" taglineColor="text-gray-700" />
            </div>
            <p className="text-gray-700 text-sm font-medium mt-2">Catholic Youth Community</p>
          </div>
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200 rounded-full px-5 py-3 shadow-sm">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-blue-700 text-sm font-medium">Join our community</span>
          </div>
        </div>

        <Card className="shadow-2xl border border-gray-200 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900 font-outfit">{t("auth.createAccount")}</CardTitle>
            <CardDescription className="text-gray-600 font-nunito-sans">
              {t("auth.joinLightUp")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-gray-700 font-medium text-sm">
                  <User className="h-4 w-4 inline mr-2" />
                  {t("auth.preferredName")}
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your preferred name (will be displayed)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-12 bg-white border-2 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
                <p className="text-xs text-gray-500">This is the name that will be shown to you and others in the app</p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="username" className="text-gray-700 font-medium text-sm">
                  <span className="text-blue-600 font-bold">@</span>
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a unique username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  className="h-12 bg-white border-2 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
                <p className="text-xs text-gray-500">This will be your unique identifier: @username</p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="email" className="text-gray-700 font-medium text-sm">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-12 bg-white border-2 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Only Gmail, Yahoo, Outlook, Hotmail, or iCloud accounts are allowed
                </p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-gray-700 font-medium text-sm">
                  <Lock className="h-4 w-4 inline mr-2" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="h-12 pr-12 bg-white border-2 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="confirmPassword" className="text-gray-700 font-medium text-sm">
                  <Lock className="h-4 w-4 inline mr-2" />
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    className="h-12 pr-12 bg-white border-2 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="age" className="text-gray-700 font-medium text-sm">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    Age
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Age"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    required
                    min="13"
                    max="100"
                    className="h-12 bg-white border-2 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="parish" className="text-gray-700 font-medium text-sm">
                    <Building className="h-4 w-4 inline mr-2" />
                    Parish
                  </Label>
                  <Input
                    id="parish"
                    type="text"
                    placeholder="Your parish"
                    value={formData.parish}
                    onChange={(e) => setFormData({ ...formData, parish: e.target.value })}
                    required
                    className="h-12 bg-white border-2 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="diocese" className="text-gray-700 font-medium text-sm">
                  <MapPin className="h-4 w-4 inline mr-2" />
                  Diocese
                </Label>
                <Input
                  id="diocese"
                  type="text"
                  placeholder="Your diocese"
                  value={formData.diocese}
                  onChange={(e) => setFormData({ ...formData, diocese: e.target.value })}
                  required
                  className="h-12 bg-white border-2 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium text-base shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="text-center mt-6">
              <p className="text-gray-600 text-sm">
                Already have an account?{" "}
                <Link href="/auth/sign-in" className="text-blue-600 hover:text-blue-700 font-medium underline">
                  Sign in
                </Link>
              </p>
              
              {/* Helpful error recovery links */}
              {formData.email && (
                <div className="text-center pt-3">
                  <p className="text-gray-500 text-xs">
                    Having trouble?{" "}
                    <Link href="/auth/sign-in" className="text-blue-500 hover:text-blue-600 underline">
                      Try signing in
                    </Link>{" "}
                    or{" "}
                    <button 
                      className="text-blue-500 hover:text-blue-600 underline"
                      onClick={() => {
                        setFormData({
                          name: "",
                          username: "",
                          email: "",
                          password: "",
                          confirmPassword: "",
                          age: "",
                          parish: "",
                          diocese: ""
                        })
                      }}
                    >
                      start over
                    </button>
                  </p>
                </div>
              )}
              
              {/* Account creation tips */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                <h4 className="text-sm font-medium text-green-900 mb-2">Creating your account</h4>
                <ul className="text-xs text-green-700 space-y-1">
                  <li>• Choose a username that's unique and memorable</li>
                  <li>• Use a strong password with at least 6 characters</li>
                  <li>• Your preferred name will be displayed to others</li>
                  <li>• Parish and diocese help connect you with local youth</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </ErrorBoundary>
  )
}
