# Google OAuth Setup for LightUp

## Prerequisites
- Google Cloud Console account
- Supabase project

## Step 1: Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Choose "Web application"
6. Add these Authorized redirect URIs:
   - `https://your-project.supabase.co/auth/v1/callback`
   - `http://localhost:54321/auth/v1/callback` (for local development)
7. Copy the Client ID and Client Secret

## Step 2: Supabase Configuration

1. Go to your Supabase project dashboard
2. Navigate to "Authentication" → "Providers"
3. Find "Google" and click "Enable"
4. Enter your Google Client ID and Client Secret
5. Save the configuration

## Step 3: Environment Variables

Add these to your `.env` file:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 4: Test

1. Click "Continue with Google" button
2. You should be redirected to Google's OAuth consent screen
3. After authorization, you'll be redirected back to your app

## Troubleshooting

- Make sure redirect URIs match exactly
- Check browser console for errors
- Verify Supabase project settings
- Ensure Google+ API is enabled
