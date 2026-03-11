import { clearSessionCookie, setCorsHeaders } from '../lib/auth.js'

export default async function handler(req, res) {
  setCorsHeaders(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  clearSessionCookie(res)
  return res.status(200).json({ ok: true })
}
