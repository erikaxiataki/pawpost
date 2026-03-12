import { Resend } from 'resend'
import {
  createMagicLinkToken,
  verifyMagicLinkToken,
  createSessionToken,
  setSessionCookie,
  clearSessionCookie,
  verifySession,
  setCorsHeaders,
} from '../lib/auth.js'
import { getUser, saveUser, getImageUsage, getPlanLimits } from '../lib/db.js'

export default async function handler(req, res) {
  setCorsHeaders(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  const action = req.query.action

  // GET /api/auth?action=me
  if (action === 'me' && req.method === 'GET') {
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
      usage: { images: imageUsage },
    })
  }

  // POST /api/auth?action=send-magic-link
  if (action === 'send-magic-link' && req.method === 'POST') {
    const { email } = req.body
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' })
    }

    const cleanEmail = email.toLowerCase().trim()
    const token = createMagicLinkToken(cleanEmail)
    const baseUrl = process.env.VERCEL_URL ? 'https://pawpost.ca' : 'http://localhost:5173'
    const magicLink = `${baseUrl}/dashboard?token=${token}`

    const resend = new Resend(process.env.RESEND_API_KEY)

    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'PawPost <onboarding@resend.dev>',
        to: cleanEmail,
        subject: 'Your PawPost Login Link',
        html: `
          <div style="font-family: 'DM Sans', sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
            <h1 style="font-size: 24px; color: #1C1917; margin-bottom: 8px;">Welcome to PawPost</h1>
            <p style="font-size: 16px; color: #57534e; line-height: 1.5;">Click the button below to log in. This link expires in 15 minutes.</p>
            <a href="${magicLink}" style="display: inline-block; margin: 24px 0; padding: 14px 32px; background: #D97706; color: #fff; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px;">Log In to PawPost</a>
            <p style="font-size: 13px; color: #a8a29e;">If you didn't request this, you can safely ignore this email.</p>
          </div>
        `,
      })
      return res.status(200).json({ ok: true })
    } catch (err) {
      console.error('Magic link email failed:', err)
      return res.status(500).json({ error: 'Failed to send login email. Please try again.' })
    }
  }

  // POST /api/auth?action=verify
  if (action === 'verify' && req.method === 'POST') {
    const { token } = req.body
    if (!token) return res.status(400).json({ error: 'Token is required' })

    const email = verifyMagicLinkToken(token)
    if (!email) return res.status(401).json({ error: 'Invalid or expired link. Please request a new one.' })

    let user = await getUser(email)
    if (!user) {
      user = await saveUser(email, { plan: 'free', subscriptionStatus: null })
    }

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

  // POST /api/auth?action=logout
  if (action === 'logout') {
    clearSessionCookie(res)
    return res.status(200).json({ ok: true })
  }

  return res.status(400).json({ error: 'Invalid action' })
}
