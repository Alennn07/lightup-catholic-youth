import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { EmailService } from '../../_email/email-service';
import { RegisterSchema } from '@/lib/validations';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limiter';
import { getClientIP, createFriendlyError, logSecurityEvent, generateSecureToken, storeToken } from '@/lib/auth-helpers';

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
    // Rate limiting
    const rateLimit = await checkRateLimit(email, 'REGISTRATION', ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many registration attempts. Please try again later.' },
        { 
          status: 429,
          headers: getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime)
        }
      );
    }

    const body = await request.json();
    
    // Validate request body with Zod
    const validatedData = RegisterSchema.parse(body);
    const { name, username, email, password, age, parish, diocese } = validatedData;

    console.log('🚀 Simple registration started for:', email);

    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // Don't auto-confirm, send verification email instead
      user_metadata: {
        name,
        username,
        age,
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
      
      return NextResponse.json(
        { error: createFriendlyError(authError) },
        { status: 400 }
      );
    }

    console.log('✅ Auth user created:', authData.user?.id);

    // 2. Create user profile in users table
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user!.id,
        name,
        username,
        email,
        age: parseInt(age),
        parish,
        diocese,
        created_at: new Date().toISOString()
      });

    if (profileError) {
      console.error('❌ Profile creation failed:', profileError);
      
      // Log security event
      await logSecurityEvent(authData.user?.id, 'profile_creation_failed', {
        error: profileError.message
      }, ip, userAgent);
      
      // If profile creation fails, we should clean up the auth user
      // But for now, let's just log it
      console.warn('⚠️ Profile creation failed, auth user remains');
    } else {
      console.log('✅ User profile created successfully');
    }

    // 3. Generate verification token and send welcome email
    try {
      const verificationToken = generateSecureToken();
      storeToken(verificationToken, authData.user!.id, 'email_verification', 24 * 60 * 60 * 1000); // 24 hours
      
      const verificationLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/verify-email?token=${verificationToken}`;
      
      await EmailService.sendVerificationEmail(
        email,
        verificationLink,
        username
      );
      
      console.log('✅ Welcome email sent successfully');
    } catch (emailError) {
      console.error('❌ Failed to send welcome email:', emailError);
      // Don't fail registration if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
      user: {
        id: authData.user!.id,
        name,
        username,
        email,
        age: parseInt(age),
        parish,
        diocese,
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error('❌ Simple registration API error:', error);
    
    // Log security event
    await logSecurityEvent(null, 'registration_error', {
      error: error.message,
      stack: error.stack
    }, ip, userAgent);
    
    if (error.name === 'ZodError') {
      return NextResponse.json({ 
        error: 'Please check your input and try again.',
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
