import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { verifyToken, revokeToken } from '@/lib/auth-helpers';
import { getClientIP, logSecurityEvent } from '@/lib/auth-helpers';

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Verify the token
    const tokenVerification = verifyToken(token, 'email_verification');
    
    if (!tokenVerification.valid || !tokenVerification.userId) {
      await logSecurityEvent(null, 'email_verification_failed', {
        token: token.substring(0, 8) + '...',
        reason: 'invalid_or_expired_token'
      }, ip, userAgent);
      
      return NextResponse.json(
        { error: 'Invalid or expired verification token. Please request a new one.' },
        { status: 400 }
      );
    }

    const userId = tokenVerification.userId;

    // Update user's email verification status
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ 
        email_verified: true,
        email_verified_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Email verification update error:', updateError);
      
      await logSecurityEvent(userId, 'email_verification_error', {
        error: updateError.message
      }, ip, userAgent);
      
      return NextResponse.json(
        { error: 'Failed to verify email. Please try again.' },
        { status: 500 }
      );
    }

    // Revoke the used token
    revokeToken(token);

    // Log successful verification
    await logSecurityEvent(userId, 'email_verified', {
      ip,
      userAgent
    }, ip, userAgent);

    return NextResponse.json(
      { 
        message: 'Email verified successfully! You can now sign in to your account.',
        success: true
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Email verification error:', error);
    
    await logSecurityEvent(null, 'email_verification_error', {
      error: error.message,
      stack: error.stack
    }, ip, userAgent);
    
    return NextResponse.json(
      { error: 'An error occurred while verifying your email. Please try again.' },
      { status: 500 }
    );
  }
}
