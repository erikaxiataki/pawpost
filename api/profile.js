import { put, list } from '@vercel/blob'
import { verifySession, setCorsHeaders } from './lib/auth.js'

export default async function handler(req, res) {
  setCorsHeaders(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const user = await verifySession(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })

  const action = req.query.action
  const key = `profiles/${user.email}.json`

  // GET profile: POST /api/profile?action=get
  if (action === 'get') {
    try {
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

  // SAVE profile: POST /api/profile?action=save
  if (action === 'save') {
    try {
      const { profile } = req.body
      if (!profile || typeof profile !== 'object') {
        return res.status(400).json({ error: 'Profile data required' })
      }
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

  return res.status(400).json({ error: 'Invalid action' })
}
