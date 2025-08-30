# 🚀 Environment Variables Configuration

## Performance & Logging Control

This document explains all the environment variables you can use to control logging and performance monitoring in your LightUp application.

## 📁 Environment File Setup

Create a `.env.local` file in your project root with these variables:

```bash
# .env.local
ENABLE_PERFORMANCE_MONITORING=true
ENABLE_PERFORMANCE_LOGGING=true
ENABLE_API_LOGGING=true

# 🚀 Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

## 🚀 Site Configuration

### **NEXT_PUBLIC_SITE_URL**
- **Default**: `http://localhost:3000` (development)
- **Purpose**: Set the production site URL for OAuth redirects
- **Values**: Your production domain (e.g., `https://your-app.vercel.app`)
- **Impact**: Fixes Google OAuth redirect issues in production
- **Critical**: Must be set for production OAuth to work

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

## 🎯 Core Performance Variables

### **ENABLE_PERFORMANCE_MONITORING**
- **Default**: `true` in development, `false` in production
- **Purpose**: Completely enable/disable performance monitoring
- **Values**: `true` | `false`
- **Impact**: When disabled, no performance metrics are collected

```bash
ENABLE_PERFORMANCE_MONITORING=true
```

### **ENABLE_PERFORMANCE_LOGGING**
- **Default**: `true` in development, `false` in production
- **Purpose**: Control console output for performance metrics
- **Values**: `true` | `false`
- **Impact**: When disabled, no performance logs appear in console

```bash
ENABLE_PERFORMANCE_LOGGING=true
```

## 🚀 API Logging Control

### **ENABLE_API_LOGGING**
- **Default**: `true`
- **Purpose**: Enable/disable API route logging
- **Values**: `true` | `false`
- **Example**: Controls logs like "🚀 OPTIMIZED API V4.0 - Performance focused!"

```bash
ENABLE_API_LOGGING=true
```

### **ENABLE_VERBOSE_API_LOGGING**
- **Default**: `false`
- **Purpose**: Include detailed data payloads in API logs
- **Values**: `true` | `false`
- **Warning**: May log sensitive user data

```bash
ENABLE_VERBOSE_API_LOGGING=false
```

## 🎭 Frontend Logging Control

### **ENABLE_FRONTEND_LOGGING**
- **Default**: `true`
- **Purpose**: Control frontend component logging
- **Values**: `true` | `false`
- **Example**: Controls logs like "🚀 Using cached data for better performance"

```bash
ENABLE_FRONTEND_LOGGING=true
```

### **ENABLE_CACHE_LOGGING**
- **Default**: `true`
- **Purpose**: Control cache-related logging
- **Values**: `true` | `false`
- **Example**: Controls logs about cache hits/misses

```bash
ENABLE_CACHE_LOGGING=true
```

## 🔍 Debug Mode

### **DEBUG_MODE**
- **Default**: `false`
- **Purpose**: Enable comprehensive debugging (overrides other settings)
- **Values**: `true` | `false`
- **Impact**: When enabled, shows all logs regardless of other settings

```bash
DEBUG_MODE=false
```

## 📊 Performance Thresholds

### **PERFORMANCE_WARNING_THRESHOLD**
- **Default**: `1000` (1 second)
- **Purpose**: Log warning for operations slower than this
- **Values**: Number in milliseconds
- **Example**: `1000` = warn for operations slower than 1 second

```bash
PERFORMANCE_WARNING_THRESHOLD=1000
```

### **PERFORMANCE_ERROR_THRESHOLD**
- **Default**: `3000` (3 seconds)
- **Purpose**: Log error for operations slower than this
- **Values**: Number in milliseconds
- **Example**: `3000` = error for operations slower than 3 seconds

```bash
PERFORMANCE_ERROR_THRESHOLD=3000
```

## 🗄️ Cache Configuration

### **VERSE_CACHE_DURATION**
- **Default**: `300000` (5 minutes)
- **Purpose**: How long to cache verse data
- **Values**: Number in milliseconds
- **Example**: `300000` = cache for 5 minutes

```bash
VERSE_CACHE_DURATION=300000
```

### **MAX_CACHE_ITEMS**
- **Default**: `1000`
- **Purpose**: Maximum number of cached items
- **Values**: Number
- **Impact**: Prevents memory leaks from unlimited caching

```bash
MAX_CACHE_ITEMS=1000
```

## 🌐 Environment Overrides

### **FORCE_ENABLE_LOGGING**
- **Default**: `false`
- **Purpose**: Force enable logging in production
- **Values**: `true` | `false`
- **Use Case**: Debug production issues

```bash
FORCE_ENABLE_LOGGING=false
```

### **FORCE_DISABLE_LOGGING**
- **Default**: `false`
- **Purpose**: Force disable logging in development
- **Values**: `true` | `false`
- **Use Case**: Clean console for demos

```bash
FORCE_DISABLE_LOGGING=false
```

## 📝 Log Levels

### **DEFAULT_LOG_LEVEL**
- **Default**: `info`
- **Purpose**: Set default logging level
- **Values**: `error` | `warn` | `info` | `debug`
- **Impact**: Controls which messages are displayed

```bash
DEFAULT_LOG_LEVEL=info
```

## 🚨 Error Reporting

### **ENABLE_ERROR_REPORTING**
- **Default**: `false`
- **Purpose**: Send errors to external services
- **Values**: `true` | `false`
- **Use Case**: Production error monitoring

```bash
ENABLE_ERROR_REPORTING=false
```

### **ERROR_REPORTING_ENDPOINT**
- **Default**: Empty
- **Purpose**: URL for error reporting service
- **Values**: Valid URL
- **Example**: `https://api.errors.com/collect`

```bash
ERROR_REPORTING_ENDPOINT=https://api.errors.com/collect
```

## 🔐 Security Variables

### **ENABLE_REQUEST_LOGGING**
- **Default**: `false`
- **Purpose**: Log HTTP requests/responses
- **Values**: `true` | `false`
- **Warning**: May log sensitive data like auth tokens

```bash
ENABLE_REQUEST_LOGGING=false
```

### **ENABLE_AUTH_LOGGING**
- **Default**: `false`
- **Purpose**: Log authentication events
- **Values**: `true` | `false`
- **Warning**: May log user IDs and auth states

```bash
ENABLE_AUTH_LOGGING=false
```

## 🎯 Production Configuration

For production, use minimal logging:

```bash
# Production - Minimal Logging
ENABLE_PERFORMANCE_MONITORING=true
ENABLE_PERFORMANCE_LOGGING=false
ENABLE_API_LOGGING=false
ENABLE_FRONTEND_LOGGING=false
ENABLE_CACHE_LOGGING=false
DEBUG_MODE=false
ENABLE_ERROR_REPORTING=true
```

## 🧪 Development Configuration

For development, use comprehensive logging:

```bash
# Development - Full Logging
ENABLE_PERFORMANCE_MONITORING=true
ENABLE_PERFORMANCE_LOGGING=true
ENABLE_API_LOGGING=true
ENABLE_FRONTEND_LOGGING=true
ENABLE_CACHE_LOGGING=true
DEBUG_MODE=true
ENABLE_ERROR_REPORTING=false
```

## 🔧 Testing Configuration

For testing, disable all logging:

```bash
# Testing - No Logging
ENABLE_PERFORMANCE_MONITORING=false
ENABLE_PERFORMANCE_LOGGING=false
ENABLE_API_LOGGING=false
ENABLE_FRONTEND_LOGGING=false
ENABLE_CACHE_LOGGING=false
DEBUG_MODE=false
ENABLE_ERROR_REPORTING=false
```

## 📱 Vercel Deployment

For Vercel, add these to your project settings:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add each variable with appropriate values
3. Deploy to apply changes

## 🚀 Usage Examples

### **Enable Only Performance Monitoring (No Logs)**
```bash
ENABLE_PERFORMANCE_MONITORING=true
ENABLE_PERFORMANCE_LOGGING=false
```

### **Enable Only Error Logging**
```bash
ENABLE_PERFORMANCE_MONITORING=true
ENABLE_PERFORMANCE_LOGGING=false
DEFAULT_LOG_LEVEL=error
```

### **Enable Debug Mode for Troubleshooting**
```bash
DEBUG_MODE=true
ENABLE_VERBOSE_API_LOGGING=true
```

### **Production with Error Reporting**
```bash
ENABLE_PERFORMANCE_MONITORING=true
ENABLE_PERFORMANCE_LOGGING=false
ENABLE_ERROR_REPORTING=true
ERROR_REPORTING_ENDPOINT=https://your-error-service.com
```

## 🔍 Monitoring Your Configuration

Check if logging is working:

1. **Browser Console**: Look for performance monitor initialization messages
2. **Network Tab**: Check API response times
3. **Performance Tab**: Monitor overall page performance

## 🚨 Troubleshooting

### **No Logs Appearing**
- Check `ENABLE_PERFORMANCE_LOGGING` is `true`
- Verify `DEBUG_MODE` is not overriding settings
- Check browser console for initialization messages

### **Too Many Logs**
- Set `ENABLE_PERFORMANCE_LOGGING=false`
- Reduce `DEFAULT_LOG_LEVEL` to `error`
- Disable specific logging categories

### **Performance Monitoring Not Working**
- Check `ENABLE_PERFORMANCE_MONITORING` is `true`
- Verify environment variables are loaded
- Check for JavaScript errors in console

### **OAuth Redirect Issues (Google Sign-In)**
- Verify `NEXT_PUBLIC_SITE_URL` is set to your production domain
- Check Google Cloud Console OAuth redirect URIs include production URL
- Ensure environment variables are deployed to Vercel
- Restart development server after changing environment variables

---

**🚀 Remember: Environment variables are loaded at build time. Restart your development server after changing them!**
