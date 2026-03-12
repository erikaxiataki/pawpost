import Stripe from 'stripe'
import { saveUser, getUser } from '../lib/db.js'

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

// Find user email from Stripe customer ID
async function getEmailFromCustomer(customerId) {
  try {
    const customer = await stripe.customers.retrieve(customerId)
    return customer.email
  } catch {
    return null
  }
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

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      const email = session.customer_email
      const plan = session.metadata?.plan || 'premium'

      if (email) {
        await saveUser(email, {
          plan,
          stripeCustomerId: session.customer,
          subscriptionId: session.subscription,
          subscriptionStatus: 'active',
        })
        console.log(`Checkout completed: ${email} → ${plan}`)
      }
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object
      const email = await getEmailFromCustomer(subscription.customer)

      if (email) {
        const update = { subscriptionStatus: subscription.status }
        // If subscription is no longer active, downgrade to free
        if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
          update.plan = 'free'
        }
        await saveUser(email, update)
        console.log(`Subscription updated: ${email} → ${subscription.status}`)
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object
      const email = await getEmailFromCustomer(subscription.customer)

      if (email) {
        await saveUser(email, {
          plan: 'free',
          subscriptionStatus: 'canceled',
          subscriptionId: null,
        })
        console.log(`Subscription canceled: ${email} → free`)
      }
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object
      const email = await getEmailFromCustomer(invoice.customer)
      if (email) {
        console.log(`Payment failed: ${email}`)
      }
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return res.status(200).json({ received: true })
}
