import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Lazy init — only created when first called
let redis: Redis | null = null
const rateLimiters: Record<string, Ratelimit> = {}

function getRedis(): Redis {
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  }
  return redis
}

function getLimiter(key: string, limit: number, windowSeconds: number): Ratelimit {
  const cacheKey = `${key}:${limit}:${windowSeconds}`
  if (!rateLimiters[cacheKey]) {
    rateLimiters[cacheKey] = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`),
      prefix: `lexflow:${key}`,
    })
  }
  return rateLimiters[cacheKey]
}

export async function rateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): Promise<{ success: boolean; remaining: number; resetAt: number }> {
  // If Upstash not configured, allow all requests
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_URL
  if (!redisUrl) {
    console.warn('[rate-limit] No Upstash URL set — rate limiting disabled')
    return { success: true, remaining: limit, resetAt: Date.now() + windowMs }
  }

  try {
    const windowSeconds = Math.floor(windowMs / 1000)
    const limiter = getLimiter(identifier.split(':')[0], limit, windowSeconds)
    const result = await limiter.limit(identifier)
    return {
      success: result.success,
      remaining: result.remaining,
      resetAt: result.reset,
    }
  } catch (err) {
    console.error('[rate-limit] Error:', err)
    // Fail open — don't block requests if Redis is down
    return { success: true, remaining: limit, resetAt: Date.now() + windowMs }
  }
}
