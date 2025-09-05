"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import type { User } from "@/lib/supabase"
import { logIfEnabled } from "@/lib/performance-monitor"

interface AuthContextType {
  user: User | null
  supabaseUser: SupabaseUser | null
  login: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
  updateProfile: (data: Partial<User>) => Promise<void>
  getAccessToken: () => Promise<string | null>
  refreshUserData: () => Promise<void> // 🚀 NEW: Add refresh function to interface
}

interface RegisterData {
  name: string
  username: string
  email: string
  password: string
  age: number
  parish: string
  diocese: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastRefreshTime, setLastRefreshTime] = useState(0)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        logIfEnabled(`🔐 Initial session check: ${JSON.stringify({ hasSession: !!session, userId: session?.user?.id, error: error?.message })}`)
        
        if (session?.user) {
          setSupabaseUser(session.user)
          // Set basic user without profile fetch
          const basicUser = {
            id: session.user.id,
            name: session.user.user_metadata?.name || 'User',
            username: session.user.user_metadata?.username || `user_${session.user.id.slice(0, 8)}`,
            email: session.user.email || '',
            age: session.user.user_metadata?.age || 18,
            parish: session.user.user_metadata?.parish || '',
            diocese: session.user.user_metadata?.diocese || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
          setUser(basicUser)
          logIfEnabled(`👤 User set from session: ${JSON.stringify(basicUser)}`)
        } else {
          logIfEnabled('❌ No initial session found')
          setSupabaseUser(null)
          setUser(null)
        }
      } catch (error) {
        logIfEnabled(`🚨 Error getting initial session: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error')
      } finally {
        setIsLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSupabaseUser(session?.user ?? null)
      if (session?.user) {
        // Set basic user without profile fetch
        const basicUser = {
          id: session.user.id,
          name: session.user.user_metadata?.name || 'User',
          username: session.user.user_metadata?.username || `user_${session.user.id.slice(0, 8)}`,
          email: session.user.email || '',
          age: session.user.user_metadata?.age || 18,
          parish: session.user.user_metadata?.parish || '',
          diocese: session.user.user_metadata?.diocese || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setUser(basicUser)
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    // 🚀 OPTIMIZED: Listen for window focus to refresh user data only when needed
    const handleWindowFocus = () => {
      if (user?.id) {
        // Only refresh if it's been more than 5 minutes since last refresh
        const now = Date.now()
        const refreshInterval = 5 * 60 * 1000 // 5 minutes
        
        if (now - lastRefreshTime > refreshInterval) {
          logIfEnabled('🪟 Window focused, refreshing user data after 5+ minutes...')
          setLastRefreshTime(now)
          refreshUserData()
        } else {
          logIfEnabled('🪟 Window focused, skipping refresh (refreshed recently)')
        }
      }
    }

    window.addEventListener('focus', handleWindowFocus)

    return () => {
      subscription.unsubscribe()
      window.removeEventListener('focus', handleWindowFocus)
    }
  }, [user?.id]) // Add user?.id as dependency to avoid stale closure

  const fetchUserProfile = async (userId: string) => {
    console.log('👤 Fetching user profile for:', userId)
    
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Profile fetch timeout')), 10000) // 10 seconds
    })
    
    try {
      const profilePromise = (async () => {
        const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

        if (error) {
          console.error("❌ Error fetching user profile:", error)
          // If the users table doesn't exist, just set user to null
          if (error.code === 'PGRST116') {
            // No profile found - let's create one from auth user data
            console.log("📝 No user profile found, creating one...")
            await createUserProfileFromAuth(userId)
          } else {
            throw error
          }
        } else {
          console.log("✅ User profile data:", data)
          setUser(data)
        }
      })()
      
      await Promise.race([profilePromise, timeoutPromise])
      
    } catch (error) {
      console.error("❌ Error in fetchUserProfile:", error)
      // Try to create profile if it doesn't exist
      try {
        await createUserProfileFromAuth(userId)
      } catch (createError) {
        console.error("❌ Failed to create user profile:", createError)
        setUser(null)
      }
    } finally {
      console.log("🏁 Setting isLoading to false")
      setIsLoading(false)
    }
  }

  const createUserProfileFromAuth = async (userId: string) => {
    console.log('🔧 Creating user profile from auth data for:', userId)
    
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Profile creation timeout')), 10000) // 10 seconds
    })
    
    try {
      const createPromise = (async () => {
        // First, test if we can access the users table
        console.log('🧪 Testing users table access...')
        const { data: testData, error: testError } = await supabase
          .from('users')
          .select('id')
          .limit(1)
        
        if (testError) {
          console.error('❌ Cannot access users table:', testError)
          throw new Error(`Cannot access users table: ${testError.message}`)
        }
        
        console.log('✅ Users table is accessible')

        // Get auth user data
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !authUser) {
          console.error('❌ Could not get auth user data:', authError)
          throw new Error('Could not get auth user data')
        }

        console.log('📝 Auth user data:', authUser)

        // Create basic profile
        const profileData = {
          id: userId,
          name: authUser.user_metadata?.name || 'User',
          username: authUser.user_metadata?.username || `user_${userId.slice(0, 8)}`,
          email: authUser.email || '',
          age: authUser.user_metadata?.age || 18,
          parish: authUser.user_metadata?.parish || '',
          diocese: authUser.user_metadata?.diocese || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        console.log('📝 Profile data to insert:', profileData)

        const { data: profile, error: profileError } = await supabase
          .from('users')
          .insert(profileData)
          .select()
          .single()

        if (profileError) {
          console.error('❌ Failed to create user profile:', profileError)
          throw profileError
        }

        console.log('✅ User profile created successfully:', profile)
        setUser(profile)
      })()
      
      await Promise.race([createPromise, timeoutPromise])
      
    } catch (error) {
      console.error('❌ Error creating user profile:', error)
      throw error
    }
  }

  const login = async (email: string, password: string) => {
    logIfEnabled('🔐 Login function started')
    setIsLoading(true)
    try {
      logIfEnabled('📡 Calling Supabase auth...')
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      logIfEnabled(`📡 Supabase auth response: ${JSON.stringify({ hasUser: !!data.user, error: error?.message })}`)
      
      if (error) {
        // Handle wrong password (email notification removed for now)
        throw error
      }
      
      // If login successful, set user immediately without profile fetch
      if (data.user) {
        logIfEnabled('✅ Auth successful, setting user...')
        // Create a basic user object from auth data
        const basicUser = {
          id: data.user.id,
          name: data.user.user_metadata?.name || 'User',
          username: data.user.user_metadata?.username || `user_${data.user.id.slice(0, 8)}`,
          email: data.user.email || '',
          age: data.user.user_metadata?.age || 18,
          parish: data.user.user_metadata?.parish || '',
          diocese: data.user.user_metadata?.diocese || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setUser(basicUser)
        setSupabaseUser(data.user)
        logIfEnabled('✅ User set successfully')
      }
      
      // Set loading to false on successful login
      setIsLoading(false)
      
    } catch (error: any) {
      logIfEnabled(`❌ Login error: ${error.message || 'Unknown error'}`, 'error')
      setIsLoading(false)
      throw new Error(error.message || "Login failed")
    }
  }

    const signInWithGoogle = async () => {
    logIfEnabled('🔐 Google sign-in started')
    try {
      logIfEnabled('📡 Calling Supabase Google OAuth...')
      
      // ALWAYS use localhost if we're on localhost - ignore all environment variables
      let redirectUrl = 'http://localhost:3000/auth/callback'
      
      if (typeof window !== 'undefined') {
        if (window.location.hostname === 'localhost') {
          // Use the actual port from the current window location
          const currentPort = window.location.port || '3000'
          redirectUrl = `http://localhost:${currentPort}/auth/callback`
          logIfEnabled(`🔧 FORCING localhost redirect: ${redirectUrl}`)
          
          // Override Supabase's redirect URL by modifying the URL after OAuth
          window.addEventListener('message', (event) => {
            if (event.origin === 'https://lightup-catholic-youth.vercel.app') {
              // Redirect back to localhost
              window.location.href = `http://localhost:${currentPort}`
            }
          })
        } else {
          // Only use production URL if we're actually on production
          redirectUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://lightup-catholic-youth.vercel.app') + '/auth/callback'
          logIfEnabled(`🚀 Using production redirect: ${redirectUrl}`)
        }
      }
       
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          // Force localhost redirect
          skipBrowserRedirect: false
        }
      })
      
      logIfEnabled(`📡 Supabase Google OAuth response: ${JSON.stringify({ data: !!data, error: error?.message })}`)
      
      if (error) throw error
      
      // Google OAuth will redirect to the callback URL
      // The user profile will be fetched in the callback
      logIfEnabled('✅ Google OAuth initiated successfully')
      
    } catch (error: any) {
      logIfEnabled(`❌ Google sign-in error: ${error.message || 'Unknown error'}`, 'error')
      throw new Error(error.message || "Google sign-in failed")
    }
  }

  const register = async (userData: RegisterData) => {
    console.log('🚀 REGISTER FUNCTION STARTED')
    setIsLoading(true)
    try {
      console.log('🔐 Starting registration for:', userData.email)
      console.log('🔍 User data received:', userData)
      
      // First, let's test if we can access the users table
      console.log('🧪 Testing users table access...')
      console.log('🔍 About to call supabase.from("users").select("count")')
      
      // Test basic Supabase connection first
      console.log('🔍 Testing basic Supabase connection...')
      try {
        const { data: healthCheck, error: healthError } = await supabase
          .from("users")
          .select("id")
          .limit(1)
        
        if (healthError) {
          console.error('❌ Supabase connection failed:', healthError)
          throw new Error(`Database connection failed: ${healthError.message}`)
        }
        
        console.log('✅ Supabase connection successful')
      } catch (connectionError) {
        console.error('❌ Connection test failed:', connectionError)
        throw new Error(`Cannot connect to database: ${connectionError.message}`)
      }
      
      // Now test the actual query
      console.log('🔍 Testing users table query...')
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Database query timeout')), 10000) // 10 seconds
      })
      
      const supabasePromise = supabase
        .from("users")
        .select("count")
        .limit(1)
      
      const { data: testData, error: testError } = await Promise.race([
        supabasePromise,
        timeoutPromise
      ])
      
      console.log('🔍 Supabase response:', { data: testData, error: testError })
      
      if (testError) {
        console.error('❌ Cannot access users table:', testError)
        throw new Error("Database access error. Please try again later.")
      }
      
      console.log('✅ Users table accessible')
      
      // Check if user already exists - use a more direct approach
      console.log('🔍 Checking for existing users...')
      
      // Check email first
      const { data: existingEmail, error: emailError } = await supabase
        .from("users")
        .select("email")
        .eq("email", userData.email)
        .maybeSingle()
      
      if (emailError) {
        console.error('❌ Error checking email:', emailError)
      } else if (existingEmail) {
        console.log('❌ Email already exists:', existingEmail.email)
        throw new Error("Email already registered")
      }
      
      // Check username
      const { data: existingUsername, error: usernameError } = await supabase
        .from("users")
        .select("username")
        .eq("username", userData.username)
        .maybeSingle()
      
      if (usernameError) {
        console.error('❌ Error checking username:', usernameError)
      } else if (existingUsername) {
        console.log('❌ Username already exists:', existingUsername.username)
        throw new Error("Username taken")
      }
      
      console.log('✅ No duplicates found, proceeding with registration...')

      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      })

      if (authError) {
        console.error('❌ Supabase auth error:', authError)
        // Handle specific Supabase auth errors
        if (authError.message?.includes("User already registered")) {
          throw new Error("Email already registered")
        } else if (authError.message?.includes("Password should be at least")) {
          throw new Error("Password too weak")
        } else if (authError.message?.includes("Invalid email")) {
          throw new Error("Invalid email format")
        }
        throw authError
      }
      
      if (!authData.user) throw new Error("Registration failed")

      console.log('✅ Auth user created, creating profile...')

      console.log('✅ Auth user created, proceeding to profile creation...')

      // Create user profile
      const { error: profileError } = await supabase.from("users").insert({
        id: authData.user.id,
        name: userData.name,
        username: userData.username,
        email: userData.email,
        age: userData.age,
        parish: userData.parish,
        diocese: userData.diocese,
      })

      if (profileError) {
        console.error('❌ Profile creation error:', profileError)
        
        // Check if it's a duplicate constraint error
        if (profileError.code === '23505') {
          if (profileError.message?.includes('email')) {
            throw new Error("Email already registered")
          } else if (profileError.message?.includes('username')) {
            throw new Error("Username taken")
          }
        }
        
        // Check if it's an RLS policy violation
        if (profileError.code === '42501') {
          console.error('❌ RLS policy violation - trying alternative approach...')
          
          // Try to create profile after a brief delay (sometimes helps with RLS)
          try {
            console.log('⏳ Waiting a moment and retrying profile creation...')
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            const { error: retryError } = await supabase.from("users").insert({
              id: authData.user.id,
              name: userData.name,
              username: userData.username,
              email: userData.email,
              age: userData.age,
              parish: userData.parish,
              diocese: userData.diocese,
            })
            
            if (retryError) {
              console.error('❌ Retry also failed:', retryError)
              throw new Error("Registration failed due to permissions. Please try again or contact support.")
            } else {
              console.log('✅ Profile created on retry!')
            }
          } catch (retryException) {
            throw retryException
          }
        } else {
          // If profile creation fails, we should clean up the auth user
          if (authData.user) {
            try {
              console.log('🧹 Attempting to cleanup auth user...')
              // Note: This might fail due to permissions, but that's okay
              await supabase.auth.admin.deleteUser(authData.user.id)
            } catch (cleanupError) {
              console.error('Failed to cleanup auth user:', cleanupError)
              // This is expected to fail in client-side code
            }
          }
          
          // Provide a more specific error message
          if (profileError.message?.includes('duplicate key')) {
            throw new Error("Email or username already exists")
          } else {
            throw new Error(`Failed to create user profile: ${profileError.message}`)
          }
        }
      }
      
      console.log('✅ User registered successfully:', authData.user.id)
      
      // Email verification removed for now (will be added back later via API routes)
      
      // Set user state immediately with the data we have
      const newUser: User = {
        id: authData.user.id,
        name: userData.name,
        username: userData.username,
        email: userData.email,
        age: userData.age,
        parish: userData.parish,
        diocese: userData.diocese,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      
      setUser(newUser)
      setIsLoading(false)
      console.log('✅ User state updated, registration complete!')
      
      // Now try to sign in automatically
      try {
        console.log('🔐 Attempting automatic sign-in...')
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: userData.email,
          password: userData.password,
        })
        
        if (signInError) {
          console.error('❌ Auto sign-in failed:', signInError)
          // Don't throw error, just log it - user can sign in manually
          console.log('ℹ️ User can sign in manually with their credentials')
        } else {
          console.log('✅ Auto sign-in successful!')
          // Update supabase user state
          setSupabaseUser(signInData.user)
        }
      } catch (signInException) {
        console.error('❌ Exception during auto sign-in:', signInException)
        // Don't fail registration for this
      }
      
      // Registration completed successfully
      console.log('🎉 Registration process completed successfully!')
      return
      
    } catch (error: any) {
      console.error('❌ Registration failed:', error)
      setIsLoading(false)
      
      // Provide more user-friendly error messages
      if (error.message?.includes('Email already registered')) {
        throw new Error("An account with this email already exists. Please sign in instead.")
      } else if (error.message?.includes('Username taken')) {
        throw new Error("This username is already taken. Please choose a different one.")
      } else if (error.message?.includes('duplicate key')) {
        throw new Error("Email or username already exists. Please try different credentials.")
      } else if (error.message?.includes('permissions')) {
        throw new Error("Registration failed due to system permissions. Please try again.")
      } else {
        throw new Error(error.message || "Registration failed. Please try again.")
      }
    }
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return

    try {
      logIfEnabled(`🔄 Updating profile with data: ${JSON.stringify(data)}`)
      
      // Remove undefined values to avoid database errors
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined && value !== null)
      )
      
      // Get the current access token
      const accessToken = await getAccessToken()
      if (!accessToken) {
        throw new Error('No access token available')
      }
      
      // Call the API endpoint with Authorization header
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(cleanData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update profile')
      }

      const { profile } = await response.json()
      
      logIfEnabled(`✅ Profile update successful: ${JSON.stringify(profile)}`)
      
      // Update local user state with the returned profile data
      setUser(profile)
      
      // Also update supabaseUser metadata to keep them in sync
      if (supabaseUser) {
        try {
          const { error: updateError } = await supabase.auth.updateUser({
            data: {
              name: profile.name,
              username: profile.username,
              age: profile.age,
              parish: profile.parish,
              diocese: profile.diocese,
            }
          })
          
          if (updateError) {
            logIfEnabled(`⚠️ Warning: Could not update Supabase user metadata: ${updateError.message}`, 'warn')
          } else {
            logIfEnabled('✅ Supabase user metadata updated successfully')
          }
        } catch (metadataError) {
          logIfEnabled(`⚠️ Warning: Failed to update Supabase metadata: ${metadataError instanceof Error ? metadataError.message : 'Unknown error'}`, 'warn')
        }
      }
      
      return profile
    } catch (error) {
      logIfEnabled(`❌ Profile update failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error')
      throw error
    }
  }

  const getAccessToken = async (): Promise<string | null> => {
    try {
      logIfEnabled('🔑 Getting access token...')
      
      // First try to get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        logIfEnabled(`❌ Session error: ${sessionError.message}`, 'error')
        return null
      }
      
      if (session?.access_token) {
        logIfEnabled('✅ Access token found in session')
        return session.access_token
      }
      
      // If no session, try to get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError) {
        logIfEnabled(`❌ User error: ${userError.message}`, 'error')
        return null
      }
      
      if (user) {
        // Try to refresh the session
        const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession()
        
        if (refreshError) {
          logIfEnabled(`❌ Refresh error: ${refreshError.message}`, 'error')
          return null
        }
        
        if (refreshedSession?.access_token) {
          logIfEnabled('✅ Access token refreshed')
          return refreshedSession.access_token
        }
      }
      
      logIfEnabled('❌ No access token available')
      return null
    } catch (error) {
      logIfEnabled(`❌ Error getting access token: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error')
      return null
    }
  }

  // 🚀 NEW: Function to refresh user data from database
  const refreshUserData = async () => {
    if (!user?.id) return
    
    try {
      logIfEnabled('🔄 Refreshing user data from database...')
      
      const accessToken = await getAccessToken()
      if (!accessToken) {
        logIfEnabled('❌ No access token available for refresh')
        return
      }
      
      // Fetch fresh user data from the API
      const response = await fetch('/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
      
      if (!response.ok) {
        logIfEnabled(`❌ Failed to refresh user data: ${response.status}`)
        return
      }
      
      const { profile } = await response.json()
      
      if (profile) {
        logIfEnabled(`✅ User data refreshed: ${JSON.stringify(profile)}`)
        setUser(profile)
      }
    } catch (error) {
      logIfEnabled(`❌ Error refreshing user data: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error')
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        login,
        signInWithGoogle,
        register,
        logout,
        isLoading,
        updateProfile,
        getAccessToken,
        refreshUserData, // 🚀 NEW: Add refresh function to context
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

