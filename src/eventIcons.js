// Event type → icon, resembling the iOS SF Symbols the app uses per type
// (Constants.swift EventTypes.icon). Keyword match mirrors the app.
export function iconName(type) {
  const t = (type || '').toLowerCase()
  if (t.includes('trafik')) return 'car' // car.fill
  if (t.includes('mord') || t.includes('dråp')) return 'xmark' // xmark.circle.fill
  if (t.includes('skottlossning')) return 'bolt' // bolt.fill
  if (t.includes('rån')) return 'triangle' // exclamationmark.triangle.fill
  if (t.includes('misshandel') || t.includes('olaga hot')) return 'boxing' // figure.boxing
  if (t.includes('inbrott')) return 'door' // door.left.hand.open
  if (t.includes('stöld') || t.includes('motorfordon')) return 'bag' // bag.fill
  if (t.includes('brand')) return 'flame' // flame.fill
  if (t.includes('narkotika')) return 'pills' // pills.fill
  if (t.includes('rattfylleri')) return 'wineglass' // wineglass.fill
  if (t.includes('kniv')) return 'scissors' // scissors
  if (t.includes('försvunnen') || t.includes('räddning')) return 'missing' // person.fill.questionmark
  if (t.includes('ordningslag')) return 'shieldx' // exclamationmark.shield.fill
  if (t.includes('sammanfattning')) return 'doc' // doc.text.fill
  return 'shield' // shield.fill
}

// Filled 24×24 SVG paths, white glyphs, chosen to read like the SF Symbols.
export const ICON_PATHS = {
  car: 'M18.92 6.5A1.5 1.5 0 0 0 17.5 5.5h-11A1.5 1.5 0 0 0 5.08 6.5L3.3 11.2a2 2 0 0 0-.3 1.05V17a1 1 0 0 0 1 1h.5a1 1 0 0 0 1-1v-1h13v1a1 1 0 0 0 1 1h.5a1 1 0 0 0 1-1v-4.75a2 2 0 0 0-.3-1.05L18.92 6.5ZM6.7 14.6a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6Zm10.6 0a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6ZM5.4 10.5l1.15-3.05a.8.8 0 0 1 .75-.52h9.4a.8.8 0 0 1 .75.52L18.6 10.5H5.4Z',
  flame: 'M13.7 2.1c.5 2.6-1.1 4.2-2.5 5.8-1.2 1.5-2.3 3-2.3 5.1a5 5 0 0 0 10 .1c0-3.8-2.9-6.6-4.4-9.5-.3-.7-.6-1.1-.8-1.5Zm.1 16.8a2.8 2.8 0 0 1-2.8-2.8c0-1.3.8-2.1 1.6-3 .3 1 .9 1.5 1.7 1.5.9 0 1.5-.7 1.5-1.8 0 .1 1.3 1.4 1.3 3.3a2.8 2.8 0 0 1-2.8 2.8Z',
  triangle: 'M12 3c-.53 0-1.02.28-1.29.74l-8.4 14.5A1.5 1.5 0 0 0 3.6 20.5h16.8a1.5 1.5 0 0 0 1.29-2.26l-8.4-14.5A1.5 1.5 0 0 0 12 3Zm0 5.2a1 1 0 0 1 1 1v4.1a1 1 0 0 1-2 0V9.2a1 1 0 0 1 1-1Zm0 8.1a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Z',
  bolt: 'M12.8 2 5.3 13.2c-.32.48.02 1.13.6 1.13H10l-1.3 6.6c-.15.75.8 1.2 1.28.6l7.7-11c.33-.48-.01-1.13-.6-1.13H13.4L14.5 2h-1.7Z',
  boxing: 'M15.3 6H10a3.5 3.5 0 0 0-3.5 3.5V10H6a1.5 1.5 0 0 0 0 3h.5v1a3.5 3.5 0 0 0 2 3.16V19a1 1 0 0 0 1 1h5.3a1 1 0 0 0 1-1v-1.55A3.5 3.5 0 0 0 18.8 14V9.5A3.5 3.5 0 0 0 15.3 6ZM6.6 12a.5.5 0 0 1 0-1h.9v1h-.9Z',
  door: 'M4 19.5h16V18h-1V4.8a.8.8 0 0 0-1-.78l-8 1.8A1 1 0 0 0 9 6.78V18H6V6.5a1 1 0 0 0-2 0v13Zm7.2-8a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Z',
  bag: 'M7 8V6.8a5 5 0 0 1 10 0V8h2.1a1 1 0 0 1 1 .9l.86 9.8a2 2 0 0 1-2 2.18H6.98a2 2 0 0 1-2-2.18L5.86 8.9a1 1 0 0 1 1-.9H7Zm2 0h6V6.8a3 3 0 0 0-6 0V8Z',
  pills: 'M4.9 12.7 12.7 4.9a3.5 3.5 0 1 1 4.95 4.95l-7.8 7.8A3.5 3.5 0 0 1 4.9 12.7Zm3.55 3.55 3.9-3.9-3.5-3.5-3.9 3.9a2.475 2.475 0 0 0 3.5 3.5Z',
  wineglass: 'M7.8 3h8.4l-.62 6.1a3.6 3.6 0 0 1-2.58 3.16V19H15v2H9v-2h1.98v-6.74A3.6 3.6 0 0 1 8.4 9.1L7.8 3Zm1.9 2 .28 2.9h4.04L14.3 5H9.7Z',
  xmark: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm3.4 11.1-1.3 1.3L12 13.3l-2.1 2.1-1.3-1.3L10.7 12 8.6 9.9l1.3-1.3L12 10.7l2.1-2.1 1.3 1.3L13.3 12l2.1 2.1Z',
  missing: 'M10 4.3a2.6 2.6 0 1 0 0 5.2 2.6 2.6 0 0 0 0-5.2Zm-4.8 13v-1.4c0-2.3 2.7-3.5 4.8-3.5.6 0 1.3.1 1.9.3v4.6H5.2Zm11.6-11a2.2 2.2 0 0 1 1.2 4.05c-.5.33-.7.5-.7 1.05v.35h-1.4v-.5c0-.85.5-1.25 1-1.6.35-.25.5-.45.5-.85a.9.9 0 0 0-1.8 0h-1.4a2.2 2.2 0 0 1 2.6-2.5Zm-.7 6.4h1.5v1.5h-1.5v-1.5Z',
  shieldx: 'M12 2 4 5v6.1c0 5 3.4 8.9 8 11 4.6-2.1 8-6 8-11V5l-8-3Zm0 4.6a1 1 0 0 1 1 1v4.3a1 1 0 0 1-2 0V7.6a1 1 0 0 1 1-1Zm0 8a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Z',
  doc: 'M6.5 2h6.7l5.3 5.3V20a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm6.5 1.7V7.5h3.8L13 3.7ZM8.2 11h7.6v1.5H8.2V11Zm0 3.2h7.6v1.5H8.2v-1.5Zm0 3.2h5v1.5h-5v-1.5Z',
  scissors: 'M8 4a3 3 0 1 0 0 6 3 3 0 0 0 1.6-.47L11.7 12l-2.1 2.47A3 3 0 1 0 11 16.5L20 6.4V4.7l-6.7 4.5-2-2.4A3 3 0 0 0 8 4Zm0 4.4a1.4 1.4 0 1 1 0-2.8 1.4 1.4 0 0 1 0 2.8Zm0 9.1a1.4 1.4 0 1 1 0-2.8 1.4 1.4 0 0 1 0 2.8Z',
  shield: 'M12 2 4 5v6c0 5 3.4 8.9 8 11 4.6-2.1 8-6 8-11V5l-8-3Z',
}
