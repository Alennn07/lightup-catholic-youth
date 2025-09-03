import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { LoginSchema } from '@/lib/validations';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limiter';
import { getClientIP, createFriendlyError, logSecurityEvent } from '@/lib/auth-helpers';
import { EmailService } from '@/app/api/_email/email-service';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  try {
    const body = await request.json();
    
    // Validate request body with Zod
    const validatedData = LoginSchema.parse(body);
    const { email, password } = validatedData;

    // Rate limiting
    const rateLimit = await checkRateLimit(email, 'LOGIN', ip);
    if (!rateLimit.allowed) {
      // Log failed login attempt
      await logSecurityEvent(null, 'login_rate_limited', {
        email,
        ip,
        userAgent
      }, ip, userAgent);
      
      return NextResponse.json(
        { error: 'Too many login attempts. Please wait 15 minutes before trying again.' },
        { 
          status: 429,
          headers: getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime)
        }
      );
    }

    console.log('🔐 Login attempt for:', email);

    // Attempt to sign in
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      console.error('❌ Login failed:', authError);
      
      // Log failed login attempt
      await logSecurityEvent(null, 'login_failed', {
        email,
        error: authError.message,
        ip,
        userAgent
      }, ip, userAgent);
      
      // Send security alert for failed login
      try {
        const { data: user } = await supabase
          .from('users')
          .select('name, username')
          .eq('email', email)
          .single();
          
        if (user) {
          await EmailService.sendWrongPasswordNotification(
            email,
            user.name || user.username || 'User',
            new Date().toLocaleString(),
            ip
          );
        }
      } catch (emailError) {
        console.error('Failed to send security alert:', emailError);
      }
      
      return NextResponse.json(
        { error: createFriendlyError(authError) },
        { status: 401 }
      );
    }

    // Log successful login
    await logSecurityEvent(authData.user?.id, 'login_success', {
      email,
      ip,
      userAgent
    }, ip, userAgent);

    console.log('✅ Login successful for:', email);

    return NextResponse.json({
      success: true,
      message: 'Login successful!',
      user: {
        id: authData.user?.id,
        email: authData.user?.email,
        name: authData.user?.user_metadata?.name,
        username: authData.user?.user_metadata?.username
      },
      session: authData.session
    }, { 
      status: 200,
      headers: getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime)
    });

  } catch (error: any) {
    console.error('❌ Login API error:', error);
    
    // Log security event
    await logSecurityEvent(null, 'login_error', {
      error: error.message,
      stack: error.stack
    }, ip, userAgent);
    
    if (error.name === 'ZodError') {
      return NextResponse.json({ 
        error: 'Please check your email and password.',
        details: error.errors.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }, { status: 400 });
    }
    
    return NextResponse.json(
      { error: createFriendlyError(error) },
      { status: 500 }
    );
  }
}
