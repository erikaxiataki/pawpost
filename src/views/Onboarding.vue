<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const step = ref(1)
const totalSteps = 5

const businessType = ref('')
const customBusiness = ref('')
const businessName = ref('')
const location = ref('')
const services = ref('')
const vibe = ref('')
const audience = ref('')
const platforms = ref([])
const goal = ref('')
const frequency = ref('3x')
const language = ref('en')

const businessTypes = [
  { id: 'groomer', label: 'Dog Groomer', emoji: '✂️' },
  { id: 'walker', label: 'Dog Walker', emoji: '🦮' },
  { id: 'trainer', label: 'Dog Trainer', emoji: '🎾' },
  { id: 'sitter', label: 'Pet Sitter', emoji: '🏠' },
  { id: 'daycare', label: 'Doggy Daycare', emoji: '🐕' },
  { id: 'vet', label: 'Vet Clinic', emoji: '🩺' },
  { id: 'photographer', label: 'Pet Photographer', emoji: '📸' },
  { id: 'store', label: 'Pet Store / Shop', emoji: '🛍️' },
  { id: 'bakery', label: 'Dog Bakery', emoji: '🧁' },
  { id: 'supplier', label: 'Pet Supplier / Distributor', emoji: '🏭' },
  { id: 'food_brand', label: 'Pet Food Brand', emoji: '🍖' },
  { id: 'wholesale', label: 'Importer / Wholesale', emoji: '📦' },
  { id: 'insurance', label: 'Pet Insurance', emoji: '🛡️' },
  { id: 'education', label: 'Pet Education / Courses', emoji: '🎓' },
  { id: 'influencer', label: 'Pet Influencer / Creator', emoji: '⭐' },
  { id: 'other', label: 'Other', emoji: '🐾' },
]

const vibes = [
  { id: 'warm', label: 'Warm & Friendly', emoji: '💛', desc: 'Kind, approachable, like talking to a friend' },
  { id: 'funny', label: 'Funny & Playful', emoji: '😂', desc: 'Humor, memes, relatable pet parent moments' },
  { id: 'professional', label: 'Professional', emoji: '💼', desc: 'Polished, trustworthy, expertise-focused' },
  { id: 'educational', label: 'Tips & Education', emoji: '📚', desc: 'Teach, inform, share knowledge' },
]

const audiences = [
  { id: 'local', label: 'Local pet owners', emoji: '📍' },
  { id: 'young', label: 'Young pet parents (20s-30s)', emoji: '🧑' },
  { id: 'families', label: 'Families with kids & dogs', emoji: '👨‍👩‍👧' },
  { id: 'premium', label: 'Premium / high-end clients', emoji: '💎' },
]

const platformOptions = [
  { id: 'instagram', label: 'Instagram', emoji: '📷' },
  { id: 'facebook', label: 'Facebook', emoji: '👤' },
  { id: 'tiktok', label: 'TikTok', emoji: '🎵' },
]

const goals = [
  { id: 'clients', label: 'Get more clients', emoji: '📈' },
  { id: 'engagement', label: 'Boost engagement', emoji: '💬' },
  { id: 'awareness', label: 'Build brand awareness', emoji: '🌟' },
  { id: 'community', label: 'Grow my community', emoji: '🤝' },
]

const frequencies = [
  { id: '1x', label: '1x per week', emoji: '🌱', desc: 'Wednesday — just starting out' },
  { id: '2x', label: '2x per week', emoji: '📆', desc: 'Tue & Thu — light but steady' },
  { id: '3x', label: '3x per week', emoji: '📅', desc: 'Mon, Wed, Fri — great balance' },
  { id: '5x', label: '5x per week', emoji: '💪', desc: 'Weekdays — consistent presence' },
  { id: 'daily', label: 'Every day', emoji: '🔥', desc: 'All 7 days — maximum reach' },
]

const languages = [
  { id: 'en', label: 'English', flag: '🇺🇸' },
  { id: 'es', label: 'Spanish', flag: '🇪🇸' },
  { id: 'fr', label: 'French', flag: '🇫🇷' },
  { id: 'pt', label: 'Portuguese', flag: '🇧🇷' },
  { id: 'de', label: 'German', flag: '🇩🇪' },
  { id: 'tl', label: 'Filipino', flag: '🇵🇭' },
]

const canProceed = computed(() => {
  if (step.value === 1) return businessType.value && (businessType.value !== 'other' || customBusiness.value)
  if (step.value === 2) return vibe.value
  if (step.value === 3) return platforms.value.length > 0
  if (step.value === 4) return frequency.value
  if (step.value === 5) return true
  return false
})

function togglePlatform(id) {
  const idx = platforms.value.indexOf(id)
  if (idx >= 0) platforms.value.splice(idx, 1)
  else platforms.value.push(id)
}

function nextStep() {
  if (step.value < totalSteps) {
    step.value++
  } else {
    finishOnboarding()
  }
}

function finishOnboarding() {
  const profile = {
    businessType: businessType.value === 'other' ? customBusiness.value : businessType.value,
    businessTypeId: businessType.value,
    businessName: businessName.value,
    location: location.value,
    services: services.value,
    vibe: vibe.value,
    audience: audience.value,
    platforms: platforms.value,
    goal: goal.value,
    frequency: frequency.value,
    language: language.value,
  }
  localStorage.setItem('pawpost_profile', JSON.stringify(profile))
  router.push('/dashboard')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 font-['Inter',sans-serif]">

    <!-- Nav -->
    <nav class="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div class="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <router-link to="/" class="flex items-center gap-2">
          <span class="text-2xl">🐾</span>
          <span class="font-bold text-xl text-gray-900">PawPost <span class="text-amber-500">AI</span></span>
        </router-link>
        <div class="flex items-center gap-3">
          <div class="flex gap-1.5">
            <div v-for="s in totalSteps" :key="s" :class="['w-8 h-1.5 rounded-full transition-all', s <= step ? 'bg-amber-500' : 'bg-gray-200']"></div>
          </div>
          <span class="text-xs text-gray-400">{{ step }}/{{ totalSteps }}</span>
        </div>
      </div>
    </nav>

    <div class="pt-24 pb-16 px-6 max-w-2xl mx-auto">

      <!-- Step 1: Business Type -->
      <div v-if="step === 1" class="animate-fade-in">
        <div class="text-center mb-8">
          <div class="text-4xl mb-3">👋</div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Let's get to know your business</h1>
          <p class="text-gray-500">This helps us generate captions that sound like YOU, not a robot.</p>
        </div>

        <div class="mb-6">
          <label class="text-sm font-semibold text-gray-700 mb-3 block">What type of pet business do you run?</label>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button v-for="type in businessTypes" :key="type.id" @click="businessType = type.id"
              :class="['p-3 rounded-xl border-2 text-left transition-all cursor-pointer', businessType === type.id ? 'border-amber-400 bg-amber-50 shadow-md' : 'border-gray-200 bg-white hover:border-gray-300']">
              <span class="text-xl">{{ type.emoji }}</span>
              <p class="font-medium text-gray-900 mt-1 text-sm">{{ type.label }}</p>
            </button>
          </div>
          <input v-if="businessType === 'other'" v-model="customBusiness" type="text" placeholder="Describe your business..."
            class="mt-3 w-full px-4 py-3 rounded-xl border-2 border-amber-300 focus:border-amber-400 focus:outline-none bg-amber-50 text-gray-900 placeholder-gray-400 text-sm">
        </div>

        <div class="mb-6">
          <label class="text-sm font-semibold text-gray-700 mb-2 block">Business name <span class="text-gray-300 font-normal">(optional)</span></label>
          <input v-model="businessName" type="text" placeholder="e.g. Pawfect Grooming"
            class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-400 focus:outline-none bg-white text-gray-900 placeholder-gray-300 text-sm">
        </div>

        <div class="mb-6">
          <label class="text-sm font-semibold text-gray-700 mb-2 block">Location <span class="text-gray-300 font-normal">(optional — for local captions)</span></label>
          <input v-model="location" type="text" placeholder="e.g. Charlottetown, PEI"
            class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-400 focus:outline-none bg-white text-gray-900 placeholder-gray-300 text-sm">
        </div>

        <div class="mb-6">
          <label class="text-sm font-semibold text-gray-700 mb-2 block">Key services you offer <span class="text-gray-300 font-normal">(optional)</span></label>
          <input v-model="services" type="text" placeholder="e.g. Full grooms, nail trims, puppy's first haircut, dematting"
            class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-400 focus:outline-none bg-white text-gray-900 placeholder-gray-300 text-sm">
        </div>
      </div>

      <!-- Step 2: Brand Voice -->
      <div v-if="step === 2" class="animate-fade-in">
        <div class="text-center mb-8">
          <div class="text-4xl mb-3">🎨</div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">What's your brand vibe?</h1>
          <p class="text-gray-500">This sets the tone for all your captions.</p>
        </div>

        <div class="mb-8">
          <label class="text-sm font-semibold text-gray-700 mb-3 block">How do you want to sound on social media?</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button v-for="v in vibes" :key="v.id" @click="vibe = v.id"
              :class="['p-4 rounded-xl border-2 text-left transition-all cursor-pointer', vibe === v.id ? 'border-amber-400 bg-amber-50 shadow-md' : 'border-gray-200 bg-white hover:border-gray-300']">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xl">{{ v.emoji }}</span>
                <span class="font-semibold text-gray-900 text-sm">{{ v.label }}</span>
              </div>
              <p class="text-gray-400 text-xs">{{ v.desc }}</p>
            </button>
          </div>
        </div>

        <div class="mb-6">
          <label class="text-sm font-semibold text-gray-700 mb-3 block">Who are your ideal clients?</label>
          <div class="grid grid-cols-2 gap-3">
            <button v-for="a in audiences" :key="a.id" @click="audience = a.id"
              :class="['p-3 rounded-xl border-2 text-left transition-all cursor-pointer', audience === a.id ? 'border-amber-400 bg-amber-50 shadow-md' : 'border-gray-200 bg-white hover:border-gray-300']">
              <span class="text-lg">{{ a.emoji }}</span>
              <p class="font-medium text-gray-900 mt-1 text-sm">{{ a.label }}</p>
            </button>
          </div>
        </div>
      </div>

      <!-- Step 3: Platforms -->
      <div v-if="step === 3" class="animate-fade-in">
        <div class="text-center mb-8">
          <div class="text-4xl mb-3">📱</div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Where do you post?</h1>
          <p class="text-gray-500">We'll format captions differently for each platform.</p>
        </div>

        <div class="mb-8">
          <label class="text-sm font-semibold text-gray-700 mb-3 block">Select all that apply</label>
          <div class="grid grid-cols-1 gap-3">
            <button v-for="p in platformOptions" :key="p.id" @click="togglePlatform(p.id)"
              :class="['p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex items-center gap-4', platforms.includes(p.id) ? 'border-amber-400 bg-amber-50 shadow-md' : 'border-gray-200 bg-white hover:border-gray-300']">
              <span class="text-3xl">{{ p.emoji }}</span>
              <div>
                <p class="font-semibold text-gray-900">{{ p.label }}</p>
                <p class="text-gray-400 text-xs" v-if="p.id === 'instagram'">Square posts, Reels captions, Stories ideas</p>
                <p class="text-gray-400 text-xs" v-if="p.id === 'facebook'">Longer posts, community engagement, shares</p>
                <p class="text-gray-400 text-xs" v-if="p.id === 'tiktok'">Short captions, trending hooks, viral angles</p>
              </div>
              <div class="ml-auto">
                <div :class="['w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all', platforms.includes(p.id) ? 'border-amber-500 bg-amber-500 text-white' : 'border-gray-300']">
                  <span v-if="platforms.includes(p.id)" class="text-xs">✓</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Step 4: Frequency & Language -->
      <div v-if="step === 4" class="animate-fade-in">
        <div class="text-center mb-8">
          <div class="text-4xl mb-3">📆</div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">How often do you post?</h1>
          <p class="text-gray-500">We'll build your calendar around your ideal posting schedule.</p>
        </div>

        <div class="mb-8">
          <label class="text-sm font-semibold text-gray-700 mb-3 block">Posting frequency</label>
          <div class="grid grid-cols-1 gap-3">
            <button v-for="f in frequencies" :key="f.id" @click="frequency = f.id"
              :class="['p-4 rounded-xl border-2 text-left transition-all cursor-pointer', frequency === f.id ? 'border-amber-400 bg-amber-50 shadow-md' : 'border-gray-200 bg-white hover:border-gray-300']">
              <div class="flex items-center gap-3">
                <span class="text-2xl">{{ f.emoji }}</span>
                <div>
                  <p class="font-semibold text-gray-900 text-sm">{{ f.label }}</p>
                  <p class="text-gray-400 text-xs">{{ f.desc }}</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div class="mb-6">
          <label class="text-sm font-semibold text-gray-700 mb-3 block">Caption language</label>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button v-for="l in languages" :key="l.id" @click="language = l.id"
              :class="['p-3 rounded-xl border-2 text-left transition-all cursor-pointer flex items-center gap-2', language === l.id ? 'border-amber-400 bg-amber-50 shadow-md' : 'border-gray-200 bg-white hover:border-gray-300']">
              <span class="text-xl">{{ l.flag }}</span>
              <span class="font-medium text-gray-900 text-sm">{{ l.label }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Step 5: Goals -->
      <div v-if="step === 5" class="animate-fade-in">
        <div class="text-center mb-8">
          <div class="text-4xl mb-3">🎯</div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">What's your #1 goal?</h1>
          <p class="text-gray-500">We'll tailor your captions to drive this result.</p>
        </div>

        <div class="mb-8">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button v-for="g in goals" :key="g.id" @click="goal = g.id"
              :class="['p-5 rounded-xl border-2 text-left transition-all cursor-pointer', goal === g.id ? 'border-amber-400 bg-amber-50 shadow-md' : 'border-gray-200 bg-white hover:border-gray-300']">
              <span class="text-3xl">{{ g.emoji }}</span>
              <p class="font-semibold text-gray-900 mt-2">{{ g.label }}</p>
            </button>
          </div>
        </div>

        <!-- Preview summary -->
        <div class="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h3 class="font-semibold text-gray-900 mb-3 text-sm">Your brand profile:</h3>
          <div class="space-y-2 text-sm">
            <div class="flex gap-2"><span class="text-gray-400 w-24 shrink-0">Business:</span><span class="text-gray-700">{{ businessTypes.find(b => b.id === businessType)?.label || customBusiness }} {{ businessName ? `(${businessName})` : '' }}</span></div>
            <div v-if="location" class="flex gap-2"><span class="text-gray-400 w-24 shrink-0">Location:</span><span class="text-gray-700">{{ location }}</span></div>
            <div class="flex gap-2"><span class="text-gray-400 w-24 shrink-0">Vibe:</span><span class="text-gray-700">{{ vibes.find(v => v.id === vibe)?.label }}</span></div>
            <div class="flex gap-2"><span class="text-gray-400 w-24 shrink-0">Platforms:</span><span class="text-gray-700">{{ platforms.map(p => platformOptions.find(o => o.id === p)?.label).join(', ') }}</span></div>
            <div class="flex gap-2"><span class="text-gray-400 w-24 shrink-0">Frequency:</span><span class="text-gray-700">{{ frequencies.find(f => f.id === frequency)?.label }}</span></div>
            <div class="flex gap-2"><span class="text-gray-400 w-24 shrink-0">Language:</span><span class="text-gray-700">{{ languages.find(l => l.id === language)?.flag }} {{ languages.find(l => l.id === language)?.label }}</span></div>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="flex justify-between items-center mt-8">
        <button v-if="step > 1" @click="step--" class="text-gray-500 hover:text-gray-700 text-sm font-medium cursor-pointer">
          Back
        </button>
        <div v-else></div>
        <button @click="nextStep" :disabled="!canProceed"
          :class="['px-8 py-3 rounded-full font-semibold transition-all text-sm', canProceed ? 'bg-amber-500 hover:bg-amber-600 text-white hover:shadow-lg hover:shadow-amber-200 cursor-pointer hover:-translate-y-0.5' : 'bg-gray-200 text-gray-400 cursor-not-allowed']">
          {{ step === totalSteps ? 'Generate My Content' : 'Next' }}
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fade-in 0.4s ease-out; }
</style>
