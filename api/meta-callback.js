// Meta OAuth — Step 2: Exchange code for token, get IG Business Account
export default async function handler(req, res) {
  const { code, error: authError } = req.query

  if (authError || !code) {
    return res.redirect(302, '/dashboard?meta=error&reason=auth_denied')
  }

  const appId = process.env.META_APP_ID
  const appSecret = process.env.META_APP_SECRET
  const redirectUri = 'https://pawpost.ca/api/meta-callback'

  if (!appId || !appSecret) {
    return res.redirect(302, '/dashboard?meta=error&reason=config_missing')
  }

  try {
    // Step 1: Exchange code for short-lived token
    const tokenRes = await fetch(
      `https://graph.facebook.com/v21.0/oauth/access_token?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${appSecret}&code=${code}`
    )
    const tokenData = await tokenRes.json()

    if (tokenData.error) {
      console.error('Token exchange error:', tokenData.error)
      return res.redirect(302, `/dashboard?meta=error&reason=token&detail=${encodeURIComponent(tokenData.error.message || 'unknown')}`)
    }

    const shortToken = tokenData.access_token

    // Step 2: Exchange for long-lived token (60 days)
    const longRes = await fetch(
      `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortToken}`
    )
    const longData = await longRes.json()

    if (longData.error) {
      console.error('Long token error:', longData.error)
      return res.redirect(302, `/dashboard?meta=error&reason=long_token&detail=${encodeURIComponent(longData.error.message || 'unknown')}`)
    }

    const accessToken = longData.access_token

    // Step 3: Get Facebook Pages connected to this user
    const pagesRes = await fetch(
      `https://graph.facebook.com/v21.0/me/accounts?access_token=${accessToken}`
    )
    const pagesData = await pagesRes.json()

    if (!pagesData.data || pagesData.data.length === 0) {
      return res.redirect(302, '/dashboard?meta=error&reason=no_pages')
    }

    // Use the first page (most users have one business page)
    const page = pagesData.data[0]
    const pageToken = page.access_token
    const pageId = page.id
    const pageName = page.name

    // Step 4: Get Instagram Business Account linked to this page
    const igRes = await fetch(
      `https://graph.facebook.com/v21.0/${pageId}?fields=instagram_business_account&access_token=${pageToken}`
    )
    const igData = await igRes.json()

    if (!igData.instagram_business_account) {
      return res.redirect(302, `/dashboard?meta=error&reason=no_instagram&page=${encodeURIComponent(pageName)}`)
    }

    const igUserId = igData.instagram_business_account.id

    // Step 5: Get IG account info (username, profile pic)
    const igInfoRes = await fetch(
      `https://graph.facebook.com/v21.0/${igUserId}?fields=username,profile_picture_url,name&access_token=${pageToken}`
    )
    const igInfo = await igInfoRes.json()

    // Redirect back to dashboard with all the info encoded in URL
    // Frontend will store in localStorage
    const params = new URLSearchParams({
      meta: 'connected',
      ig_user_id: igUserId,
      ig_username: igInfo.username || '',
      ig_name: igInfo.name || pageName,
      ig_pic: igInfo.profile_picture_url || '',
      access_token: pageToken,
      token_expiry: Date.now() + (60 * 24 * 60 * 60 * 1000), // ~60 days
    })

    res.redirect(302, `/dashboard?${params.toString()}`)
  } catch (err) {
    console.error('Meta callback error:', err.message)
    res.redirect(302, `/dashboard?meta=error&reason=server&detail=${encodeURIComponent(err.message || 'unknown')}`)
  }
}
