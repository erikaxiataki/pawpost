<template>
  <div ref="cardRef" class="qc" :class="`qc--${style}`" :style="cardStyle">
    <!-- Background pattern -->
    <div class="qc-pattern" :style="patternStyle"></div>

    <!-- Decorative accent -->
    <div v-if="style === 'elegant'" class="qc-corner-accent" :style="{ borderColor: accentColor }"></div>
    <div v-if="style === 'bold'" class="qc-bold-bar" :style="{ background: accentColor }"></div>
    <div v-if="style === 'gradient'" class="qc-gradient-bg" :style="{ background: `linear-gradient(135deg, ${bgColor}, ${accentColor}cc)` }"></div>

    <!-- Top section -->
    <div class="qc-top">
      <div class="qc-brand-row">
        <div class="qc-brand-icon" :style="{ background: accentColor }">🐾</div>
        <span class="qc-brand-name" :style="{ color: computedTextColor }">{{ author }}</span>
      </div>
      <div class="qc-quote-icon" :style="{ color: accentColor }">"</div>
    </div>

    <!-- Main quote -->
    <div class="qc-body">
      <p class="qc-text" :style="{ color: computedTextColor, fontSize }">
        {{ displayQuote }}
      </p>
    </div>

    <!-- Bottom section -->
    <div class="qc-bottom">
      <div class="qc-divider" :style="{ background: accentColor }"></div>
      <p v-if="hashtags" class="qc-hashtags" :style="{ color: accentColor }">{{ displayHashtags }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  quote: { type: String, default: 'Your caption text will appear here as a beautiful quote card.' },
  author: { type: String, default: 'Your Business' },
  hashtags: { type: String, default: '' },
  bgColor: { type: String, default: '#1a1a2e' },
  textColor: { type: String, default: '' },
  accentColor: { type: String, default: '#f59e0b' },
  style: { type: String, default: 'minimal' },
  aspectRatio: { type: String, default: '1:1' },
})

const cardRef = ref(null)
defineExpose({ cardRef })

const sizes = { '1:1': { w: 1080, h: 1080 }, '4:5': { w: 1080, h: 1350 }, '9:16': { w: 1080, h: 1920 } }
const size = computed(() => sizes[props.aspectRatio] || sizes['1:1'])

function getLuminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return 0.299 * r + 0.587 * g + 0.114 * b
}

const computedTextColor = computed(() => {
  if (props.textColor) return props.textColor
  return getLuminance(props.bgColor) < 0.5 ? '#ffffff' : '#1a1a1a'
})

const cardStyle = computed(() => ({
  width: size.value.w + 'px',
  height: size.value.h + 'px',
  background: props.style === 'gradient' ? 'transparent' : props.style === 'bold' ? '#0a0a0a' : props.bgColor,
}))

const patternStyle = computed(() => {
  const c = computedTextColor.value === '#ffffff' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'
  return { backgroundImage: `radial-gradient(${c} 1px, transparent 1px)`, backgroundSize: '24px 24px' }
})

const displayQuote = computed(() => {
  const max = props.aspectRatio === '1:1' ? 200 : props.aspectRatio === '9:16' ? 350 : 280
  return props.quote.length > max ? props.quote.substring(0, max - 3) + '...' : props.quote
})

const displayHashtags = computed(() => {
  const tags = props.hashtags.split(' ').slice(0, 4).join(' ')
  return tags.length > 60 ? tags.substring(0, 57) + '...' : tags
})

const fontSize = computed(() => {
  const len = displayQuote.value.length
  if (len < 60) return '56px'
  if (len < 100) return '46px'
  if (len < 160) return '38px'
  if (len < 250) return '30px'
  return '26px'
})
</script>

<style scoped>
.qc {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 72px 80px;
  box-sizing: border-box;
  overflow: hidden;
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
}
.qc-pattern { position: absolute; inset: 0; pointer-events: none; }

/* Top */
.qc-top { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.qc-brand-row { display: flex; align-items: center; gap: 14px; }
.qc-brand-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
.qc-brand-name { font-size: 22px; font-weight: 700; letter-spacing: -0.01em; }
.qc-quote-icon { font-size: 100px; font-family: Georgia, serif; line-height: 0.7; opacity: 0.8; margin-top: -10px; }

/* Body */
.qc-body { flex: 1; display: flex; align-items: center; justify-content: center; padding: 20px 0; }
.qc-text { text-align: center; line-height: 1.45; font-weight: 700; word-wrap: break-word; letter-spacing: -0.02em; }
.qc--elegant .qc-text { font-family: Georgia, 'Times New Roman', serif; font-style: italic; font-weight: 500; line-height: 1.55; }
.qc--bold .qc-text { text-transform: uppercase; letter-spacing: 0.03em; line-height: 1.3; font-weight: 900; }
.qc--gradient .qc-text { font-weight: 600; }

/* Bottom */
.qc-bottom { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.qc-divider { width: 60px; height: 4px; border-radius: 2px; }
.qc-hashtags { font-size: 18px; font-weight: 600; opacity: 0.85; letter-spacing: 0.01em; }

/* Style-specific decorations */
.qc-corner-accent { position: absolute; top: 0; right: 0; width: 200px; height: 200px; border-bottom: 4px solid; border-left: 4px solid; border-bottom-left-radius: 60px; opacity: 0.15; }
.qc-bold-bar { position: absolute; left: 0; top: 0; bottom: 0; width: 10px; }
.qc-gradient-bg { position: absolute; inset: 0; z-index: -1; }
</style>
