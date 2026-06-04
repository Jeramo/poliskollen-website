// Lightweight client-side OS detection. This is a static SPA, so it runs in the
// browser on load and is used to tailor the download CTAs to the visitor's
// device (Android → Google Play, iPhone → App Store, desktop → App Store).
export const APP_STORE_URL = 'https://apps.apple.com/app/id6757537288'
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.jeramo.poliskollen'

export function detectPlatform() {
  if (typeof navigator === 'undefined') return 'other'
  const ua = navigator.userAgent || ''
  if (/android/i.test(ua)) return 'android'
  if (/iphone|ipad|ipod/i.test(ua)) return 'ios'
  // iPadOS 13+ reports as desktop Safari but exposes touch points.
  if (/macintosh/i.test(ua) && (navigator.maxTouchPoints || 0) > 1) return 'ios'
  return 'other'
}

// Resolves the visitor's platform once on load and exposes the store link a
// single-store CTA should point to (Android → Google Play, everything else →
// App Store), plus the raw URLs for rows that show both stores.
export function usePlatform() {
  const platform = detectPlatform()
  const isAndroid = platform === 'android'
  return {
    platform,
    isAndroid,
    primaryStoreUrl: isAndroid ? PLAY_STORE_URL : APP_STORE_URL,
    APP_STORE_URL,
    PLAY_STORE_URL,
  }
}
