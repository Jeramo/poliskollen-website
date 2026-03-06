<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
const appIcon = '/assets/app-icon.png'
const titleText = '/assets/title-text.png'

// ---- Scroll reveal ----
let observer = null

const setupScrollReveal = () => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  )
  document.querySelectorAll('.scroll-reveal').forEach((el) => {
    observer.observe(el)
  })
}

// ---- Animated counters ----
const ratingCount = ref(0)
const reviewCount = ref(0)
const statsRef = ref(null)
let statsStarted = false

const animateValue = (refVal, target, duration = 1500, decimals = 0) => {
  const start = performance.now()
  const step = (now) => {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(2, -10 * progress)
    refVal.value = decimals
      ? parseFloat((target * eased).toFixed(decimals))
      : Math.round(target * eased)
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

const startCounters = () => {
  if (statsStarted) return
  statsStarted = true
  animateValue(ratingCount, 4.3, 2000, 1)
  animateValue(reviewCount, 6, 1500)
}

// ---- FAQ accordion ----
const openFaq = ref(null)
const toggleFaq = (i) => {
  openFaq.value = openFaq.value === i ? null : i
}

// ---- Data ----
const features = [
  {
    icon: 'map',
    title: 'Interaktiv karta',
    desc: 'Se polishändelser i realtid plottade på en karta. Zooma in på ditt område eller utforska hela Sverige.',
  },
  {
    icon: 'bell',
    title: 'Push-notiser',
    desc: 'Bli notifierad direkt när något händer i ditt område. Anpassa vilka händelsetyper du vill följa.',
  },
  {
    icon: 'watch',
    title: 'Apple Watch',
    desc: 'Snabb överblick direkt på handleden. Se senaste händelserna utan att ta upp telefonen.',
  },
  {
    icon: 'grid',
    title: 'Widgets',
    desc: 'Lägg till widgets på hemskärmen för senaste händelserna i din kommun — alltid uppdaterat.',
  },
  {
    icon: 'sparkle',
    title: 'AI-assistent',
    desc: 'Ställ frågor om händelser och få smarta sammanfattningar. Drivs av avancerad AI. Ingår i Pro.',
  },
  {
    icon: 'quiz',
    title: 'Quiz',
    desc: 'Testa dina kunskaper om polishändelser i Sverige med dagliga quiz-utmaningar.',
  },
]

const faqs = [
  {
    q: 'Är Poliskollen gratis?',
    a: 'Ja! Grundversionen är helt gratis med alla kärnfunktioner — karta, push-notiser, Apple Watch och widgets. Pro lägger till AI-assistenten och mer.',
  },
  {
    q: 'Vad ingår i Poliskollen Pro?',
    a: 'Pro kostar 29 kr/månad och ger dig AI-assistenten som sammanfattar händelser, quiz-läge, avancerad statistik och prioriterade notiser.',
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

onMounted(async () => {
  await nextTick()
  setupScrollReveal()
  // Start counters after hero animation settles
  setTimeout(startCounters, 1200)
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<template>
  <div id="main-content" class="home">
    <!-- ============ HERO ============ -->
    <section class="hero" aria-label="Introduktion">
      <div class="hero-bg">
        <div class="hero-orb hero-orb-1"></div>
        <div class="hero-orb hero-orb-2"></div>
        <div class="hero-orb hero-orb-3"></div>
      </div>

      <div class="hero-content">
        <img
          :src="appIcon"
          alt="Poliskollen"
          class="hero-icon anim-hero"
          style="--i: 1; margin-top: 2rem"
        />

        <img
          :src="titleText"
          alt="Poliskollen"
          class="hero-title-image anim-hero"
          style="--i: 2"
        />

        <p class="hero-tagline anim-hero" style="--i: 3">
          Hela Sveriges polishändelser.<br />I din ficka. I realtid.
        </p>

        <div class="hero-stats anim-hero" ref="statsRef" style="--i: 4">
          <div class="stat">
            <span class="stat-value">{{ ratingCount }} ★</span>
            <span class="stat-label">Betyg</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-value">{{ reviewCount }}</span>
            <span class="stat-label">Recensioner</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-value">Gratis</span>
            <span class="stat-label">Att använda</span>
          </div>
        </div>

        <a
          href="https://apps.apple.com/app/id6757537288"
          target="_blank"
          rel="noopener"
          class="hero-cta anim-hero"
          style="--i: 5"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          Ladda ner på App Store
        </a>

        <p class="hero-meta anim-hero" style="--i: 6">
          Kräver iOS 17.0 · iPhone & Apple Watch
        </p>
      </div>
    </section>

    <!-- ============ FEATURES ============ -->
    <section class="features-section" aria-labelledby="features-heading">
      <div class="section-container">
        <div class="section-header scroll-reveal">
          <span class="section-badge">Funktioner</span>
          <h2 id="features-heading">Allt du behöver.<br />Inget du inte behöver.</h2>
          <p>Sex funktioner designade för att hålla dig informerad.</p>
        </div>

        <div class="features-grid">
          <div
            v-for="(f, i) in features"
            :key="f.title"
            class="feature-card scroll-reveal"
            :style="{ '--i': i }"
          >
            <div class="feature-icon-wrap">
              <!-- Map -->
              <svg v-if="f.icon === 'map'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <!-- Bell -->
              <svg v-if="f.icon === 'bell'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <!-- Watch -->
              <svg v-if="f.icon === 'watch'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="7" />
                <polyline points="12 9 12 12 13.5 13.5" />
                <path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83" />
              </svg>
              <!-- Grid / Widgets -->
              <svg v-if="f.icon === 'grid'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              <!-- Sparkle / AI -->
              <svg v-if="f.icon === 'sparkle'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
              </svg>
              <!-- Quiz -->
              <svg v-if="f.icon === 'quiz'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h3>{{ f.title }}</h3>
            <p>{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ PRICING ============ -->
    <section class="pricing-section">
      <div class="section-container">
        <div class="section-header scroll-reveal">
          <span class="section-badge">Priser</span>
          <h2>Enkel prissättning.</h2>
          <p>Börja gratis. Uppgradera när du vill.</p>
        </div>

        <div class="pricing-grid">
          <!-- Free -->
          <div class="pricing-card scroll-reveal" style="--i: 0">
            <div class="pricing-header">
              <h3>Gratis</h3>
              <div class="pricing-price">
                <span class="price-amount">0 kr</span>
                <span class="price-period">för alltid</span>
              </div>
            </div>
            <ul class="pricing-features">
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12" /></svg>
                Interaktiv karta
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12" /></svg>
                Push-notiser
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12" /></svg>
                Apple Watch-app
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12" /></svg>
                Hemskärmswidgets
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12" /></svg>
                Grundläggande statistik
              </li>
            </ul>
            <a
              href="https://apps.apple.com/app/id6757537288"
              target="_blank"
              rel="noopener"
              class="pricing-cta pricing-cta-secondary"
            >
              Kom igång gratis
            </a>
          </div>

          <!-- Pro -->
          <div class="pricing-card pricing-card-pro scroll-reveal" style="--i: 1">
            <div class="pricing-popular">Populärast</div>
            <div class="pricing-header">
              <h3>Pro</h3>
              <div class="pricing-price">
                <span class="price-amount">29 kr</span>
                <span class="price-period">/månad</span>
              </div>
            </div>
            <ul class="pricing-features">
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12" /></svg>
                Allt i Gratis
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12" /></svg>
                AI-assistent
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12" /></svg>
                Quiz-utmaningar
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12" /></svg>
                Avancerad statistik
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12" /></svg>
                Prioriterade notiser
              </li>
            </ul>
            <a
              href="https://apps.apple.com/app/id6757537288"
              target="_blank"
              rel="noopener"
              class="pricing-cta pricing-cta-primary"
            >
              Prova Pro
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ FAQ ============ -->
    <section class="faq-section">
      <div class="section-container">
        <div class="section-header scroll-reveal">
          <span class="section-badge">Vanliga frågor</span>
          <h2>Har du frågor?</h2>
        </div>

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

    <!-- ============ CTA ============ -->
    <section class="cta-section scroll-reveal">
      <div class="cta-bg">
        <div class="cta-orb cta-orb-1"></div>
        <div class="cta-orb cta-orb-2"></div>
      </div>
      <div class="cta-content">
        <img :src="appIcon" alt="Poliskollen" class="cta-icon" loading="lazy" />
        <h2>Redo att börja?</h2>
        <p>Ladda ner Poliskollen gratis och se vad som händer runt dig.</p>
        <a
          href="https://apps.apple.com/app/id6757537288"
          target="_blank"
          rel="noopener"
          class="cta-button"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          Ladda ner på App Store
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ============================================
   HERO SECTION
   ============================================ */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 120px var(--space-lg) 80px;
}

.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: var(--gradient-hero);
}

.hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  will-change: transform;
}

.hero-orb-1 {
  width: 500px;
  height: 500px;
  background: rgba(22, 90, 155, 0.2);
  top: -10%;
  right: -10%;
  animation: orbDrift1 25s ease-in-out infinite;
}

.hero-orb-2 {
  width: 400px;
  height: 400px;
  background: rgba(61, 122, 184, 0.15);
  bottom: -5%;
  left: -10%;
  animation: orbDrift2 30s ease-in-out infinite;
}

.hero-orb-3 {
  width: 300px;
  height: 300px;
  background: rgba(22, 90, 155, 0.12);
  top: 40%;
  left: 50%;
  animation: orbDrift3 20s ease-in-out infinite;
}

@keyframes orbDrift1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-40px, 30px) scale(1.05); }
  66% { transform: translate(20px, -20px) scale(0.95); }
}

@keyframes orbDrift2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -25px) scale(1.08); }
  66% { transform: translate(-20px, 15px) scale(0.92); }
}

@keyframes orbDrift3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-30px, 20px) scale(1.1); }
}

.hero-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 640px;
  width: 100%;
}

/* Hero entrance animation */
.anim-hero {
  opacity: 0;
  transform: translateY(30px);
  animation: heroEnter 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: calc(var(--i) * 0.12s + 0.1s);
}

@keyframes heroEnter {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Hero badge */
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  background: rgba(22, 90, 155, 0.08);
  border: 1px solid rgba(22, 90, 155, 0.15);
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--poliskollen-accent);
  margin-bottom: var(--space-xl);
}

.badge-pulse {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
  50% { opacity: 0.8; box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); }
}

/* Hero icon */
.hero-icon {
  width: 100px;
  height: 100px;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(22, 90, 155, 0.25);
  margin-bottom: var(--space-xl);
  animation: heroEnter 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards,
             iconFloat 6s ease-in-out 1.5s infinite;
  animation-delay: calc(var(--i) * 0.12s + 0.1s);
}

@keyframes iconFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.hero-title-image {
  max-width: 340px;
  width: 80%;
  height: auto;
  margin-bottom: var(--space-md);
}

.hero-tagline {
  font-size: clamp(1.05rem, 2.5vw, 1.25rem);
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--space-2xl);
}

/* Hero stats */
.hero-stats {
  display: inline-flex;
  align-items: center;
  gap: var(--space-lg);
  padding: 16px 28px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  margin-bottom: var(--space-2xl);
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: var(--border-color);
}

/* Hero CTA */
.hero-cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 32px;
  background: var(--poliskollen-accent);
  color: white;
  font-weight: 600;
  font-size: 1.0625rem;
  border-radius: var(--radius-xl);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 20px rgba(22, 90, 155, 0.3);
}

.hero-cta {
  animation: heroEnter 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards,
             ctaGlow 3s ease-in-out 2s infinite;
  animation-delay: calc(var(--i) * 0.12s + 0.1s);
}

@keyframes ctaGlow {
  0%, 100% { box-shadow: 0 4px 20px rgba(22, 90, 155, 0.3); }
  50% { box-shadow: 0 4px 30px rgba(22, 90, 155, 0.55), 0 0 40px rgba(22, 90, 155, 0.15); }
}

.hero-cta:hover {
  animation: none;
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(22, 90, 155, 0.4);
  background: var(--poliskollen-accent-dark);
  color: white;
}

.hero-cta:active {
  transform: scale(0.97);
}

.hero-meta {
  margin-top: var(--space-lg);
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

/* ============================================
   SCROLL REVEAL SYSTEM
   ============================================ */
.scroll-reveal {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: calc(var(--i, 0) * 0.08s);
}

.scroll-reveal.in-view {
  opacity: 1;
  transform: translateY(0);
}

/* ============================================
   SECTION SHARED STYLES
   ============================================ */
.section-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 var(--space-lg);
}

.section-header {
  text-align: center;
  margin-bottom: 56px;
}

.section-badge {
  display: inline-block;
  padding: 6px 16px;
  background: rgba(22, 90, 155, 0.08);
  color: var(--poliskollen-accent);
  border-radius: var(--radius-full);
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: var(--space-lg);
}

.section-header h2 {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  margin-bottom: var(--space-md);
  line-height: 1.15;
}

.section-header p {
  font-size: 1.0625rem;
  color: var(--text-secondary);
  max-width: 480px;
  margin: 0 auto;
  line-height: 1.6;
}

/* ============================================
   FEATURES GRID
   ============================================ */
.features-section {
  padding: 100px 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.feature-card {
  position: relative;
  padding: 32px 28px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              border-color 0.3s ease;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #165A9B, #3D7AB8);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.feature-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  border-color: rgba(22, 90, 155, 0.25);
}

[data-theme="dark"] .feature-card:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25), 
              0 0 0 1px rgba(22, 90, 155, 0.15);
}

.feature-icon-wrap {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(22, 90, 155, 0.08);
  border-radius: var(--radius-lg);
  margin-bottom: 20px;
  transition: background 0.3s ease, transform 0.3s ease;
}

.feature-card:hover .feature-icon-wrap {
  background: rgba(22, 90, 155, 0.14);
  transform: scale(1.08) rotate(-6deg);
}

.feature-icon-wrap svg {
  width: 24px;
  height: 24px;
  color: var(--poliskollen-accent);
  stroke-linecap: round;
  stroke-linejoin: round;
}

.feature-card h3 {
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.feature-card p {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* ============================================
   PRICING SECTION
   ============================================ */
.pricing-section {
  padding: 100px 0;
  background: var(--bg-secondary);
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
  max-width: 780px;
  margin: 0 auto;
}

.pricing-card {
  position: relative;
  padding: 36px 32px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-2xl);
  display: flex;
  flex-direction: column;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.pricing-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08);
}

.pricing-card-pro {
  border-color: var(--poliskollen-accent);
  border-width: 2px;
  box-shadow: 0 8px 30px rgba(22, 90, 155, 0.12);
  animation: proGlow 4s ease-in-out infinite;
}

@keyframes proGlow {
  0%, 100% { box-shadow: 0 8px 30px rgba(22, 90, 155, 0.12); }
  50% { box-shadow: 0 8px 40px rgba(22, 90, 155, 0.22), 0 0 20px rgba(22, 90, 155, 0.06); }
}

.pricing-card-pro:hover {
  animation: none;
  box-shadow: 0 20px 50px rgba(22, 90, 155, 0.22);
}

.pricing-popular {
  position: absolute;
  top: -13px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 16px;
  background: var(--poliskollen-accent);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-radius: var(--radius-full);
}

.pricing-header {
  margin-bottom: 28px;
}

.pricing-header h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.pricing-price {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.price-amount {
  font-size: 2.25rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.price-period {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.pricing-features {
  list-style: none;
  padding: 0;
  margin: 0 0 32px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
}

.pricing-features li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9375rem;
  color: var(--text-secondary);
}

.pricing-features svg {
  width: 18px;
  height: 18px;
  color: #22c55e;
  flex-shrink: 0;
}

.pricing-cta {
  display: block;
  text-align: center;
  padding: 14px 24px;
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: 0.9375rem;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.pricing-cta-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.pricing-cta-secondary:hover {
  background: var(--border-color);
  color: var(--text-primary);
}

.pricing-cta-primary {
  background: var(--poliskollen-accent);
  color: white;
  box-shadow: 0 4px 16px rgba(22, 90, 155, 0.25);
}

.pricing-cta-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(22, 90, 155, 0.35);
  color: white;
}

.pricing-cta-primary:active {
  transform: scale(0.97);
  box-shadow: 0 2px 10px rgba(22, 90, 155, 0.25);
}

.pricing-cta-secondary:active {
  transform: scale(0.97);
}

/* ============================================
   FAQ SECTION
   ============================================ */
.faq-section {
  padding: 100px 0;
}

.faq-list {
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.faq-item {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease;
}

.faq-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  border-color: rgba(22, 90, 155, 0.12);
}

.faq-item.open {
  border-color: rgba(22, 90, 155, 0.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}

.faq-question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 20px 24px;
  background: none;
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  transition: color 0.2s ease;
}

.faq-question:hover {
  color: var(--poliskollen-accent);
}

.faq-chevron {
  width: 20px;
  height: 20px;
  color: var(--text-secondary);
  flex-shrink: 0;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.faq-item.open .faq-chevron {
  transform: rotate(180deg);
}

.faq-answer-wrap {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.faq-item.open .faq-answer-wrap {
  max-height: 300px;
}

.faq-answer {
  padding: 0 24px 20px;
}

.faq-answer p {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  line-height: 1.65;
  margin: 0;
}

/* ============================================
   CTA SECTION
   ============================================ */
.cta-section {
  position: relative;
  padding: 100px var(--space-lg);
  text-align: center;
  overflow: hidden;
  background: var(--poliskollen-accent);
}

.cta-bg {
  position: absolute;
  inset: 0;
}

.cta-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
}

.cta-orb-1 {
  width: 400px;
  height: 400px;
  background: rgba(255, 255, 255, 0.08);
  top: -20%;
  right: -5%;
  animation: orbDrift1 20s ease-in-out infinite;
}

.cta-orb-2 {
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.06);
  bottom: -15%;
  left: -5%;
  animation: orbDrift2 25s ease-in-out infinite;
}

.cta-content {
  position: relative;
  z-index: 1;
}

.cta-icon {
  width: 72px;
  height: 72px;
  border-radius: 18px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  margin-bottom: var(--space-xl);
}

.cta-section h2 {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  color: white;
  margin-bottom: var(--space-md);
  letter-spacing: -0.02em;
}

.cta-section p {
  font-size: 1.0625rem;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: var(--space-2xl);
  max-width: 420px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 32px;
  background: white;
  color: var(--poliskollen-accent);
  font-weight: 700;
  font-size: 1.0625rem;
  border-radius: var(--radius-xl);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  color: var(--poliskollen-accent-dark);
}

.cta-button:active {
  transform: scale(0.97);
}

/* ============================================
   FOCUS-VISIBLE (keyboard accessibility)
   ============================================ */
.hero-cta:focus-visible,
.pricing-cta:focus-visible {
  outline: 2px solid var(--poliskollen-accent);
  outline-offset: 3px;
}

.cta-button:focus-visible {
  outline: 2px solid white;
  outline-offset: 3px;
}

.faq-question:focus-visible {
  outline: 2px solid var(--poliskollen-accent);
  outline-offset: -3px;
  border-radius: var(--radius-lg);
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 768px) {
  .hero {
    padding: 100px var(--space-md) 60px;
    min-height: auto;
  }

  .hero-icon {
    width: 80px;
    height: 80px;
    border-radius: 20px;
  }

  .hero-stats {
    gap: var(--space-md);
    padding: 14px 20px;
  }

  .stat-value {
    font-size: 1.0625rem;
  }

  .hero-cta {
    padding: 14px 28px;
    font-size: 1rem;
  }

  .features-section,
  .pricing-section,
  .faq-section {
    padding: 72px 0;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .pricing-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .section-header {
    margin-bottom: 40px;
  }

  .cta-section {
    padding: 72px var(--space-md);
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* ============================================
   DARK MODE TWEAKS
   ============================================ */
[data-theme="dark"] .feature-card {
  background: var(--bg-secondary);
}

[data-theme="dark"] .feature-card:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

[data-theme="dark"] .feature-icon-wrap {
  background: rgba(61, 122, 184, 0.12);
}

[data-theme="dark"] .feature-card:hover .feature-icon-wrap {
  background: rgba(61, 122, 184, 0.22);
}

[data-theme="dark"] .pricing-card {
  background: var(--bg-secondary);
}

[data-theme="dark"] .pricing-card:hover {
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3);
}

[data-theme="dark"] .pricing-card-pro {
  box-shadow: 0 8px 30px rgba(61, 122, 184, 0.15);
}

[data-theme="dark"] .pricing-card-pro:hover {
  box-shadow: 0 20px 50px rgba(61, 122, 184, 0.2);
}

[data-theme="dark"] .pricing-cta-secondary {
  background: var(--bg-dark-secondary);
  border-color: var(--border-color);
}

[data-theme="dark"] .faq-item {
  background: var(--bg-secondary);
}

[data-theme="dark"] .hero-orb-1 {
  background: rgba(61, 122, 184, 0.15);
}

[data-theme="dark"] .hero-orb-2 {
  background: rgba(90, 155, 212, 0.1);
}

[data-theme="dark"] .hero-orb-3 {
  background: rgba(61, 122, 184, 0.08);
}

[data-theme="dark"] .hero-icon {
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

[data-theme="dark"] .hero-badge {
  background: rgba(61, 122, 184, 0.12);
  border-color: rgba(61, 122, 184, 0.2);
}

[data-theme="dark"] .hero-cta {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

[data-theme="dark"] .cta-button {
  background: white;
  color: #165A9B;
}

/* Dark mode fallback for system preference */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) .feature-card {
    background: var(--bg-secondary);
  }
  :root:not([data-theme="light"]) .feature-card:hover {
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }
  :root:not([data-theme="light"]) .pricing-card {
    background: var(--bg-secondary);
  }
  :root:not([data-theme="light"]) .faq-item {
    background: var(--bg-secondary);
  }
  :root:not([data-theme="light"]) .hero-icon {
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  }
}

/* ============================================
   REDUCED MOTION
   ============================================ */
@media (prefers-reduced-motion: reduce) {
  .anim-hero {
    animation: none;
    opacity: 1;
    transform: none;
  }

  .scroll-reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }

  .hero-orb,
  .cta-orb {
    animation: none;
  }

  .hero-icon {
    animation: none;
    opacity: 1;
    transform: none;
  }

  .badge-pulse {
    animation: none;
  }

  .feature-card,
  .pricing-card,
  .pricing-card-pro,
  .faq-item,
  .hero-cta,
  .cta-button {
    transition: none;
    animation: none !important;
  }

  .feature-card::before {
    transition: none;
  }
}
</style>
