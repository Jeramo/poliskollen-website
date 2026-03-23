# Poliskollen — Cinematic Website Redesign

**Date:** 2026-03-23
**Status:** Approved
**Goal:** Transform the Poliskollen marketing website into a cinematic, Apple-style storytelling experience that drives app downloads, builds brand prestige, and creates a shareable/viral impression.

## Context

Poliskollen is a Swedish iOS app that displays real-time police incidents across Sweden. The current website (Vue 3 + Vite, pure CSS) is functional with solid SEO but lacks the visual impact needed to maximize conversions and brand perception. The redesign keeps the existing tech stack and assets (8 app screenshots, app icon, current copy) while completely reimagining the presentation.

**Target audience:** Broad Swedish public — young adults, safety-conscious families, news/true-crime enthusiasts.
**Language:** Swedish primary, architecture supports English later.
**Pages affected:** Home (complete redesign), Support & Privacy (theme alignment).

## Design Language

### Color
- **Background:** `#0a0a0f` (near-black, not pure black — cinematic depth)
- **Accent:** `#165A9B` (brand blue), used sparingly for maximum impact
- **Text primary:** `#FFFFFF` at varying opacity levels (1.0, 0.7, 0.4)
- **Dark mode is default.** Light mode preserved via toggle

### Typography
- **Font:** Geist (kept, loaded from CDN)
- **Hero headlines:** 4–6rem, weight 800
- **Section titles:** 3rem+, weight 700
- **Body:** 1rem–1.125rem, weight 400, line-height 1.6
- **Uppercase labels:** 0.75rem, letter-spacing 3px, accent color

### Spacing & Layout
- Each section: 100vh minimum height, content vertically centered
- Max content width: 1200px, centered
- Consistent use of existing CSS custom properties (--space-xs through --space-3xl)

### Animation
- **Engine:** Intersection Observer (already in use), extended with CSS keyframes
- **No scroll-jacking** — native smooth scroll preserved
- **Reveal patterns:** fade-up (translateY + opacity), scale-in, parallax (different scroll speeds)
- **Timing:** cubic-bezier(0.16, 1, 0.3, 1) — existing easing kept
- **Reduced motion:** All animations respect `prefers-reduced-motion: reduce`

### Navigation
- Glassmorphic fixed nav (existing, refined)
- Hide on scroll-down, reveal on scroll-up (new behavior)
- Logo + Home / Support / Integritet + theme toggle
- Scroll progress bar at top (existing, kept)

## Page Structure: Home (10 Sections)

### Section 1: Hero

**Purpose:** Immediate brand impact and primary conversion.

- Full viewport, dark background with radial blue glow (`radial-gradient` from center-bottom)
- Floating animated orbs in background (existing, elevated — larger, slower, more subtle)
- **Entrance sequence:** App icon fades in → headline fades in → subtitle → phone → stats → CTA (staggered, ~200ms delays)
- **Headline:** "Hela Sveriges polishändelser." (4–6rem, weight 800, white)
- **Subtitle:** "I din ficka. I realtid." (muted white, opacity 0.5)
- **Phone mockup:** Centered, floating with box-shadow glow (`0 20px 60px rgba(22,90,155,0.3)`). Uses actual app screenshot inside a CSS phone frame. Subtle parallax — moves at 0.8x scroll speed
- **Animated counters:** "4.3★ Betyg" · "10K+ Händelser/dag" (requestAnimationFrame with easing, existing logic reused)
- **CTA:** "Ladda ner gratis" button → App Store link. Blue background, white text, hover lift

### Section 2: Story (Emotional Hook)

**Purpose:** Create narrative tension. Answer "why should I care?"

- Dark section, text-only, centered
- Text fades in line by line on scroll:
  - **"Sverige vaknar."** (large, bold, white)
  - **"Vad hände i natt?"** (large, bold, white)
  - *"Poliskollen ger dig svaret — direkt."* (smaller, muted, accent color hint)
- No images. No UI. Pure typography and pacing
- Subtle background gradient shift (dark to slightly lighter dark) as user scrolls through

### Section 3: Map Feature

**Purpose:** Showcase the core feature — the interactive map.

- **Headline:** "Se allt. Överallt." (fade-up reveal)
- Phone screenshot (map view) floating with depth shadow, enters from below
- Animated CSS dots appearing around the phone (simulating incident pins popping up — `@keyframes` with staggered delays, small colored circles that fade in and pulse)
- **Copy:** "Interaktiv karta med alla polishändelser i hela Sverige. Zooma in på ditt område."
- Layout: headline + copy left/above, phone right/center (responsive: stacks on mobile)

### Section 4: Notifications

**Purpose:** Show the push notification customization feature.

- **Headline:** "Missa aldrig en händelse."
- Phone screenshot (notification settings view), positioned slightly off-center right
- Mock iOS notification slides in from top of phone frame (CSS animation: `translateY(-100%) → translateY(0)` with bounce easing)
- **Copy:** "Anpassa notiser efter typ och plats. Få en push direkt när något händer nära dig."
- Layout mirrors section 3 but flipped (phone left, text right) for visual rhythm

### Section 5: Apple Watch

**Purpose:** Showcase multi-device ecosystem, differentiate from competitors.

- **Headline:** "På din handled."
- Watch screenshot in a CSS watch-frame mockup (rounded square, dark band suggestions) OR phone screenshot showing Watch integration
- Smaller, more intimate feel — content doesn't need full 100vh, can be 80vh
- **Copy:** "Snabb överblick direkt från handleden. Perfekt när du är på språng."
- Centered layout, watch/phone mockup with subtle float animation

### Section 6: Widgets

**Purpose:** Show convenience of glanceable information.

- **Headline:** "Direkt på hemskärmen."
- Phone screenshot showing home screen widgets
- Subtle "lift" animation on phone (translateY shift on scroll, simulating being picked up)
- **Copy:** "Senaste händelserna i din kommun — utan att öppna appen."
- Centered layout

### Section 7: AI Assistant

**Purpose:** Highlight the premium Pro feature, bridge to pricing.

- **Background:** Subtle gradient shift — introduces a blue-to-dark accent gradient to signal premium
- **Headline:** "AI som sammanfattar åt dig."
- "PRO" badge near headline (small pill, accent background, white text)
- Phone screenshot of AI feature
- **Copy:** "Låt AI:n ge dig en snabb sammanfattning av vad som hänt. Bara i Pro."
- This section's elevated visual treatment creates desire for Pro tier before pricing

### Section 8: Social Proof

**Purpose:** Build trust and credibility right before the pricing ask.

- **Headline:** "Tusentals svenskar håller redan koll."
- Large animated counter (incidents reported or similar aggregate stat)
- App Store rating displayed large: ★★★★☆ 4.3 with star visualization
- 2–3 short review excerpts in card format (pull from App Store reviews, paraphrased if needed)
- Cards enter with staggered fade-up animation
- Centered grid layout (1–3 columns responsive)

### Section 9: Pricing

**Purpose:** Convert interest into action. Make Pro irresistible at 9 kr/month.

- **Headline:** "Välj din plan."
- Two cards side by side (stack on mobile):
  - **Gratis:** Clean list of free features, "Kom igång" CTA
  - **Pro (9 kr/mån):** Elevated card (slight scale, blue accent border, subtle glow shadow), "Mest populär" badge, all features listed with checkmarks, "Uppgradera till Pro" CTA
- Pro card is visually dominant — larger, glowing, positioned slightly forward
- Feature lists use checkmark icons (✓) with clear hierarchy

### Section 10: Final CTA

**Purpose:** Last chance conversion. No distractions.

- Full dark section, minimal content
- **Headline:** "Redo att hålla koll?" (large, bold, centered)
- **Subtitle:** "Ladda ner Poliskollen gratis. Tillgänglig på iPhone och Apple Watch."
- Large App Store download button, centered
- App icon with gentle pulse glow animation
- Footer fades in below with existing footer content (links, branding)

## Support & Privacy Pages

- Apply the new dark-first theme, typography, and spacing
- Keep existing content structure (contact form, FAQ sidebar, privacy policy loader)
- Add consistent section reveal animations
- Not full-viewport cinematic — these are utility pages, content-focused

## Technical Approach

### What Changes
- **Home.vue:** Complete rewrite — 10 cinematic sections replacing current layout
- **App.vue:** Nav behavior update (hide/show on scroll direction), keep existing structure
- **style.css:** Extended with new dark-first variables, section styles, animation keyframes. Existing variables preserved for Support/Privacy
- **No new dependencies.** Everything built with Vue 3 + CSS

### What Stays
- Vue 3 + Vite stack
- Vue Router with per-route meta
- Geist font
- Intersection Observer approach for scroll reveals
- Existing composables (useFaqSchema)
- All SEO setup (structured data, sitemap, robots.txt, meta tags)
- Theme toggle and localStorage persistence
- Accessibility features (skip link, ARIA, focus states, reduced motion)
- Support.vue and Privacy.vue (themed, not restructured)

### Phone Frame Component
Extract a reusable `PhoneFrame.vue` component that:
- Renders a CSS phone bezel around a screenshot `<img>`
- Accepts props for shadow intensity, parallax factor, entrance animation
- Used across sections 1, 3, 4, 5, 6, 7

### Scroll Direction Detection
Add a composable `useScrollDirection.js`:
- Returns `scrollDirection` ref ('up' | 'down')
- Used by nav to hide/show
- Debounced to prevent jitter

### Section Reveal System
Extend existing Intersection Observer setup:
- Support multiple reveal types: `fade-up`, `fade-in`, `scale-in`, `slide-left`, `slide-right`
- Stagger support for child elements (configurable delay between items)
- Threshold: 0.15 (trigger when 15% visible)

### Animated Counter
Existing `requestAnimationFrame` counter logic in Home.vue — extract to a reusable composable `useAnimatedCounter.js` for use in Hero and Social Proof sections.

## Performance Budget
- No new npm dependencies
- All animations CSS-only (GPU-accelerated transforms + opacity)
- Images: existing screenshots, lazy-loaded below the fold
- Target: Lighthouse Performance 90+, LCP < 2.5s
- Bundle size increase: minimal (CSS + Vue template changes only)

## Out of Scope
- English translation (architecture supports it, implementation deferred)
- New screenshots or video content
- Backend/API changes
- App Store listing changes
- Analytics/tracking additions
