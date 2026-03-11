// Post a caption + image to Instagram via Graph API
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
    const { caption, imageUrl, accessToken, igUserId } = req.body

    if (!caption || !imageUrl || !accessToken || !igUserId) {
      return res.status(400).json({ error: 'Missing required fields: caption, imageUrl, accessToken, igUserId' })
    }

    // Step 1: Create media container
    const containerRes = await fetch(
      `https://graph.facebook.com/v21.0/${igUserId}/media`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: imageUrl,
          caption: caption,
          access_token: accessToken,
        }),
      }
    )
    const containerData = await containerRes.json()

    if (containerData.error) {
      console.error('Media container error:', containerData.error)
      return res.status(400).json({
        error: 'Failed to create media',
        detail: containerData.error.message,
      })
    }

    const creationId = containerData.id

    // Step 2: Wait a moment for Meta to process the image
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Step 3: Check container status (optional but recommended)
    const statusRes = await fetch(
      `https://graph.facebook.com/v21.0/${creationId}?fields=status_code&access_token=${accessToken}`
    )
    const statusData = await statusRes.json()

    if (statusData.status_code === 'ERROR') {
      return res.status(400).json({ error: 'Image processing failed. Make sure the image URL is publicly accessible.' })
    }

    // If still processing, wait a bit more
    if (statusData.status_code === 'IN_PROGRESS') {
      await new Promise(resolve => setTimeout(resolve, 5000))
    }

    // Step 4: Publish the container
    const publishRes = await fetch(
      `https://graph.facebook.com/v21.0/${igUserId}/media_publish`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: creationId,
          access_token: accessToken,
        }),
      }
    )
    const publishData = await publishRes.json()

    if (publishData.error) {
      console.error('Publish error:', publishData.error)
      return res.status(400).json({
        error: 'Failed to publish',
        detail: publishData.error.message,
      })
    }

    console.log(`📸 Posted to Instagram! Post ID: ${publishData.id}`)
    return res.status(200).json({
      success: true,
      postId: publishData.id,
    })
  } catch (err) {
    console.error('Post to Instagram error:', err.message)
    return res.status(500).json({ error: 'Failed to post to Instagram' })
  }
}
