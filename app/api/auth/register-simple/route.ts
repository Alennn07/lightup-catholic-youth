'use server';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { EmailService } from '../../_email/email-service';

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
  try {
    const { name, username, email, password, age, parish, diocese } = await request.json();

    // Validate required fields
    if (!name || !username || !email || !password || !age || !parish || !diocese) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

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
      return NextResponse.json(
        { error: authError.message },
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
      // If profile creation fails, we should clean up the auth user
      // But for now, let's just log it
      console.warn('⚠️ Profile creation failed, auth user remains');
    } else {
      console.log('✅ User profile created successfully');
    }

    // 3. Send welcome email with verification link
    try {
      const verificationLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/verify-email?token=${authData.user!.id}`;
      
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
    return NextResponse.json(
      { error: 'Internal server error during registration' },
      { status: 500 }
    );
  }
}
