import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/app/api/_email/email-service';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limiter';
import { getClientIP, logSecurityEvent } from '@/lib/auth-helpers';

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  try {
    const { groupId, inviteeEmail, inviterName } = await request.json();

    if (!groupId || !inviteeEmail || !inviterName) {
      return NextResponse.json(
        { error: 'Group ID, invitee email, and inviter name are required' },
        { status: 400 }
      );
    }

    // Rate limiting
    const rateLimit = await checkRateLimit('youth_group_invite', 'GENERAL_API', ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many invitation requests. Please try again later.' },
        { 
          status: 429,
          headers: getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime)
        }
      );
    }

    // Get group details
    const { data: group, error: groupError } = await supabaseAdmin
      .from('youth_groups')
      .select('id, name, description')
      .eq('id', groupId)
      .single();

    if (groupError || !group) {
      return NextResponse.json(
        { error: 'Youth group not found' },
        { status: 404 }
      );
    }

    // Check if invitee exists in the system
    const { data: invitee, error: inviteeError } = await supabaseAdmin
      .from('users')
      .select('id, name, username, email')
      .eq('email', inviteeEmail)
      .single();

    if (inviteeError || !invitee) {
      return NextResponse.json(
        { error: 'User not found with that email address' },
        { status: 404 }
      );
    }

    // Check if user is already a member
    const { data: existingMember } = await supabaseAdmin
      .from('group_members')
      .select('id')
      .eq('group_id', groupId)
      .eq('user_id', invitee.id)
      .single();

    if (existingMember) {
      return NextResponse.json(
        { error: 'User is already a member of this group' },
        { status: 400 }
      );
    }

    // Generate invite link
    const inviteLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/youth-groups/${groupId}?invite=true`;

    // Send email notification
    const emailResult = await EmailService.sendYouthGroupInvite(
      inviteeEmail,
      invitee.name || invitee.username || 'User',
      group.name,
      inviterName,
      group.description || 'Join our youth group and grow in faith together!',
      inviteLink
    );

    if (emailResult.success) {
      // Log successful invitation
      await logSecurityEvent(invitee.id, 'youth_group_invite_sent', {
        groupId,
        groupName: group.name,
        inviterName,
        inviteeEmail
      }, ip, userAgent);

      return NextResponse.json(
        { 
          message: 'Youth group invitation sent successfully',
          success: true
        },
        { 
          status: 200,
          headers: getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime)
        }
      );
    } else {
      console.error('Failed to send youth group invite:', emailResult.error);
      
      await logSecurityEvent(invitee.id, 'youth_group_invite_failed', {
        groupId,
        groupName: group.name,
        inviterName,
        error: emailResult.error
      }, ip, userAgent);

      return NextResponse.json(
        { error: 'Failed to send invitation email' },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Youth group invite error:', error);
    
    await logSecurityEvent(null, 'youth_group_invite_error', {
      error: error.message,
      stack: error.stack
    }, ip, userAgent);
    
    return NextResponse.json(
      { error: 'An error occurred while sending the invitation' },
      { status: 500 }
    );
  }
}
