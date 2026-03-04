// Meta OAuth — Step 1: Redirect user to Meta login
export default async function handler(req, res) {
  try {
    const appId = (process.env.META_APP_ID || '').trim()
    const redirectUri = 'https://pawpost.ca/api/meta-callback'
    const scopes = 'instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement'

    if (!appId) {
      return res.status(500).json({ error: 'META_APP_ID not configured' })
    }

    // Debug: return the URL as JSON so we can see it
    const authUrl = 'https://www.facebook.com/v21.0/dialog/oauth?client_id=' + encodeURIComponent(appId) + '&redirect_uri=' + encodeURIComponent(redirectUri) + '&scope=' + encodeURIComponent(scopes) + '&response_type=code'

    // Return as JSON for debugging
    return res.status(200).json({
      debug: true,
      appId: appId,
      appIdLength: appId.length,
      authUrl: authUrl
    })
  } catch (err) {
    return res.status(500).json({ error: err.message, stack: err.stack })
  }
}
