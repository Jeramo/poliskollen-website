import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'

// Import pages
import Home from './pages/Home.vue'
import Support from './pages/Support.vue'
import Privacy from './pages/Privacy.vue'

// Define routes with SEO meta
const routes = [
  {
    path: '/',
    component: Home,
    meta: {
      title: 'Poliskollen - Polishändelser i realtid',
      description: 'Få polishändelser direkt i fickan. Poliskollen visar dig händelser nära dig i realtid på en interaktiv karta med push-notiser och Apple Watch-stöd.',
    },
  },
  {
    path: '/support',
    component: Support,
    meta: {
      title: 'Support - Poliskollen',
      description: 'Behöver du hjälp med Poliskollen? Kontakta oss eller hitta svar på vanliga frågor om appen, push-notiser och prenumeration.',
    },
  },
  {
    path: '/privacy',
    component: Privacy,
    meta: {
      title: 'Integritetspolicy - Poliskollen',
      description: 'Läs Poliskollens integritetspolicy. Vi värnar om din personliga integritet och förklarar hur vi hanterar dina uppgifter.',
    },
  },
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

// Update document head on each navigation
const BASE_URL = 'https://poliskollen.nu'
const homeRoute = routes.find((r) => r.path === '/')

router.afterEach((to) => {
  const title = to.meta.title || homeRoute.meta.title
  const description = to.meta.description || homeRoute.meta.description
  const canonicalUrl = BASE_URL + (to.path === '/' ? '' : to.path)

  document.title = title

  const setMeta = (attr, key, content) => {
    let el = document.querySelector(`meta[${attr}="${key}"]`)
    if (el) {
      el.setAttribute('content', content)
    } else {
      el = document.createElement('meta')
      el.setAttribute(attr, key)
      el.setAttribute('content', content)
      document.head.appendChild(el)
    }
  }

  setMeta('name', 'description', description)
  setMeta('property', 'og:title', title)
  setMeta('property', 'og:description', description)
  setMeta('property', 'og:url', canonicalUrl)
  setMeta('name', 'twitter:title', title)
  setMeta('name', 'twitter:description', description)

  const canonical = document.querySelector('link[rel="canonical"]')
  if (canonical) {
    canonical.setAttribute('href', canonicalUrl)
  }
})

// Create and mount app
const app = createApp(App)
app.use(router)
app.mount('#app')
// Build 1772825853
