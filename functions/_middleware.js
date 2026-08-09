const CANONICAL_HOST = 'poliskollen.nu'
const PAGES_HOST = 'poliskollen-website.pages.dev'

export function onRequest(context) {
  const url = new URL(context.request.url)
  if (url.hostname !== PAGES_HOST) return context.next()

  url.protocol = 'https:'
  url.hostname = CANONICAL_HOST
  url.port = ''
  return Response.redirect(url.toString(), 301)
}
