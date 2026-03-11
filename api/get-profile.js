import { list } from '@vercel/blob'
import { verifySession, setCorsHeaders } from './lib/auth.js'

export default async function handler(req, res) {
  setCorsHeaders(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  // Auth check — users can only access their own profile
  const user = await verifySession(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })

  try {
    const key = `profiles/${user.email}.json`
    const { blobs } = await list({ prefix: key, limit: 1 })

    if (!blobs || blobs.length === 0) {
      return res.status(404).json({ error: 'Profile not found' })
    }

    const response = await fetch(blobs[0].url)
    const profile = await response.json()

    return res.status(200).json({ success: true, profile })
  } catch (err) {
    console.error('Get profile error:', err.message)
    return res.status(500).json({ error: 'Failed to get profile' })
  }
}
