<script setup>
import { RouterView, RouterLink } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
const appIcon = '/assets/app-icon.png'

// Scroll to top button visibility
const showScrollTop = ref(false)
const isScrolled = ref(false)
const scrollProgress = ref(0)

// Mobile menu state
const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
  // Prevent body scroll when menu is open
  document.body.style.overflow = mobileMenuOpen.value ? 'hidden' : ''
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
  document.body.style.overflow = ''
}

// Theme management
const isDark = ref(false)

const initTheme = () => {
  const stored = localStorage.getItem('poliskollen-theme')
  if (stored) {
    isDark.value = stored === 'dark'
  } else {
    // Default to dark mode on first visit
    isDark.value = true
  }
  applyTheme()
}

const applyTheme = () => {
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  localStorage.setItem('poliskollen-theme', isDark.value ? 'dark' : 'light')
  applyTheme()
}

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 400
  isScrolled.value = window.scrollY > 10
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  initTheme()
  window.addEventListener('scroll', handleScroll, { passive: true })
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('poliskollen-theme')) {
      isDark.value = e.matches
      applyTheme()
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="app">
    <!-- Skip to main content link for accessibility -->
    <a href="#main-content" class="skip-link">Hoppa till innehåll</a>
    
    <!-- Navigation -->
    <nav class="navbar" :class="{ scrolled: isScrolled }" role="navigation" aria-label="Huvudmeny">
      <div class="scroll-progress-bar" :style="{ width: scrollProgress + '%' }"></div>
      <div class="container navbar-content">
        <RouterLink to="/" class="logo" @click="closeMobileMenu">
          <img :src="appIcon" alt="Poliskollen" class="logo-icon" />
        </RouterLink>
        
        <!-- Desktop Navigation -->
        <div class="nav-links desktop-nav">
          <RouterLink to="/">Hem</RouterLink>
          <RouterLink to="/support">Support</RouterLink>
          <RouterLink to="/privacy">Integritet</RouterLink>
          <button
            class="theme-toggle"
            @click="toggleTheme"
            :aria-label="isDark ? 'Byt till ljust lage' : 'Byt till morkt lage'"
          >
            <Transition name="theme-icon" mode="out-in">
              <svg v-if="isDark" key="sun" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
              <svg v-else key="moon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            </Transition>
          </button>
        </div>
        
        <!-- Mobile Menu Button -->
        <button 
          class="mobile-menu-btn"
          @click="toggleMobileMenu"
          :aria-label="mobileMenuOpen ? 'Stang meny' : 'Oppna meny'"
          :aria-expanded="mobileMenuOpen"
        >
          <span class="hamburger" :class="{ open: mobileMenuOpen }">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>
    </nav>
    
    <!-- Mobile Menu Overlay -->
    <Transition name="mobile-menu">
      <div v-if="mobileMenuOpen" class="mobile-menu-overlay" @click="closeMobileMenu">
        <div class="mobile-menu" @click.stop>
          <RouterLink to="/" class="mobile-nav-link" @click="closeMobileMenu">Hem</RouterLink>
          <RouterLink to="/support" class="mobile-nav-link" @click="closeMobileMenu">Support</RouterLink>
          <RouterLink to="/privacy" class="mobile-nav-link" @click="closeMobileMenu">Integritet</RouterLink>
          <div class="mobile-menu-divider"></div>
          <button 
            class="mobile-theme-toggle" 
            @click="toggleTheme"
          >
            <svg v-if="isDark" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
            <span>{{ isDark ? 'Ljust lage' : 'Morkt lage' }}</span>
          </button>
          <a href="https://apps.apple.com/app/poliskollen" target="_blank" rel="noopener" class="mobile-cta">
            Ladda ner appen
          </a>
        </div>
      </div>
    </Transition>

    <!-- Main Content -->
    <main>
      <RouterView v-slot="{ Component }">
        <Transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <!-- Scroll to Top Button -->
    <Transition name="scroll-top">
      <button 
        v-if="showScrollTop" 
        class="scroll-top-btn" 
        @click="scrollToTop"
        aria-label="Scrolla till toppen"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 15l-6-6-6 6"/>
        </svg>
      </button>
    </Transition>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <img :src="appIcon" alt="Poliskollen" class="footer-logo" loading="lazy" />
            <p>Polishändelser i realtid</p>
          </div>
          
          <div class="footer-links">
            <h4>Länkar</h4>
            <RouterLink to="/">Hem</RouterLink>
            <RouterLink to="/support">Support</RouterLink>
            <RouterLink to="/privacy">Integritetspolicy</RouterLink>
          </div>
          
          <div class="footer-links">
            <h4>Ladda ner</h4>
            <a href="https://apps.apple.com/app/poliskollen" target="_blank" rel="noopener">App Store</a>
            <span class="coming-soon">Android (kommer snart)</span>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; {{ new Date().getFullYear() }} Poliskollen. Alla rättigheter förbehållna.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}

/* Scroll Progress Bar */
.scroll-progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--poliskollen-accent), #3D7AB8);
  z-index: 101;
  border-radius: 0 2px 2px 0;
}

/* Navbar */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
  box-shadow: none;
  transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

.navbar.scrolled {
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.08);
}

[data-theme="dark"] .navbar.scrolled {
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.3);
}

[data-theme="dark"] .navbar {
  background: rgba(28, 28, 30, 0.95);
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--text-primary);
  font-weight: 700;
  font-size: 1.25rem;
}

.logo:hover {
  color: var(--text-primary);
}

.logo-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.logo:hover .logo-icon {
  transform: scale(1.1) rotate(-6deg);
}

.logo-text {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

.nav-links {
  display: flex;
  gap: var(--space-xl);
}

.nav-links a {
  color: var(--text-secondary);
  font-weight: 500;
  transition: color 0.2s ease, transform 0.2s ease;
  position: relative;
  padding-bottom: 4px;
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--poliskollen-accent), #3D7AB8);
  border-radius: 1px;
  transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1), left 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav-links a:hover::after,
.nav-links a.router-link-active::after {
  width: 100%;
  left: 0;
}

.nav-links a:hover {
  color: var(--poliskollen-accent);
  transform: translateY(-1px);
}

.nav-links a.router-link-active {
  color: var(--poliskollen-accent);
}

/* Theme Toggle */
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-lg);
  background: transparent;
  color: var(--text-secondary);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  margin-left: var(--space-sm);
  position: relative;
  overflow: hidden;
}

.theme-toggle::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--poliskollen-accent);
  border-radius: var(--radius-lg);
  transform: scale(0);
  opacity: 0;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
}

.theme-toggle:hover::before {
  transform: scale(1);
  opacity: 0.1;
}

.theme-toggle:hover {
  color: var(--poliskollen-accent);
  transform: scale(1.05);
}

.theme-toggle:active {
  transform: scale(0.95);
}

.theme-toggle svg {
  position: relative;
  z-index: 1;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.theme-toggle:hover svg {
  transform: rotate(20deg);
}

/* Theme icon swap animation */
.theme-icon-enter-active {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
}

.theme-icon-leave-active {
  transition: transform 0.2s ease, opacity 0.15s ease;
}

.theme-icon-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.5);
}

.theme-icon-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.5);
}

/* Footer */
.footer {
  background: var(--bg-dark);
  color: var(--text-light);
  padding: var(--space-3xl) 0 var(--space-xl);
  margin-top: var(--space-3xl);
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: var(--space-2xl);
  margin-bottom: var(--space-2xl);
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.footer-logo {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-lg);
}

.footer-brand p {
  color: rgba(255, 255, 255, 0.7);
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.footer-links h4 {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: var(--space-sm);
}

.footer-links a {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9375rem;
  position: relative;
  padding-left: 0;
  padding-bottom: 2px;
  transition: color 0.2s ease, padding-left 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-links a::before {
  content: '→';
  position: absolute;
  left: 0;
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity 0.2s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  font-size: 0.8125rem;
}

.footer-links a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1.5px;
  background: rgba(255, 255, 255, 0.6);
  transition: width 0.25s ease;
}

.footer-links a:hover {
  color: var(--text-light);
  padding-left: 18px;
}

.footer-links a:hover::before {
  opacity: 1;
  transform: translateX(0);
}

.footer-links a:hover::after {
  width: 100%;
}

.coming-soon {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9375rem;
  font-style: italic;
}

.footer-bottom {
  padding-top: var(--space-xl);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.875rem;
}

/* Mobile Menu Button */
.mobile-menu-btn {
  display: none;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  padding: 0;
  transition: background 0.2s ease;
}

.mobile-menu-btn:hover {
  background: var(--card-bg);
}

.mobile-menu-btn:active {
  opacity: 0.7;
}

.mobile-menu-btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.hamburger {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 24px;
}

.hamburger span {
  display: block;
  height: 2px;
  width: 100%;
  background: var(--text-primary);
  border-radius: 2px;
  transition: all 0.3s ease;
}

.hamburger.open span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.hamburger.open span:nth-child(2) {
  opacity: 0;
  transform: translateX(-10px);
}

.hamburger.open span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* Mobile Menu Overlay */
.mobile-menu-overlay {
  position: fixed;
  inset: 0;
  top: 70px;
  z-index: 99;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.mobile-menu {
  position: absolute;
  top: 0;
  right: 0;
  width: 280px;
  max-width: 80vw;
  height: 100%;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: var(--space-xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
}

[data-theme="dark"] .mobile-menu {
  background: rgba(28, 28, 30, 0.85);
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  min-height: 44px;
  padding: var(--space-md) var(--space-sm);
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--text-primary);
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
  opacity: 0;
  transform: translateX(20px);
  animation: mobileNavIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.mobile-nav-link:nth-child(1) { animation-delay: 0.08s; }
.mobile-nav-link:nth-child(2) { animation-delay: 0.15s; }
.mobile-nav-link:nth-child(3) { animation-delay: 0.22s; }

@keyframes mobileNavIn {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes mobileNavFade {
  to { opacity: 1; }
}

@keyframes mobileCtaIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.mobile-nav-link:hover,
.mobile-nav-link.router-link-active {
  background: var(--bg-secondary);
  color: var(--poliskollen-accent);
}

.mobile-nav-link:active {
  transform: scale(0.97);
  background: rgba(22, 90, 155, 0.08);
}

.mobile-menu-divider {
  height: 1px;
  background: var(--border-color);
  margin: var(--space-md) 0;
  opacity: 0;
  animation: mobileNavFade 0.3s ease 0.28s forwards;
}

.mobile-theme-toggle {
  display: flex;
  align-items: center;
  min-height: 44px;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-sm);
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-secondary);
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0;
  transform: translateX(20px);
  animation: mobileNavIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) 0.32s forwards;
}

.mobile-theme-toggle:hover {
  background: var(--bg-secondary);
  color: var(--poliskollen-accent);
}

.mobile-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  margin-top: auto;
  padding: var(--space-md);
  text-align: center;
  font-weight: 600;
  color: white;
  background: var(--poliskollen-accent);
  border-radius: var(--radius-lg);
  transition: all 0.2s ease;
  opacity: 0;
  transform: translateY(10px);
  animation: mobileCtaIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
}

.mobile-cta:hover {
  background: #1a6ab8;
  color: white;
}

/* Mobile Menu Transitions */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.3s ease;
}

.mobile-menu-enter-active .mobile-menu,
.mobile-menu-leave-active .mobile-menu {
  transition: transform 0.3s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}

.mobile-menu-enter-from .mobile-menu,
.mobile-menu-leave-to .mobile-menu {
  transform: translateX(100%);
}

@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }
  
  .mobile-menu-btn {
    display: flex;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    gap: var(--space-xl);
  }
}

/* Scroll to Top Button */
.scroll-top-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 99;
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background: var(--poliskollen-accent);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(22, 90, 155, 0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.scroll-top-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 16px rgba(22, 90, 155, 0.4);
  background: #1a6ab8;
}

.scroll-top-btn:hover svg {
  transform: translateY(-2px);
}

.scroll-top-btn svg {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.scroll-top-btn:active {
  transform: translateY(0);
}

/* Scroll top transition */
.scroll-top-enter-active,
.scroll-top-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.scroll-top-enter-from,
.scroll-top-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

@media (max-width: 768px) {
  .scroll-top-btn {
    bottom: 16px;
    right: 16px;
    width: 44px;
    height: 44px;
  }
}

/* Page transitions */
.page-fade-enter-active {
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.page-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Smooth scrolling */
:global(html) {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  :global(html) {
    scroll-behavior: auto;
  }

  .page-fade-enter-active,
  .page-fade-leave-active {
    transition: opacity 0.15s ease;
  }

  .page-fade-enter-from,
  .page-fade-leave-to {
    transform: none;
  }

  .mobile-nav-link,
  .mobile-menu-divider,
  .mobile-theme-toggle,
  .mobile-cta {
    animation: none;
    opacity: 1;
    transform: none;
  }
}

/* Skip link for accessibility */
.skip-link {
  position: fixed;
  top: -100%;
  left: 50%;
  transform: translateX(-50%);
  background: var(--poliskollen-accent);
  color: white;
  padding: 14px 28px;
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: 0.9375rem;
  z-index: 9999;
  transition: top 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 20px rgba(22, 90, 155, 0.3);
  text-decoration: none;
}

.skip-link:focus {
  top: 16px;
  outline: 3px solid white;
  outline-offset: 2px;
  color: white;
}

/* Custom text selection */
:global(::selection) {
  background: rgba(22, 90, 155, 0.2);
  color: inherit;
}

:global(::-moz-selection) {
  background: rgba(22, 90, 155, 0.2);
  color: inherit;
}

/* Global focus-visible styles */
:global(*:focus-visible) {
  outline: 3px solid var(--poliskollen-accent);
  outline-offset: 2px;
}

:global(button:focus-visible),
:global(a:focus-visible) {
  outline: 3px solid var(--poliskollen-accent);
  outline-offset: 3px;
  border-radius: 4px;
}
</style>
