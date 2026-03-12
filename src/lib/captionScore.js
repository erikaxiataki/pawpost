/**
 * PawPost Caption Quality Scorer
 * Adapted from Purely PEI quality_check.py for generic pet businesses.
 * Returns a 0-100 score with breakdown and tips.
 */

// --- Platform config ---
const CHAR_LIMITS = {
  instagram: { min: 100, max: 2200 },
  twitter: { min: 1, max: 280 },
  linkedin: { min: 100, max: 3000 },
  facebook: { min: 1, max: 63206 },
  tiktok: { min: 1, max: 2200 },
}

const HASHTAG_IDEAL = {
  instagram: { min: 5, max: 10 },
  twitter: { min: 1, max: 3 },
  linkedin: { min: 1, max: 3 },
  facebook: { min: 0, max: 3 },
  tiktok: { min: 3, max: 8 },
}

// --- Emoji regex (covers most ranges) ---
const EMOJI_RE = /(?:[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2702}-\u{27B0}]|[\u{24C2}-\u{1F251}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{2600}-\u{26FF}])[\u{FE00}-\u{FE0F}\u{200D}]*/gu

// --- Passive voice pattern ---
const PASSIVE_RE = /\b(?:is|are|was|were|been|being|be)\s+(?:\w+ly\s+)?(?:\w+ed|made|built|sold|given|shown|known|seen|done|found|taken|gone)\b/gi

// --- Hook patterns (strong openers) ---
const HOOK_PATTERNS = [
  /^(POV|pov)[:\s]/,           // POV hooks
  /^\d+\s/,                     // starts with a number
  /^[^.!?\n]{0,80}\?/,         // opens with a question (within first 80 chars)
  /^(stop|wait|hear me out|unpopular opinion|hot take|the truth|nobody|everyone|this is)/i,
  /^(did you know|what if|imagine|here'?s why|here'?s how|the secret|the #?\d)/i,
]

// --- CTA keywords ---
const CTA_WORDS = [
  'follow', 'share', 'comment', 'link in bio', 'shop', 'book', 'dm',
  'save this', 'tag a friend', 'tag someone', 'double tap', 'click',
  'sign up', 'join', 'subscribe', 'grab yours', 'order', 'tap',
  'tell us', 'let us know', 'drop a', 'what do you think',
]

// --- Engagement hooks ---
const ENGAGEMENT_WORDS = [
  'tag a friend', 'save this', 'double tap', 'share with',
  'what do you think', 'tell us', 'drop a', 'comment below',
  'do you agree', 'which one', 'yes or no', 'true or false',
  'relate?', 'same?', 'who else', 'anyone else',
]

/**
 * Get the first line (hook) from a caption.
 */
export function getHook(text) {
  if (!text) return ''
  // Split on first newline or first sentence-ending punctuation
  const newlineIdx = text.indexOf('\n')
  const firstLine = newlineIdx > 0 ? text.substring(0, newlineIdx) : text.split(/(?<=[.!?])\s/)[0] || text
  return firstLine.trim()
}

/**
 * Score hook strength: 0-15 points
 */
function scoreHook(text) {
  const hook = getHook(text)
  if (!hook) return { score: 0, max: 15, label: 'Hook strength', detail: 'No hook found' }

  let score = 5 // baseline for having text
  let reasons = []

  // Check strong patterns
  for (const pattern of HOOK_PATTERNS) {
    if (pattern.test(hook)) {
      score += 5
      reasons.push('strong opener')
      break
    }
  }

  // Short punchy hooks score better (under 100 chars)
  if (hook.length > 10 && hook.length < 100) {
    score += 3
    reasons.push('good length')
  }

  // Ends with question mark or exclamation
  if (/[?!]$/.test(hook.trim())) {
    score += 2
    reasons.push('engaging punctuation')
  }

  return {
    score: Math.min(score, 15),
    max: 15,
    label: 'Hook strength',
    detail: reasons.length ? reasons.join(', ') : 'could be more attention-grabbing',
  }
}

/**
 * Score CTA presence: 0-15 points
 */
function scoreCTA(text) {
  const lower = text.toLowerCase()
  const found = CTA_WORDS.filter(w => lower.includes(w))

  if (found.length >= 2) return { score: 15, max: 15, label: 'Call to action', detail: 'multiple CTAs' }
  if (found.length === 1) return { score: 12, max: 15, label: 'Call to action', detail: `found: "${found[0]}"` }
  return { score: 0, max: 15, label: 'Call to action', detail: 'no CTA detected', tip: 'Add a call to action like "Save this for later" or "Tag a friend who needs this"' }
}

/**
 * Score hashtag count: 0-15 points
 */
function scoreHashtags(text, platform) {
  const tags = text.match(/#\w+/g) || []
  const count = tags.length
  const ideal = HASHTAG_IDEAL[platform] || HASHTAG_IDEAL.instagram

  if (count >= ideal.min && count <= ideal.max) {
    return { score: 15, max: 15, label: 'Hashtags', detail: `${count} hashtags (ideal range)` }
  }
  if (count > 0 && count < ideal.min) {
    return { score: 8, max: 15, label: 'Hashtags', detail: `${count} hashtags (aim for ${ideal.min}-${ideal.max})`, tip: `Add ${ideal.min - count} more hashtags for better reach` }
  }
  if (count > ideal.max) {
    return { score: 8, max: 15, label: 'Hashtags', detail: `${count} hashtags (too many, aim for ${ideal.min}-${ideal.max})`, tip: `Remove ${count - ideal.max} hashtags to avoid looking spammy` }
  }
  return { score: 0, max: 15, label: 'Hashtags', detail: 'no hashtags', tip: `Add ${ideal.min}-${ideal.max} relevant hashtags` }
}

/**
 * Score caption length: 0-15 points
 */
function scoreLength(text, platform) {
  const len = text.length
  const limits = CHAR_LIMITS[platform] || CHAR_LIMITS.instagram

  if (len > limits.max) {
    return { score: 3, max: 15, label: 'Length', detail: `${len} chars (over ${limits.max} limit)`, tip: `Shorten by ${len - limits.max} characters` }
  }
  if (len < limits.min) {
    return { score: 5, max: 15, label: 'Length', detail: `${len} chars (too short)`, tip: 'Add more detail to make your caption more engaging' }
  }
  // Sweet spot: for Instagram, 100-500 is great, 500-2200 is ok
  if (platform === 'instagram' || platform === 'linkedin') {
    if (len >= 100 && len <= 600) return { score: 15, max: 15, label: 'Length', detail: `${len} chars (sweet spot)` }
    return { score: 12, max: 15, label: 'Length', detail: `${len} chars (acceptable)` }
  }
  return { score: 15, max: 15, label: 'Length', detail: `${len} chars` }
}

/**
 * Score emoji balance: 0-10 points
 */
function scoreEmoji(text) {
  const emojis = text.match(EMOJI_RE) || []
  const count = emojis.length

  if (count >= 1 && count <= 5) return { score: 10, max: 10, label: 'Emoji balance', detail: `${count} emojis (good)` }
  if (count === 0) return { score: 5, max: 10, label: 'Emoji balance', detail: 'no emojis', tip: 'Add 1-3 emojis to make your caption more eye-catching' }
  return { score: 5, max: 10, label: 'Emoji balance', detail: `${count} emojis (too many)`, tip: 'Reduce to 3-5 emojis for a cleaner look' }
}

/**
 * Score passive voice: 0-15 points (penalize if found)
 */
function scorePassiveVoice(text) {
  const matches = text.match(PASSIVE_RE) || []
  if (matches.length === 0) return { score: 15, max: 15, label: 'Active voice', detail: 'all active voice' }
  if (matches.length <= 2) return { score: 10, max: 15, label: 'Active voice', detail: `${matches.length} passive phrase(s)` }
  const examples = [...new Set(matches)].slice(0, 2).map(m => `"${m}"`)
  return { score: 5, max: 15, label: 'Active voice', detail: `${matches.length} passive phrases`, tip: `Rewrite passive phrases like ${examples.join(', ')} to active voice` }
}

/**
 * Score engagement hooks: 0-15 points
 */
function scoreEngagement(text) {
  const lower = text.toLowerCase()
  const found = ENGAGEMENT_WORDS.filter(w => lower.includes(w))
  const hasQuestion = /\?/.test(text)

  let score = 0
  const reasons = []

  if (found.length > 0) { score += 10; reasons.push(found[0]) }
  if (hasQuestion) { score += 5; reasons.push('question') }

  if (score === 0) {
    return { score: 0, max: 15, label: 'Engagement hook', detail: 'no engagement prompt', tip: 'Ask a question or add "Tag a friend" to boost engagement' }
  }
  return { score: Math.min(score, 15), max: 15, label: 'Engagement hook', detail: reasons.join(', ') }
}

/**
 * Main scoring function.
 * @param {string} text - The full caption text
 * @param {string} platform - 'instagram' | 'twitter' | 'linkedin' | 'facebook' | 'tiktok'
 * @returns {{ score: number, label: string, color: string, checks: Array, tips: string[] }}
 */
export function scoreCaption(text, platform = 'instagram') {
  if (!text || !text.trim()) {
    return { score: 0, label: 'No caption', color: '#ef4444', checks: [], tips: [] }
  }

  const checks = [
    scoreHook(text),
    scoreCTA(text),
    scoreHashtags(text, platform),
    scoreLength(text, platform),
    scoreEmoji(text),
    scorePassiveVoice(text),
    scoreEngagement(text),
  ]

  const totalScore = checks.reduce((sum, c) => sum + c.score, 0)
  const totalMax = checks.reduce((sum, c) => sum + c.max, 0)
  const normalized = Math.round((totalScore / totalMax) * 100)

  let label, color
  if (normalized >= 90) { label = 'Excellent'; color = '#16a34a' }
  else if (normalized >= 70) { label = 'Great'; color = '#65a30d' }
  else if (normalized >= 50) { label = 'Good — could be better'; color = '#d97706' }
  else { label = 'Needs work'; color = '#ef4444' }

  // Collect tips from the weakest checks (lowest score/max ratio), max 2
  const tips = checks
    .filter(c => c.tip)
    .sort((a, b) => (a.score / a.max) - (b.score / b.max))
    .slice(0, 2)
    .map(c => c.tip)

  return { score: normalized, label, color, checks, tips }
}

/**
 * Evaluate hook strength as strong/medium/weak.
 */
export function getHookStrength(text) {
  const hook = getHook(text)
  if (!hook) return { level: 'weak', label: 'Weak', color: '#ef4444' }

  let points = 0
  for (const pattern of HOOK_PATTERNS) {
    if (pattern.test(hook)) { points += 2; break }
  }
  if (hook.length > 10 && hook.length < 100) points += 1
  if (/[?!]$/.test(hook.trim())) points += 1

  if (points >= 3) return { level: 'strong', label: 'Strong', color: '#16a34a' }
  if (points >= 1) return { level: 'medium', label: 'Medium', color: '#d97706' }
  return { level: 'weak', label: 'Weak', color: '#ef4444' }
}
