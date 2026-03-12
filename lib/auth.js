import jwt from 'jsonwebtoken'
import { getUser } from './db.js'

const JWT_SECRET = process.env.JWT_SECRET
const SESSION_COOKIE = 'pawpost_session'
const SESSION_MAX_AGE = 30 * 24 * 60 * 60 // 30 days

export function createMagicLinkToken(email) {
  return jwt.sign({ email: email.toLowerCase().trim(), type: 'magic' }, JWT_SECRET, { expiresIn: '15m' })
}

export function verifyMagicLinkToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    if (decoded.type !== 'magic') return null
    return decoded.email
  } catch {
    return null
  }
}

export function createSessionToken(email) {
  return jwt.sign({ email: email.toLowerCase().trim(), type: 'session' }, JWT_SECRET, { expiresIn: '30d' })
}

export function setSessionCookie(res, token) {
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_MAX_AGE}`)
}

export function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`)
}

export async function verifySession(req) {
  const cookies = parseCookies(req.headers.cookie || '')
  const token = cookies[SESSION_COOKIE]
  if (!token) return null

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    if (decoded.type !== 'session') return null
    const user = await getUser(decoded.email)
    return user || { email: decoded.email, plan: 'free' }
  } catch {
    return null
  }
}

function parseCookies(cookieHeader) {
  const cookies = {}
  cookieHeader.split(';').forEach(c => {
    const [key, ...val] = c.trim().split('=')
    if (key) cookies[key] = val.join('=')
  })
  return cookies
}

export function setCorsHeaders(res) {
  const origin = process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : 'https://pawpost.ca'
  res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
}
