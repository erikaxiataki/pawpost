// Meta OAuth — Step 1: Redirect user to Meta login
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  const appId = process.env.META_APP_ID
  const redirectUri = encodeURIComponent('https://pawpost.ca/api/meta-callback')
  const scopes = 'instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement'

  if (!appId) {
    return res.status(500).json({ error: 'META_APP_ID not configured' })
  }

  const authUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=code`

  res.redirect(302, authUrl)
}
