import { put } from '@vercel/blob'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://pawpost.ca')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, profile } = req.body

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email required' })
    }

    if (!profile || typeof profile !== 'object') {
      return res.status(400).json({ error: 'Profile data required' })
    }

    // Store profile as JSON blob keyed by email (lowercase, trimmed)
    const key = `profiles/${email.toLowerCase().trim()}.json`
    const data = {
      ...profile,
      email: email.toLowerCase().trim(),
      updatedAt: new Date().toISOString(),
    }

    await put(key, JSON.stringify(data), {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/json',
    })

    console.log(`💾 Profile saved for ${email}`)
    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Save profile error:', err.message)
    return res.status(500).json({ error: 'Failed to save profile' })
  }
}
