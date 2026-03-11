<template>
  <div ref="cardRef" class="pt" :style="cardStyle">
    <!-- Background image -->
    <img :src="imageUrl" class="pt-img" :alt="text" crossorigin="anonymous" />

    <!-- Gradient overlay -->
    <div class="pt-overlay" :class="`pt-overlay--${textPosition}`" :style="{ opacity: overlayOpacity }"></div>

    <!-- Text content -->
    <div class="pt-content" :class="`pt-content--${textPosition}`">
      <p class="pt-text">{{ displayText }}</p>
      <div class="pt-author">
        <span class="pt-paw">🐾</span>
        <span>{{ author }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  imageUrl: { type: String, default: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1080&h=1080&fit=crop' },
  text: { type: String, default: 'Your caption text will appear over the photo.' },
  author: { type: String, default: 'Your Business' },
  textPosition: { type: String, default: 'bottom' }, // top, center, bottom
  overlayOpacity: { type: Number, default: 0.6 },
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

const displayText = computed(() => {
  const max = 200
  return props.text.length > max ? props.text.substring(0, max - 3) + '...' : props.text
})
</script>

<style scoped>
.pt { position: relative; overflow: hidden; background: #000; }
.pt-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }

.pt-overlay { position: absolute; inset: 0; }
.pt-overlay--bottom { background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 40%, transparent 70%); }
.pt-overlay--top { background: linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 40%, transparent 70%); }
.pt-overlay--center { background: rgba(0,0,0,0.5); }

.pt-content { position: absolute; left: 0; right: 0; padding: 60px 72px; color: #fff; font-family: 'Inter', system-ui, sans-serif; }
.pt-content--bottom { bottom: 0; }
.pt-content--top { top: 0; }
.pt-content--center { top: 50%; transform: translateY(-50%); text-align: center; }

.pt-text { font-size: 36px; font-weight: 700; line-height: 1.4; text-shadow: 0 2px 8px rgba(0,0,0,0.3); margin-bottom: 20px; }
.pt-author { display: flex; align-items: center; gap: 10px; font-size: 20px; font-weight: 500; opacity: 0.85; }
.pt-paw { font-size: 24px; }
</style>
