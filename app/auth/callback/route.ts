import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Force this route to be dynamic since it uses request.url
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  let requestUrl: URL
  
  try {
    requestUrl = new URL(request.url)
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
        console.error('Auth callback error:', error)
        // Redirect to sign-in with error
        return NextResponse.redirect(requestUrl.origin + '/auth/sign-in?error=auth_failed')
      }
      
      console.log('Auth callback successful:', data)
    }

    // URL to redirect to after sign in process completes
    const redirectUrl = requestUrl.origin + '/dashboard'
    console.log('Redirecting to:', redirectUrl)
    
    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    console.error('Callback route error:', error)
    
    // Create a fallback URL if requestUrl is not available
    let fallbackOrigin = 'http://localhost:3000'
    if (requestUrl) {
      fallbackOrigin = requestUrl.origin
    }
    
    // Fallback redirect to sign-in
    return NextResponse.redirect(fallbackOrigin + '/auth/sign-in?error=callback_failed')
  }
}