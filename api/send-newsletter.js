import { Resend } from 'resend'
import { list } from '@vercel/blob'
import { buildPersonalizedContent, buildSubject, buildNewsletterHtml } from '../src/data/newsletter-builder.js'
import { weeklyTips } from '../src/data/newsletter-tips.js'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  // Verify cron secret
  const authHeader = req.headers.authorization
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    // Get all contacts from Resend
    const audienceId = process.env.RESEND_AUDIENCE_ID
    const contactsResult = audienceId
      ? await resend.contacts.list({ audienceId })
      : await resend.contacts.list()

    const contacts = contactsResult?.data?.data?.filter(c => !c.unsubscribed) || []

    if (contacts.length === 0) {
      console.log('No active subscribers — skipping newsletter')
      return res.status(200).json({ message: 'No subscribers' })
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'PawPost AI <hello@pawpost.ca>'
    const today = new Date()
    let sent = 0
    let failed = 0

    // Group contacts by profile to generate content once per group
    const groups = {}

    for (const contact of contacts) {
      // Try to load profile from Vercel Blob
      const profile = await loadProfile(contact.email)
      const key = `${profile.businessTypeId}|${profile.language}`

      if (!groups[key]) {
        groups[key] = { profile, emails: [] }
      }
      groups[key].emails.push(contact.email)
    }

    // Send personalized newsletter per group
    for (const [key, group] of Object.entries(groups)) {
      const content = buildPersonalizedContent(group.profile, today)

      // If profile has no business type, use static fallback tip
      const useStaticFallback = group.profile.businessTypeId === 'other' && !group.profile._hasProfile
      let subject, html

      if (useStaticFallback) {
        // Fallback to static tips for subscribers without profile
        const weekNum = Math.floor((today - new Date('2025-03-03')) / (7 * 24 * 60 * 60 * 1000)) % weeklyTips.length
        const tip = weeklyTips[weekNum]
        if (tip) {
          subject = tip.subject
          html = buildStaticNewsletterHtml(tip)
        } else {
          continue
        }
      } else {
        subject = buildSubject(content)
        html = buildNewsletterHtml(content)
      }

      for (const email of group.emails) {
        try {
          await resend.emails.send({ from: fromEmail, to: email, subject, html })
          sent++
          // Small delay to avoid rate limiting
          await new Promise(r => setTimeout(r, 100))
        } catch (err) {
          console.error(`Failed to send to ${email}:`, err.message)
          failed++
        }
      }
    }

    console.log(`📬 Newsletter sent! ${sent} sent, ${failed} failed, ${Object.keys(groups).length} groups`)
    return res.status(200).json({ success: true, sent, failed, groups: Object.keys(groups).length })
  } catch (err) {
    console.error('Newsletter error:', err.message)
    return res.status(500).json({ error: 'Failed to send newsletter' })
  }
}

async function loadProfile(email) {
  try {
    const key = `profiles/${email.toLowerCase().trim()}.json`
    const { blobs } = await list({ prefix: key, limit: 1 })

    if (blobs && blobs.length > 0) {
      const response = await fetch(blobs[0].url)
      const profile = await response.json()
      return { ...profile, _hasProfile: true }
    }
  } catch (err) {
    // Profile not found — use defaults
  }

  return { businessTypeId: 'other', language: 'en', vibe: 'warm', _hasProfile: false }
}

// Fallback HTML for subscribers without a profile (uses static tips)
function buildStaticNewsletterHtml(tip) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#FFFBF5;font-family:'Helvetica Neue',Arial,sans-serif;color:#1C1917;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="font-size:24px;margin:0 0 4px;color:#1C1917;">🐾 PawPost AI</h1>
      <p style="color:#A8A29E;margin:0;font-size:13px;">Weekly pet business marketing tips</p>
    </div>
    <div style="background:#fff;border-radius:16px;padding:32px;border:1px solid #E7E5E4;margin-bottom:24px;">
      <div style="font-size:12px;color:#D97706;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;">💡 This Week's Tip</div>
      <h2 style="font-size:22px;margin:0 0 16px;color:#1C1917;line-height:1.3;">${tip.title}</h2>
      <p style="line-height:1.7;color:#44403C;margin:0 0 20px;">${tip.body}</p>
      <div style="background:#FFF7ED;border-radius:12px;padding:20px;border-left:4px solid #D97706;">
        <div style="font-size:12px;color:#D97706;font-weight:700;margin-bottom:8px;">✅ TRY THIS</div>
        <p style="line-height:1.7;color:#44403C;margin:0;">${tip.tip}</p>
      </div>
    </div>
    <div style="text-align:center;margin:28px 0;">
      <p style="color:#44403C;font-size:14px;margin-bottom:16px;">Want captions personalized to YOUR business?</p>
      <a href="https://pawpost.ca" style="display:inline-block;background:#1C1917;color:#fff;padding:14px 32px;border-radius:100px;text-decoration:none;font-weight:600;font-size:15px;">${tip.cta} →</a>
    </div>
    <div style="text-align:center;color:#A8A29E;font-size:12px;margin-top:32px;padding-top:24px;border-top:1px solid #E7E5E4;">
      <p style="margin:0 0 8px;">🐾 PawPost AI</p>
      <p style="margin:0 0 8px;"><a href="https://pawpost.ca" style="color:#D97706;">pawpost.ca</a></p>
      <p style="margin:0;"><a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#A8A29E;">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`
}
