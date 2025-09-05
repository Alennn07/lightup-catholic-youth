import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { logIfEnabled } from "@/lib/performance-monitor"

// Force this route to be dynamic since it uses request.url
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  
  try {
    const code = requestUrl.searchParams.get('code')

    if (code) {
      const cookieStore = await cookies()
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value
            },
            set(name: string, value: string, options: any) {
              cookieStore.set({ name, value, ...options })
            },
            remove(name: string, options: any) {
              cookieStore.set({ name, value: '', ...options })
            },
          },
        }
      )
      
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        logIfEnabled(`Auth callback error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error')
        // Redirect to sign-in with error
        return NextResponse.redirect(requestUrl.origin + '/auth/sign-in?error=auth_failed')
      }
      
      logIfEnabled(`Auth callback successful: ${JSON.stringify(data)}`)
    }

    // Check for redirectTo parameter first
    const redirectTo = requestUrl.searchParams.get('redirectTo')
    
    // Determine the correct origin for redirects
    let baseOrigin = requestUrl.origin
    
    // ALWAYS force localhost if we detect localhost in the request
    if (requestUrl.hostname === 'localhost' || process.env.NODE_ENV === 'development') {
      baseOrigin = 'http://localhost:3000' // Always use localhost in development
      logIfEnabled(`🔧 FORCING localhost origin: ${baseOrigin}`)
    } else if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SITE_URL) {
      baseOrigin = process.env.NEXT_PUBLIC_SITE_URL
      logIfEnabled(`🚀 Using production origin: ${baseOrigin}`)
    }
    
    let redirectUrl = baseOrigin + '/'
    
    if (redirectTo) {
      // Use the redirectTo parameter if it exists
      redirectUrl = baseOrigin + redirectTo
      logIfEnabled(`🔄 Redirecting to requested URL: ${redirectUrl}`)
    } else {
      logIfEnabled(`🔧 Using base origin: ${baseOrigin}`)
    }
    
    logIfEnabled(`Final redirect URL: ${redirectUrl}`)
    
    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    logIfEnabled(`Callback route error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error')
    
    // Create a fallback URL if requestUrl is not available
    let fallbackOrigin = 'http://localhost:3000'
    if (requestUrl) {
      fallbackOrigin = requestUrl.origin
    }
    
    // Fallback redirect to sign-in
    return NextResponse.redirect(fallbackOrigin + '/auth/sign-in?error=callback_failed')
  }
}