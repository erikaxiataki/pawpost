import { createRouter, createWebHistory } from 'vue-router'
import Landing from '../views/Landing.vue'
import Onboarding from '../views/Onboarding.vue'
import Dashboard from '../views/Dashboard.vue'

const routes = [
  { path: '/', component: Landing },
  { path: '/onboarding', component: Onboarding },
  { path: '/dashboard', component: Dashboard },
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})
