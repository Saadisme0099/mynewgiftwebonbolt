import { JourneyData, ThemeKey, themes } from '../lib/types'

export const stepDefs = [
  { n: 1, key: 'recipient', title: 'Who is this for', subtitle: 'Tell us about the lucky person' },
  { n: 2, key: 'theme', title: 'Pick a theme', subtitle: 'Choose the visual vibe of your journey' },
  { n: 3, key: 'wrap', title: 'Pick a gift wrap', subtitle: 'How should their gift box look?' },
  { n: 4, key: 'cake', title: 'Choose a cake', subtitle: 'Pick the cake flavor for their moment' },
  { n: 5, key: 'welcome', title: 'Their first welcome', subtitle: 'The first words they\'ll read' },
  { n: 6, key: 'music', title: 'Set the mood', subtitle: 'Add background music to the journey' },
  { n: 7, key: 'memories', title: 'Favorite memories', subtitle: 'Upload photos and add captions' },
  { n: 8, key: 'game', title: 'Pick a little game', subtitle: 'A playful challenge before the letter' },
  { n: 9, key: 'wishes', title: 'Pop a little wish', subtitle: 'Add wishes inside floating balloons' },
  { n: 10, key: 'surprise', title: 'One last surprise', subtitle: 'A scratch card with a hidden message' },
  { n: 11, key: 'letter', title: 'A handwritten letter', subtitle: 'Your final words, typed from the heart' },
] as const

export const totalSteps = stepDefs.length

export function stepProgress(step: number) {
  return Math.round((step / totalSteps) * 100)
}

export function getThemeConfig(key: ThemeKey) {
  return themes[key] || themes.classic
}

export function ageBreakdown(dob: string): { years: number; days: number; hours: number; minutes: number } {
  if (!dob) return { years: 0, days: 0, hours: 0, minutes: 0 }
  const birth = new Date(dob)
  if (isNaN(birth.getTime())) return { years: 0, days: 0, hours: 0, minutes: 0 }
  const now = new Date()
  const diffMs = now.getTime() - birth.getTime()
  if (diffMs < 0) return { years: 0, days: 0, hours: 0, minutes: 0 }
  const totalMinutes = Math.floor(diffMs / 60000)
  const totalHours = Math.floor(diffMs / 3600000)
  const totalDays = Math.floor(diffMs / 86400000)
  const years = Math.floor(totalDays / 365.25)
  const days = totalDays - Math.floor(years * 365.25)
  const hours = totalHours % 24
  const minutes = totalMinutes % 60
  return { years, days, hours, minutes }
}

export function previewJourneyDefaults(j: JourneyData) {
  return j
}
