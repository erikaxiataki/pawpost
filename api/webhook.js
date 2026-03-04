import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

// Disable body parsing — Stripe needs the raw body to verify signatures
export const config = {
  api: { bodyParser: false },
}

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const rawBody = await getRawBody(req)
  const sig = req.headers['stripe-signature']

  let event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).json({ error: `Webhook Error: ${err.message}` })
  }

  // Handle the events
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      console.log('✅ Checkout completed:', {
        email: session.customer_email,
        plan: session.metadata?.plan,
        customerId: session.customer,
        subscriptionId: session.subscription,
      })
      // TODO: When you add a database, save the subscription status here
      // For now, the frontend handles Pro unlock via localStorage
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object
      console.log('🔄 Subscription updated:', {
        status: subscription.status,
        customerId: subscription.customer,
      })
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object
      console.log('❌ Subscription cancelled:', {
        customerId: subscription.customer,
      })
      // TODO: Revoke access when you add a database
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object
      console.log('⚠️ Payment failed:', {
        customerId: invoice.customer,
        amount: invoice.amount_due,
      })
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return res.status(200).json({ received: true })
}
