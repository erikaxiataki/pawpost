<template>
  <div ref="cardRef" class="tc" :class="`tc--${theme}`" :style="cardStyle">
    <div class="tc-card" :class="`tc-card--${theme}`">
      <!-- Header -->
      <div class="tc-header">
        <div class="tc-avatar" :style="{ background: avatarBg }">{{ avatarLetter }}</div>
        <div class="tc-user">
          <div class="tc-name-row">
            <span class="tc-name">{{ authorName }}</span>
            <svg v-if="verified" class="tc-verified" viewBox="0 0 24 24" width="18" height="18"><path fill="#1d9bf0" d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81C14.67 2.63 13.43 1.75 12 1.75S9.33 2.63 8.66 3.94c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91C2.63 9.33 1.75 10.57 1.75 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.09 4.5l-3.3-3.3 1.28-1.28 2.02 2.02 4.84-4.84 1.28 1.28-6.12 6.12z"/></svg>
          </div>
          <span class="tc-handle">@{{ handle }}</span>
        </div>
        <svg class="tc-x-logo" viewBox="0 0 24 24" width="22" height="22"><path :fill="theme === 'dark' ? '#fff' : '#0f1419'" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </div>

      <!-- Tweet text -->
      <p class="tc-text">{{ displayText }}</p>

      <!-- Timestamp -->
      <div class="tc-meta">
        <span>{{ timeStr }}</span>
        <span>·</span>
        <span class="tc-views">{{ viewCount }} Views</span>
      </div>

      <!-- Actions -->
      <div class="tc-actions">
        <div class="tc-action"><svg viewBox="0 0 24 24" width="18" height="18"><path :fill="actionColor" d="M1.751 10c-.036-4.979 3.997-9.025 8.976-8.999 2.86.014 5.402 1.387 7.023 3.599L19 3.5v4h-4l1.35-1.35C15.075 4.293 13.15 3.5 11 3.5 7.419 3.5 4.5 6.419 4.5 10s2.919 6.5 6.5 6.5c2.419 0 4.535-1.322 5.659-3.282l2.32 1.35C17.35 17.494 14.42 19 11 19c-4.979 0-9.012-4.046-8.999-9z"/></svg><span>{{ stat1 }}</span></div>
        <div class="tc-action"><svg viewBox="0 0 24 24" width="18" height="18"><path :fill="actionColor" d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.791-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.791 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"/></svg><span>{{ stat2 }}</span></div>
        <div class="tc-action tc-action--like"><svg viewBox="0 0 24 24" width="18" height="18"><path fill="#f91880" d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.45-4.85-.374-6.76 1.072-1.91 3.1-3.18 5.603-3.18 1.737 0 3.155.69 4.155 1.66 1-1 2.418-1.66 4.155-1.66 2.503 0 4.531 1.27 5.603 3.18 1.076 1.91.986 4.26-.374 6.76z"/></svg><span>{{ stat3 }}</span></div>
        <div class="tc-action"><svg viewBox="0 0 24 24" width="18" height="18"><path :fill="actionColor" d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"/></svg></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  text: { type: String, default: 'Your caption will appear here as a tweet card.' },
  authorName: { type: String, default: 'Your Business' },
  handle: { type: String, default: 'yourbusiness' },
  verified: { type: Boolean, default: true },
  theme: { type: String, default: 'dark' }, // dark, light
  aspectRatio: { type: String, default: '1:1' },
})

const cardRef = ref(null)
defineExpose({ cardRef })

const sizes = { '1:1': { w: 1080, h: 1080 }, '4:5': { w: 1080, h: 1350 }, '9:16': { w: 1080, h: 1920 } }
const size = computed(() => sizes[props.aspectRatio] || sizes['1:1'])

const cardStyle = computed(() => ({
  width: size.value.w + 'px',
  height: size.value.h + 'px',
}))

const avatarLetter = computed(() => props.authorName?.[0]?.toUpperCase() || '🐾')
const avatarBg = computed(() => props.theme === 'dark' ? '#f59e0b' : '#f59e0b')
const actionColor = computed(() => props.theme === 'dark' ? '#71767b' : '#536471')

const displayText = computed(() => {
  const max = 280
  return props.text.length > max ? props.text.substring(0, max - 3) + '...' : props.text
})

const timeStr = computed(() => {
  const d = new Date()
  const h = d.getHours() % 12 || 12
  const ampm = d.getHours() >= 12 ? 'PM' : 'AM'
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${h}:${String(d.getMinutes()).padStart(2,'0')} ${ampm} · ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
})

function genStat(base) {
  const n = Math.floor(Math.random() * base + base / 2)
  return n >= 1000 ? (n / 1000).toFixed(1) + 'K' : String(n)
}

// Generate stats once so they don't change on re-render
const viewCount = ref((() => {
  const n = Math.floor(Math.random() * 50 + 10) * 100
  return n >= 1000 ? (n / 1000).toFixed(1) + 'K' : n.toLocaleString()
})())
const stat1 = ref(genStat(12))
const stat2 = ref(genStat(5))
const stat3 = ref(genStat(40))
</script>

<style scoped>
.tc { display: flex; align-items: center; justify-content: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; height: 100%; box-sizing: border-box; }
.tc--dark { background: #000; }
.tc--light { background: #f7f9fa; }

.tc-card { width: 85%; max-width: 700px; padding: 48px; border-radius: 24px; }
.tc-card--dark { background: #16181c; color: #e7e9ea; }
.tc-card--light { background: #ffffff; color: #0f1419; border: 1px solid #eff3f4; }

.tc-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
.tc-avatar { width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 700; color: #fff; flex-shrink: 0; }
.tc-user { flex: 1; }
.tc-name-row { display: flex; align-items: center; gap: 4px; }
.tc-name { font-size: 20px; font-weight: 700; }
.tc-handle { font-size: 17px; opacity: 0.6; }
.tc-x-logo { opacity: 0.5; }

.tc-text { font-size: 28px; line-height: 1.5; margin-bottom: 24px; word-wrap: break-word; }

.tc-meta { display: flex; gap: 6px; font-size: 16px; opacity: 0.5; padding-bottom: 20px; border-bottom: 1px solid rgba(128,128,128,0.2); margin-bottom: 16px; }
.tc-views { font-weight: 600; }

.tc-actions { display: flex; justify-content: space-between; padding: 0 20px; }
.tc-action { display: flex; align-items: center; gap: 6px; font-size: 16px; opacity: 0.7; }
.tc-action--like { opacity: 1; color: #f91880; }
</style>
