import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { RegisterSchema } from '@/lib/validations';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limiter';
import { getClientIP, logSecurityEvent } from '@/lib/auth-helpers';
import { validateEmailDomain } from '@/lib/email-validation';

// Initialize Supabase clients for user registration with auto-login
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Admin client for user creation
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Regular client for session creation
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
});

export async function POST(request: NextRequest) {
  console.log('🚀 API ROUTE HIT: /api/auth/register-auto')
  const ip = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  try {
    console.log('🔍 Debug: Starting auto-login registration process')
    const body = await request.json();
    console.log('🔍 Debug: Request body received:', { ...body, password: '[HIDDEN]' })
    
    // Validate request body with Zod
    console.log('🔍 Debug: Validating with Zod schema')
    const validatedData = RegisterSchema.parse(body);
    const { name, username, email, password, age, parish, diocese } = validatedData;
    console.log('🔍 Debug: Zod validation passed')

    // Validate email domain
    const emailValidation = validateEmailDomain(email);
    if (!emailValidation.isValid) {
      console.log('❌ Email domain validation failed:', emailValidation.error);
      return NextResponse.json(
        { 
          error: emailValidation.error || 'Invalid email domain',
          code: 'INVALID_EMAIL_DOMAIN'
        },
        { status: 400 }
      );
    }

    // Rate limiting (after we have the email)
    const rateLimit = await checkRateLimit(email, 'REGISTRATION', ip);
    if (!rateLimit.allowed) {
      console.log('❌ Rate limit exceeded for email:', email);
      return NextResponse.json(
        { 
          error: 'Too many registration attempts. Please try again later.',
          code: 'RATE_LIMIT_EXCEEDED'
        },
        { 
          status: 429,
          headers: getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime)
        }
      );
    }

    console.log('🚀 Auto-login registration started for:', email);

    // Create user with admin client (no email confirmation needed)
    console.log('🔍 Debug: Creating user with admin client')
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email - no verification needed
      user_metadata: {
        name,
        username,
        age: age,
        parish,
        diocese
      }
    });

    if (authError) {
      console.error('❌ Auth user creation failed:', authError);
      
      // Log security event
      await logSecurityEvent(null, 'registration_failed', {
        email,
        error: authError.message
      }, ip, userAgent);
      
      // Handle specific Supabase auth errors
      if (authError.message?.includes('User already registered') || 
          authError.message?.includes('already registered') ||
          authError.message?.includes('already exists')) {
        return NextResponse.json({ 
          error: 'This email is already registered. Please sign in instead.',
          code: 'USER_ALREADY_EXISTS'
        }, { status: 409 });
      }
      
      if (authError.message?.includes('Invalid email') || 
          authError.message?.includes('invalid email')) {
        return NextResponse.json({ 
          error: 'Please enter a valid email address.',
          code: 'INVALID_EMAIL'
        }, { status: 400 });
      }
      
      if (authError.message?.includes('Password should be at least') ||
          authError.message?.includes('password')) {
        return NextResponse.json({ 
          error: 'Password must be at least 6 characters long.',
          code: 'WEAK_PASSWORD'
        }, { status: 400 });
      }
      
      // Generic error
      return NextResponse.json({ 
        error: authError.message || 'Registration failed. Please try again.',
        code: 'AUTH_ERROR'
      }, { status: 400 });
    }

    console.log('✅ Auth user created successfully:', authData.user?.id);

    // Create a session for auto-login
    console.log('🔍 Debug: Creating session for auto-login')
    const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (sessionError) {
      console.error('❌ Session creation failed:', sessionError);
      // Continue without auto-login
      console.warn('⚠️ User created but session creation failed, continuing...');
    } else {
      console.log('✅ Session created for auto-login');
    }

    // Create user profile in public.users table
    console.log('🔍 Debug: Creating user profile in public.users table')
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user!.id,
        username: username,
        name: name,
        email: email,
        age: age,
        parish: parish,
        diocese: diocese,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (profileError) {
      console.error('❌ Profile creation failed:', profileError);
      // Don't fail the registration if profile creation fails
      console.warn('⚠️ User created but profile creation failed, continuing...');
    } else {
      console.log('✅ User profile created successfully');
    }

    // Log successful registration
    await logSecurityEvent(authData.user!.id, 'registration_success', {
      email,
      username,
      name
    }, ip, userAgent);

    console.log('✅ Auto-login registration completed successfully');

    return NextResponse.json({
      success: true,
      message: 'Registration successful! You are now logged in.',
      user: {
        id: authData.user!.id,
        name,
        username,
        email,
        age: age,
        parish,
        diocese,
      },
      // Enable auto-login with session data
      autoLogin: true,
      session: sessionData?.session
    }, { status: 200 });

  } catch (error: any) {
    console.error('❌ Auto-login registration API error:', error);
    
    // Log security event
    await logSecurityEvent(null, 'registration_error', {
      error: error.message,
      stack: error.stack
    }, ip, userAgent);
    
    return NextResponse.json({ 
      error: 'Registration failed. Please try again.',
      code: 'REGISTRATION_ERROR'
    }, { status: 500 });
  }
}
