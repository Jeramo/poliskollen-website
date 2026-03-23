# Poliskollen — Cinematic Website Redesign

**Date:** 2026-03-23
**Status:** Approved
**Goal:** Transform the Poliskollen marketing website into a cinematic, Apple-style storytelling experience that drives app downloads, builds brand prestige, and creates a shareable/viral impression.

## Context

Poliskollen is a Swedish iOS app that displays real-time police incidents across Sweden. The current website (Vue 3 + Vite, pure CSS) is functional with solid SEO but lacks the visual impact needed to maximize conversions and brand perception. The redesign keeps the existing tech stack and assets while completely reimagining the presentation.

**Target audience:** Broad Swedish public — young adults, safety-conscious families, news/true-crime enthusiasts.
**Language:** Swedish primary, architecture supports English later.
**Pages affected:** Home (complete redesign), Support & Privacy (theme alignment).

## Available Assets

The following 8 screenshots exist in `public/screenshots/`:

| File | Content | Assigned Section |
|------|---------|-----------------|
| `1-events.jpg` | Event list feed (core view) | **Hero** (phone mockup) |
| `7-heatmap.jpg` | Heatmap map with incident overlay | **Section 3: Map** |
| `8-detail.jpg` | Event detail with AI "Sammanfattning" | **Section 4: AI & Detail** |
| `6-trends.jpg` | Trends chart (weekly data) | **Section 5: Trends & Patterns** |
| `5-patterns.jpg` | Pattern detective (crime patterns) | **Section 5: Trends & Patterns** (second phone) |
| `4-quiz.jpg` | Quiz game ("Gissa händelsen") | **Section 6: Quiz** |
| `2-social.jpg` | Social/streaks/activity | **Section 7: Community** |
| `3-achievements.jpg` | Achievements/badges | **Section 7: Community** (second phone) |

Additionally: app icon asset and existing title text image.

## Design Language

### Color

The Home page uses a cinematic dark palette scoped to the Home page only. Support and Privacy pages retain the existing theme system unchanged.

- **Home background:** `#0a0a0f` (near-black) — applied via a `.cinematic` class on the Home page wrapper, NOT by changing the global `--bg-primary` variable
- **Accent:** `#165A9B` (brand blue) — unified across light/dark on the Home page since the background is always dark. The existing light/dark accent shift (`#165A9B` / `#3D7AB8`) remains for Support/Privacy pages
- **Text primary:** `#FFFFFF` at varying opacity levels (1.0, 0.7, 0.4)
- **Dark mode is default.** The theme toggle is hidden on the Home page (cinematic design is dark-only). Toggle remains visible and functional on Support/Privacy pages

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
- **Reveal patterns:** fade-up (translateY + opacity), scale-in (CSS only, GPU-accelerated)
- **Parallax:** Uses a `scroll` event listener (throttled via `requestAnimationFrame`) to apply `transform: translateY()` at different rates. This is the ONE exception to "CSS-only animations" — the scroll listener is lightweight and RAF-throttled
- **Timing:** cubic-bezier(0.16, 1, 0.3, 1) — existing easing kept
- **Reduced motion:** All animations (including parallax) respect `prefers-reduced-motion: reduce` — elements render in their final position with no movement

### Navigation
- Glassmorphic fixed nav (existing, refined)
- Hide on scroll-down, reveal on scroll-up (new behavior)
- **Mobile menu interaction:** Nav hide/show is disabled while mobile menu is open. The scroll progress bar (child of `.navbar`) moves with the nav
- Logo + Home / Support / Integritet (theme toggle hidden on Home, visible on other pages)
- Scroll progress bar at top (existing, kept)

## Page Structure: Home (10 Sections)

### Section 1: Hero

**Purpose:** Immediate brand impact and primary conversion.

- Full viewport, dark background with radial blue glow (`radial-gradient` from center-bottom)
- Floating animated orbs in background (existing, elevated — larger, slower, more subtle)
- **Entrance sequence:** App icon fades in → headline fades in → subtitle → phone → stats → CTA (staggered, ~200ms delays)
- **Headline:** "Hela Sveriges polishändelser." (4–6rem, weight 800, white)
- **Subtitle:** "I din ficka. I realtid." (muted white, opacity 0.5)
- **Phone mockup:** Centered, using `1-events.jpg` inside PhoneFrame component. Floating with box-shadow glow (`0 20px 60px rgba(22,90,155,0.3)`). Parallax — moves at 0.8x scroll speed
- **Animated counters:** "4.3★ Betyg" · "Gratis" (hardcoded, matching current values from existing code)
- **CTA:** "Ladda ner gratis" button → App Store link. Blue background, white text, hover lift

### Section 2: Story (Emotional Hook)

**Purpose:** Create narrative tension. Answer "why should I care?"

- Dark section, text-only, centered. Section height: 100vh
- Three text blocks staggered via Intersection Observer with increasing thresholds:
  - **"Sverige vaknar."** — triggers at threshold 0.15 (large, bold, white)
  - **"Vad hände i natt?"** — triggers at threshold 0.35 (large, bold, white)
  - *"Poliskollen ger dig svaret — direkt."* — triggers at threshold 0.55 (smaller, muted, accent color hint)
- Each line uses `fade-up` reveal with its own Intersection Observer entry, creating the line-by-line effect as the user scrolls deeper into the section
- No images. No UI. Pure typography and pacing
- Subtle background gradient shift (dark to slightly lighter dark)

### Section 3: Map & Heatmap

**Purpose:** Showcase the core map feature — see incidents geographically.

- **Headline:** "Se allt. Överallt." (fade-up reveal)
- Phone screenshot `7-heatmap.jpg` inside PhoneFrame, enters from below (fade-up)
- Animated CSS dots appearing around the phone (small colored circles with `@keyframes` fade-in + pulse, staggered delays, positioned absolute around the frame)
- **Copy:** "Värmekarta och interaktiv karta över hela Sverige. Se var händelser inträffar — i realtid."
- Layout: headline + copy on one side, phone on the other (responsive: stacks vertically on mobile)

### Section 4: AI & Event Detail

**Purpose:** Show how deep the app goes — from summary to full report.

- **Headline:** "Hela bilden. Sammanfattad."
- Phone screenshot `8-detail.jpg` inside PhoneFrame, positioned slightly off-center
- "PRO" badge near headline (small pill, accent background, white text)
- **Copy:** "AI-sammanfattning, fullständig rapport och plats på kartan. Allt du behöver veta om varje händelse."
- Layout mirrors section 3 but flipped (phone left, text right) for visual rhythm

### Section 5: Trends & Patterns

**Purpose:** Showcase data intelligence — the app isn't just a feed, it's smart.

- **Headline:** "Upptäck mönster. Följ trender."
- **Two phones** side by side: `6-trends.jpg` and `5-patterns.jpg` inside PhoneFrame components, slightly angled toward each other (CSS `transform: perspective(800px) rotateY(±5deg)`)
- **Copy:** "Mönsterdetektiven hittar ökningar i ditt område. Trendanalys visar hur din kommun utvecklas vecka för vecka."
- Centered layout, phones enter with staggered fade-up (left phone first, then right)

### Section 6: Quiz

**Purpose:** Show the fun/engaging side — this isn't just a news app, it's interactive.

- **Headline:** "Testa dig själv."
- Phone screenshot `4-quiz.jpg` inside PhoneFrame, centered
- **Copy:** "Gissa händelsen — läs en sammanfattning och gissa vilken typ av brott det är. Bygg upp din streak och tävla med dig själv."
- Lighter tone in this section — slightly brighter background (`#0f0f18`) to signal playfulness
- Phone has subtle float animation (gentle up-down CSS keyframe)

### Section 7: Community & Achievements

**Purpose:** Show social features and gamification — reasons to keep coming back.

- **Headline:** "Engagera dig. Lås upp prestationer."
- **Two phones** side by side: `2-social.jpg` and `3-achievements.jpg` inside PhoneFrame components
- **Copy:** "Håll din streak, samla poäng och lås upp prestationer. Se din aktivitet och bli en del av gemenskapen."
- Same angled layout as Section 5 for consistency
- Staggered entrance animation

### Section 8: Social Proof

**Purpose:** Build trust and credibility right before the pricing ask.

- **Headline:** "Tusentals svenskar håller redan koll."
- App Store rating displayed large: ★★★★☆ 4.3 with CSS star visualization
- Animated counter for review count: target value 6 (current App Store review count), uses `useAnimatedCounter` composable
- 2–3 short review excerpts in card format. **Content to author:** These will be paraphrased from actual App Store reviews. Placeholder text in initial implementation, replaced with real excerpts before launch
- Cards enter with staggered fade-up animation
- Centered grid layout (1–3 columns responsive)

### Section 9: Pricing

**Purpose:** Convert interest into action. Make Pro irresistible at 9 kr/month.

- **Headline:** "Välj din plan."
- Two cards side by side (stack on mobile):
  - **Gratis:** Clean list of free features, "Kom igång" CTA → App Store
  - **Pro (9 kr/mån):** Elevated card (slight scale, blue accent border, subtle glow shadow), "Mest populär" badge, all features listed with checkmarks, "Uppgradera till Pro" CTA → App Store
- Pro card is visually dominant — larger, glowing, positioned slightly forward
- Feature lists use checkmark icons (✓) with clear hierarchy
- Feature lists match current pricing section content

### Section 10: Final CTA + FAQ

**Purpose:** Last chance conversion, plus FAQ for SEO and user questions.

- Full dark section, two parts:
  - **Part A — CTA:** "Redo att hålla koll?" (large, bold, centered), subtitle, App Store download button with app icon pulse glow
  - **Part B — FAQ:** Collapsible accordion below the CTA (reuses existing FAQ structure and `useFaqSchema` composable for structured data). Same 5 questions from current site. Compact styling, does not need full viewport height
- This preserves the FAQ structured data for SEO while keeping the cinematic flow
- Footer fades in below with existing footer content

## Support & Privacy Pages

- Keep existing theme system (light/dark toggle works normally)
- Apply consistent reveal animations (fade-up on sections)
- Keep existing content structure (contact form, FAQ sidebar, privacy policy loader)
- Not full-viewport cinematic — these are utility pages, content-focused
- No changes to layout or content, only animation enhancement

## Technical Approach

### File Paths (exact)
- `src/pages/Home.vue` — Complete rewrite
- `src/App.vue` — Nav behavior update (hide/show on scroll direction)
- `src/style.css` — Extended with cinematic styles (scoped via `.cinematic` class)
- `src/main.js` — No changes (router and meta handling unchanged)
- `src/composables/useFaqSchema.js` — No changes (reused in Section 10)
- `src/components/PhoneFrame.vue` — **New file**
- `src/composables/useScrollDirection.js` — **New file**
- `src/composables/useAnimatedCounter.js` — **New file** (extracted from current Home.vue)
- `src/composables/useSectionReveal.js` — **New file**
- `src/composables/useParallax.js` — **New file**

### What Changes
- **`src/pages/Home.vue`:** Complete rewrite — 10 cinematic sections replacing current layout. The wrapper element MUST preserve `id="main-content"` (target of skip-link in App.vue)
- **`src/App.vue`:** Nav behavior update (hide/show on scroll direction), theme toggle conditional visibility (hidden when `useRoute().path === '/'`)
- **`src/style.css`:** Extended with `.cinematic` scoped styles, new animation keyframes. All existing variables and styles preserved — no breaking changes for Support/Privacy

### What Stays
- Vue 3 + Vite stack, no new npm dependencies
- Vue Router with per-route meta
- Geist font from CDN
- Existing composables (`useFaqSchema`) reused
- All SEO setup (structured data, sitemap, robots.txt, meta tags)
- Theme toggle and localStorage persistence (functional on Support/Privacy)
- Accessibility features (skip link, ARIA, focus states, reduced motion)
- `src/pages/Support.vue` and `src/pages/Privacy.vue` (unchanged except optional reveal animations)

### PhoneFrame Component (`src/components/PhoneFrame.vue`)
Reusable component that:
- Renders a CSS phone bezel (rounded rect, notch, dark chrome) around a screenshot `<img>`
- **Props:** `src` (image path), `alt` (accessibility), `shadowIntensity` ('low' | 'medium' | 'high'), `angle` (optional CSS rotateY transform in degrees)
- Used in sections 1, 3, 4, 5, 6, 7

### Scroll Direction Detection (`src/composables/useScrollDirection.js`)
- Returns `scrollDirection` ref ('up' | 'down')
- Returns `isScrollDisabled` ref — set to `true` when mobile menu is open (nav stays visible)
- Debounced (50ms) to prevent jitter
- Cleans up scroll listener on unmount

### Section Reveal System (`src/composables/useSectionReveal.js`)
- Composable that accepts a template ref and reveal options
- Supports reveal types: `fade-up`, `fade-in`, `scale-in`, `slide-left`, `slide-right`
- Stagger support for child elements (configurable delay between items)
- Threshold: 0.15 default (configurable per section)
- Elements start with `opacity: 0` and appropriate pre-transform, transition to final state
- Respects `prefers-reduced-motion`: if reduced, elements render immediately with no animation

### Animated Counter (`src/composables/useAnimatedCounter.js`)
- Extracted from current Home.vue's `requestAnimationFrame` counter logic
- Accepts: target number, duration, easing function, optional prefix/suffix
- Returns: current display value ref
- Triggers when element enters viewport (via Intersection Observer)
- Used in Section 1 (Hero stats) and Section 8 (Social Proof)

### Parallax (`src/composables/useParallax.js`)
- Accepts: template ref, speed factor (0–1, where 1 = normal scroll, 0.5 = half speed)
- Uses `scroll` event listener throttled via `requestAnimationFrame`
- Applies `transform: translateY()` based on element position relative to viewport
- Disabled when `prefers-reduced-motion: reduce`
- Cleans up on unmount

## Heading Hierarchy (SEO)

To maintain proper heading structure for search engines:

- `<h1>`: "Hela Sveriges polishändelser." (Hero, one per page)
- `<h2>`: Each section title ("Se allt. Överallt.", "Hela bilden. Sammanfattad.", etc.)
- `<h3>`: Sub-elements within sections (pricing plan names, FAQ questions)

This replaces the current heading structure but maintains equivalent semantic depth.

## Performance Budget
- No new npm dependencies
- Animations: CSS transforms + opacity (GPU-accelerated). One scroll event listener for parallax (RAF-throttled)
- Images: existing screenshots, lazy-loaded below the fold (`loading="lazy"`)
- Hero screenshot (`1-events.jpg`): eagerly loaded (above the fold)
- Target: Lighthouse Performance 90+, LCP < 2.5s
- Bundle size increase: minimal (CSS + Vue template changes, 4 new small composables, 1 new component)

## Out of Scope
- English translation (architecture supports it, implementation deferred)
- New app screenshots or video content
- Backend/API changes
- App Store listing changes
- Analytics/tracking additions
- Changes to Support.vue or Privacy.vue content/layout
