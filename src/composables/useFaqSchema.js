import { onMounted, onUnmounted } from 'vue'

export function useFaqSchema(faqs, id = 'faq-schema') {
  onMounted(() => {
    if (document.getElementById(id)) return
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    }
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = id
    script.textContent = JSON.stringify(schema)
    document.head.appendChild(script)
  })

  onUnmounted(() => {
    document.getElementById(id)?.remove()
  })
}
