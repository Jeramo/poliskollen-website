<script setup>
import { ref, computed, onMounted } from 'vue'

const rawContent = ref('')
const isLoading = ref(true)
const error = ref(null)

function parsePrivacyText(text) {
  const lines = text.split('\n')
  const blocks = []
  let currentList = null
  let currentParagraph = []

  function flushParagraph() {
    if (currentParagraph.length > 0) {
      blocks.push({ type: 'p', content: formatInline(currentParagraph.join(' ')) })
      currentParagraph = []
    }
  }

  function flushList() {
    if (currentList) {
      blocks.push({ type: 'ul', items: currentList })
      currentList = null
    }
  }

  function formatInline(str) {
    // Bold: **text**
    str = str.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Email addresses
    str = str.replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, '<a href="mailto:$1">$1</a>')
    // URLs (bare links not already in HTML)
    str = str.replace(/(?<![">])(https?:\/\/[^\s<)]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
    return str
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Skip the main title (h1) — hero section covers it
    if (line.startsWith('# ') && !line.startsWith('## ')) {
      flushParagraph()
      flushList()
      continue
    }

    // H2
    if (line.startsWith('## ')) {
      flushParagraph()
      flushList()
      blocks.push({ type: 'h2', content: formatInline(line.replace(/^## /, '')) })
      continue
    }

    // H3
    if (line.startsWith('### ')) {
      flushParagraph()
      flushList()
      blocks.push({ type: 'h3', content: formatInline(line.replace(/^### /, '')) })
      continue
    }

    // Horizontal rule
    if (line.trim() === '---') {
      flushParagraph()
      flushList()
      blocks.push({ type: 'hr' })
      continue
    }

    // Bullet point
    if (line.startsWith('- ')) {
      flushParagraph()
      if (!currentList) currentList = []
      currentList.push(formatInline(line.replace(/^- /, '')))
      continue
    }

    // Empty line — end of paragraph/list
    if (line.trim() === '') {
      flushParagraph()
      flushList()
      continue
    }

    // Regular text line — accumulate into paragraph
    currentParagraph.push(line.trim())
  }

  flushParagraph()
  flushList()

  return blocks
}

const parsedBlocks = computed(() => {
  if (!rawContent.value) return []
  return parsePrivacyText(rawContent.value)
})

onMounted(async () => {
  try {
    const response = await fetch('https://jeanrobert.dev/policies/privacy-poliskollen.txt')
    if (!response.ok) {
      throw new Error('Could not load privacy policy')
    }
    rawContent.value = await response.text()
  } catch (err) {
    error.value = 'Kunde inte ladda integritetspolicyn. Försök igen senare.'
    console.error('Failed to load privacy policy:', err)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="privacy-page">
    <!-- Hero -->
    <section class="privacy-hero">
      <div class="hero-bg">
        <div class="hero-orb hero-orb-1"></div>
        <div class="hero-orb hero-orb-2"></div>
      </div>
      <div class="hero-inner">
        <div class="hero-icon-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <span class="section-badge">Juridiskt</span>
        <h1>Integritetspolicy</h1>
        <p class="hero-sub">Din integritet är viktig för oss. Läs om hur vi hanterar dina uppgifter.</p>
      </div>
    </section>

    <!-- Content -->
    <section class="privacy-content">
      <div class="section-container">
        <div class="policy-card">
          <!-- Loading -->
          <div v-if="isLoading" class="loading-state">
            <div class="loading-spinner-large"></div>
            <p>Laddar integritetspolicy...</p>
          </div>

          <!-- Error -->
          <div v-else-if="error" class="error-state">
            <div class="error-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <p>{{ error }}</p>
            <a href="https://jeanrobert.dev/policies/privacy-poliskollen.txt" target="_blank" class="btn btn-primary">
              Öppna policy i nytt fönster
            </a>
          </div>

          <!-- Policy text -->
          <div v-else class="policy-text">
            <template v-for="(block, i) in parsedBlocks" :key="i">
              <h2 v-if="block.type === 'h2'" class="fade-in-block" :style="{ animationDelay: (i * 30) + 'ms' }" v-html="block.content"></h2>
              <h3 v-if="block.type === 'h3'" class="fade-in-block" :style="{ animationDelay: (i * 30) + 'ms' }" v-html="block.content"></h3>
              <p v-if="block.type === 'p'" class="fade-in-block" :style="{ animationDelay: (i * 30) + 'ms' }" v-html="block.content"></p>
              <ul v-if="block.type === 'ul'" class="fade-in-block" :style="{ animationDelay: (i * 30) + 'ms' }">
                <li v-for="(item, j) in block.items" :key="j" v-html="item"></li>
              </ul>
              <hr v-if="block.type === 'hr'" class="fade-in-block" :style="{ animationDelay: (i * 30) + 'ms' }" />
            </template>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.privacy-page {
  padding-top: 70px;
}

/* ---- Hero ---- */
.privacy-hero {
  position: relative;
  padding: 80px var(--space-lg) 64px;
  text-align: center;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: var(--gradient-hero);
}

.hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
}

.hero-orb-1 {
  width: 400px;
  height: 400px;
  background: rgba(22, 90, 155, 0.15);
  top: -20%;
  left: -10%;
}

.hero-orb-2 {
  width: 300px;
  height: 300px;
  background: rgba(61, 122, 184, 0.1);
  bottom: -10%;
  right: -5%;
}

.hero-inner {
  position: relative;
  z-index: 1;
  max-width: 560px;
  margin: 0 auto;
}

.hero-icon-wrap {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(22, 90, 155, 0.08);
  border: 1px solid rgba(22, 90, 155, 0.12);
  border-radius: 20px;
  margin: 0 auto var(--space-lg);
}

.hero-icon-wrap svg {
  width: 28px;
  height: 28px;
  color: var(--poliskollen-accent);
}

.privacy-hero .section-badge {
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

.privacy-hero h1 {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: var(--space-md);
  line-height: 1.15;
}

.hero-sub {
  font-size: 1.0625rem;
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 440px;
  margin: 0 auto;
}

/* ---- Content ---- */
.section-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 var(--space-lg);
}

.privacy-content {
  padding: 56px 0 100px;
}

.policy-card {
  max-width: 800px;
  margin: 0 auto;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-2xl);
  padding: 48px;
}

/* ---- Loading ---- */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-lg);
  padding: var(--space-3xl) 0;
  color: var(--text-secondary);
}

.loading-spinner-large {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
  border-top-color: var(--poliskollen-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ---- Error ---- */
.error-state {
  text-align: center;
  padding: var(--space-2xl) 0;
}

.error-icon-wrap {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(220, 38, 38, 0.08);
  border-radius: 16px;
  margin: 0 auto var(--space-lg);
}

.error-icon-wrap svg {
  width: 24px;
  height: 24px;
  color: #f87171;
}

.error-state p {
  color: var(--text-secondary);
  margin-bottom: var(--space-lg);
  font-size: 0.9375rem;
}

/* ---- Policy text ---- */
.policy-text h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 2rem 0 0.75rem;
  letter-spacing: -0.01em;
  line-height: 1.3;
}

.policy-text h2:first-child {
  margin-top: 0;
}

.policy-text h3 {
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 1.5rem 0 0.5rem;
  line-height: 1.35;
}

.policy-text p {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  line-height: 1.75;
  margin: 0 0 0.75rem;
}

.policy-text ul {
  margin: 0 0 1rem;
  padding-left: 1.25rem;
  list-style: none;
}

.policy-text li {
  position: relative;
  font-size: 0.9375rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 0.4rem;
  padding-left: 0.75rem;
}

.policy-text li::before {
  content: '';
  position: absolute;
  left: -0.75rem;
  top: 0.6em;
  width: 5px;
  height: 5px;
  background: var(--poliskollen-accent);
  border-radius: 50%;
  opacity: 0.6;
}

.policy-text hr {
  border: none;
  height: 1px;
  background: var(--border-color);
  margin: 2rem 0;
}

.policy-text strong {
  color: var(--text-primary);
  font-weight: 600;
}

.policy-text a {
  color: var(--poliskollen-accent);
  text-decoration: none;
  transition: opacity 0.15s ease;
}

.policy-text a:hover {
  opacity: 0.8;
  text-decoration: underline;
}

/* ---- Fade-in animation ---- */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-block {
  animation: fadeInUp 0.4s ease both;
}

/* ---- Dark mode ---- */
[data-theme="dark"] .policy-card {
  background: var(--bg-secondary);
}

[data-theme="dark"] .hero-icon-wrap {
  background: rgba(61, 122, 184, 0.12);
  border-color: rgba(61, 122, 184, 0.18);
}

[data-theme="dark"] .hero-orb-1 {
  background: rgba(61, 122, 184, 0.12);
}

[data-theme="dark"] .hero-orb-2 {
  background: rgba(90, 155, 212, 0.08);
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) .policy-card {
    background: var(--bg-secondary);
  }
}

/* ---- Responsive ---- */
@media (max-width: 768px) {
  .privacy-hero {
    padding: 60px var(--space-md) 48px;
  }

  .privacy-content {
    padding: 40px 0 72px;
  }

  .policy-card {
    padding: 24px;
    border-radius: var(--radius-xl);
  }
}

/* ---- Reduced motion ---- */
@media (prefers-reduced-motion: reduce) {
  .hero-orb {
    display: none;
  }
  .fade-in-block {
    animation: none;
  }
}
</style>
