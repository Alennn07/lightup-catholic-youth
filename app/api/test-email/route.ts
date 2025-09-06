import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '../_email/email-service';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    console.log('🧪 Testing email service...');
    console.log('📧 Email:', email);
    console.log('🔧 EMAIL_USER:', process.env.EMAIL_USER);
    console.log('🔧 EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'Set' : 'Not set');

    // Test email sending
    const testLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/verify-email?token=test123&userId=test456`;
    
    const result = await EmailService.sendVerificationEmail(
      email,
      testLink,
      'Test User'
    );

    console.log('📧 Email result:', result);

    return NextResponse.json({
      success: result.success,
      message: result.success ? 'Test email sent successfully!' : 'Failed to send test email',
      error: result.error || null
    });

  } catch (error: any) {
    console.error('❌ Test email error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error'
    }, { status: 500 });
  }
}
