<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { captionTemplates, platformFormats, weeklyThemes, imageSuggestions, trendingSounds, petHolidays, generateVariants, getCategoryPhoto, getCTA, getSEOKeywords, bestPostingTimes } from '../data/captions.js'

function getPhoto(caption, fallbackIndex) {
  return caption?.photo || getCategoryPhoto(caption?.category, fallbackIndex || 0)
}

const router = useRouter()

const profile = ref(null)
const activeTab = ref('calendar')
const activePlatform = ref('instagram')
const calView = ref('week')
const selectedDay = ref(null)
const copiedId = ref(null)
const showProfile = ref(false)
const darkMode = ref(false)
const editingCaption = ref(null)
const activeVariant = ref(0)
const detailPlatformTab = ref(null)
const postedDays = ref({})
const showContentMix = ref(false)

/* ---- Brand Voice (Pro Feature) ---- */
const brandVoice = ref({
  tone: 'warm',
  humor: 50,
  formality: 30,
  emojiLevel: 'moderate',
  customNotes: '',
  keywords: [],
  avoidWords: [],
  sampleCaption: '',
})
const newKeyword = ref('')
const newAvoidWord = ref('')
const brandVoiceSaved = ref(false)
const showProGate = ref(false)
const isProUser = ref(false) // Future: real auth check

const toneOptions = [
  { id: 'warm', label: 'Warm & Friendly', icon: '💛', desc: 'Approachable, like a friend' },
  { id: 'funny', label: 'Funny & Bold', icon: '😎', desc: 'Humor, memes, personality' },
  { id: 'professional', label: 'Professional', icon: '💼', desc: 'Polished, trustworthy' },
  { id: 'educational', label: 'Educational', icon: '📚', desc: 'Tips, value, expertise' },
  { id: 'edgy', label: 'Edgy & Direct', icon: '🔥', desc: 'No fluff, straight talk' },
]

const emojiOptions = [
  { id: 'none', label: 'None' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'moderate', label: 'Moderate' },
  { id: 'lots', label: 'Lots' },
]

function addKeyword() {
  const w = newKeyword.value.trim()
  if (w && !brandVoice.value.keywords.includes(w) && brandVoice.value.keywords.length < 10) {
    brandVoice.value.keywords.push(w)
    newKeyword.value = ''
  }
}
function removeKeyword(word) {
  brandVoice.value.keywords = brandVoice.value.keywords.filter(k => k !== word)
}
function addAvoidWord() {
  const w = newAvoidWord.value.trim()
  if (w && !brandVoice.value.avoidWords.includes(w) && brandVoice.value.avoidWords.length < 10) {
    brandVoice.value.avoidWords.push(w)
    newAvoidWord.value = ''
  }
}
function removeAvoidWord(word) {
  brandVoice.value.avoidWords = brandVoice.value.avoidWords.filter(k => k !== word)
}
function saveBrandVoice() {
  localStorage.setItem('pawpost_brand_voice', JSON.stringify(brandVoice.value))
  brandVoiceSaved.value = true
  setTimeout(() => { brandVoiceSaved.value = false }, 2000)
}
function resetBrandVoice() {
  brandVoice.value = {
    tone: profile.value?.vibe || 'warm',
    humor: 50,
    formality: 30,
    emojiLevel: 'moderate',
    customNotes: '',
    keywords: [],
    avoidWords: [],
    sampleCaption: '',
  }
  localStorage.removeItem('pawpost_brand_voice')
}
function openBrandVoiceTab() {
  if (!isProUser.value) {
    showProGate.value = true
    return
  }
  activeTab.value = 'voice'
}
function unlockPro() {
  // Future: real payment flow
  isProUser.value = true
  localStorage.setItem('pawpost_pro', 'true')
  showProGate.value = false
  activeTab.value = 'voice'
}

const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())
const currentWeekStart = ref(getWeekStart(new Date()))

function getWeekStart(d) {
  const date = new Date(d)
  date.setDate(date.getDate() - date.getDay())
  date.setHours(0,0,0,0)
  return date
}

const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']
const monthNamesShort = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const dayNames = ['S','M','T','W','T','F','S']
const dayNamesFull = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

onMounted(() => {
  const saved = localStorage.getItem('pawpost_profile')
  if (!saved) { router.push('/onboarding'); return }
  profile.value = JSON.parse(saved)
  activePlatform.value = profile.value.platforms?.[0] || 'instagram'
  darkMode.value = localStorage.getItem('pawpost_dark') === 'true'
  // Load posted days
  const savedPosted = localStorage.getItem('pawpost_posted')
  if (savedPosted) postedDays.value = JSON.parse(savedPosted)
  // Load caption edits
  const savedEdits = localStorage.getItem('pawpost_edits')
  if (savedEdits) captionEdits.value = JSON.parse(savedEdits)
  // Load brand voice
  const savedVoice = localStorage.getItem('pawpost_brand_voice')
  if (savedVoice) brandVoice.value = JSON.parse(savedVoice)
  // Load pro status
  isProUser.value = localStorage.getItem('pawpost_pro') === 'true'
  // Set initial tone from onboarding vibe
  if (!savedVoice && profile.value?.vibe) brandVoice.value.tone = profile.value.vibe
})

function toggleDark() {
  darkMode.value = !darkMode.value
  localStorage.setItem('pawpost_dark', darkMode.value)
}

// Reset detail platform tab when selected day changes
watch(selectedDay, () => {
  detailPlatformTab.value = null
  activeVariant.value = 0
  editingCaption.value = null
})

const captions = computed(() => {
  if (!profile.value) return []
  const type = profile.value.businessTypeId || 'other'
  return captionTemplates[type] || captionTemplates.other
})

// Custom caption edits stored per day (persisted to localStorage)
const captionEdits = ref({})
function saveEdit(dayKey) {
  if (editingCaption.value !== null) {
    captionEdits.value[dayKey] = editingCaption.value
    localStorage.setItem('pawpost_edits', JSON.stringify(captionEdits.value))
    editingCaption.value = null
  }
}
function resetEdit(dayKey) {
  delete captionEdits.value[dayKey]
  localStorage.setItem('pawpost_edits', JSON.stringify(captionEdits.value))
  editingCaption.value = null
}
function startEdit(text, dayKey) {
  editingCaption.value = text
}
function cancelEdit() { editingCaption.value = null }

// Posted day tracking
function getDayKey(day) {
  const y = day.year || currentYear.value
  const m = String((day.month ?? currentMonth.value) + 1).padStart(2, '0')
  const d = String(day.date).padStart(2, '0')
  return `${y}-${m}-${d}`
}
function togglePosted(day) {
  const key = getDayKey(day)
  if (postedDays.value[key]) delete postedDays.value[key]
  else postedDays.value[key] = new Date().toISOString()
  localStorage.setItem('pawpost_posted', JSON.stringify(postedDays.value))
}
function isDayPosted(day) {
  return !!postedDays.value[getDayKey(day)]
}

// Posted stats for current month
const postedStats = computed(() => {
  const days = calView.value === 'week' ? weekDays.value : calendarDays.value
  const postingDays = days.filter(d => !d.empty && d.caption)
  const posted = postingDays.filter(d => isDayPosted(d))
  return { total: postingDays.length, posted: posted.length }
})

// Content mix breakdown
const contentMix = computed(() => {
  const counts = {}
  captions.value.forEach(c => {
    const cat = c.category || 'other'
    counts[cat] = (counts[cat] || 0) + 1
  })
  const colors = {
    transformation: '#f59e0b', fun: '#ec4899', educational: '#3b82f6', promo: '#f97316',
    testimonial: '#8b5cf6', trust: '#10b981', milestone: '#06b6d4', brand: '#6366f1',
    lifestyle: '#84cc16', emotional: '#ef4444', engagement: '#14b8a6', other: '#9ca3af'
  }
  return Object.entries(counts)
    .map(([cat, count]) => ({ cat, count, color: colors[cat] || '#9ca3af' }))
    .sort((a, b) => b.count - a.count)
})

// Character count for current caption
const captionCharCount = computed(() => {
  if (!selectedDay.value?.caption) return null
  const dayKey = `${selectedDay.value.date}-${selectedDay.value.month}`
  const text = captionEdits.value[dayKey] || formatForPlatform(currentVariants.value[activeVariant.value] || selectedDay.value.caption, detailPlatform.value)
  const hashtags = getHashtags(selectedDay.value.caption, detailPlatform.value)
  const full = text + '\n\n' + hashtags
  const max = platformFormats[detailPlatform.value]?.maxLength || 2200
  return { current: full.length, max, percent: Math.round((full.length / max) * 100) }
})

// Caption variants for selected day
const currentVariants = computed(() => {
  if (!selectedDay.value?.caption) return []
  return generateVariants(selectedDay.value.caption, profile.value?.vibe, profile.value?.businessName)
})

// Pet holidays — upcoming ones
const upcomingHolidays = computed(() => {
  const now = new Date()
  const m = now.getMonth()
  const d = now.getDate()
  return petHolidays
    .filter(h => h.month > m || (h.month === m && h.day >= d))
    .slice(0, 3)
})

// Check if a specific day has a pet holiday
function getHolidayForDay(month, day) {
  return petHolidays.find(h => h.month === month && h.day === day)
}

// Posting frequency — which days of the week to post
function isPostingDay(dow) {
  const freq = profile.value?.frequency || 'daily'
  if (freq === 'daily') return true
  if (freq === '5x') return dow >= 1 && dow <= 5 // Mon-Fri
  if (freq === '3x') return dow === 1 || dow === 3 || dow === 5 // Mon, Wed, Fri
  if (freq === '2x') return dow === 2 || dow === 4 // Tue, Thu
  if (freq === '1x') return dow === 3 // Wed
  return true
}

const calendarDays = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()
  const days = []
  for (let i = 0; i < firstDay; i++) days.push({ empty: true })
  let captionIdx = 0
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d)
    const dow = date.getDay()
    const posting = isPostingDay(dow)
    days.push({
      date: d, dow, month, year,
      theme: weeklyThemes[dow],
      caption: posting ? captions.value[captionIdx % captions.value.length] : null,
      isToday: today.getDate() === d && today.getMonth() === month && today.getFullYear() === year,
      isPast: date < new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      holiday: getHolidayForDay(month, d),
      isPostingDay: posting,
    })
    if (posting) captionIdx++
  }
  return days
})

const weekDays = computed(() => {
  const today = new Date()
  const days = []
  let wkCaptionIdx = 0
  for (let i = 0; i < 7; i++) {
    const date = new Date(currentWeekStart.value)
    date.setDate(date.getDate() + i)
    const d = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()
    const dow = date.getDay()
    const posting = isPostingDay(dow)
    days.push({
      date: d, dow, month, year,
      theme: weeklyThemes[dow],
      caption: posting ? captions.value[(d - 1) % captions.value.length] : null,
      isToday: today.getDate() === d && today.getMonth() === month && today.getFullYear() === year,
      isPast: date < new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      dateObj: date,
      monthLabel: monthNamesShort[month],
      holiday: getHolidayForDay(month, d),
      isPostingDay: posting,
    })
    if (posting) wkCaptionIdx++
  }
  return days
})

const weekLabel = computed(() => {
  const first = weekDays.value[0]
  const last = weekDays.value[6]
  if (first.month === last.month) return `${monthNames[first.month]} ${first.date}–${last.date}, ${first.year}`
  return `${monthNamesShort[first.month]} ${first.date} – ${monthNamesShort[last.month]} ${last.date}, ${first.year}`
})

function prevWeek() { const d = new Date(currentWeekStart.value); d.setDate(d.getDate() - 7); currentWeekStart.value = d }
function nextWeek() { const d = new Date(currentWeekStart.value); d.setDate(d.getDate() + 7); currentWeekStart.value = d }
function goToThisWeek() { currentWeekStart.value = getWeekStart(new Date()) }

const vibeLabel = computed(() => {
  const vibes = { warm: 'Warm & Friendly', funny: 'Funny & Playful', professional: 'Professional', educational: 'Tips & Education' }
  return vibes[profile.value?.vibe] || 'Warm & Friendly'
})

function personalizeCaption(text) {
  if (!profile.value) return text
  let result = text
  const name = profile.value.businessName
  if (name) {
    // Weave business name naturally into captions
    result = result.replace(/\bour salon\b/gi, name)
      .replace(/\bour clinic\b/gi, name)
      .replace(/\bour store\b/gi, name)
      .replace(/\bour bakery\b/gi, name)
      .replace(/\bour daycare\b/gi, name)
      .replace(/\bour team\b/gi, `the ${name} team`)
      .replace(/\bour shop\b/gi, name)
      .replace(/\bour studio\b/gi, name)
  }
  return result
}

function formatForPlatform(caption, platform) {
  if (!caption) return ''
  const text = caption.text
  if (platform === 'tiktok') {
    const short = text.split('.').slice(0, 2).join('.') + '.'
    return short.length > 280 ? short.substring(0, 277) + '...' : short
  }
  if (platform === 'facebook') return text + '\n\nWhat do you think? Let us know in the comments!'
  return text
}

function getHashtags(caption, platform) {
  if (!caption) return ''
  if (platform === 'tiktok') return caption.hashtags.split(' ').slice(0, 4).join(' ')
  if (platform === 'facebook') return caption.hashtags.split(' ').slice(0, 2).join(' ')
  return caption.hashtags
}

function copyCaption(caption, platform, id) {
  const dayKey = `${selectedDay.value?.date}-${selectedDay.value?.month}`
  const customText = captionEdits.value[dayKey]
  const text = customText || formatForPlatform(caption, platform)
  const full = text + '\n\n' + getHashtags(caption, platform)
  navigator.clipboard.writeText(full)
  copiedId.value = id
  setTimeout(() => copiedId.value = null, 2000)
}

function selectDay(day) {
  if (day.empty) return
  selectedDay.value = selectedDay.value?.date === day.date && selectedDay.value?.month === day.month ? null : day
}

function prevMonth() {
  if (currentMonth.value === 0) { currentMonth.value = 11; currentYear.value-- }
  else currentMonth.value--
}
function nextMonth() {
  if (currentMonth.value === 11) { currentMonth.value = 0; currentYear.value++ }
  else currentMonth.value++
}

function resetProfile() { localStorage.removeItem('pawpost_profile'); router.push('/onboarding') }

function updateFrequency(freq) {
  profile.value.frequency = freq
  localStorage.setItem('pawpost_profile', JSON.stringify(profile.value))
}

const frequencyOptions = [
  { value: '1x', label: '1x / week', posts: 4, desc: 'Light' },
  { value: '2x', label: '2x / week', posts: 8, desc: 'Easy' },
  { value: '3x', label: '3x / week', posts: 12, desc: 'Balanced' },
  { value: '5x', label: '5x / week', posts: 22, desc: 'Active' },
  { value: 'daily', label: 'Daily', posts: 30, desc: 'Power' },
]

const currentFreqLabel = computed(() => {
  const f = frequencyOptions.find(o => o.value === (profile.value?.frequency || 'daily'))
  return f?.label || 'Daily'
})
function getImageSuggestions(category) { return imageSuggestions[category] || imageSuggestions.brand }
function getTrendingSounds(category, platform) {
  const sounds = trendingSounds[category] || trendingSounds.brand
  if (!platform) return sounds.slice(0, 2)
  return sounds.filter(s => s.platforms.includes(platform)).slice(0, 2)
}

const businessLabel = computed(() => {
  if (!profile.value) return ''
  const types = { groomer:'Dog Groomer', walker:'Dog Walker', trainer:'Dog Trainer', sitter:'Pet Sitter', daycare:'Doggy Daycare', vet:'Vet Clinic', photographer:'Pet Photographer', store:'Pet Store', bakery:'Dog Bakery' }
  return types[profile.value.businessTypeId] || profile.value.businessType || 'Pet Business'
})

// The platform to show in detail (allows switching)
const detailPlatform = computed(() => detailPlatformTab.value || activePlatform.value)

// Export to CSV
function exportCSV() {
  const rows = [['Day', 'Date', 'Theme', 'Category', 'Caption (Instagram)', 'Caption (TikTok)', 'Caption (Facebook)', 'Hashtags', 'Image Idea', 'Trending Sound']]
  const year = currentYear.value
  const month = currentMonth.value
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d)
    const dow = date.getDay()
    const caption = captions.value[(d - 1) % captions.value.length]
    const theme = weeklyThemes[dow]
    const sound = getTrendingSounds(caption?.category, 'instagram')[0]
    rows.push([
      dayNamesFull[dow],
      `${monthNamesShort[month]} ${d}`,
      theme?.theme || '',
      caption?.category || '',
      `"${(caption?.text || '').replace(/"/g, '""')}"`,
      `"${formatForPlatform(caption, 'tiktok').replace(/"/g, '""')}"`,
      `"${formatForPlatform(caption, 'facebook').replace(/"/g, '""')}"`,
      caption?.hashtags || '',
      caption?.imageIdea || '',
      sound?.name || '',
    ])
  }
  const csv = rows.map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `pawpost-${monthNamesShort[month].toLowerCase()}-${year}-content.csv`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div v-if="profile" :class="['dash-root', darkMode && 'dark']">

    <!-- ===== TOP NAV ===== -->
    <nav class="dash-nav">
      <div class="dash-nav-inner">
        <router-link to="/" class="dash-logo">
          <span class="dash-logo-icon">🐾</span>
          <span class="dash-logo-text">PawPost <span class="dash-logo-accent">AI</span></span>
        </router-link>

        <div class="dash-nav-actions">
          <div class="dash-tab-group">
            <button @click="activeTab = 'calendar'" :class="['dash-tab', activeTab === 'calendar' && 'active']">📅 Calendar</button>
            <button @click="activeTab = 'captions'" :class="['dash-tab', activeTab === 'captions' && 'active']">✍️ Captions</button>
            <button @click="openBrandVoiceTab" :class="['dash-tab', activeTab === 'voice' && 'active']">
              🎨 Voice
              <span v-if="!isProUser" class="dash-pro-badge">PRO</span>
            </button>
          </div>
          <button @click="toggleDark" class="dash-dark-btn" :title="darkMode ? 'Light mode' : 'Dark mode'">
            {{ darkMode ? '☀️' : '🌙' }}
          </button>
          <button @click="showProfile = !showProfile" class="dash-avatar">
            {{ profile.businessName?.[0] || '🐾' }}
          </button>
        </div>
      </div>
    </nav>

    <!-- Profile dropdown -->
    <Transition name="dropdown">
      <div v-if="showProfile" class="dash-profile-dropdown">
        <div class="dash-profile-header">
          <div class="dash-profile-avatar">{{ profile.businessName?.[0] || '🐾' }}</div>
          <div>
            <p class="dash-profile-name">{{ profile.businessName || businessLabel }}</p>
            <p class="dash-profile-type">{{ businessLabel }}</p>
          </div>
        </div>
        <div class="dash-profile-details">
          <div v-if="profile.location" class="dash-profile-row">
            <span class="dash-profile-label">📍</span>
            <span>{{ profile.location }}</span>
          </div>
          <div class="dash-profile-row">
            <span class="dash-profile-label">📱</span>
            <span>{{ profile.platforms?.map(p => platformFormats[p]?.label).join(', ') }}</span>
          </div>
        </div>
        <div class="dash-freq-section">
          <span class="dash-freq-label">📊 Posting frequency</span>
          <div class="dash-freq-options">
            <button
              v-for="opt in frequencyOptions"
              :key="opt.value"
              :class="['dash-freq-btn', { active: (profile.frequency || 'daily') === opt.value }]"
              @click="updateFrequency(opt.value)"
            >
              <span class="dash-freq-btn-label">{{ opt.label }}</span>
              <span class="dash-freq-btn-desc">{{ opt.desc }}</span>
            </button>
          </div>
          <p class="dash-freq-hint">≈ {{ frequencyOptions.find(o => o.value === (profile.frequency || 'daily'))?.posts }} posts per month</p>
        </div>
        <button @click="resetProfile" class="dash-profile-reset">Redo Onboarding</button>
      </div>
    </Transition>
    <div v-if="showProfile" class="dash-overlay" @click="showProfile = false"></div>

    <!-- ===== MAIN ===== -->
    <main class="dash-main">

      <!-- Welcome strip -->
      <div v-if="activeTab !== 'voice'" class="dash-welcome">
        <div class="dash-welcome-inner">
          <div>
            <h1 class="dash-welcome-title">{{ profile.businessName ? `${profile.businessName}` : 'Your Dashboard' }}</h1>
            <p class="dash-welcome-sub">Your content is ready. Pick a day, copy, and post.</p>
          </div>
          <div class="dash-stats">
            <div class="dash-stat">
              <span class="dash-stat-num">{{ captions.length }}</span>
              <span class="dash-stat-label">Captions</span>
            </div>
            <div class="dash-stat-divider"></div>
            <div class="dash-stat">
              <span class="dash-stat-num">{{ frequencyOptions.find(o => o.value === (profile.frequency || 'daily'))?.posts || 30 }}</span>
              <span class="dash-stat-label">Posts/mo</span>
            </div>
            <div class="dash-stat-divider"></div>
            <div class="dash-stat">
              <span class="dash-stat-num">{{ postedStats.posted }}<span class="dash-stat-of">/{{ postedStats.total }}</span></span>
              <span class="dash-stat-label">Posted</span>
            </div>
          </div>
          <!-- Posted progress bar -->
          <div class="dash-progress-wrap">
            <div class="dash-progress-bar">
              <div class="dash-progress-fill" :style="{ width: postedStats.total ? (postedStats.posted / postedStats.total * 100) + '%' : '0%' }"></div>
            </div>
            <span class="dash-progress-text">{{ postedStats.total ? Math.round(postedStats.posted / postedStats.total * 100) : 0 }}% done</span>
          </div>
        </div>
      </div>

      <!-- Content Mix -->
      <div v-if="activeTab !== 'voice'" class="dash-content-mix">
        <button class="dash-mix-toggle" @click="showContentMix = !showContentMix">
          <span>🎨 Content Mix</span>
          <span class="dash-mix-arrow" :style="{ transform: showContentMix ? 'rotate(180deg)' : '' }">▾</span>
        </button>
        <Transition name="slide-up">
          <div v-if="showContentMix" class="dash-mix-pills">
            <span v-for="m in contentMix" :key="m.cat" class="dash-mix-pill" :style="{ background: m.color + '18', color: m.color, borderColor: m.color + '40' }">
              {{ m.cat }} <strong>×{{ m.count }}</strong>
            </span>
          </div>
        </Transition>
      </div>

      <!-- Upcoming pet holidays banner -->
      <div v-if="upcomingHolidays.length && activeTab !== 'voice'" class="dash-holidays">
        <div class="dash-holidays-inner">
          <span class="dash-holidays-label">📅 Upcoming</span>
          <div class="dash-holidays-list">
            <span v-for="h in upcomingHolidays" :key="h.name" class="dash-holiday-chip">
              {{ h.icon }} {{ h.name }} · {{ monthNamesShort[h.month] }} {{ h.day }}
            </span>
          </div>
        </div>
      </div>

      <!-- Platform pills + export -->
      <div v-if="activeTab !== 'voice'" class="dash-platforms">
        <div class="dash-platforms-inner">
          <div class="dash-platforms-left">
            <button v-for="pid in (profile.platforms || ['instagram'])" :key="pid" @click="activePlatform = pid"
              :class="['dash-platform-pill', activePlatform === pid && 'active']">
              {{ platformFormats[pid]?.emoji }} {{ platformFormats[pid]?.label }}
            </button>
          </div>
          <button @click="exportCSV" class="dash-export-btn" title="Download as CSV">
            📥 Export
          </button>
        </div>
      </div>

      <!-- ===== CALENDAR VIEW ===== -->
      <div v-if="activeTab === 'calendar'" class="dash-calendar-wrap">

        <!-- Calendar toolbar -->
        <div class="dash-cal-toolbar">
          <div class="dash-month-nav">
            <button @click="calView === 'month' ? prevMonth() : prevWeek()" class="dash-month-btn">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 15l-5-5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <h2 class="dash-month-title">{{ calView === 'month' ? `${monthNames[currentMonth]} ${currentYear}` : weekLabel }}</h2>
            <button @click="calView === 'month' ? nextMonth() : nextWeek()" class="dash-month-btn">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M8 5l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </div>
          <div class="dash-view-toggle">
            <button v-if="calView === 'week'" @click="goToThisWeek" class="dash-today-btn">Today</button>
            <div class="dash-view-group">
              <button @click="calView = 'week'" :class="['dash-view-btn', calView === 'week' && 'active']">Week</button>
              <button @click="calView = 'month'" :class="['dash-view-btn', calView === 'month' && 'active']">Month</button>
            </div>
          </div>
        </div>

        <!-- Brand voice badge -->
        <div class="dash-voice-badge">
          <span class="dash-voice-icon">🎨</span>
          <span>Voice: <strong>{{ vibeLabel }}</strong></span>
          <span class="dash-voice-sep">·</span>
          <span>{{ businessLabel }}</span>
          <span v-if="profile.location" class="dash-voice-sep">·</span>
          <span v-if="profile.location">📍 {{ profile.location }}</span>
        </div>

        <!-- ===== MONTH VIEW ===== -->
        <div v-if="calView === 'month'" class="dash-calendar">
          <div class="dash-cal-header">
            <div v-for="(name, i) in dayNames" :key="i" class="dash-cal-day-name">
              <span class="dash-cal-day-short">{{ name }}</span>
              <span class="dash-cal-day-full">{{ dayNamesFull[i] }}</span>
            </div>
          </div>
          <div class="dash-cal-grid">
            <div v-for="(day, i) in calendarDays" :key="i"
              @click="selectDay(day)"
              :class="['dash-cal-cell', day.empty && 'empty', !day.empty && 'has-content', day.isToday && 'today', day.isPast && 'past', selectedDay?.date === day.date && selectedDay?.month === day.month && 'selected', isDayPosted(day) && 'posted']">
              <template v-if="!day.empty">
                <span :class="['dash-cal-date', day.isToday && 'today-badge']">{{ day.date }}</span>
                <div class="dash-cal-dots">
                  <span v-if="day.caption && isDayPosted(day)" class="dash-cal-check">✓</span>
                  <span v-else-if="day.caption" class="dash-cal-dot"></span>
                  <span v-if="day.holiday" class="dash-cal-holiday-dot"></span>
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- ===== WEEK VIEW ===== -->
        <div v-if="calView === 'week'" class="dash-week">
          <div v-for="(day, i) in weekDays" :key="i"
            @click="day.caption && selectDay(day)"
            :class="['dash-week-card', day.isToday && 'today', day.isPast && 'past', !day.caption && 'rest-day', selectedDay?.date === day.date && selectedDay?.month === day.month && 'selected', isDayPosted(day) && 'posted']">
            <div class="dash-week-card-header">
              <div class="dash-week-card-date">
                <span class="dash-week-card-dow">{{ dayNamesFull[day.dow] }}</span>
                <span :class="['dash-week-card-num', day.isToday && 'today-badge']">{{ day.date }}</span>
              </div>
              <div class="dash-week-card-right">
                <span v-if="isDayPosted(day)" class="dash-posted-badge">✓ Posted</span>
                <span v-if="day.caption && bestPostingTimes[day.dow]" class="dash-time-badge">🕐 {{ bestPostingTimes[day.dow].time }}</span>
                <div class="dash-week-card-theme">
                  <span>{{ day.theme?.icon }}</span>
                  <span class="dash-week-card-theme-name">{{ day.theme?.theme }}</span>
                </div>
              </div>
            </div>
            <!-- Mark as posted button -->
            <button v-if="day.caption" class="dash-post-toggle" @click.stop="togglePosted(day)">
              {{ isDayPosted(day) ? '✓ Posted' : '○ Mark as Posted' }}
            </button>
            <!-- Rest day -->
            <div v-if="!day.caption" class="dash-week-card-rest">
              <span class="dash-rest-icon">😌</span>
              <span class="dash-rest-label">Rest Day</span>
              <span class="dash-rest-sub">No post scheduled</span>
            </div>
            <!-- Photo thumbnail -->
            <div v-if="day.caption" class="dash-week-card-img">
              <img :src="getPhoto(day.caption, day.date)" :alt="day.caption.imageIdea" loading="lazy" />
            </div>
            <!-- Holiday badge -->
            <div v-if="day.holiday" class="dash-week-card-holiday">
              {{ day.holiday.icon }} {{ day.holiday.name }}
            </div>
            <p v-if="day.caption" class="dash-week-card-caption">{{ personalizeCaption(day.caption?.text || '').substring(0, 140) }}...</p>
            <div v-if="day.caption" class="dash-week-card-footer">
              <span class="dash-week-card-cat">{{ day.caption?.category }}</span>
              <span v-if="captionEdits[`${day.date}-${day.month}`]" class="dash-edited-badge">✏️ Edited</span>
              <span v-if="day.caption?.engagementHook" :class="['dash-week-card-engage', `engage-${day.caption.engagementHook.type}`]">
                {{ day.caption.engagementHook.type === 'comment' ? '💬' : day.caption.engagementHook.type === 'save' ? '🔖' : '📤' }}
                {{ day.caption.engagementHook.type }}
              </span>
              <span v-if="activePlatform === 'tiktok' && day.caption?.videoIdea" class="dash-week-card-photo">🎬 {{ day.caption?.videoIdea?.substring(0, 60) }}...</span>
              <span v-else class="dash-week-card-photo">📷 {{ day.caption?.imageIdea }}</span>
              <span v-if="getTrendingSounds(day.caption?.category, activePlatform)[0]" class="dash-week-card-sound">
                🎵 {{ getTrendingSounds(day.caption?.category, activePlatform)[0]?.name }}
              </span>
            </div>
          </div>
        </div>

        <!-- ===== SELECTED DAY DETAIL ===== -->
        <Transition name="slide-up">
          <div v-if="selectedDay" class="dash-detail">
            <div class="dash-detail-card">
              <!-- Header -->
              <div class="dash-detail-header">
                <div>
                  <p class="dash-detail-date">{{ selectedDay.month !== undefined ? monthNames[selectedDay.month] : monthNames[currentMonth] }} {{ selectedDay.date }}, {{ selectedDay.year || currentYear }}</p>
                  <h3 class="dash-detail-theme">{{ selectedDay.theme?.icon }} {{ selectedDay.theme?.theme }}</h3>
                  <div v-if="selectedDay.holiday" class="dash-detail-holiday">
                    {{ selectedDay.holiday.icon }} {{ selectedDay.holiday.name }}
                    <span class="dash-detail-holiday-tip">{{ selectedDay.holiday.tip }}</span>
                  </div>
                </div>
                <button @click="selectedDay = null" class="dash-detail-close">&times;</button>
              </div>

              <!-- Best time + Posted status bar -->
              <div class="dash-detail-status-bar">
                <span v-if="bestPostingTimes[selectedDay.dow]" class="dash-detail-best-time">
                  🕐 Best time: <strong>{{ bestPostingTimes[selectedDay.dow].time }}</strong>
                  <span class="dash-best-time-note">{{ bestPostingTimes[selectedDay.dow].note }}</span>
                </span>
                <button class="dash-detail-post-btn" @click="togglePosted(selectedDay)"
                  :class="{ posted: isDayPosted(selectedDay) }">
                  {{ isDayPosted(selectedDay) ? '✓ Posted' : '○ Mark as Posted' }}
                </button>
              </div>

              <!-- Platform tabs in detail -->
              <div class="dash-detail-platform-tabs">
                <button v-for="pid in (profile.platforms || ['instagram'])" :key="pid"
                  @click="detailPlatformTab = pid"
                  :class="['dash-detail-ptab', detailPlatform === pid && 'active']">
                  {{ platformFormats[pid]?.emoji }} {{ platformFormats[pid]?.label }}
                </button>
              </div>

              <!-- Body -->
              <div class="dash-detail-body">
                <!-- Caption variant selector -->
                <div class="dash-detail-section">
                  <div class="dash-detail-section-head">
                    <span class="dash-detail-label">Caption for {{ platformFormats[detailPlatform]?.label }}</span>
                    <span class="dash-detail-badge">{{ selectedDay.caption?.category }}</span>
                  </div>

                  <!-- Variant tabs -->
                  <div v-if="currentVariants.length > 1" class="dash-variant-tabs">
                    <button v-for="(v, vi) in currentVariants" :key="vi"
                      @click="activeVariant = vi; editingCaption = null"
                      :class="['dash-variant-btn', activeVariant === vi && 'active']">
                      {{ v.variantLabel }}
                    </button>
                  </div>

                  <!-- Editable caption -->
                  <div class="dash-detail-caption-wrap">
                    <div v-if="editingCaption !== null" class="dash-edit-area">
                      <textarea v-model="editingCaption" class="dash-edit-textarea" rows="4"></textarea>
                      <div class="dash-edit-actions">
                        <button @click="saveEdit(`${selectedDay.date}-${selectedDay.month}`)" class="dash-edit-save">Save</button>
                        <button @click="cancelEdit" class="dash-edit-cancel">Cancel</button>
                      </div>
                    </div>
                    <div v-else class="dash-detail-caption" @click="startEdit(captionEdits[`${selectedDay.date}-${selectedDay.month}`] || formatForPlatform(currentVariants[activeVariant] || selectedDay.caption, detailPlatform), `${selectedDay.date}-${selectedDay.month}`)">
                      {{ captionEdits[`${selectedDay.date}-${selectedDay.month}`] || formatForPlatform(currentVariants[activeVariant] || selectedDay.caption, detailPlatform) }}
                      <span class="dash-edit-hint">tap to edit</span>
                    </div>
                    <!-- Reset to original -->
                    <button v-if="captionEdits[`${selectedDay.date}-${selectedDay.month}`]" class="dash-reset-edit" @click="resetEdit(`${selectedDay.date}-${selectedDay.month}`)">
                      ↩ Reset to original
                    </button>
                  </div>

                  <!-- Character counter -->
                  <div v-if="captionCharCount" class="dash-char-counter">
                    <div class="dash-char-bar">
                      <div class="dash-char-fill" :class="{ warn: captionCharCount.percent > 80, over: captionCharCount.percent > 95 }" :style="{ width: Math.min(captionCharCount.percent, 100) + '%' }"></div>
                    </div>
                    <span :class="['dash-char-text', captionCharCount.percent > 95 && 'over']">
                      {{ captionCharCount.current.toLocaleString() }} / {{ captionCharCount.max.toLocaleString() }} chars
                    </span>
                  </div>
                </div>

                <!-- Post mockup preview -->
                <div class="dash-detail-section">
                  <span class="dash-detail-label">📱 Post Preview</span>
                  <div class="dash-mockup">
                    <div class="dash-mockup-phone">
                      <div class="dash-mockup-header">
                        <div class="dash-mockup-avatar">{{ profile.businessName?.[0] || '🐾' }}</div>
                        <span class="dash-mockup-name">{{ profile.businessName || 'Your Business' }}</span>
                      </div>
                      <div class="dash-mockup-image">
                        <img :src="getPhoto(selectedDay.caption, selectedDay.date)" :alt="selectedDay.caption?.imageIdea" loading="lazy" />
                      </div>
                      <div class="dash-mockup-caption">
                        <span class="dash-mockup-caption-name">{{ profile.businessName?.toLowerCase().replace(/\s+/g, '') || 'yourbusiness' }}</span>
                        {{ (captionEdits[`${selectedDay.date}-${selectedDay.month}`] || formatForPlatform(currentVariants[activeVariant] || selectedDay.caption, detailPlatform)).substring(0, 120) }}{{ (captionEdits[`${selectedDay.date}-${selectedDay.month}`] || formatForPlatform(currentVariants[activeVariant] || selectedDay.caption, detailPlatform)).length > 120 ? '...' : '' }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Hashtags -->
                <div class="dash-detail-section">
                  <span class="dash-detail-label">Hashtags</span>
                  <div class="dash-detail-tags">
                    <span v-for="tag in getHashtags(selectedDay.caption, detailPlatform).split(' ')" :key="tag" class="dash-tag">{{ tag }}</span>
                  </div>
                </div>

                <!-- CTA -->
                <div class="dash-detail-section">
                  <span class="dash-detail-label">📣 Call to Action</span>
                  <div class="dash-cta-box">
                    <p class="dash-cta-text">{{ getCTA(selectedDay.caption?.category, selectedDay.date) }}</p>
                    <div class="dash-cta-alts">
                      <span v-for="(alt, ai) in [getCTA(selectedDay.caption?.category, 1), getCTA(selectedDay.caption?.category, 2)]" :key="ai"
                        class="dash-cta-chip">{{ alt }}</span>
                    </div>
                  </div>
                </div>

                <!-- Engagement Hook -->
                <div v-if="selectedDay.caption?.engagementHook" class="dash-detail-section">
                  <span class="dash-detail-label">🔥 Engagement Boost</span>
                  <div class="dash-engage-box">
                    <div class="dash-engage-type-row">
                      <span :class="['dash-engage-type-badge', `dash-engage-${selectedDay.caption.engagementHook.type}`]">
                        {{ selectedDay.caption.engagementHook.type === 'comment' ? '💬 Comment Driver' : selectedDay.caption.engagementHook.type === 'save' ? '🔖 Save Trigger' : '📤 Share Prompt' }}
                      </span>
                      <span v-if="selectedDay.caption.engagementHook.saveable" class="dash-engage-saveable">🔖 Saveable content</span>
                    </div>
                    <p class="dash-engage-prompt">{{ selectedDay.caption.engagementHook.prompt }}</p>
                    <p v-if="selectedDay.caption.engagementHook.saveReason" class="dash-engage-save-reason">
                      Why people save: <strong>{{ selectedDay.caption.engagementHook.saveReason }}</strong>
                    </p>
                    <div class="dash-engage-tips">
                      <p class="dash-engage-tips-label">Quick tips:</p>
                      <ul class="dash-engage-tips-list">
                        <li v-if="selectedDay.caption.engagementHook.type === 'comment'">Add this as the last line of your caption</li>
                        <li v-if="selectedDay.caption.engagementHook.type === 'comment'">Reply to every comment within 1 hour</li>
                        <li v-if="selectedDay.caption.engagementHook.type === 'comment'">Ask a follow-up question in your reply</li>
                        <li v-if="selectedDay.caption.engagementHook.type === 'save'">Put the most valuable info in carousel slides</li>
                        <li v-if="selectedDay.caption.engagementHook.type === 'save'">Use "Save this for later" in caption + stories</li>
                        <li v-if="selectedDay.caption.engagementHook.type === 'save'">Saves boost reach more than likes do</li>
                        <li v-if="selectedDay.caption.engagementHook.type === 'share'">Make it easy to tag — use "send to a friend"</li>
                        <li v-if="selectedDay.caption.engagementHook.type === 'share'">Shares multiply your reach to new audiences</li>
                        <li v-if="selectedDay.caption.engagementHook.type === 'share'">Add to stories with a "share this" sticker</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <!-- SEO Keywords -->
                <div class="dash-detail-section">
                  <span class="dash-detail-label">🔍 SEO Keywords</span>
                  <div class="dash-seo-box">
                    <div class="dash-seo-group">
                      <span class="dash-seo-label">Primary</span>
                      <div class="dash-seo-tags">
                        <span v-for="kw in getSEOKeywords(profile?.businessType).primary" :key="kw" class="dash-seo-tag primary">{{ kw }}</span>
                      </div>
                    </div>
                    <div class="dash-seo-group">
                      <span class="dash-seo-label">Related</span>
                      <div class="dash-seo-tags">
                        <span v-for="kw in getSEOKeywords(profile?.businessType).secondary" :key="kw" class="dash-seo-tag secondary">{{ kw }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Image ideas -->
                <div class="dash-detail-section">
                  <span class="dash-detail-label">📷 Photo & Visual Ideas</span>
                  <div class="dash-detail-photo-gallery">
                    <img v-for="(photo, pi) in [getPhoto(selectedDay.caption, 0), getCategoryPhoto(selectedDay.caption?.category, 1), getCategoryPhoto(selectedDay.caption?.category, 2)]" :key="pi"
                      :src="photo" :alt="selectedDay.caption?.imageIdea" class="dash-detail-gallery-img" loading="lazy" />
                  </div>
                  <div class="dash-detail-images">
                    <p class="dash-detail-image-main">{{ selectedDay.caption?.imageIdea }}</p>
                    <div class="dash-detail-image-chips">
                      <span v-for="idea in getImageSuggestions(selectedDay.caption?.category)" :key="idea" class="dash-image-chip">{{ idea }}</span>
                    </div>
                  </div>
                </div>

                <!-- Video idea (TikTok-focused) -->
                <div v-if="selectedDay.caption?.videoIdea" class="dash-detail-section">
                  <span class="dash-detail-label">🎬 Video Idea</span>
                  <div class="dash-video-box">
                    <p class="dash-video-text">{{ selectedDay.caption.videoIdea }}</p>
                    <div class="dash-video-badges">
                      <span class="dash-video-badge">🎵 TikTok</span>
                      <span class="dash-video-badge">📹 Reels</span>
                    </div>
                  </div>
                </div>

                <!-- Trending sounds -->
                <div class="dash-detail-section">
                  <span class="dash-detail-label">🎵 Trending Sounds</span>
                  <div class="dash-detail-sounds">
                    <div v-for="sound in getTrendingSounds(selectedDay.caption?.category, detailPlatform)" :key="sound.name" class="dash-sound-item">
                      <div class="dash-sound-info">
                        <span class="dash-sound-name">{{ sound.name }}</span>
                        <span class="dash-sound-tip">{{ sound.tip }}</span>
                      </div>
                      <div class="dash-sound-platforms">
                        <span v-for="p in sound.platforms" :key="p" class="dash-sound-platform">{{ platformFormats[p]?.emoji }}</span>
                      </div>
                    </div>
                    <p v-if="getTrendingSounds(selectedDay.caption?.category, detailPlatform).length === 0" class="dash-sound-none">No trending sounds for this category yet</p>
                  </div>
                </div>

                <!-- Theme tip -->
                <div class="dash-detail-tip">
                  <span class="dash-detail-tip-label">💡 Content Tip</span>
                  <p>{{ selectedDay.theme?.suggestion }}</p>
                </div>

                <!-- Copy button -->
                <button @click="copyCaption(currentVariants[activeVariant] || selectedDay.caption, detailPlatform, 'detail')"
                  :class="['dash-copy-btn', copiedId === 'detail' && 'copied']">
                  {{ copiedId === 'detail' ? '✓ Copied to clipboard' : `Copy for ${platformFormats[detailPlatform]?.label}` }}
                </button>
              </div>
            </div>
          </div>
        </Transition>

        <p v-if="!selectedDay" class="dash-hint">Tap any day to see the full caption, hashtags, and photo ideas</p>
      </div>

      <!-- ===== ALL CAPTIONS VIEW ===== -->
      <div v-if="activeTab === 'captions'" class="dash-captions-wrap">
        <div class="dash-captions-header">
          <h2 class="dash-captions-title">All Captions</h2>
          <span class="dash-captions-count">{{ captions.length }} ready</span>
        </div>

        <div class="dash-captions-list">
          <div v-for="(caption, idx) in captions" :key="idx" class="dash-caption-card">
            <div class="dash-caption-meta">
              <span class="dash-caption-category">{{ caption.category }}</span>
              <span class="dash-caption-platform">{{ platformFormats[activePlatform]?.emoji }} {{ platformFormats[activePlatform]?.label }}</span>
            </div>

            <p class="dash-caption-text">{{ formatForPlatform(caption, activePlatform) }}</p>

            <div class="dash-caption-tags">
              <span v-for="tag in getHashtags(caption, activePlatform).split(' ')" :key="tag" class="dash-tag sm">{{ tag }}</span>
            </div>

            <div class="dash-caption-image-row">
              <span class="dash-caption-image-icon">📷</span>
              <div>
                <p class="dash-caption-image-text">{{ caption.imageIdea }}</p>
                <div class="dash-caption-image-chips">
                  <span v-for="idea in getImageSuggestions(caption.category).slice(0, 2)" :key="idea" class="dash-image-chip sm">{{ idea }}</span>
                </div>
              </div>
            </div>

            <button @click="copyCaption(caption, activePlatform, idx)"
              :class="['dash-copy-btn outline', copiedId === idx && 'copied']">
              {{ copiedId === idx ? '✓ Copied!' : 'Copy Caption + Hashtags' }}
            </button>
          </div>
        </div>
      </div>

      <!-- ===== BRAND VOICE SETTINGS (Pro) ===== -->
      <div v-if="activeTab === 'voice'" class="dash-voice-wrap">
        <div class="dash-voice-header">
          <div>
            <h2 class="dash-voice-title">Brand Voice Settings</h2>
            <p class="dash-voice-subtitle">Fine-tune how your captions sound. Every caption generated will match this voice.</p>
          </div>
          <div class="dash-voice-actions">
            <button @click="resetBrandVoice" class="dash-voice-reset">Reset</button>
            <button @click="saveBrandVoice" :class="['dash-voice-save', brandVoiceSaved && 'saved']">
              {{ brandVoiceSaved ? '✓ Saved' : 'Save Voice' }}
            </button>
          </div>
        </div>

        <!-- Tone selector -->
        <div class="dash-voice-section">
          <h3 class="dash-voice-label">Tone</h3>
          <div class="dash-voice-tone-grid">
            <button
              v-for="t in toneOptions" :key="t.id"
              @click="brandVoice.tone = t.id"
              :class="['dash-voice-tone-card', brandVoice.tone === t.id && 'active']"
            >
              <span class="dash-voice-tone-icon">{{ t.icon }}</span>
              <span class="dash-voice-tone-label">{{ t.label }}</span>
              <span class="dash-voice-tone-desc">{{ t.desc }}</span>
            </button>
          </div>
        </div>

        <!-- Sliders -->
        <div class="dash-voice-section">
          <div class="dash-voice-slider-row">
            <div class="dash-voice-slider-group">
              <div class="dash-voice-slider-header">
                <h3 class="dash-voice-label">Humor Level</h3>
                <span class="dash-voice-slider-value">{{ brandVoice.humor }}%</span>
              </div>
              <div class="dash-voice-slider-labels">
                <span>Serious</span><span>Playful</span>
              </div>
              <input type="range" v-model.number="brandVoice.humor" min="0" max="100" class="dash-voice-range" />
            </div>
            <div class="dash-voice-slider-group">
              <div class="dash-voice-slider-header">
                <h3 class="dash-voice-label">Formality</h3>
                <span class="dash-voice-slider-value">{{ brandVoice.formality }}%</span>
              </div>
              <div class="dash-voice-slider-labels">
                <span>Casual</span><span>Formal</span>
              </div>
              <input type="range" v-model.number="brandVoice.formality" min="0" max="100" class="dash-voice-range" />
            </div>
          </div>
        </div>

        <!-- Emoji level -->
        <div class="dash-voice-section">
          <h3 class="dash-voice-label">Emoji Usage</h3>
          <div class="dash-voice-emoji-row">
            <button
              v-for="e in emojiOptions" :key="e.id"
              @click="brandVoice.emojiLevel = e.id"
              :class="['dash-voice-emoji-btn', brandVoice.emojiLevel === e.id && 'active']"
            >{{ e.label }}</button>
          </div>
        </div>

        <!-- Keywords -->
        <div class="dash-voice-section">
          <div class="dash-voice-two-col">
            <div>
              <h3 class="dash-voice-label">Brand Keywords</h3>
              <p class="dash-voice-hint">Words you want in your captions (max 10)</p>
              <div class="dash-voice-chip-input">
                <div class="dash-voice-chips">
                  <span v-for="kw in brandVoice.keywords" :key="kw" class="dash-voice-chip">
                    {{ kw }}
                    <button @click="removeKeyword(kw)" class="dash-voice-chip-x">&times;</button>
                  </span>
                </div>
                <form @submit.prevent="addKeyword" class="dash-voice-add-row">
                  <input v-model="newKeyword" placeholder="e.g. pawsome, tail-wagging" class="dash-voice-input" />
                  <button type="submit" class="dash-voice-add-btn">Add</button>
                </form>
              </div>
            </div>
            <div>
              <h3 class="dash-voice-label">Words to Avoid</h3>
              <p class="dash-voice-hint">Words you never want in captions (max 10)</p>
              <div class="dash-voice-chip-input">
                <div class="dash-voice-chips">
                  <span v-for="aw in brandVoice.avoidWords" :key="aw" class="dash-voice-chip avoid">
                    {{ aw }}
                    <button @click="removeAvoidWord(aw)" class="dash-voice-chip-x">&times;</button>
                  </span>
                </div>
                <form @submit.prevent="addAvoidWord" class="dash-voice-add-row">
                  <input v-model="newAvoidWord" placeholder="e.g. fur-baby, doggo" class="dash-voice-input" />
                  <button type="submit" class="dash-voice-add-btn">Add</button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <!-- Custom voice notes -->
        <div class="dash-voice-section">
          <h3 class="dash-voice-label">Voice Notes</h3>
          <p class="dash-voice-hint">Describe your brand's personality in your own words</p>
          <textarea
            v-model="brandVoice.customNotes"
            class="dash-voice-textarea"
            placeholder="e.g. We're a small-town grooming salon that treats every dog like family. We're warm but never cheesy. We use humor but stay professional..."
            rows="4"
          ></textarea>
        </div>

        <!-- Sample caption preview -->
        <div class="dash-voice-section">
          <h3 class="dash-voice-label">Sample Caption (optional)</h3>
          <p class="dash-voice-hint">Paste a caption you love — we'll match this style</p>
          <textarea
            v-model="brandVoice.sampleCaption"
            class="dash-voice-textarea"
            placeholder="Paste a real caption from your feed that nails your voice..."
            rows="3"
          ></textarea>
        </div>

        <!-- Save bar (mobile sticky) -->
        <div class="dash-voice-save-bar">
          <button @click="saveBrandVoice" :class="['dash-voice-save lg', brandVoiceSaved && 'saved']">
            {{ brandVoiceSaved ? '✓ Voice Saved' : 'Save Brand Voice' }}
          </button>
        </div>
      </div>

    </main>

    <!-- Pro Gate Modal -->
    <Transition name="dropdown">
      <div v-if="showProGate" class="dash-pro-overlay" @click.self="showProGate = false">
        <div class="dash-pro-modal">
          <button class="dash-pro-close" @click="showProGate = false">&times;</button>
          <div class="dash-pro-icon">🔒</div>
          <h3 class="dash-pro-title">Brand Voice is a Pro feature</h3>
          <p class="dash-pro-desc">Customize your tone, humor, keywords, and how every caption sounds — so your content always feels like <em>you</em>.</p>
          <ul class="dash-pro-features">
            <li>Fine-tune tone, humor & formality</li>
            <li>Add brand keywords & words to avoid</li>
            <li>Paste a sample caption to match your style</li>
            <li>Multi-account support (coming soon)</li>
          </ul>
          <button @click="unlockPro" class="dash-pro-unlock">Unlock Pro — Free During Beta</button>
          <p class="dash-pro-note">No credit card required. Free while we're in beta.</p>
        </div>
      </div>
    </Transition>

    <!-- Footer -->
    <footer class="dash-footer">
      🐾 PawPost AI — Built for pet businesses that want to stand out
    </footer>
  </div>
</template>

<style scoped>
/* ===== BASE + DARK MODE ===== */
.dash-root {
  min-height: 100vh;
  background: var(--bg);
  font-family: 'Inter', -apple-system, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif;
  color: var(--text);
  -webkit-font-smoothing: antialiased;
  --bg: #fafafa; --bg-card: #fff; --text: #18181b; --text-secondary: #71717a;
  --text-tertiary: #a1a1aa; --border: rgba(0,0,0,0.05); --hover: rgba(0,0,0,0.03);
  --nav-bg: rgba(255,255,255,0.8); --pill-bg: rgba(250,250,250,0.9);
  --amber: #f59e0b; --amber-dark: #92400e; --amber-light: #fffbeb;
  --purple: #7c3aed; --purple-light: #faf5ff; --purple-border: #f3e8ff;
  --blue: #3b82f6; --blue-light: #eff6ff;
  --green: #16a34a; --caption-bg: #f4f4f5;
  --radius: 16px; --radius-sm: 10px; --radius-pill: 100px;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.06);
  --shadow-lg: 0 8px 32px rgba(0,0,0,0.08);
  transition: background 0.3s ease, color 0.3s ease;
}
.dash-root.dark {
  --bg: #0a0a0a; --bg-card: #18181b; --text: #fafafa; --text-secondary: #a1a1aa;
  --text-tertiary: #52525b; --border: rgba(255,255,255,0.06); --hover: rgba(255,255,255,0.04);
  --nav-bg: rgba(10,10,10,0.85); --pill-bg: rgba(10,10,10,0.9);
  --amber-light: rgba(245,158,11,0.1); --purple-light: rgba(124,58,237,0.08);
  --purple-border: rgba(124,58,237,0.15); --blue-light: rgba(59,130,246,0.1);
  --caption-bg: #27272a;
}

/* ===== NAV ===== */
.dash-nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  background: var(--nav-bg);
  backdrop-filter: saturate(180%) blur(20px); -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-bottom: 1px solid var(--border);
}
.dash-nav-inner {
  max-width: 1200px; margin: 0 auto; padding: 0 28px; height: 56px;
  display: flex; align-items: center; justify-content: space-between;
}
.dash-logo { display: flex; align-items: center; gap: 8px; text-decoration: none; }
.dash-logo-icon { font-size: 20px; }
.dash-logo-text { font-weight: 700; font-size: 17px; color: var(--text); letter-spacing: -0.03em; }
.dash-logo-accent { color: var(--amber); }

.dash-nav-actions { display: flex; align-items: center; gap: 8px; }
.dash-tab-group { display: flex; background: var(--hover); border-radius: var(--radius-sm); padding: 3px; }
.dash-tab {
  padding: 6px 14px; border-radius: 8px; border: none; cursor: pointer;
  font-size: 13px; font-weight: 500; color: var(--text-secondary); background: transparent;
  transition: all 0.2s ease;
}
.dash-tab.active {
  background: var(--bg-card); color: var(--text);
  box-shadow: var(--shadow-sm);
}
.dash-tab:hover:not(.active) { color: var(--text); }

.dash-dark-btn {
  width: 34px; height: 34px; border-radius: 50%; border: none; cursor: pointer;
  background: transparent; font-size: 16px;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s ease;
}
.dash-dark-btn:hover { background: var(--hover); }

.dash-avatar {
  width: 34px; height: 34px; border-radius: 50%; border: none; cursor: pointer;
  background: linear-gradient(135deg, #f59e0b, #f97316);
  color: #fff; font-weight: 700; font-size: 14px;
  display: flex; align-items: center; justify-content: center;
  transition: transform 0.15s ease;
}
.dash-avatar:hover { transform: scale(1.05); }

/* ===== PROFILE DROPDOWN ===== */
.dash-profile-dropdown {
  position: fixed; top: 60px; right: 24px; z-index: 200;
  width: 280px; background: var(--bg-card); border-radius: 16px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.12), 0 0 0 1px var(--border);
  padding: 20px; overflow: hidden;
}
.dash-overlay { position: fixed; inset: 0; z-index: 150; }
.dash-profile-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.dash-profile-avatar {
  width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, #f59e0b, #f97316);
  color: #fff; font-weight: 700; font-size: 16px;
  display: flex; align-items: center; justify-content: center;
}
.dash-profile-name { font-weight: 600; font-size: 15px; color: var(--text); }
.dash-profile-type { font-size: 12px; color: var(--text-secondary); }
.dash-profile-details { border-top: 1px solid var(--border); padding-top: 12px; margin-bottom: 16px; }
.dash-profile-row { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text); padding: 4px 0; }
.dash-profile-label { font-size: 14px; width: 22px; text-align: center; }
/* Frequency selector */
.dash-freq-section {
  border-top: 1px solid var(--border); padding-top: 12px; margin-bottom: 12px;
}
.dash-freq-label {
  font-size: 12px; font-weight: 600; color: var(--text); display: block; margin-bottom: 8px;
}
.dash-freq-options {
  display: flex; gap: 4px; flex-wrap: wrap;
}
.dash-freq-btn {
  flex: 1; min-width: 0; padding: 6px 4px; border-radius: 8px; border: 1.5px solid var(--border);
  background: var(--bg-card); cursor: pointer; transition: all 0.15s; text-align: center;
}
.dash-freq-btn:hover { border-color: var(--amber); }
.dash-freq-btn.active {
  border-color: var(--amber); background: rgba(245,158,11,0.08);
}
.dash-freq-btn-label {
  display: block; font-size: 11px; font-weight: 600; color: var(--text); line-height: 1.3;
}
.dash-freq-btn-desc {
  display: block; font-size: 9px; color: var(--text-secondary); line-height: 1.2;
}
.dash-freq-btn.active .dash-freq-btn-label { color: var(--amber); }
.dash-freq-btn.active .dash-freq-btn-desc { color: var(--amber); }
.dash-freq-hint {
  font-size: 11px; color: var(--text-secondary); margin: 6px 0 0 0; text-align: center;
}

.dash-profile-reset {
  width: 100%; padding: 10px; border-radius: 10px; border: none;
  background: var(--hover); color: var(--amber); font-weight: 600;
  font-size: 13px; cursor: pointer; transition: background 0.15s;
}
.dash-profile-reset:hover { background: rgba(0,0,0,0.07); }

.dropdown-enter-active { transition: all 0.2s ease; }
.dropdown-leave-active { transition: all 0.15s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-8px) scale(0.97); }

/* ===== MAIN ===== */
.dash-main { padding-top: 56px; min-height: calc(100vh - 40px); }

/* ===== WELCOME ===== */
.dash-welcome { background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); padding: 0 28px; }
.dash-welcome-inner {
  max-width: 1200px; margin: 0 auto; padding: 28px 0;
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;
}
.dash-welcome-title { font-size: 24px; font-weight: 800; color: #fff; letter-spacing: -0.03em; }
.dash-welcome-sub { font-size: 14px; color: rgba(255,255,255,0.75); margin-top: 4px; font-weight: 400; }
.dash-stats { display: flex; align-items: center; gap: 0; }
.dash-stat { text-align: center; padding: 0 22px; }
.dash-stat-num { display: block; font-size: 28px; font-weight: 800; color: #fff; letter-spacing: -0.04em; }
.dash-stat-label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(255,255,255,0.55); font-weight: 600; }
.dash-stat-divider { width: 1px; height: 28px; background: rgba(255,255,255,0.2); }
.dash-stat-of { font-size: 16px; font-weight: 500; opacity: 0.6; }

/* Posted progress bar */
.dash-progress-wrap {
  display: flex; align-items: center; gap: 10px; width: 100%; margin-top: 2px;
}
.dash-progress-bar {
  flex: 1; height: 6px; background: rgba(255,255,255,0.2); border-radius: 100px; overflow: hidden;
}
.dash-progress-fill {
  height: 100%; background: #fff; border-radius: 100px; transition: width 0.4s ease;
}
.dash-progress-text {
  font-size: 11px; color: rgba(255,255,255,0.7); font-weight: 600; white-space: nowrap;
}

/* Content Mix */
.dash-content-mix {
  max-width: 1200px; margin: 0 auto; padding: 0 24px;
}
.dash-mix-toggle {
  display: flex; align-items: center; gap: 6px; background: none; border: none;
  font-size: 13px; font-weight: 600; color: var(--text-secondary); cursor: pointer;
  padding: 10px 0; transition: color 0.15s;
}
.dash-mix-toggle:hover { color: var(--text); }
.dash-mix-arrow { transition: transform 0.2s ease; font-size: 12px; }
.dash-mix-pills {
  display: flex; flex-wrap: wrap; gap: 6px; padding-bottom: 10px;
}
.dash-mix-pill {
  font-size: 11px; font-weight: 500; padding: 4px 10px; border-radius: 100px;
  border: 1px solid; text-transform: capitalize;
}
.dash-mix-pill strong { font-weight: 700; }

/* ===== PET HOLIDAYS BANNER ===== */
.dash-holidays {
  background: var(--amber-light); border-bottom: 1px solid var(--border); padding: 8px 24px;
}
.dash-holidays-inner {
  max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: 12px;
  overflow-x: auto; -webkit-overflow-scrolling: touch;
}
.dash-holidays-label { font-size: 11px; font-weight: 600; color: var(--amber-dark); white-space: nowrap; text-transform: uppercase; letter-spacing: 0.04em; }
.dash-holidays-list { display: flex; gap: 8px; }
.dash-holiday-chip {
  font-size: 12px; color: var(--amber-dark); white-space: nowrap; font-weight: 500;
  background: rgba(255,255,255,0.6); padding: 4px 12px; border-radius: 100px;
}
.dash-root.dark .dash-holiday-chip { background: rgba(255,255,255,0.08); }

/* ===== PLATFORM PILLS ===== */
.dash-platforms {
  position: sticky; top: 52px; z-index: 50;
  background: var(--pill-bg);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border); padding: 12px 24px;
}
.dash-platforms-inner {
  max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; gap: 12px;
}
.dash-platforms-left { display: flex; gap: 8px; }
.dash-platform-pill {
  padding: 8px 18px; border-radius: var(--radius-pill); border: 1.5px solid var(--border);
  background: var(--bg-card); font-size: 13px; font-weight: 500; color: var(--text-secondary);
  cursor: pointer; transition: all 0.15s ease; white-space: nowrap;
}
.dash-platform-pill.active {
  background: var(--text); color: var(--bg); border-color: var(--text);
}
.dash-platform-pill:hover:not(.active) { border-color: var(--text-tertiary); }

.dash-export-btn {
  padding: 8px 16px; border-radius: var(--radius-sm); border: 1.5px solid var(--border);
  background: var(--bg-card); font-size: 13px; font-weight: 500; color: var(--text);
  cursor: pointer; transition: all 0.15s ease; white-space: nowrap;
}
.dash-export-btn:hover { background: var(--hover); }

/* ===== CALENDAR ===== */
.dash-calendar-wrap { max-width: 1200px; margin: 0 auto; padding: 28px 28px 48px; }
.dash-cal-toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 12px; }
.dash-month-nav { display: flex; align-items: center; gap: 12px; }
.dash-month-title { font-size: 22px; font-weight: 700; letter-spacing: -0.02em; color: var(--text); min-width: 200px; text-align: center; }
.dash-month-btn {
  width: 36px; height: 36px; border-radius: 50%; border: none;
  background: var(--hover); cursor: pointer; color: var(--text-secondary);
  display: flex; align-items: center; justify-content: center; transition: all 0.15s ease; flex-shrink: 0;
}
.dash-month-btn:hover { background: rgba(0,0,0,0.08); color: var(--text); }

.dash-view-toggle { display: flex; align-items: center; gap: 10px; }
.dash-today-btn {
  padding: 6px 14px; border-radius: 8px; border: 1.5px solid var(--border);
  background: var(--bg-card); font-size: 13px; font-weight: 500; color: var(--text);
  cursor: pointer; transition: all 0.15s ease;
}
.dash-today-btn:hover { background: var(--hover); }
.dash-view-group { display: flex; background: var(--hover); border-radius: 10px; padding: 3px; }
.dash-view-btn {
  padding: 6px 16px; border-radius: 8px; border: none; cursor: pointer;
  font-size: 13px; font-weight: 500; color: var(--text-secondary); background: transparent;
  transition: all 0.2s ease;
}
.dash-view-btn.active {
  background: var(--bg-card); color: var(--text);
  box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06);
}
.dash-view-btn:hover:not(.active) { color: var(--text); }

.dash-voice-badge {
  display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
  font-size: 13px; color: var(--text-secondary); margin-bottom: 16px;
  padding: 8px 14px; background: var(--amber-light); border-radius: 10px; border: 1px solid rgba(245,158,11,0.12);
}
.dash-voice-badge strong { color: var(--amber-dark); font-weight: 600; }
.dash-voice-icon { font-size: 14px; }
.dash-voice-sep { color: #d1d1d6; }

/* ===== WEEK VIEW ===== */
.dash-week { display: grid; grid-template-columns: repeat(7, 1fr); gap: 12px; }
.dash-week-card {
  background: var(--bg-card); border-radius: var(--radius); padding: 14px;
  border: 1px solid var(--border);
  cursor: pointer; transition: all 0.2s ease;
  display: flex; flex-direction: column; gap: 8px; min-height: 200px;
  overflow: hidden;
}
.dash-week-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
.dash-week-card.today { border-color: var(--amber); box-shadow: 0 0 0 1px var(--amber), var(--shadow-sm); }
.dash-week-card.past { opacity: 0.45; }
.dash-week-card.posted { border-color: #22c55e; opacity: 1; }
.dash-week-card.posted .dash-week-card-img { opacity: 0.7; }
.dash-week-card.rest-day { opacity: 0.4; background: transparent; border: 1px dashed var(--border); cursor: default; }
.dash-week-card.rest-day:hover { transform: none; box-shadow: none; }
.dash-week-card-rest { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px 0; gap: 6px; }
.dash-rest-icon { font-size: 24px; opacity: 0.7; }
.dash-rest-label { font-size: 12px; font-weight: 600; color: var(--text-tertiary); }
.dash-rest-sub { font-size: 10px; color: var(--text-tertiary); opacity: 0.7; }
.dash-week-card.selected { border-color: var(--amber); background: var(--amber-light); box-shadow: 0 0 0 1px var(--amber); }

.dash-week-card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 4px; }
.dash-week-card-date { display: flex; flex-direction: column; align-items: flex-start; }
.dash-week-card-dow { font-size: 11px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.04em; }
.dash-week-card-num { font-size: 22px; font-weight: 700; color: var(--text); letter-spacing: -0.02em; line-height: 1.1; }
.dash-week-card-num.today-badge { color: var(--amber); }
.dash-week-card-theme { text-align: right; }
.dash-week-card-theme span:first-child { font-size: 16px; }
.dash-week-card-theme-name { display: block; font-size: 10px; font-weight: 500; color: var(--text-tertiary); max-width: 70px; line-height: 1.2; margin-top: 2px; }

.dash-week-card-holiday {
  font-size: 10px; font-weight: 600; color: var(--amber-dark); background: var(--amber-light);
  padding: 3px 8px; border-radius: 6px; line-height: 1.3;
}

.dash-week-card-img {
  width: 100%; height: 90px; border-radius: var(--radius-sm); overflow: hidden; margin: 0;
}
.dash-week-card-img img {
  width: 100%; height: 100%; object-fit: cover; display: block;
}
.dash-week-card-caption {
  font-size: 12px; line-height: 1.5; color: var(--text-secondary);
  flex: 1; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; margin: 0;
}
.dash-week-card-footer { display: flex; flex-direction: column; gap: 4px; border-top: 1px solid var(--border); padding-top: 8px; margin-top: auto; }
.dash-week-card-cat {
  font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;
  color: var(--amber-dark); background: var(--amber-light); padding: 3px 8px; border-radius: var(--radius-pill); align-self: flex-start;
}
.dash-week-card-photo { font-size: 10px; color: var(--text-tertiary); line-height: 1.3; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.dash-week-card-sound { font-size: 10px; color: var(--purple); font-weight: 500; line-height: 1.3; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }

/* Week card right side header */
.dash-week-card-right { display: flex; flex-direction: column; align-items: flex-end; gap: 3px; }

/* Posted badge */
.dash-posted-badge {
  font-size: 10px; font-weight: 600; color: #fff; background: #22c55e;
  padding: 2px 8px; border-radius: 100px;
}
/* Time badge */
.dash-time-badge {
  font-size: 9px; font-weight: 500; color: var(--text-tertiary); white-space: nowrap;
}
/* Mark as posted button */
.dash-post-toggle {
  width: 100%; padding: 6px; border-radius: 8px; border: 1.5px dashed var(--border);
  background: transparent; font-size: 11px; font-weight: 600; color: var(--text-secondary);
  cursor: pointer; transition: all 0.15s;
}
.dash-post-toggle:hover { border-color: #22c55e; color: #22c55e; background: rgba(34,197,94,0.05); }
.dash-week-card.posted .dash-post-toggle {
  border-style: solid; border-color: #22c55e; color: #22c55e; background: rgba(34,197,94,0.06);
}
/* Edited badge */
.dash-edited-badge {
  font-size: 9px; font-weight: 600; color: #3b82f6; background: rgba(59,130,246,0.08);
  padding: 2px 8px; border-radius: 100px; align-self: flex-start;
}
/* Calendar posted check */
.dash-cal-cell.posted { background: rgba(34,197,94,0.08); }
.dash-cal-check { font-size: 10px; color: #22c55e; font-weight: 700; }

/* ===== MONTH VIEW ===== */
.dash-calendar { background: var(--bg-card); border-radius: 20px; overflow: hidden; border: 1px solid var(--border); }
.dash-cal-header { display: grid; grid-template-columns: repeat(7, 1fr); border-bottom: 1px solid var(--border); }
.dash-cal-day-name { padding: 14px 0; text-align: center; font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.04em; }
.dash-cal-day-short { display: none; }
.dash-cal-day-full { display: inline; }
.dash-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; padding: 8px; }
.dash-cal-cell {
  aspect-ratio: 1; padding: 0; position: relative;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;
  transition: all 0.2s ease; border-radius: 14px;
}
.dash-cal-cell.has-content { cursor: pointer; }
.dash-cal-cell.has-content:hover { background: var(--hover); transform: scale(1.08); box-shadow: 0 4px 12px rgba(245,158,11,0.15); }
.dash-cal-cell.past { opacity: 0.35; }
.dash-cal-cell.selected { background: linear-gradient(135deg, rgba(245,158,11,0.12), rgba(249,115,22,0.08)); box-shadow: 0 0 0 2px var(--amber); }
.dash-cal-date {
  font-size: 15px; font-weight: 500; color: var(--text);
  width: 36px; height: 36px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; transition: all 0.2s ease;
}
.dash-cal-cell.has-content:hover .dash-cal-date { background: rgba(245,158,11,0.12); }
.dash-cal-date.today-badge { background: linear-gradient(135deg, #f59e0b, #f97316); color: #fff; font-weight: 700; box-shadow: 0 2px 8px rgba(245,158,11,0.35); }
.dash-cal-cell.selected .dash-cal-date:not(.today-badge) { background: var(--amber); color: #fff; font-weight: 600; }
.dash-cal-dots { display: flex; gap: 3px; align-items: center; }
.dash-cal-dot { width: 6px; height: 6px; border-radius: 50%; background: linear-gradient(135deg, #f59e0b, #f97316); }
.dash-cal-holiday-dot { width: 6px; height: 6px; border-radius: 50%; background: linear-gradient(135deg, #ef4444, #f97316); }

/* ===== SELECTED DAY DETAIL ===== */
.dash-detail { margin-top: 28px; }
.dash-detail-card { background: var(--bg-card); border-radius: 20px; overflow: hidden; border: 1px solid var(--border); box-shadow: var(--shadow-lg); }
.dash-detail-header { background: linear-gradient(135deg, #f59e0b, #f97316); padding: 24px 28px; display: flex; align-items: flex-start; justify-content: space-between; }
.dash-detail-date { font-size: 13px; color: rgba(255,255,255,0.7); font-weight: 500; }
.dash-detail-theme { font-size: 22px; font-weight: 800; color: #fff; margin-top: 2px; letter-spacing: -0.02em; }
.dash-detail-holiday { font-size: 12px; color: rgba(255,255,255,0.9); margin-top: 8px; background: rgba(255,255,255,0.15); padding: 6px 12px; border-radius: var(--radius-sm); }
.dash-detail-holiday-tip { display: block; font-size: 11px; opacity: 0.75; margin-top: 2px; }
.dash-detail-close {
  width: 32px; height: 32px; border-radius: 50%;
  background: rgba(255,255,255,0.15); border: none; color: #fff;
  font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s;
}
.dash-detail-close:hover { background: rgba(255,255,255,0.3); }

/* Detail status bar (best time + posted) */
.dash-detail-status-bar {
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  padding: 10px 28px; background: var(--bg); border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
}
.dash-detail-best-time {
  font-size: 12px; color: var(--text-secondary); display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
}
.dash-detail-best-time strong { color: var(--text); }
.dash-best-time-note { font-size: 10px; color: var(--text-tertiary); }
.dash-detail-post-btn {
  padding: 5px 14px; border-radius: 100px; font-size: 11px; font-weight: 600;
  border: 1.5px solid var(--border); background: var(--bg-card); color: var(--text-secondary);
  cursor: pointer; transition: all 0.15s;
}
.dash-detail-post-btn:hover { border-color: #22c55e; color: #22c55e; }
.dash-detail-post-btn.posted {
  border-color: #22c55e; background: #22c55e; color: #fff;
}

/* Character counter */
.dash-char-counter {
  display: flex; align-items: center; gap: 10px; margin-top: 8px;
}
.dash-char-bar {
  flex: 1; height: 4px; background: var(--border); border-radius: 100px; overflow: hidden;
}
.dash-char-fill {
  height: 100%; background: #22c55e; border-radius: 100px; transition: width 0.3s ease, background 0.3s ease;
}
.dash-char-fill.warn { background: #f59e0b; }
.dash-char-fill.over { background: #ef4444; }
.dash-char-text { font-size: 11px; color: var(--text-tertiary); font-weight: 500; white-space: nowrap; }
.dash-char-text.over { color: #ef4444; font-weight: 600; }

/* Reset edit */
.dash-reset-edit {
  display: inline-block; margin-top: 6px; font-size: 11px; color: var(--text-tertiary);
  background: none; border: none; cursor: pointer; padding: 0; transition: color 0.15s;
}
.dash-reset-edit:hover { color: var(--amber); }

/* Detail platform tabs */
.dash-detail-platform-tabs {
  display: flex; gap: 0; border-bottom: 1px solid var(--border); background: var(--bg);
}
.dash-detail-ptab {
  flex: 1; padding: 10px 12px; border: none; cursor: pointer;
  font-size: 12px; font-weight: 500; color: var(--text-secondary); background: transparent;
  border-bottom: 2px solid transparent; transition: all 0.15s ease; text-align: center;
}
.dash-detail-ptab.active { color: var(--amber); border-bottom-color: var(--amber); font-weight: 600; }
.dash-detail-ptab:hover:not(.active) { color: var(--text); }

.dash-detail-body { padding: 28px; }
.dash-detail-section { margin-bottom: 24px; }
.dash-detail-section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.dash-detail-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-tertiary); }
.dash-detail-badge { font-size: 10px; font-weight: 600; padding: 3px 10px; border-radius: var(--radius-pill); background: var(--amber-light); color: var(--amber-dark); text-transform: uppercase; letter-spacing: 0.04em; }

/* Caption variants */
.dash-variant-tabs { display: flex; gap: 6px; margin-bottom: 10px; }
.dash-variant-btn {
  padding: 5px 12px; border-radius: 8px; border: 1.5px solid var(--border);
  background: var(--bg-card); font-size: 11px; font-weight: 500; color: var(--text-secondary);
  cursor: pointer; transition: all 0.15s ease;
}
.dash-variant-btn.active { background: var(--amber); color: #fff; border-color: var(--amber); }
.dash-variant-btn:hover:not(.active) { border-color: rgba(0,0,0,0.15); }

/* Editable caption */
.dash-detail-caption-wrap { position: relative; }
.dash-detail-caption {
  background: var(--caption-bg); border-radius: var(--radius); padding: 20px;
  font-size: 14px; line-height: 1.7; color: var(--text); white-space: pre-line;
  cursor: text; position: relative; transition: all 0.15s ease; border: 1px solid transparent;
}
.dash-detail-caption:hover { border-color: var(--amber); }
.dash-edit-hint {
  display: block; font-size: 10px; color: var(--text-tertiary); margin-top: 8px;
  text-transform: uppercase; letter-spacing: 0.06em; font-weight: 500;
}
.dash-edit-area { display: flex; flex-direction: column; gap: 8px; }
.dash-edit-textarea {
  width: 100%; border: 2px solid var(--amber); border-radius: 14px; padding: 16px;
  font-size: 15px; line-height: 1.6; color: var(--text); background: var(--caption-bg);
  font-family: inherit; resize: vertical; outline: none; box-sizing: border-box;
}
.dash-edit-actions { display: flex; gap: 8px; }
.dash-edit-save {
  padding: 8px 20px; border-radius: 8px; border: none;
  background: var(--amber); color: #fff; font-size: 13px; font-weight: 600; cursor: pointer;
}
.dash-edit-cancel {
  padding: 8px 20px; border-radius: 8px; border: 1px solid var(--border);
  background: var(--bg-card); color: var(--text-secondary); font-size: 13px; font-weight: 500; cursor: pointer;
}

/* Post mockup */
.dash-mockup { display: flex; justify-content: center; padding: 12px 0; }
.dash-mockup-phone {
  width: 300px; background: var(--bg-card); border-radius: 20px; overflow: hidden;
  border: 1px solid var(--border); box-shadow: var(--shadow-md);
}
.dash-mockup-header {
  display: flex; align-items: center; gap: 8px; padding: 12px 14px;
  border-bottom: 1px solid var(--border);
}
.dash-mockup-avatar {
  width: 28px; height: 28px; border-radius: 50%;
  background: linear-gradient(135deg, #f59e0b, #f97316);
  color: #fff; font-size: 12px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
.dash-mockup-name { font-size: 13px; font-weight: 600; color: var(--text); }
.dash-mockup-image {
  aspect-ratio: 1; background: linear-gradient(135deg, var(--purple-light), var(--amber-light));
  overflow: hidden; position: relative;
}
.dash-mockup-image img {
  width: 100%; height: 100%; object-fit: cover; display: block;
}
.dash-mockup-caption { padding: 12px 14px; font-size: 12px; line-height: 1.5; color: var(--text-secondary); }
.dash-mockup-caption-name { font-weight: 700; color: var(--text); margin-right: 4px; }

.dash-detail-photo-gallery {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 10px; margin-bottom: 12px;
}
.dash-detail-gallery-img {
  width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 10px; display: block;
  transition: transform 0.2s; cursor: pointer;
}
.dash-detail-gallery-img:hover { transform: scale(1.04); }

.dash-detail-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.dash-tag { font-size: 12px; padding: 5px 12px; border-radius: 100px; background: var(--blue-light); color: var(--blue); font-weight: 500; }
.dash-tag.sm { font-size: 11px; padding: 3px 10px; }

.dash-detail-images { background: var(--purple-light); border-radius: 14px; padding: 16px; }
.dash-detail-image-main { font-size: 14px; font-weight: 600; color: var(--purple); margin: 0 0 10px; }
.dash-detail-image-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.dash-image-chip { font-size: 11px; padding: 5px 12px; border-radius: 100px; background: var(--bg-card); color: var(--purple); border: 1px solid var(--purple-border); font-weight: 500; }
.dash-image-chip.sm { font-size: 10px; padding: 3px 10px; }

/* CTA section */
.dash-cta-box { background: linear-gradient(135deg, #fef3c7, #fff7ed); border-radius: 14px; padding: 14px 16px; border: 1px solid #fde68a; }
.dash-cta-text { font-size: 15px; font-weight: 700; color: #92400e; margin-bottom: 10px; line-height: 1.4; }
.dash-cta-alts { display: flex; flex-wrap: wrap; gap: 6px; }
.dash-cta-chip { font-size: 11px; padding: 5px 12px; border-radius: 100px; background: white; color: #b45309; border: 1px solid #fcd34d; font-weight: 500; cursor: pointer; transition: all 0.2s; }
.dash-cta-chip:hover { background: #fbbf24; color: white; }

/* SEO section */
.dash-seo-box { display: flex; flex-direction: column; gap: 12px; }
.dash-seo-group { display: flex; flex-direction: column; gap: 6px; }
.dash-seo-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); }
.dash-seo-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.dash-seo-tag { font-size: 11px; padding: 5px 12px; border-radius: 100px; font-weight: 500; }
.dash-seo-tag.primary { background: linear-gradient(135deg, #dbeafe, #ede9fe); color: #3730a3; border: 1px solid #c7d2fe; }
.dash-seo-tag.secondary { background: var(--bg-card); color: var(--text-muted); border: 1px solid var(--border); }

/* Video idea */
.dash-video-box { background: linear-gradient(135deg, #ecfdf5, #f0fdf4); border-radius: 14px; padding: 14px 16px; border: 1px solid #bbf7d0; }
.dash-root.dark .dash-video-box { background: rgba(22,163,74,0.1); border-color: rgba(22,163,74,0.25); }
.dash-video-text { font-size: 14px; color: #166534; line-height: 1.5; margin-bottom: 10px; }
.dash-root.dark .dash-video-text { color: #86efac; }
.dash-video-badges { display: flex; gap: 6px; }
.dash-video-badge { font-size: 11px; padding: 4px 10px; border-radius: 100px; background: white; color: #166534; border: 1px solid #86efac; font-weight: 500; }
.dash-root.dark .dash-video-badge { background: rgba(22,163,74,0.15); color: #86efac; border-color: rgba(134,239,172,0.3); }

/* Engagement Hook */
.dash-engage-box {
  background: linear-gradient(135deg, #fef3c7, #fffbeb);
  border-radius: 14px; padding: 16px; border: 1px solid #fcd34d;
}
.dash-root.dark .dash-engage-box {
  background: rgba(245,158,11,0.08); border-color: rgba(245,158,11,0.2);
}
.dash-engage-type-row { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; flex-wrap: wrap; }
.dash-engage-type-badge {
  font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 100px;
  text-transform: capitalize;
}
.dash-engage-comment { background: #dbeafe; color: #1e40af; }
.dash-root.dark .dash-engage-comment { background: rgba(59,130,246,0.15); color: #93c5fd; }
.dash-engage-save { background: #dcfce7; color: #166534; }
.dash-root.dark .dash-engage-save { background: rgba(22,163,74,0.15); color: #86efac; }
.dash-engage-share { background: #fce7f3; color: #9d174d; }
.dash-root.dark .dash-engage-share { background: rgba(236,72,153,0.15); color: #f9a8d4; }
.dash-engage-saveable {
  font-size: 10px; font-weight: 500; color: #16a34a; padding: 3px 8px;
  border-radius: 100px; border: 1px solid #bbf7d0; background: #f0fdf4;
}
.dash-root.dark .dash-engage-saveable {
  background: rgba(22,163,74,0.08); border-color: rgba(22,163,74,0.2); color: #86efac;
}
.dash-engage-prompt {
  font-size: 15px; font-weight: 600; color: #92400e; line-height: 1.4; margin: 0 0 8px 0;
}
.dash-root.dark .dash-engage-prompt { color: #fbbf24; }
.dash-engage-save-reason {
  font-size: 12px; color: #a16207; margin: 0 0 12px 0; line-height: 1.4;
}
.dash-root.dark .dash-engage-save-reason { color: #fcd34d; }
.dash-engage-save-reason strong { font-weight: 600; }
.dash-engage-tips {
  background: rgba(255,255,255,0.6); border-radius: 10px; padding: 10px 12px;
}
.dash-root.dark .dash-engage-tips { background: rgba(0,0,0,0.2); }
.dash-engage-tips-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #92400e; margin: 0 0 6px 0; }
.dash-root.dark .dash-engage-tips-label { color: #fbbf24; }
.dash-engage-tips-list {
  margin: 0; padding: 0 0 0 16px; list-style: disc;
}
.dash-engage-tips-list li {
  font-size: 12px; color: #78350f; line-height: 1.6;
}
.dash-root.dark .dash-engage-tips-list li { color: #fde68a; }

/* Week card engagement badge */
.dash-week-card-engage {
  font-size: 11px; font-weight: 500; padding: 2px 8px; border-radius: 100px;
  text-transform: capitalize; display: inline-flex; align-items: center; gap: 3px;
}
.dash-week-card-engage.engage-comment { background: #dbeafe; color: #1e40af; }
.dash-week-card-engage.engage-save { background: #dcfce7; color: #166534; }
.dash-week-card-engage.engage-share { background: #fce7f3; color: #9d174d; }
.dash-root.dark .dash-week-card-engage.engage-comment { background: rgba(59,130,246,0.15); color: #93c5fd; }
.dash-root.dark .dash-week-card-engage.engage-save { background: rgba(22,163,74,0.15); color: #86efac; }
.dash-root.dark .dash-week-card-engage.engage-share { background: rgba(236,72,153,0.15); color: #f9a8d4; }

/* Trending sounds */
.dash-detail-sounds { display: flex; flex-direction: column; gap: 8px; }
.dash-sound-item {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  background: var(--purple-light); border-radius: 12px; padding: 12px 14px; border: 1px solid var(--purple-border);
}
.dash-sound-info { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
.dash-sound-name { font-size: 14px; font-weight: 600; color: var(--purple); overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.dash-sound-tip { font-size: 12px; color: #8b5cf6; opacity: 0.75; }
.dash-sound-platforms { display: flex; gap: 4px; flex-shrink: 0; }
.dash-sound-platform { font-size: 14px; }
.dash-sound-none { font-size: 13px; color: var(--text-tertiary); margin: 0; }

.dash-detail-tip { background: #fefce8; border-radius: 14px; padding: 16px; margin-bottom: 20px; }
.dash-root.dark .dash-detail-tip { background: rgba(254,252,232,0.08); }
.dash-detail-tip-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #a16207; display: block; margin-bottom: 4px; }
.dash-detail-tip p { font-size: 14px; color: #854d0e; margin: 0; line-height: 1.5; }
.dash-root.dark .dash-detail-tip p { color: #fbbf24; }

/* ===== COPY BUTTON ===== */
.dash-copy-btn {
  width: 100%; padding: 14px; border-radius: 12px; border: none;
  background: var(--text); color: var(--bg); font-size: 14px; font-weight: 600;
  cursor: pointer; transition: all 0.15s ease; letter-spacing: -0.01em;
}
.dash-copy-btn:hover { opacity: 0.9; }
.dash-copy-btn:active { transform: scale(0.99); }
.dash-copy-btn.copied { background: var(--green); color: #fff; }
.dash-copy-btn.outline { background: var(--bg-card); color: var(--text); border: 1.5px solid var(--border); }
.dash-copy-btn.outline:hover { background: var(--text); color: var(--bg); border-color: var(--text); }
.dash-copy-btn.outline.copied { background: var(--green); color: #fff; border-color: var(--green); }

.dash-hint { text-align: center; padding: 32px 0; font-size: 14px; color: var(--text-tertiary); }

.slide-up-enter-active { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-leave-active { transition: all 0.2s ease; }
.slide-up-enter-from { opacity: 0; transform: translateY(16px); }
.slide-up-leave-to { opacity: 0; transform: translateY(8px); }

/* ===== ALL CAPTIONS ===== */
.dash-captions-wrap { max-width: 720px; margin: 0 auto; padding: 28px 28px 48px; }
.dash-captions-header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 24px; }
.dash-captions-title { font-size: 24px; font-weight: 800; letter-spacing: -0.03em; }
.dash-captions-count { font-size: 13px; color: var(--text-tertiary); font-weight: 500; }
.dash-captions-list { display: flex; flex-direction: column; gap: 16px; }
.dash-caption-card {
  background: var(--bg-card); border-radius: var(--radius); padding: 24px;
  border: 1px solid var(--border); transition: all 0.2s ease;
}
.dash-caption-card:hover { box-shadow: var(--shadow-md); }
.dash-caption-meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.dash-caption-category { font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 100px; background: var(--amber-light); color: var(--amber-dark); text-transform: uppercase; letter-spacing: 0.04em; }
.dash-caption-platform { font-size: 12px; color: var(--text-tertiary); }
.dash-caption-text { font-size: 15px; line-height: 1.6; color: var(--text); margin-bottom: 12px; white-space: pre-line; }
.dash-caption-tags { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 12px; }
.dash-caption-image-row { display: flex; gap: 10px; background: var(--purple-light); border-radius: 12px; padding: 14px; margin-bottom: 16px; }
.dash-caption-image-icon { font-size: 16px; flex-shrink: 0; margin-top: 1px; }
.dash-caption-image-text { font-size: 13px; font-weight: 600; color: var(--purple); margin: 0 0 6px; }
.dash-caption-image-chips { display: flex; flex-wrap: wrap; gap: 4px; }

/* ===== FOOTER ===== */
.dash-footer { text-align: center; padding: 32px 20px; font-size: 12px; color: var(--text-tertiary); letter-spacing: 0.02em; }

/* ===== PRO BADGE ===== */
.dash-pro-badge {
  font-size: 9px; font-weight: 700; padding: 1px 5px; border-radius: 4px;
  background: linear-gradient(135deg, #f59e0b, #ef4444); color: white;
  margin-left: 4px; letter-spacing: 0.05em; vertical-align: super;
}

/* ===== BRAND VOICE SETTINGS ===== */
.dash-voice-wrap { max-width: 720px; margin: 0 auto; padding: 28px 28px 100px; }
.dash-voice-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 32px; gap: 16px; }
.dash-voice-title { font-size: 24px; font-weight: 800; letter-spacing: -0.03em; margin: 0 0 4px; }
.dash-voice-subtitle { font-size: 14px; color: var(--text-secondary); margin: 0; line-height: 1.5; }
.dash-voice-actions { display: flex; gap: 8px; flex-shrink: 0; }
.dash-voice-reset {
  padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600;
  background: var(--bg-card); color: var(--text-secondary); border: 1px solid var(--border);
  cursor: pointer; transition: all 0.15s;
}
.dash-voice-reset:hover { border-color: var(--text-tertiary); }
.dash-voice-save {
  padding: 8px 20px; border-radius: 8px; font-size: 13px; font-weight: 600;
  background: var(--text); color: var(--bg); border: none;
  cursor: pointer; transition: all 0.2s;
}
.dash-voice-save:hover { opacity: 0.9; }
.dash-voice-save.saved { background: #16a34a; color: white; }
.dash-voice-save.lg { width: 100%; padding: 14px; font-size: 15px; border-radius: 12px; }
.dash-voice-section { margin-bottom: 28px; }
.dash-voice-label { font-size: 14px; font-weight: 700; margin: 0 0 10px; letter-spacing: -0.01em; }
.dash-voice-hint { font-size: 12px; color: var(--text-tertiary); margin: -6px 0 10px; }

/* Tone cards */
.dash-voice-tone-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; }
.dash-voice-tone-card {
  display: flex; flex-direction: column; align-items: flex-start; gap: 4px;
  padding: 14px; border-radius: 12px; border: 1.5px solid var(--border);
  background: var(--bg-card); cursor: pointer; transition: all 0.15s; text-align: left;
}
.dash-voice-tone-card:hover { border-color: var(--text-tertiary); }
.dash-voice-tone-card.active { border-color: #f59e0b; background: #fffbeb; box-shadow: 0 0 0 3px rgba(245,158,11,0.15); }
.dash-root.dark .dash-voice-tone-card.active { background: rgba(245,158,11,0.1); border-color: #f59e0b; }
.dash-voice-tone-icon { font-size: 20px; }
.dash-voice-tone-label { font-size: 13px; font-weight: 700; }
.dash-voice-tone-desc { font-size: 11px; color: var(--text-tertiary); line-height: 1.3; }

/* Sliders */
.dash-voice-slider-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.dash-voice-slider-group { display: flex; flex-direction: column; }
.dash-voice-slider-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
.dash-voice-slider-value { font-size: 13px; font-weight: 600; color: #f59e0b; }
.dash-voice-slider-labels { display: flex; justify-content: space-between; font-size: 11px; color: var(--text-tertiary); margin-bottom: 6px; }
.dash-voice-range {
  -webkit-appearance: none; width: 100%; height: 6px; border-radius: 3px;
  background: var(--border); outline: none; cursor: pointer;
}
.dash-voice-range::-webkit-slider-thumb {
  -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%;
  background: #f59e0b; border: 3px solid white; box-shadow: 0 1px 4px rgba(0,0,0,0.15);
  cursor: pointer;
}
.dash-voice-range::-moz-range-thumb {
  width: 20px; height: 20px; border-radius: 50%;
  background: #f59e0b; border: 3px solid white; box-shadow: 0 1px 4px rgba(0,0,0,0.15);
  cursor: pointer;
}

/* Emoji options */
.dash-voice-emoji-row { display: flex; gap: 8px; flex-wrap: wrap; }
.dash-voice-emoji-btn {
  padding: 8px 18px; border-radius: 100px; font-size: 13px; font-weight: 600;
  background: var(--bg-card); color: var(--text-secondary); border: 1.5px solid var(--border);
  cursor: pointer; transition: all 0.15s;
}
.dash-voice-emoji-btn:hover { border-color: var(--text-tertiary); }
.dash-voice-emoji-btn.active { background: #fffbeb; color: #92400e; border-color: #f59e0b; }
.dash-root.dark .dash-voice-emoji-btn.active { background: rgba(245,158,11,0.1); color: #fbbf24; }

/* Keywords / avoid words */
.dash-voice-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.dash-voice-chip-input {
  background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 12px;
}
.dash-voice-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; min-height: 24px; }
.dash-voice-chip {
  display: inline-flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 600;
  padding: 4px 10px; border-radius: 100px; background: #fffbeb; color: #92400e; border: 1px solid #fde68a;
}
.dash-voice-chip.avoid { background: #fef2f2; color: #991b1b; border-color: #fecaca; }
.dash-root.dark .dash-voice-chip { background: rgba(245,158,11,0.1); color: #fbbf24; border-color: rgba(245,158,11,0.25); }
.dash-root.dark .dash-voice-chip.avoid { background: rgba(239,68,68,0.1); color: #fca5a5; border-color: rgba(239,68,68,0.25); }
.dash-voice-chip-x {
  background: none; border: none; font-size: 14px; cursor: pointer; color: inherit;
  opacity: 0.5; padding: 0 0 0 2px; line-height: 1;
}
.dash-voice-chip-x:hover { opacity: 1; }
.dash-voice-add-row { display: flex; gap: 6px; }
.dash-voice-input {
  flex: 1; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border);
  font-size: 13px; background: var(--bg); color: var(--text);
  outline: none; transition: border-color 0.15s;
}
.dash-voice-input:focus { border-color: #f59e0b; }
.dash-voice-add-btn {
  padding: 8px 14px; border-radius: 8px; font-size: 12px; font-weight: 600;
  background: var(--text); color: var(--bg); border: none; cursor: pointer;
  transition: opacity 0.15s;
}
.dash-voice-add-btn:hover { opacity: 0.85; }

/* Textarea */
.dash-voice-textarea {
  width: 100%; padding: 14px; border-radius: 12px; border: 1px solid var(--border);
  font-size: 14px; background: var(--bg-card); color: var(--text); resize: vertical;
  font-family: inherit; line-height: 1.6; outline: none; transition: border-color 0.15s;
  box-sizing: border-box;
}
.dash-voice-textarea:focus { border-color: #f59e0b; }
.dash-voice-textarea::placeholder { color: var(--text-tertiary); }

/* Save bar (mobile sticky) */
.dash-voice-save-bar {
  position: fixed; bottom: 0; left: 0; right: 0; padding: 16px 20px;
  background: var(--bg); border-top: 1px solid var(--border);
  display: none; z-index: 50;
}

/* ===== PRO GATE MODAL ===== */
.dash-pro-overlay {
  position: fixed; inset: 0; z-index: 100;
  background: rgba(0,0,0,0.5); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center; padding: 20px;
}
.dash-pro-modal {
  background: var(--bg-card); border-radius: 20px; padding: 36px; max-width: 420px;
  width: 100%; position: relative; text-align: center;
  box-shadow: 0 24px 48px rgba(0,0,0,0.15);
}
.dash-pro-close {
  position: absolute; top: 16px; right: 16px; background: none; border: none;
  font-size: 22px; color: var(--text-tertiary); cursor: pointer; line-height: 1;
}
.dash-pro-close:hover { color: var(--text); }
.dash-pro-icon { font-size: 40px; margin-bottom: 12px; }
.dash-pro-title { font-size: 20px; font-weight: 800; margin: 0 0 8px; letter-spacing: -0.02em; }
.dash-pro-desc { font-size: 14px; color: var(--text-secondary); line-height: 1.6; margin: 0 0 20px; }
.dash-pro-desc em { font-style: italic; color: var(--text); }
.dash-pro-features {
  text-align: left; margin: 0 0 24px; padding: 0; list-style: none;
  display: flex; flex-direction: column; gap: 8px;
}
.dash-pro-features li {
  font-size: 14px; font-weight: 500; padding-left: 24px; position: relative;
  color: var(--text);
}
.dash-pro-features li::before {
  content: '✓'; position: absolute; left: 0; color: #16a34a; font-weight: 700;
}
.dash-pro-unlock {
  width: 100%; padding: 14px; border-radius: 12px; font-size: 15px; font-weight: 700;
  background: linear-gradient(135deg, #f59e0b, #ef4444); color: white; border: none;
  cursor: pointer; transition: all 0.2s; letter-spacing: -0.01em;
}
.dash-pro-unlock:hover { opacity: 0.9; transform: translateY(-1px); }
.dash-pro-note { font-size: 12px; color: var(--text-tertiary); margin: 10px 0 0; }

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .dash-voice-header { flex-direction: column; }
  .dash-voice-slider-row { grid-template-columns: 1fr; }
  .dash-voice-two-col { grid-template-columns: 1fr; }
  .dash-voice-save-bar { display: block; }
  .dash-voice-actions .dash-voice-save { display: none; }
  .dash-nav-inner { padding: 0 16px; }
  .dash-tab { font-size: 12px; padding: 5px 10px; }
  .dash-welcome-inner { padding: 20px 0; }
  .dash-welcome-title { font-size: 18px; }
  .dash-stat { padding: 0 14px; }
  .dash-stat-num { font-size: 22px; }
  .dash-platforms { padding: 10px 16px; }
  .dash-platform-pill { padding: 7px 14px; font-size: 12px; }
  .dash-calendar-wrap { padding: 16px 16px 32px; }
  .dash-cal-toolbar { gap: 8px; }
  .dash-month-title { font-size: 18px; min-width: 160px; }
  .dash-cal-day-short { display: inline; }
  .dash-cal-day-full { display: none; }
  .dash-cal-date { font-size: 14px; width: 32px; height: 32px; }
  .dash-cal-dot { width: 4px; height: 4px; }
  .dash-week { grid-template-columns: repeat(2, 1fr); }
  .dash-week-card { min-height: 160px; }
  .dash-voice-badge { font-size: 12px; padding: 6px 12px; }
  .dash-detail-body { padding: 16px; }
  .dash-detail-caption { font-size: 14px; padding: 14px; }
  .dash-captions-wrap { padding: 16px 16px 32px; }
  .dash-caption-card { padding: 18px; }
  .dash-mockup-phone { width: 240px; }
}

@media (max-width: 480px) {
  .dash-tab-group { gap: 0; }
  .dash-tab { padding: 5px 8px; font-size: 11px; }
  .dash-welcome-inner { flex-direction: column; align-items: flex-start; }
  .dash-stats { margin-top: 4px; }
  .dash-stat { padding: 0 12px; }
  .dash-stat:first-child { padding-left: 0; }
  .dash-cal-date { font-size: 13px; width: 28px; height: 28px; }
  .dash-cal-dot { width: 4px; height: 4px; }
  .dash-platform-pill { padding: 6px 12px; font-size: 11px; }
  .dash-week { grid-template-columns: 1fr; }
  .dash-week-card { min-height: auto; }
  .dash-week-card-caption { -webkit-line-clamp: 3; }
  .dash-cal-toolbar { flex-direction: column; align-items: stretch; }
  .dash-month-nav { justify-content: space-between; }
  .dash-view-toggle { justify-content: center; }
  .dash-month-title { min-width: auto; font-size: 16px; }
  .dash-voice-badge { font-size: 11px; }
  .dash-mockup-phone { width: 100%; }
  .dash-export-btn { padding: 6px 12px; font-size: 12px; }
  .dash-holidays { padding: 6px 16px; }
  .dash-holiday-chip { font-size: 11px; padding: 3px 10px; }
}
</style>
