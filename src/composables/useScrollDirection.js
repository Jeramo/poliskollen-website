import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollDirection(debounceMs = 50) {
  const direction = ref('up')
  const isDisabled = ref(false)
  let lastY = 0
  let timeout = null

  const onScroll = () => {
    if (isDisabled.value) return
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      const currentY = window.scrollY
      direction.value = (currentY > lastY && currentY > 70) ? 'down' : 'up'
      lastY = currentY
    }, debounceMs)
  }

  onMounted(() => {
    lastY = window.scrollY
    window.addEventListener('scroll', onScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
    if (timeout) clearTimeout(timeout)
  })

  return { direction, isDisabled }
}
