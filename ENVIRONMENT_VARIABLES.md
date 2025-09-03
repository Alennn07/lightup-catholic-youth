# 🚀 Environment Variables Configuration - LightUp Catholic Youth Platform

This document provides a comprehensive guide to all environment variables used in the LightUp application.

## 📁 Environment File Setup

Create a `.env.local` file in your project root with these variables:

```bash
# .env.local
# Copy this file and replace placeholder values with your actual credentials
```

## 🔐 Required Environment Variables

### **Supabase Configuration**

#### **NEXT_PUBLIC_SUPABASE_URL**
- **Type**: Public (client-side accessible)
- **Purpose**: Supabase project URL for database and authentication
- **Used in**: All Supabase client connections, auth context, API routes
- **Example**: `https://your-project-id.supabase.co`
- **Critical**: Required for all database operations

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
```

#### **NEXT_PUBLIC_SUPABASE_ANON_KEY**
- **Type**: Public (client-side accessible)
- **Purpose**: Supabase anonymous key for client-side operations
- **Used in**: Client-side Supabase connections, middleware, auth
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Critical**: Required for client-side database access

```bash
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### **SUPABASE_SERVICE_ROLE_KEY**
- **Type**: Private (server-side only)
- **Purpose**: Supabase service role key for admin operations
- **Used in**: API routes, admin operations, bypassing RLS
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Critical**: Required for server-side database operations

```bash
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **Site Configuration**

#### **NEXT_PUBLIC_SITE_URL**
- **Type**: Public (client-side accessible)
- **Purpose**: Production site URL for OAuth redirects and email links
- **Used in**: Auth callbacks, email templates, OAuth redirects
- **Example**: `https://your-app.vercel.app`
- **Critical**: Required for production OAuth and email links

```bash
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

### **Email Configuration**

#### **EMAIL_USER**
- **Type**: Private (server-side only)
- **Purpose**: Email address for sending notifications
- **Used in**: Email service, password reset, verification emails
- **Example**: `your-email@gmail.com`
- **Critical**: Required for email functionality

```bash
EMAIL_USER=your-email@gmail.com
```

#### **EMAIL_PASSWORD**
- **Type**: Private (server-side only)
- **Purpose**: App password for email authentication
- **Used in**: Email service authentication
- **Example**: `your-app-password`
- **Critical**: Required for email sending

```bash
EMAIL_PASSWORD=your-app-password
```

### **AI Configuration**

#### **GEMINI_API_KEY**
- **Type**: Private (server-side only)
- **Purpose**: Google Gemini API key for FaithBot AI functionality
- **Used in**: FaithBot API route, AI chat responses
- **Example**: `AIzaSyB...`
- **Critical**: Required for FaithBot AI features

```bash
GEMINI_API_KEY=AIzaSyB...
```

## 🔧 Optional Environment Variables

### **Development & Debugging**

#### **NODE_ENV**
- **Type**: System (automatically set)
- **Purpose**: Environment mode (development/production)
- **Used in**: Error handling, logging, feature flags
- **Values**: `development` | `production`
- **Default**: Set by Next.js automatically

#### **PORT**
- **Type**: Private (server-side only)
- **Purpose**: Backend server port
- **Used in**: Backend server configuration
- **Default**: `5000`
- **Example**: `3001`

```bash
PORT=5000
```

#### **ENABLE_BACKEND_LOGGING**
- **Type**: Private (server-side only)
- **Purpose**: Enable/disable backend server logging
- **Used in**: Backend server logging
- **Values**: `true` | `false`
- **Default**: `true` in development

```bash
ENABLE_BACKEND_LOGGING=true
```

## 🚨 Inconsistencies Found & Fixed

### **URL Variable Inconsistency**
**Issue**: The codebase uses both `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_SITE_URL` inconsistently.

**Files with inconsistencies**:
- `app/api/_email/email-service.ts` - Uses `NEXT_PUBLIC_APP_URL`
- `next.config.js` - Uses `NEXT_PUBLIC_APP_URL`
- Most other files use `NEXT_PUBLIC_SITE_URL`

**Recommendation**: Standardize on `NEXT_PUBLIC_SITE_URL` for consistency.

## 📋 Complete .env.example

```bash
# ===========================================
# LightUp Catholic Youth Platform
# Environment Variables Configuration
# ===========================================

# 🔐 Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 🌐 Site Configuration (Required)
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app

# 📧 Email Configuration (Required)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# 🤖 AI Configuration (Required for FaithBot)
GEMINI_API_KEY=AIzaSyB...

# 🔧 Development Configuration (Optional)
PORT=5000
ENABLE_BACKEND_LOGGING=true
```

## 🚀 Deployment Configuration

### **Vercel Deployment**

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add each variable with appropriate values
3. Deploy to apply changes

### **Required for Production**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `EMAIL_USER`
- `EMAIL_PASSWORD`
- `GEMINI_API_KEY`

### **Development Only**
- `PORT` (if using custom backend)
- `ENABLE_BACKEND_LOGGING`

## 🔍 Environment Variable Usage Map

### **Client-Side (NEXT_PUBLIC_*)**
- `NEXT_PUBLIC_SUPABASE_URL` - Used in 25+ files
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Used in 25+ files
- `NEXT_PUBLIC_SITE_URL` - Used in auth, email templates, callbacks

### **Server-Side Only**
- `SUPABASE_SERVICE_ROLE_KEY` - Used in 20+ API routes
- `EMAIL_USER` - Used in email service
- `EMAIL_PASSWORD` - Used in email service
- `GEMINI_API_KEY` - Used in FaithBot API
- `PORT` - Used in backend server
- `ENABLE_BACKEND_LOGGING` - Used in backend server

## 🚨 Security Notes

### **Public Variables (NEXT_PUBLIC_*)**
- Exposed to client-side code
- Safe to include in client bundles
- Can be viewed in browser dev tools

### **Private Variables**
- Only accessible server-side
- Never exposed to client
- Keep secure and don't commit to version control

## 🔧 Troubleshooting

### **Common Issues**

#### **"Missing environment variable" errors**
- Check variable name spelling
- Ensure variables are in `.env.local`
- Restart development server after changes

#### **OAuth redirect issues**
- Verify `NEXT_PUBLIC_SITE_URL` matches your domain
- Check Google Cloud Console redirect URIs
- Ensure production URL is set in Vercel

#### **Email not sending**
- Verify `EMAIL_USER` and `EMAIL_PASSWORD`
- Check if using app password (not regular password)
- Test email credentials separately

#### **Database connection issues**
- Verify Supabase URL and keys
- Check if service role key has proper permissions
- Ensure RLS policies are configured

### **Environment Variable Validation**

The application includes validation for critical variables:

```typescript
// Example validation in API routes
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is missing')
  return NextResponse.json({ error: 'Configuration error' }, { status: 500 })
}
```

## 📝 Migration Notes

### **From NEXT_PUBLIC_APP_URL to NEXT_PUBLIC_SITE_URL**
If you're currently using `NEXT_PUBLIC_APP_URL`, update your environment variables:

1. Replace `NEXT_PUBLIC_APP_URL` with `NEXT_PUBLIC_SITE_URL`
2. Update Vercel environment variables
3. Restart your application

---

**🚀 Remember: Environment variables are loaded at build time. Restart your development server after changing them!**