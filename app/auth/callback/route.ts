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
    let redirectUrl = requestUrl.origin + '/'
    
    if (redirectTo) {
      // Use the redirectTo parameter if it exists
      redirectUrl = requestUrl.origin + redirectTo
      logIfEnabled(`🔄 Redirecting to requested URL: ${redirectUrl}`)
    } else {
      // Check if we're in production and use environment variable if available
      if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SITE_URL) {
        redirectUrl = process.env.NEXT_PUBLIC_SITE_URL + '/'
        logIfEnabled(`🚀 Using production redirect URL: ${redirectUrl}`)
      } else {
        logIfEnabled(`🔧 Using development redirect URL: ${redirectUrl}`)
      }
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