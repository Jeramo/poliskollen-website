# Poliskollen Website - Iteration Guide

## Repo
https://github.com/Jeramo/poliskollen-website

## Tech Stack
- Vue 3 (Composition API)
- Vite
- CSS animations + Intersection Observer
- Geist font

## Accent Color
**#165A9B**

## ⚠️ RULES

1. **ONE small change per iteration**
2. **DO NOT edit src/style.css**
3. **Keep it authentic** — no fake data
4. **Test before commit** — `npm run build` must succeed

## Build & Deploy
```bash
npm run build
cp dist/assets/*.js dist/assets/*.css assets/
# Update index.html with new asset filenames
git add .
git commit -m "poliskollen: [change]"
git push
```

## Polish Ideas
- Hover states
- Animation timing
- Focus states / accessibility
- Micro-interactions
- Mobile touch feedback
