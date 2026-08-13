export function stripTags(input: string): string {
  if (!input) return ''
  // remove HTML tags
  return input.replace(/<[^>]*>/g, '')
}

export function truncate(input: string, max = 2000): string {
  if (!input) return ''
  if (input.length <= max) return input
  return input.slice(0, max)
}

export function sanitize(input: string, max = 2000): string {
  return truncate(stripTags(input), max).trim()
}

export function sanitizeJourney(journey: any) {
  const j = { ...journey }
  // sanitize string fields
  const stringFields = [
    'recipient_name',
    'pin_hint',
    'theme',
    'gift_type',
    'gift_style',
    'cake_flavor',
    'welcome_headline',
    'welcome_subtitle',
    'music_track',
    'music_name',
    'memory_layout',
    'game_type',
    'game_image',
    'surprise_title',
    'surprise_message',
    'surprise_image',
    'letter_greeting',
    'letter_body',
    'letter_signoff',
    'occasion',
  ]
  for (const k of stringFields) {
    if (typeof j[k] === 'string') j[k] = sanitize(j[k], 4000)
  }
  // sanitize arrays of strings (wishes)
  if (Array.isArray(j.wishes)) j.wishes = j.wishes.map((w: string) => sanitize(w, 400))
  // memories: array of {url, caption}
  if (Array.isArray(j.memories)) j.memories = j.memories.map((m: any) => ({ url: m.url, caption: sanitize(m.caption || '', 400) }))
  return j
}
