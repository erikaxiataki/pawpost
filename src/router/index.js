import { createRouter, createWebHistory } from 'vue-router'
import Landing from '../views/Landing.vue'
import Onboarding from '../views/Onboarding.vue'
import Dashboard from '../views/Dashboard.vue'
import Login from '../views/Login.vue'

const routes = [
  { path: '/', component: Landing },
  { path: '/onboarding', component: Onboarding },
  { path: '/login', component: Login },
  {
    path: '/dashboard',
    component: Dashboard,
    beforeEnter: async (to, from, next) => {
      // If coming from magic link, let Login.vue handle verification
      if (to.query.token) {
        next({ path: '/login', query: { token: to.query.token } })
        return
      }

      // Check server-side auth
      try {
        const res = await fetch('/api/auth?action=me', { credentials: 'include' })
        if (res.ok) {
          next()
          return
        }
      } catch {}

      // Fallback: check if user has profile (onboarding not yet done)
      const profile = localStorage.getItem('pawpost_profile')
      if (!profile) {
        next('/onboarding')
      } else {
        // User has done onboarding but not logged in — prompt login
        next('/login')
      }
    },
  },
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})
