import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password'
  }
});

export interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export class EmailService {
  // Send email verification
  static async sendVerificationEmail(email: string, verificationLink: string, username: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🌟 LightUp Catholic Youth</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Welcome to our community!</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Hi ${username}! 👋</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            Thank you for joining LightUp! To complete your registration and start your faith journey, 
            please verify your email address by clicking the button below.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 25px; 
                      display: inline-block; 
                      font-weight: bold; 
                      font-size: 16px;
                      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
              ✅ Verify Email Address
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            If the button doesn't work, you can copy and paste this link into your browser:
          </p>
          
          <p style="background: #f8f9fa; padding: 15px; border-radius: 5px; word-break: break-all; color: #667eea; font-family: monospace;">
            ${verificationLink}
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 14px; margin: 0;">
              This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>LightUp Catholic Youth Platform</p>
          <p>Building faith, one connection at a time</p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: '🌟 Welcome to LightUp! Please Verify Your Email',
      html
    });
  }

  // Send password reset email
  static async sendPasswordResetEmail(email: string, resetLink: string, username: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🔐 LightUp Password Reset</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Secure your account</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Hi ${username}! 🔐</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            We received a request to reset your password. If you made this request, 
            click the button below to create a new password.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 25px; 
                      display: inline-block; 
                      font-weight: bold; 
                      font-size: 16px;
                      box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);">
              🔑 Reset Password
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            If the button doesn't work, you can copy and paste this link into your browser:
          </p>
          
          <p style="background: #f8f9fa; padding: 15px; border-radius: 5px; word-break: break-all; color: #ff6b6b; font-family: monospace;">
            ${resetLink}
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 14px; margin: 0;">
              This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>LightUp Catholic Youth Platform</p>
          <p>Building faith, one connection at a time</p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: '🔐 Reset Your LightUp Password',
      html
    });
  }

  // Send wrong password notification
  static async sendWrongPasswordNotification(email: string, username: string, loginTime: string, ipAddress: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">⚠️ Security Alert</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Failed login attempt detected</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Hi ${username}! ⚠️</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            We detected a failed login attempt for your LightUp account. This could mean someone tried to access your account with an incorrect password.
          </p>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #856404; margin-top: 0;">📊 Login Attempt Details:</h3>
            <ul style="color: #856404; margin: 0; padding-left: 20px;">
              <li><strong>Time:</strong> ${loginTime}</li>
              <li><strong>IP Address:</strong> ${ipAddress}</li>
              <li><strong>Status:</strong> Failed (Wrong Password)</li>
            </ul>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            <strong>If this was you:</strong> No action needed. Just make sure you're using the correct password.
          </p>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            <strong>If this wasn't you:</strong> Your account may be at risk. We recommend:
          </p>
          
          <ul style="color: #666; line-height: 1.6; margin-bottom: 20px; padding-left: 20px;">
            <li>Change your password immediately</li>
            <li>Enable two-factor authentication if available</li>
            <li>Check for any suspicious activity</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/forgot-password" 
               style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 25px; 
                      display: inline-block; 
                      font-weight: bold; 
                      font-size: 16px;
                      box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);">
              🔑 Reset Password
            </a>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 14px; margin: 0;">
              This is an automated security notification. If you have any concerns, please contact our support team.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>LightUp Catholic Youth Platform</p>
          <p>Building faith, one connection at a time</p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: '⚠️ Security Alert: Failed Login Attempt',
      html
    });
  }

  // Send prayer wall reply notification
  static async sendPrayerReplyNotification(
    email: string, 
    username: string, 
    prayerTitle: string, 
    replyContent: string, 
    replyerName: string
  ) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🙏 Prayer Reply</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Someone prayed for your request</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Hi ${username}! 🙏</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            Great news! Someone has responded to your prayer request with love and support.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">📝 Your Prayer Request:</h3>
            <p style="color: #666; margin: 0; font-style: italic;">"${prayerTitle}"</p>
          </div>
          
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2e7d32; margin-top: 0;">💬 Prayer Response from ${replyerName}:</h3>
            <p style="color: #333; margin: 0; line-height: 1.6;">"${replyContent}"</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/prayer-wall" 
               style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 25px; 
                      display: inline-block; 
                      font-weight: bold; 
                      font-size: 16px;
                      box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);">
              🙏 View All Responses
            </a>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 14px; margin: 0;">
              You're receiving this because someone responded to your prayer request. Keep the faith! ✨
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>LightUp Catholic Youth Platform</p>
          <p>Building faith, one connection at a time</p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: '🙏 Someone prayed for your request!',
      html
    });
  }

  // Send youth group invite notification
  static async sendYouthGroupInvite(
    email: string, 
    username: string, 
    groupName: string, 
    inviterName: string, 
    groupDescription: string,
    inviteLink: string
  ) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">👥 Youth Group Invite</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">You've been invited to join!</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Hi ${username}! 👋</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            <strong>${inviterName}</strong> has invited you to join the <strong>${groupName}</strong> youth group on LightUp!
          </p>
          
          <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1976D2; margin-top: 0;">🏛️ About ${groupName}:</h3>
            <p style="color: #333; margin: 0; line-height: 1.6;">${groupDescription}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteLink}" 
               style="background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 25px; 
                      display: inline-block; 
                      font-weight: bold; 
                      font-size: 16px;
                      box-shadow: 0 4px 15px rgba(33, 150, 243, 0.4);">
              👥 Join Group
            </a>
          </div>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              <strong>💡 What you'll get:</strong> Connect with fellow Catholic youth, participate in group activities, 
              share your faith journey, and grow together in Christ!
            </p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 14px; margin: 0;">
              This invite was sent by ${inviterName}. If you don't want to receive these invites, you can update your preferences in your account settings.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>LightUp Catholic Youth Platform</p>
          <p>Building faith, one connection at a time</p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: `👥 You're invited to join ${groupName}!`,
      html
    });
  }

  // Send weekly faith challenge notification
  static async sendWeeklyChallengeNotification(
    email: string, 
    username: string, 
    challengeTitle: string, 
    challengeDescription: string,
    challengeLink: string
  ) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">⭐ Weekly Faith Challenge</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Your new challenge is here!</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Hi ${username}! ⭐</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            Ready for this week's faith challenge? Let's grow together in our spiritual journey!
          </p>
          
          <div style="background: #f3e5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #7B1FA2; margin-top: 0;">🎯 This Week's Challenge:</h3>
            <h4 style="color: #333; margin: 10px 0;">${challengeTitle}</h4>
            <p style="color: #666; margin: 0; line-height: 1.6;">${challengeDescription}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${challengeLink}" 
               style="background: linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 25px; 
                      display: inline-block; 
                      font-weight: bold; 
                      font-size: 16px;
                      box-shadow: 0 4px 15px rgba(156, 39, 176, 0.4);">
              🚀 Start Challenge
            </a>
          </div>
          
          <div style="background: #e8f5e8; border: 1px solid #c8e6c9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #2e7d32; margin: 0; font-size: 14px;">
              <strong>💪 Remember:</strong> Every small step in faith makes a big difference. You've got this!
            </p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 14px; margin: 0;">
              Complete the challenge and share your experience with the community. Let's inspire each other! ✨
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>LightUp Catholic Youth Platform</p>
          <p>Building faith, one connection at a time</p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: `⭐ New Weekly Faith Challenge: ${challengeTitle}`,
      html
    });
  }

  // Generic email sender
  private static async sendEmail(emailData: EmailData) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER || 'your-email@gmail.com',
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html
      };

      const result = await transporter.sendMail(mailOptions);
      
      return {
        success: true,
        messageId: result.messageId
      };
    } catch (error: any) {
      console.error('Email sending failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}
