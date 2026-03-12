<script setup>
import { ref, computed } from 'vue'
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
const selectedTemplate = ref('carousel')
const selectedStyle = ref('bold')

// --- Templates ---
const templates = [
  { id: 'carousel', label: 'Carousel', icon: '🎠', desc: 'Bold slides with hook + points + CTA' },
  { id: 'paper', label: 'Paper Quote', icon: '📝', desc: 'Paper texture with highlighter effect' },
  { id: 'mono', label: 'Mono Quote', icon: '🎨', desc: 'Clean solid color, text-only' },
]

// --- Color themes per template ---
const carouselStyles = [
  { id: 'bold', label: 'Bold', bg: '#1C1917', text: '#FFFBF5', accent: '#D97706' },
  { id: 'warm', label: 'Warm', bg: '#FFFBF5', text: '#1C1917', accent: '#D97706' },
  { id: 'ocean', label: 'Ocean', bg: '#0c4a6e', text: '#f0f9ff', accent: '#38bdf8' },
  { id: 'forest', label: 'Forest', bg: '#14532d', text: '#f0fdf4', accent: '#4ade80' },
  { id: 'berry', label: 'Berry', bg: '#4a044e', text: '#fdf4ff', accent: '#e879f9' },
  { id: 'sunset', label: 'Sunset', bg: '#7c2d12', text: '#fff7ed', accent: '#fb923c' },
]

const paperStyles = [
  { id: 'yellow', label: 'Yellow', bg: '#fef9ef', text: '#292524', accent: '#facc15', highlight: '#facc1555', lineColor: '#e7e0d5' },
  { id: 'pink', label: 'Pink', bg: '#fef2f2', text: '#292524', accent: '#fb7185', highlight: '#fb718544', lineColor: '#f0d4d4' },
  { id: 'green', label: 'Mint', bg: '#f0fdf4', text: '#292524', accent: '#4ade80', highlight: '#4ade8044', lineColor: '#c6e8d0' },
  { id: 'blue', label: 'Sky', bg: '#f0f9ff', text: '#292524', accent: '#38bdf8', highlight: '#38bdf844', lineColor: '#c4dff0' },
  { id: 'purple', label: 'Lavender', bg: '#faf5ff', text: '#292524', accent: '#a78bfa', highlight: '#a78bfa44', lineColor: '#ddd0f0' },
  { id: 'peach', label: 'Peach', bg: '#fff7ed', text: '#292524', accent: '#fb923c', highlight: '#fb923c44', lineColor: '#f0dcc8' },
]

const monoStyles = [
  { id: 'cream', label: 'Cream', bg: '#FFFBF5', text: '#1C1917', accent: '#D97706' },
  { id: 'charcoal', label: 'Charcoal', bg: '#27272a', text: '#fafafa', accent: '#f59e0b' },
  { id: 'sage', label: 'Sage', bg: '#d1d9ce', text: '#1a2e1a', accent: '#3f6b3f' },
  { id: 'blush', label: 'Blush', bg: '#f5e6e0', text: '#3b1f1f', accent: '#b4544a' },
  { id: 'navy', label: 'Navy', bg: '#1e293b', text: '#e2e8f0', accent: '#93c5fd' },
  { id: 'terracotta', label: 'Terra', bg: '#e8d5c4', text: '#44281a', accent: '#a0522d' },
]

const activeStyles = computed(() => {
  if (selectedTemplate.value === 'paper') return paperStyles
  if (selectedTemplate.value === 'mono') return monoStyles
  return carouselStyles
})

const currentStyle = computed(() => {
  const list = activeStyles.value
  return list.find(s => s.id === selectedStyle.value) || list[0]
})

const businessName = computed(() => props.profile?.businessName || 'Your Pet Business')

// --- Slide generation ---
const slides = computed(() => {
  const text = props.caption?.text || ''
  if (!text) return []

  const lines = text.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'))

  if (selectedTemplate.value === 'paper' || selectedTemplate.value === 'mono') {
    return buildQuoteSlides(lines)
  }
  return buildCarouselSlides(lines)
})

function buildCarouselSlides(lines) {
  const result = []
  const hook = lines[0] || 'Did you know?'
  result.push({ type: 'hook', content: hook })

  const body = lines.slice(1).join(' ')
  const points = extractPoints(body)

  if (points.length <= 3) {
    points.forEach(p => result.push({ type: 'point', content: p }))
  } else {
    for (let i = 0; i < points.length; i += 2) {
      result.push({ type: 'points', content: points.slice(i, i + 2) })
    }
  }

  while (result.length > 5) result.pop()

  const cta = props.caption?.engagementHook?.prompt || 'Follow for more pet tips!'
  result.push({ type: 'cta', content: cta })
  return result
}

function buildQuoteSlides(lines) {
  const result = []

  // Slide 1: Title/hook card
  result.push({ type: 'quote-title', content: lines[0] || 'Pet Tips' })

  // Middle slides: one quote/tip per card
  const body = lines.slice(1).join(' ')
  const points = extractPoints(body)
  points.slice(0, 5).forEach((p, i) => {
    result.push({ type: 'quote', content: p, num: i + 1 })
  })

  // CTA card
  const cta = props.caption?.engagementHook?.prompt || 'Follow for more pet tips!'
  result.push({ type: 'quote-cta', content: cta })
  return result
}

function extractPoints(text) {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
  return sentences
    .map(s => s.trim())
    .filter(s => s.length > 10 && s.length < 200)
    .slice(0, 6)
}

// Find key phrase to highlight (longest phrase between 3-8 words)
function getHighlight(text) {
  const sentences = text.split(/[,;:]/).map(s => s.trim())
  const best = sentences
    .filter(s => { const w = s.split(/\s+/).length; return w >= 2 && w <= 10 })
    .sort((a, b) => b.length - a.length)[0]
  return best || ''
}

function highlightText(text) {
  const phrase = getHighlight(text)
  if (!phrase) return [{ text, highlighted: false }]
  const idx = text.indexOf(phrase)
  if (idx === -1) return [{ text, highlighted: false }]
  const parts = []
  if (idx > 0) parts.push({ text: text.slice(0, idx), highlighted: false })
  parts.push({ text: phrase, highlighted: true })
  if (idx + phrase.length < text.length) parts.push({ text: text.slice(idx + phrase.length), highlighted: false })
  return parts
}

// --- Download ---
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
        width: 1080, height: 1080, pixelRatio: 1,
        style: { transform: 'scale(1)', transformOrigin: 'top left' },
      })
      const link = document.createElement('a')
      link.download = `${selectedTemplate.value}-slide-${i + 1}.png`
      link.href = dataUrl
      link.click()
      downloadProgress.value = Math.round(((i + 1) / slides.value.length) * 100)
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
      width: 1080, height: 1080, pixelRatio: 1,
      style: { transform: 'scale(1)', transformOrigin: 'top left' },
    })
    const link = document.createElement('a')
    link.download = `${selectedTemplate.value}-slide-${index + 1}.png`
    link.href = dataUrl
    link.click()
  } catch (err) {
    console.error('Failed to export slide:', err)
  }
}

// Reset style when switching templates
function switchTemplate(id) {
  selectedTemplate.value = id
  const list = id === 'paper' ? paperStyles : id === 'mono' ? monoStyles : carouselStyles
  selectedStyle.value = list[0].id
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

    <!-- Template picker -->
    <div class="cg-templates">
      <button
        v-for="t in templates" :key="t.id"
        :class="['cg-tpl-btn', selectedTemplate === t.id && 'active']"
        @click="switchTemplate(t.id)"
      >
        <span class="cg-tpl-icon">{{ t.icon }}</span>
        <span class="cg-tpl-info">
          <span class="cg-tpl-label">{{ t.label }}</span>
          <span class="cg-tpl-desc">{{ t.desc }}</span>
        </span>
      </button>
    </div>

    <!-- Style picker -->
    <div class="cg-styles">
      <button
        v-for="s in activeStyles" :key="s.id"
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
        <div v-for="(slide, i) in slides" :key="i + selectedTemplate + selectedStyle" class="cg-slide-wrap">
          <div class="cg-slide-num">{{ i + 1 }}/{{ slides.length }}</div>

          <!-- ========== CAROUSEL TEMPLATE ========== -->
          <div
            v-if="selectedTemplate === 'carousel'"
            :ref="el => setSlideRef(el, i)"
            class="cg-slide"
            :style="{ background: currentStyle.bg, color: currentStyle.text }"
          >
            <div class="cg-slide-accent" :style="{ background: currentStyle.accent }"></div>

            <template v-if="slide.type === 'hook'">
              <div class="cg-slide-body cg-slide-hook">
                <div class="cg-hook-text">{{ slide.content }}</div>
                <div class="cg-swipe" :style="{ color: currentStyle.accent }">Swipe &rarr;</div>
              </div>
            </template>

            <template v-else-if="slide.type === 'point'">
              <div class="cg-slide-body cg-slide-point">
                <div class="cg-point-num" :style="{ color: currentStyle.accent }">{{ String(i).padStart(2, '0') }}</div>
                <div class="cg-point-text">{{ slide.content }}</div>
              </div>
            </template>

            <template v-else-if="slide.type === 'points'">
              <div class="cg-slide-body cg-slide-points">
                <div v-for="(p, pi) in slide.content" :key="pi" class="cg-point-row">
                  <span class="cg-bullet" :style="{ background: currentStyle.accent }"></span>
                  <span>{{ p }}</span>
                </div>
              </div>
            </template>

            <template v-else-if="slide.type === 'cta'">
              <div class="cg-slide-body cg-slide-cta">
                <div class="cg-cta-text">{{ slide.content }}</div>
                <div class="cg-cta-biz" :style="{ color: currentStyle.accent }">@{{ businessName }}</div>
                <div class="cg-cta-follow" :style="{ borderColor: currentStyle.accent, color: currentStyle.accent }">Follow for more</div>
              </div>
            </template>

            <div class="cg-watermark" :style="{ color: currentStyle.text + '40' }">{{ businessName }}</div>
          </div>

          <!-- ========== PAPER QUOTE TEMPLATE ========== -->
          <div
            v-else-if="selectedTemplate === 'paper'"
            :ref="el => setSlideRef(el, i)"
            class="cg-slide cg-paper"
            :style="{ background: currentStyle.bg, color: currentStyle.text }"
          >
            <!-- Paper texture lines -->
            <div class="cg-paper-lines">
              <div v-for="n in 20" :key="n" class="cg-paper-line" :style="{ borderColor: currentStyle.lineColor }"></div>
            </div>
            <!-- Left margin line -->
            <div class="cg-paper-margin" :style="{ borderColor: currentStyle.accent + '55' }"></div>
            <!-- Spiral holes -->
            <div class="cg-paper-holes">
              <div v-for="n in 5" :key="n" class="cg-paper-hole"></div>
            </div>

            <!-- Title card -->
            <template v-if="slide.type === 'quote-title'">
              <div class="cg-paper-body cg-paper-title">
                <div class="cg-paper-title-text">
                  <span v-for="(part, pi) in highlightText(slide.content)" :key="pi"
                    :class="part.highlighted && 'cg-highlight'"
                    :style="part.highlighted ? { background: currentStyle.highlight, borderBottom: `4px solid ${currentStyle.accent}` } : {}">{{ part.text }}</span>
                </div>
                <div class="cg-paper-swipe" :style="{ color: currentStyle.accent }">Swipe for tips &rarr;</div>
              </div>
            </template>

            <!-- Quote card -->
            <template v-else-if="slide.type === 'quote'">
              <div class="cg-paper-body cg-paper-quote">
                <div class="cg-paper-num" :style="{ color: currentStyle.accent }">{{ slide.num }}</div>
                <div class="cg-paper-quote-text">
                  <span v-for="(part, pi) in highlightText(slide.content)" :key="pi"
                    :class="part.highlighted && 'cg-highlight'"
                    :style="part.highlighted ? { background: currentStyle.highlight, borderBottom: `4px solid ${currentStyle.accent}` } : {}">{{ part.text }}</span>
                </div>
              </div>
            </template>

            <!-- CTA card -->
            <template v-else-if="slide.type === 'quote-cta'">
              <div class="cg-paper-body cg-paper-cta">
                <div class="cg-paper-cta-text" :style="{ color: currentStyle.accent }">{{ slide.content }}</div>
                <div class="cg-paper-cta-biz">@{{ businessName }}</div>
                <div class="cg-paper-cta-btn" :style="{ background: currentStyle.accent, color: currentStyle.bg }">Follow</div>
              </div>
            </template>

            <div class="cg-watermark" :style="{ color: currentStyle.text + '30' }">{{ businessName }}</div>
          </div>

          <!-- ========== MONO QUOTE TEMPLATE ========== -->
          <div
            v-else-if="selectedTemplate === 'mono'"
            :ref="el => setSlideRef(el, i)"
            class="cg-slide cg-mono"
            :style="{ background: currentStyle.bg, color: currentStyle.text }"
          >
            <!-- Subtle corner accent -->
            <div class="cg-mono-corner-tl" :style="{ borderColor: currentStyle.accent }"></div>
            <div class="cg-mono-corner-br" :style="{ borderColor: currentStyle.accent }"></div>

            <!-- Title card -->
            <template v-if="slide.type === 'quote-title'">
              <div class="cg-mono-body cg-mono-title">
                <div class="cg-mono-dash" :style="{ background: currentStyle.accent }"></div>
                <div class="cg-mono-title-text">{{ slide.content }}</div>
                <div class="cg-mono-dash" :style="{ background: currentStyle.accent }"></div>
                <div class="cg-mono-swipe" :style="{ color: currentStyle.accent }">Swipe &rarr;</div>
              </div>
            </template>

            <!-- Quote card -->
            <template v-else-if="slide.type === 'quote'">
              <div class="cg-mono-body cg-mono-quote">
                <div class="cg-mono-quotemark" :style="{ color: currentStyle.accent }">&ldquo;</div>
                <div class="cg-mono-quote-text">{{ slide.content }}</div>
                <div class="cg-mono-num" :style="{ color: currentStyle.accent }">{{ slide.num }}</div>
              </div>
            </template>

            <!-- CTA card -->
            <template v-else-if="slide.type === 'quote-cta'">
              <div class="cg-mono-body cg-mono-cta">
                <div class="cg-mono-cta-text">{{ slide.content }}</div>
                <div class="cg-mono-cta-line" :style="{ background: currentStyle.accent }"></div>
                <div class="cg-mono-cta-biz" :style="{ color: currentStyle.accent }">@{{ businessName }}</div>
              </div>
            </template>

            <div class="cg-watermark" :style="{ color: currentStyle.text + '25' }">{{ businessName }}</div>
          </div>

          <button class="cg-dl-one" @click="downloadSlide(i)" title="Download this slide">&#11015;</button>
        </div>
      </div>
    </div>

    <!-- Download all -->
    <div class="cg-actions">
      <button class="cg-download-all" @click="downloadAll" :disabled="downloading">
        <template v-if="downloading">Downloading... {{ downloadProgress }}%</template>
        <template v-else>&#11015; Download All Slides (1080x1080)</template>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* ===== Layout ===== */
.cg-root {
  background: var(--bg-card, #fff);
  border-radius: 16px;
  border: 1px solid var(--border, rgba(0,0,0,0.05));
  overflow: hidden;
  margin-top: 12px;
}
.cg-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border, rgba(0,0,0,0.05));
}
.cg-title {
  display: flex; align-items: center; gap: 8px;
  font-weight: 700; font-size: 15px;
  color: var(--text, #18181b);
}
.cg-icon { font-size: 20px; }
.cg-count {
  font-size: 12px; font-weight: 500;
  color: var(--text-secondary, #71717a);
  background: var(--amber-light, #fffbeb);
  padding: 2px 8px; border-radius: 99px;
}
.cg-close {
  background: none; border: none; font-size: 22px;
  color: var(--text-secondary, #71717a); cursor: pointer;
  padding: 4px 8px; border-radius: 8px;
}
.cg-close:hover { background: var(--border, rgba(0,0,0,0.05)); }

/* ===== Template picker ===== */
.cg-templates {
  display: flex; gap: 8px;
  padding: 14px 20px;
  border-bottom: 1px solid var(--border, rgba(0,0,0,0.05));
  overflow-x: auto;
}
.cg-tpl-btn {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 14px; border-radius: 12px;
  border: 1.5px solid var(--border, rgba(0,0,0,0.08));
  background: var(--bg, #fafafa);
  cursor: pointer; text-align: left;
  transition: all 0.15s; white-space: nowrap;
}
.cg-tpl-btn.active {
  border-color: var(--amber, #f59e0b);
  background: var(--amber-light, #fffbeb);
}
.cg-tpl-icon { font-size: 22px; }
.cg-tpl-info { display: flex; flex-direction: column; gap: 1px; }
.cg-tpl-label {
  font-size: 13px; font-weight: 700;
  color: var(--text, #18181b);
}
.cg-tpl-desc {
  font-size: 11px; font-weight: 400;
  color: var(--text-tertiary, #a1a1aa);
}

/* ===== Style picker ===== */
.cg-styles {
  display: flex; gap: 6px;
  padding: 12px 20px; overflow-x: auto;
}
.cg-style-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 12px; border-radius: 99px;
  border: 1px solid var(--border, rgba(0,0,0,0.08));
  background: var(--bg, #fafafa);
  font-size: 12px; font-weight: 500;
  color: var(--text-secondary, #71717a);
  cursor: pointer; white-space: nowrap;
  transition: all 0.15s;
}
.cg-style-btn.active {
  border-color: var(--amber, #f59e0b);
  background: var(--amber-light, #fffbeb);
  color: var(--amber-dark, #92400e);
}
.cg-style-dot {
  width: 14px; height: 14px;
  border-radius: 50%; flex-shrink: 0;
}

/* ===== Slides container ===== */
.cg-slides-scroll {
  overflow-x: auto;
  padding: 8px 20px 16px;
  -webkit-overflow-scrolling: touch;
}
.cg-slides { display: flex; gap: 12px; }
.cg-slide-wrap {
  flex-shrink: 0;
  display: flex; flex-direction: column;
  align-items: center; gap: 6px;
  width: 240px; height: 268px;
  overflow: hidden;
}
.cg-slide-num {
  font-size: 11px; font-weight: 600;
  color: var(--text-tertiary, #a1a1aa);
}

/* ===== Base slide (1080x1080 scaled to 240px preview) ===== */
.cg-slide {
  width: 1080px; height: 1080px;
  transform: scale(0.222);
  transform-origin: top left;
  position: relative; overflow: hidden;
  display: flex; flex-direction: column;
  font-family: 'DM Sans', 'Inter', -apple-system, sans-serif;
}

/* ===== CAROUSEL TEMPLATE ===== */
.cg-slide-accent {
  height: 8px; width: 100%; flex-shrink: 0;
}
.cg-slide-body {
  flex: 1; display: flex; flex-direction: column;
  justify-content: center; padding: 80px 72px;
}
.cg-slide-hook .cg-hook-text {
  font-size: 72px; font-weight: 800;
  line-height: 1.15; letter-spacing: -1px;
}
.cg-swipe {
  margin-top: 48px; font-size: 32px;
  font-weight: 600; opacity: 0.8;
}
.cg-slide-point .cg-point-num {
  font-size: 96px; font-weight: 900;
  opacity: 0.3; line-height: 1; margin-bottom: 16px;
}
.cg-slide-point .cg-point-text {
  font-size: 48px; font-weight: 600; line-height: 1.3;
}
.cg-slide-points .cg-point-row {
  display: flex; align-items: flex-start;
  gap: 24px; margin-bottom: 32px;
  font-size: 42px; font-weight: 500; line-height: 1.35;
}
.cg-bullet {
  width: 16px; height: 16px;
  border-radius: 50%; flex-shrink: 0; margin-top: 16px;
}
.cg-slide-cta {
  align-items: center; text-align: center;
}
.cg-cta-text {
  font-size: 52px; font-weight: 700;
  line-height: 1.25; margin-bottom: 48px;
}
.cg-cta-biz {
  font-size: 36px; font-weight: 800; margin-bottom: 32px;
}
.cg-cta-follow {
  font-size: 28px; font-weight: 600;
  border: 3px solid; padding: 16px 48px; border-radius: 99px;
}

/* ===== PAPER QUOTE TEMPLATE ===== */
.cg-paper { position: relative; }
.cg-paper-lines {
  position: absolute; top: 60px; left: 0; right: 0; bottom: 0;
  display: flex; flex-direction: column;
  gap: 0; pointer-events: none;
}
.cg-paper-line {
  height: 50px; flex-shrink: 0;
  border-bottom: 1.5px solid;
}
.cg-paper-margin {
  position: absolute; top: 0; bottom: 0;
  left: 120px; border-left: 2.5px solid;
  pointer-events: none;
}
.cg-paper-holes {
  position: absolute; top: 80px; left: 24px;
  display: flex; flex-direction: column; gap: 180px;
  pointer-events: none;
}
.cg-paper-hole {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: #d4d4d8;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.15);
}
.cg-paper-body {
  position: relative; z-index: 1;
  flex: 1; display: flex; flex-direction: column;
  justify-content: center;
  padding: 100px 160px 100px 180px;
}
.cg-paper-title .cg-paper-title-text {
  font-size: 68px; font-weight: 800;
  line-height: 1.35; letter-spacing: -0.5px;
}
.cg-paper-swipe {
  margin-top: 48px; font-size: 30px;
  font-weight: 600; font-style: italic;
}
.cg-paper-quote .cg-paper-num {
  font-size: 120px; font-weight: 900;
  opacity: 0.18; line-height: 1; margin-bottom: 8px;
}
.cg-paper-quote .cg-paper-quote-text {
  font-size: 48px; font-weight: 600;
  line-height: 1.45;
}
.cg-highlight {
  padding: 2px 6px;
  border-radius: 4px;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}
.cg-paper-cta {
  align-items: center; text-align: center;
}
.cg-paper-cta-text {
  font-size: 52px; font-weight: 800;
  line-height: 1.3; margin-bottom: 40px;
}
.cg-paper-cta-biz {
  font-size: 36px; font-weight: 600; margin-bottom: 36px;
}
.cg-paper-cta-btn {
  font-size: 28px; font-weight: 700;
  padding: 18px 64px; border-radius: 99px;
  display: inline-block;
}

/* ===== MONO QUOTE TEMPLATE ===== */
.cg-mono { position: relative; }
.cg-mono-corner-tl {
  position: absolute; top: 48px; left: 48px;
  width: 80px; height: 80px;
  border-top: 4px solid; border-left: 4px solid;
}
.cg-mono-corner-br {
  position: absolute; bottom: 48px; right: 48px;
  width: 80px; height: 80px;
  border-bottom: 4px solid; border-right: 4px solid;
}
.cg-mono-body {
  position: relative; z-index: 1;
  flex: 1; display: flex; flex-direction: column;
  justify-content: center; align-items: center;
  padding: 120px 100px; text-align: center;
}
.cg-mono-dash {
  width: 60px; height: 4px; border-radius: 2px;
  margin: 20px 0;
}
.cg-mono-title .cg-mono-title-text {
  font-size: 68px; font-weight: 800;
  line-height: 1.2; letter-spacing: -1px;
}
.cg-mono-swipe {
  margin-top: 32px; font-size: 28px;
  font-weight: 500; opacity: 0.6;
}
.cg-mono-quote .cg-mono-quotemark {
  font-size: 160px; font-weight: 900;
  line-height: 0.6; margin-bottom: 24px;
  font-family: Georgia, serif;
}
.cg-mono-quote .cg-mono-quote-text {
  font-size: 46px; font-weight: 600;
  line-height: 1.4; max-width: 820px;
}
.cg-mono-quote .cg-mono-num {
  margin-top: 40px; font-size: 24px;
  font-weight: 700; letter-spacing: 4px;
}
.cg-mono-cta .cg-mono-cta-text {
  font-size: 50px; font-weight: 700;
  line-height: 1.3; margin-bottom: 36px;
}
.cg-mono-cta-line {
  width: 80px; height: 4px; border-radius: 2px;
  margin-bottom: 36px;
}
.cg-mono-cta .cg-mono-cta-biz {
  font-size: 34px; font-weight: 800;
}

/* ===== Watermark ===== */
.cg-watermark {
  position: absolute; bottom: 24px; right: 32px;
  font-size: 20px; font-weight: 500;
}

/* ===== Download ===== */
.cg-dl-one {
  background: none; border: none; font-size: 14px;
  cursor: pointer; padding: 2px 6px; border-radius: 6px;
  color: var(--text-tertiary, #a1a1aa);
}
.cg-dl-one:hover { background: var(--border, rgba(0,0,0,0.05)); }
.cg-actions {
  padding: 12px 20px 16px;
  border-top: 1px solid var(--border, rgba(0,0,0,0.05));
}
.cg-download-all {
  width: 100%; padding: 12px; border-radius: 12px;
  border: none; background: var(--amber, #f59e0b);
  color: #fff; font-size: 14px; font-weight: 700;
  cursor: pointer; transition: opacity 0.15s;
}
.cg-download-all:hover { opacity: 0.9; }
.cg-download-all:disabled { opacity: 0.5; cursor: wait; }
</style>
