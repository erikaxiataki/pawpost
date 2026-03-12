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
const photoUrl = ref('')
const photoFile = ref(null)
const slideEdits = ref({}) // { "template-slideIndex": "edited text" }
const editingSlide = ref(null) // index of slide being edited

// --- Templates ---
const templates = [
  { id: 'carousel', label: 'Carousel', icon: '🎠', desc: 'Bold slides with hook + points + CTA' },
  { id: 'paper', label: 'Paper Quote', icon: '📝', desc: 'Notebook feel with highlighter' },
  { id: 'mono', label: 'Mono Quote', icon: '🎨', desc: 'Clean solid color, text-only' },
  { id: 'gradient', label: 'Gradient Quote', icon: '🌅', desc: 'Vibrant gradient with big quotes' },
  { id: 'editorial', label: 'Editorial', icon: '✒️', desc: 'Serif typography, neon highlight' },
  { id: 'notes', label: 'Notes', icon: '📱', desc: 'iPhone Notes style, checklist feel' },
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

const gradientStyles = [
  { id: 'sunset-grad', label: 'Sunset', gradient: 'linear-gradient(135deg, #f97316 0%, #ec4899 50%, #f43f5e 100%)', text: '#fef3c7', accent: '#fef3c7', dotColor: '#fef3c740' },
  { id: 'ocean-grad', label: 'Ocean', gradient: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #8b5cf6 100%)', text: '#e0f2fe', accent: '#e0f2fe', dotColor: '#e0f2fe40' },
  { id: 'forest-grad', label: 'Forest', gradient: 'linear-gradient(135deg, #059669 0%, #0d9488 50%, #06b6d4 100%)', text: '#ecfdf5', accent: '#ecfdf5', dotColor: '#ecfdf540' },
  { id: 'berry-grad', label: 'Berry', gradient: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f43f5e 100%)', text: '#fdf4ff', accent: '#fdf4ff', dotColor: '#fdf4ff40' },
  { id: 'midnight-grad', label: 'Midnight', gradient: 'linear-gradient(135deg, #1e293b 0%, #312e81 50%, #4c1d95 100%)', text: '#e2e8f0', accent: '#a5b4fc', dotColor: '#a5b4fc30' },
  { id: 'golden-grad', label: 'Golden', gradient: 'linear-gradient(135deg, #d97706 0%, #b45309 50%, #92400e 100%)', text: '#fffbeb', accent: '#fde68a', dotColor: '#fde68a40' },
]

const editorialStyles = [
  { id: 'classic', label: 'Classic', bg: '#eae5df', text: '#1a1a1a', accent: '#d4ff00', handleColor: '#555' },
  { id: 'snow', label: 'Snow', bg: '#fafafa', text: '#0a0a0a', accent: '#00e5ff', handleColor: '#666' },
  { id: 'noir', label: 'Noir', bg: '#1a1a1a', text: '#f5f5f5', accent: '#ff6b6b', handleColor: '#999' },
  { id: 'parchment', label: 'Parchment', bg: '#f5f0e8', text: '#2d2416', accent: '#ff9f43', handleColor: '#8b7355' },
  { id: 'mint-ed', label: 'Mint', bg: '#f0faf5', text: '#1a3a2a', accent: '#00e676', handleColor: '#5a8a6a' },
  { id: 'rose-ed', label: 'Rose', bg: '#fdf2f8', text: '#3b1a2e', accent: '#ff4d94', handleColor: '#a06080' },
]

const notesStyles = [
  { id: 'ios-light', label: 'iOS Light', bg: '#ffffff', text: '#1c1c1e', accent: '#ff9500', titleColor: '#1c1c1e', subtextColor: '#8e8e93', checkColor: '#ff9500', navColor: '#ff9500' },
  { id: 'ios-dark', label: 'iOS Dark', bg: '#1c1c1e', text: '#ffffff', accent: '#ff9f0a', titleColor: '#ffffff', subtextColor: '#98989d', checkColor: '#ff9f0a', navColor: '#ff9f0a' },
  { id: 'ios-yellow', label: 'Yellow', bg: '#fff9e6', text: '#1c1c1e', accent: '#ff9500', titleColor: '#1c1c1e', subtextColor: '#8e8e93', checkColor: '#ff9500', navColor: '#ff9500' },
  { id: 'ios-pink', label: 'Pink', bg: '#fff0f5', text: '#1c1c1e', accent: '#ff2d55', titleColor: '#1c1c1e', subtextColor: '#8e8e93', checkColor: '#ff2d55', navColor: '#ff2d55' },
  { id: 'ios-blue', label: 'Blue', bg: '#f0f5ff', text: '#1c1c1e', accent: '#007aff', titleColor: '#1c1c1e', subtextColor: '#8e8e93', checkColor: '#007aff', navColor: '#007aff' },
  { id: 'ios-green', label: 'Green', bg: '#f0fff4', text: '#1c1c1e', accent: '#34c759', titleColor: '#1c1c1e', subtextColor: '#8e8e93', checkColor: '#34c759', navColor: '#34c759' },
]

const styleMap = {
  carousel: carouselStyles,
  paper: paperStyles,
  mono: monoStyles,
  gradient: gradientStyles,
  editorial: editorialStyles,
  notes: notesStyles,
}

const activeStyles = computed(() => styleMap[selectedTemplate.value] || carouselStyles)
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

  const tpl = selectedTemplate.value
  if (tpl === 'notes') return buildNotesSlides(lines)
  if (tpl === 'paper' || tpl === 'mono' || tpl === 'gradient' || tpl === 'editorial') {
    return buildQuoteSlides(lines)
  }
  return buildCarouselSlides(lines)
})

function buildCarouselSlides(lines) {
  const result = []
  result.push({ type: 'hook', content: lines[0] || 'Did you know?' })
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
  result.push({ type: 'cta', content: props.caption?.engagementHook?.prompt || 'Follow for more pet tips!' })
  return result
}

function buildQuoteSlides(lines) {
  const result = []
  result.push({ type: 'quote-title', content: lines[0] || 'Pet Tips' })
  const body = lines.slice(1).join(' ')
  const points = extractPoints(body)
  points.slice(0, 5).forEach((p, i) => {
    result.push({ type: 'quote', content: p, num: i + 1 })
  })
  result.push({ type: 'quote-cta', content: props.caption?.engagementHook?.prompt || 'Follow for more pet tips!' })
  return result
}

function buildNotesSlides(lines) {
  const result = []
  // Slide 1: Title card (looks like Notes app title)
  result.push({ type: 'notes-title', content: lines[0] || 'Pet Tips', items: [] })

  // Middle slides: each has a subtitle + checklist items
  const body = lines.slice(1).join(' ')
  const points = extractPoints(body)

  // Group into slides of 3-4 items (checklist style)
  for (let i = 0; i < points.length; i += 3) {
    const group = points.slice(i, i + 3)
    result.push({ type: 'notes-list', items: group, num: Math.floor(i / 3) + 1 })
  }

  // Cap at 5 content slides
  while (result.length > 5) result.pop()

  // CTA slide
  result.push({ type: 'notes-cta', content: props.caption?.engagementHook?.prompt || 'Follow for more pet tips!' })
  return result
}

// --- Slide text editing ---
function getSlideEditKey(index) {
  return `${selectedTemplate.value}-${index}`
}

function getSlideText(slide, index) {
  const key = getSlideEditKey(index)
  if (slideEdits.value[key] !== undefined) return slideEdits.value[key]
  return slide.content || ''
}

function startEditSlide(index, currentText) {
  editingSlide.value = index
  const key = getSlideEditKey(index)
  if (slideEdits.value[key] === undefined) {
    slideEdits.value[key] = currentText
  }
}

function saveSlideEdit(index) {
  editingSlide.value = null
}

function updateSlideEdit(index, value) {
  slideEdits.value[getSlideEditKey(index)] = value
}

function extractPoints(text) {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
  return sentences.map(s => s.trim()).filter(s => s.length > 10 && s.length < 200).slice(0, 6)
}

// Highlight: find a key phrase (longest sub-clause between 2-10 words)
function getHighlight(text) {
  const parts = text.split(/[,;:]/).map(s => s.trim())
  return parts.filter(s => { const w = s.split(/\s+/).length; return w >= 2 && w <= 10 }).sort((a, b) => b.length - a.length)[0] || ''
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

// Editorial: highlight last meaningful word
function getLastKeyWord(text) {
  const words = text.replace(/[.!?]+$/, '').trim().split(/\s+/)
  // Find last word that's > 3 chars
  for (let i = words.length - 1; i >= 0; i--) {
    if (words[i].length > 3) return { word: words[i], index: i }
  }
  return { word: words[words.length - 1], index: words.length - 1 }
}

function editorialParts(text) {
  const { word, index } = getLastKeyWord(text)
  const words = text.replace(/[.!?]+$/, '').trim().split(/\s+/)
  const punct = text.match(/[.!?]+$/)?.[0] || ''
  const before = words.slice(0, index).join(' ')
  const after = words.slice(index + 1).join(' ')
  return { before, highlight: word + (after ? '' : punct), after: after ? after + punct : '' }
}

// Photo upload
function handlePhotoUpload(e) {
  const file = e.target.files?.[0]
  if (!file) return
  photoFile.value = file
  const reader = new FileReader()
  reader.onload = () => { photoUrl.value = reader.result }
  reader.readAsDataURL(file)
}

// Download
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
    } catch (err) { console.error(`Slide ${i + 1} export failed:`, err) }
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
  } catch (err) { console.error('Slide export failed:', err) }
}

function switchTemplate(id) {
  selectedTemplate.value = id
  selectedStyle.value = (styleMap[id] || carouselStyles)[0].id
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
      <button v-for="t in templates" :key="t.id"
        :class="['cg-tpl-btn', selectedTemplate === t.id && 'active']"
        @click="switchTemplate(t.id)">
        <span class="cg-tpl-icon">{{ t.icon }}</span>
        <span class="cg-tpl-info">
          <span class="cg-tpl-label">{{ t.label }}</span>
          <span class="cg-tpl-desc">{{ t.desc }}</span>
        </span>
      </button>
    </div>

    <!-- Style picker -->
    <div class="cg-styles">
      <button v-for="s in activeStyles" :key="s.id"
        :class="['cg-style-btn', selectedStyle === s.id && 'active']"
        @click="selectedStyle = s.id">
        <span class="cg-style-dot" :style="{ background: s.gradient || s.bg || s.cardBg || '#ccc', border: `2px solid ${s.accent}` }"></span>
        {{ s.label }}
      </button>
    </div>

    <!-- Edit hint -->
    <div class="cg-edit-hint">Tap any slide text to edit it</div>

    <!-- Slides preview -->
    <div class="cg-slides-scroll">
      <div class="cg-slides">
        <div v-for="(slide, i) in slides" :key="i + selectedTemplate + selectedStyle" class="cg-slide-wrap">
          <div class="cg-slide-num">{{ i + 1 }}/{{ slides.length }}</div>

          <!-- ========== CAROUSEL ========== -->
          <div v-if="selectedTemplate === 'carousel'"
            :ref="el => setSlideRef(el, i)" class="cg-slide"
            :style="{ background: currentStyle.bg, color: currentStyle.text }">
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

          <!-- ========== PAPER QUOTE ========== -->
          <div v-else-if="selectedTemplate === 'paper'"
            :ref="el => setSlideRef(el, i)" class="cg-slide cg-paper"
            :style="{ background: currentStyle.bg, color: currentStyle.text }">
            <div class="cg-paper-lines"><div v-for="n in 20" :key="n" class="cg-paper-line" :style="{ borderColor: currentStyle.lineColor }"></div></div>
            <div class="cg-paper-margin" :style="{ borderColor: currentStyle.accent + '55' }"></div>
            <div class="cg-paper-holes"><div v-for="n in 5" :key="n" class="cg-paper-hole"></div></div>
            <template v-if="slide.type === 'quote-title'">
              <div class="cg-paper-body cg-paper-title">
                <div class="cg-paper-title-text">
                  <span v-for="(part, pi) in highlightText(slide.content)" :key="pi" :class="part.highlighted && 'cg-highlight'"
                    :style="part.highlighted ? { background: currentStyle.highlight, borderBottom: `4px solid ${currentStyle.accent}` } : {}">{{ part.text }}</span>
                </div>
                <div class="cg-paper-swipe" :style="{ color: currentStyle.accent }">Swipe for tips &rarr;</div>
              </div>
            </template>
            <template v-else-if="slide.type === 'quote'">
              <div class="cg-paper-body cg-paper-quote">
                <div class="cg-paper-num" :style="{ color: currentStyle.accent }">{{ slide.num }}</div>
                <div class="cg-paper-quote-text">
                  <span v-for="(part, pi) in highlightText(slide.content)" :key="pi" :class="part.highlighted && 'cg-highlight'"
                    :style="part.highlighted ? { background: currentStyle.highlight, borderBottom: `4px solid ${currentStyle.accent}` } : {}">{{ part.text }}</span>
                </div>
              </div>
            </template>
            <template v-else-if="slide.type === 'quote-cta'">
              <div class="cg-paper-body cg-paper-cta">
                <div class="cg-paper-cta-text" :style="{ color: currentStyle.accent }">{{ slide.content }}</div>
                <div class="cg-paper-cta-biz">@{{ businessName }}</div>
                <div class="cg-paper-cta-btn" :style="{ background: currentStyle.accent, color: currentStyle.bg }">Follow</div>
              </div>
            </template>
            <div class="cg-watermark" :style="{ color: currentStyle.text + '30' }">{{ businessName }}</div>
          </div>

          <!-- ========== MONO QUOTE ========== -->
          <div v-else-if="selectedTemplate === 'mono'"
            :ref="el => setSlideRef(el, i)" class="cg-slide cg-mono"
            :style="{ background: currentStyle.bg, color: currentStyle.text }">
            <div class="cg-mono-corner-tl" :style="{ borderColor: currentStyle.accent }"></div>
            <div class="cg-mono-corner-br" :style="{ borderColor: currentStyle.accent }"></div>
            <template v-if="slide.type === 'quote-title'">
              <div class="cg-mono-body cg-mono-title">
                <div class="cg-mono-dash" :style="{ background: currentStyle.accent }"></div>
                <div class="cg-mono-title-text">{{ slide.content }}</div>
                <div class="cg-mono-dash" :style="{ background: currentStyle.accent }"></div>
                <div class="cg-mono-swipe" :style="{ color: currentStyle.accent }">Swipe &rarr;</div>
              </div>
            </template>
            <template v-else-if="slide.type === 'quote'">
              <div class="cg-mono-body cg-mono-quote">
                <div class="cg-mono-quotemark" :style="{ color: currentStyle.accent }">&ldquo;</div>
                <div class="cg-mono-quote-text">{{ slide.content }}</div>
                <div class="cg-mono-num" :style="{ color: currentStyle.accent }">{{ slide.num }}</div>
              </div>
            </template>
            <template v-else-if="slide.type === 'quote-cta'">
              <div class="cg-mono-body cg-mono-cta">
                <div class="cg-mono-cta-text">{{ slide.content }}</div>
                <div class="cg-mono-cta-line" :style="{ background: currentStyle.accent }"></div>
                <div class="cg-mono-cta-biz" :style="{ color: currentStyle.accent }">@{{ businessName }}</div>
              </div>
            </template>
            <div class="cg-watermark" :style="{ color: currentStyle.text + '25' }">{{ businessName }}</div>
          </div>

          <!-- ========== GRADIENT QUOTE ========== -->
          <div v-else-if="selectedTemplate === 'gradient'"
            :ref="el => setSlideRef(el, i)" class="cg-slide cg-grad"
            :style="{ background: currentStyle.gradient, color: currentStyle.text }">
            <!-- Decorative elements: circles, stars, dots, grid -->
            <div class="cg-grad-circle cg-grad-circle1" :style="{ background: currentStyle.dotColor }"></div>
            <div class="cg-grad-circle cg-grad-circle2" :style="{ background: currentStyle.dotColor }"></div>
            <div class="cg-grad-grid" :style="{ borderColor: currentStyle.dotColor }"></div>
            <div class="cg-grad-star cg-grad-star1" :style="{ color: currentStyle.accent }">&#9733;</div>
            <div class="cg-grad-star cg-grad-star2" :style="{ color: currentStyle.accent }">&#9733;</div>
            <div class="cg-grad-star cg-grad-star3" :style="{ color: currentStyle.dotColor }">&#9733;</div>
            <div class="cg-grad-dot cg-grad-dot1" :style="{ background: currentStyle.dotColor }"></div>
            <div class="cg-grad-dot cg-grad-dot2" :style="{ background: currentStyle.dotColor }"></div>
            <div class="cg-grad-dot cg-grad-dot3" :style="{ background: currentStyle.dotColor }"></div>

            <template v-if="slide.type === 'quote-title'">
              <div class="cg-grad-body cg-grad-title">
                <div class="cg-grad-quotemark">&ldquo;&ldquo;</div>
                <div class="cg-grad-title-text">{{ slide.content }}</div>
                <div class="cg-grad-swipe">Swipe &rarr;</div>
              </div>
            </template>
            <template v-else-if="slide.type === 'quote'">
              <div class="cg-grad-body cg-grad-quote">
                <div class="cg-grad-quotemark">&ldquo;&ldquo;</div>
                <div class="cg-grad-quote-text">{{ slide.content }}</div>
                <div class="cg-grad-attribution">{{ businessName }}</div>
              </div>
            </template>
            <template v-else-if="slide.type === 'quote-cta'">
              <div class="cg-grad-body cg-grad-cta">
                <div class="cg-grad-cta-text">{{ slide.content }}</div>
                <div class="cg-grad-cta-biz">@{{ businessName }}</div>
                <div class="cg-grad-cta-btn" :style="{ background: currentStyle.accent + '33', borderColor: currentStyle.accent }">Follow for more</div>
              </div>
            </template>
          </div>

          <!-- ========== EDITORIAL ========== -->
          <div v-else-if="selectedTemplate === 'editorial'"
            :ref="el => setSlideRef(el, i)" class="cg-slide cg-ed"
            :style="{ background: currentStyle.bg, color: currentStyle.text }">
            <template v-if="slide.type === 'quote-title'">
              <div class="cg-ed-body cg-ed-title">
                <div class="cg-ed-title-text">
                  <template v-for="(part, pi) in highlightText(slide.content)" :key="pi">
                    <span v-if="part.highlighted" class="cg-ed-highlight" :style="{ background: currentStyle.accent }">{{ part.text }}</span>
                    <span v-else>{{ part.text }}</span>
                  </template>
                </div>
                <div class="cg-ed-handle" :style="{ color: currentStyle.handleColor }">@{{ businessName }}</div>
              </div>
            </template>
            <template v-else-if="slide.type === 'quote'">
              <div class="cg-ed-body cg-ed-quote">
                <div class="cg-ed-quote-text">
                  {{ editorialParts(slide.content).before }}
                  <span class="cg-ed-highlight" :style="{ background: currentStyle.accent }">{{ editorialParts(slide.content).highlight }}</span>
                  {{ editorialParts(slide.content).after }}
                </div>
                <div class="cg-ed-handle" :style="{ color: currentStyle.handleColor }">@{{ businessName }}</div>
              </div>
            </template>
            <template v-else-if="slide.type === 'quote-cta'">
              <div class="cg-ed-body cg-ed-cta">
                <div class="cg-ed-cta-text">{{ slide.content }}</div>
                <div class="cg-ed-cta-line" :style="{ background: currentStyle.accent }"></div>
                <div class="cg-ed-handle" :style="{ color: currentStyle.handleColor }">@{{ businessName }}</div>
              </div>
            </template>
          </div>

          <!-- ========== NOTES (iPhone Notes style) ========== -->
          <div v-else-if="selectedTemplate === 'notes'"
            :ref="el => setSlideRef(el, i)" class="cg-slide cg-notes"
            :style="{ background: currentStyle.bg, color: currentStyle.text }">
            <!-- Status bar -->
            <div class="cg-notes-statusbar">
              <span class="cg-notes-time">9:41</span>
              <span class="cg-notes-icons">&#9679;&#9679;&#9679;</span>
            </div>
            <!-- Nav bar -->
            <div class="cg-notes-nav">
              <span class="cg-notes-back" :style="{ color: currentStyle.navColor }">&lsaquo; All iCloud</span>
              <span class="cg-notes-nav-icons" :style="{ color: currentStyle.navColor }">&#9679; &#9651;</span>
            </div>

            <!-- Title slide -->
            <template v-if="slide.type === 'notes-title'">
              <div class="cg-notes-body">
                <div class="cg-notes-title" :style="{ color: currentStyle.titleColor }"
                  @click="startEditSlide(i, slide.content)"
                  contenteditable="false">
                  <template v-if="editingSlide === i">
                    <textarea class="cg-notes-edit" :value="getSlideText(slide, i)"
                      @input="updateSlideEdit(i, $event.target.value)"
                      @blur="saveSlideEdit(i)" @keydown.enter.prevent="saveSlideEdit(i)"
                      autofocus></textarea>
                  </template>
                  <template v-else>{{ getSlideText(slide, i) || slide.content }}</template>
                </div>
                <div class="cg-notes-subtitle" :style="{ color: currentStyle.subtextColor }">Swipe for tips &rarr;</div>
              </div>
            </template>

            <!-- Checklist slide -->
            <template v-else-if="slide.type === 'notes-list'">
              <div class="cg-notes-body">
                <div class="cg-notes-section-title" :style="{ color: currentStyle.titleColor }">Tips:</div>
                <div v-for="(item, ii) in slide.items" :key="ii" class="cg-notes-check-row">
                  <div class="cg-notes-check-circle" :style="{ borderColor: currentStyle.checkColor }"></div>
                  <span class="cg-notes-check-text" @click="startEditSlide(i * 100 + ii, item)">
                    <template v-if="editingSlide === i * 100 + ii">
                      <textarea class="cg-notes-edit-inline" :value="getSlideText({ content: item }, i * 100 + ii)"
                        @input="updateSlideEdit(i * 100 + ii, $event.target.value)"
                        @blur="saveSlideEdit(i * 100 + ii)" @keydown.enter.prevent="saveSlideEdit(i * 100 + ii)"
                        autofocus></textarea>
                    </template>
                    <template v-else>{{ getSlideText({ content: item }, i * 100 + ii) || item }}</template>
                  </span>
                </div>
              </div>
            </template>

            <!-- CTA slide -->
            <template v-else-if="slide.type === 'notes-cta'">
              <div class="cg-notes-body cg-notes-cta-body">
                <div class="cg-notes-title" :style="{ color: currentStyle.titleColor }"
                  @click="startEditSlide(i, slide.content)">
                  <template v-if="editingSlide === i">
                    <textarea class="cg-notes-edit" :value="getSlideText(slide, i)"
                      @input="updateSlideEdit(i, $event.target.value)"
                      @blur="saveSlideEdit(i)" @keydown.enter.prevent="saveSlideEdit(i)"
                      autofocus></textarea>
                  </template>
                  <template v-else>{{ getSlideText(slide, i) || slide.content }}</template>
                </div>
                <div class="cg-notes-handle" :style="{ color: currentStyle.accent }">@{{ businessName }}</div>
              </div>
            </template>

            <!-- Bottom toolbar -->
            <div class="cg-notes-toolbar">
              <span :style="{ color: currentStyle.navColor }">&#9776;</span>
              <span :style="{ color: currentStyle.navColor }">&#9675;</span>
              <span :style="{ color: currentStyle.navColor }">&#10003;</span>
              <span :style="{ color: currentStyle.navColor }">&#9998;</span>
            </div>
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
.cg-root { background: var(--bg-card, #fff); border-radius: 16px; border: 1px solid var(--border, rgba(0,0,0,0.05)); overflow: hidden; margin-top: 12px; }
.cg-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border, rgba(0,0,0,0.05)); }
.cg-title { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 15px; color: var(--text, #18181b); }
.cg-icon { font-size: 20px; }
.cg-count { font-size: 12px; font-weight: 500; color: var(--text-secondary, #71717a); background: var(--amber-light, #fffbeb); padding: 2px 8px; border-radius: 99px; }
.cg-close { background: none; border: none; font-size: 22px; color: var(--text-secondary, #71717a); cursor: pointer; padding: 4px 8px; border-radius: 8px; }
.cg-close:hover { background: var(--border, rgba(0,0,0,0.05)); }

/* ===== Template picker ===== */
.cg-templates { display: flex; gap: 8px; padding: 14px 20px; border-bottom: 1px solid var(--border, rgba(0,0,0,0.05)); overflow-x: auto; }
.cg-tpl-btn { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 12px; border: 1.5px solid var(--border, rgba(0,0,0,0.08)); background: var(--bg, #fafafa); cursor: pointer; text-align: left; transition: all 0.15s; white-space: nowrap; flex-shrink: 0; }
.cg-tpl-btn.active { border-color: var(--amber, #f59e0b); background: var(--amber-light, #fffbeb); }
.cg-tpl-icon { font-size: 22px; }
.cg-tpl-info { display: flex; flex-direction: column; gap: 1px; }
.cg-tpl-label { font-size: 13px; font-weight: 700; color: var(--text, #18181b); }
.cg-tpl-desc { font-size: 11px; font-weight: 400; color: var(--text-tertiary, #a1a1aa); }

/* ===== Style picker ===== */
.cg-styles { display: flex; gap: 6px; padding: 12px 20px; overflow-x: auto; }
.cg-style-btn { display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 99px; border: 1px solid var(--border, rgba(0,0,0,0.08)); background: var(--bg, #fafafa); font-size: 12px; font-weight: 500; color: var(--text-secondary, #71717a); cursor: pointer; white-space: nowrap; transition: all 0.15s; }
.cg-style-btn.active { border-color: var(--amber, #f59e0b); background: var(--amber-light, #fffbeb); color: var(--amber-dark, #92400e); }
.cg-style-dot { width: 14px; height: 14px; border-radius: 50%; flex-shrink: 0; }

/* ===== Photo upload ===== */

/* ===== Slides container ===== */
.cg-slides-scroll { overflow-x: auto; padding: 8px 20px 16px; -webkit-overflow-scrolling: touch; }
.cg-slides { display: flex; gap: 12px; }
.cg-slide-wrap { flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 6px; width: 240px; height: 268px; overflow: hidden; }
.cg-slide-num { font-size: 11px; font-weight: 600; color: var(--text-tertiary, #a1a1aa); }

/* ===== Base slide ===== */
.cg-slide { width: 1080px; height: 1080px; transform: scale(0.222); transform-origin: top left; position: relative; overflow: hidden; display: flex; flex-direction: column; font-family: 'DM Sans', 'Inter', -apple-system, sans-serif; }

/* ===== CAROUSEL ===== */
.cg-slide-accent { height: 8px; width: 100%; flex-shrink: 0; }
.cg-slide-body { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 80px 72px; }
.cg-slide-hook .cg-hook-text { font-size: 72px; font-weight: 800; line-height: 1.15; letter-spacing: -1px; }
.cg-swipe { margin-top: 48px; font-size: 32px; font-weight: 600; opacity: 0.8; }
.cg-slide-point .cg-point-num { font-size: 96px; font-weight: 900; opacity: 0.3; line-height: 1; margin-bottom: 16px; }
.cg-slide-point .cg-point-text { font-size: 48px; font-weight: 600; line-height: 1.3; }
.cg-slide-points .cg-point-row { display: flex; align-items: flex-start; gap: 24px; margin-bottom: 32px; font-size: 42px; font-weight: 500; line-height: 1.35; }
.cg-bullet { width: 16px; height: 16px; border-radius: 50%; flex-shrink: 0; margin-top: 16px; }
.cg-slide-cta { align-items: center; text-align: center; }
.cg-cta-text { font-size: 52px; font-weight: 700; line-height: 1.25; margin-bottom: 48px; }
.cg-cta-biz { font-size: 36px; font-weight: 800; margin-bottom: 32px; }
.cg-cta-follow { font-size: 28px; font-weight: 600; border: 3px solid; padding: 16px 48px; border-radius: 99px; }

/* ===== PAPER QUOTE ===== */
.cg-paper { position: relative; }
.cg-paper-lines { position: absolute; top: 60px; left: 0; right: 0; bottom: 0; display: flex; flex-direction: column; pointer-events: none; }
.cg-paper-line { height: 50px; flex-shrink: 0; border-bottom: 1.5px solid; }
.cg-paper-margin { position: absolute; top: 0; bottom: 0; left: 120px; border-left: 2.5px solid; pointer-events: none; }
.cg-paper-holes { position: absolute; top: 80px; left: 24px; display: flex; flex-direction: column; gap: 180px; pointer-events: none; }
.cg-paper-hole { width: 36px; height: 36px; border-radius: 50%; background: #d4d4d8; box-shadow: inset 0 2px 4px rgba(0,0,0,0.15); }
.cg-paper-body { position: relative; z-index: 1; flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 100px 160px 100px 180px; }
.cg-paper-title .cg-paper-title-text { font-size: 68px; font-weight: 800; line-height: 1.35; }
.cg-paper-swipe { margin-top: 48px; font-size: 30px; font-weight: 600; font-style: italic; }
.cg-paper-quote .cg-paper-num { font-size: 120px; font-weight: 900; opacity: 0.18; line-height: 1; margin-bottom: 8px; }
.cg-paper-quote .cg-paper-quote-text { font-size: 48px; font-weight: 600; line-height: 1.45; }
.cg-highlight { padding: 2px 6px; border-radius: 4px; box-decoration-break: clone; -webkit-box-decoration-break: clone; }
.cg-paper-cta { align-items: center; text-align: center; }
.cg-paper-cta-text { font-size: 52px; font-weight: 800; line-height: 1.3; margin-bottom: 40px; }
.cg-paper-cta-biz { font-size: 36px; font-weight: 600; margin-bottom: 36px; }
.cg-paper-cta-btn { font-size: 28px; font-weight: 700; padding: 18px 64px; border-radius: 99px; display: inline-block; }

/* ===== MONO QUOTE ===== */
.cg-mono { position: relative; }
.cg-mono-corner-tl { position: absolute; top: 48px; left: 48px; width: 80px; height: 80px; border-top: 4px solid; border-left: 4px solid; }
.cg-mono-corner-br { position: absolute; bottom: 48px; right: 48px; width: 80px; height: 80px; border-bottom: 4px solid; border-right: 4px solid; }
.cg-mono-body { position: relative; z-index: 1; flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 120px 100px; text-align: center; }
.cg-mono-dash { width: 60px; height: 4px; border-radius: 2px; margin: 20px 0; }
.cg-mono-title .cg-mono-title-text { font-size: 68px; font-weight: 800; line-height: 1.2; letter-spacing: -1px; }
.cg-mono-swipe { margin-top: 32px; font-size: 28px; font-weight: 500; opacity: 0.6; }
.cg-mono-quote .cg-mono-quotemark { font-size: 160px; font-weight: 900; line-height: 0.6; margin-bottom: 24px; font-family: Georgia, serif; }
.cg-mono-quote .cg-mono-quote-text { font-size: 46px; font-weight: 600; line-height: 1.4; max-width: 820px; }
.cg-mono-quote .cg-mono-num { margin-top: 40px; font-size: 24px; font-weight: 700; letter-spacing: 4px; }
.cg-mono-cta .cg-mono-cta-text { font-size: 50px; font-weight: 700; line-height: 1.3; margin-bottom: 36px; }
.cg-mono-cta-line { width: 80px; height: 4px; border-radius: 2px; margin-bottom: 36px; }
.cg-mono-cta .cg-mono-cta-biz { font-size: 34px; font-weight: 800; }

/* ===== GRADIENT QUOTE ===== */
.cg-grad { position: relative; }
.cg-grad-circle { position: absolute; border-radius: 50%; pointer-events: none; }
.cg-grad-circle1 { width: 320px; height: 320px; top: -60px; right: -40px; }
.cg-grad-circle2 { width: 200px; height: 200px; bottom: 60px; left: -60px; }
.cg-grad-grid { position: absolute; bottom: 40px; right: 40px; width: 280px; height: 200px; border: 1.5px solid; border-radius: 16px; background: repeating-linear-gradient(0deg, transparent, transparent 28px, currentColor 28px, currentColor 29px), repeating-linear-gradient(90deg, transparent, transparent 28px, currentColor 28px, currentColor 29px); opacity: 0.2; transform: rotate(-12deg); pointer-events: none; }
.cg-grad-star { position: absolute; pointer-events: none; }
.cg-grad-star1 { font-size: 48px; top: 320px; right: 140px; }
.cg-grad-star2 { font-size: 32px; bottom: 120px; left: 100px; }
.cg-grad-star3 { font-size: 24px; top: 180px; left: 200px; }
.cg-grad-dot { position: absolute; border-radius: 50%; pointer-events: none; }
.cg-grad-dot1 { width: 8px; height: 8px; top: 100px; left: 300px; }
.cg-grad-dot2 { width: 6px; height: 6px; top: 400px; right: 200px; }
.cg-grad-dot3 { width: 10px; height: 10px; bottom: 300px; left: 160px; }
.cg-grad-body { position: relative; z-index: 1; flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 100px 90px; }
.cg-grad-quotemark { font-size: 120px; font-weight: 900; line-height: 0.7; margin-bottom: 24px; opacity: 0.85; font-family: Georgia, serif; }
.cg-grad-title .cg-grad-title-text { font-size: 64px; font-weight: 800; line-height: 1.25; }
.cg-grad-swipe { margin-top: 40px; font-size: 28px; font-weight: 600; opacity: 0.7; }
.cg-grad-quote .cg-grad-quote-text { font-size: 52px; font-weight: 700; line-height: 1.35; }
.cg-grad-attribution { margin-top: 40px; font-size: 26px; font-weight: 700; text-transform: uppercase; letter-spacing: 3px; opacity: 0.7; }
.cg-grad-cta { align-items: center; text-align: center; }
.cg-grad-cta-text { font-size: 50px; font-weight: 700; line-height: 1.3; margin-bottom: 36px; }
.cg-grad-cta-biz { font-size: 32px; font-weight: 700; margin-bottom: 32px; }
.cg-grad-cta-btn { font-size: 26px; font-weight: 600; padding: 16px 52px; border-radius: 99px; border: 2.5px solid; }

/* ===== EDITORIAL ===== */
.cg-ed { position: relative; }
.cg-ed-body { position: relative; z-index: 1; flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 120px 100px; }
.cg-ed-title .cg-ed-title-text, .cg-ed-quote .cg-ed-quote-text { font-size: 80px; font-weight: 800; line-height: 1.2; font-family: 'Fraunces', 'Playfair Display', 'Georgia', serif; letter-spacing: -1px; }
.cg-ed-highlight { padding: 4px 8px; color: #000; display: inline; box-decoration-break: clone; -webkit-box-decoration-break: clone; }
.cg-ed-handle { margin-top: 56px; font-size: 30px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; font-family: 'DM Sans', 'Inter', sans-serif; }
.cg-ed-cta { align-items: center; text-align: center; }
.cg-ed-cta .cg-ed-cta-text { font-size: 56px; font-weight: 800; line-height: 1.25; margin-bottom: 40px; font-family: 'Fraunces', 'Playfair Display', 'Georgia', serif; }
.cg-ed-cta-line { width: 80px; height: 5px; border-radius: 3px; margin-bottom: 32px; }

/* ===== NOTES (iPhone Notes) ===== */
.cg-notes { position: relative; flex-direction: column; }
.cg-notes-statusbar { display: flex; justify-content: space-between; align-items: center; padding: 16px 48px 8px; font-size: 28px; font-weight: 600; }
.cg-notes-time { font-variant-numeric: tabular-nums; }
.cg-notes-icons { font-size: 14px; letter-spacing: 6px; }
.cg-notes-nav { display: flex; justify-content: space-between; align-items: center; padding: 12px 48px 24px; font-size: 28px; }
.cg-notes-back { font-weight: 500; }
.cg-notes-nav-icons { font-size: 24px; letter-spacing: 16px; }
.cg-notes-body { flex: 1; display: flex; flex-direction: column; justify-content: flex-start; padding: 40px 64px; }
.cg-notes-title { font-size: 64px; font-weight: 800; line-height: 1.2; margin-bottom: 24px; cursor: pointer; min-height: 80px; font-family: -apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif; }
.cg-notes-subtitle { font-size: 32px; font-weight: 400; margin-top: 16px; }
.cg-notes-section-title { font-size: 52px; font-weight: 800; margin-bottom: 36px; font-family: -apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif; }
.cg-notes-check-row { display: flex; align-items: flex-start; gap: 24px; margin-bottom: 28px; }
.cg-notes-check-circle { width: 40px; height: 40px; border-radius: 50%; border: 3px solid; flex-shrink: 0; margin-top: 8px; }
.cg-notes-check-text { font-size: 38px; font-weight: 400; line-height: 1.4; cursor: pointer; font-family: -apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif; }
.cg-notes-cta-body { justify-content: center; align-items: center; text-align: center; }
.cg-notes-handle { font-size: 32px; font-weight: 600; margin-top: 24px; }
.cg-notes-toolbar { display: flex; justify-content: space-around; align-items: center; padding: 24px 80px; font-size: 36px; margin-top: auto; border-top: 1.5px solid rgba(128,128,128,0.2); }
.cg-notes-edit, .cg-notes-edit-inline { width: 100%; border: none; background: transparent; color: inherit; font: inherit; font-size: inherit; font-weight: inherit; line-height: inherit; resize: none; outline: none; padding: 0; }
.cg-notes-edit { min-height: 160px; }
.cg-notes-edit-inline { min-height: 54px; }

/* ===== Edit hint ===== */
.cg-edit-hint { padding: 4px 20px 0; font-size: 11px; color: var(--text-tertiary, #a1a1aa); font-style: italic; }

/* ===== Watermark ===== */
.cg-watermark { position: absolute; bottom: 24px; right: 32px; font-size: 20px; font-weight: 500; }

/* ===== Download ===== */
.cg-dl-one { background: none; border: none; font-size: 14px; cursor: pointer; padding: 2px 6px; border-radius: 6px; color: var(--text-tertiary, #a1a1aa); }
.cg-dl-one:hover { background: var(--border, rgba(0,0,0,0.05)); }
.cg-actions { padding: 12px 20px 16px; border-top: 1px solid var(--border, rgba(0,0,0,0.05)); }
.cg-download-all { width: 100%; padding: 12px; border-radius: 12px; border: none; background: var(--amber, #f59e0b); color: #fff; font-size: 14px; font-weight: 700; cursor: pointer; transition: opacity 0.15s; }
.cg-download-all:hover { opacity: 0.9; }
.cg-download-all:disabled { opacity: 0.5; cursor: wait; }
</style>
