<script setup>
import { ref, computed, watch } from 'vue'
import { toPng } from 'html-to-image'

const props = defineProps({
  caption: { type: Object, required: true },
  profile: { type: Object, default: () => ({}) },
  brandVoice: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['close'])

const slideRefs = ref([])
const downloading = ref(false)
const downloadProgress = ref(0)
const selectedStyle = ref('bold')

const styles = [
  { id: 'bold', label: 'Bold', bg: '#1C1917', text: '#FFFBF5', accent: '#D97706' },
  { id: 'warm', label: 'Warm', bg: '#FFFBF5', text: '#1C1917', accent: '#D97706' },
  { id: 'ocean', label: 'Ocean', bg: '#0c4a6e', text: '#f0f9ff', accent: '#38bdf8' },
  { id: 'forest', label: 'Forest', bg: '#14532d', text: '#f0fdf4', accent: '#4ade80' },
  { id: 'berry', label: 'Berry', bg: '#4a044e', text: '#fdf4ff', accent: '#e879f9' },
  { id: 'sunset', label: 'Sunset', bg: '#7c2d12', text: '#fff7ed', accent: '#fb923c' },
]

const currentStyle = computed(() => styles.find(s => s.id === selectedStyle.value) || styles[0])

const businessName = computed(() => props.profile?.businessName || 'Your Pet Business')

// Split caption into carousel slides
const slides = computed(() => {
  const text = props.caption?.text || ''
  if (!text) return []

  const lines = text.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'))
  const result = []

  // Slide 1: Hook (first line, big and bold)
  const hook = lines[0] || 'Did you know?'
  result.push({ type: 'hook', content: hook })

  // Middle slides: extract key points from remaining text
  const body = lines.slice(1).join(' ')
  const points = extractPoints(body)

  if (points.length <= 3) {
    // Few points: one per slide
    points.forEach(p => result.push({ type: 'point', content: p }))
  } else {
    // Many points: group into slides of 2-3
    for (let i = 0; i < points.length; i += 2) {
      const group = points.slice(i, i + 2)
      result.push({ type: 'points', content: group })
    }
  }

  // Cap at 4 content slides
  while (result.length > 5) result.pop()

  // Final slide: CTA
  const cta = props.caption?.engagementHook?.prompt || 'Follow for more pet tips!'
  result.push({ type: 'cta', content: cta })

  return result
})

function extractPoints(text) {
  // Try splitting on sentence boundaries
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
  return sentences
    .map(s => s.trim())
    .filter(s => s.length > 10 && s.length < 200)
    .slice(0, 6)
}

function setSlideRef(el, index) {
  if (el) slideRefs.value[index] = el
}

async function downloadAll() {
  downloading.value = true
  downloadProgress.value = 0

  for (let i = 0; i < slides.value.length; i++) {
    const el = slideRefs.value[i]
    if (!el) continue
    try {
      const dataUrl = await toPng(el, {
        width: 1080,
        height: 1080,
        pixelRatio: 1,
        style: { transform: 'scale(1)', transformOrigin: 'top left' },
      })
      const link = document.createElement('a')
      link.download = `carousel-slide-${i + 1}.png`
      link.href = dataUrl
      link.click()
      downloadProgress.value = Math.round(((i + 1) / slides.value.length) * 100)
      // Small delay between downloads
      await new Promise(r => setTimeout(r, 300))
    } catch (err) {
      console.error(`Failed to export slide ${i + 1}:`, err)
    }
  }

  downloading.value = false
}

async function downloadSlide(index) {
  const el = slideRefs.value[index]
  if (!el) return
  try {
    const dataUrl = await toPng(el, {
      width: 1080,
      height: 1080,
      pixelRatio: 1,
      style: { transform: 'scale(1)', transformOrigin: 'top left' },
    })
    const link = document.createElement('a')
    link.download = `carousel-slide-${index + 1}.png`
    link.href = dataUrl
    link.click()
  } catch (err) {
    console.error('Failed to export slide:', err)
  }
}
</script>

<template>
  <div class="cg-root">
    <div class="cg-header">
      <div class="cg-title">
        <span class="cg-icon">🎠</span>
        <span>Carousel Generator</span>
        <span class="cg-count">{{ slides.length }} slides</span>
      </div>
      <button class="cg-close" @click="emit('close')">&times;</button>
    </div>

    <!-- Style picker -->
    <div class="cg-styles">
      <button
        v-for="s in styles" :key="s.id"
        :class="['cg-style-btn', selectedStyle === s.id && 'active']"
        @click="selectedStyle = s.id"
      >
        <span class="cg-style-dot" :style="{ background: s.bg, border: `2px solid ${s.accent}` }"></span>
        {{ s.label }}
      </button>
    </div>

    <!-- Slides preview -->
    <div class="cg-slides-scroll">
      <div class="cg-slides">
        <div v-for="(slide, i) in slides" :key="i" class="cg-slide-wrap">
          <div class="cg-slide-num">{{ i + 1 }}/{{ slides.length }}</div>
          <div
            :ref="el => setSlideRef(el, i)"
            class="cg-slide"
            :style="{
              background: currentStyle.bg,
              color: currentStyle.text,
            }"
          >
            <!-- Decorative accent bar -->
            <div class="cg-slide-accent" :style="{ background: currentStyle.accent }"></div>

            <!-- Hook slide -->
            <template v-if="slide.type === 'hook'">
              <div class="cg-slide-body cg-slide-hook">
                <div class="cg-hook-text">{{ slide.content }}</div>
                <div class="cg-swipe" :style="{ color: currentStyle.accent }">Swipe →</div>
              </div>
            </template>

            <!-- Single point slide -->
            <template v-else-if="slide.type === 'point'">
              <div class="cg-slide-body cg-slide-point">
                <div class="cg-point-num" :style="{ color: currentStyle.accent }">{{ String(i).padStart(2, '0') }}</div>
                <div class="cg-point-text">{{ slide.content }}</div>
              </div>
            </template>

            <!-- Multiple points slide -->
            <template v-else-if="slide.type === 'points'">
              <div class="cg-slide-body cg-slide-points">
                <div v-for="(p, pi) in slide.content" :key="pi" class="cg-point-row">
                  <span class="cg-bullet" :style="{ background: currentStyle.accent }"></span>
                  <span>{{ p }}</span>
                </div>
              </div>
            </template>

            <!-- CTA slide -->
            <template v-else-if="slide.type === 'cta'">
              <div class="cg-slide-body cg-slide-cta">
                <div class="cg-cta-text">{{ slide.content }}</div>
                <div class="cg-cta-biz" :style="{ color: currentStyle.accent }">@{{ businessName }}</div>
                <div class="cg-cta-follow" :style="{ borderColor: currentStyle.accent, color: currentStyle.accent }">Follow for more</div>
              </div>
            </template>

            <!-- Business watermark -->
            <div class="cg-watermark" :style="{ color: currentStyle.text + '40' }">{{ businessName }}</div>
          </div>
          <button class="cg-dl-one" @click="downloadSlide(i)" title="Download this slide">⬇</button>
        </div>
      </div>
    </div>

    <!-- Download all -->
    <div class="cg-actions">
      <button class="cg-download-all" @click="downloadAll" :disabled="downloading">
        <template v-if="downloading">Downloading... {{ downloadProgress }}%</template>
        <template v-else>⬇ Download All Slides (1080x1080)</template>
      </button>
    </div>
  </div>
</template>

<style scoped>
.cg-root {
  background: var(--bg-card, #fff);
  border-radius: 16px;
  border: 1px solid var(--border, rgba(0,0,0,0.05));
  overflow: hidden;
}

.cg-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border, rgba(0,0,0,0.05));
}

.cg-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 15px;
  color: var(--text, #18181b);
}

.cg-icon { font-size: 20px; }

.cg-count {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary, #71717a);
  background: var(--amber-light, #fffbeb);
  padding: 2px 8px;
  border-radius: 99px;
}

.cg-close {
  background: none;
  border: none;
  font-size: 22px;
  color: var(--text-secondary, #71717a);
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
}
.cg-close:hover { background: var(--border, rgba(0,0,0,0.05)); }

.cg-styles {
  display: flex;
  gap: 6px;
  padding: 12px 20px;
  overflow-x: auto;
}

.cg-style-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 99px;
  border: 1px solid var(--border, rgba(0,0,0,0.08));
  background: var(--bg, #fafafa);
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary, #71717a);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
}
.cg-style-btn.active {
  border-color: var(--amber, #f59e0b);
  background: var(--amber-light, #fffbeb);
  color: var(--amber-dark, #92400e);
}

.cg-style-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  flex-shrink: 0;
}

.cg-slides-scroll {
  overflow-x: auto;
  padding: 8px 20px 16px;
  -webkit-overflow-scrolling: touch;
}

.cg-slides {
  display: flex;
  gap: 12px;
}

.cg-slide-wrap {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.cg-slide-num {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-tertiary, #a1a1aa);
}

/* The actual slide — 1080x1080 scaled down for preview */
.cg-slide {
  width: 1080px;
  height: 1080px;
  transform: scale(0.222);
  transform-origin: top left;
  border-radius: 0;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  font-family: 'DM Sans', 'Inter', -apple-system, sans-serif;
}

.cg-slide-wrap {
  width: 240px;
  height: 260px;
  overflow: hidden;
}

.cg-slide-accent {
  height: 8px;
  width: 100%;
  flex-shrink: 0;
}

.cg-slide-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 80px 72px;
}

/* Hook slide */
.cg-slide-hook .cg-hook-text {
  font-size: 72px;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -1px;
}

.cg-swipe {
  margin-top: 48px;
  font-size: 32px;
  font-weight: 600;
  opacity: 0.8;
}

/* Single point */
.cg-slide-point .cg-point-num {
  font-size: 96px;
  font-weight: 900;
  opacity: 0.3;
  line-height: 1;
  margin-bottom: 16px;
}

.cg-slide-point .cg-point-text {
  font-size: 48px;
  font-weight: 600;
  line-height: 1.3;
}

/* Multiple points */
.cg-slide-points .cg-point-row {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 32px;
  font-size: 42px;
  font-weight: 500;
  line-height: 1.35;
}

.cg-bullet {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 16px;
}

/* CTA slide */
.cg-slide-cta {
  align-items: center;
  text-align: center;
}

.cg-cta-text {
  font-size: 52px;
  font-weight: 700;
  line-height: 1.25;
  margin-bottom: 48px;
}

.cg-cta-biz {
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 32px;
}

.cg-cta-follow {
  font-size: 28px;
  font-weight: 600;
  border: 3px solid;
  padding: 16px 48px;
  border-radius: 99px;
}

/* Watermark */
.cg-watermark {
  position: absolute;
  bottom: 24px;
  right: 32px;
  font-size: 20px;
  font-weight: 500;
}

.cg-dl-one {
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 6px;
  color: var(--text-tertiary, #a1a1aa);
}
.cg-dl-one:hover { background: var(--border, rgba(0,0,0,0.05)); }

.cg-actions {
  padding: 12px 20px 16px;
  border-top: 1px solid var(--border, rgba(0,0,0,0.05));
}

.cg-download-all {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: none;
  background: var(--amber, #f59e0b);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s;
}
.cg-download-all:hover { opacity: 0.9; }
.cg-download-all:disabled { opacity: 0.5; cursor: wait; }
</style>
