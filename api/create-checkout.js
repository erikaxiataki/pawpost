import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Price IDs — set these in Vercel Environment Variables after creating products in Stripe
const PRICES = {
  premium: process.env.STRIPE_PRICE_PREMIUM,      // $14/mo
  premium_pro: process.env.STRIPE_PRICE_PREMIUM_PRO, // $29/mo
}

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
    const { plan, email } = req.body

    if (!plan || !PRICES[plan]) {
      return res.status(400).json({ error: 'Invalid plan. Use "premium" or "premium_pro".' })
    }

    const origin = req.headers.origin || req.headers.referer || 'https://pawpost.ca'

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email || undefined,
      line_items: [
        {
          price: PRICES[plan],
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 14,
      },
      success_url: `${origin}/dashboard?checkout=success&plan=${plan}`,
      cancel_url: `${origin}/?checkout=cancelled`,
      metadata: {
        plan,
      },
    })

    return res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err.message)
    return res.status(500).json({ error: 'Failed to create checkout session' })
  }
}
