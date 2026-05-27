const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(key: string, limit: number, windowMs: number): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const record = rateLimitMap.get(key)

  if (!record || now > record.resetAt) {
    const resetAt = now + windowMs
    rateLimitMap.set(key, { count: 1, resetAt })
    return { success: true, remaining: limit - 1, resetAt }
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0, resetAt: record.resetAt }
  }

  record.count++
  return { success: true, remaining: limit - record.count, resetAt: record.resetAt }
}

// Clean up expired entries every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, record] of rateLimitMap.entries()) {
      if (now > record.resetAt) rateLimitMap.delete(key)
    }
  }, 10 * 60 * 1000)
}
