<script setup>
import { ref } from 'vue'
import { useFaqSchema } from '../composables/useFaqSchema.js'
import { useAnimatedCounter } from '../composables/useAnimatedCounter.js'
import { useSectionReveal } from '../composables/useSectionReveal.js'
import { useParallax } from '../composables/useParallax.js'
import { usePlatform } from '../composables/usePlatform.js'
import PhoneFrame from '../components/PhoneFrame.vue'

const appIcon = '/assets/app-icon.png'

// ---- Device detection → tailor the download CTAs + comparison toggle ----
const { isAndroid: primaryStoreIsAndroid, primaryStoreUrl, APP_STORE_URL, PLAY_STORE_URL } = usePlatform()
const selectedPlatform = ref(primaryStoreIsAndroid ? 'android' : 'ios')

// ---- Animated counters ----
const { display: ratingDisplay, elRef: ratingRef } = useAnimatedCounter(4.3, { duration: 2000, decimals: 1, suffix: ' ★' })
const { display: reviewCountDisplay, elRef: reviewCountRef } = useAnimatedCounter(6, { duration: 1500 })

// ---- Section refs for reveal ----
const storyRef1 = ref(null)
const storyRef2 = ref(null)
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
    q: 'Fungerar appen på klockan?',
    a: 'Ja. Det finns en app till både Apple Watch och Wear OS. Se de senaste händelserna direkt på handleden och få notiser.',
  },
  {
    q: 'Varifrån kommer datan?',
    a: 'All data hämtas från Polismyndighetens öppna API och publiceras ursprungligen på polisen.se/aktuellt/handelser/. Varje händelse i Poliskollen länkar direkt till sin originalrapport på polisen.se.',
  },
  {
    q: 'Finns appen på Android?',
    a: 'Ja, Poliskollen finns på Google Play. Du får samma sak som på iPhone: karta, händelselista och notiser. Det finns även en app till Wear OS-klockor.',
  },
  {
    q: 'Hur kontaktar jag support?',
    a: 'Maila support@poliskollen.nu eller använd kontaktformuläret på vår supportsida. Vi svarar vanligtvis inom 24 timmar.',
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

      <!-- Hero background video. Muted + playsinline + autoplay = the combo that
           actually autoplays on iOS/Android. Poster shows instantly and is the
           fallback for prefers-reduced-motion / slow connections. -->
      <div class="hero-video" aria-hidden="true">
        <video
          class="hero-video__media"
          autoplay
          loop
          muted
          playsinline
          preload="auto"
          poster="/hero/hero-poster.jpg"
        >
          <source src="/hero/hero.webm" type="video/webm" />
          <source src="/hero/hero.mp4" type="video/mp4" />
        </video>
        <div class="hero-video__scrim"></div>
      </div>

      <div class="container" style="text-align: center; position: relative; z-index: 1;">
        <img
          :src="appIcon"
          alt="Poliskollen"
          class="hero-enter"
          style="--delay: 1; width: 80px; height: 80px; border-radius: 20px;"
        />

        <h1 class="hero-enter" style="--delay: 2; margin-top: 1.5rem;">
          Håll koll på<br />vad polisen gör.
        </h1>

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

        <a :href="primaryStoreUrl" target="_blank" rel="noopener" class="cta-btn hero-enter" style="--delay: 6; margin-top: 1.5rem;">
          <svg v-if="primaryStoreIsAndroid" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M3.609 1.814 13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92m10.89 10.893 2.302 2.302-10.937 6.333zM21.176 12 17.792 9.939 14.499 13.5 17.79 16.06zm-12.812-7.59 10.937 6.333-2.302 2.302z"/>
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          Ladda ner gratis
        </a>

        <p class="hero-enter" style="--delay: 6; margin-top: 1rem; font-size: 0.8125rem; color: rgba(255,255,255,0.3);">
          Tillgänglig på iPhone, Android, Apple Watch &amp; Wear OS
        </p>
      </div>
    </section>

    <!-- ============ SECTION 1.5: CROSS-PLATFORM ============ -->
    <section class="cinematic-section cross-platform-section" aria-labelledby="platforms-heading">
      <div class="container cross-platform-container">
        <div class="cp-header">
          <span class="cp-eyebrow">Nyhet</span>
          <h2 id="platforms-heading" class="cp-title">Samma upplevelse — iPhone &amp; Android</h2>
          <p class="cp-sub">Pixelperfekt parity. Välj din plattform.</p>
        </div>

        <div
          class="cp-toggle"
          role="tablist"
          aria-label="Välj plattform"
          :data-active="selectedPlatform"
        >
          <button
            type="button"
            role="tab"
            :aria-selected="selectedPlatform === 'ios'"
            class="cp-toggle-btn"
            :class="{ active: selectedPlatform === 'ios' }"
            @click="selectedPlatform = 'ios'"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            iPhone
          </button>
          <button
            type="button"
            role="tab"
            :aria-selected="selectedPlatform === 'android'"
            class="cp-toggle-btn"
            :class="{ active: selectedPlatform === 'android' }"
            @click="selectedPlatform = 'android'"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.523 15.341a.71.71 0 1 1 0-1.42.71.71 0 0 1 0 1.42m-11.046 0a.71.71 0 1 1 0-1.42.71.71 0 0 1 0 1.42m11.4-6.155 1.42-2.461a.296.296 0 0 0-.513-.296L17.34 8.91A8.94 8.94 0 0 0 12 7.6a8.94 8.94 0 0 0-5.34 1.31L5.215 6.43a.296.296 0 0 0-.513.296l1.42 2.461C3.683 10.668 1.94 13.27 1.65 16.4h20.7c-.29-3.131-2.033-5.733-4.473-7.214" />
            </svg>
            Android
          </button>
        </div>

        <div class="cp-phone-stage">
          <Transition name="cp-fade" mode="out-in">
            <PhoneFrame
              v-if="selectedPlatform === 'ios'"
              key="ios"
              src="/screenshots/ios-events.png"
              alt="Poliskollen Händelser på iPhone"
              shadow-intensity="high"
            />
            <PhoneFrame
              v-else
              key="android"
              src="/screenshots/android-events.png"
              alt="Poliskollen Händelser på Android"
              shadow-intensity="high"
            />
          </Transition>
        </div>

        <div class="cp-store-row">
          <a :href="APP_STORE_URL" target="_blank" rel="noopener" class="cp-store-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            App Store
          </a>
          <a :href="PLAY_STORE_URL" target="_blank" rel="noopener" class="cp-store-btn cp-store-btn-android">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M3.609 1.814 13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92m10.89 10.893 2.302 2.302-10.937 6.333zM21.176 12 17.792 9.939 14.499 13.5 17.79 16.06zm-12.812-7.59 10.937 6.333-2.302 2.302z"/>
            </svg>
            Google Play
          </a>
        </div>

        <p class="cp-foot">
          All data hämtas från
          <a href="https://polisen.se/aktuellt/handelser/" target="_blank" rel="noopener">polisen.se</a>.
          Varje händelse länkar tillbaka till sin originalrapport.
        </p>
      </div>
    </section>

    <!-- ============ SECTION 2: STORY ============ -->
    <section class="cinematic-section story-section" aria-label="Varför Poliskollen">
      <div class="container" style="text-align: center; display: flex; flex-direction: column; gap: 1rem; align-items: center;">
        <div ref="storyRef1" class="story-line">Sverige vaknar.</div>
        <div ref="storyRef2" class="story-line">Vad hände i natt?</div>
      </div>
    </section>

    <!-- ============ SECTION 3: MAP ============ -->
    <section class="cinematic-section" aria-labelledby="map-heading">
      <div ref="mapRef" class="feature-layout container">
        <div class="feature-text">
          <span class="section-label">Karta</span>
          <h2 id="map-heading">Se allt. Överallt.</h2>
          <p class="section-copy">Värmekarta och interaktiv karta över hela Sverige. Se var saker händer, så fort de händer.</p>
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
            <a :href="primaryStoreUrl" target="_blank" rel="noopener" class="pricing-cta pricing-cta-secondary">Kom igång gratis</a>
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
            <a :href="primaryStoreUrl" target="_blank" rel="noopener" class="pricing-cta pricing-cta-primary">Uppgradera till Pro</a>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ SECTION 10: FINAL CTA + FAQ ============ -->
    <section class="cinematic-section" style="flex-direction: column; gap: 4rem;" aria-labelledby="final-cta-heading">
      <div ref="ctaRef" class="container" style="text-align: center;">
        <h2 id="final-cta-heading">Redo att hålla koll?</h2>
        <p style="margin-top: 1rem; font-size: 1.125rem; color: rgba(255,255,255,0.5);">
          Ladda ner Poliskollen gratis. Finns på iPhone, Android, Apple Watch och Wear OS.
        </p>
        <img
          :src="appIcon"
          alt="Poliskollen"
          class="final-icon"
          style="width: 72px; height: 72px; border-radius: 18px; margin-top: 2rem;"
          loading="lazy"
        />
        <div style="margin-top: 1.5rem; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <a :href="APP_STORE_URL" target="_blank" rel="noopener" class="cta-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            App Store
          </a>
          <a :href="PLAY_STORE_URL" target="_blank" rel="noopener" class="cta-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M3.609 1.814 13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92m10.89 10.893 2.302 2.302-10.937 6.333zM21.176 12 17.792 9.939 14.499 13.5 17.79 16.06zm-12.812-7.59 10.937 6.333-2.302 2.302z"/>
            </svg>
            Google Play
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
/* ============ CROSS-PLATFORM SECTION ============ */
.cross-platform-section {
  position: relative;
  padding: 88px 0;
  overflow: hidden;
}

.cross-platform-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 800px 400px at 30% 40%, rgba(22, 90, 155, 0.10) 0%, transparent 60%),
    radial-gradient(ellipse 600px 300px at 70% 70%, rgba(61, 199, 130, 0.08) 0%, transparent 60%);
  pointer-events: none;
}

.cross-platform-container {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  padding-left: 16px;
  padding-right: 16px;
}

.cp-header {
  text-align: center;
  max-width: 620px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.cp-eyebrow {
  display: inline-block;
  padding: 5px 14px;
  background: linear-gradient(90deg, rgba(255, 159, 64, 0.18), rgba(255, 92, 0, 0.18));
  border: 1px solid rgba(255, 159, 64, 0.35);
  border-radius: 999px;
  color: #FFB876;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.cp-title {
  font-size: clamp(1.625rem, 4.5vw, 2.5rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.15;
  background: linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.65) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.cp-sub {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.6;
  max-width: 480px;
}

/* --- Toggle (segmented control) --- */
.cp-toggle {
  position: relative;
  display: inline-flex;
  padding: 4px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: 999px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  isolation: isolate;
}

.cp-toggle::before {
  content: '';
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 4px;
  width: calc(50% - 4px);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.05));
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
  transition: transform 0.32s cubic-bezier(0.34, 1.4, 0.64, 1);
  z-index: 0;
}

.cp-toggle[data-active="android"]::before {
  transform: translateX(100%);
  background: linear-gradient(180deg, rgba(61, 199, 130, 0.22), rgba(61, 199, 130, 0.08));
  border-color: rgba(61, 199, 130, 0.35);
  box-shadow: 0 4px 14px rgba(61, 199, 130, 0.18);
}

.cp-toggle-btn {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  min-width: 128px;
  justify-content: center;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s ease;
}

.cp-toggle-btn svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.cp-toggle-btn.active {
  color: rgba(255, 255, 255, 0.98);
}

.cp-toggle-btn:hover:not(.active) {
  color: rgba(255, 255, 255, 0.85);
}

/* --- Phone stage --- */
.cp-phone-stage {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 540px;
  width: 100%;
}

.cp-fade-enter-active,
.cp-fade-leave-active {
  transition: opacity 0.28s ease, transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
}

.cp-fade-enter-from {
  opacity: 0;
  transform: translateY(8px) scale(0.985);
}

.cp-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.985);
}

/* --- Store buttons --- */
.cp-store-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.cp-store-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 22px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 14px;
  color: rgba(255, 255, 255, 0.95);
  font-size: 0.9375rem;
  font-weight: 600;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), background 0.25s ease, border-color 0.25s ease;
}

.cp-store-btn:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.10);
  border-color: rgba(255, 255, 255, 0.22);
  color: rgba(255, 255, 255, 1);
}

.cp-store-btn-android:hover {
  background: rgba(61, 199, 130, 0.12);
  border-color: rgba(61, 199, 130, 0.35);
}

.cp-foot {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.45);
  text-align: center;
  max-width: 520px;
  line-height: 1.6;
}

.cp-foot a {
  color: rgba(255, 255, 255, 0.75);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.cp-foot a:hover {
  color: rgba(255, 255, 255, 0.95);
}

@media (max-width: 768px) {
  .cross-platform-section {
    padding: 56px 0;
  }

  .cross-platform-container {
    gap: 24px;
  }

  .cp-phone-stage {
    min-height: 420px;
  }

  .cp-toggle-btn {
    min-width: 110px;
    padding: 9px 18px;
  }

  .cp-store-btn {
    flex: 1;
    min-width: 140px;
    justify-content: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cp-toggle::before,
  .cp-fade-enter-active,
  .cp-fade-leave-active {
    transition: none;
  }
}

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

/* ============ HERO BACKGROUND VIDEO ============ */
.hero-video {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  /* Poster doubles as the still backdrop before the video paints, on load
     failure, and under prefers-reduced-motion. */
  background: #0a0a0f url('/hero/hero-poster.jpg') center / cover no-repeat;
}

.hero-video__media {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Dark scrim: keeps the white hero text legible and melts into the page
   background (#0a0a0f) at the bottom so the section transition stays seamless. */
.hero-video__scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(10, 10, 15, 0.80) 0%,
    rgba(10, 10, 15, 0.58) 35%,
    rgba(10, 10, 15, 0.68) 72%,
    rgba(10, 10, 15, 0.96) 100%
  );
}

/* Respect reduced-motion (and, in practice, data-saver users): drop the moving
   video and leave the static poster + scrim. */
@media (prefers-reduced-motion: reduce) {
  .hero-video__media {
    display: none;
  }
}

/* Story section: tighter than the default full-screen cinematic-section so the
   short lines don't float in a sea of empty space. */
.story-section {
  padding-top: var(--space-2xl);
  padding-bottom: var(--space-2xl);
}
</style>
