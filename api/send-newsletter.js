import { Resend } from 'resend'
import { weeklyTips } from '../src/data/newsletter-tips.js'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  // Verify cron secret (Vercel sends this header for cron jobs)
  const authHeader = req.headers.authorization
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    // Pick the tip for this week (cycles through 52 tips)
    const startDate = new Date('2025-03-03') // Week 1 reference point
    const now = new Date()
    const weekNum = Math.floor((now - startDate) / (7 * 24 * 60 * 60 * 1000)) % weeklyTips.length
    const tip = weeklyTips[weekNum]

    if (!tip) {
      return res.status(500).json({ error: 'No tip found for this week' })
    }

    // Get all contacts
    const { data: contactsData, error: contactsError } = await resend.contacts.list()

    if (contactsError) {
      console.error('Failed to list contacts:', contactsError)
      return res.status(500).json({ error: 'Failed to list contacts' })
    }

    const contacts = contactsData?.data?.filter(c => !c.unsubscribed) || []

    if (contacts.length === 0) {
      console.log('No active subscribers — skipping newsletter')
      return res.status(200).json({ message: 'No subscribers', weekNum })
    }

    // Send to each subscriber (Resend free tier doesn't have Broadcasts)
    // For small lists this works fine; upgrade to Broadcasts when list grows
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'PawPost AI <hello@pawpost.ca>'
    let sent = 0
    let failed = 0

    for (const contact of contacts) {
      try {
        await resend.emails.send({
          from: fromEmail,
          to: contact.email,
          subject: tip.subject,
          html: buildNewsletterHtml(tip),
        })
        sent++
      } catch (err) {
        console.error(`Failed to send to ${contact.email}:`, err.message)
        failed++
      }
    }

    console.log(`📬 Newsletter sent! Week ${weekNum + 1}: "${tip.subject}" — ${sent} sent, ${failed} failed`)
    return res.status(200).json({
      success: true,
      weekNum: weekNum + 1,
      subject: tip.subject,
      sent,
      failed,
      total: contacts.length,
    })
  } catch (err) {
    console.error('Newsletter error:', err.message)
    return res.status(500).json({ error: 'Failed to send newsletter' })
  }
}

function buildNewsletterHtml(tip) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
</head>
<body style="margin:0;padding:0;background:#FFFBF5;font-family:'Helvetica Neue',Arial,sans-serif;color:#1C1917;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="font-size:24px;margin:0 0 4px;color:#1C1917;">🐾 PawPost AI</h1>
      <p style="color:#A8A29E;margin:0;font-size:13px;">Weekly pet business marketing tips</p>
    </div>

    <!-- Main Tip Card -->
    <div style="background:#fff;border-radius:16px;padding:32px;border:1px solid #E7E5E4;margin-bottom:24px;">
      <div style="font-size:12px;color:#D97706;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;">💡 This Week's Tip</div>
      <h2 style="font-size:22px;margin:0 0 16px;color:#1C1917;line-height:1.3;">${tip.title}</h2>
      <p style="line-height:1.7;color:#44403C;margin:0 0 20px;">${tip.body}</p>

      <!-- Tip Box -->
      <div style="background:#FFF7ED;border-radius:12px;padding:20px;border-left:4px solid #D97706;margin-bottom:20px;">
        <div style="font-size:12px;color:#D97706;font-weight:700;margin-bottom:8px;">✅ TRY THIS</div>
        <p style="line-height:1.7;color:#44403C;margin:0;">${tip.tip}</p>
      </div>
    </div>

    <!-- CTA -->
    <div style="text-align:center;margin:28px 0;">
      <a href="https://pawpost.ca" style="display:inline-block;background:#1C1917;color:#fff;padding:14px 32px;border-radius:100px;text-decoration:none;font-weight:600;font-size:15px;">${tip.cta} →</a>
    </div>

    <!-- Footer -->
    <div style="text-align:center;color:#A8A29E;font-size:12px;margin-top:32px;padding-top:24px;border-top:1px solid #E7E5E4;">
      <p style="margin:0 0 8px;">🐾 PawPost AI — Social media captions for pet businesses</p>
      <p style="margin:0 0 8px;"><a href="https://pawpost.ca" style="color:#D97706;">pawpost.ca</a></p>
      <p style="margin:0;"><a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#A8A29E;">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`
}
