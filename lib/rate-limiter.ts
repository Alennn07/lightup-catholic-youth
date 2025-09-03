// In-memory rate limiter (for development/small scale)
// For production, consider using Redis or Upstash

interface RateLimitEntry {
  count: number
  resetTime: number
}

class InMemoryRateLimiter {
  private store = new Map<string, RateLimitEntry>()
  private cleanupInterval: NodeJS.Timeout

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 5 * 60 * 1000)
  }

  private cleanup() {
    const now = Date.now()
    for (const [key, entry] of this.store.entries()) {
      if (entry.resetTime < now) {
        this.store.delete(key)
      }
    }
  }

  async checkLimit(
    identifier: string,
    windowMs: number,
    maxRequests: number
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const now = Date.now()
    const key = `${identifier}:${Math.floor(now / windowMs)}`
    
    const entry = this.store.get(key)
    
    if (!entry || entry.resetTime < now) {
      // Create new window
      const newEntry: RateLimitEntry = {
        count: 1,
        resetTime: now + windowMs
      }
      this.store.set(key, newEntry)
      
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime: newEntry.resetTime
      }
    }
    
    if (entry.count >= maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime
      }
    }
    
    // Increment count
    entry.count++
    this.store.set(key, entry)
    
    return {
      allowed: true,
      remaining: maxRequests - entry.count,
      resetTime: entry.resetTime
    }
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
  }
}

// Singleton instance
const rateLimiter = new InMemoryRateLimiter()

// Rate limit configurations
export const RATE_LIMITS = {
  LOGIN: { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 attempts per 15 minutes
  REGISTRATION: { windowMs: 60 * 60 * 1000, maxRequests: 3 }, // 3 registrations per hour
  PASSWORD_RESET: { windowMs: 60 * 60 * 1000, maxRequests: 3 }, // 3 resets per hour
  PRAYER_POST: { windowMs: 60 * 1000, maxRequests: 3 }, // 3 posts per minute
  FAITHBOT: { windowMs: 60 * 1000, maxRequests: 10 }, // 10 requests per minute
  GENERAL_API: { windowMs: 60 * 1000, maxRequests: 60 }, // 60 requests per minute
} as const

export async function checkRateLimit(
  identifier: string,
  type: keyof typeof RATE_LIMITS,
  ip?: string
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const config = RATE_LIMITS[type]
  const key = ip ? `${type}:${ip}:${identifier}` : `${type}:${identifier}`
  
  return rateLimiter.checkLimit(key, config.windowMs, config.maxRequests)
}

export function getRateLimitHeaders(remaining: number, resetTime: number) {
  return {
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(resetTime / 1000).toString(),
  }
}

// Cleanup on process exit
process.on('SIGINT', () => rateLimiter.destroy())
process.on('SIGTERM', () => rateLimiter.destroy())
