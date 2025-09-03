import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limiter"

export async function middleware(request: NextRequest) {
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
    
    // Rate limiting for API routes
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const pathname = request.nextUrl.pathname
    
    // Determine rate limit type based on endpoint
    let rateLimitType: keyof typeof import('@/lib/rate-limiter').RATE_LIMITS = 'GENERAL_API'
    
    if (pathname.includes('/auth/login')) {
      rateLimitType = 'LOGIN'
    } else if (pathname.includes('/auth/register')) {
      rateLimitType = 'REGISTRATION'
    } else if (pathname.includes('/auth/forgot-password')) {
      rateLimitType = 'PASSWORD_RESET'
    } else if (pathname.includes('/prayer-requests')) {
      rateLimitType = 'PRAYER_POST'
    } else if (pathname.includes('/faithbot')) {
      rateLimitType = 'FAITHBOT'
    }
    
    // Apply rate limiting
    const rateLimit = await checkRateLimit(ip, rateLimitType, ip)
    
    if (!rateLimit.allowed) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Too many requests. Please slow down and try again later.',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        }),
        { 
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            ...getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime)
          }
        }
      )
    }
    
    // Add rate limit headers to successful responses
    const rateLimitHeaders = getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime)
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      res.headers.set(key, value)
    })
  }

  // Check authentication for protected routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      // Redirect to sign-in if not authenticated
      const redirectUrl = new URL("/auth/sign-in", request.url)
      redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return res
}

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*"],
}
