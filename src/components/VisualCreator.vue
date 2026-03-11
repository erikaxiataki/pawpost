<template>
  <div class="vc">
    <div class="vc-header">
      <h3 class="vc-title">Create Visual</h3>
      <p class="vc-subtitle">Turn your caption into a shareable image</p>
    </div>

    <!-- Step 1: Pick a template -->
    <div class="vc-step">
      <span class="vc-step-label">1. Pick a style</span>
      <div class="vc-types">
        <button v-for="t in types" :key="t.id" class="vc-type-btn" :class="{ active: selectedType === t.id }" @click="selectedType = t.id">
          <span class="vc-type-icon">{{ t.icon }}</span>
          <span class="vc-type-label">{{ t.label }}</span>
        </button>
      </div>
    </div>

    <!-- Step 2: Edit content -->
    <div class="vc-step">
      <span class="vc-step-label">2. Edit your text</span>
      <textarea class="vc-textarea" v-model="customText" :placeholder="defaultText" rows="3"></textarea>
      <button v-if="customText !== defaultText" class="vc-reset-btn" @click="customText = defaultText">Reset to caption</button>
    </div>

    <!-- AI Image prompt (only for AI type) -->
    <div v-if="selectedType === 'ai-image'" class="vc-step">
      <span class="vc-step-label">2. Describe your image</span>
      <div class="vc-usage-bar">
        <span class="vc-usage-text">{{ imageUsageCount }}/{{ imageLimit }} images used this month</span>
        <span class="vc-usage-tier">{{ userTier === 'pro' ? 'Pro' : userTier === 'premium' ? 'Premium' : 'Free' }}</span>
      </div>
      <div v-if="imagesRemaining > 0" class="vc-usage-meter">
        <div class="vc-usage-fill" :style="{ width: (imageUsageCount / imageLimit * 100) + '%' }"></div>
      </div>
      <template v-if="!limitReached">
        <textarea class="vc-textarea" v-model="aiPrompt" placeholder="e.g. A golden retriever puppy sitting in a cozy pet shop with treats around..." rows="3"></textarea>
        <button class="vc-generate-btn" @click="generateAiImage" :disabled="aiGenerating || !aiPrompt.trim()">
          {{ aiGenerating ? 'Generating...' : `Generate Image (${imagesRemaining} left)` }}
        </button>
      </template>
      <div v-else class="vc-limit-reached">
        <p class="vc-limit-msg">You've used all {{ imageLimit }} AI images this month</p>
        <p v-if="userTier === 'free'" class="vc-limit-sub">Upgrade to Premium for 10 images/month or Pro for 30</p>
        <p v-else-if="userTier === 'premium'" class="vc-limit-sub">Upgrade to Pro for 30 images/month</p>
        <p v-else class="vc-limit-sub">Your limit resets next month</p>
        <button v-if="userTier !== 'pro'" class="vc-upgrade-btn" @click="$emit('upgrade')">Upgrade Plan</button>
      </div>
      <p v-if="aiError" class="vc-error">{{ aiError }}</p>
    </div>

    <!-- Carousel steps -->
    <div v-if="selectedType === 'carousel'" class="vc-step">
      <span class="vc-step-label">Slide content</span>
      <div v-for="(step, i) in customSteps" :key="i" class="vc-step-row">
        <span class="vc-step-num">{{ i + 1 }}</span>
        <input class="vc-input" v-model="customSteps[i]" />
        <button v-if="customSteps.length > 2" class="vc-remove-btn" @click="customSteps.splice(i, 1)">×</button>
      </div>
      <button v-if="customSteps.length < 7" class="vc-add-btn" @click="customSteps.push('New step...')">+ Add slide</button>
    </div>

    <!-- Photo URL (photo type) -->
    <div v-if="selectedType === 'photo'" class="vc-step">
      <span class="vc-step-label">Photo</span>
      <input class="vc-input" v-model="photoUrl" placeholder="Paste an image URL..." />
      <p class="vc-hint">{{ photoHint }}</p>
    </div>

    <!-- Step 3: Preview -->
    <div class="vc-step" v-if="selectedType !== 'ai-image' || aiImageUrl">
      <span class="vc-step-label">{{ selectedType === 'ai-image' ? '3.' : '3.' }} Preview</span>

      <!-- AI Image preview -->
      <div v-if="selectedType === 'ai-image' && aiImageUrl" class="vc-ai-preview">
        <div v-if="aiShowOverlay" ref="aiCaptureRef" class="vc-ai-wrap">
          <img :src="aiImageUrl" alt="AI generated" class="vc-ai-img" />
          <div class="vc-ai-overlay" :class="`vc-ai-pos-${aiTextPosition}`">
            <p>{{ aiOverlayText || 'Your text here' }}</p>
          </div>
        </div>
        <img v-else :src="aiImageUrl" alt="AI generated" class="vc-ai-img" />

        <div class="vc-ai-controls">
          <label class="vc-toggle-row">
            <span>Text overlay</span>
            <button class="vc-toggle" :class="{ on: aiShowOverlay }" @click="aiShowOverlay = !aiShowOverlay">
              <span class="vc-toggle-dot"></span>
            </button>
          </label>
          <div v-if="aiShowOverlay" class="vc-ai-text-controls">
            <textarea class="vc-textarea" v-model="aiOverlayText" placeholder="Text on image..." rows="2"></textarea>
            <div class="vc-pills">
              <button v-for="p in ['top','center','bottom']" :key="p" class="vc-pill" :class="{ active: aiTextPosition === p }" @click="aiTextPosition = p">{{ p }}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Template preview -->
      <div v-else class="vc-preview-wrap">
        <div class="vc-preview-scaler" :style="previewScale">
          <div ref="captureArea" :style="innerScale">
            <QuoteCard v-if="selectedType === 'quote'" ref="quoteRef"
              :quote="text" :author="author" :hashtags="hashtags"
              :bgColor="bgColor" :textColor="txtColor" :accentColor="accentColor"
              :style="cardStyle" :aspectRatio="aspectRatio" />
            <TweetCard v-if="selectedType === 'tweet'" ref="tweetRef"
              :text="text" :authorName="author" :handle="handle" :verified="true"
              :theme="tweetTheme" :aspectRatio="aspectRatio" />
            <TipCarousel v-if="selectedType === 'carousel'" ref="carouselRef"
              :title="carouselTitle" :steps="carouselSteps" :authorName="author"
              :bgColor="bgColor" :accentColor="accentColor" :textColor="txtColor"
              :aspectRatio="aspectRatio" :activeSlide="activeSlide" :slideImages="slideImages" />
            <PhotoText v-if="selectedType === 'photo'" ref="photoRef"
              :imageUrl="photoUrl" :text="text" :author="author"
              :textPosition="textPosition" :overlayOpacity="overlayOpacity"
              :aspectRatio="aspectRatio" />
          </div>
        </div>
      </div>

      <!-- Carousel slide nav -->
      <div v-if="selectedType === 'carousel'" class="vc-slide-nav">
        <button v-for="(s, i) in allCarouselSlides" :key="i" class="vc-slide-dot" :class="{ active: activeSlide === i }" @click="activeSlide = i">
          {{ i === 0 ? 'Cover' : i === allCarouselSlides.length - 1 ? 'CTA' : i }}
        </button>
      </div>
    </div>

    <!-- Step 4: Customize (collapsible) -->
    <details v-if="selectedType !== 'ai-image'" class="vc-customize">
      <summary class="vc-customize-toggle">Customize</summary>
      <div class="vc-customize-body">
        <!-- Style (quote only) -->
        <div v-if="selectedType === 'quote'" class="vc-row">
          <label class="vc-label">Style</label>
          <div class="vc-pills">
            <button v-for="s in ['minimal','elegant','bold','gradient']" :key="s" class="vc-pill" :class="{ active: cardStyle === s }" @click="cardStyle = s">{{ s }}</button>
          </div>
        </div>

        <!-- Theme (tweet only) -->
        <div v-if="selectedType === 'tweet'" class="vc-row">
          <label class="vc-label">Theme</label>
          <div class="vc-pills">
            <button v-for="t in ['dark','light']" :key="t" class="vc-pill" :class="{ active: tweetTheme === t }" @click="tweetTheme = t">{{ t }}</button>
          </div>
        </div>

        <!-- Text position (photo only) -->
        <div v-if="selectedType === 'photo'" class="vc-row">
          <label class="vc-label">Text Position</label>
          <div class="vc-pills">
            <button v-for="p in ['top','center','bottom']" :key="p" class="vc-pill" :class="{ active: textPosition === p }" @click="textPosition = p">{{ p }}</button>
          </div>
        </div>

        <!-- Aspect Ratio -->
        <div class="vc-row">
          <label class="vc-label">Size</label>
          <div class="vc-pills">
            <button v-for="r in ratios" :key="r.id" class="vc-pill" :class="{ active: aspectRatio === r.id }" @click="aspectRatio = r.id">{{ r.label }}</button>
          </div>
        </div>

        <!-- Colors (quote/carousel) -->
        <div v-if="selectedType === 'quote' || selectedType === 'carousel'" class="vc-row">
          <label class="vc-label">Colors</label>
          <div class="vc-color-row">
            <label class="vc-color-swatch" title="Background">
              <input type="color" v-model="bgColor" />
              <span class="vc-swatch" :style="{ background: bgColor }"></span>
              <span class="vc-swatch-label">BG</span>
            </label>
            <label class="vc-color-swatch" title="Accent">
              <input type="color" v-model="accentColor" />
              <span class="vc-swatch" :style="{ background: accentColor }"></span>
              <span class="vc-swatch-label">Accent</span>
            </label>
          </div>
        </div>
      </div>
    </details>

    <!-- Download -->
    <div class="vc-actions">
      <template v-if="selectedType === 'ai-image' && aiImageUrl">
        <button v-if="aiShowOverlay" class="vc-download-btn" @click="downloadAiWithOverlay" :disabled="downloading">
          {{ downloading ? 'Generating...' : 'Download with Text' }}
        </button>
        <a v-else :href="aiImageUrl" download="pawpost-ai-image.png" class="vc-download-btn">Download Image</a>
      </template>
      <template v-else-if="selectedType !== 'ai-image'">
        <button class="vc-download-btn" @click="downloadImage" :disabled="downloading">
          {{ downloading ? 'Generating...' : 'Download PNG' }}
        </button>
        <button v-if="selectedType === 'carousel'" class="vc-download-all-btn" @click="downloadAllSlides" :disabled="downloading">
          Download All Slides
        </button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { toPng } from 'html-to-image'
import QuoteCard from './templates/QuoteCard.vue'
import TweetCard from './templates/TweetCard.vue'
import TipCarousel from './templates/TipCarousel.vue'
import PhotoText from './templates/PhotoText.vue'

const props = defineProps({
  caption: { type: Object, default: null },
  profile: { type: Object, default: null },
  brandVoice: { type: Object, default: null },
  isPro: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false },
  overrideText: { type: String, default: '' },
})

defineEmits(['upgrade'])

const types = [
  { id: 'quote', icon: '🎨', label: 'Quote' },
  { id: 'tweet', icon: '𝕏', label: 'Tweet' },
  { id: 'carousel', icon: '📚', label: 'Carousel' },
  { id: 'photo', icon: '📷', label: 'Photo' },
  { id: 'ai-image', icon: '🤖', label: 'AI Image' },
]

const ratios = [
  { id: '1:1', label: 'Square' },
  { id: '4:5', label: 'Portrait' },
  { id: '9:16', label: 'Story' },
]

const selectedType = ref('quote')
const aspectRatio = ref('1:1')
const cardStyle = ref('minimal')
const tweetTheme = ref('dark')
const textPosition = ref('bottom')
const overlayOpacity = ref(0.6)
const activeSlide = ref(0)
const downloading = ref(false)
const quoteRef = ref(null)
const tweetRef = ref(null)
const carouselRef = ref(null)
const photoRef = ref(null)
const templateRef = computed(() => {
  if (selectedType.value === 'quote') return quoteRef.value
  if (selectedType.value === 'tweet') return tweetRef.value
  if (selectedType.value === 'carousel') return carouselRef.value
  if (selectedType.value === 'photo') return photoRef.value
  return null
})

// Auto-populate from props
const defaultText = computed(() => props.caption?.text || 'Your caption text here.')
const customText = ref('')
const text = computed(() => customText.value || defaultText.value)
const author = computed(() => props.profile?.businessName || 'Your Business')
const handle = computed(() => props.profile?.instagramHandle?.replace('@', '') || 'yourbusiness')
const hashtags = computed(() => props.caption?.hashtags || '')
const photoUrl = ref('')
const mediaSource = ref('suggested')

// AI Image generation
const aiPrompt = ref('')
const aiImageUrl = ref('')
const aiGenerating = ref(false)
const aiError = ref('')
const aiShowOverlay = ref(false)
const aiOverlayText = ref('')
const aiTextPosition = ref('bottom')
const aiCaptureRef = ref(null)

// Image generation usage limits
const IMAGE_LIMITS = { free: 2, premium: 10, pro: 30 }
const currentMonth = () => new Date().toISOString().slice(0, 7)

function getImageUsage() {
  try {
    const raw = localStorage.getItem('pawpost_image_usage')
    if (!raw) return { count: 0, month: currentMonth() }
    const data = JSON.parse(raw)
    if (data.month !== currentMonth()) return { count: 0, month: currentMonth() }
    return data
  } catch { return { count: 0, month: currentMonth() } }
}

function incrementImageUsage() {
  const usage = getImageUsage()
  usage.count++
  usage.month = currentMonth()
  localStorage.setItem('pawpost_image_usage', JSON.stringify(usage))
  imageUsageCount.value = usage.count
}

const userTier = computed(() => props.isPro ? 'pro' : props.isPremium ? 'premium' : 'free')
const imageLimit = computed(() => IMAGE_LIMITS[userTier.value])
const imageUsageCount = ref(getImageUsage().count)
const imagesRemaining = computed(() => Math.max(0, imageLimit.value - imageUsageCount.value))
const limitReached = computed(() => imageUsageCount.value >= imageLimit.value)

async function downloadAiWithOverlay() {
  if (!aiCaptureRef.value) return
  downloading.value = true
  try {
    const dataUrl = await toPng(aiCaptureRef.value, { pixelRatio: 2, cacheBust: true })
    const link = document.createElement('a')
    link.download = `pawpost-ai-image-${Date.now()}.png`
    link.href = dataUrl
    link.click()
  } catch (e) {
    console.error('AI image download failed:', e)
    alert('Failed to download. Try again.')
  }
  downloading.value = false
}

async function generateAiImage() {
  if (!aiPrompt.value.trim()) return
  if (limitReached.value) {
    aiError.value = 'You\'ve used all your AI images this month. Upgrade for more!'
    return
  }
  aiGenerating.value = true
  aiError.value = ''
  aiImageUrl.value = ''
  try {
    const res = await fetch('/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: aiPrompt.value.trim() })
    })
    const text = await res.text()
    let data
    try { data = JSON.parse(text) } catch { throw new Error('Server returned an invalid response. Please try again.') }
    if (!res.ok) throw new Error(data.error || 'Generation failed')
    if (!data.image) throw new Error('No image was returned. Try a different prompt.')
    aiImageUrl.value = data.image
    incrementImageUsage()
  } catch (e) {
    aiError.value = e.message || 'Failed to generate image'
  }
  aiGenerating.value = false
}

// Suggested photo from caption
const suggestedPhoto = computed(() => props.caption?.photo || '')
const photoHint = computed(() => props.caption?.imageIdea || 'Use a professional pet photo that matches your caption')

// Init custom text from caption or override
watch([() => props.caption, () => props.overrideText], ([c, override]) => {
  if (override) customText.value = override
  else if (c?.text) customText.value = c.text
}, { immediate: true })

// Editable carousel steps
const customSteps = ref([])
const slideImages = ref([])

const bgColor = ref('#1a1a2e')
const accentColor = ref('#f59e0b')
const txtColor = ref('#1a1a1a')

// Init colors from brand voice
watch(() => props.brandVoice, (bv) => {
  if (bv?.brandColors?.length) {
    bgColor.value = bv.brandColors[0] || '#1a1a2e'
    accentColor.value = bv.brandColors[1] || '#f59e0b'
  }
}, { immediate: true })

// Init photo URL from caption
watch(() => props.caption, (c) => {
  if (c?.photo) { photoUrl.value = c.photo; mediaSource.value = 'suggested' }
}, { immediate: true })

// Carousel data
const carouselTitle = computed(() => props.caption?.category || 'Pet Tips')
const carouselSteps = computed(() => customSteps.value.length >= 2 ? customSteps.value : ['Step one goes here.', 'Step two goes here.', 'Step three goes here.'])
const allCarouselSlides = computed(() => ['cover', ...carouselSteps.value, 'cta'])

// Init carousel steps from caption text
watch(() => props.caption, (c) => {
  const t = c?.text || ''
  const sentences = t.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 10)
  customSteps.value = sentences.length >= 2 ? sentences.slice(0, 5) : ['Step one goes here.', 'Step two goes here.', 'Step three goes here.']
}, { immediate: true })

// Reset active slide when switching types
watch(selectedType, () => { activeSlide.value = 0 })

// Preview scaling
const previewScale = computed(() => {
  const sizes = { '1:1': { w: 1080, h: 1080 }, '4:5': { w: 1080, h: 1350 }, '9:16': { w: 1080, h: 1920 } }
  const s = sizes[aspectRatio.value] || sizes['1:1']
  const maxW = 360
  const scale = maxW / s.w
  return {
    width: maxW + 'px',
    height: Math.round(s.h * scale) + 'px',
    overflow: 'hidden',
  }
})

const innerScale = computed(() => {
  const sizes = { '1:1': { w: 1080, h: 1080 }, '4:5': { w: 1080, h: 1350 }, '9:16': { w: 1080, h: 1920 } }
  const s = sizes[aspectRatio.value] || sizes['1:1']
  const maxW = 360
  const scale = maxW / s.w
  return {
    width: s.w + 'px',
    height: s.h + 'px',
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
  }
})

// Download
async function downloadImage() {
  if (!templateRef.value?.cardRef) return
  downloading.value = true
  try {
    const node = templateRef.value.cardRef
    const dataUrl = await toPng(node, { pixelRatio: 2, cacheBust: true })
    const link = document.createElement('a')
    link.download = `pawpost-${selectedType.value}-${Date.now()}.png`
    link.href = dataUrl
    link.click()
  } catch (e) {
    console.error('Download failed:', e)
    alert('Failed to generate image. Try a different photo or style.')
  }
  downloading.value = false
}

async function downloadAllSlides() {
  if (!templateRef.value?.cardRef) return
  downloading.value = true
  try {
    const total = allCarouselSlides.value.length
    for (let i = 0; i < total; i++) {
      activeSlide.value = i
      await new Promise(r => setTimeout(r, 300))
      const node = templateRef.value.cardRef
      const dataUrl = await toPng(node, { pixelRatio: 2, cacheBust: true })
      const link = document.createElement('a')
      link.download = `pawpost-carousel-${i + 1}.png`
      link.href = dataUrl
      link.click()
      await new Promise(r => setTimeout(r, 200))
    }
  } catch (e) {
    console.error('Carousel download failed:', e)
  }
  downloading.value = false
}
</script>

<style scoped>
.vc {
  background: #fff;
  border-radius: 16px;
  padding: 28px;
  border: 1px solid #e5e7eb;
  margin-top: 20px;
}

.vc-header { margin-bottom: 24px; }
.vc-title { font-size: 20px; font-weight: 800; margin: 0; color: #1a1a1a; }
.vc-subtitle { font-size: 14px; color: #6b7280; margin: 4px 0 0; }

/* Steps */
.vc-step { margin-bottom: 20px; }
.vc-step-label { display: block; font-size: 13px; font-weight: 700; color: #374151; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.03em; }

/* Type picker */
.vc-types { display: flex; gap: 8px; }
.vc-type-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  background: #fff;
  cursor: pointer;
  transition: all .15s;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
}
.vc-type-btn.active { border-color: #f59e0b; background: #fffbeb; color: #92400e; }
.vc-type-btn:hover { border-color: #fbbf24; }
.vc-type-icon { font-size: 24px; }

/* Inputs */
.vc-textarea {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  box-sizing: border-box;
  line-height: 1.5;
}
.vc-textarea:focus { outline: none; border-color: #f59e0b; box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1); }
.vc-input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  font-size: 14px;
  box-sizing: border-box;
}
.vc-input:focus { outline: none; border-color: #f59e0b; box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1); }
.vc-reset-btn { background: none; border: none; color: #f59e0b; font-size: 13px; cursor: pointer; padding: 4px 0; font-weight: 600; margin-top: 4px; }
.vc-hint { font-size: 13px; color: #9ca3af; margin: 6px 0 0; font-style: italic; }
.vc-error { color: #ef4444; font-size: 13px; margin-top: 8px; }

/* Usage bar */
.vc-usage-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.vc-usage-text { font-size: 13px; font-weight: 600; color: #6b7280; }
.vc-usage-tier { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 2px 8px; border-radius: 10px; background: #f3f4f6; color: #9ca3af; }
.vc-usage-meter { height: 4px; border-radius: 2px; background: #e5e7eb; margin-bottom: 12px; overflow: hidden; }
.vc-usage-fill { height: 100%; border-radius: 2px; background: #f59e0b; transition: width .3s; }

/* Limit reached */
.vc-limit-reached { text-align: center; padding: 24px 16px; background: #fffbeb; border-radius: 12px; border: 1px solid #fde68a; }
.vc-limit-msg { font-size: 15px; font-weight: 700; color: #92400e; margin: 0 0 6px; }
.vc-limit-sub { font-size: 13px; color: #b45309; margin: 0 0 14px; }
.vc-upgrade-btn { padding: 12px 28px; border-radius: 12px; background: linear-gradient(135deg, #f59e0b, #ea580c); color: #fff; font-size: 15px; font-weight: 700; border: none; cursor: pointer; transition: opacity .2s; }
.vc-upgrade-btn:hover { opacity: .9; }

/* Generate button */
.vc-generate-btn {
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f59e0b, #ea580c);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  margin-top: 10px;
  transition: opacity .2s;
}
.vc-generate-btn:hover { opacity: .9; }
.vc-generate-btn:disabled { opacity: .4; cursor: not-allowed; }

/* Carousel step editor */
.vc-step-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.vc-step-num { width: 26px; height: 26px; border-radius: 50%; background: #f59e0b; color: #fff; font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.vc-remove-btn { background: none; border: none; color: #ef4444; cursor: pointer; font-size: 18px; padding: 4px 8px; font-weight: 700; }
.vc-add-btn { background: none; border: 1px dashed #d1d5db; border-radius: 10px; padding: 8px; font-size: 13px; color: #6b7280; cursor: pointer; width: 100%; margin-top: 4px; }
.vc-add-btn:hover { border-color: #f59e0b; color: #f59e0b; }

/* Preview */
.vc-preview-wrap { background: #f3f4f6; border-radius: 12px; padding: 16px; display: flex; justify-content: center; overflow: hidden; }
.vc-preview-scaler { position: relative; overflow: hidden; border-radius: 8px; box-shadow: 0 4px 24px rgba(0,0,0,.1); }

/* Slide nav */
.vc-slide-nav { display: flex; gap: 6px; justify-content: center; margin-top: 12px; flex-wrap: wrap; }
.vc-slide-dot { padding: 4px 12px; border-radius: 20px; border: 1px solid #e5e7eb; background: #fff; font-size: 12px; font-weight: 600; cursor: pointer; color: #6b7280; }
.vc-slide-dot.active { background: #f59e0b; color: #fff; border-color: #f59e0b; }

/* AI Image */
.vc-ai-preview { margin-bottom: 12px; }
.vc-ai-img { width: 100%; border-radius: 12px; display: block; }
.vc-ai-wrap { position: relative; border-radius: 12px; overflow: hidden; }
.vc-ai-overlay { position: absolute; left: 0; right: 0; padding: 16px 20px; background: rgba(0,0,0,0.55); color: #fff; font-size: 16px; font-weight: 600; line-height: 1.4; text-align: center; }
.vc-ai-overlay p { margin: 0; }
.vc-ai-pos-top { top: 0; }
.vc-ai-pos-center { top: 50%; transform: translateY(-50%); }
.vc-ai-pos-bottom { bottom: 0; }
.vc-ai-controls { margin-top: 12px; }
.vc-ai-text-controls { margin-top: 10px; display: flex; flex-direction: column; gap: 8px; }

/* Toggle */
.vc-toggle-row { display: flex; align-items: center; justify-content: space-between; font-size: 14px; font-weight: 600; color: #374151; cursor: pointer; }
.vc-toggle { width: 44px; height: 24px; border-radius: 12px; border: none; background: #d1d5db; cursor: pointer; position: relative; transition: background .2s; padding: 0; }
.vc-toggle.on { background: #f59e0b; }
.vc-toggle-dot { position: absolute; top: 2px; left: 2px; width: 20px; height: 20px; border-radius: 50%; background: #fff; transition: transform .2s; box-shadow: 0 1px 3px rgba(0,0,0,.2); }
.vc-toggle.on .vc-toggle-dot { transform: translateX(20px); }

/* Customize accordion */
.vc-customize { margin-bottom: 16px; }
.vc-customize-toggle {
  font-size: 14px;
  font-weight: 700;
  color: #6b7280;
  cursor: pointer;
  padding: 10px 0;
  list-style: none;
  user-select: none;
}
.vc-customize-toggle::marker { display: none; }
.vc-customize-toggle::-webkit-details-marker { display: none; }
.vc-customize-toggle::before { content: '⚙ '; }
.vc-customize[open] .vc-customize-toggle { color: #374151; }
.vc-customize-body { padding-top: 12px; display: flex; flex-direction: column; gap: 14px; }

/* Controls */
.vc-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.vc-label { font-size: 13px; font-weight: 600; color: #6b7280; min-width: 80px; }
.vc-pills { display: flex; gap: 6px; flex-wrap: wrap; }
.vc-pill { padding: 6px 14px; border-radius: 20px; border: 1px solid #e5e7eb; background: #fff; font-size: 13px; font-weight: 600; cursor: pointer; text-transform: capitalize; color: #6b7280; transition: all .15s; }
.vc-pill.active { background: #1e293b; color: #fff; border-color: #1e293b; }
.vc-pill:hover { border-color: #9ca3af; }

.vc-color-row { display: flex; gap: 12px; }
.vc-color-swatch { cursor: pointer; position: relative; display: flex; flex-direction: column; align-items: center; gap: 4px; }
.vc-color-swatch input { position: absolute; opacity: 0; width: 0; height: 0; }
.vc-swatch { display: block; width: 36px; height: 36px; border-radius: 10px; border: 2px solid #e5e7eb; }
.vc-swatch-label { font-size: 11px; font-weight: 600; color: #9ca3af; }

/* Actions */
.vc-actions { display: flex; gap: 8px; flex-wrap: wrap; }
.vc-download-btn {
  flex: 1;
  padding: 14px;
  border-radius: 12px;
  background: #1e293b;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  display: block;
  transition: background .15s;
}
.vc-download-btn:hover { background: #334155; }
.vc-download-btn:disabled { opacity: .4; cursor: wait; }
.vc-download-all-btn {
  padding: 14px 20px;
  border-radius: 12px;
  background: #f59e0b;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: background .15s;
}
.vc-download-all-btn:hover { background: #d97706; }
.vc-download-all-btn:disabled { opacity: .4; cursor: wait; }

/* Dark mode */
:global(.dark) .vc { background: #1e293b; border-color: #334155; }
:global(.dark) .vc-title { color: #f1f5f9; }
:global(.dark) .vc-subtitle { color: #94a3b8; }
:global(.dark) .vc-step-label { color: #94a3b8; }
:global(.dark) .vc-type-btn { background: #0f172a; border-color: #334155; color: #94a3b8; }
:global(.dark) .vc-type-btn.active { background: #451a03; border-color: #f59e0b; color: #fbbf24; }
:global(.dark) .vc-preview-wrap { background: #0f172a; }
:global(.dark) .vc-pill { background: #0f172a; border-color: #334155; color: #94a3b8; }
:global(.dark) .vc-pill.active { background: #f59e0b; color: #000; border-color: #f59e0b; }
:global(.dark) .vc-label { color: #94a3b8; }
:global(.dark) .vc-input { background: #0f172a; border-color: #334155; color: #e2e8f0; }
:global(.dark) .vc-textarea { background: #0f172a; border-color: #334155; color: #e2e8f0; }
:global(.dark) .vc-slide-dot { background: #0f172a; border-color: #334155; color: #94a3b8; }
:global(.dark) .vc-customize-toggle { color: #94a3b8; }
:global(.dark) .vc-toggle-row { color: #e2e8f0; }
:global(.dark) .vc-hint { color: #64748b; }
:global(.dark) .vc-add-btn { border-color: #334155; color: #94a3b8; }
:global(.dark) .vc-usage-text { color: #94a3b8; }
:global(.dark) .vc-usage-tier { background: #334155; color: #64748b; }
:global(.dark) .vc-usage-meter { background: #334155; }
:global(.dark) .vc-limit-reached { background: #451a03; border-color: #92400e; }
:global(.dark) .vc-limit-msg { color: #fbbf24; }
:global(.dark) .vc-limit-sub { color: #f59e0b; }

@media (max-width: 640px) {
  .vc { padding: 18px; }
  .vc-type-btn { padding: 10px 6px; font-size: 11px; }
  .vc-type-icon { font-size: 20px; }
  .vc-row { flex-direction: column; align-items: flex-start; }
  .vc-label { min-width: unset; }
}
</style>
