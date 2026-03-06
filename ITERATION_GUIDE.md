# Poliskollen Marketing Page - Iteration Guide

## Current Design (March 2026)
Clean, authentic, animated landing page. NO fake data, NO AI-generated fluff.

## Tech Stack
- Vue 3 (Composition API)
- Vite
- CSS animations + Intersection Observer for scroll reveals
- Geist font

## Accent Color
**#165A9B** — use this for all blue accents

## ⚠️ RULES FOR ITERATIONS

1. **SMALL CHANGES ONLY** — One tiny improvement per iteration
2. **DO NOT edit src/style.css** — Only scoped styles in .vue files
3. **KEEP IT AUTHENTIC** — No fake stats, no fake reviews
4. **TEST BEFORE COMMIT** — `npm run build` must succeed

## Current Sections
- Hero: App icon, title image, tagline, real stats (4.3★, 6 reviews), App Store button
- Features: 6 cards with icons and scroll animations
- Pricing: Free vs Pro (29 kr/month)
- FAQ: Accordion with real questions
- CTA: Download section

## Good Polish Ideas
- Improve hover states on buttons/cards
- Refine animation timing/easing
- Better focus states for accessibility
- Subtle parallax effects
- Mobile touch feedback
- Loading states
- Micro-interactions

## DO NOT
- Add fake testimonials or reviews
- Add fake statistics
- Make major layout changes
- Edit global styles (src/style.css)
- Add external libraries

## Build & Deploy
```bash
npm run build
cp dist/assets/*.js dist/assets/*.css assets/
# Update index.html with new asset filenames from dist/index.html
cd ../..
git add public/poliskollen/
git commit -m "poliskollen: [change]"
git push
```
