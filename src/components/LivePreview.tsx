import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Lock, Music, Cake } from 'lucide-react'
import { JourneyData, themes, cakeFlavors } from '../lib/types'
import { ageBreakdown, getThemeConfig } from '../lib/steps'
import { useState, useEffect, useRef } from 'react'

interface Props {
  journey: JourneyData
  stepKey: string
  device: 'mobile' | 'desktop'
}

export default function LivePreview({ journey, stepKey, device }: Props) {
  const theme = getThemeConfig(journey.theme)
  const isMobile = device === 'mobile'

  return (
    <div
      className="relative w-full h-full overflow-hidden rounded-[inherit]"
      style={{ background: theme.bgGradient }}
    >
      {/* Subtle ambient particles via CSS */}
      <div className="absolute inset-0 pointer-events-none opacity-40" style={{
        backgroundImage: `radial-gradient(circle at 20% 30%, ${theme.accentSoft} 0%, transparent 50%), radial-gradient(circle at 80% 70%, ${theme.accentSoft} 0%, transparent 50%)`,
      }} />

      <AnimatePresence mode="wait">
        <motion.div
          key={stepKey}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center p-6 text-center"
        >
          {stepKey === 'recipient' && <PreviewRecipient journey={journey} />}
          {stepKey === 'theme' && <PreviewTheme journey={journey} />}
          {stepKey === 'wrap' && <PreviewWrap journey={journey} />}
          {stepKey === 'cake' && <PreviewCake journey={journey} />}
          {stepKey === 'welcome' && <PreviewWelcome journey={journey} />}
          {stepKey === 'music' && <PreviewMusic journey={journey} />}
          {stepKey === 'memories' && <PreviewMemories journey={journey} />}
          {stepKey === 'game' && <PreviewGame journey={journey} />}
          {stepKey === 'wishes' && <PreviewWishes journey={journey} />}
          {stepKey === 'surprise' && <PreviewSurprise journey={journey} />}
          {stepKey === 'letter' && <PreviewLetter journey={journey} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function GiftBox3D({ journey }: { journey: JourneyData }) {
  const theme = getThemeConfig(journey.theme)
  const styleColors: Record<string, { box: string; lid: string; ribbon: string }> = {
    'classic-pink': { box: '#E91E63', lid: '#C2185B', ribbon: '#FFD700' },
    'royal-gold': { box: '#FFD700', lid: '#D4AF37', ribbon: '#E91E63' },
    'mint-silver': { box: '#10B981', lid: '#059669', ribbon: '#C0C0C0' },
    'rainbow-pop': { box: '#FF2882', lid: '#9C27B0', ribbon: '#FFD700' },
  }
  const c = styleColors[journey.gift_style] || styleColors['classic-pink']

  const typeShape = journey.gift_type

  return (
    <div className="relative" style={{ perspective: '400px' }}>
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {typeShape === 'envelope' ? (
          <div className="relative w-24 h-16 rounded-md" style={{ background: c.lid, boxShadow: `0 10px 30px ${c.box}44` }}>
            <div className="absolute top-0 left-0 right-0 h-0 border-l-[48px] border-r-[48px] border-t-[28px] border-transparent border-t-color" style={{ borderTopColor: c.box }} />
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full" style={{ background: c.ribbon, opacity: 0.7 }} />
          </div>
        ) : typeShape === 'scroll' ? (
          <div className="relative w-24 h-20">
            <div className="absolute top-0 left-0 w-3 h-20 rounded-full" style={{ background: c.lid }} />
            <div className="absolute top-0 right-0 w-3 h-20 rounded-full" style={{ background: c.lid }} />
            <div className="absolute top-2 left-3 right-3 bottom-2 rounded" style={{ background: c.box }} />
          </div>
        ) : typeShape === 'chest' ? (
          <div className="relative w-24 h-16">
            <div className="absolute bottom-0 left-0 right-0 h-12 rounded-b-lg" style={{ background: c.box, boxShadow: `0 10px 30px ${c.box}44` }} />
            <div className="absolute top-0 left-0 right-0 h-6 rounded-t-2xl" style={{ background: c.lid }} />
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 rounded" style={{ background: c.ribbon }} />
          </div>
        ) : (
          <div className="relative w-24 h-24">
            {/* Box body */}
            <div className="absolute bottom-0 left-0 right-0 h-16 rounded-lg" style={{ background: c.box, boxShadow: `0 15px 40px ${c.box}55, 0 0 30px ${theme.accent}33` }} />
            {/* Lid */}
            <div className="absolute top-4 left-[-4px] right-[-4px] h-8 rounded-lg" style={{ background: c.lid, boxShadow: `0 4px 10px rgba(0,0,0,0.3)` }} />
            {/* Vertical ribbon */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3 h-20" style={{ background: c.ribbon }} />
            {/* Horizontal ribbon */}
            <div className="absolute top-12 left-[-4px] right-[-4px] h-3" style={{ background: c.ribbon }} />
            {/* Bow */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-6 flex justify-center items-center">
              <div className="absolute left-0 w-4 h-4 rounded-full" style={{ background: c.ribbon }} />
              <div className="absolute right-0 w-4 h-4 rounded-full" style={{ background: c.ribbon }} />
              <div className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full" style={{ background: c.ribbon, filter: 'brightness(0.8)' }} />
            </div>
          </div>
        )}
      </motion.div>
      <div className="absolute -inset-8 rounded-full pointer-events-none animate-pulse-glow" style={{ background: `radial-gradient(circle, ${theme.accentSoft} 0%, transparent 70%)` }} />
    </div>
  )
}

function PreviewRecipient({ journey }: { journey: JourneyData }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <GiftBox3D journey={journey} />
      <p className="text-xs text-pink-100/50 animate-pulse">Tap the gift to open</p>
      {journey.recipient_name && (
        <p className="text-sm text-pink-100/70 font-script text-lg">For {journey.recipient_name}</p>
      )}
    </div>
  )
}

function PreviewTheme({ journey }: { journey: JourneyData }) {
  const theme = getThemeConfig(journey.theme)
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-4xl font-serif font-bold" style={{ color: theme.accent }}>{theme.label}</div>
      <div className="flex gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            className="w-3 h-3 rounded-full"
            style={{ background: theme.particleColor }}
          />
        ))}
      </div>
      <div className="px-6 py-3 rounded-full" style={{ background: theme.accentSoft, border: `1px solid ${theme.accent}33` }}>
        <span className="text-sm" style={{ color: theme.accent }}>Accent color</span>
      </div>
    </div>
  )
}

function PreviewWrap({ journey }: { journey: JourneyData }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <GiftBox3D journey={journey} />
      <p className="text-xs text-pink-100/50">{journey.gift_type} · {journey.gift_style.replace('-', ' ')}</p>
    </div>
  )
}

function PreviewCake({ journey }: { journey: JourneyData }) {
  const flavor = cakeFlavors.find((f) => f.key === journey.cake_flavor) || cakeFlavors[0]
  const age = ageBreakdown(journey.date_of_birth)

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="text-center">
        <p className="text-xs text-pink-100/40 mb-1">Time lived</p>
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { label: 'Years', val: age.years },
            { label: 'Days', val: age.days },
            { label: 'Hours', val: age.hours },
            { label: 'Mins', val: age.minutes },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-lg font-bold text-neon-magenta">{s.val}</div>
              <div className="text-[10px] text-pink-100/40">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Cake */}
      <div className="relative mt-2">
        {/* Candles */}
        <div className="flex justify-center gap-2 mb-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="relative">
              <motion.div
                animate={{ scaleY: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
                transition={{ duration: 0.3, repeat: Infinity, delay: i * 0.1 }}
                className="w-1.5 h-3 rounded-full mx-auto"
                style={{ background: 'linear-gradient(to top, #FF6B35, #FFD700)', boxShadow: '0 0 6px #FFD700' }}
              />
              <div className="w-1 h-4 bg-yellow-100 mx-auto" />
            </div>
          ))}
        </div>
        {/* Top tier */}
        <div className="w-28 h-8 rounded-t-lg mx-auto" style={{ background: flavor.cream }} />
        {/* Bottom tier */}
        <div className="w-36 h-10 rounded-b-lg" style={{ background: flavor.color, boxShadow: `0 10px 30px ${flavor.color}44` }} />
        {/* Drips */}
        <div className="absolute top-8 left-0 right-0 flex justify-around -mt-1">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="w-2 h-3 rounded-b-full" style={{ background: flavor.cream }} />
          ))}
        </div>
      </div>
      <p className="text-xs text-pink-100/40">Tap to blow out candles</p>
    </div>
  )
}

function PreviewWelcome({ journey }: { journey: JourneyData }) {
  return (
    <div className="glass-panel rounded-2xl p-6 max-w-xs">
      <Heart className="mx-auto mb-3 text-neon-magenta" size={24} />
      <h3 className="font-serif text-lg font-semibold mb-2 leading-snug">{journey.welcome_headline}</h3>
      {journey.welcome_subtitle && <p className="text-sm text-pink-100/50">{journey.welcome_subtitle}</p>}
    </div>
  )
}

function PreviewMusic({ journey }: { journey: JourneyData }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(233,30,99,0.15)', border: '2px solid #E91E63' }}
      >
        <Music className="text-neon-magenta" size={28} />
      </motion.div>
      <p className="text-sm text-pink-100/60">{journey.music_name || 'No track selected'}</p>
    </div>
  )
}

function PreviewMemories({ journey }: { journey: JourneyData }) {
  if (journey.memories.length === 0) {
    return (
      <div className="text-center">
        <p className="text-sm text-pink-100/40">Upload photos to see them here</p>
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center gap-3 w-full px-4">
      <div className="relative w-full max-w-[200px]">
        <AnimatePresence>
          <MemoryCard key={0} item={journey.memories[0]} layout={journey.memory_layout} />
        </AnimatePresence>
      </div>
      <div className="flex gap-1.5">
        {journey.memories.slice(0, 5).map((_, i) => (
          <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-neon-magenta' : 'bg-pink-100/20'}`} />
        ))}
      </div>
    </div>
  )
}

function MemoryCard({ item, layout }: { item: { url: string; caption: string }; layout: string }) {
  if (layout === 'cinema') {
    return (
      <div className="rounded-xl overflow-hidden shadow-2xl">
        <img src={item.url} alt="" className="w-full h-32 object-cover" />
        {item.caption && <p className="text-xs text-center py-1.5 bg-black/60">{item.caption}</p>}
      </div>
    )
  }
  if (layout === 'scrapbook') {
    return (
      <div className="rounded-lg overflow-hidden p-2" style={{ background: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,40,130,0.2)' }}>
        <img src={item.url} alt="" className="w-full h-28 object-cover rounded" />
        {item.caption && <p className="text-xs text-center mt-1.5 font-script text-base">{item.caption}</p>}
      </div>
    )
  }
  return (
    <div className="bg-white p-2 pb-6 rounded-sm shadow-2xl rotate-[-2deg]">
      <img src={item.url} alt="" className="w-full h-28 object-cover" />
      {item.caption && <p className="text-xs text-gray-700 font-script text-base mt-1.5 text-center">{item.caption}</p>}
    </div>
  )
}

function PreviewGame({ journey }: { journey: JourneyData }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm font-semibold text-pink-100/70">{journey.game_type === 'puzzle' ? 'Sliding Puzzle' : 'Memory Match'}</p>
      <div className="grid grid-cols-3 gap-1.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(233,30,99,0.15)', border: '1px solid rgba(233,30,99,0.3)' }}>
            <Heart className="text-neon-magenta/50" size={16} />
          </div>
        ))}
      </div>
      <p className="text-xs text-pink-100/40">Match all pairs to continue</p>
    </div>
  )
}

function PreviewWishes({ journey }: { journey: JourneyData }) {
  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="relative w-full h-32 flex items-end justify-around">
        {journey.wishes.slice(0, 5).map((_, i) => {
          const colors = ['#E91E63', '#FF2882', '#FFD700', '#FF80AB', '#9C27B0']
          return (
            <motion.div
              key={i}
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
              className="w-7 h-9 rounded-full"
              style={{ background: colors[i % colors.length], opacity: 0.7 }}
            >
              <div className="w-1 h-2 bg-pink-200/30 mx-auto -mt-2" />
            </motion.div>
          )
        })}
      </div>
      <p className="text-xs text-pink-100/40">Tap balloons to pop wishes</p>
    </div>
  )
}

function PreviewSurprise({ journey }: { journey: JourneyData }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-40 h-24 rounded-xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #FFD700, #D4AF37)' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-xs text-yellow-900 font-bold">Scratch here</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-black/30 rounded-b-xl" />
      </div>
      <p className="text-sm text-pink-100/60 font-script text-base">{journey.surprise_title || 'One last surprise'}</p>
    </div>
  )
}

function PreviewLetter({ journey }: { journey: JourneyData }) {
  const [text, setText] = useState('')
  const bodyRef = useRef(journey.letter_body)

  useEffect(() => {
    bodyRef.current = journey.letter_body
    setText('')
    let i = 0
    const interval = setInterval(() => {
      if (i >= bodyRef.current.length) {
        clearInterval(interval)
        return
      }
      setText(bodyRef.current.slice(0, i + 1))
      i++
    }, 40)
    return () => clearInterval(interval)
  }, [journey.letter_body])

  return (
    <div className="flex flex-col items-center gap-3 w-full px-4">
      <div className="relative w-full max-w-[220px]">
        {/* Envelope flap */}
        <div className="h-0 border-l-[110px] border-r-[110px] border-t-[30px] border-transparent border-t-neon-pink/40 rounded-t-sm mx-auto" />
        {/* Letter body */}
        <div className="bg-[#2A1530] rounded-b-lg p-4 min-h-[120px]" style={{ border: '1px solid rgba(255,40,130,0.15)', borderTop: 'none' }}>
          <p className="font-script text-sm text-pink-100/80 mb-1">{journey.letter_greeting}</p>
          <p className="font-script text-xs text-pink-100/60 leading-relaxed typewriter-cursor">{text}</p>
        </div>
      </div>
    </div>
  )
}
