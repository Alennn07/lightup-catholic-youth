'use server';

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { EmailService } from '@/app/api/_email/email-service';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user information
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('email, name, username')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Generate new verification token
    const verificationToken = crypto.randomUUID();
    const verificationLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/verify-email?token=${verificationToken}&userId=${userId}`;

    const username = user.username || user.name || 'User';
    
    // Send verification email
    const emailResult = await EmailService.sendVerificationEmail(
      user.email,
      verificationLink,
      username
    );

    if (emailResult.success) {
      return NextResponse.json(
        { message: 'Verification email sent successfully' },
        { status: 200 }
      );
    } else {
      console.error('Email sending failed:', emailResult.error);
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
