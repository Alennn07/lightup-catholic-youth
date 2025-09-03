import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabaseAdmin } from './supabase-admin'

// Get client IP address
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return request.ip || 'unknown'
}

// Get user agent
export function getUserAgent(request: NextRequest): string {
  return request.headers.get('user-agent') || 'unknown'
}

// Create friendly error messages
export function createFriendlyError(error: any): string {
  if (typeof error === 'string') {
    return error
  }

  if (error?.message) {
    const message = error.message.toLowerCase()
    
    // Supabase auth errors
    if (message.includes('invalid login credentials')) {
      return 'The email or password you entered is incorrect. Please try again.'
    }
    
    if (message.includes('email not confirmed')) {
      return 'Please check your email and click the verification link before signing in.'
    }
    
    if (message.includes('user already registered')) {
      return 'An account with this email already exists. Please sign in instead.'
    }
    
    if (message.includes('password should be at least')) {
      return 'Password must be at least 8 characters long.'
    }
    
    if (message.includes('invalid email')) {
      return 'Please enter a valid email address.'
    }
    
    if (message.includes('rate limit')) {
      return 'Too many attempts. Please wait a few minutes before trying again.'
    }
    
    if (message.includes('network') || message.includes('connection')) {
      return 'Network error. Please check your connection and try again.'
    }
    
    // Generic fallback
    return 'Something went wrong. Please try again.'
  }
  
  return 'An unexpected error occurred. Please try again.'
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate password strength
export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' }
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' }
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' }
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' }
  }
  
  return { valid: true }
}

// Generate secure random token
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
}

// Store and verify tokens (in production, use Redis or database)
const tokenStore = new Map<string, { userId: string; expires: number; type: string }>()

export function storeToken(token: string, userId: string, type: string, expiresInMs: number = 3600000): void {
  tokenStore.set(token, {
    userId,
    expires: Date.now() + expiresInMs,
    type
  })
}

export function verifyToken(token: string, type: string): { valid: boolean; userId?: string } {
  const entry = tokenStore.get(token)
  
  if (!entry) {
    return { valid: false }
  }
  
  if (entry.type !== type || entry.expires < Date.now()) {
    tokenStore.delete(token)
    return { valid: false }
  }
  
  return { valid: true, userId: entry.userId }
}

export function revokeToken(token: string): void {
  tokenStore.delete(token)
}

// Clean up expired tokens periodically
setInterval(() => {
  const now = Date.now()
  for (const [token, entry] of tokenStore.entries()) {
    if (entry.expires < now) {
      tokenStore.delete(token)
    }
  }
}, 5 * 60 * 1000) // Clean every 5 minutes

// Log security events
export async function logSecurityEvent(
  userId: string | null,
  event: string,
  details: Record<string, any>,
  ip: string,
  userAgent: string
): Promise<void> {
  try {
    await supabaseAdmin
      .from('security_logs')
      .insert({
        user_id: userId,
        event_type: event,
        details,
        ip_address: ip,
        user_agent: userAgent,
        created_at: new Date().toISOString()
      })
  } catch (error) {
    console.error('Failed to log security event:', error)
  }
}
