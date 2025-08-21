# 📧 COMPLETE Email Setup Guide for LightUp

## **🚨 IMPORTANT: Why This Guide?**

**Nodemailer** (the email library) can **ONLY run on the server-side**, not in your browser. That's why you're getting the `Can't resolve 'fs'` error.

## **🔧 STEP 1: Fix the Current Error First**

**Remove email calls from client-side code:**

1. **Open** `contexts/auth-context.tsx`
2. **Remove** this line: `import { EmailService } from "@/lib/email-service"`
3. **Remove** all email sending code from `login` and `register` functions
4. **Save the file**

This will fix your current dashboard error!

## **📝 STEP 2: Set Up Environment Variables**

### **2.1 Create/Edit `.env` file**
- **Location**: In your project root (same folder as `package.json`)
- **File name**: Exactly `.env` (not `.env.txt` or anything else)

### **2.2 Add these lines to `.env`:**
```env
# Email Configuration
EMAIL_USER=your-actual-gmail@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Your existing Supabase variables
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**⚠️ IMPORTANT:**
- **No spaces** around the `=` sign
- **No quotes** around the values
- **Replace** `your-actual-gmail@gmail.com` with your real Gmail
- **Replace** `your-16-character-app-password` with the app password you'll generate

## **🔐 STEP 3: Gmail App Password Setup (DETAILED)**

### **3.1 Enable 2-Factor Authentication**
1. **Go to** [Google Account Settings](https://myaccount.google.com/)
2. **Click** "Security" in the left sidebar
3. **Find** "2-Step Verification" 
4. **Click** "Get Started" or "Turn On"
5. **Follow** the setup process:
   - Enter your phone number
   - Choose SMS or phone call
   - Enter the 6-digit code Google sends
   - Click "Turn On"

### **3.2 Generate App Password**
1. **Go back to** [Google Account Settings](https://myaccount.google.com/)
2. **Click** "Security" again
3. **Find** "2-Step Verification" (should now show "On")
4. **Click** on "2-Step Verification"
5. **Scroll down** to find "App passwords"
6. **Click** "App passwords"
7. **Enter** your Gmail password when prompted
8. **Select app**: Choose "Mail"
9. **Select device**: Choose "Other (Custom name)"
10. **Type**: `LightUp` (or any name you want)
11. **Click** "Generate"
12. **Copy** the 16-character password (it looks like: `abcd efgh ijkl mnop`)
13. **Click** "Done"

### **3.3 Add App Password to `.env`**
- **Open** your `.env` file
- **Replace** `your-16-character-app-password` with the copied password
- **Remove spaces** from the password (should be exactly 16 characters)

**Example:**
```env
EMAIL_PASSWORD=abcdefghijklmnop
```

## **🔄 STEP 4: Restart Your Development Server**

1. **Stop** your current server (press `Ctrl + C` in terminal)
2. **Wait** 5 seconds
3. **Start** again: `pnpm dev`

## **📧 STEP 5: Test Email Functionality**

### **5.1 Test Registration (Email Verification)**
1. **Go to** `/auth/sign-up`
2. **Fill out** the registration form
3. **Submit** the form
4. **Check** your Gmail inbox
5. **Look for** email with subject: "🌟 Welcome to LightUp! Please Verify Your Email"

### **5.2 Test Wrong Password (Security Alert)**
1. **Go to** `/auth/sign-in`
2. **Enter** your correct email
3. **Enter** a **wrong password**
4. **Submit** the form
5. **Check** your Gmail for security alert email

### **5.3 Test Forgot Password**
1. **Go to** `/auth/forgot-password`
2. **Enter** your email address
3. **Click** "Send Reset Link"
4. **Check** your Gmail for password reset email

## **🚨 STEP 6: Troubleshooting Common Issues**

### **Issue 1: "Email sending failed"**
**Solution:**
- Check your `.env` file exists and has correct values
- Verify Gmail app password is exactly 16 characters
- Make sure 2FA is enabled on your Gmail account
- Check Gmail spam folder

### **Issue 2: "Authentication failed"**
**Solution:**
- Use app password, NOT your regular Gmail password
- Make sure you copied the entire 16-character app password
- Try generating a new app password

### **Issue 3: "Module not found: Can't resolve 'fs'"**
**Solution:**
- This means email code is running in the browser (wrong!)
- Email code should ONLY run in API routes (server-side)
- Check that you removed email imports from `auth-context.tsx`

### **Issue 4: "Email not received"**
**Solution:**
- Check spam/junk folder
- Wait 5-10 minutes (Gmail can be slow)
- Verify email address is correct
- Check Gmail sent folder to see if email was sent

## **🔍 STEP 7: Verify Everything Works**

### **7.1 Check Console Logs**
- **Open** browser developer tools (F12)
- **Go to** Console tab
- **Look for** messages like:
  - ✅ "Email sent successfully"
  - ✅ "Verification email sent"
  - ✅ "Password reset email sent"

### **7.2 Check Gmail**
- **Look in** your Gmail inbox
- **Check** spam/junk folder
- **Look in** Gmail sent folder (to see if emails were sent)

### **7.3 Test All Features**
- ✅ **Registration** → Verification email received
- ✅ **Wrong password** → Security alert email received  
- ✅ **Forgot password** → Reset link email received
- ✅ **Email verification** → Account activated
- ✅ **Password reset** → New password works

## **📱 STEP 8: Mobile Testing**

### **8.1 Test on Mobile Device**
1. **Open** your website on mobile
2. **Test** registration and login
3. **Check** emails on mobile Gmail app
4. **Verify** all email links work on mobile

### **8.2 Test Email Links**
- **Click** verification links in emails
- **Click** password reset links
- **Verify** they open correctly in mobile browser

## **🌐 STEP 9: Production Deployment**

### **9.1 Update Environment Variables**
```env
# Production settings
EMAIL_USER=your-production-email@gmail.com
EMAIL_PASSWORD=your-production-app-password
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### **9.2 Alternative Email Services**
**For better reliability, consider:**
- **SendGrid**: Professional email service
- **AWS SES**: Amazon's email service
- **Mailgun**: Developer-friendly email service

## **📞 STEP 10: Get Help**

### **If you're still stuck:**

1. **Check** your `.env` file format
2. **Verify** Gmail app password is correct
3. **Ensure** 2FA is enabled on Gmail
4. **Restart** your development server
5. **Check** browser console for errors
6. **Look** in Gmail spam folder

### **Common Mistakes:**
- ❌ Using regular Gmail password instead of app password
- ❌ Not enabling 2FA before generating app password
- ❌ Adding spaces or quotes in `.env` file
- ❌ Not restarting server after changing `.env`
- ❌ Email code running in browser instead of server

---

## **🎉 SUCCESS CHECKLIST**

**You're done when:**
- ✅ Dashboard loads without errors
- ✅ Registration sends verification email
- ✅ Wrong password sends security alert
- ✅ Forgot password sends reset link
- ✅ All email links work correctly
- ✅ No more `Can't resolve 'fs'` errors

**🎯 Your LightUp platform now has professional email functionality!**

---

**💡 Pro Tip**: Test with a friend's email to make sure the system works for different users!
