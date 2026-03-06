import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'

// Import pages
import Home from './pages/Home.vue'
import Support from './pages/Support.vue'
import Privacy from './pages/Privacy.vue'

// Define routes
const routes = [
  { path: '/', component: Home },
  { path: '/support', component: Support },
  { path: '/privacy', component: Privacy },
]

// Create router instance
const router = createRouter({
  history: createWebHistory('/'),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0, behavior: 'smooth' }
  },
})

// Create and mount app
const app = createApp(App)
app.use(router)
app.mount('#app')
// Build 1772825853
