# Cinematic Website Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Poliskollen marketing website Home page into a cinematic, Apple-style 10-section storytelling experience.

**Architecture:** Complete rewrite of `src/pages/Home.vue` with 10 full-viewport cinematic sections. Four new composables extract reusable logic (animated counters, scroll direction, section reveals, parallax). One new `PhoneFrame` component wraps screenshots in a phone bezel. `App.vue` gets nav hide/show on scroll direction and conditional theme toggle visibility. All cinematic styles scoped via `.cinematic` class — no breaking changes to Support/Privacy pages.

**Tech Stack:** Vue 3 (Composition API), Vite, pure CSS (no frameworks), Geist font

**Spec:** `docs/superpowers/specs/2026-03-23-cinematic-website-redesign-design.md`

**Note:** This project has no test framework installed (`devDependencies` only has Vite + Vue plugin). Verification is done via `npm run build` (catches template/import errors) and manual browser testing via `npm run dev`. Each task ends with a build verification step.

---

## Task 1: Create `useAnimatedCounter` composable

**Files:**
- Create: `src/composables/useAnimatedCounter.js`

Extracted from current `Home.vue` lines 33-49. Generalized with configurable params.

- [ ] **Step 1: Create the composable file**

```javascript
// src/composables/useAnimatedCounter.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useAnimatedCounter(target, options = {}) {
  const {
    duration = 1500,
    decimals = 0,
    prefix = '',
    suffix = '',
    threshold = 0.15,
  } = options

  const current = ref(0)
  const display = ref(prefix + '0' + suffix)
  const elRef = ref(null)
  let started = false
  let observer = null

  const eased = (t) => 1 - Math.pow(2, -10 * t)

  const animate = () => {
    if (started) return
    started = true
    const start = performance.now()
    const step = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const value = decimals
        ? parseFloat((target * eased(progress)).toFixed(decimals))
        : Math.round(target * eased(progress))
      current.value = value
      display.value = prefix + value + suffix
      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }
    requestAnimationFrame(step)
  }

  onMounted(() => {
    if (!elRef.value) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      const finalValue = decimals ? parseFloat(target.toFixed(decimals)) : target
      current.value = finalValue
      display.value = prefix + finalValue + suffix
      return
    }
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate()
          observer.disconnect()
        }
      },
      { threshold }
    )
    observer.observe(elRef.value)
  })

  onUnmounted(() => {
    if (observer) observer.disconnect()
  })

  return { current, display, elRef }
}
```

- [ ] **Step 2: Verify build**

Run: `cd /Volumes/SSD/Documents/Projects/poliskollen-website && npm run build`
Expected: Build succeeds (unused import is fine — tree-shaken)

- [ ] **Step 3: Commit**

```bash
git add src/composables/useAnimatedCounter.js
git commit -m "feat: extract useAnimatedCounter composable from Home.vue"
```

---

## Task 2: Create `useScrollDirection` composable

**Files:**
- Create: `src/composables/useScrollDirection.js`

- [ ] **Step 1: Create the composable file**

```javascript
// src/composables/useScrollDirection.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollDirection(debounceMs = 50) {
  const direction = ref('up')
  const isDisabled = ref(false)
  let lastY = 0
  let ticking = false
  let timeout = null

  const update = () => {
    if (isDisabled.value) {
      ticking = false
      return
    }
    const currentY = window.scrollY
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      if (currentY > lastY && currentY > 70) {
        direction.value = 'down'
      } else {
        direction.value = 'up'
      }
      lastY = currentY
    }, debounceMs)
    ticking = false
  }

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(update)
      ticking = true
    }
  }

  onMounted(() => {
    lastY = window.scrollY
    window.addEventListener('scroll', onScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
    if (timeout) clearTimeout(timeout)
  })

  return { direction, isDisabled }
}
```

- [ ] **Step 2: Verify build**

Run: `cd /Volumes/SSD/Documents/Projects/poliskollen-website && npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/composables/useScrollDirection.js
git commit -m "feat: add useScrollDirection composable for nav hide/show"
```

---

## Task 3: Create `useSectionReveal` composable

**Files:**
- Create: `src/composables/useSectionReveal.js`

- [ ] **Step 1: Create the composable file**

```javascript
// src/composables/useSectionReveal.js
import { onMounted, onUnmounted } from 'vue'

const REVEAL_STYLES = {
  'fade-up': { from: 'translate3d(0, 40px, 0)', to: 'translate3d(0, 0, 0)' },
  'fade-in': { from: 'translate3d(0, 0, 0)', to: 'translate3d(0, 0, 0)' },
  'scale-in': { from: 'scale(0.92)', to: 'scale(1)' },
  'slide-left': { from: 'translate3d(60px, 0, 0)', to: 'translate3d(0, 0, 0)' },
  'slide-right': { from: 'translate3d(-60px, 0, 0)', to: 'translate3d(0, 0, 0)' },
}

export function useSectionReveal(elRef, options = {}) {
  const {
    type = 'fade-up',
    threshold = 0.15,
    stagger = 0,
    selector = null,
  } = options

  let observer = null

  onMounted(() => {
    if (!elRef.value) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const style = REVEAL_STYLES[type] || REVEAL_STYLES['fade-up']
    const targets = selector
      ? Array.from(elRef.value.querySelectorAll(selector))
      : [elRef.value]

    targets.forEach((el, i) => {
      el.style.opacity = '0'
      el.style.transform = style.from
      el.style.transition = `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * stagger}ms, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * stagger}ms`
    })

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          targets.forEach((el) => {
            el.style.opacity = '1'
            el.style.transform = style.to
          })
          observer.disconnect()
        }
      },
      { threshold }
    )
    observer.observe(elRef.value)
  })

  onUnmounted(() => {
    if (observer) observer.disconnect()
  })
}
```

- [ ] **Step 2: Verify build**

Run: `cd /Volumes/SSD/Documents/Projects/poliskollen-website && npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/composables/useSectionReveal.js
git commit -m "feat: add useSectionReveal composable for scroll-triggered animations"
```

---

## Task 4: Create `useParallax` composable

**Files:**
- Create: `src/composables/useParallax.js`

- [ ] **Step 1: Create the composable file**

```javascript
// src/composables/useParallax.js
import { onMounted, onUnmounted } from 'vue'

export function useParallax(elRef, speed = 0.5) {
  let ticking = false

  const update = () => {
    if (!elRef.value) {
      ticking = false
      return
    }
    const rect = elRef.value.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const elementCenter = rect.top + rect.height / 2
    const viewportCenter = viewportHeight / 2
    const offset = (elementCenter - viewportCenter) * (1 - speed)
    elRef.value.style.transform = `translate3d(0, ${offset}px, 0)`
    ticking = false
  }

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(update)
      ticking = true
    }
  }

  onMounted(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return
    window.addEventListener('scroll', onScroll, { passive: true })
    update()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
  })
}
```

- [ ] **Step 2: Verify build**

Run: `cd /Volumes/SSD/Documents/Projects/poliskollen-website && npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/composables/useParallax.js
git commit -m "feat: add useParallax composable for scroll depth effects"
```

---

## Task 5: Create `PhoneFrame` component

**Files:**
- Create: `src/components/PhoneFrame.vue`

- [ ] **Step 1: Create the component file**

```vue
<!-- src/components/PhoneFrame.vue -->
<script setup>
defineProps({
  src: { type: String, required: true },
  alt: { type: String, required: true },
  shadowIntensity: { type: String, default: 'medium', validator: (v) => ['low', 'medium', 'high'].includes(v) },
  angle: { type: Number, default: 0 },
  eager: { type: Boolean, default: false },
})
</script>

<template>
  <div
    class="phone-frame-wrap"
    :class="['shadow-' + shadowIntensity]"
    :style="angle ? { transform: `perspective(800px) rotateY(${angle}deg)` } : {}"
  >
    <div class="phone-bezel">
      <div class="phone-notch"></div>
      <div class="phone-screen">
        <img
          :src="src"
          :alt="alt"
          :loading="eager ? 'eager' : 'lazy'"
          draggable="false"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.phone-frame-wrap {
  display: inline-block;
  will-change: transform;
}

.phone-bezel {
  position: relative;
  width: 260px;
  background: #1a1a2e;
  border-radius: 36px;
  padding: 12px;
  border: 2px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.phone-notch {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 3px;
  z-index: 2;
}

.phone-screen {
  border-radius: 24px;
  overflow: hidden;
  background: #000;
}

.phone-screen img {
  display: block;
  width: 100%;
  height: auto;
}

/* Shadow intensities */
.shadow-low {
  filter: drop-shadow(0 10px 30px rgba(22, 90, 155, 0.15));
}

.shadow-medium {
  filter: drop-shadow(0 20px 60px rgba(22, 90, 155, 0.3));
}

.shadow-high {
  filter: drop-shadow(0 30px 80px rgba(22, 90, 155, 0.4));
}

@media (max-width: 768px) {
  .phone-bezel {
    width: 200px;
    border-radius: 28px;
    padding: 10px;
  }

  .phone-screen {
    border-radius: 18px;
  }

  .phone-notch {
    width: 60px;
    height: 5px;
    top: 10px;
  }
}

@media (max-width: 480px) {
  .phone-bezel {
    width: 180px;
    border-radius: 24px;
    padding: 8px;
  }

  .phone-screen {
    border-radius: 16px;
  }
}
</style>
```

- [ ] **Step 2: Verify build**

Run: `cd /Volumes/SSD/Documents/Projects/poliskollen-website && npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/components/PhoneFrame.vue
git commit -m "feat: add PhoneFrame component for screenshot mockups"
```

---

## Task 6: Add cinematic CSS styles to `style.css`

**Files:**
- Modify: `src/style.css` (append at end of file)

- [ ] **Step 1: Append cinematic styles**

Add the following CSS at the END of `src/style.css` (after the existing `@media (prefers-reduced-motion: reduce)` block at line ~441). Do NOT modify any existing styles.

```css
/* ============================================
   CINEMATIC HOME PAGE STYLES
   Scoped via .cinematic class on Home wrapper
   ============================================ */

.cinematic {
  background: #0a0a0f;
  color: #ffffff;
}

/* Cinematic section base */
.cinematic-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-3xl) var(--space-lg);
  overflow: hidden;
}

.cinematic-section .container {
  position: relative;
  z-index: 1;
}

/* Hero background orbs */
.cinematic .hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
  pointer-events: none;
}

.cinematic .hero-orb-1 {
  width: 500px;
  height: 500px;
  background: #165A9B;
  top: -20%;
  left: -10%;
  animation: orbDrift1 20s ease-in-out infinite;
}

.cinematic .hero-orb-2 {
  width: 400px;
  height: 400px;
  background: #3D7AB8;
  bottom: -15%;
  right: -5%;
  animation: orbDrift2 25s ease-in-out infinite;
}

.cinematic .hero-orb-3 {
  width: 300px;
  height: 300px;
  background: #165A9B;
  top: 40%;
  right: 20%;
  opacity: 0.15;
  animation: orbDrift3 18s ease-in-out infinite;
}

@keyframes orbDrift1 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(30px, 20px); }
}

@keyframes orbDrift2 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-20px, -30px); }
}

@keyframes orbDrift3 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(15px, -15px); }
}

/* Hero entrance stagger */
.cinematic .hero-enter {
  opacity: 0;
  transform: translateY(30px);
  animation: heroFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes heroFadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Stagger delays via CSS custom property --delay */
.cinematic .hero-enter {
  animation-delay: calc(var(--delay) * 0.2s);
}

/* Section headings */
.cinematic h1 {
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: #ffffff;
}

.cinematic h2 {
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: #ffffff;
}

.cinematic .section-copy {
  font-size: clamp(1rem, 1.5vw, 1.25rem);
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.6);
  max-width: 480px;
}

.cinematic .section-label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #165A9B;
  margin-bottom: var(--space-md);
}

/* Pro badge */
.cinematic .pro-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  background: #165A9B;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  border-radius: var(--radius-full);
  margin-left: var(--space-sm);
}

/* Feature section layout — text + phone */
.cinematic .feature-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3xl);
  align-items: center;
  max-width: 1100px;
  margin: 0 auto;
}

.cinematic .feature-layout.reversed {
  direction: rtl;
}

.cinematic .feature-layout.reversed > * {
  direction: ltr;
}

.cinematic .feature-text {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.cinematic .feature-phone {
  display: flex;
  justify-content: center;
}

/* Dual phone layout */
.cinematic .dual-phones {
  display: flex;
  gap: var(--space-xl);
  justify-content: center;
  align-items: center;
}

/* Animated dots around map */
.cinematic .map-dots {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.cinematic .map-dot {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #165A9B;
  border-radius: 50%;
  opacity: 0;
  animation: dotPulse 3s ease-in-out infinite;
}

@keyframes dotPulse {
  0%, 100% { opacity: 0; transform: scale(0.5); }
  50% { opacity: 0.8; transform: scale(1); }
}

/* Phone float animation */
@keyframes phoneFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.cinematic .phone-float {
  animation: phoneFloat 4s ease-in-out infinite;
}

/* Stats bar */
.cinematic .hero-stats {
  display: flex;
  align-items: center;
  gap: var(--space-xl);
}

.cinematic .hero-stats .stat {
  text-align: center;
}

.cinematic .hero-stats .stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
}

.cinematic .hero-stats .stat-label {
  display: block;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.cinematic .hero-stats .stat-divider {
  width: 1px;
  height: 32px;
  background: rgba(255, 255, 255, 0.15);
}

/* CTA button */
.cinematic .cta-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 14px 32px;
  background: #165A9B;
  color: #ffffff;
  font-weight: 600;
  font-size: 1rem;
  border-radius: var(--radius-lg);
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.cinematic .cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(22, 90, 155, 0.4);
  background: #1a6ab8;
  color: #ffffff;
}

.cinematic .cta-btn:active {
  transform: translateY(0);
}

/* Story section text */
.cinematic .story-line {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 800;
  line-height: 1.2;
  text-align: center;
}

.cinematic .story-line-muted {
  font-size: clamp(1.25rem, 2.5vw, 1.75rem);
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
}

.cinematic .story-line-accent {
  color: #165A9B;
}

/* Social proof */
.cinematic .stars {
  display: flex;
  gap: 4px;
  justify-content: center;
  font-size: 2rem;
  color: #FFD700;
}

.cinematic .review-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-lg);
  max-width: 900px;
  margin: 0 auto;
}

.cinematic .review-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
}

.cinematic .review-card p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9375rem;
  line-height: 1.6;
  font-style: italic;
}

.cinematic .review-card .reviewer {
  margin-top: var(--space-md);
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.4);
  font-style: normal;
}

/* Pricing cards (cinematic) */
.cinematic .pricing-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-xl);
  max-width: 800px;
  margin: 0 auto;
}

.cinematic .pricing-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-2xl);
  padding: var(--space-2xl);
  display: flex;
  flex-direction: column;
}

.cinematic .pricing-card-pro {
  background: rgba(22, 90, 155, 0.08);
  border-color: rgba(22, 90, 155, 0.3);
  box-shadow: 0 0 60px rgba(22, 90, 155, 0.1);
  transform: scale(1.03);
  position: relative;
}

.cinematic .pricing-popular {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #165A9B;
  color: white;
  padding: 4px 16px;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.cinematic .pricing-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: var(--space-sm);
}

.cinematic .price-amount {
  font-size: 3rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1;
}

.cinematic .price-period {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.4);
}

.cinematic .pricing-features {
  list-style: none;
  margin: var(--space-xl) 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  flex: 1;
}

.cinematic .pricing-features li {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9375rem;
}

.cinematic .pricing-features li svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: #165A9B;
}

.cinematic .pricing-cta {
  display: block;
  text-align: center;
  padding: 14px;
  border-radius: var(--radius-lg);
  font-weight: 600;
  transition: all 0.2s ease;
}

.cinematic .pricing-cta-primary {
  background: #165A9B;
  color: #ffffff;
}

.cinematic .pricing-cta-primary:hover {
  background: #1a6ab8;
  color: #ffffff;
  box-shadow: 0 8px 30px rgba(22, 90, 155, 0.4);
}

.cinematic .pricing-cta-secondary {
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.cinematic .pricing-cta-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

/* FAQ in cinematic */
.cinematic .faq-list {
  max-width: 700px;
  margin: 0 auto;
}

.cinematic .faq-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.cinematic .faq-question {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-lg) 0;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: color 0.2s ease;
}

.cinematic .faq-question:hover {
  color: #3D7AB8;
}

.cinematic .faq-chevron {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  transition: transform 0.3s ease;
  color: rgba(255, 255, 255, 0.4);
}

.cinematic .faq-item.open .faq-chevron {
  transform: rotate(180deg);
}

.cinematic .faq-answer-wrap {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s ease;
}

.cinematic .faq-item.open .faq-answer-wrap {
  grid-template-rows: 1fr;
}

.cinematic .faq-answer {
  overflow: hidden;
}

.cinematic .faq-answer p {
  padding-bottom: var(--space-lg);
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
}

/* Final CTA glow */
.cinematic .final-icon {
  animation: iconPulseGlow 3s ease-in-out infinite;
}

@keyframes iconPulseGlow {
  0%, 100% { filter: drop-shadow(0 0 20px rgba(22, 90, 155, 0.3)); }
  50% { filter: drop-shadow(0 0 40px rgba(22, 90, 155, 0.6)); }
}

/* Quiz section lighter bg */
.cinematic .section-quiz {
  background: #0f0f18;
}

/* Nav hidden state (controlled by JS) */
.navbar.nav-hidden {
  transform: translateY(-100%);
}

/* Footer: remove gap when preceded by cinematic page */
body:has(.cinematic) .footer {
  margin-top: 0;
  background: #0a0a0f;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

/* Responsive */
@media (max-width: 768px) {
  .cinematic-section {
    min-height: auto;
    padding: var(--space-3xl) var(--space-md);
  }

  .cinematic .feature-layout {
    grid-template-columns: 1fr;
    gap: var(--space-2xl);
    text-align: center;
  }

  .cinematic .feature-layout.reversed {
    direction: ltr;
  }

  .cinematic .section-copy {
    margin: 0 auto;
  }

  .cinematic .dual-phones {
    flex-direction: column;
    gap: var(--space-lg);
  }

  .cinematic .pricing-grid {
    grid-template-columns: 1fr;
  }

  .cinematic .pricing-card-pro {
    transform: none;
  }

  .cinematic .hero-stats {
    flex-wrap: wrap;
    justify-content: center;
  }
}

/* Reduced motion for cinematic */
@media (prefers-reduced-motion: reduce) {
  .cinematic .hero-enter {
    animation: none;
    opacity: 1;
    transform: none;
  }

  .cinematic .hero-orb {
    animation: none;
  }

  .cinematic .phone-float {
    animation: none;
  }

  .cinematic .map-dot {
    animation: none;
    opacity: 0.5;
  }

  .cinematic .final-icon {
    animation: none;
  }

  .navbar.nav-hidden {
    transform: none;
  }
}
```

- [ ] **Step 2: Verify build**

Run: `cd /Volumes/SSD/Documents/Projects/poliskollen-website && npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/style.css
git commit -m "feat: add cinematic CSS styles scoped via .cinematic class"
```

---

## Task 7: Update `App.vue` — nav hide/show + conditional theme toggle

**Files:**
- Modify: `src/App.vue`

Two changes: (1) Import `useScrollDirection` and `useRoute`, connect nav visibility. (2) Hide theme toggle on Home route.

- [ ] **Step 1: Update the script section**

In `src/App.vue`, replace the existing `<script setup>` imports (line 1-3) with:

```javascript
import { RouterView, RouterLink, useRoute } from 'vue-router'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useScrollDirection } from './composables/useScrollDirection.js'
```

Add after line 11 (`const scrollProgress = ref(0)`):

```javascript
// Scroll direction for nav hide/show
const { direction: scrollDir, isDisabled: scrollDirDisabled } = useScrollDirection()
const navHidden = computed(() => scrollDir.value === 'down')

// Route-based conditional
const route = useRoute()
const isHome = computed(() => route.path === '/')
```

In the `toggleMobileMenu` function, add `scrollDirDisabled.value = ...` after the existing body overflow toggle. Replace lines 14-18 with:

```javascript
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
  document.body.style.overflow = mobileMenuOpen.value ? 'hidden' : ''
  scrollDirDisabled.value = mobileMenuOpen.value
}
```

In `closeMobileMenu`, replace lines 20-23 with:

```javascript
const closeMobileMenu = () => {
  mobileMenuOpen.value = false
  document.body.style.overflow = ''
  scrollDirDisabled.value = false
}
```

**IMPORTANT:** Modify `applyTheme` (lines 39-41) to respect the cinematic Home page:

```javascript
const applyTheme = () => {
  if (isHome.value) {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  }
}
```

Note: `isHome` must be defined BEFORE `applyTheme` in the file. Move the `isHome` computed and `useRoute` import above the `applyTheme` definition.

- [ ] **Step 2: Add transform to navbar transition in scoped styles**

In `App.vue`'s `<style scoped>`, find the `.navbar` rule (line ~267) and add `transform` to the transition:

```css
.navbar {
  /* ... existing properties ... */
  transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
```

This ensures the nav hide/show animates smoothly. The scoped styles have higher specificity than global styles, so this MUST be in App.vue's scoped block.

- [ ] **Step 3: Update the nav template**

In the `<template>`, on the `.navbar` element (line 87), add the `nav-hidden` class:

```html
<nav class="navbar" :class="{ scrolled: isScrolled, 'nav-hidden': navHidden && !mobileMenuOpen }" role="navigation" aria-label="Huvudmeny">
```

For the theme toggle in the desktop nav (around line 99-121), wrap it with `v-show`:

```html
<button
  v-show="!isHome"
  class="theme-toggle"
  @click="toggleTheme"
  :aria-label="isDark ? 'Byt till ljust lage' : 'Byt till morkt lage'"
>
```

For the mobile theme toggle (around line 147-166), add the same `v-show`:

```html
<button
  v-show="!isHome"
  class="mobile-theme-toggle"
  @click="toggleTheme"
>
```

- [ ] **Step 5: Add route change watcher for theme enforcement**

Add a watcher to enforce dark mode on Home navigation:

```javascript
watch(isHome, () => {
  applyTheme()
}, { immediate: false })
```

Note: Since `applyTheme` now checks `isHome`, this watcher ensures the theme updates when navigating between routes. The `immediate: false` avoids the race condition with `initTheme()` in `onMounted`.

- [ ] **Step 6: Verify build**

Run: `cd /Volumes/SSD/Documents/Projects/poliskollen-website && npm run build`
Expected: Build succeeds

- [ ] **Step 7: Verify dev server**

Run: `cd /Volumes/SSD/Documents/Projects/poliskollen-website && npm run dev`
Open in browser: navigate between Home, Support, Privacy. Verify:
- Nav hides on scroll down, shows on scroll up
- Theme toggle NOT visible on Home page
- Theme toggle visible on Support/Privacy
- Mobile menu works without nav hiding

- [ ] **Step 8: Commit**

```bash
git add src/App.vue
git commit -m "feat: nav hide/show on scroll, hide theme toggle on Home"
```

---

## Task 8: Rewrite `Home.vue` — Complete cinematic page

**Files:**
- Rewrite: `src/pages/Home.vue`

This is the main task. Complete rewrite of the Home page with all 10 cinematic sections.

- [ ] **Step 1: Write the complete new Home.vue**

Replace the ENTIRE content of `src/pages/Home.vue` with the code below.

**IMPORTANT:** This is a complete file replacement. The old Home.vue content is entirely replaced.

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useFaqSchema } from '../composables/useFaqSchema.js'
import { useAnimatedCounter } from '../composables/useAnimatedCounter.js'
import { useSectionReveal } from '../composables/useSectionReveal.js'
import { useParallax } from '../composables/useParallax.js'
import PhoneFrame from '../components/PhoneFrame.vue'

const appIcon = '/assets/app-icon.png'
const APP_STORE_URL = 'https://apps.apple.com/app/id6757537288'

// ---- Animated counters ----
const { display: ratingDisplay, elRef: ratingRef } = useAnimatedCounter(4.3, { duration: 2000, decimals: 1, suffix: ' ★' })
const { display: reviewCountDisplay, elRef: reviewCountRef } = useAnimatedCounter(6, { duration: 1500 })

// ---- Section refs for reveal ----
const storyRef1 = ref(null)
const storyRef2 = ref(null)
const storyRef3 = ref(null)
const mapRef = ref(null)
const aiRef = ref(null)
const trendsRef = ref(null)
const quizRef = ref(null)
const communityRef = ref(null)
const socialProofRef = ref(null)
const pricingRef = ref(null)
const ctaRef = ref(null)

// Hero phone parallax
const heroPhoneRef = ref(null)
useParallax(heroPhoneRef, 0.8)

// Section reveals
useSectionReveal(storyRef1, { type: 'fade-up', threshold: 0.15 })
useSectionReveal(storyRef2, { type: 'fade-up', threshold: 0.35 })
useSectionReveal(storyRef3, { type: 'fade-up', threshold: 0.55 })
useSectionReveal(mapRef, { type: 'fade-up' })
useSectionReveal(aiRef, { type: 'fade-up' })
useSectionReveal(trendsRef, { type: 'fade-up' })
useSectionReveal(quizRef, { type: 'fade-up' })
useSectionReveal(communityRef, { type: 'fade-up' })
useSectionReveal(socialProofRef, { type: 'fade-up', selector: '.review-card', stagger: 150 })
useSectionReveal(pricingRef, { type: 'fade-up' })
useSectionReveal(ctaRef, { type: 'fade-up' })

// ---- FAQ ----
const openFaq = ref(null)
const toggleFaq = (i) => {
  openFaq.value = openFaq.value === i ? null : i
}

const faqs = [
  {
    q: 'Är Poliskollen gratis?',
    a: 'Ja! Grundversionen är helt gratis med alla kärnfunktioner — karta, push-notiser, Apple Watch och widgets. Pro lägger till AI-assistenten och mer.',
  },
  {
    q: 'Vad ingår i Poliskollen Pro?',
    a: 'Pro kostar 9 kr/månad och ger dig AI-assistenten som sammanfattar händelser, quiz-läge, avancerad statistik och prioriterade notiser.',
  },
  {
    q: 'Fungerar appen på Apple Watch?',
    a: 'Ja, Poliskollen har en fullständig Apple Watch-app. Se senaste händelserna direkt på handleden och få notiser.',
  },
  {
    q: 'Varifrån kommer datan?',
    a: 'All data hämtas från Polisens officiella API (polisen.se). Vi visar samma information som polisen publicerar, i realtid.',
  },
  {
    q: 'Finns appen på Android?',
    a: 'Just nu finns Poliskollen bara på iPhone och Apple Watch. En Android-version är planerad men har inget datum ännu.',
  },
]

useFaqSchema(faqs, 'faq-schema')

// ---- Pricing data ----
const freeFeatures = [
  'Interaktiv karta',
  'Push-notiser',
  'Apple Watch-app',
  'Hemskärmswidgets',
  'Grundläggande statistik',
]

const proFeatures = [
  'Allt i Gratis',
  'AI-assistent',
  'Quiz-utmaningar',
  'Avancerad statistik',
  'Prioriterade notiser',
]

// ---- Review data (placeholder — replace with real App Store excerpts) ----
const reviews = [
  { text: 'Fantastisk app! Använder den varje dag för att hålla koll på vad som händer i mitt område.', author: 'App Store-användare' },
  { text: 'Smidig och snabb. Älskar att jag kan få notiser direkt när något händer nära mig.', author: 'App Store-användare' },
  { text: 'Bästa appen för att följa polishändelser. Kartan är riktigt bra.', author: 'App Store-användare' },
]
</script>

<template>
  <div id="main-content" class="cinematic">

    <!-- ============ SECTION 1: HERO ============ -->
    <section class="cinematic-section hero-section" aria-label="Introduktion">
      <div class="hero-bg">
        <div class="hero-orb hero-orb-1"></div>
        <div class="hero-orb hero-orb-2"></div>
        <div class="hero-orb hero-orb-3"></div>
      </div>

      <div class="container" style="text-align: center; position: relative; z-index: 1;">
        <img
          :src="appIcon"
          alt="Poliskollen"
          class="hero-enter"
          style="--delay: 1; width: 80px; height: 80px; border-radius: 20px;"
        />

        <h1 class="hero-enter" style="--delay: 2; margin-top: 1.5rem;">
          Hela Sveriges<br />polishändelser.
        </h1>

        <p class="hero-enter" style="--delay: 3; margin-top: 1rem; font-size: clamp(1.125rem, 2vw, 1.5rem); color: rgba(255,255,255,0.5);">
          I din ficka. I realtid.
        </p>

        <div ref="heroPhoneRef" class="hero-enter" style="--delay: 4; margin-top: 2rem;">
          <PhoneFrame
            src="/screenshots/1-events.jpg"
            alt="Poliskollen händelselista"
            shadow-intensity="high"
            :eager="true"
          />
        </div>

        <div class="hero-stats hero-enter" ref="ratingRef" style="--delay: 5; margin-top: 2rem; justify-content: center;">
          <div class="stat">
            <span class="stat-value">{{ ratingDisplay }}</span>
            <span class="stat-label">Betyg</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-value">Gratis</span>
            <span class="stat-label">Att använda</span>
          </div>
        </div>

        <a :href="APP_STORE_URL" target="_blank" rel="noopener" class="cta-btn hero-enter" style="--delay: 6; margin-top: 1.5rem;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          Ladda ner gratis
        </a>

        <p class="hero-enter" style="--delay: 6; margin-top: 1rem; font-size: 0.8125rem; color: rgba(255,255,255,0.3);">
          Kräver iOS 17.0 · iPhone &amp; Apple Watch
        </p>
      </div>
    </section>

    <!-- ============ SECTION 2: STORY ============ -->
    <section class="cinematic-section" aria-label="Varför Poliskollen">
      <div class="container" style="text-align: center; display: flex; flex-direction: column; gap: 2rem; align-items: center;">
        <div ref="storyRef1" class="story-line">Sverige vaknar.</div>
        <div ref="storyRef2" class="story-line">Vad hände i natt?</div>
        <div ref="storyRef3" class="story-line-muted">Poliskollen ger dig svaret — <span class="story-line-accent">direkt.</span></div>
      </div>
    </section>

    <!-- ============ SECTION 3: MAP ============ -->
    <section class="cinematic-section" aria-labelledby="map-heading">
      <div ref="mapRef" class="feature-layout container">
        <div class="feature-text">
          <span class="section-label">Karta</span>
          <h2 id="map-heading">Se allt. Överallt.</h2>
          <p class="section-copy">Värmekarta och interaktiv karta över hela Sverige. Se var händelser inträffar — i realtid.</p>
        </div>
        <div class="feature-phone" style="position: relative;">
          <PhoneFrame
            src="/screenshots/7-heatmap.jpg"
            alt="Poliskollen värmekarta"
            shadow-intensity="medium"
          />
          <div class="map-dots">
            <span class="map-dot" style="top: 20%; left: 15%; animation-delay: 0s;"></span>
            <span class="map-dot" style="top: 35%; left: 75%; animation-delay: 0.8s;"></span>
            <span class="map-dot" style="top: 55%; left: 25%; animation-delay: 1.6s;"></span>
            <span class="map-dot" style="top: 70%; left: 65%; animation-delay: 2.4s;"></span>
            <span class="map-dot" style="top: 15%; left: 55%; animation-delay: 0.4s;"></span>
            <span class="map-dot" style="top: 80%; left: 40%; animation-delay: 1.2s;"></span>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ SECTION 4: AI & DETAIL ============ -->
    <section class="cinematic-section" aria-labelledby="ai-heading">
      <div ref="aiRef" class="feature-layout reversed container">
        <div class="feature-text">
          <span class="section-label">Detaljer</span>
          <h2 id="ai-heading">Hela bilden. Sammanfattad. <span class="pro-badge">PRO</span></h2>
          <p class="section-copy">AI-sammanfattning, fullständig rapport och plats på kartan. Allt du behöver veta om varje händelse.</p>
        </div>
        <div class="feature-phone">
          <PhoneFrame
            src="/screenshots/8-detail.jpg"
            alt="Poliskollen händelsedetalj med AI-sammanfattning"
            shadow-intensity="medium"
          />
        </div>
      </div>
    </section>

    <!-- ============ SECTION 5: TRENDS & PATTERNS ============ -->
    <section class="cinematic-section" aria-labelledby="trends-heading">
      <div ref="trendsRef" class="container" style="text-align: center;">
        <span class="section-label">Analys</span>
        <h2 id="trends-heading">Upptäck mönster.<br />Följ trender.</h2>
        <p class="section-copy" style="margin: 1rem auto 2.5rem;">Mönsterdetektiven hittar ökningar i ditt område. Trendanalys visar hur din kommun utvecklas vecka för vecka.</p>
        <div class="dual-phones">
          <PhoneFrame
            src="/screenshots/6-trends.jpg"
            alt="Poliskollen trender"
            shadow-intensity="medium"
            :angle="-5"
          />
          <PhoneFrame
            src="/screenshots/5-patterns.jpg"
            alt="Poliskollen mönsterdetektiven"
            shadow-intensity="medium"
            :angle="5"
          />
        </div>
      </div>
    </section>

    <!-- ============ SECTION 6: QUIZ ============ -->
    <section class="cinematic-section section-quiz" aria-labelledby="quiz-heading">
      <div ref="quizRef" class="container" style="text-align: center;">
        <span class="section-label">Underhållning</span>
        <h2 id="quiz-heading">Testa dig själv.</h2>
        <p class="section-copy" style="margin: 1rem auto 2.5rem;">Gissa händelsen — läs en sammanfattning och gissa vilken typ av brott det är. Bygg upp din streak och tävla med dig själv.</p>
        <div class="phone-float">
          <PhoneFrame
            src="/screenshots/4-quiz.jpg"
            alt="Poliskollen quiz"
            shadow-intensity="medium"
          />
        </div>
      </div>
    </section>

    <!-- ============ SECTION 7: COMMUNITY ============ -->
    <section class="cinematic-section" aria-labelledby="community-heading">
      <div ref="communityRef" class="container" style="text-align: center;">
        <span class="section-label">Gemenskap</span>
        <h2 id="community-heading">Engagera dig.<br />Lås upp prestationer.</h2>
        <p class="section-copy" style="margin: 1rem auto 2.5rem;">Håll din streak, samla poäng och lås upp prestationer. Se din aktivitet och bli en del av gemenskapen.</p>
        <div class="dual-phones">
          <PhoneFrame
            src="/screenshots/2-social.jpg"
            alt="Poliskollen social"
            shadow-intensity="medium"
            :angle="-5"
          />
          <PhoneFrame
            src="/screenshots/3-achievements.jpg"
            alt="Poliskollen prestationer"
            shadow-intensity="medium"
            :angle="5"
          />
        </div>
      </div>
    </section>

    <!-- ============ SECTION 8: SOCIAL PROOF ============ -->
    <section class="cinematic-section" aria-labelledby="proof-heading">
      <div class="container" style="text-align: center;">
        <h2 id="proof-heading">Tusentals svenskar<br />håller redan koll.</h2>

        <div class="stars" style="margin-top: 1.5rem;">
          <span>★</span><span>★</span><span>★</span><span>★</span><span style="opacity: 0.3;">★</span>
        </div>
        <p ref="reviewCountRef" style="margin-top: 0.5rem; font-size: 1.25rem; color: rgba(255,255,255,0.7);">4.3 av 5 — {{ reviewCountDisplay }} recensioner på App Store</p>

        <div ref="socialProofRef" class="review-cards" style="margin-top: 2.5rem;">
          <div v-for="(review, i) in reviews" :key="i" class="review-card">
            <p>"{{ review.text }}"</p>
            <div class="reviewer">— {{ review.author }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ SECTION 9: PRICING ============ -->
    <section class="cinematic-section" aria-labelledby="pricing-heading">
      <div ref="pricingRef" class="container" style="text-align: center;">
        <span class="section-label">Priser</span>
        <h2 id="pricing-heading">Välj din plan.</h2>
        <p class="section-copy" style="margin: 1rem auto 2.5rem;">Börja gratis — uppgradera när du är redo.</p>

        <div class="pricing-grid">
          <!-- Free -->
          <div class="pricing-card">
            <h3>Gratis</h3>
            <div style="margin: 1rem 0;">
              <span class="price-amount">0 kr</span>
              <span class="price-period"> för alltid</span>
            </div>
            <ul class="pricing-features">
              <li v-for="feat in freeFeatures" :key="feat">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12" /></svg>
                {{ feat }}
              </li>
            </ul>
            <a :href="APP_STORE_URL" target="_blank" rel="noopener" class="pricing-cta pricing-cta-secondary">Kom igång gratis</a>
          </div>

          <!-- Pro -->
          <div class="pricing-card pricing-card-pro">
            <div class="pricing-popular">Mest populär</div>
            <h3>Pro</h3>
            <div style="margin: 1rem 0;">
              <span class="price-amount">9 kr</span>
              <span class="price-period">/månad</span>
            </div>
            <ul class="pricing-features">
              <li v-for="feat in proFeatures" :key="feat">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12" /></svg>
                {{ feat }}
              </li>
            </ul>
            <a :href="APP_STORE_URL" target="_blank" rel="noopener" class="pricing-cta pricing-cta-primary">Uppgradera till Pro</a>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ SECTION 10: FINAL CTA + FAQ ============ -->
    <section class="cinematic-section" style="flex-direction: column; gap: 4rem;" aria-labelledby="final-cta-heading">
      <div ref="ctaRef" class="container" style="text-align: center;">
        <h2 id="final-cta-heading">Redo att hålla koll?</h2>
        <p style="margin-top: 1rem; font-size: 1.125rem; color: rgba(255,255,255,0.5);">
          Ladda ner Poliskollen gratis. Tillgänglig på iPhone och Apple Watch.
        </p>
        <img
          :src="appIcon"
          alt="Poliskollen"
          class="final-icon"
          style="width: 72px; height: 72px; border-radius: 18px; margin-top: 2rem;"
          loading="lazy"
        />
        <div style="margin-top: 1.5rem;">
          <a :href="APP_STORE_URL" target="_blank" rel="noopener" class="cta-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            Ladda ner på App Store
          </a>
        </div>
      </div>

      <!-- FAQ -->
      <div class="container">
        <h2 style="text-align: center; margin-bottom: 2rem;">Vanliga frågor</h2>
        <div class="faq-list">
          <div
            v-for="(faq, i) in faqs"
            :key="i"
            class="faq-item"
            :class="{ open: openFaq === i }"
          >
            <button
              class="faq-question"
              @click="toggleFaq(i)"
              :aria-expanded="openFaq === i"
              :aria-controls="'faq-answer-' + i"
            >
              <span :id="'faq-q-' + i">{{ faq.q }}</span>
              <svg class="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div
              class="faq-answer-wrap"
              :id="'faq-answer-' + i"
              role="region"
              :aria-labelledby="'faq-q-' + i"
            >
              <div class="faq-answer">
                <p>{{ faq.a }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
/* Hero section specifics */
.hero-section {
  min-height: 100vh;
  min-height: 100dvh;
  padding-top: 100px;
}

.hero-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

/* Radial glow behind phone */
.hero-section::before {
  content: '';
  position: absolute;
  bottom: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(ellipse, rgba(22, 90, 155, 0.15) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}
</style>
```

- [ ] **Step 2: Verify build**

Run: `cd /Volumes/SSD/Documents/Projects/poliskollen-website && npm run build`
Expected: Build succeeds with no errors

- [ ] **Step 3: Start dev server and visual check**

Run: `cd /Volumes/SSD/Documents/Projects/poliskollen-website && npm run dev`

Open in browser. Scroll through all 10 sections and verify:
1. Hero: app icon, headline, phone mockup with screenshot, stats counter, CTA button
2. Story: three lines fade in as you scroll
3. Map: heatmap screenshot in phone frame, animated dots
4. AI: event detail screenshot, PRO badge, flipped layout
5. Trends: two phones side by side, angled
6. Quiz: quiz screenshot, floating animation, lighter background
7. Community: two phones (social + achievements)
8. Social Proof: stars, review cards
9. Pricing: two cards, Pro highlighted
10. Final CTA + FAQ: download button, accordion FAQ

Also verify:
- Skip link targets `#main-content` correctly
- Navigation works (nav hides/shows, links work)
- Responsive layout on mobile (resize browser)
- Support and Privacy pages still work and look unchanged

- [ ] **Step 4: Commit**

```bash
git add src/pages/Home.vue
git commit -m "feat: complete cinematic Home page rewrite with 10 sections"
```

---

## Task 9: Build verification and polish

**Files:**
- May modify: any of the above files for polish fixes

- [ ] **Step 1: Production build**

Run: `cd /Volumes/SSD/Documents/Projects/poliskollen-website && npm run build`
Expected: Clean build, no warnings

- [ ] **Step 2: Preview production build**

Run: `cd /Volumes/SSD/Documents/Projects/poliskollen-website && npm run preview`
Open in browser and test:
- Full scroll-through of all sections
- Navigation between pages (Home → Support → Privacy → Home)
- Mobile responsive (check at 375px, 768px, 1024px widths)
- FAQ accordion opens/closes
- All App Store links work
- Scroll-to-top button appears
- `prefers-reduced-motion` is respected (test in browser DevTools → Rendering → Emulate CSS media → prefers-reduced-motion: reduce)

- [ ] **Step 3: Fix any issues found**

Address any visual or functional issues discovered during testing. Common things to check:
- Phone frames render correctly at all breakpoints
- Parallax doesn't cause layout shift
- Section reveals trigger at correct scroll positions
- Dark background renders correctly (no flash of white)
- Footer appears correctly after final section

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "polish: cinematic website redesign complete"
```

---

## Summary of all files

| File | Action | Task |
|------|--------|------|
| `src/composables/useAnimatedCounter.js` | Create | 1 |
| `src/composables/useScrollDirection.js` | Create | 2 |
| `src/composables/useSectionReveal.js` | Create | 3 |
| `src/composables/useParallax.js` | Create | 4 |
| `src/components/PhoneFrame.vue` | Create | 5 |
| `src/style.css` | Modify (append) | 6 |
| `src/App.vue` | Modify | 7 |
| `src/pages/Home.vue` | Rewrite | 8 |
