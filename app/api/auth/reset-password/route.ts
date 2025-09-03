import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { verifyToken, revokeToken } from '@/lib/auth-helpers';
import { getClientIP, logSecurityEvent, validatePassword } from '@/lib/auth-helpers';

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Reset token and new password are required' },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400 }
      );
    }

    // Verify the reset token
    const tokenVerification = verifyToken(token, 'password_reset');
    
    if (!tokenVerification.valid || !tokenVerification.userId) {
      await logSecurityEvent(null, 'password_reset_failed', {
        token: token.substring(0, 8) + '...',
        reason: 'invalid_or_expired_token'
      }, ip, userAgent);
      
      return NextResponse.json(
        { error: 'Invalid or expired reset token. Please request a new password reset.' },
        { status: 400 }
      );
    }

    const userId = tokenVerification.userId;

    // Update user's password in Supabase
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { password: newPassword }
    );

    if (updateError) {
      console.error('Password update error:', updateError);
      
      await logSecurityEvent(userId, 'password_reset_update_failed', {
        error: updateError.message
      }, ip, userAgent);
      
      return NextResponse.json(
        { error: 'Failed to update password. Please try again.' },
        { status: 500 }
      );
    }

    // Revoke the used token
    revokeToken(token);

    // Log successful password reset
    await logSecurityEvent(userId, 'password_reset_success', {
      ip,
      userAgent
    }, ip, userAgent);

    return NextResponse.json(
      { 
        message: 'Password updated successfully! You can now sign in with your new password.',
        success: true
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Reset password error:', error);
    
    await logSecurityEvent(null, 'password_reset_error', {
      error: error.message,
      stack: error.stack
    }, ip, userAgent);
    
    return NextResponse.json(
      { error: 'An error occurred while resetting your password. Please try again.' },
      { status: 500 }
    );
  }
}
