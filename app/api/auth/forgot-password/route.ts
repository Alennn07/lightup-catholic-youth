import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { EmailService } from '@/app/api/_email/email-service';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limiter';
import { getClientIP, logSecurityEvent, generateSecureToken, storeToken } from '@/lib/auth-helpers';
import { validateEmailDomain } from '@/lib/email-validation';

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

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

    // Rate limiting
    const rateLimit = await checkRateLimit(email, 'PASSWORD_RESET', ip);
    if (!rateLimit.allowed) {
      await logSecurityEvent(null, 'password_reset_rate_limited', {
        email,
        ip,
        userAgent
      }, ip, userAgent);
      
      return NextResponse.json(
        { error: 'Too many password reset attempts. Please wait an hour before trying again.' },
        { 
          status: 429,
          headers: getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime)
        }
      );
    }

    // Check if user exists
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, name, username, email')
      .eq('email', email)
      .single();

    if (userError || !user) {
      // Don't reveal if user exists or not for security
      await logSecurityEvent(null, 'password_reset_attempt_unknown_user', {
        email,
        ip,
        userAgent
      }, ip, userAgent);
      
      return NextResponse.json(
        { message: 'If an account with that email exists, a reset link has been sent.' },
        { status: 200 }
      );
    }

    // Generate secure reset token
    const resetToken = generateSecureToken();
    storeToken(resetToken, user.id, 'password_reset', 60 * 60 * 1000); // 1 hour
    
    const resetLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;

    const username = user.username || user.name || 'User';
    
    // Send password reset email
    const emailResult = await EmailService.sendPasswordResetEmail(
      email,
      resetLink,
      username
    );

    if (emailResult.success) {
      // Log successful password reset request
      await logSecurityEvent(user.id, 'password_reset_requested', {
        email,
        ip,
        userAgent
      }, ip, userAgent);
      
      return NextResponse.json(
        { 
          message: 'If an account with that email exists, a password reset link has been sent.',
          success: true
        },
        { 
          status: 200,
          headers: getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime)
        }
      );
    } else {
      console.error('Email sending failed:', emailResult.error);
      
      await logSecurityEvent(user.id, 'password_reset_email_failed', {
        email,
        error: emailResult.error
      }, ip, userAgent);
      
      return NextResponse.json(
        { error: 'Failed to send reset email. Please try again later.' },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Forgot password error:', error);
    
    await logSecurityEvent(null, 'password_reset_error', {
      error: error.message,
      stack: error.stack
    }, ip, userAgent);
    
    return NextResponse.json(
      { error: 'An error occurred while processing your request. Please try again.' },
      { status: 500 }
    );
  }
}
