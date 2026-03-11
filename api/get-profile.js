import { list } from '@vercel/blob'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://pawpost.ca')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email } = req.body

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email required' })
    }

    const key = `profiles/${email.toLowerCase().trim()}.json`

    // List blobs with prefix to find the profile
    const { blobs } = await list({ prefix: key, limit: 1 })

    if (!blobs || blobs.length === 0) {
      return res.status(404).json({ error: 'Profile not found' })
    }

    // Fetch the profile JSON
    const response = await fetch(blobs[0].url)
    const profile = await response.json()

    console.log(`📂 Profile restored for ${email}`)
    return res.status(200).json({ success: true, profile })
  } catch (err) {
    console.error('Get profile error:', err.message)
    return res.status(500).json({ error: 'Failed to get profile' })
  }
}
