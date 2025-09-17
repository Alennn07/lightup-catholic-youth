import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  console.log(`🔍 Middleware: Running for ${request.nextUrl.pathname}`)
  
  // Create response first
  const res = NextResponse.next()
  
  // Check if we have the required environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.log(`🔍 Middleware: Missing Supabase environment variables`)
    return res
  }
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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

  // Skip middleware for certain paths
  const skipPaths = ['/', '/features', '/saints', '/about', '/support', '/auth']
  const shouldSkip = skipPaths.some(path => 
    request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(path + '/')
  )
  
  if (shouldSkip) {
    console.log(`🔍 Middleware: Skipping middleware for ${request.nextUrl.pathname}`)
    return res
  }

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )
  
  console.log(`🔍 Middleware: Path ${request.nextUrl.pathname} is protected: ${isProtectedRoute}`)

  // Check authentication for protected routes
  if (isProtectedRoute) {
    console.log(`🔍 Middleware: Checking auth for ${request.nextUrl.pathname}`)
    
    try {
      // Try to get session from cookies
      const { data: { session }, error } = await supabase.auth.getSession()
      
      console.log(`🔍 Middleware: Session check result:`, { 
        hasSession: !!session, 
        userId: session?.user?.id,
        error: error?.message 
      })
      
      if (error) {
        console.log(`🔍 Middleware: Supabase error:`, error.message)
        // If there's a Supabase error, allow access but log it
        return res
      }
      
      if (!session) {
        console.log(`🔍 Middleware: No session, redirecting to sign-in`)
        // Redirect to sign-in if not authenticated
        const signInUrl = new URL("/auth/sign-in", request.url)
        signInUrl.searchParams.set("redirectTo", request.nextUrl.pathname)
        return NextResponse.redirect(signInUrl)
      } else {
        console.log(`🔍 Middleware: Session found, allowing access to ${request.nextUrl.pathname}`)
        // Add user info to headers for debugging
        res.headers.set('x-user-id', session.user.id)
        res.headers.set('x-user-email', session.user.email || '')
      }
    } catch (error) {
      console.log(`🔍 Middleware: Error checking session:`, error)
      // If there's an error checking session, allow access but log it
      console.log(`🔍 Middleware: Allowing access due to error: ${error}`)
      return res
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
