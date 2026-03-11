import { verifySession, setCorsHeaders } from '../lib/auth.js'
import { getImageUsage, getPlanLimits } from '../lib/db.js'

export default async function handler(req, res) {
  setCorsHeaders(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const user = await verifySession(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })

  const plan = user.plan || 'free'
  const limits = getPlanLimits(plan)
  const imageUsage = await getImageUsage(user.email)

  return res.status(200).json({
    email: user.email,
    plan,
    subscriptionStatus: user.subscriptionStatus || null,
    limits,
    usage: {
      images: imageUsage,
    },
  })
}
