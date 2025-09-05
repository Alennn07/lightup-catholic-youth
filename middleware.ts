import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  console.log(`🔍 Middleware: Running for ${request.nextUrl.pathname}`)
  const res = NextResponse.next()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Add CORS headers for API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    res.headers.set("Access-Control-Allow-Origin", "*")
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  }

  // Define protected routes (all feature routes except auth)
  const protectedRoutes = [
    '/dashboard',
    '/youth-groups',
    '/prayer-wall',
    '/daily-bible-verse',
    '/faithbot',
    '/faith-journal',
    '/liturgical-calendar',
    '/faith-quiz',
    '/profile',
    '/settings',
    '/community' // Redirect community to login since it's removed
  ]

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )
  
  console.log(`🔍 Middleware: Path ${request.nextUrl.pathname} is protected: ${isProtectedRoute}`)

  // Check authentication for protected routes
  if (isProtectedRoute) {
    console.log(`🔍 Middleware: Checking auth for ${request.nextUrl.pathname}`)
    
    // Debug: Log all cookies
    const allCookies = request.cookies.getAll()
    console.log(`🔍 Middleware: All cookies:`, allCookies.map(c => ({ name: c.name, value: c.value.substring(0, 20) + '...' })))
    
    try {
      // Try to get session from cookies first
      const { data: { session }, error } = await supabase.auth.getSession()
      
      console.log(`🔍 Middleware: Session check result:`, { 
        hasSession: !!session, 
        userId: session?.user?.id,
        error: error?.message 
      })
      
      // If no session, try to get user directly
      if (!session) {
        console.log(`🔍 Middleware: No session, trying getUser...`)
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        console.log(`🔍 Middleware: getUser result:`, { 
          hasUser: !!user, 
          userId: user?.id,
          error: userError?.message 
        })
        
        if (!user) {
          console.log(`🔍 Middleware: No user found, redirecting to sign-in`)
          // Redirect to sign-in if not authenticated
          const redirectUrl = new URL("/auth/sign-in", request.url)
          redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname)
          return NextResponse.redirect(redirectUrl)
        } else {
          console.log(`🔍 Middleware: User found via getUser, allowing access to ${request.nextUrl.pathname}`)
          // Add user info to headers for debugging
          res.headers.set('x-user-id', user.id)
          res.headers.set('x-user-email', user.email || '')
        }
      } else {
        console.log(`🔍 Middleware: Session found, allowing access to ${request.nextUrl.pathname}`)
        // Add user info to headers for debugging
        res.headers.set('x-user-id', session.user.id)
        res.headers.set('x-user-email', session.user.email || '')
      }
    } catch (error) {
      console.log(`🔍 Middleware: Error checking session:`, error)
      // If there's an error checking session, redirect to sign-in
      const redirectUrl = new URL("/auth/sign-in", request.url)
      redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return res
}

export const config = {
  matcher: [
    "/api/:path*",
    "/dashboard/:path*",
    "/youth-groups/:path*",
    "/prayer-wall/:path*",
    "/daily-bible-verse/:path*",
    "/faithbot/:path*",
    "/faith-journal/:path*",
    "/liturgical-calendar/:path*",
    "/faith-quiz/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/community/:path*"
  ],
}
