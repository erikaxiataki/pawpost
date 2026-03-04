// Meta OAuth — Step 1: Redirect user to Meta login
export default async function handler(req, res) {
  try {
    const appId = (process.env.META_APP_ID || '').trim()
    const redirectUri = 'https://pawpost.ca/api/meta-callback'
    const scopes = 'instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement'

    if (!appId) {
      return res.status(500).json({ error: 'META_APP_ID not configured' })
    }

    const authUrl = 'https://www.facebook.com/v21.0/dialog/oauth?client_id=' + encodeURIComponent(appId) + '&redirect_uri=' + encodeURIComponent(redirectUri) + '&scope=' + encodeURIComponent(scopes) + '&response_type=code'

    res.setHeader('Location', authUrl)
    return res.status(302).end()
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
