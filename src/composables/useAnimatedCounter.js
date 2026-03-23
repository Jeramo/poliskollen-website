import { ref, onMounted, onUnmounted } from 'vue'

export function useAnimatedCounter(target, options = {}) {
  const {
    duration = 1500,
    decimals = 0,
    prefix = '',
    suffix = '',
    threshold = 0.15,
  } = options

  const current = ref(0)
  const display = ref(prefix + '0' + suffix)
  const elRef = ref(null)
  let started = false
  let observer = null

  const eased = (t) => 1 - Math.pow(2, -10 * t)

  const animate = () => {
    if (started) return
    started = true
    const start = performance.now()
    const step = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const value = decimals
        ? parseFloat((target * eased(progress)).toFixed(decimals))
        : Math.round(target * eased(progress))
      current.value = value
      display.value = prefix + value + suffix
      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }
    requestAnimationFrame(step)
  }

  onMounted(() => {
    if (!elRef.value) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      const finalValue = decimals ? parseFloat(target.toFixed(decimals)) : target
      current.value = finalValue
      display.value = prefix + finalValue + suffix
      return
    }
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate()
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

  return { current, display, elRef }
}
