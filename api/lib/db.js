import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
})

// User operations
export async function getUser(email) {
  return redis.get(`user:${email.toLowerCase().trim()}`)
}

export async function saveUser(email, data) {
  const key = `user:${email.toLowerCase().trim()}`
  const existing = await redis.get(key)
  const user = {
    ...(existing || {}),
    ...data,
    email: email.toLowerCase().trim(),
    updatedAt: new Date().toISOString(),
  }
  if (!existing) user.createdAt = new Date().toISOString()
  await redis.set(key, user)
  return user
}

// Image usage tracking
export async function getImageUsage(email) {
  const month = new Date().toISOString().slice(0, 7)
  const count = await redis.get(`usage:${email.toLowerCase().trim()}:${month}`)
  return count || 0
}

export async function incrementImageUsage(email) {
  const month = new Date().toISOString().slice(0, 7)
  const key = `usage:${email.toLowerCase().trim()}:${month}`
  const count = await redis.incr(key)
  // Auto-expire after 45 days (cleanup old months)
  if (count === 1) await redis.expire(key, 60 * 60 * 24 * 45)
  return count
}

// Instagram token storage
export async function getMetaToken(email) {
  return redis.get(`meta:${email.toLowerCase().trim()}`)
}

export async function saveMetaToken(email, data) {
  await redis.set(`meta:${email.toLowerCase().trim()}`, {
    ...data,
    updatedAt: new Date().toISOString(),
  })
}

// Plan limits
export const PLAN_LIMITS = {
  free: { images: 2, captions: 7 },
  premium: { images: 10, captions: 30 },
  premium_pro: { images: 30, captions: Infinity },
}

export function getPlanLimits(plan) {
  return PLAN_LIMITS[plan] || PLAN_LIMITS.free
}
