import { verifySession, setCorsHeaders } from '../lib/auth.js'
import { getMetaToken, saveMetaToken } from '../lib/db.js'

export default async function handler(req, res) {
  setCorsHeaders(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const user = await verifySession(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })

  const meta = await getMetaToken(user.email)
  if (!meta) return res.status(404).json({ error: 'No Instagram connection found' })

  // Check if token expires within 7 days
  const expiresAt = new Date(meta.expiresAt)
  const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  if (expiresAt > sevenDaysFromNow) {
    return res.status(200).json({ ok: true, message: 'Token still valid', expiresAt: meta.expiresAt })
  }

  // Refresh the long-lived token
  try {
    const appId = process.env.META_APP_ID
    const appSecret = process.env.META_APP_SECRET
    const refreshUrl = `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${meta.accessToken}`

    const refreshRes = await fetch(refreshUrl)
    const refreshData = await refreshRes.json()

    if (refreshData.error) {
      return res.status(502).json({ error: 'Token refresh failed. Please reconnect Instagram.' })
    }

    const newExpiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
    await saveMetaToken(user.email, {
      ...meta,
      accessToken: refreshData.access_token,
      expiresAt: newExpiresAt,
    })

    return res.status(200).json({ ok: true, message: 'Token refreshed', expiresAt: newExpiresAt })
  } catch (err) {
    console.error('Meta token refresh error:', err)
    return res.status(500).json({ error: 'Failed to refresh token' })
  }
}
