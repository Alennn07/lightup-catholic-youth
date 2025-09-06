"use client"

import type React from "react"
import { useEffect } from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Mail, Lock, ArrowLeft, Eye, EyeOff, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { logIfEnabled } from "@/lib/performance-monitor"
import { useTranslation } from "@/lib/i18n"
import { ErrorBoundary } from "@/components/error-boundary"

export default function SignInPage() {
  const { t } = useTranslation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isSigningIn, setIsSigningIn] = useState(false) // Local loading state for sign-in button
  const router = useRouter()
  const { toast } = useToast()
  const { login, signInWithGoogle, isLoading, user } = useAuth()

  // Redirect if already logged in
  useEffect(() => {
    if (user && !isLoading) {
      logIfEnabled('User already logged in, redirecting to home...')
      router.push('/')
    }
  }, [user, isLoading, router])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    logIfEnabled('Starting sign-in process...')

    try {
      setIsSigningIn(true) // Set local loading state
      logIfEnabled('Calling login function...')
      await login(email, password)
      logIfEnabled('Login successful!')
      
      // Success notification
      toast({
        title: "Welcome back! ✨",
        description: "You have successfully signed in to LightUp.",
        variant: "default",
      })

      // The redirect will happen automatically via useEffect above
      logIfEnabled('Login complete, redirect should happen automatically')
    } catch (error: any) {
      logIfEnabled(`Sign-in error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error')
      
      // Handle specific error types
      let errorTitle = t("auth.signInFailed")
      let errorDescription = "Please check your credentials and try again."
      
      if (error.message?.includes("Invalid login credentials")) {
        errorTitle = "Account not found"
        errorDescription = "No account exists with this email. Please check your email or create a new account."
      } else if (error.message?.includes("Email not confirmed")) {
        errorTitle = "Email not verified"
        errorDescription = "Please check your email and click the verification link before signing in."
      } else if (error.message?.includes("Too many requests")) {
        errorTitle = "Too many attempts"
        errorDescription = "Please wait a few minutes before trying again."
      } else if (error.message?.includes("User not found")) {
        errorTitle = "Account not found"
        errorDescription = "No account exists with this email. Please check your email or create a new account."
      }
      
      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive",
      })
    } finally {
      setIsSigningIn(false) // Clear local loading state
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    try {
      await signInWithGoogle()
      // Google OAuth will handle the redirect
      toast({
        title: "Redirecting to Google...",
        description: "Please complete the sign-in process with Google.",
        variant: "default",
      })
    } catch (error: any) {
      logIfEnabled(`Google sign-in error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error')
      toast({
        title: "Google sign-in failed",
        description: error.message || "Please try again or use email sign-in.",
        variant: "destructive",
      })
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6 relative overflow-hidden">
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

      <div className="relative z-10 w-full max-w-md mx-2 sm:mx-3 md:mx-4">
        <div className="text-center mb-4 sm:mb-6 md:mb-10">
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
            <div className="relative">
              <Heart className="h-12 w-12 text-blue-600 fill-blue-600" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse shadow-sm"></div>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-outfit">
              LightUp
            </h1>
          </div>
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200 rounded-full px-5 py-3 shadow-sm">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-blue-700 text-sm font-medium">Welcome back</span>
          </div>
        </div>

        <Card className="shadow-2xl border border-gray-200 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900 font-outfit">{t("auth.signIn")}</CardTitle>
            <CardDescription className="text-gray-600 font-nunito-sans">{t("auth.signIn")} to your LightUp account</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Google Sign In Button */}
            <Button
              variant="outline"
              className="w-full border-2 border-gray-200 hover:border-gray-300 bg-white text-gray-700 hover:bg-gray-50 h-12"
              disabled={isLoading || isGoogleLoading}
              onClick={handleGoogleSignIn}
            >
              {isGoogleLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600 mr-3"></div>
                  {t("auth.signingIn")}...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with email</span>
              </div>
            </div>

            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg border border-gray-200">
                <TabsTrigger value="email" className="text-gray-600 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-md">
                  Email
                </TabsTrigger>
                <TabsTrigger value="group" className="text-gray-600 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-md">
                  Group Login
                </TabsTrigger>
              </TabsList>

            <TabsContent value="email" className="space-y-5">
              <form onSubmit={handleSignIn} className="space-y-5">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-gray-700 font-medium text-sm">
                    <Mail className="h-4 w-4 inline mr-2" />
                    {t("auth.email")}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("auth.enterEmail")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 bg-white border-2 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="password" className="text-gray-700 font-medium text-sm">
                    <Lock className="h-4 w-4 inline mr-2" />
                    {t("auth.password")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t("auth.enterPassword")}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium text-base shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={isSigningIn}
                >
                  {isSigningIn ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {t("auth.signingIn")}...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="text-center pt-2 space-y-2">
                <p className="text-gray-600 text-sm">
                  Don't have an account?{" "}
                  <Link href="/auth/sign-up" className="text-blue-600 hover:text-blue-700 font-medium underline">
                    Sign up
                  </Link>
                </p>
                <p className="text-gray-600 text-sm">
                  <Link href="/auth/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium underline">
                    Forgot your password?
                  </Link>
                </p>
              </div>
              
              {/* Helpful error message for unregistered users */}
              {email && (
                <div className="text-center pt-2">
                  <p className="text-gray-500 text-xs">
                    Can't sign in?{" "}
                    <Link href="/auth/sign-up" className="text-blue-500 hover:text-blue-600 underline">
                      Create a new account
                    </Link>{" "}
                    or{" "}
                    <button 
                      className="text-blue-500 hover:text-blue-600 underline"
                      onClick={() => {
                        setEmail("")
                        setPassword("")
                      }}
                    >
                      try a different email
                    </button>
                  </p>
                </div>
              )}
              
              {/* Common sign-in issues help */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Need help signing in?</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Make sure your email is spelled correctly</li>
                  <li>• Check that your password is correct</li>
                  <li>• If you don't have an account, <Link href="/auth/sign-up" className="underline font-medium">create one here</Link></li>
                  <li>• Forgot your password? Contact support</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="group" className="space-y-6">
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-blue-200">
                  <Heart className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Group Registration</h3>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  Register your youth group to join the LightUp community and connect with other Catholic youth
                </p>
                <Link href="/auth/group-registration">
                  <Button className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200">
                    Register Group
                  </Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        </Card>
      </div>
    </div>
    </ErrorBoundary>
  )
}
