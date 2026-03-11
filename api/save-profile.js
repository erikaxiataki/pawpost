import { put } from '@vercel/blob'
import { verifySession, setCorsHeaders } from './lib/auth.js'

export default async function handler(req, res) {
  setCorsHeaders(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  // Auth check — users can only save their own profile
  const user = await verifySession(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })

  try {
    const { profile } = req.body

    if (!profile || typeof profile !== 'object') {
      return res.status(400).json({ error: 'Profile data required' })
    }

    const key = `profiles/${user.email}.json`
    const data = {
      ...profile,
      email: user.email,
      updatedAt: new Date().toISOString(),
    }

    await put(key, JSON.stringify(data), {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/json',
    })

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Save profile error:', err.message)
    return res.status(500).json({ error: 'Failed to save profile' })
  }
}
