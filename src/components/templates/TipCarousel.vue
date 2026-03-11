<template>
  <div ref="cardRef" class="carousel-wrap">
    <div v-for="(slide, i) in allSlides" :key="i" class="carousel-slide" :style="slideStyle(i)">

      <!-- Background image (if provided for this slide) -->
      <img v-if="getSlideImage(i)" :src="getSlideImage(i)" class="cs-bg-img" alt="" />
      <div v-if="getSlideImage(i)" class="cs-bg-overlay"></div>

      <!-- Cover slide -->
      <template v-if="i === 0">
        <div class="cs-badge" :style="badgeStyle(i)">{{ hashtag || category }}</div>
        <h1 class="cs-title" :style="textStyle(i)">{{ title }}</h1>
        <p class="cs-subtitle" :style="subStyle(i)">Swipe to learn more →</p>
        <div class="cs-author">
          <div class="cs-avatar" :style="{ background: accentColor }">{{ authorName?.[0] || '🐾' }}</div>
          <span :style="subStyle(i)">{{ authorName }}</span>
        </div>
        <div class="cs-dots">
          <span v-for="d in allSlides.length" :key="d" class="cs-dot" :class="{ active: d === 1 }" :style="d === 1 ? { background: accentColor } : {}"></span>
        </div>
      </template>

      <!-- Content slides -->
      <template v-else-if="i < allSlides.length - 1">
        <div class="cs-step-num" :style="{ background: accentColor }">{{ i }}</div>
        <p class="cs-step-text" :style="textStyle(i)">{{ slide }}</p>
        <div class="cs-page" :style="subStyle(i)">{{ i }}/{{ steps.length }}</div>
        <div class="cs-dots">
          <span v-for="d in allSlides.length" :key="d" class="cs-dot" :class="{ active: d === i + 1 }" :style="d === i + 1 ? { background: accentColor } : {}"></span>
        </div>
      </template>

      <!-- CTA slide -->
      <template v-else>
        <div class="cs-cta-icon">🐾</div>
        <h2 class="cs-cta-title" :style="textStyle(i)">Follow for more tips!</h2>
        <p class="cs-cta-sub" :style="subStyle(i)">{{ authorName }}</p>
        <div class="cs-cta-btn" :style="{ background: accentColor, color: '#fff' }">Follow</div>
        <div class="cs-dots">
          <span v-for="d in allSlides.length" :key="d" class="cs-dot" :class="{ active: d === allSlides.length }" :style="d === allSlides.length ? { background: accentColor } : {}"></span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  title: { type: String, default: 'Pet Care Tips' },
  steps: { type: Array, default: () => ['Step one goes here.', 'Step two goes here.', 'Step three goes here.'] },
  authorName: { type: String, default: 'Your Business' },
  hashtag: { type: String, default: '' },
  category: { type: String, default: '#PetTips' },
  bgColor: { type: String, default: '#ffffff' },
  accentColor: { type: String, default: '#f59e0b' },
  textColor: { type: String, default: '#1a1a1a' },
  aspectRatio: { type: String, default: '1:1' },
  activeSlide: { type: Number, default: 0 },
  slideImages: { type: Array, default: () => [] }, // Array of image URLs per slide index
})

const cardRef = ref(null)

const sizes = { '1:1': { w: 1080, h: 1080 }, '4:5': { w: 1080, h: 1350 }, '9:16': { w: 1080, h: 1920 } }
const size = computed(() => sizes[props.aspectRatio] || sizes['1:1'])

const allSlides = computed(() => ['cover', ...props.steps, 'cta'])

defineExpose({ cardRef, allSlides })

function getSlideImage(i) {
  return props.slideImages[i] || ''
}

function slideStyle(i) {
  return {
    width: size.value.w + 'px',
    height: size.value.h + 'px',
    background: getSlideImage(i) ? '#000' : props.bgColor,
    display: i === props.activeSlide ? 'flex' : 'none',
  }
}

function textStyle(i) {
  return { color: getSlideImage(i) ? '#ffffff' : props.textColor }
}

function subStyle(i) {
  return { color: getSlideImage(i) ? 'rgba(255,255,255,0.7)' : props.textColor + '88' }
}

function badgeStyle(i) {
  return getSlideImage(i)
    ? { background: 'rgba(255,255,255,0.15)', color: '#fff', backdropFilter: 'blur(8px)' }
    : { background: props.accentColor + '22', color: props.accentColor }
}
</script>

<style scoped>
.carousel-wrap { display: inline-block; }
.carousel-slide {
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 72px;
  box-sizing: border-box;
  font-family: 'Inter', system-ui, sans-serif;
  position: relative;
  gap: 24px;
  overflow: hidden;
}

/* Background image support */
.cs-bg-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; }
.cs-bg-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6)); z-index: 1; }
.carousel-slide > :not(.cs-bg-img):not(.cs-bg-overlay) { position: relative; z-index: 2; }

.cs-badge { display: inline-block; padding: 8px 20px; border-radius: 20px; font-size: 18px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
.cs-title { font-size: 56px; font-weight: 800; line-height: 1.2; text-align: center; max-width: 90%; text-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.cs-subtitle { font-size: 22px; font-weight: 500; }
.cs-author { display: flex; align-items: center; gap: 12px; margin-top: 20px; }
.cs-avatar { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; color: #fff; }

.cs-step-num { width: 72px; height: 72px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 800; color: #fff; }
.cs-step-text { font-size: 36px; line-height: 1.5; text-align: center; font-weight: 500; max-width: 85%; text-shadow: 0 1px 4px rgba(0,0,0,0.1); }
.cs-page { font-size: 16px; font-weight: 600; position: absolute; top: 40px; right: 48px; z-index: 2; }

.cs-cta-icon { font-size: 64px; }
.cs-cta-title { font-size: 44px; font-weight: 800; text-align: center; }
.cs-cta-sub { font-size: 22px; }
.cs-cta-btn { padding: 16px 48px; border-radius: 30px; font-size: 20px; font-weight: 700; margin-top: 12px; }

.cs-dots { display: flex; gap: 8px; position: absolute; bottom: 40px; z-index: 2; }
.cs-dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(128,128,128,0.25); }
.cs-dot.active { width: 28px; border-radius: 5px; }
</style>
