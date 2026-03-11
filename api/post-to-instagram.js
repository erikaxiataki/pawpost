// Post a caption + image to Instagram via Graph API
import { verifySession, setCorsHeaders } from './lib/auth.js'
import { getMetaToken } from './lib/db.js'

export default async function handler(req, res) {
  setCorsHeaders(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  // Auth check
  const user = await verifySession(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })

  // Get token from database (not from client request)
  const meta = await getMetaToken(user.email)
  if (!meta || !meta.accessToken || !meta.igUserId) {
    return res.status(400).json({ error: 'Instagram not connected. Please connect your account first.' })
  }

  // Check if token is expired
  if (meta.expiresAt && new Date(meta.expiresAt) < new Date()) {
    return res.status(401).json({ error: 'Instagram token expired. Please reconnect your account.' })
  }

  const { caption, imageUrl } = req.body
  if (!caption || !imageUrl) {
    return res.status(400).json({ error: 'Missing required fields: caption, imageUrl' })
  }

  const { accessToken, igUserId } = meta

  try {
    // Step 1: Create media container
    const containerRes = await fetch(
      `https://graph.facebook.com/v21.0/${igUserId}/media`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: imageUrl,
          caption,
          access_token: accessToken,
        }),
      }
    )
    const containerData = await containerRes.json()

    if (containerData.error) {
      console.error('Media container error:', containerData.error)
      return res.status(400).json({ error: 'Failed to create media', detail: containerData.error.message })
    }

    const creationId = containerData.id

    // Step 2: Wait for Meta to process the image
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Step 3: Check container status
    const statusRes = await fetch(
      `https://graph.facebook.com/v21.0/${creationId}?fields=status_code&access_token=${accessToken}`
    )
    const statusData = await statusRes.json()

    if (statusData.status_code === 'ERROR') {
      return res.status(400).json({ error: 'Image processing failed. Make sure the image URL is publicly accessible.' })
    }

    if (statusData.status_code === 'IN_PROGRESS') {
      await new Promise(resolve => setTimeout(resolve, 5000))
    }

    // Step 4: Publish
    const publishRes = await fetch(
      `https://graph.facebook.com/v21.0/${igUserId}/media_publish`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creation_id: creationId, access_token: accessToken }),
      }
    )
    const publishData = await publishRes.json()

    if (publishData.error) {
      console.error('Publish error:', publishData.error)
      return res.status(400).json({ error: 'Failed to publish', detail: publishData.error.message })
    }

    return res.status(200).json({ success: true, postId: publishData.id })
  } catch (err) {
    console.error('Post to Instagram error:', err.message)
    return res.status(500).json({ error: 'Failed to post to Instagram' })
  }
}
