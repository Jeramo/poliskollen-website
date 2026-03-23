<script setup>
import { ref } from 'vue'
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
          <h2 id="ai-heading">Hela bilden. Sammanfattad.</h2>
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
