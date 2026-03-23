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
