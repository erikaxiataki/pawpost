import { Resend } from 'resend'
import { put } from '@vercel/blob'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://pawpost.ca')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, source, businessTypeId, language, vibe } = req.body

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email required' })
    }

    // Send the caption templates email
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'PawPost AI <hello@pawpost.ca>',
      to: email,
      subject: '🐾 Your 10 Free Instagram Caption Templates Are Here!',
      html: buildTemplateEmail(),
    })

    if (error) {
      console.error('Resend error:', error)
      return res.status(500).json({ error: 'Failed to send email' })
    }

    // Also send to newsletter list if source is newsletter
    if (source === 'newsletter') {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'PawPost AI <hello@pawpost.ca>',
        to: email,
        subject: '🐾 Welcome to the PawPost newsletter!',
        html: buildWelcomeEmail(),
      })
    }

    // Save contact to Resend for newsletter broadcasts
    try {
      const audienceId = process.env.RESEND_AUDIENCE_ID
      const contactData = { email, unsubscribed: false }
      if (audienceId) contactData.audienceId = audienceId
      await resend.contacts.create(contactData)
      console.log(`📋 Contact saved: ${email}`)
    } catch (contactErr) {
      // Contact may already exist — that's fine
      console.log(`Contact save note: ${contactErr.message}`)
    }

    // Save profile to Vercel Blob for personalized newsletters + restore
    if (businessTypeId || language || vibe) {
      try {
        const key = `profiles/${email.toLowerCase().trim()}.json`
        const profileData = {
          email: email.toLowerCase().trim(),
          businessTypeId: businessTypeId || 'other',
          language: language || 'en',
          vibe: vibe || 'warm',
          source,
          subscribedAt: new Date().toISOString(),
        }
        await put(key, JSON.stringify(profileData), {
          access: 'public',
          addRandomSuffix: false,
          contentType: 'application/json',
        })
        console.log(`💾 Profile saved for ${email}`)
      } catch (profileErr) {
        console.log(`Profile save note: ${profileErr.message}`)
      }
    }

    console.log(`✅ Email sent to ${email} (source: ${source})`, data)
    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Email send error:', err.message)
    return res.status(500).json({ error: 'Failed to send email' })
  }
}

function buildTemplateEmail() {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#FFFBF5;font-family:'Helvetica Neue',Arial,sans-serif;color:#1C1917;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">

    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="font-size:28px;margin:0 0 8px;color:#1C1917;">🐾 PawPost AI</h1>
      <p style="color:#78716C;margin:0;">Your free caption templates are here!</p>
    </div>

    <div style="background:#fff;border-radius:16px;padding:32px;border:1px solid #E7E5E4;margin-bottom:24px;">
      <h2 style="font-size:20px;margin:0 0 16px;color:#1C1917;">Hey there! 👋</h2>
      <p style="line-height:1.6;color:#44403C;">Thanks for signing up! Here are <strong>10 ready-to-post Instagram caption templates</strong> designed specifically for pet businesses. Just fill in the blanks and post!</p>
    </div>

    <!-- Template 1 -->
    <div style="background:#fff;border-radius:12px;padding:24px;border:1px solid #E7E5E4;margin-bottom:16px;">
      <div style="font-size:12px;color:#D97706;font-weight:600;margin-bottom:8px;">TEMPLATE 1 — INTRODUCTION POST</div>
      <p style="line-height:1.6;color:#44403C;margin:0;">Hi, I'm [YOUR NAME] and I run [BUSINESS NAME]! 🐾 I started this because [YOUR REASON]. Every day I get to [WHAT YOU LOVE ABOUT IT] and honestly? Best decision I ever made. If you're looking for [YOUR SERVICE] in [YOUR CITY], I'd love to meet your fur baby! 💛</p>
      <p style="color:#78716C;font-size:13px;margin:12px 0 0;">#PetBusiness #[YourCity] #[YourService]</p>
    </div>

    <!-- Template 2 -->
    <div style="background:#fff;border-radius:12px;padding:24px;border:1px solid #E7E5E4;margin-bottom:16px;">
      <div style="font-size:12px;color:#D97706;font-weight:600;margin-bottom:8px;">TEMPLATE 2 — BEFORE & AFTER</div>
      <p style="line-height:1.6;color:#44403C;margin:0;">Swipe for the glow-up! ✨ [PET NAME] came in [BEFORE STATE] and left looking like a whole new [DOG/CAT]! That face says it all 😍 Book your appointment — link in bio!</p>
      <p style="color:#78716C;font-size:13px;margin:12px 0 0;">#BeforeAndAfter #PetGlowUp #[YourService]</p>
    </div>

    <!-- Template 3 -->
    <div style="background:#fff;border-radius:12px;padding:24px;border:1px solid #E7E5E4;margin-bottom:16px;">
      <div style="font-size:12px;color:#D97706;font-weight:600;margin-bottom:8px;">TEMPLATE 3 — QUICK TIP</div>
      <p style="line-height:1.6;color:#44403C;margin:0;">Quick tip from a [YOUR ROLE]: [USEFUL TIP]. Most pet parents don't know this, but it makes a HUGE difference. Save this for later! 📌🐕</p>
      <p style="color:#78716C;font-size:13px;margin:12px 0 0;">#PetTips #[YourSpecialty] #PetParent</p>
    </div>

    <!-- Template 4 -->
    <div style="background:#fff;border-radius:12px;padding:24px;border:1px solid #E7E5E4;margin-bottom:16px;">
      <div style="font-size:12px;color:#D97706;font-weight:600;margin-bottom:8px;">TEMPLATE 4 — BEHIND THE SCENES</div>
      <p style="line-height:1.6;color:#44403C;margin:0;">A day in the life at [BUSINESS NAME] 🎬 [DESCRIBE A FUN/CHAOTIC MOMENT]. This is what [NUMBER] stars looks like behind the scenes! Never a dull moment 😂</p>
      <p style="color:#78716C;font-size:13px;margin:12px 0 0;">#BTS #DayInTheLife #[YourBusiness]</p>
    </div>

    <!-- Template 5 -->
    <div style="background:#fff;border-radius:12px;padding:24px;border:1px solid #E7E5E4;margin-bottom:16px;">
      <div style="font-size:12px;color:#D97706;font-weight:600;margin-bottom:8px;">TEMPLATE 5 — TESTIMONIAL SHARE</div>
      <p style="line-height:1.6;color:#44403C;margin:0;">This message made my whole week 🥹💛 "[PASTE CLIENT REVIEW]" — Thank you [CLIENT NAME]! This is exactly why I do what I do. If you've had a great experience, I'd love a review too! Link in bio ⭐</p>
      <p style="color:#78716C;font-size:13px;margin:12px 0 0;">#ClientLove #5Stars #[YourBusiness]</p>
    </div>

    <!-- Template 6 -->
    <div style="background:#fff;border-radius:12px;padding:24px;border:1px solid #E7E5E4;margin-bottom:16px;">
      <div style="font-size:12px;color:#D97706;font-weight:600;margin-bottom:8px;">TEMPLATE 6 — MYTH BUSTER</div>
      <p style="line-height:1.6;color:#44403C;margin:0;">Myth: "[COMMON MISCONCEPTION]" ❌ Truth: [THE REAL ANSWER]. As a [YOUR ROLE] with [X YEARS] experience, I see this ALL the time. Share this with a pet parent who needs to hear it! 🐾</p>
      <p style="color:#78716C;font-size:13px;margin:12px 0 0;">#PetMyths #FactCheck #[YourSpecialty]</p>
    </div>

    <!-- Template 7 -->
    <div style="background:#fff;border-radius:12px;padding:24px;border:1px solid #E7E5E4;margin-bottom:16px;">
      <div style="font-size:12px;color:#D97706;font-weight:600;margin-bottom:8px;">TEMPLATE 7 — SEASONAL/HOLIDAY</div>
      <p style="line-height:1.6;color:#44403C;margin:0;">Happy [HOLIDAY]! 🎉 Here's a reminder to [SEASONAL PET SAFETY TIP]. Your fur babies are counting on you! Stay safe and have fun out there 🐶💛</p>
      <p style="color:#78716C;font-size:13px;margin:12px 0 0;">#[Holiday] #PetSafety #[YourCity]</p>
    </div>

    <!-- Template 8 -->
    <div style="background:#fff;border-radius:12px;padding:24px;border:1px solid #E7E5E4;margin-bottom:16px;">
      <div style="font-size:12px;color:#D97706;font-weight:600;margin-bottom:8px;">TEMPLATE 8 — BOOKING PUSH</div>
      <p style="line-height:1.6;color:#44403C;margin:0;">📅 [MONTH] is filling up FAST! Only [NUMBER] spots left for [YOUR SERVICE]. Don't wait until [REASON IT'S URGENT] — book now and your [DOG/CAT] will thank you! Link in bio 🐾</p>
      <p style="color:#78716C;font-size:13px;margin:12px 0 0;">#BookNow #[YourService] #[YourCity]</p>
    </div>

    <!-- Template 9 -->
    <div style="background:#fff;border-radius:12px;padding:24px;border:1px solid #E7E5E4;margin-bottom:16px;">
      <div style="font-size:12px;color:#D97706;font-weight:600;margin-bottom:8px;">TEMPLATE 9 — ENGAGEMENT QUESTION</div>
      <p style="line-height:1.6;color:#44403C;margin:0;">[FUN PET QUESTION]? 🤔 Drop your answer in the comments! I'll go first: [YOUR ANSWER]. Can't wait to see yours! 👇🐾</p>
      <p style="color:#78716C;font-size:13px;margin:12px 0 0;">#PetCommunity #[YourNiche] #PetLovers</p>
    </div>

    <!-- Template 10 -->
    <div style="background:#fff;border-radius:12px;padding:24px;border:1px solid #E7E5E4;margin-bottom:16px;">
      <div style="font-size:12px;color:#D97706;font-weight:600;margin-bottom:8px;">TEMPLATE 10 — FEEL-GOOD FRIDAY</div>
      <p style="line-height:1.6;color:#44403C;margin:0;">This week's highlight: [HEARTWARMING MOMENT] 🥰 Moments like these remind me why I started [BUSINESS NAME]. Happy Friday everyone — go hug your pets! 🐶💛</p>
      <p style="color:#78716C;font-size:13px;margin:12px 0 0;">#FeelGoodFriday #PetLove #[YourBusiness]</p>
    </div>

    <!-- CTA -->
    <div style="text-align:center;margin:32px 0;">
      <p style="color:#44403C;line-height:1.6;margin-bottom:20px;">Want a <strong>full month of captions</strong> written specifically for YOUR business?<br>PawPost AI generates 30 days of content in 60 seconds.</p>
      <a href="https://pawpost.ca" style="display:inline-block;background:#1C1917;color:#fff;padding:14px 32px;border-radius:100px;text-decoration:none;font-weight:600;font-size:16px;">Generate My Free Caption Pack →</a>
    </div>

    <div style="text-align:center;color:#A8A29E;font-size:13px;margin-top:32px;padding-top:24px;border-top:1px solid #E7E5E4;">
      <p>🐾 PawPost AI — Social media captions made for pet businesses</p>
      <p style="margin-top:8px;"><a href="https://pawpost.ca" style="color:#D97706;">pawpost.ca</a></p>
    </div>
  </div>
</body>
</html>`
}

function buildWelcomeEmail() {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#FFFBF5;font-family:'Helvetica Neue',Arial,sans-serif;color:#1C1917;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">

    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="font-size:28px;margin:0 0 8px;color:#1C1917;">🐾 PawPost AI</h1>
    </div>

    <div style="background:#fff;border-radius:16px;padding:32px;border:1px solid #E7E5E4;">
      <h2 style="font-size:22px;margin:0 0 16px;color:#1C1917;">Welcome to the pack! 🐶</h2>
      <p style="line-height:1.7;color:#44403C;">You're now subscribed to the PawPost newsletter.</p>
      <p style="line-height:1.7;color:#44403C;">Every Monday, you'll get:</p>
      <ul style="line-height:2;color:#44403C;">
        <li>📸 Instagram caption ideas for pet businesses</li>
        <li>💡 Social media tips that actually work</li>
        <li>📅 Content calendar inspiration</li>
        <li>🐾 Pet industry marketing trends</li>
      </ul>
      <p style="line-height:1.7;color:#44403C;">See you next Monday!</p>
      <p style="line-height:1.7;color:#44403C;">— The PawPost Team 💛</p>
    </div>

    <div style="text-align:center;color:#A8A29E;font-size:13px;margin-top:32px;padding-top:24px;border-top:1px solid #E7E5E4;">
      <p>🐾 PawPost AI — Social media captions made for pet businesses</p>
      <p style="margin-top:8px;"><a href="https://pawpost.ca" style="color:#D97706;">pawpost.ca</a></p>
    </div>
  </div>
</body>
</html>`
}
