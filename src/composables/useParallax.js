import { onMounted, onUnmounted } from 'vue'

export function useParallax(elRef, speed = 0.5) {
  let ticking = false

  const update = () => {
    if (!elRef.value) {
      ticking = false
      return
    }
    const rect = elRef.value.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const elementCenter = rect.top + rect.height / 2
    const viewportCenter = viewportHeight / 2
    const offset = (elementCenter - viewportCenter) * (1 - speed)
    elRef.value.style.transform = `translate3d(0, ${offset}px, 0)`
    ticking = false
  }

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(update)
      ticking = true
    }
  }

  onMounted(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return
    window.addEventListener('scroll', onScroll, { passive: true })
    update()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
  })
}
