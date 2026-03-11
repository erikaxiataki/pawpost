import { verifyMagicLinkToken, createSessionToken, setSessionCookie, setCorsHeaders } from '../lib/auth.js'
import { getUser, saveUser } from '../lib/db.js'

export default async function handler(req, res) {
  setCorsHeaders(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { token } = req.body
  if (!token) return res.status(400).json({ error: 'Token is required' })

  const email = verifyMagicLinkToken(token)
  if (!email) return res.status(401).json({ error: 'Invalid or expired link. Please request a new one.' })

  // Create user if new
  let user = await getUser(email)
  if (!user) {
    user = await saveUser(email, { plan: 'free', subscriptionStatus: null })
  }

  // Create session
  const sessionToken = createSessionToken(email)
  setSessionCookie(res, sessionToken)

  return res.status(200).json({
    ok: true,
    user: {
      email: user.email,
      plan: user.plan || 'free',
      subscriptionStatus: user.subscriptionStatus,
    },
  })
}
