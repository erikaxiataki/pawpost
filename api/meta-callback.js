// Meta OAuth — Step 2: Exchange code for token, get IG Business Account
import { verifySession } from '../lib/auth.js'
import { saveMetaToken } from '../lib/db.js'

export default async function handler(req, res) {
  try {
    const { code, error: authError } = req.query

    if (authError || !code) {
      return res.redirect('/dashboard?meta_error=auth_denied')
    }

    const appId = (process.env.META_APP_ID || '').trim()
    const appSecret = (process.env.META_APP_SECRET || '').trim()

    if (!appId || !appSecret) {
      return res.redirect('/dashboard?meta_error=config')
    }

    const redirectUri = 'https://pawpost.ca/api/meta-callback'

    // Step 1: Exchange code for short-lived token
    const tokenUrl = 'https://graph.facebook.com/v21.0/oauth/access_token?client_id=' + appId + '&redirect_uri=' + encodeURIComponent(redirectUri) + '&client_secret=' + appSecret + '&code=' + code
    const tokenRes = await fetch(tokenUrl)
    const tokenData = await tokenRes.json()

    if (tokenData.error) {
      return res.redirect('/dashboard?meta_error=token')
    }

    const shortToken = tokenData.access_token

    // Step 2: Exchange for long-lived token (~60 days)
    const longUrl = 'https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=' + appId + '&client_secret=' + appSecret + '&fb_exchange_token=' + shortToken
    const longRes = await fetch(longUrl)
    const longData = await longRes.json()

    if (longData.error) {
      return res.redirect('/dashboard?meta_error=long_token')
    }

    const accessToken = longData.access_token
    // Long-lived tokens expire in ~60 days
    const expiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()

    // Step 3: Get Facebook Pages
    const pagesRes = await fetch('https://graph.facebook.com/v21.0/me/accounts?access_token=' + accessToken)
    const pagesData = await pagesRes.json()

    if (!pagesData.data || pagesData.data.length === 0) {
      return res.redirect('/dashboard?meta_error=no_pages')
    }

    // Check ALL pages for an Instagram Business Account
    let page = null
    let igUserId = null
    let pageToken = null
    let pageId = null
    let pageName = null

    for (const p of pagesData.data) {
      const igCheck = await fetch('https://graph.facebook.com/v21.0/' + p.id + '?fields=instagram_business_account&access_token=' + p.access_token)
      const igCheckData = await igCheck.json()
      if (igCheckData.instagram_business_account && !page) {
        page = p
        igUserId = igCheckData.instagram_business_account.id
        pageToken = p.access_token
        pageId = p.id
        pageName = p.name
      }
    }

    if (!page || !igUserId) {
      return res.redirect('/dashboard?meta_error=no_ig')
    }

    // Step 5: Get IG info
    const igInfoRes = await fetch('https://graph.facebook.com/v21.0/' + igUserId + '?fields=username,profile_picture_url,name&access_token=' + pageToken)
    const igInfo = await igInfoRes.json()

    // Save token to database (server-side, not exposed to client)
    const user = await verifySession(req)
    if (user) {
      await saveMetaToken(user.email, {
        accessToken,
        pageToken,
        igUserId,
        igUsername: igInfo.username || '',
        pageId,
        pageName,
        profilePic: igInfo.profile_picture_url || '',
        expiresAt,
      })
    }

    // Redirect back to dashboard with success (no token in URL)
    const params = new URLSearchParams({
      meta: 'success',
      ig_user: igUserId,
      ig_name: igInfo.username || pageName,
      page_name: pageName,
    })
    return res.redirect(`/dashboard?${params}`)
  } catch (err) {
    console.error('Meta callback error:', err)
    return res.redirect('/dashboard?meta_error=crash')
  }
}
