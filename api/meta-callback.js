// Meta OAuth — Step 2: Exchange code for token, get IG Business Account
export default async function handler(req, res) {
  try {
    const { code, error: authError } = req.query

    if (authError || !code) {
      return res.status(200).json({ step: 'auth', error: 'No code received', authError })
    }

    const appId = (process.env.META_APP_ID || '').trim()
    const appSecret = (process.env.META_APP_SECRET || '').trim()

    if (!appId || !appSecret) {
      return res.status(200).json({ step: 'config', error: 'Missing env vars', hasAppId: !!appId, hasSecret: !!appSecret })
    }

    const host = req.headers.host || 'pawpost.ca'
    const redirectUri = 'https://pawpost.ca/api/meta-callback'

    // Step 1: Exchange code for short-lived token
    const tokenUrl = 'https://graph.facebook.com/v21.0/oauth/access_token?client_id=' + appId + '&redirect_uri=' + encodeURIComponent(redirectUri) + '&client_secret=' + appSecret + '&code=' + code
    const tokenRes = await fetch(tokenUrl)
    const tokenData = await tokenRes.json()

    if (tokenData.error) {
      return res.status(200).json({ step: 'token_exchange', error: tokenData.error, host })
    }

    const shortToken = tokenData.access_token

    // Step 2: Exchange for long-lived token
    const longUrl = 'https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=' + appId + '&client_secret=' + appSecret + '&fb_exchange_token=' + shortToken
    const longRes = await fetch(longUrl)
    const longData = await longRes.json()

    if (longData.error) {
      return res.status(200).json({ step: 'long_token', error: longData.error })
    }

    const accessToken = longData.access_token

    // Step 3: Get Facebook Pages
    const pagesRes = await fetch('https://graph.facebook.com/v21.0/me/accounts?access_token=' + accessToken)
    const pagesData = await pagesRes.json()

    if (!pagesData.data || pagesData.data.length === 0) {
      return res.status(200).json({ step: 'pages', error: 'No pages found', pagesData })
    }

    const page = pagesData.data[0]
    const pageToken = page.access_token
    const pageId = page.id
    const pageName = page.name

    // Step 4: Get Instagram Business Account
    const igRes = await fetch('https://graph.facebook.com/v21.0/' + pageId + '?fields=instagram_business_account&access_token=' + pageToken)
    const igData = await igRes.json()

    if (!igData.instagram_business_account) {
      return res.status(200).json({ step: 'instagram', error: 'No IG business account', pageName, igData })
    }

    const igUserId = igData.instagram_business_account.id

    // Step 5: Get IG info
    const igInfoRes = await fetch('https://graph.facebook.com/v21.0/' + igUserId + '?fields=username,profile_picture_url,name&access_token=' + pageToken)
    const igInfo = await igInfoRes.json()

    // DEBUG: Return all the data as JSON so we can see it works
    return res.status(200).json({
      step: 'SUCCESS',
      igUserId,
      igUsername: igInfo.username || '',
      igName: igInfo.name || pageName,
      pageName,
      pageId
    })
  } catch (err) {
    return res.status(200).json({ step: 'crash', error: err.message })
  }
}
