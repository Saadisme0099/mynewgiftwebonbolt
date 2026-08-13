export type ThemeKey =
  | 'classic'
  | 'galaxy'
  | 'emerald'
  | 'frost'
  | 'midnight'
  | 'party'
  | 'floating-hearts'
  | 'neon-hearts'

export type GiftType = 'giftbox' | 'envelope' | 'scroll' | 'chest'
export type GiftStyle = 'classic-pink' | 'royal-gold' | 'mint-silver' | 'rainbow-pop'
export type CakeFlavor = 'classic-pink' | 'chocolate' | 'vanilla-cream' | 'rainbow-funfetti' | 'red-velvet'
export type MemoryLayout = 'polaroid' | 'cinema' | 'scrapbook'
export type GameType = 'puzzle' | 'memory'

export interface MemoryItem {
  url: string
  caption: string
}

export interface JourneyData {
  id?: string
  recipient_name: string
  date_of_birth: string
  pin: string
  pin_hint: string
  theme: ThemeKey
  gift_type: GiftType
  gift_style: GiftStyle
  cake_flavor: CakeFlavor
  welcome_headline: string
  welcome_subtitle: string
  music_track: string
  music_name: string
  memories: MemoryItem[]
  memory_layout: MemoryLayout
  game_type: GameType
  game_image: string
  wishes: string[]
  surprise_title: string
  surprise_message: string
  surprise_image: string
  letter_greeting: string
  letter_body: string
  letter_signoff: string
  occasion: string
  published: boolean
}

export const defaultJourney: JourneyData = {
  recipient_name: 'Cutiepie',
  date_of_birth: '2007-04-25',
  pin: '1234',
  pin_hint: '',
  theme: 'classic',
  gift_type: 'giftbox',
  gift_style: 'classic-pink',
  cake_flavor: 'classic-pink',
  welcome_headline: "There's something special I want to tell you...",
  welcome_subtitle: 'A little journey, just for you',
  music_track: '',
  music_name: '',
  memories: [],
  memory_layout: 'polaroid',
  game_type: 'memory',
  game_image: '',
  wishes: ['You make my whole world brighter ✨'],
  surprise_title: 'One last surprise',
  surprise_message: 'Here is something I never told you...',
  surprise_image: '',
  letter_greeting: 'My dearest,',
  letter_body: 'Every moment with you has been a gift I never knew I needed. You light up every room you walk into, and today I just want you to know how truly special you are. Happy birthday, my love.',
  letter_signoff: 'Forever yours, with all my heart 💖',
  occasion: 'birthday',
  published: false,
}

export interface ThemeConfig {
  key: ThemeKey
  label: string
  bgGradient: string
  accent: string
  accentSoft: string
  particleColor: string
}

export const themes: Record<ThemeKey, ThemeConfig> = {
  classic: {
    key: 'classic',
    label: 'Classic',
    bgGradient: 'linear-gradient(135deg, #0F0510 0%, #1D0B20 100%)',
    accent: '#E91E63',
    accentSoft: 'rgba(233,30,99,0.15)',
    particleColor: '#FF2882',
  },
  galaxy: {
    key: 'galaxy',
    label: 'Galaxy',
    bgGradient: 'linear-gradient(135deg, #0B0420 0%, #1A0B35 50%, #0F0518 100%)',
    accent: '#9C27B0',
    accentSoft: 'rgba(156,39,176,0.15)',
    particleColor: '#BA68C8',
  },
  emerald: {
    key: 'emerald',
    label: 'Emerald',
    bgGradient: 'linear-gradient(135deg, #04140C 0%, #0B2B1A 100%)',
    accent: '#10B981',
    accentSoft: 'rgba(16,185,129,0.15)',
    particleColor: '#34D399',
  },
  frost: {
    key: 'frost',
    label: 'Frost',
    bgGradient: 'linear-gradient(135deg, #06121F 0%, #0E2440 100%)',
    accent: '#38BDF8',
    accentSoft: 'rgba(56,189,248,0.15)',
    particleColor: '#7DD3FC',
  },
  midnight: {
    key: 'midnight',
    label: 'Midnight',
    bgGradient: 'linear-gradient(135deg, #080812 0%, #14142B 100%)',
    accent: '#6366F1',
    accentSoft: 'rgba(99,102,241,0.15)',
    particleColor: '#818CF8',
  },
  party: {
    key: 'party',
    label: 'Party',
    bgGradient: 'linear-gradient(135deg, #1A0410 0%, #2D0B2B 50%, #1A0B20 100%)',
    accent: '#FF2882',
    accentSoft: 'rgba(255,40,130,0.15)',
    particleColor: '#FFD700',
  },
  'floating-hearts': {
    key: 'floating-hearts',
    label: 'Floating Hearts',
    bgGradient: 'linear-gradient(135deg, #1A0510 0%, #2B0B20 100%)',
    accent: '#FF4081',
    accentSoft: 'rgba(255,64,129,0.15)',
    particleColor: '#FF80AB',
  },
  'neon-hearts': {
    key: 'neon-hearts',
    label: 'Neon Hearts',
    bgGradient: 'linear-gradient(135deg, #100415 0%, #1F0823 100%)',
    accent: '#FF00FF',
    accentSoft: 'rgba(255,0,255,0.12)',
    particleColor: '#FF2882',
  },
}

export const giftTypes: { key: GiftType; label: string }[] = [
  { key: 'giftbox', label: 'Gift Box' },
  { key: 'envelope', label: 'Envelope' },
  { key: 'scroll', label: 'Scroll' },
  { key: 'chest', label: 'Chest' },
]

export const giftStyles: { key: GiftStyle; label: string }[] = [
  { key: 'classic-pink', label: 'Classic Pink' },
  { key: 'royal-gold', label: 'Royal Gold' },
  { key: 'mint-silver', label: 'Mint & Silver' },
  { key: 'rainbow-pop', label: 'Rainbow Pop' },
]

export const cakeFlavors: { key: CakeFlavor; label: string; color: string; cream: string }[] = [
  { key: 'classic-pink', label: 'Classic Pink', color: '#E91E63', cream: '#F8BBD0' },
  { key: 'chocolate', label: 'Chocolate', color: '#5D4037', cream: '#BCAAA4' },
  { key: 'vanilla-cream', label: 'Vanilla Cream', color: '#FFF3E0', cream: '#FFE0B2' },
  { key: 'rainbow-funfetti', label: 'Rainbow Funfetti', color: '#FFD700', cream: '#FFEB3B' },
  { key: 'red-velvet', label: 'Red Velvet', color: '#B71C1C', cream: '#FFCDD2' },
]

export const memoryLayouts: { key: MemoryLayout; label: string }[] = [
  { key: 'polaroid', label: 'Polaroid' },
  { key: 'cinema', label: 'Cinema' },
  { key: 'scrapbook', label: 'Scrapbook' },
]

export const gameTypes: { key: GameType; label: string }[] = [
  { key: 'puzzle', label: 'Sliding Puzzle' },
  { key: 'memory', label: 'Memory Match' },
]

export const presetTracks: { key: string; name: string; url: string }[] = [
  { key: 'none', name: 'No music', url: '' },
  { key: 'romantic', name: 'Romantic Piano', url: 'https://cdn.pixabay.com/audio/2022/10/30/audio_347111dc80.mp3' },
  { key: 'uplifting', name: 'Uplifting Cinematic', url: 'https://cdn.pixabay.com/audio/2023/01/01/audio_a71dc69ca0.mp3' },
  { key: 'dreamy', name: 'Dreamy Ambient', url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3' },
]
