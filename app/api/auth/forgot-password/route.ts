'use server';

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { EmailService } from '@/app/api/_email/email-service';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, name, username')
      .eq('email', email)
      .single();

    if (userError || !user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        { message: 'If an account with that email exists, a reset link has been sent.' },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomUUID();
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}&userId=${user.id}`;

    // Store reset token in database (you might want to create a separate table for this)
    // For now, we'll just send the email
    const username = user.username || user.name || 'User';
    
    // Send password reset email
    const emailResult = await EmailService.sendPasswordResetEmail(
      email,
      resetLink,
      username
    );

    if (emailResult.success) {
      return NextResponse.json(
        { message: 'Password reset link sent successfully' },
        { status: 200 }
      );
    } else {
      console.error('Email sending failed:', emailResult.error);
      return NextResponse.json(
        { error: 'Failed to send reset email' },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
