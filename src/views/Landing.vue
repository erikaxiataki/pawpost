<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

/* ---- Calculator ---- */
const hoursPerWeek = ref(3)
const calcYearly = computed(() => hoursPerWeek.value * 52)
const calcMonthly = computed(() => hoursPerWeek.value * 4)
const calcDollar = computed(() => hoursPerWeek.value * 52 * 25)

/* Animated counter */
const displayYearly = ref(156)
const displayDollar = ref(3900)
function animateCounter(target, current, setter, duration = 600) {
  const start = current
  const diff = target - start
  const startTime = performance.now()
  function tick(now) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    setter(Math.round(start + diff * eased))
    if (progress < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}
watch(calcYearly, (v) => animateCounter(v, displayYearly.value, (n) => { displayYearly.value = n }))
watch(calcDollar, (v) => animateCounter(v, displayDollar.value, (n) => { displayDollar.value = n }))

/* ---- Caption carousel ---- */
const activeCaptionIdx = ref(0)
const sampleCaptions = [
  {
    day: 'Monday',
    theme: 'Motivation Monday',
    emoji: '💪',
    biz: 'Dog Groomer',
    caption: 'Monday mood: that look your dog gives you when they realize they\'re at the groomer, not the park. Don\'t worry buddy, you\'ll thank us later! 😂🐕',
    hashtags: ['#DogGrooming', '#MondayMood', '#GroomerLife'],
    photo: 'Before & after groom reveal — side-by-side shot',
  },
  {
    day: 'Wednesday',
    theme: 'Wisdom Wednesday',
    emoji: '🧠',
    biz: 'Dog Trainer',
    caption: 'Quick tip: If your pup pulls on leash, stop walking. Wait for slack, then move forward. Consistency is the secret — not fancy equipment. You\'ve got this! 🐾',
    hashtags: ['#DogTraining', '#PuppyTips', '#WisdomWednesday'],
    photo: 'Short clip of the leash technique in action',
  },
  {
    day: 'Friday',
    theme: 'Feel-Good Friday',
    emoji: '🥰',
    biz: 'Pet Sitter',
    caption: 'This week\'s highlight: Mr. Whiskers finally trusted me enough to nap on my lap. 6 visits in and we\'re officially besties. This job is the best. 🐱💛',
    hashtags: ['#PetSitter', '#CatLove', '#FeelGoodFriday'],
    photo: 'Candid photo of you with the pet, cozy and real',
  },
  {
    day: 'Saturday',
    theme: 'Behind the Scenes',
    emoji: '🎬',
    biz: 'Daycare Owner',
    caption: 'Saturday morning at the daycare: 12 zoomies, 4 nap piles, 1 shoe theft, and zero regrets. This is what 5 stars looks like behind the scenes! 🐶✨',
    hashtags: ['#DogDaycare', '#BTS', '#DogLife'],
    photo: 'Action shot of group play — candid, slightly chaotic',
  },
]
let captionTimer = null

function nextCaption() {
  activeCaptionIdx.value = (activeCaptionIdx.value + 1) % sampleCaptions.length
}
function pickCaption(i) {
  activeCaptionIdx.value = i
  resetCaptionTimer()
}
function resetCaptionTimer() {
  clearInterval(captionTimer)
  captionTimer = setInterval(nextCaption, 5000)
}

/* ---- Floating paws ---- */
const floatingPaws = ref([])
function spawnPaws() {
  const pawEmojis = ['🐾', '🐶', '🐱', '🐕', '✨', '🐾', '💛', '🐾']
  floatingPaws.value = Array.from({ length: 12 }, (_, i) => ({
    emoji: pawEmojis[i % pawEmojis.length],
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 6 + Math.random() * 8,
    size: 0.8 + Math.random() * 1.2,
    wobble: Math.random() > 0.5,
  }))
}

/* ---- Confetti ---- */
const confettiPieces = ref([])
const showConfetti = ref(false)
function triggerConfetti() {
  showConfetti.value = true
  confettiPieces.value = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    emoji: ['🐾', '🎉', '✨', '🐶', '🐱', '💛', '🎊', '⭐'][i % 8],
    left: 35 + Math.random() * 30,
    angle: -60 + Math.random() * 120,
    velocity: 300 + Math.random() * 400,
    delay: Math.random() * 0.3,
    rotation: Math.random() * 720 - 360,
  }))
  setTimeout(() => { showConfetti.value = false }, 2500)
}

function goToOnboarding() {
  triggerConfetti()
  setTimeout(() => router.push('/onboarding'), 900)
}

/* ---- Scroll reveal ---- */
const observed = ref(new Set())
let observer = null

function setupObserver() {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          observed.value.add(e.target.dataset.reveal)
          observed.value = new Set(observed.value)
          observer.unobserve(e.target)
        }
      })
    },
    { threshold: 0.12 }
  )
  document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el))
}

function isVisible(id) {
  return observed.value.has(id)
}

/* ---- Pill hover wiggle ---- */
const wigglePill = ref(-1)

/* ---- Rotating Typewriter effect ---- */
const typewriterText = ref('')
const typewriterPhrase = ref(0)
const isDeleting = ref(false)
const rotatingPhrases = [
  'Start posting.',
  'Start booking.',
  'Start standing out.',
  'Get your weekends back.',
  'Let AI do the work.',
  'Go walk some dogs.',
]
function startTypewriter() {
  let charIdx = 0
  let phraseIdx = 0
  const typeSpeed = 70
  const deleteSpeed = 40
  const pauseAfterType = 2000
  const pauseAfterDelete = 400

  function tick() {
    const currentPhrase = rotatingPhrases[phraseIdx]
    if (!isDeleting.value) {
      // Typing
      charIdx++
      typewriterText.value = currentPhrase.slice(0, charIdx)
      if (charIdx >= currentPhrase.length) {
        // Pause, then start deleting
        isDeleting.value = true
        setTimeout(tick, pauseAfterType)
        return
      }
      setTimeout(tick, typeSpeed + Math.random() * 40)
    } else {
      // Deleting
      charIdx--
      typewriterText.value = currentPhrase.slice(0, charIdx)
      if (charIdx <= 0) {
        isDeleting.value = false
        phraseIdx = (phraseIdx + 1) % rotatingPhrases.length
        typewriterPhrase.value = phraseIdx
        setTimeout(tick, pauseAfterDelete)
        return
      }
      setTimeout(tick, deleteSpeed)
    }
  }
  setTimeout(tick, 800)
}

/* ---- Copy to clipboard ---- */
const copiedCaption = ref(false)
function copyCaption() {
  const c = sampleCaptions[activeCaptionIdx.value]
  const text = `${c.caption}\n\n${c.hashtags.join(' ')}`
  navigator.clipboard.writeText(text).then(() => {
    copiedCaption.value = true
    setTimeout(() => { copiedCaption.value = false }, 2000)
  })
}


/* ---- Before/After interactive toggle ---- */
const showAfter = ref(false)

/* ---- Testimonial flip ---- */
const flippedCard = ref(-1)
function toggleFlip(i) {
  flippedCard.value = flippedCard.value === i ? -1 : i
}

/* ---- Mouse parallax on hero ---- */
const mouseX = ref(0)
const mouseY = ref(0)
function handleMouseMove(e) {
  const x = (e.clientX / window.innerWidth - 0.5) * 2
  const y = (e.clientY / window.innerHeight - 0.5) * 2
  mouseX.value = x
  mouseY.value = y
}

/* ---- Lead Capture Popup ---- */
const showPopup = ref(false)
const popupEmail = ref('')
const popupSubmitted = ref(false)
const popupDismissed = ref(false)
let popupTimer = null

function storeEmail(email) {
  const leads = JSON.parse(localStorage.getItem('pawpost_leads') || '[]')
  if (!leads.includes(email)) {
    leads.push(email)
    localStorage.setItem('pawpost_leads', JSON.stringify(leads))
  }
}

function submitPopup() {
  if (!popupEmail.value || !popupEmail.value.includes('@')) return
  storeEmail(popupEmail.value)
  popupSubmitted.value = true
  triggerConfetti()
  localStorage.setItem('pawpost_popup_dismissed', 'true')
  setTimeout(() => { showPopup.value = false }, 3500)
}

function dismissPopup() {
  showPopup.value = false
  popupDismissed.value = true
  localStorage.setItem('pawpost_popup_dismissed', 'true')
}

function handlePopupOverlayClick(e) {
  if (e.target === e.currentTarget) dismissPopup()
}

function initPopup() {
  const dismissed = localStorage.getItem('pawpost_popup_dismissed')
  if (!dismissed) {
    popupTimer = setTimeout(() => {
      showPopup.value = true
    }, 8000)
  }
}

/* ---- Inline Newsletter ---- */
const newsletterEmail = ref('')
const newsletterSubmitted = ref(false)

function submitNewsletter() {
  if (!newsletterEmail.value || !newsletterEmail.value.includes('@')) return
  storeEmail(newsletterEmail.value)
  newsletterSubmitted.value = true
  triggerConfetti()
}

/* ---- Popup floating paws ---- */
const popupPaws = ref([])
function spawnPopupPaws() {
  const emojis = ['🐾', '✨', '💛', '🐶', '🐱', '⭐']
  popupPaws.value = Array.from({ length: 8 }, (_, i) => ({
    emoji: emojis[i % emojis.length],
    left: 5 + Math.random() * 90,
    delay: Math.random() * 5,
    duration: 4 + Math.random() * 4,
    size: 0.6 + Math.random() * 0.6,
  }))
}

onMounted(() => {
  spawnPaws()
  spawnPopupPaws()
  startTypewriter()
  resetCaptionTimer()
  initPopup()
  setTimeout(setupObserver, 100)
  window.addEventListener('mousemove', handleMouseMove)
})
onUnmounted(() => {
  clearInterval(captionTimer)
  clearTimeout(popupTimer)
  if (observer) observer.disconnect()
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<template>
  <div class="pp-landing">

    <!-- ======== NAV ======== -->
    <nav class="pp-nav">
      <div class="pp-nav-inner">
        <div class="pp-logo" @click="router.push('/')">
          <span class="pp-logo-paw">🐾</span>
          <span class="pp-logo-text">PawPost <span class="pp-logo-ai">AI</span></span>
        </div>
        <button class="pp-nav-cta" @click="goToOnboarding">
          Get Started Free
        </button>
      </div>
    </nav>

    <!-- ======== HERO ======== -->
    <section class="pp-hero" @mousemove="handleMouseMove">
      <div class="pp-hero-grain"></div>
      <div class="pp-hero-glow pp-hero-glow--1" :style="{ transform: `translate(${mouseX * 20}px, ${mouseY * 15}px)` }"></div>
      <div class="pp-hero-glow pp-hero-glow--2" :style="{ transform: `translate(${mouseX * -15}px, ${mouseY * -10}px)` }"></div>

      <!-- Floating paw emojis -->
      <div class="pp-floating-paws">
        <span
          v-for="(p, i) in floatingPaws"
          :key="i"
          class="pp-float-paw"
          :class="{ 'pp-float-wobble': p.wobble }"
          :style="{
            left: p.left + '%',
            animationDelay: p.delay + 's',
            animationDuration: p.duration + 's',
            fontSize: p.size + 'rem',
          }"
        >{{ p.emoji }}</span>
      </div>

      <div class="pp-hero-content">
        <!-- Badge -->
        <div class="pp-hero-badge animate-in">
          Built for pet businesses in Canada 🇨🇦
        </div>

        <h1 class="pp-hero-h1 animate-in d1">
          Stop writing captions.<br>
          <em class="pp-hero-em">
            {{ typewriterText }}<span class="pp-cursor">|</span>
          </em>
        </h1>

        <p class="pp-hero-sub animate-in d2">
          30 days of social media captions for your pet business, generated in 60 seconds.
          Captions that actually sound like <strong>you</strong>, not a robot!
        </p>

        <div class="pp-hero-pills animate-in d2">
          <span
            v-for="(pill, pi) in [
              { emoji: '✂️', label: 'Groomers' },
              { emoji: '🦮', label: 'Walkers' },
              { emoji: '🎾', label: 'Trainers' },
              { emoji: '🏠', label: 'Sitters' },
              { emoji: '🐕', label: 'Daycares' },
              { emoji: '🩺', label: 'Vet Clinics' },
            ]"
            :key="pi"
            class="pp-pill"
            :class="{ 'pp-pill-wiggle': wigglePill === pi }"
            @mouseenter="wigglePill = pi"
            @mouseleave="wigglePill = -1"
          >
            <span class="pp-pill-emoji">{{ pill.emoji }}</span> {{ pill.label }}
          </span>
        </div>

        <div class="pp-hero-actions animate-in d3">
          <button class="pp-btn-primary pp-btn-bounce" @click="goToOnboarding">
            Generate My Free Caption Pack →
          </button>
          <span class="pp-hero-note">No credit card required. Takes 60 seconds.</span>
        </div>

        <!-- Hero caption preview card -->
        <div class="pp-hero-card animate-in d4">
          <div class="pp-hero-card-shimmer"></div>
          <div class="pp-hero-card-header">
            <div class="pp-hero-card-avatar">✂️</div>
            <div>
              <p class="pp-hero-card-biz">Pawfect Grooming</p>
              <p class="pp-hero-card-meta">Monday · Instagram · <span class="pp-card-status">Ready to post</span></p>
            </div>
          </div>
          <p class="pp-hero-card-text">Monday mood: that look your dog gives you when they realize they're at the groomer, not the park. Don't worry buddy, you'll thank us later! 😂🐕</p>
          <div class="pp-hero-card-tags">
            <span>#DogGrooming</span>
            <span>#MondayMood</span>
            <span>#GroomerLife</span>
            <span class="pp-card-photo">📸 Photo idea included</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ======== MARQUEE ======== -->
    <div class="pp-marquee-wrap">
      <div class="pp-marquee">
        <span class="pp-marquee-track">
          GROOMERS · WALKERS · TRAINERS · SITTERS · DAYCARES · VET CLINICS · PET PHOTOGRAPHERS · PET STORES ·
          GROOMERS · WALKERS · TRAINERS · SITTERS · DAYCARES · VET CLINICS · PET PHOTOGRAPHERS · PET STORES ·
        </span>
      </div>
    </div>

    <!-- ======== CAPTION FATIGUE CALCULATOR ======== -->
    <section class="pp-calc" data-reveal="calc" :class="{ visible: isVisible('calc') }">
      <div class="pp-calc-inner">
        <div class="pp-calc-left">
          <h2 class="pp-section-h2">You're burning<br><em>real money</em> on captions</h2>
          <p class="pp-section-sub">Every hour you spend staring at a blank caption box is an hour you're not grooming, training, or booking clients.</p>
        </div>
        <div class="pp-calc-right">
          <div class="pp-calc-box">
            <label class="pp-calc-label">Hours per week on captions</label>
            <div class="pp-calc-btns">
              <button
                v-for="h in [1, 2, 3, 4, 5]"
                :key="h"
                :class="['pp-calc-btn', hoursPerWeek === h && 'active']"
                @click="hoursPerWeek = h"
              >
                {{ h }}{{ h === 5 ? '+' : '' }}hr
              </button>
            </div>
            <div class="pp-calc-result">
              <div class="pp-calc-result-row">
                <span class="pp-calc-result-num pp-num-pop" :key="'y-' + calcYearly">{{ displayYearly }}</span>
                <span class="pp-calc-result-unit">hours wasted per year</span>
              </div>
              <p class="pp-calc-result-msg">
                That's <strong>{{ calcMonthly }} hours every month</strong> — gone.
              </p>
              <p class="pp-calc-result-cost">
                At $25/hr, you're losing <strong>${{ displayDollar.toLocaleString() }}/year</strong>.
              </p>
              <p class="pp-calc-result-fix">
                PawPost does it in <strong>60 seconds</strong>. For <strong>less than $1/day</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ======== DIVIDER ======== -->
    <div class="pp-wave pp-wave--cream">
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none"><path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,20 1440,30 L1440,60 L0,60 Z" fill="#FFFBF5"/></svg>
    </div>

    <!-- ======== BEFORE / AFTER (Interactive Toggle) ======== -->
    <section class="pp-transform" data-reveal="transform" :class="{ visible: isVisible('transform') }">
      <h2 class="pp-section-h2 pp-center">Two realities. <em>Pick one.</em></h2>
      <p class="pp-section-sub pp-center">This is what changes when you stop doing it all yourself.</p>

      <!-- Interactive toggle switch -->
      <div class="pp-toggle-wrap">
        <button :class="['pp-toggle-option', !showAfter && 'active']" @click="showAfter = false">
          Without PawPost
        </button>
        <button :class="['pp-toggle-option pp-toggle-option--good', showAfter && 'active']" @click="showAfter = true">
          With PawPost AI
        </button>
      </div>

      <Transition name="transform-swap" mode="out-in">
        <div v-if="!showAfter" key="before" class="pp-transform-single pp-transform-before">
          <ul class="pp-transform-list">
            <li><span class="pp-x">✗</span> Sunday night blank-screen paralysis</li>
            <li><span class="pp-x">✗</span> Post once, ghost for two weeks, repeat</li>
            <li><span class="pp-x">✗</span> Captions that sound corporate and lifeless</li>
            <li><span class="pp-x">✗</span> Zero idea what photo to pair with your post</li>
            <li><span class="pp-x">✗</span> Competitors outposting you 5:1</li>
          </ul>
          <div class="pp-transform-nudge">
            Toggle right to see the difference →
          </div>
        </div>
        <div v-else key="after" class="pp-transform-single pp-transform-after">
          <ul class="pp-transform-list">
            <li><span class="pp-check">✓</span> 30 days of content, generated in 60 seconds</li>
            <li><span class="pp-check">✓</span> Daily posts that build trust and bookings</li>
            <li><span class="pp-check">✓</span> Your voice, your personality, your brand</li>
            <li><span class="pp-check">✓</span> Photo ideas paired with every caption</li>
            <li><span class="pp-check">✓</span> Consistent presence that attracts new clients</li>
          </ul>
          <div class="pp-transform-cta">
            <button class="pp-btn-primary pp-btn-bounce" @click="goToOnboarding">
              Start for free →
            </button>
          </div>
        </div>
      </Transition>
    </section>

    <!-- ======== HOW IT WORKS ======== -->
    <section class="pp-steps" data-reveal="steps" :class="{ visible: isVisible('steps') }">
      <h2 class="pp-section-h2 pp-center">60 seconds. 30 days of content.</h2>
      <p class="pp-section-sub pp-center">Three steps. No learning curve. No templates to customize.</p>
      <div class="pp-steps-grid">
        <div class="pp-step pp-step-hover">
          <div class="pp-step-num">1</div>
          <div class="pp-step-icon">📋</div>
          <h3 class="pp-step-title">Describe your business</h3>
          <p class="pp-step-desc">60-second quiz — your services, your tone, your audience. Done.</p>
        </div>
        <div class="pp-step-arrow">→</div>
        <div class="pp-step pp-step-hover">
          <div class="pp-step-num">2</div>
          <div class="pp-step-icon">⚡</div>
          <h3 class="pp-step-title">AI generates your month</h3>
          <p class="pp-step-desc">30 unique captions, hashtags, and photo ideas — written in your voice.</p>
        </div>
        <div class="pp-step-arrow">→</div>
        <div class="pp-step pp-step-hover">
          <div class="pp-step-num">3</div>
          <div class="pp-step-icon">📱</div>
          <h3 class="pp-step-title">Copy. Post. Move on.</h3>
          <p class="pp-step-desc">Open your calendar, tap to copy, paste into Instagram. That's it.</p>
        </div>
      </div>
      <div class="pp-center" style="margin-top: 2.5rem;">
        <button class="pp-btn-primary pp-btn-bounce" @click="goToOnboarding">
          Try it free →
        </button>
      </div>
    </section>

    <!-- ======== DIVIDER ======== -->
    <div class="pp-wave pp-wave--warm">
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none"><path d="M0,20 C240,60 480,0 720,30 C960,60 1200,10 1440,40 L1440,60 L0,60 Z" fill="#FFFBF5"/></svg>
    </div>

    <!-- ======== LIVE CAPTION PREVIEW ======== -->
    <section class="pp-preview" data-reveal="preview" :class="{ visible: isVisible('preview') }">
      <h2 class="pp-section-h2 pp-center">This is what you get.</h2>
      <p class="pp-section-sub pp-center">Real captions. For real pet businesses. Ready to post.</p>
      <div class="pp-preview-wrap">
        <div class="pp-preview-tabs">
          <button
            v-for="(c, i) in sampleCaptions"
            :key="i"
            :class="['pp-preview-tab', activeCaptionIdx === i && 'active']"
            @click="pickCaption(i)"
          >
            <span class="pp-preview-tab-emoji">{{ c.emoji }}</span>
            <span class="pp-preview-tab-day">{{ c.day }}</span>
          </button>
        </div>
        <Transition name="caption-fade" mode="out-in">
          <div class="pp-preview-card" :key="activeCaptionIdx">
            <div class="pp-preview-card-head">
              <span class="pp-preview-card-theme">{{ sampleCaptions[activeCaptionIdx].emoji }} {{ sampleCaptions[activeCaptionIdx].theme }}</span>
              <span class="pp-preview-card-biz">{{ sampleCaptions[activeCaptionIdx].biz }}</span>
            </div>
            <p class="pp-preview-card-text">{{ sampleCaptions[activeCaptionIdx].caption }}</p>
            <div class="pp-preview-card-footer">
              <div class="pp-preview-card-tags">
                <span v-for="h in sampleCaptions[activeCaptionIdx].hashtags" :key="h">{{ h }}</span>
              </div>
              <div class="pp-preview-card-photo">
                📸 {{ sampleCaptions[activeCaptionIdx].photo }}
              </div>
              <button class="pp-copy-btn" @click="copyCaption" :class="{ copied: copiedCaption }">
                <span v-if="!copiedCaption">📋 Copy this caption</span>
                <span v-else>✅ Copied! Try it on your Instagram</span>
              </button>
            </div>
          </div>
        </Transition>
        <div class="pp-preview-dots">
          <span v-for="(_, i) in sampleCaptions" :key="i" :class="['pp-dot', activeCaptionIdx === i && 'active']" @click="pickCaption(i)"></span>
        </div>
      </div>
    </section>

    <!-- ======== COMPETITOR IRRELEVANCE ======== -->
    <section class="pp-diff" data-reveal="diff" :class="{ visible: isVisible('diff') }">
      <div class="pp-diff-inner">
        <h2 class="pp-section-h2">Buffer is for marketing teams.<br><em>This is for you.</em></h2>
        <p class="pp-diff-body">
          Generic tools give you a blank box and say "write something."
          They treat a dog groomer the same as a Fortune 500 brand manager.
        </p>
        <p class="pp-diff-body">
          PawPost knows the difference between a groom-day reveal, a holiday pet safety tip,
          and a booking CTA for a grooming salon. Because that's <strong>all we do</strong>.
        </p>
        <div class="pp-diff-grid">
          <div class="pp-diff-card pp-diff-card--them pp-card-tilt">
            <div class="pp-diff-card-label">Generic tools</div>
            <ul>
              <li>Blank text box — you still write everything</li>
              <li>Generic AI that sounds like a press release</li>
              <li>No idea what photo to pair</li>
              <li>Zero pet industry awareness</li>
            </ul>
          </div>
          <div class="pp-diff-card pp-diff-card--us pp-card-tilt">
            <div class="pp-diff-card-label">PawPost AI</div>
            <ul>
              <li>30 done-for-you captions, instantly</li>
              <li>Sounds like YOU — playful, warm, real</li>
              <li>Photo idea with every single caption</li>
              <li>Pet holidays, seasonal themes, your services</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- ======== TESTIMONIALS ======== -->
    <section class="pp-proof" data-reveal="proof" :class="{ visible: isVisible('proof') }">
      <h2 class="pp-section-h2 pp-center">Real results from real pet businesses.</h2>
      <p class="pp-section-sub pp-center">Click a card to see the numbers.</p>
      <div class="pp-proof-grid">
        <div
          v-for="(t, ti) in [
            { emoji: '✂️', name: 'Sarah T.', role: 'Dog Groomer · Austin, TX', quote: 'I copy-paste these straight into Instagram. They literally sound like me — my clients even asked if I hired a social media person.', stat: '3x', statLabel: 'more engagement', detail: 'Went from posting 2x/month to daily. Gained 1,200 followers in 3 months.' },
            { emoji: '🎾', name: 'Mike R.', role: 'Dog Trainer · Seattle, WA', quote: 'I was spending 2 hours every Sunday dreading caption writing. Now I open PawPost, copy Monday through Friday, and I\'m done in 10 minutes.', stat: '8hrs', statLabel: 'saved per month', detail: 'Uses PawPost for Instagram + Facebook. Books 4 extra clients per month from social.' },
            { emoji: '🏠', name: 'Danielle K.', role: 'Pet Sitter · Chicago, IL', quote: 'The photo ideas are a game-changer. I never knew what to shoot — now every caption tells me exactly what photo to pair. My engagement tripled.', stat: '47%', statLabel: 'more bookings', detail: 'Consistent posting built trust. Clients say they found her through Instagram.' },
          ]"
          :key="ti"
          class="pp-proof-flip-container"
          @click="toggleFlip(ti)"
        >
          <div class="pp-proof-flipper" :class="{ flipped: flippedCard === ti }">
            <div class="pp-proof-card pp-proof-front">
              <div class="pp-proof-stars">★★★★★</div>
              <p class="pp-proof-quote">"{{ t.quote }}"</p>
              <div class="pp-proof-who">
                <span class="pp-proof-avatar">{{ t.emoji }}</span>
                <div>
                  <strong>{{ t.name }}</strong>
                  <span>{{ t.role }}</span>
                </div>
              </div>
              <div class="pp-proof-tap">tap to see results →</div>
            </div>
            <div class="pp-proof-card pp-proof-back">
              <div class="pp-proof-stat">{{ t.stat }}</div>
              <div class="pp-proof-stat-label">{{ t.statLabel }}</div>
              <p class="pp-proof-detail">{{ t.detail }}</p>
              <div class="pp-proof-who">
                <span class="pp-proof-avatar">{{ t.emoji }}</span>
                <div>
                  <strong>{{ t.name }}</strong>
                  <span>{{ t.role }}</span>
                </div>
              </div>
              <div class="pp-proof-tap">← tap to read review</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ======== PRICING ======== -->
    <section class="pp-pricing" data-reveal="pricing" :class="{ visible: isVisible('pricing') }">
      <h2 class="pp-section-h2 pp-center">Less than $1/day.<br><em>15+ hours back every month.</em></h2>
      <p class="pp-section-sub pp-center">No contracts. No lock-in. Cancel anytime.</p>
      <div class="pp-pricing-cards pp-pricing-3col">
        <!-- Free -->
        <div class="pp-pricing-card pp-card-tilt">
          <div class="pp-pricing-name">Free</div>
          <div class="pp-pricing-price">$0</div>
          <div class="pp-pricing-period">Try it out, no strings attached</div>
          <ul class="pp-pricing-features">
            <li>7 captions + hashtags</li>
            <li>Photo ideas included</li>
            <li>Content calendar</li>
            <li>1 platform (Instagram)</li>
          </ul>
          <button class="pp-btn-outline" @click="goToOnboarding">Start Free</button>
        </div>
        <!-- Premium (popular) -->
        <div class="pp-pricing-card pp-pricing-card--pop pp-card-tilt">
          <div class="pp-pricing-badge">Most Popular</div>
          <div class="pp-pricing-name">Premium</div>
          <div class="pp-pricing-price">$14<span>/mo</span></div>
          <div class="pp-pricing-period">Everything you need to post consistently</div>
          <ul class="pp-pricing-features">
            <li>30 captions + hashtags</li>
            <li>Photo ideas for every post</li>
            <li>Instagram, Facebook, TikTok</li>
            <li>Brand voice settings</li>
            <li>Caption variants</li>
            <li>CSV export</li>
          </ul>
          <button class="pp-btn-primary pp-btn-full pp-btn-bounce" @click="goToOnboarding">Start 14-Day Free Trial →</button>
          <p class="pp-pricing-note">No credit card required</p>
        </div>
        <!-- Premium Pro -->
        <div class="pp-pricing-card pp-pricing-card--pro pp-card-tilt">
          <div class="pp-pricing-badge pp-badge-pro">Pro</div>
          <div class="pp-pricing-name">Premium Pro</div>
          <div class="pp-pricing-price">$29<span>/mo</span></div>
          <div class="pp-pricing-period">For serious pet businesses ready to scale</div>
          <ul class="pp-pricing-features">
            <li>Everything in Premium</li>
            <li>Multi-account support</li>
            <li>Advanced brand voice AI</li>
            <li>Priority caption generation</li>
            <li>Competitor caption analysis</li>
            <li>Dedicated support</li>
          </ul>
          <button class="pp-btn-primary pp-btn-full" @click="goToOnboarding">Start 14-Day Free Trial →</button>
          <p class="pp-pricing-note">No credit card required</p>
        </div>
      </div>
      <p class="pp-pricing-anchor">
        You're spending ~<strong>{{ calcMonthly }} hours/month</strong> on captions.
        That's <strong>${{ (calcMonthly * 25).toLocaleString() }}</strong> in lost time.
        PawPost Pro costs <strong>$14</strong>. Do the math.
      </p>
    </section>

    <!-- ======== NEWSLETTER / LEAD CAPTURE SECTION ======== -->
    <section class="pp-newsletter" data-reveal="newsletter" :class="{ visible: isVisible('newsletter') }">
      <div class="pp-newsletter-paws">
        <span v-for="i in 6" :key="'np'+i" class="pp-newsletter-paw" :style="{ left: (i * 16) + '%', animationDelay: (i * 0.7) + 's' }">🐾</span>
      </div>
      <div class="pp-newsletter-inner">
        <div class="pp-newsletter-icon">📬</div>
        <h2 class="pp-section-h2 pp-center pp-newsletter-h2">Free weekly caption ideas</h2>
        <p class="pp-newsletter-sub">Marketing tips for pet businesses. Delivered every Monday. No fluff.</p>
        <Transition name="newsletter-swap" mode="out-in">
          <form v-if="!newsletterSubmitted" key="form" class="pp-newsletter-form" @submit.prevent="submitNewsletter">
            <div class="pp-newsletter-input-wrap">
              <span class="pp-newsletter-input-icon">🐾</span>
              <input
                v-model="newsletterEmail"
                type="email"
                class="pp-newsletter-input"
                placeholder="your@email.com"
                required
              />
              <button type="submit" class="pp-newsletter-btn pp-btn-bounce">
                Subscribe →
              </button>
            </div>
            <p class="pp-newsletter-trust">Join <strong>2,400+</strong> pet business owners · Unsubscribe anytime</p>
          </form>
          <div v-else key="success" class="pp-newsletter-success">
            <div class="pp-newsletter-success-emoji">🎉</div>
            <p class="pp-newsletter-success-text">You're in! Check your inbox this Monday. 🐾</p>
          </div>
        </Transition>
      </div>
    </section>

    <!-- ======== FINAL CTA ======== -->
    <section class="pp-final" data-reveal="final" :class="{ visible: isVisible('final') }">
      <div class="pp-final-inner">
        <p class="pp-final-pre">Bottom line</p>
        <h2 class="pp-final-h2">
          You started this business to<br>work with animals —<br>
          <em>not to write Instagram captions.</em>
        </h2>
        <p class="pp-final-sub">Get 30 days of content in 60 seconds. Free.</p>
        <button class="pp-btn-primary pp-btn-lg pp-btn-bounce" @click="goToOnboarding">
          Generate My Free Caption Pack →
        </button>
        <p class="pp-final-note">No credit card. No catch. Takes 60 seconds.</p>
      </div>
    </section>

    <!-- ======== LEAD CAPTURE POPUP ======== -->
    <Transition name="popup-fade">
      <div v-if="showPopup" class="pp-popup-overlay" @click="handlePopupOverlayClick">
        <div class="pp-popup-modal">
          <!-- Floating mini paws inside modal -->
          <div class="pp-popup-paws">
            <span
              v-for="(p, i) in popupPaws"
              :key="'pp'+i"
              class="pp-popup-paw"
              :style="{
                left: p.left + '%',
                animationDelay: p.delay + 's',
                animationDuration: p.duration + 's',
                fontSize: p.size + 'rem',
              }"
            >{{ p.emoji }}</span>
          </div>

          <!-- Peeking puppy -->
          <div class="pp-popup-puppy">🐕</div>

          <Transition name="popup-content" mode="out-in">
            <!-- Form state -->
            <div v-if="!popupSubmitted" key="form" class="pp-popup-content">
              <button class="pp-popup-close" @click="dismissPopup" aria-label="Close popup">✕</button>
              <div class="pp-popup-emoji">🎁</div>
              <h3 class="pp-popup-title">Free: 10 Instagram Caption Templates for Pet Businesses 🐾</h3>
              <p class="pp-popup-sub">Steal these ready-to-post captions — no writing required.</p>
              <form class="pp-popup-form" @submit.prevent="submitPopup">
                <div class="pp-popup-input-wrap">
                  <span class="pp-popup-input-icon">🐾</span>
                  <input
                    v-model="popupEmail"
                    type="email"
                    class="pp-popup-input"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <button type="submit" class="pp-popup-submit pp-btn-bounce">
                  Send Me The Templates 🐾
                </button>
              </form>
              <button class="pp-popup-dismiss" @click="dismissPopup">
                Nah, I love writing captions 😅
              </button>
            </div>

            <!-- Success state -->
            <div v-else key="success" class="pp-popup-content pp-popup-success">
              <div class="pp-popup-success-emoji">🎉</div>
              <h3 class="pp-popup-title">Check your inbox! 📬</h3>
              <p class="pp-popup-sub">Your 10 free caption templates are on the way. Go pet a dog while you wait! 🐶💛</p>
              <div class="pp-popup-success-paw">🐾</div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>

    <!-- ======== CONFETTI OVERLAY ======== -->
    <div v-if="showConfetti" class="pp-confetti-overlay">
      <span
        v-for="piece in confettiPieces"
        :key="piece.id"
        class="pp-confetti-piece"
        :style="{
          left: piece.left + '%',
          animationDelay: piece.delay + 's',
          '--confetti-angle': piece.angle + 'deg',
          '--confetti-velocity': piece.velocity + 'px',
          '--confetti-rotation': piece.rotation + 'deg',
        }"
      >{{ piece.emoji }}</span>
    </div>

    <!-- ======== FOOTER ======== -->
    <footer class="pp-footer">
      <div class="pp-footer-inner">
        <div class="pp-logo">
          <span class="pp-logo-paw">🐾</span>
          <span class="pp-logo-text">PawPost <span class="pp-logo-ai">AI</span></span>
        </div>
        <p>Social media captions made for pet businesses — not marketing teams.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* ============================================================
   PAWPOST AI — Blue Ocean Landing Page
   Aesthetic: Warm, Playful, Craft
   Fonts: Fraunces (display serif) + DM Sans (body)
   ============================================================ */

/* -- Reset & base -- */
.pp-landing {
  font-family: 'DM Sans', system-ui, sans-serif;
  color: #1C1917;
  background: #FFFBF5;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

/* -- Shared -- */
.pp-section-h2 {
  font-family: 'Fraunces', Georgia, serif;
  font-size: clamp(1.75rem, 4.5vw, 3rem);
  font-weight: 700;
  line-height: 1.2;
  color: #1C1917;
  margin-bottom: 0.75rem;
}
.pp-section-h2 em {
  font-style: italic;
  color: #D97706;
}
.pp-section-sub {
  font-size: 1.125rem;
  color: #78716C;
  line-height: 1.6;
  max-width: 36rem;
  margin-bottom: 2.5rem;
}
.pp-center { text-align: center; margin-left: auto; margin-right: auto; }
.pp-section-sub.pp-center { margin-left: auto; margin-right: auto; }

/* ---- NAV ---- */
.pp-nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  backdrop-filter: blur(16px) saturate(1.6);
  -webkit-backdrop-filter: blur(16px) saturate(1.6);
  background: rgba(255, 251, 245, 0.82);
  border-bottom: 1px solid rgba(217, 119, 6, 0.08);
}
.pp-nav-inner {
  max-width: 72rem;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.pp-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}
.pp-logo-paw {
  font-size: 1.5rem;
  transition: transform 0.3s;
}
.pp-logo:hover .pp-logo-paw {
  animation: pawWiggle 0.5s ease;
}
.pp-logo-text {
  font-family: 'Fraunces', Georgia, serif;
  font-weight: 700;
  font-size: 1.25rem;
  color: #1C1917;
}
.pp-logo-ai { color: #D97706; }
.pp-nav-cta {
  background: #1C1917;
  color: #fff;
  border: none;
  padding: 0.6rem 1.4rem;
  border-radius: 100px;
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pp-nav-cta:hover {
  background: #D97706;
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 6px 24px rgba(217, 119, 6, 0.3);
}

/* ---- HERO ---- */
.pp-hero {
  position: relative;
  padding: 8rem 1.5rem 5rem;
  overflow: hidden;
  background: linear-gradient(170deg, #FFFBF5 0%, #FFF7EC 50%, #FEF3C7 100%);
}
.pp-hero-grain {
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none;
}
.pp-hero-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.35;
  pointer-events: none;
}
.pp-hero-glow--1 {
  width: 500px; height: 500px;
  background: #FDE68A;
  top: -100px; left: -150px;
  animation: glowPulse 6s ease-in-out infinite;
}
.pp-hero-glow--2 {
  width: 400px; height: 400px;
  background: #FDBA74;
  bottom: -50px; right: -100px;
  animation: glowPulse 8s ease-in-out infinite reverse;
}

/* Floating paw emojis */
.pp-floating-paws {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}
.pp-float-paw {
  position: absolute;
  bottom: -2rem;
  opacity: 0;
  animation: floatUp linear infinite;
}
.pp-float-wobble {
  animation-name: floatUpWobble !important;
}

.pp-hero-content {
  position: relative;
  max-width: 52rem;
  margin: 0 auto;
  text-align: center;
}
.pp-hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(217, 119, 6, 0.1);
  color: #B45309;
  padding: 0.5rem 1.25rem;
  border-radius: 100px;
  font-size: 0.82rem;
  font-weight: 600;
  margin-bottom: 2rem;
  border: 1px solid rgba(217, 119, 6, 0.15);
}
.pp-live-dot {
  width: 6px; height: 6px;
  background: #16A34A;
  border-radius: 50%;
  display: inline-block;
  animation: livePulse 1.5s ease-in-out infinite;
}
.pp-badge-paw {
  display: inline-block;
  animation: pawBounce 2s ease-in-out infinite;
}
/* Typewriter cursor */
.pp-cursor {
  animation: cursorBlink 0.7s step-end infinite;
  font-weight: 300;
}
.pp-hero-h1 {
  font-family: 'Fraunces', Georgia, serif;
  font-size: clamp(2.5rem, 7vw, 4.5rem);
  font-weight: 800;
  line-height: 1.1;
  color: #1C1917;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
}
.pp-hero-em {
  font-style: italic;
  background: linear-gradient(135deg, #D97706 0%, #EA580C 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% 100%;
  animation: gradientShift 3s ease-in-out infinite;
}
.pp-hero-sub {
  font-size: 1.2rem;
  line-height: 1.7;
  color: #44403C;
  max-width: 38rem;
  margin: 0 auto 1.5rem;
}
.pp-hero-sub strong {
  color: #1C1917;
  font-weight: 600;
}
.pp-hero-pills {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}
.pp-pill {
  background: rgba(255,255,255,0.7);
  border: 1px solid rgba(217, 119, 6, 0.12);
  padding: 0.4rem 1rem;
  border-radius: 100px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #44403C;
  backdrop-filter: blur(4px);
  cursor: default;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pp-pill:hover {
  transform: translateY(-3px) scale(1.08);
  background: #FEF3C7;
  border-color: #D97706;
  box-shadow: 0 6px 20px rgba(217, 119, 6, 0.15);
}
.pp-pill-wiggle {
  animation: pillWiggle 0.4s ease;
}
.pp-pill-emoji {
  display: inline-block;
  transition: transform 0.3s;
}
.pp-pill:hover .pp-pill-emoji {
  animation: emojiPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pp-hero-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 3rem;
}
.pp-hero-note {
  font-size: 0.85rem;
  color: #78716C;
}

/* Primary button */
.pp-btn-primary {
  background: linear-gradient(135deg, #F59E0B 0%, #EA580C 100%);
  color: #fff;
  border: none;
  padding: 1rem 2.25rem;
  border-radius: 100px;
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 24px rgba(217, 119, 6, 0.25);
  position: relative;
  overflow: hidden;
}
.pp-btn-primary::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%);
  transform: translateX(-100%);
  transition: transform 0.6s;
}
.pp-btn-primary:hover::after {
  transform: translateX(100%);
}
.pp-btn-primary:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 10px 40px rgba(217, 119, 6, 0.4);
}
.pp-btn-bounce:hover {
  animation: buttonBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pp-btn-lg { padding: 1.15rem 2.75rem; font-size: 1.15rem; }
.pp-btn-full { width: 100%; }
.pp-btn-outline {
  background: transparent;
  color: #1C1917;
  border: 2px solid #D6D3D1;
  padding: 0.85rem 2rem;
  border-radius: 100px;
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  width: 100%;
}
.pp-btn-outline:hover {
  border-color: #1C1917;
  background: #1C1917;
  color: #fff;
  transform: translateY(-2px);
}

/* Hero card */
.pp-hero-card {
  max-width: 32rem;
  margin: 0 auto;
  background: #fff;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 1.25rem;
  padding: 1.5rem;
  box-shadow: 0 20px 60px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04);
  text-align: left;
  position: relative;
  overflow: hidden;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s;
}
.pp-hero-card:hover {
  transform: translateY(-4px) rotate(-0.5deg);
  box-shadow: 0 24px 70px rgba(0,0,0,0.09), 0 4px 12px rgba(0,0,0,0.05);
}
.pp-hero-card-shimmer {
  position: absolute;
  top: 0; left: -100%;
  width: 50%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  animation: shimmer 4s ease-in-out infinite;
}
.pp-hero-card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.pp-hero-card-avatar {
  width: 2.5rem; height: 2.5rem;
  background: #FEF3C7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  animation: avatarBob 3s ease-in-out infinite;
}
.pp-hero-card-biz {
  font-weight: 600;
  font-size: 0.9rem;
  color: #1C1917;
}
.pp-hero-card-meta {
  font-size: 0.75rem;
  color: #78716C;
}
.pp-card-status {
  color: #16A34A;
  font-weight: 600;
}
.pp-hero-card-text {
  font-size: 0.9rem;
  line-height: 1.65;
  color: #44403C;
  margin-bottom: 1rem;
}
.pp-hero-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.pp-hero-card-tags span {
  font-size: 0.72rem;
  background: #FEF3C7;
  color: #B45309;
  padding: 0.25rem 0.65rem;
  border-radius: 100px;
  font-weight: 500;
  transition: transform 0.2s;
}
.pp-hero-card-tags span:hover {
  transform: scale(1.08);
}
.pp-card-photo {
  background: #EFF6FF !important;
  color: #2563EB !important;
}

/* ---- EMOJI MARQUEE ---- */
.pp-marquee-wrap {
  background: #D97706;
  padding: 0.7rem 0;
  overflow: hidden;
  position: relative;
}
.pp-marquee {
  display: flex;
  width: max-content;
}
.pp-marquee-track {
  display: inline-block;
  white-space: nowrap;
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.04em;
  animation: marqueeScroll 25s linear infinite;
}

/* ---- CALCULATOR ---- */
.pp-calc {
  padding: 5rem 1.5rem;
  background: #fff;
  border-top: 1px solid rgba(0,0,0,0.04);
}
.pp-calc-inner {
  max-width: 64rem;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}
@media (max-width: 768px) {
  .pp-calc-inner { grid-template-columns: 1fr; }
}
.pp-calc-box {
  background: #FFF7EC;
  border-radius: 1.25rem;
  padding: 2rem;
  border: 1px solid rgba(217, 119, 6, 0.1);
}
.pp-calc-label {
  font-weight: 600;
  font-size: 0.9rem;
  color: #44403C;
  margin-bottom: 1rem;
}
.pp-calc-btns {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}
.pp-calc-btn {
  flex: 1;
  padding: 0.65rem 0;
  border-radius: 0.75rem;
  border: 2px solid #E7E5E4;
  background: #fff;
  font-family: 'DM Sans', system-ui, sans-serif;
  font-weight: 600;
  font-size: 0.85rem;
  color: #44403C;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pp-calc-btn.active {
  border-color: #D97706;
  background: #D97706;
  color: #fff;
  box-shadow: 0 4px 16px rgba(217, 119, 6, 0.3);
  transform: scale(1.08);
}
.pp-calc-btn:hover:not(.active) {
  border-color: #F59E0B;
  transform: translateY(-2px);
}
.pp-calc-result { text-align: center; }
.pp-calc-result-num {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 3.5rem;
  font-weight: 800;
  color: #D97706;
  line-height: 1;
  display: block;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pp-num-pop {
  animation: numPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pp-calc-result-unit {
  font-size: 0.85rem;
  color: #78716C;
  font-weight: 500;
  display: block;
  margin-bottom: 1rem;
}
.pp-calc-result-msg {
  font-size: 1rem;
  color: #44403C;
  line-height: 1.5;
  margin-bottom: 0.5rem;
}
.pp-calc-result-cost {
  font-size: 0.9rem;
  color: #78716C;
  margin-bottom: 0.75rem;
}
.pp-calc-result-fix {
  font-size: 0.95rem;
  color: #65A30D;
  font-weight: 600;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(0,0,0,0.06);
}

/* ---- WAVY DIVIDERS ---- */
.pp-wave {
  line-height: 0;
  margin-top: -1px;
}
.pp-wave svg {
  width: 100%;
  height: 40px;
}
.pp-wave--cream { background: #fff; }
.pp-wave--warm { background: #fff; }

/* ---- COPY BUTTON ---- */
.pp-copy-btn {
  width: 100%;
  padding: 0.65rem 1rem;
  border-radius: 0.75rem;
  border: 2px dashed #D6D3D1;
  background: #FAFAF9;
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: #78716C;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  margin-top: 0.5rem;
}
.pp-copy-btn:hover {
  border-color: #D97706;
  background: #FEF3C7;
  color: #B45309;
  transform: scale(1.02);
}
.pp-copy-btn.copied {
  border-color: #16A34A;
  border-style: solid;
  background: #F0FDF4;
  color: #15803D;
  animation: copyPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* ---- TRANSFORM (Interactive Toggle) ---- */
.pp-transform {
  padding: 5rem 1.5rem;
  background: #FFFBF5;
}
.pp-toggle-wrap {
  display: flex;
  justify-content: center;
  gap: 0;
  margin-bottom: 2rem;
  background: #F5F5F4;
  border-radius: 100px;
  padding: 4px;
  max-width: 28rem;
  margin-left: auto;
  margin-right: auto;
}
.pp-toggle-option {
  flex: 1;
  padding: 0.65rem 1.25rem;
  border: none;
  border-radius: 100px;
  background: transparent;
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: #78716C;
  cursor: pointer;
  transition: all 0.3s;
}
.pp-toggle-option.active {
  background: #fff;
  color: #B91C1C;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.pp-toggle-option--good.active {
  color: #15803D;
}
.pp-transform-single {
  max-width: 36rem;
  margin: 0 auto;
  padding: 2rem;
  border-radius: 1.25rem;
}
.pp-transform-nudge {
  text-align: center;
  font-size: 0.82rem;
  color: #78716C;
  margin-top: 1.5rem;
  animation: nudgeBounce 2s ease-in-out infinite;
}
.pp-transform-cta {
  text-align: center;
  margin-top: 1.5rem;
}
/* Transform swap transition */
.transform-swap-enter-active { animation: transformIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
.transform-swap-leave-active { animation: transformOut 0.25s ease-in; }
@keyframes transformIn { from { opacity: 0; transform: translateX(20px) scale(0.95); } to { opacity: 1; transform: translateX(0) scale(1); } }
@keyframes transformOut { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(-20px); } }
.pp-transform-before {
  background: #FEF2F2;
  border: 1px solid #FECACA;
}
.pp-transform-after {
  background: #F0FDF4;
  border: 1px solid #BBF7D0;
}
.pp-transform-label {
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #B91C1C;
  margin-bottom: 1.25rem;
}
.pp-transform-label--good { color: #15803D; }
.pp-transform-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}
.pp-transform-list li {
  font-size: 0.92rem;
  line-height: 1.5;
  color: #44403C;
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
}
.pp-x {
  color: #DC2626;
  font-weight: 700;
  flex-shrink: 0;
  font-size: 1rem;
}
.pp-check {
  color: #16A34A;
  font-weight: 700;
  flex-shrink: 0;
  font-size: 1rem;
}
/* (transform-divider removed — now using interactive toggle) */

/* ---- STEPS ---- */
.pp-steps {
  padding: 5rem 1.5rem;
  background: #fff;
}
.pp-steps-grid {
  max-width: 56rem;
  margin: 0 auto;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}
@media (max-width: 768px) {
  .pp-steps-grid {
    flex-direction: column;
    align-items: center;
  }
  .pp-step-arrow { transform: rotate(90deg); }
}
.pp-step {
  flex: 1;
  text-align: center;
  padding: 1.5rem;
}
.pp-step-hover {
  border-radius: 1.25rem;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pp-step-hover:hover {
  background: #FFF7EC;
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(217, 119, 6, 0.1);
}
.pp-step-num {
  width: 3.5rem;
  height: 3.5rem;
  background: linear-gradient(135deg, #F59E0B, #EA580C);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.75rem;
  font-family: 'Fraunces', Georgia, serif;
  font-weight: 800;
  font-size: 1.35rem;
  color: #fff;
  box-shadow: 0 6px 20px rgba(217, 119, 6, 0.25);
  transition: transform 0.3s;
}
.pp-step-hover:hover .pp-step-num {
  transform: rotate(-8deg) scale(1.1);
}
.pp-step-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  animation: emojiFloat 3s ease-in-out infinite;
}
.pp-step:nth-child(3) .pp-step-icon { animation-delay: 0.5s; }
.pp-step:nth-child(5) .pp-step-icon { animation-delay: 1s; }
.pp-step-title {
  font-family: 'Fraunces', Georgia, serif;
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}
.pp-step-desc {
  font-size: 0.9rem;
  color: #78716C;
  line-height: 1.55;
}
.pp-step-arrow {
  font-size: 1.5rem;
  color: #FDE68A;
  font-weight: 700;
  margin-top: 2rem;
  flex-shrink: 0;
  animation: arrowBounce 1.5s ease-in-out infinite;
}

/* ---- CAPTION PREVIEW ---- */
.pp-preview {
  padding: 5rem 1.5rem;
  background: #FFFBF5;
}
.pp-preview-wrap {
  max-width: 40rem;
  margin: 0 auto;
}
.pp-preview-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  justify-content: center;
}
.pp-preview-tab {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border-radius: 100px;
  border: 2px solid #E7E5E4;
  background: #fff;
  font-family: 'DM Sans', system-ui, sans-serif;
  font-weight: 500;
  font-size: 0.82rem;
  color: #78716C;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pp-preview-tab.active {
  border-color: #D97706;
  background: #FEF3C7;
  color: #B45309;
  transform: scale(1.06);
}
.pp-preview-tab:hover:not(.active) {
  border-color: #F59E0B;
  transform: translateY(-2px);
}
.pp-preview-tab-emoji { font-size: 1rem; }
.pp-preview-card {
  background: #fff;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 1.25rem;
  padding: 1.75rem;
  box-shadow: 0 12px 40px rgba(0,0,0,0.05);
}
.pp-preview-card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.pp-preview-card-theme {
  font-weight: 700;
  font-size: 0.9rem;
  color: #1C1917;
}
.pp-preview-card-biz {
  font-size: 0.8rem;
  color: #78716C;
  background: #F5F5F4;
  padding: 0.25rem 0.75rem;
  border-radius: 100px;
}
.pp-preview-card-text {
  font-size: 1rem;
  line-height: 1.7;
  color: #44403C;
  margin-bottom: 1.25rem;
}
.pp-preview-card-footer {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.pp-preview-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}
.pp-preview-card-tags span {
  font-size: 0.72rem;
  background: #FEF3C7;
  color: #B45309;
  padding: 0.25rem 0.65rem;
  border-radius: 100px;
  font-weight: 500;
  transition: transform 0.2s;
}
.pp-preview-card-tags span:hover {
  transform: scale(1.1);
}
.pp-preview-card-photo {
  font-size: 0.82rem;
  color: #2563EB;
  background: #EFF6FF;
  padding: 0.5rem 0.85rem;
  border-radius: 0.65rem;
}
.pp-preview-dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.25rem;
}
.pp-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #D6D3D1;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pp-dot.active {
  background: #D97706;
  width: 24px;
  border-radius: 4px;
}
.pp-dot:hover:not(.active) {
  transform: scale(1.5);
  background: #F59E0B;
}
/* Caption transitions */
.caption-fade-enter-active { animation: captionIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }
.caption-fade-leave-active { animation: captionOut 0.2s ease-in; }
@keyframes captionIn { from { opacity: 0; transform: translateY(12px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes captionOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-10px); } }

/* ---- Card tilt effect ---- */
.pp-card-tilt {
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s;
}
.pp-card-tilt:hover {
  transform: translateY(-6px) rotate(-1deg);
  box-shadow: 0 16px 50px rgba(0,0,0,0.08);
}

/* ---- COMPETITOR DIFF ---- */
.pp-diff {
  padding: 5rem 1.5rem;
  background: #1C1917;
  color: #fff;
}
.pp-diff-inner {
  max-width: 56rem;
  margin: 0 auto;
}
.pp-diff .pp-section-h2 {
  color: #fff;
  margin-bottom: 1.5rem;
}
.pp-diff .pp-section-h2 em {
  color: #FDE68A;
}
.pp-diff-body {
  font-size: 1.05rem;
  line-height: 1.7;
  color: #A8A29E;
  max-width: 38rem;
  margin-bottom: 1rem;
}
.pp-diff-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 2.5rem;
}
@media (max-width: 640px) {
  .pp-diff-grid { grid-template-columns: 1fr; }
}
.pp-diff-card {
  border-radius: 1.25rem;
  padding: 1.75rem;
}
.pp-diff-card--them {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
}
.pp-diff-card--us {
  background: rgba(217, 119, 6, 0.1);
  border: 1px solid rgba(217, 119, 6, 0.2);
}
.pp-diff-card-label {
  font-weight: 700;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 1rem;
}
.pp-diff-card--them .pp-diff-card-label { color: #78716C; }
.pp-diff-card--us .pp-diff-card-label { color: #FDE68A; }
.pp-diff-card ul {
  list-style: none;
  padding: 0; margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}
.pp-diff-card li {
  font-size: 0.9rem;
  line-height: 1.5;
}
.pp-diff-card--them li { color: #78716C; }
.pp-diff-card--us li { color: #E7E5E4; }

/* ---- PROOF / TESTIMONIALS ---- */
.pp-proof {
  padding: 5rem 1.5rem;
  background: #FFF7EC;
}
.pp-proof-grid {
  max-width: 64rem;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}
@media (max-width: 768px) {
  .pp-proof-grid { grid-template-columns: 1fr; }
}
/* Flip card container */
.pp-proof-flip-container {
  perspective: 1000px;
  cursor: pointer;
  min-height: 280px;
}
.pp-proof-flipper {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 280px;
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-style: preserve-3d;
}
.pp-proof-flipper.flipped {
  transform: rotateY(180deg);
}
.pp-proof-front, .pp-proof-back {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.pp-proof-back {
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.pp-proof-stat {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 3rem;
  font-weight: 800;
  color: #D97706;
  line-height: 1;
}
.pp-proof-stat-label {
  font-size: 0.9rem;
  color: #78716C;
  margin-bottom: 1rem;
  font-weight: 600;
}
.pp-proof-detail {
  font-size: 0.88rem;
  color: #44403C;
  line-height: 1.6;
  margin-bottom: 1rem;
}
.pp-proof-tap {
  font-size: 0.72rem;
  color: #A8A29E;
  margin-top: auto;
  padding-top: 0.75rem;
}
.pp-proof-card {
  background: #fff;
  border: 1px solid rgba(0,0,0,0.05);
  border-radius: 1.25rem;
  padding: 1.75rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  transition: box-shadow 0.3s;
}
.pp-proof-flip-container:hover .pp-proof-card {
  box-shadow: 0 8px 30px rgba(0,0,0,0.08);
}
.pp-proof-stars {
  color: #F59E0B;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
  letter-spacing: 0.1em;
}
.pp-proof-quote {
  font-size: 0.95rem;
  line-height: 1.65;
  color: #44403C;
  font-style: italic;
  margin-bottom: 1.25rem;
}
.pp-proof-who {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.pp-proof-avatar {
  width: 2.25rem; height: 2.25rem;
  background: #FEF3C7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: transform 0.3s;
}
.pp-proof-card:hover .pp-proof-avatar {
  animation: emojiPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pp-proof-who strong {
  font-size: 0.85rem;
  display: block;
  color: #1C1917;
}
.pp-proof-who span {
  font-size: 0.78rem;
  color: #78716C;
}

/* ---- PRICING ---- */
.pp-pricing {
  padding: 5rem 1.5rem;
  background: #fff;
}
.pp-pricing-cards {
  max-width: 48rem;
  margin: 0 auto 2rem;
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 1.5rem;
  align-items: start;
}
.pp-pricing-3col {
  max-width: 64rem;
  grid-template-columns: 1fr 1.12fr 1fr;
}
@media (max-width: 768px) {
  .pp-pricing-cards { grid-template-columns: 1fr; }
  .pp-pricing-3col { grid-template-columns: 1fr; }
}
.pp-pricing-card {
  border: 2px solid #E7E5E4;
  border-radius: 1.25rem;
  padding: 2rem;
  position: relative;
}
.pp-pricing-card--pop {
  border-color: #D97706;
  box-shadow: 0 12px 40px rgba(217, 119, 6, 0.12);
}
.pp-pricing-card--pro {
  border-color: #1C1917;
  background: linear-gradient(180deg, #FAFAF9 0%, #F5F5F4 100%);
}
.pp-badge-pro {
  background: linear-gradient(135deg, #1C1917, #44403C) !important;
}
.pp-pricing-badge {
  position: absolute;
  top: -0.8rem;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #F59E0B, #EA580C);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.3rem 1rem;
  border-radius: 100px;
  animation: badgePulse 2s ease-in-out infinite;
}
.pp-pricing-name {
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 0.35rem;
}
.pp-pricing-price {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 2.75rem;
  font-weight: 800;
  color: #1C1917;
  line-height: 1;
  margin-bottom: 0.25rem;
}
.pp-pricing-price span {
  font-size: 1rem;
  font-weight: 400;
  color: #78716C;
}
.pp-pricing-period {
  font-size: 0.85rem;
  color: #78716C;
  margin-bottom: 1.5rem;
}
.pp-pricing-features {
  list-style: none;
  padding: 0; margin: 0 0 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.pp-pricing-features li {
  font-size: 0.88rem;
  color: #44403C;
  padding-left: 1.4rem;
  position: relative;
}
.pp-pricing-features li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #65A30D;
  font-weight: 700;
}
.pp-pricing-note {
  font-size: 0.78rem;
  color: #78716C;
  text-align: center;
  margin-top: 0.75rem;
}
.pp-pricing-anchor {
  text-align: center;
  font-size: 0.92rem;
  color: #78716C;
  max-width: 36rem;
  margin: 0 auto;
}
.pp-pricing-anchor strong { color: #1C1917; }

/* ---- FINAL CTA ---- */
.pp-final {
  padding: 6rem 1.5rem;
  background: linear-gradient(170deg, #FEF3C7 0%, #FFF7EC 50%, #FFFBF5 100%);
  position: relative;
  overflow: hidden;
}
.pp-final::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
}
.pp-final-inner {
  position: relative;
  max-width: 42rem;
  margin: 0 auto;
  text-align: center;
}
.pp-final-pre {
  font-family: 'Fraunces', Georgia, serif;
  font-style: italic;
  font-size: 1rem;
  color: #78716C;
  margin-bottom: 1rem;
}
.pp-final-h2 {
  font-family: 'Fraunces', Georgia, serif;
  font-size: clamp(1.75rem, 4.5vw, 2.75rem);
  font-weight: 700;
  line-height: 1.25;
  color: #1C1917;
  margin-bottom: 1rem;
}
.pp-final-h2 em {
  font-style: italic;
  color: #D97706;
}
.pp-final-sub {
  font-size: 1.15rem;
  color: #44403C;
  margin-bottom: 2rem;
}
.pp-final-note {
  font-size: 0.85rem;
  color: #78716C;
  margin-top: 1rem;
}

/* ---- CONFETTI ---- */
.pp-confetti-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
}
.pp-confetti-piece {
  position: absolute;
  top: 40%;
  font-size: 1.5rem;
  animation: confettiBurst 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

/* ---- FOOTER ---- */
.pp-footer {
  padding: 2.5rem 1.5rem;
  background: #1C1917;
}
.pp-footer-inner {
  max-width: 64rem;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
@media (max-width: 640px) {
  .pp-footer-inner {
    flex-direction: column;
    gap: 0.75rem;
    text-align: center;
  }
}
.pp-footer .pp-logo-text { color: #fff; }
.pp-footer p {
  font-size: 0.82rem;
  color: #78716C;
}

/* ============================================================
   ANIMATIONS — The Fun Stuff! 🎉
   ============================================================ */

/* Hero staggered entry */
.animate-in {
  opacity: 0;
  transform: translateY(24px);
  animation: revealUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
.d1 { animation-delay: 0.1s; }
.d2 { animation-delay: 0.22s; }
.d3 { animation-delay: 0.35s; }
.d4 { animation-delay: 0.5s; }

@keyframes revealUp {
  to { opacity: 1; transform: translateY(0); }
}

/* Scroll-triggered sections */
.pp-calc,
.pp-transform,
.pp-steps,
.pp-preview,
.pp-diff,
.pp-proof,
.pp-pricing,
.pp-final {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1), transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
}
.pp-calc.visible,
.pp-transform.visible,
.pp-steps.visible,
.pp-preview.visible,
.pp-diff.visible,
.pp-proof.visible,
.pp-pricing.visible,
.pp-final.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Floating paw animations */
@keyframes floatUp {
  0% { opacity: 0; transform: translateY(0) rotate(0deg); }
  10% { opacity: 0.6; }
  90% { opacity: 0.6; }
  100% { opacity: 0; transform: translateY(-100vh) rotate(45deg); }
}
@keyframes floatUpWobble {
  0% { opacity: 0; transform: translateY(0) rotate(0deg) translateX(0); }
  10% { opacity: 0.5; }
  25% { transform: translateY(-25vh) rotate(15deg) translateX(20px); }
  50% { transform: translateY(-50vh) rotate(-10deg) translateX(-15px); }
  75% { transform: translateY(-75vh) rotate(20deg) translateX(10px); }
  90% { opacity: 0.5; }
  100% { opacity: 0; transform: translateY(-100vh) rotate(-15deg) translateX(-10px); }
}

/* Glow pulse */
@keyframes glowPulse {
  0%, 100% { opacity: 0.35; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.1); }
}

/* Paw wiggle */
@keyframes pawWiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-12deg); }
  50% { transform: rotate(12deg); }
  75% { transform: rotate(-8deg); }
}

/* Paw bounce in badge */
@keyframes pawBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

/* Gradient shift on hero em */
@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Pill wiggle */
@keyframes pillWiggle {
  0%, 100% { transform: translateY(-3px) scale(1.08) rotate(0deg); }
  25% { transform: translateY(-3px) scale(1.08) rotate(-3deg); }
  75% { transform: translateY(-3px) scale(1.08) rotate(3deg); }
}

/* Emoji pop */
@keyframes emojiPop {
  0% { transform: scale(1); }
  50% { transform: scale(1.4); }
  100% { transform: scale(1); }
}

/* Button bounce */
@keyframes buttonBounce {
  0% { transform: translateY(-3px) scale(1.03); }
  30% { transform: translateY(-6px) scale(1.06); }
  50% { transform: translateY(-3px) scale(1.03); }
  70% { transform: translateY(-5px) scale(1.04); }
  100% { transform: translateY(-3px) scale(1.03); }
}

/* Shimmer on hero card */
@keyframes shimmer {
  0%, 100% { left: -100%; }
  50% { left: 150%; }
}

/* Avatar bob */
@keyframes avatarBob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

/* Number pop */
@keyframes numPop {
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
}

/* Arrow bounce */
@keyframes arrowBounce {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(6px); }
}

/* Emoji float for step icons */
@keyframes emojiFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

/* Marquee scroll */
@keyframes marqueeScroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* Badge pulse */
@keyframes badgePulse {
  0%, 100% { transform: translateX(-50%) scale(1); }
  50% { transform: translateX(-50%) scale(1.05); }
}

/* Live pulse dot */
@keyframes livePulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.5); }
}

/* Cursor blink */
@keyframes cursorBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Copy pop */
@keyframes copyPop {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* Nudge bounce */
@keyframes nudgeBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

/* Confetti burst */
@keyframes confettiBurst {
  0% {
    transform: translate(0, 0) rotate(0deg) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(
      calc(cos(var(--confetti-angle)) * var(--confetti-velocity)),
      calc(sin(var(--confetti-angle)) * var(--confetti-velocity) + 200px)
    ) rotate(var(--confetti-rotation)) scale(0);
    opacity: 0;
  }
}

/* ============================================================
   LEAD CAPTURE POPUP
   ============================================================ */
.pp-popup-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(28, 25, 23, 0.55);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 1.5rem;
}

.pp-popup-modal {
  position: relative;
  background: #FFFBF5;
  background-image: linear-gradient(165deg, #FFFBF5 0%, #FFF7EC 60%, #FEF3C7 100%);
  border-radius: 1.5rem;
  padding: 2.5rem 2rem 2rem;
  max-width: 28rem;
  width: 100%;
  box-shadow: 0 25px 80px rgba(217, 119, 6, 0.25), 0 4px 20px rgba(0,0,0,0.12);
  border: 1px solid rgba(217, 119, 6, 0.12);
  overflow: hidden;
  animation: popupSlideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

/* Floating paws inside popup */
.pp-popup-paws {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}
.pp-popup-paw {
  position: absolute;
  bottom: -20px;
  opacity: 0.12;
  animation: floatUp linear infinite;
}

/* Peeking puppy */
.pp-popup-puppy {
  position: absolute;
  bottom: -4px;
  right: -4px;
  font-size: 2.8rem;
  transform: rotate(-15deg);
  animation: puppyPeek 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.pp-popup-content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.pp-popup-close {
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #78716C;
  cursor: pointer;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}
.pp-popup-close:hover {
  background: rgba(217, 119, 6, 0.1);
  color: #D97706;
}

.pp-popup-emoji {
  font-size: 3rem;
  margin-bottom: 0.75rem;
  animation: emojiPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both;
}

.pp-popup-title {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: #1C1917;
  line-height: 1.3;
  margin-bottom: 0.5rem;
}

.pp-popup-sub {
  font-size: 0.95rem;
  color: #78716C;
  line-height: 1.5;
  margin-bottom: 1.25rem;
}

.pp-popup-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.pp-popup-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.pp-popup-input-icon {
  position: absolute;
  left: 1rem;
  font-size: 1rem;
  pointer-events: none;
}
.pp-popup-input {
  width: 100%;
  padding: 0.85rem 1rem 0.85rem 2.75rem;
  border: 2px solid rgba(217, 119, 6, 0.2);
  border-radius: 0.75rem;
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.8);
  color: #1C1917;
  outline: none;
  transition: all 0.3s;
}
.pp-popup-input:focus {
  border-color: #D97706;
  box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.12), 0 0 20px rgba(217, 119, 6, 0.08);
}
.pp-popup-input::placeholder {
  color: #A8A29E;
}

.pp-popup-submit {
  width: 100%;
  padding: 0.9rem 1.5rem;
  background: linear-gradient(135deg, #D97706 0%, #EA580C 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 16px rgba(217, 119, 6, 0.3);
  animation: wiggleAttention 3s ease infinite 2s;
}
.pp-popup-submit:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 8px 28px rgba(217, 119, 6, 0.4);
}

.pp-popup-dismiss {
  background: none;
  border: none;
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 0.8rem;
  color: #A8A29E;
  cursor: pointer;
  margin-top: 1rem;
  transition: color 0.2s;
  padding: 0.25rem;
}
.pp-popup-dismiss:hover {
  color: #78716C;
}

/* Popup success state */
.pp-popup-success {
  padding: 1rem 0;
}
.pp-popup-success-emoji {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: emojiPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pp-popup-success-paw {
  font-size: 2rem;
  margin-top: 1rem;
  animation: pawBounce 1s ease infinite;
}

/* Popup transitions */
.popup-fade-enter-active {
  transition: opacity 0.3s ease;
}
.popup-fade-enter-active .pp-popup-modal {
  animation: popupSlideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
.popup-fade-leave-active {
  transition: opacity 0.3s ease;
}
.popup-fade-enter-from,
.popup-fade-leave-to {
  opacity: 0;
}

.popup-content-enter-active,
.popup-content-leave-active {
  transition: all 0.3s ease;
}
.popup-content-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(10px);
}
.popup-content-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(-10px);
}

@keyframes popupSlideUp {
  0% {
    opacity: 0;
    transform: translateY(40px) scale(0.92);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes puppyPeek {
  0% {
    opacity: 0;
    transform: rotate(-15deg) translate(20px, 20px);
  }
  100% {
    opacity: 1;
    transform: rotate(-15deg) translate(0, 0);
  }
}

@keyframes wiggleAttention {
  0%, 86%, 100% { transform: rotate(0); }
  88% { transform: rotate(-2deg); }
  90% { transform: rotate(2deg); }
  92% { transform: rotate(-2deg); }
  94% { transform: rotate(1deg); }
  96% { transform: rotate(0); }
}

/* ============================================================
   NEWSLETTER SECTION
   ============================================================ */
.pp-newsletter {
  position: relative;
  padding: 5rem 1.5rem;
  background: linear-gradient(165deg, #FEF3C7 0%, #FFF7EC 50%, #FFFBF5 100%);
  text-align: center;
  overflow: hidden;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.pp-newsletter.visible {
  opacity: 1;
  transform: translateY(0);
}

.pp-newsletter-paws {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}
.pp-newsletter-paw {
  position: absolute;
  top: -20px;
  font-size: 1.4rem;
  opacity: 0.08;
  animation: floatDown 8s linear infinite;
}

.pp-newsletter-inner {
  max-width: 34rem;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.pp-newsletter-icon {
  font-size: 3rem;
  margin-bottom: 0.75rem;
  animation: emojiFloat 3s ease infinite;
}

.pp-newsletter-h2 {
  color: #1C1917;
  margin-bottom: 0.5rem;
}

.pp-newsletter-sub {
  font-size: 1.05rem;
  color: #78716C;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.pp-newsletter-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.pp-newsletter-input-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  max-width: 28rem;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(217, 119, 6, 0.15);
  border-radius: 100px;
  padding: 0.35rem 0.35rem 0.35rem 1.25rem;
  transition: all 0.3s;
  box-shadow: 0 4px 20px rgba(217, 119, 6, 0.06);
}
.pp-newsletter-input-wrap:focus-within {
  border-color: #D97706;
  box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.1), 0 4px 20px rgba(217, 119, 6, 0.12);
}

.pp-newsletter-input-icon {
  font-size: 1rem;
  flex-shrink: 0;
}

.pp-newsletter-input {
  flex: 1;
  border: none;
  background: none;
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 1rem;
  color: #1C1917;
  outline: none;
  padding: 0.6rem 0;
  min-width: 0;
}
.pp-newsletter-input::placeholder {
  color: #A8A29E;
}

.pp-newsletter-btn {
  flex-shrink: 0;
  padding: 0.7rem 1.5rem;
  background: linear-gradient(135deg, #D97706 0%, #EA580C 100%);
  color: white;
  border: none;
  border-radius: 100px;
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 3px 12px rgba(217, 119, 6, 0.25);
  white-space: nowrap;
}
.pp-newsletter-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(217, 119, 6, 0.35);
}

.pp-newsletter-trust {
  font-size: 0.8rem;
  color: #A8A29E;
  margin-top: 0.25rem;
}
.pp-newsletter-trust strong {
  color: #78716C;
}

/* Newsletter success */
.pp-newsletter-success {
  padding: 1.5rem 0;
}
.pp-newsletter-success-emoji {
  font-size: 3.5rem;
  margin-bottom: 0.75rem;
  animation: emojiPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pp-newsletter-success-text {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1C1917;
}

/* Newsletter transitions */
.newsletter-swap-enter-active,
.newsletter-swap-leave-active {
  transition: all 0.4s ease;
}
.newsletter-swap-enter-from {
  opacity: 0;
  transform: translateY(15px) scale(0.95);
}
.newsletter-swap-leave-to {
  opacity: 0;
  transform: translateY(-15px) scale(0.95);
}

@keyframes floatDown {
  0% {
    transform: translateY(-20px) rotate(0deg);
    opacity: 0;
  }
  10% { opacity: 0.08; }
  90% { opacity: 0.08; }
  100% {
    transform: translateY(calc(100vh + 20px)) rotate(180deg);
    opacity: 0;
  }
}

/* ---- Mobile responsive for popup & newsletter ---- */
@media (max-width: 480px) {
  .pp-popup-modal {
    padding: 2rem 1.25rem 1.5rem;
    border-radius: 1.25rem;
  }
  .pp-popup-title {
    font-size: 1.2rem;
  }
  .pp-popup-puppy {
    font-size: 2rem;
  }
  .pp-newsletter-input-wrap {
    flex-direction: column;
    border-radius: 1rem;
    padding: 0.75rem;
    gap: 0.5rem;
  }
  .pp-newsletter-input-icon {
    display: none;
  }
  .pp-newsletter-btn {
    width: 100%;
    border-radius: 0.75rem;
  }
}
</style>
