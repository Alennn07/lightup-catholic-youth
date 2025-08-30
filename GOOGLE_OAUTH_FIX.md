# 🔐 Google OAuth Redirect Fix for Production

## 🚨 Problem Description
After successful Google authentication in production (Vercel), users are redirected to `localhost:3000` instead of the production domain.

## 🎯 Root Cause
The OAuth redirect URL is hardcoded to use `window.location.origin`, which resolves to `localhost:3000` in development but should be your production domain in production.

## 🛠️ Solution Steps

### **1. Update Environment Variables in Vercel**

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add this new variable:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

**Replace `your-domain.vercel.app` with your actual Vercel domain.**

### **2. Update Google Cloud Console OAuth Settings**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 Client ID
5. Click **Edit** (pencil icon)
6. In **Authorized redirect URIs**, add your production URLs:

```bash
# Add these redirect URIs:
https://your-domain.vercel.app/auth/callback
https://your-domain.vercel.app/api/auth/callback

# Keep your development URLs:
http://localhost:3000/auth/callback
http://localhost:3000/api/auth/callback
```

### **3. Deploy the Changes**

1. Commit and push your code changes
2. Vercel will automatically redeploy
3. The new environment variable will be available

### **4. Test the Fix**

1. Go to your production site
2. Try signing in with Google
3. You should now be redirected to the production domain instead of localhost

## 🔧 Code Changes Made

### **Updated Auth Context (`contexts/auth-context.tsx`)**
```typescript
const signInWithGoogle = async () => {
  // 🚀 FIX: Use environment variable for redirect URL in production
  let redirectUrl = `${window.location.origin}/auth/callback`
  
  // Check if we're in production and use environment variable if available
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SITE_URL) {
    redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
    console.log('🚀 Using production redirect URL:', redirectUrl)
  } else {
    console.log('🔧 Using development redirect URL:', redirectUrl)
  }
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      // ... other options
    }
  })
}
```

### **Updated Callback Route (`app/auth/callback/route.ts`)**
```typescript
// 🚀 FIX: Use environment variable for redirect URL in production
let redirectUrl = requestUrl.origin + '/dashboard'

// Check if we're in production and use environment variable if available
if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SITE_URL) {
  redirectUrl = process.env.NEXT_PUBLIC_SITE_URL + '/dashboard'
  console.log('🚀 Using production redirect URL:', redirectUrl)
} else {
  console.log('🔧 Using development redirect URL:', redirectUrl)
}
```

## 🌐 Environment Variables Required

### **Production (Vercel)**
```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### **Development (Local)**
```bash
# Optional - will fallback to localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 🔍 Verification Steps

### **1. Check Environment Variables**
- Verify `NEXT_PUBLIC_SITE_URL` is set in Vercel
- Check the value matches your production domain exactly

### **2. Check Google OAuth Settings**
- Verify production redirect URIs are added
- Ensure no typos in the URLs

### **3. Check Console Logs**
- Look for "🚀 Using production redirect URL" messages
- Verify the correct URL is being used

### **4. Test Authentication Flow**
- Sign out completely
- Try signing in with Google
- Check the redirect URL in the browser

## 🚨 Common Issues & Solutions

### **Still Redirecting to Localhost**
- **Cause**: Environment variable not set or incorrect
- **Solution**: Double-check `NEXT_PUBLIC_SITE_URL` in Vercel

### **OAuth Error in Google Console**
- **Cause**: Redirect URI not added to Google OAuth
- **Solution**: Add production redirect URIs to Google Cloud Console

### **Environment Variable Not Loading**
- **Cause**: Variable name typo or deployment issue
- **Solution**: Redeploy after setting environment variable

### **Mixed Development/Production URLs**
- **Cause**: Cached redirect URLs
- **Solution**: Clear browser cache and cookies

## 📱 Vercel-Specific Instructions

### **Setting Environment Variables**
1. Go to Project Settings → Environment Variables
2. Add `NEXT_PUBLIC_SITE_URL`
3. Set value to your production domain
4. Deploy to apply changes

### **Checking Current Values**
1. Go to Project Settings → Environment Variables
2. Verify `NEXT_PUBLIC_SITE_URL` is listed
3. Check the value matches your domain

### **Redeploying After Changes**
1. Environment variables are applied automatically
2. No need to manually redeploy
3. Changes take effect immediately

## 🔒 Security Considerations

### **Public Environment Variables**
- `NEXT_PUBLIC_SITE_URL` is public (client-side)
- This is safe as it's just your domain
- No sensitive information exposed

### **OAuth Redirect URIs**
- Only add your actual production domain
- Don't add wildcard or test domains
- Keep development URIs for local testing

## 📚 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth Setup Guide](https://developers.google.com/identity/protocols/oauth2)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

## 🎯 Success Criteria

After implementing this fix:
- ✅ Google sign-in works in production
- ✅ Users are redirected to production domain
- ✅ No more localhost redirects
- ✅ Authentication flow completes successfully
- ✅ Console shows correct redirect URLs

---

**🚀 Remember: Always test OAuth flows in both development and production environments!**
