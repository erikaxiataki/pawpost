import { put, list } from '@vercel/blob'

// Helper: read JSON blob by key
async function readBlob(key) {
  try {
    const { blobs } = await list({ prefix: key, limit: 1 })
    if (!blobs || blobs.length === 0) return null
    const res = await fetch(blobs[0].url)
    return res.json()
  } catch {
    return null
  }
}

// Helper: write JSON blob by key
async function writeBlob(key, data) {
  await put(key, JSON.stringify(data), {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json',
  })
}

// User operations
export async function getUser(email) {
  return readBlob(`users/${email.toLowerCase().trim()}.json`)
}

export async function saveUser(email, data) {
  const key = `users/${email.toLowerCase().trim()}.json`
  const existing = await readBlob(key)
  const user = {
    ...(existing || {}),
    ...data,
    email: email.toLowerCase().trim(),
    updatedAt: new Date().toISOString(),
  }
  if (!existing) user.createdAt = new Date().toISOString()
  await writeBlob(key, user)
  return user
}

// Image usage tracking
export async function getImageUsage(email) {
  const month = new Date().toISOString().slice(0, 7)
  const data = await readBlob(`usage/${email.toLowerCase().trim()}/${month}.json`)
  return data?.count || 0
}

export async function incrementImageUsage(email) {
  const month = new Date().toISOString().slice(0, 7)
  const key = `usage/${email.toLowerCase().trim()}/${month}.json`
  const data = await readBlob(key)
  const count = (data?.count || 0) + 1
  await writeBlob(key, { count, month })
  return count
}

// Instagram token storage
export async function getMetaToken(email) {
  return readBlob(`meta/${email.toLowerCase().trim()}.json`)
}

export async function saveMetaToken(email, data) {
  await writeBlob(`meta/${email.toLowerCase().trim()}.json`, {
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
