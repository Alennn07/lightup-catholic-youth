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

  // TEMPORARILY DISABLE AUTH CHECK FOR TESTING
  if (isProtectedRoute) {
    console.log(`🔍 Middleware: TEMPORARILY ALLOWING ACCESS to ${request.nextUrl.pathname}`)
    // TODO: Re-enable auth check once session storage is fixed
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
