<script setup>
import { ref } from 'vue'

const FORMSPREE_FORM_ID = 'mvgqyvgn'
const FORMSPREE_ENDPOINT = `https://formspree.io/f/${FORMSPREE_FORM_ID}`

const email = ref('')
const message = ref('')
const isSubmitting = ref(false)
const isSubmitted = ref(false)
const error = ref(null)

const handleSubmit = async () => {
  error.value = null
  isSubmitting.value = true

  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.value,
        message: message.value,
        appId: 'poliskollen',
        appName: 'Poliskollen',
        type: 'support_web'
      })
    })

    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`)
    }

    isSubmitted.value = true
    email.value = ''
    message.value = ''
  } catch (err) {
    error.value = err.message || 'Något gick fel. Försök igen.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="support-page">
    <!-- Hero -->
    <section class="support-hero">
      <div class="hero-bg">
        <div class="hero-orb hero-orb-1"></div>
        <div class="hero-orb hero-orb-2"></div>
      </div>
      <div class="hero-inner">
        <div class="hero-icon-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <span class="section-badge">Support</span>
        <h1>Hur kan vi hjälpa dig?</h1>
        <p class="hero-sub">Har du frågor, feedback eller stött på problem? Vi finns här för att hjälpa.</p>
      </div>
    </section>

    <!-- Content -->
    <section class="support-content">
      <div class="section-container">
        <div class="support-grid">
          <!-- Contact Form -->
          <div class="support-card">
            <div class="card-header">
              <div class="card-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div>
                <h2>Skicka ett meddelande</h2>
                <p class="card-desc">Vi svarar vanligtvis inom 24 timmar.</p>
              </div>
            </div>

            <div v-if="isSubmitted" class="success-message">
              <svg class="success-checkmark" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="30"/>
                <path d="M20 32 L28 40 L44 24" fill="none"/>
              </svg>
              <h3>Tack för ditt meddelande!</h3>
              <p>Vi återkommer till dig via e-post så snart som möjligt.</p>
            </div>

            <form v-else @submit.prevent="handleSubmit" class="form">
              <div class="form-group">
                <label for="email">Din e-postadress</label>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  required
                  placeholder="namn@exempel.se"
                  class="input"
                />
              </div>

              <div class="form-group">
                <label for="message">Meddelande</label>
                <textarea
                  id="message"
                  v-model="message"
                  required
                  placeholder="Beskriv ditt ärende..."
                  rows="5"
                  class="input textarea"
                ></textarea>
              </div>

              <div v-if="error" class="error-message">
                {{ error }}
              </div>

              <div class="form-actions">
                <button
                  type="submit"
                  class="btn btn-primary"
                  :class="{ 'is-loading': isSubmitting }"
                  :disabled="isSubmitting"
                >
                  <span class="loading-spinner" v-if="isSubmitting"></span>
                  <span class="btn-text" :style="{ visibility: isSubmitting ? 'hidden' : 'visible' }">
                    Skicka meddelande
                  </span>
                </button>
              </div>
            </form>
          </div>

          <!-- Sidebar -->
          <div class="support-sidebar">
            <!-- FAQ -->
            <div class="support-card">
              <div class="card-header compact">
                <div class="card-icon-wrap small">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <h3>Vanliga frågor</h3>
              </div>

              <div class="faq-item">
                <h4>Hur aktiverar jag push-notiser?</h4>
                <p>Gå till Inställningar i appen och aktivera notiser för de områden du vill bevaka.</p>
              </div>

              <div class="faq-item">
                <h4>Är appen gratis?</h4>
                <p>Ja! Grundfunktionerna är helt gratis. Premium-prenumeration låser upp extra funktioner.</p>
              </div>

              <div class="faq-item">
                <h4>Varifrån kommer informationen?</h4>
                <p>All information hämtas från Polisens officiella händelseflöde.</p>
              </div>
            </div>

            <!-- Contact -->
            <div class="support-card">
              <div class="card-header compact">
                <div class="card-icon-wrap small">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <h3>Kontakt</h3>
              </div>
              <p class="contact-text">
                Du kan också nå oss direkt via e-post:
              </p>
              <a href="mailto:mvgqyvgn@formspree.io?subject=Poliskollen%20Support" class="contact-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                support@poliskollen.se
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.support-page {
  padding-top: 70px;
}

/* ---- Hero ---- */
.support-hero {
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
  right: -10%;
}

.hero-orb-2 {
  width: 300px;
  height: 300px;
  background: rgba(61, 122, 184, 0.1);
  bottom: -10%;
  left: -5%;
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

.support-hero .section-badge {
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

.support-hero h1 {
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

.support-content {
  padding: 56px 0 100px;
}

.support-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 28px;
  align-items: start;
}

/* ---- Cards ---- */
.support-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-2xl);
  padding: 32px;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1),
              border-color 0.3s ease;
}

.support-sidebar .support-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.06);
  border-color: rgba(22, 90, 155, 0.18);
}

[data-theme="dark"] .support-sidebar .support-card:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) .support-sidebar .support-card:hover {
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
  }
}

.card-header {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.card-header.compact {
  margin-bottom: var(--space-lg);
}

.card-header h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.card-header h3 {
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--text-primary);
}

.card-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-top: 2px;
}

.card-icon-wrap {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(22, 90, 155, 0.08);
  border-radius: var(--radius-lg);
  flex-shrink: 0;
}

.card-icon-wrap.small {
  width: 36px;
  height: 36px;
}

.card-icon-wrap svg {
  width: 20px;
  height: 20px;
  color: var(--poliskollen-accent);
}

.card-icon-wrap.small svg {
  width: 17px;
  height: 17px;
}

/* ---- Form ---- */
.form {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
}

.form-group::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--poliskollen-accent);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  transform: scaleX(0);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.form-group:focus-within::after {
  transform: scaleX(1);
}

.form-group:focus-within label {
  color: var(--poliskollen-accent);
}

.form-group label {
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.input {
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  font-size: 0.9375rem;
  font-family: inherit;
  background: var(--bg-secondary);
  color: var(--text-primary);
  transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
}

.input::placeholder {
  color: var(--text-secondary);
  opacity: 0.6;
}

.input:focus {
  outline: none;
  border-color: var(--poliskollen-accent);
  box-shadow: 0 0 0 4px rgba(22, 90, 155, 0.1);
  background: var(--bg-primary);
}

/* ---- Submit button hover ---- */
.btn.btn-primary {
  transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.btn.btn-primary:hover:not(:disabled) {
  transform: scale(1.03);
  box-shadow: 0 4px 14px rgba(22, 90, 155, 0.3);
}

.btn.btn-primary:active:not(:disabled) {
  transform: scale(0.98);
}

.textarea {
  resize: vertical;
  min-height: 120px;
}

.form-actions {
  display: flex;
  gap: var(--space-md);
}

.error-message {
  color: #FCA5A5;
  font-size: 0.875rem;
  padding: 12px 16px;
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.15);
  border-radius: var(--radius-lg);
  animation: inputShake 0.5s ease-in-out;
}

@keyframes inputShake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}

.success-message {
  text-align: center;
  padding: var(--space-xl) 0;
}

.success-checkmark {
  width: 64px;
  height: 64px;
  margin: 0 auto var(--space-lg);
  display: block;
}

.success-checkmark circle {
  fill: none;
  stroke: #22c55e;
  stroke-width: 2;
  stroke-dasharray: 190;
  stroke-dashoffset: 190;
  animation: circleDraw 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.success-checkmark path {
  stroke: #22c55e;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 36;
  stroke-dashoffset: 36;
  animation: checkDraw 0.4s cubic-bezier(0.65, 0, 0.45, 1) 0.45s forwards;
}

@keyframes circleDraw {
  to { stroke-dashoffset: 0; }
}

@keyframes checkDraw {
  to { stroke-dashoffset: 0; }
}

.success-message h3 {
  font-size: 1.125rem;
  margin-bottom: var(--space-sm);
  opacity: 0;
  transform: translateY(8px);
  animation: successFadeIn 0.4s ease 0.7s forwards;
}

.success-message p {
  color: var(--text-secondary);
  font-size: 0.9375rem;
  opacity: 0;
  transform: translateY(8px);
  animation: successFadeIn 0.4s ease 0.85s forwards;
}

@keyframes successFadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ---- Sidebar ---- */
.support-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.faq-item {
  padding: var(--space-md) 0;
  border-bottom: 1px solid var(--border-color);
}

.faq-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.faq-item h4 {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--text-primary);
}

.faq-item p {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  line-height: 1.55;
}

.contact-text {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: var(--space-md);
  line-height: 1.5;
}

.contact-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: rgba(22, 90, 155, 0.08);
  border: 1px solid rgba(22, 90, 155, 0.12);
  border-radius: var(--radius-lg);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--poliskollen-accent);
  transition: all 0.2s ease;
}

.contact-link svg {
  width: 16px;
  height: 16px;
}

.contact-link:hover {
  background: rgba(22, 90, 155, 0.14);
  color: var(--poliskollen-accent);
  transform: translateY(-1px);
}

/* ---- Dark mode ---- */
[data-theme="dark"] .support-card {
  background: var(--bg-secondary);
}

[data-theme="dark"] .hero-icon-wrap {
  background: rgba(61, 122, 184, 0.12);
  border-color: rgba(61, 122, 184, 0.18);
}

[data-theme="dark"] .card-icon-wrap {
  background: rgba(61, 122, 184, 0.12);
}

[data-theme="dark"] .hero-orb-1 {
  background: rgba(61, 122, 184, 0.12);
}

[data-theme="dark"] .hero-orb-2 {
  background: rgba(90, 155, 212, 0.08);
}

[data-theme="dark"] .input {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

[data-theme="dark"] .input:focus {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--poliskollen-accent);
}

[data-theme="dark"] .contact-link {
  background: rgba(61, 122, 184, 0.1);
  border-color: rgba(61, 122, 184, 0.18);
}

[data-theme="dark"] .contact-link:hover {
  background: rgba(61, 122, 184, 0.18);
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) .support-card {
    background: var(--bg-secondary);
  }
  :root:not([data-theme="light"]) .input {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }
}

/* ---- Responsive ---- */
@media (min-width: 769px) and (max-width: 960px) {
  .support-grid {
    grid-template-columns: 1fr;
    max-width: 640px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .support-hero {
    padding: 60px var(--space-md) 48px;
  }

  .support-content {
    padding: 40px 0 72px;
  }

  .support-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions .btn {
    width: 100%;
  }

  .support-card {
    padding: 24px;
  }
}

/* ---- Reduced motion ---- */
@media (prefers-reduced-motion: reduce) {
  .hero-orb {
    display: none;
  }

  .success-checkmark circle,
  .success-checkmark path {
    animation: none;
    stroke-dashoffset: 0;
  }

  .success-message h3,
  .success-message p {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
</style>
