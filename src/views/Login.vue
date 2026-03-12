<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-logo">🐾</div>
      <h1 class="login-title">PawPost</h1>
      <p class="login-subtitle">AI captions for pet businesses</p>

      <template v-if="step === 'email'">
        <form @submit.prevent="sendLink" class="login-form">
          <label class="login-label" for="email">Your email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="hello@yourbusiness.com"
            class="login-input"
            required
            autofocus
          />
          <button type="submit" class="login-btn" :disabled="sending">
            {{ sending ? 'Sending...' : 'Send Login Link' }}
          </button>
          <p v-if="error" class="login-error">{{ error }}</p>
        </form>
        <p class="login-hint">No password needed. We'll email you a login link.</p>
      </template>

      <template v-if="step === 'sent'">
        <div class="login-sent">
          <div class="login-sent-icon">📧</div>
          <h2 class="login-sent-title">Check your email</h2>
          <p class="login-sent-text">We sent a login link to <strong>{{ email }}</strong></p>
          <p class="login-sent-sub">The link expires in 15 minutes.</p>
          <button @click="step = 'email'" class="login-retry-btn">Use a different email</button>
        </div>
      </template>

      <template v-if="step === 'verifying'">
        <div class="login-sent">
          <div class="login-sent-icon">⏳</div>
          <p class="login-sent-text">Logging you in...</p>
        </div>
      </template>

      <template v-if="step === 'error'">
        <div class="login-sent">
          <div class="login-sent-icon">⚠️</div>
          <h2 class="login-sent-title">Link expired</h2>
          <p class="login-sent-text">{{ verifyError }}</p>
          <button @click="step = 'email'" class="login-btn">Try Again</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const step = ref('email')
const email = ref('')
const sending = ref(false)
const error = ref('')
const verifyError = ref('')

onMounted(async () => {
  // Check if user is already logged in
  try {
    const res = await fetch('/api/auth?action=me', { credentials: 'include' })
    if (res.ok) {
      router.replace('/dashboard')
      return
    }
  } catch {}

  // Check if there's a token in the URL (coming from magic link)
  const token = route.query.token
  if (token) {
    step.value = 'verifying'
    try {
      const res = await fetch('/api/auth?action=verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token }),
      })
      const data = await res.json()
      if (res.ok && data.ok) {
        router.replace('/dashboard')
      } else {
        verifyError.value = data.error || 'Invalid or expired link. Please request a new one.'
        step.value = 'error'
      }
    } catch {
      verifyError.value = 'Something went wrong. Please try again.'
      step.value = 'error'
    }
  }
})

async function sendLink() {
  if (!email.value.trim()) return
  sending.value = true
  error.value = ''
  try {
    const res = await fetch('/api/auth?action=send-magic-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value.trim() }),
    })
    const data = await res.json()
    if (res.ok) {
      step.value = 'sent'
    } else {
      error.value = data.error || 'Failed to send login link'
    }
  } catch {
    error.value = 'Network error. Please try again.'
  }
  sending.value = false
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FFFBF5;
  padding: 20px;
}

.login-card {
  background: #fff;
  border-radius: 20px;
  padding: 48px 40px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 8px 40px rgba(0,0,0,.06);
  border: 1px solid #f5f0eb;
}

.login-logo { font-size: 48px; margin-bottom: 8px; }
.login-title { font-family: 'Fraunces', serif; font-size: 32px; color: #1C1917; margin: 0 0 4px; font-weight: 800; }
.login-subtitle { font-size: 15px; color: #78716c; margin: 0 0 32px; }

.login-form { display: flex; flex-direction: column; gap: 12px; }
.login-label { font-size: 13px; font-weight: 700; color: #57534e; text-align: left; text-transform: uppercase; letter-spacing: .03em; }
.login-input {
  width: 100%;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid #e7e5e4;
  font-size: 16px;
  font-family: inherit;
  box-sizing: border-box;
  transition: border-color .15s;
}
.login-input:focus { outline: none; border-color: #D97706; box-shadow: 0 0 0 3px rgba(217,119,6,.1); }

.login-btn {
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  background: #D97706;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: opacity .2s;
  margin-top: 4px;
}
.login-btn:hover { opacity: .9; }
.login-btn:disabled { opacity: .4; cursor: not-allowed; }

.login-error { color: #ef4444; font-size: 14px; margin: 4px 0 0; }
.login-hint { font-size: 13px; color: #a8a29e; margin-top: 16px; }

.login-sent { padding: 16px 0; }
.login-sent-icon { font-size: 48px; margin-bottom: 12px; }
.login-sent-title { font-size: 22px; font-weight: 800; color: #1C1917; margin: 0 0 8px; }
.login-sent-text { font-size: 15px; color: #57534e; margin: 0 0 6px; line-height: 1.5; }
.login-sent-sub { font-size: 13px; color: #a8a29e; margin: 0 0 20px; }
.login-retry-btn { background: none; border: none; color: #D97706; font-size: 14px; font-weight: 600; cursor: pointer; padding: 8px; }
.login-retry-btn:hover { text-decoration: underline; }

@media (max-width: 480px) {
  .login-card { padding: 32px 24px; }
}
</style>
