import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  console.log('🚀 MIDDLEWARE RUNNING for:', request.nextUrl.pathname)
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
          request.cookies.set({ name, value, ...options })
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          request.cookies.set({ name, value: '', ...options })
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

  // Check authentication for protected routes (all routes except /auth)
  const pathname = request.nextUrl.pathname
  
  // Skip auth check for public routes
  const publicRoutes = [
    '/',
    '/auth',
    '/features',
    '/about',
    '/support',
    '/community'
  ]
  
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )
  
  // Debug logging
  console.log(`🔒 Middleware checking: ${pathname}, isPublic: ${isPublicRoute}`)
  
  if (!isPublicRoute && !pathname.startsWith('/api/')) {
    const { data: { session } } = await supabase.auth.getSession()
    
    console.log(`🔍 Session check for ${pathname}:`, { hasSession: !!session, userId: session?.user?.id })
    
    if (!session) {
      console.log(`❌ No session for ${pathname}, redirecting to sign-in`)
      // Redirect to sign-in if not authenticated
      const redirectUrl = new URL("/auth/sign-in", request.url)
      redirectUrl.searchParams.set("redirectTo", pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return res
}

export const config = {
  matcher: [
    "/youth-groups",
    "/youth-groups/:path*",
    "/dashboard",
    "/dashboard/:path*"
  ],
}
