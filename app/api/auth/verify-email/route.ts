import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { token, userId } = await request.json();

    if (!token || !userId) {
      return NextResponse.json(
        { error: 'Token and user ID are required' },
        { status: 400 }
      );
    }

    // In a real app, you'd verify the token here
    // For now, we'll just mark the user as verified
    
    // Update user's email verification status
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        email_verified: true,
        email_verified_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Email verification update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to verify email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Email verified successfully' },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
