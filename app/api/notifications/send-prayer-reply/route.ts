import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/app/api/_email/email-service';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limiter';
import { getClientIP, logSecurityEvent } from '@/lib/auth-helpers';

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  try {
    const { prayerId, replyContent, replyerName } = await request.json();

    if (!prayerId || !replyContent || !replyerName) {
      return NextResponse.json(
        { error: 'Prayer ID, reply content, and replyer name are required' },
        { status: 400 }
      );
    }

    // Rate limiting
    const rateLimit = await checkRateLimit('prayer_reply_notification', 'GENERAL_API', ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many notification requests. Please try again later.' },
        { 
          status: 429,
          headers: getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime)
        }
      );
    }

    // Get prayer request details and original poster
    const { data: prayer, error: prayerError } = await supabaseAdmin
      .from('prayer_requests')
      .select(`
        id,
        title,
        content,
        user_id,
        users!inner(email, name, username)
      `)
      .eq('id', prayerId)
      .single();

    if (prayerError || !prayer) {
      return NextResponse.json(
        { error: 'Prayer request not found' },
        { status: 404 }
      );
    }

    // Don't send notification to the same user who replied
    if (prayer.user_id === replyerName) {
      return NextResponse.json(
        { message: 'No notification sent (same user)' },
        { status: 200 }
      );
    }

    // Send email notification
    const emailResult = await EmailService.sendPrayerReplyNotification(
      prayer.users.email,
      prayer.users.name || prayer.users.username || 'User',
      prayer.title,
      replyContent,
      replyerName
    );

    if (emailResult.success) {
      // Log successful notification
      await logSecurityEvent(prayer.user_id, 'prayer_reply_notification_sent', {
        prayerId,
        replyerName,
        recipientEmail: prayer.users.email
      }, ip, userAgent);

      return NextResponse.json(
        { 
          message: 'Prayer reply notification sent successfully',
          success: true
        },
        { 
          status: 200,
          headers: getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime)
        }
      );
    } else {
      console.error('Failed to send prayer reply notification:', emailResult.error);
      
      await logSecurityEvent(prayer.user_id, 'prayer_reply_notification_failed', {
        prayerId,
        replyerName,
        error: emailResult.error
      }, ip, userAgent);

      return NextResponse.json(
        { error: 'Failed to send notification email' },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Prayer reply notification error:', error);
    
    await logSecurityEvent(null, 'prayer_reply_notification_error', {
      error: error.message,
      stack: error.stack
    }, ip, userAgent);
    
    return NextResponse.json(
      { error: 'An error occurred while sending the notification' },
      { status: 500 }
    );
  }
}
