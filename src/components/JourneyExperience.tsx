import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart } from 'lucide-react'
import { JourneyData, cakeFlavors } from '../lib/types'
import { ageBreakdown, getThemeConfig } from '../lib/steps'
import { fireConfetti, fireBigConfetti } from '../lib/confetti'
import ParticleBackground from './ParticleBackground'

type Stage = 'giftbox' | 'pin' | 'curtains' | 'welcome' | 'memories' | 'wishes' | 'game' | 'scratch' | 'letter' | 'done'

interface Props {
  journey: JourneyData
  audio: { isPlaying: boolean; currentUrl: string; load: (url: string, autoplay?: boolean) => void; toggle: () => void }
}

export default function JourneyExperience({ journey, audio }: Props) {
  const theme = getThemeConfig(journey.theme)
  const [stage, setStage] = useState<Stage>('giftbox')

  useEffect(() => {
    if (journey.music_track) audio.load(journey.music_track, false)
  }, [journey.music_track])

  const advance = (next: Stage) => setStage(next)

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: theme.bgGradient }}>
      <ParticleBackground color={theme.particleColor} density={30} shape="heart" />

      <AnimatePresence mode="wait">
        {stage === 'giftbox' && <GiftBoxStage key="giftbox" journey={journey} onOpen={() => advance('pin')} />}
        {stage === 'pin' && <PinStage key="pin" journey={journey} onSuccess={() => advance('curtains')} />}
        {stage === 'curtains' && <CurtainStage key="curtains" onDone={() => advance('welcome')} />}
        {stage === 'welcome' && <WelcomeStage key="welcome" journey={journey} onContinue={() => advance('memories')} />}
        {stage === 'memories' && <MemoriesStage key="memories" journey={journey} onContinue={() => advance('wishes')} />}
        {stage === 'wishes' && <WishesStage key="wishes" journey={journey} onContinue={() => advance('game')} />}
        {stage === 'game' && <GameStage key="game" journey={journey} onContinue={() => advance('scratch')} />}
        {stage === 'scratch' && <ScratchStage key="scratch" journey={journey} onContinue={() => advance('letter')} />}
        {stage === 'letter' && <LetterStage key="letter" journey={journey} onDone={() => advance('done')} />}
        {stage === 'done' && <DoneStage key="done" journey={journey} />}
      </AnimatePresence>

      {/* Audio toggle */}
      {journey.music_track && (
        <button
          onClick={audio.toggle}
          className="fixed bottom-5 right-5 z-50 w-12 h-12 rounded-full glass-panel flex items-center justify-center hover:scale-110 transition-transform"
        >
          {audio.isPlaying ? '🎵' : '🔇'}
        </button>
      )}
    </div>
  )
}

/* ========== Gift Box Stage ========== */
function GiftBoxStage({ journey, onOpen }: { journey: JourneyData; onOpen: () => void }) {
  const theme = getThemeConfig(journey.theme)
  const [clicked, setClicked] = useState(false)

  const handleClick = () => {
    if (clicked) return
    setClicked(true)
    if (journey.music_track) {
      // Autoplay attempt on user interaction
    }
    setTimeout(onOpen, 600)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.2 }}
      className="absolute inset-0 flex flex-col items-center justify-center z-10 px-8"
    >
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="relative cursor-pointer"
        onClick={handleClick}
      >
        <div className="absolute -inset-12 rounded-full animate-pulse-glow" style={{ background: `radial-gradient(circle, ${theme.accentSoft} 0%, transparent 70%)` }} />
        {/* 3D Gift Box */}
        <div className="relative w-40 h-40">
          <motion.div animate={clicked ? { rotateX: 60, y: -30 } : {}} transition={{ duration: 0.5 }}>
            {/* Lid */}
            <div className="absolute top-8 left-[-6px] right-[-6px] h-14 rounded-xl z-20" style={{ background: theme.accent, boxShadow: '0 4px 15px rgba(0,0,0,0.4)' }} />
            {/* Body */}
            <div className="absolute bottom-0 left-0 right-0 h-28 rounded-xl" style={{ background: theme.accent, filter: 'brightness(0.8)', boxShadow: `0 20px 50px ${theme.accent}55` }} />
            {/* Ribbons */}
            <div className="absolute top-8 bottom-0 left-1/2 -translate-x-1/2 w-5 z-10" style={{ background: '#FFD700' }} />
            <div className="absolute top-16 left-[-6px] right-[-6px] h-5 z-10" style={{ background: '#FFD700' }} />
            {/* Bow */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30">
              <div className="relative">
                <div className="absolute -left-5 w-6 h-6 rounded-full" style={{ background: '#FFD700' }} />
                <div className="absolute -right-5 w-6 h-6 rounded-full" style={{ background: '#FFD700' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#FFD700', filter: 'brightness(0.8)' }} />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mt-12 text-lg text-pink-100/70 font-script text-2xl"
      >
        Tap the gift to open
      </motion.p>
      {journey.recipient_name && (
        <p className="mt-2 text-sm text-pink-100/40">For {journey.recipient_name}</p>
      )}
    </motion.div>
  )
}

/* ========== PIN Stage ========== */
function PinStage({ journey, onSuccess }: { journey: JourneyData; onSuccess: () => void }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const press = (digit: string) => {
    if (pin.length >= 4) return
    const newPin = pin + digit
    setPin(newPin)
    if (newPin.length === 4) {
      setTimeout(() => {
        if (newPin === journey.pin) {
          onSuccess()
        } else {
          setError(true)
          setTimeout(() => { setPin(''); setError(false) }, 800)
        }
      }, 200)
    }
  }

  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center px-8"
      style={{ background: 'rgba(15,5,16,0.92)', backdropFilter: 'blur(20px)' }}
    >
      {/* Clock */}
      <div className="text-center mb-10">
        <div className="text-5xl font-light text-pink-100/80">{timeStr}</div>
        <div className="text-sm text-pink-100/40 mt-1">{dateStr}</div>
      </div>

      <p className="text-sm text-pink-100/50 mb-2">Enter the secret code</p>
      {journey.pin_hint && <p className="text-xs text-pink-100/30 mb-4 italic">Hint: {journey.pin_hint}</p>}

      {/* PIN dots */}
      <div className={`flex gap-3 mb-8 ${error ? 'animate-pulse' : ''}`}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-4 h-4 rounded-full border-2 transition-all"
            style={{
              borderColor: error ? '#ef4444' : i < pin.length ? '#E91E63' : 'rgba(255,255,255,0.2)',
              background: error ? '#ef4444' : i < pin.length ? '#E91E63' : 'transparent',
            }}
          />
        ))}
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-3 max-w-xs">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((k, i) => (
          <button
            key={i}
            onClick={() => k === '⌫' ? setPin(pin.slice(0, -1)) : k && press(k)}
            disabled={k === ''}
            className="w-16 h-16 rounded-full text-2xl font-light text-pink-100/70 glass-panel hover:bg-neon-pink/10 transition-colors flex items-center justify-center"
          >
            {k}
          </button>
        ))}
      </div>

      {error && <p className="text-red-400 text-sm mt-6">Wrong code, try again</p>}
    </motion.div>
  )
}

/* ========== Curtain Stage ========== */
function CurtainStage({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <motion.div className="absolute inset-0 z-30 flex items-center justify-center" style={{ background: '#000' }}>
      <motion.div
        className="absolute top-0 bottom-0 left-0 w-1/2"
        style={{ background: 'linear-gradient(90deg, #4A0000, #8B0000)', boxShadow: 'inset -10px 0 20px rgba(0,0,0,0.5)' }}
        initial={{ x: 0 }}
        animate={{ x: '-100%' }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      >
        <div className="absolute top-0 bottom-0 right-0 w-4 bg-yellow-900/30" />
      </motion.div>
      <motion.div
        className="absolute top-0 bottom-0 right-0 w-1/2"
        style={{ background: 'linear-gradient(270deg, #4A0000, #8B0000)', boxShadow: 'inset 10px 0 20px rgba(0,0,0,0.5)' }}
        initial={{ x: 0 }}
        animate={{ x: '100%' }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      >
        <div className="absolute top-0 bottom-0 left-0 w-4 bg-yellow-900/30" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center z-10"
      >
        <Heart className="text-neon-magenta mx-auto mb-4" size={48} />
        <p className="text-xl font-script text-2xl text-pink-100/70">Welcome...</p>
      </motion.div>
    </motion.div>
  )
}

/* ========== Welcome + Cake Stage ========== */
function WelcomeStage({ journey, onContinue }: { journey: JourneyData; onContinue: () => void }) {
  const theme = getThemeConfig(journey.theme)
  const age = ageBreakdown(journey.date_of_birth)
  const flavor = cakeFlavors.find((f) => f.key === journey.cake_flavor) || cakeFlavors[0]
  const [blown, setBlown] = useState(false)

  const blowCandles = () => {
    if (blown) return
    setBlown(true)
    fireConfetti()
    setTimeout(() => fireBigConfetti(), 400)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 py-8 overflow-y-auto no-scrollbar"
    >
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-6"
      >
        <h1 className="text-2xl font-serif font-bold mb-2 leading-snug" style={{ color: theme.accent }}>{journey.welcome_headline}</h1>
        {journey.welcome_subtitle && <p className="text-sm text-pink-100/50">{journey.welcome_subtitle}</p>}
        <p className="mt-2 text-lg font-script text-xl text-pink-100/70">Happy Birthday, {journey.recipient_name}! 🎂</p>
      </motion.div>

      {/* Age counter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-panel rounded-2xl px-5 py-4 mb-6"
      >
        <p className="text-xs text-pink-100/40 text-center mb-3">You've been alive for</p>
        <div className="grid grid-cols-4 gap-4 text-center">
          {[
            { label: 'Years', val: age.years },
            { label: 'Days', val: age.days },
            { label: 'Hours', val: age.hours },
            { label: 'Minutes', val: age.minutes },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-bold" style={{ color: theme.accent }}>{s.val}</div>
              <div className="text-[10px] text-pink-100/40">{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Cake */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="relative mb-6"
      >
        {/* Candles */}
        <div className="flex justify-center gap-3 mb-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="relative">
              {!blown && (
                <motion.div
                  animate={{ scaleY: [1, 1.3, 1], opacity: [1, 0.8, 1] }}
                  transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.15 }}
                  className="w-2 h-4 rounded-full mx-auto"
                  style={{ background: 'linear-gradient(to top, #FF6B35, #FFD700)', boxShadow: '0 0 10px #FFD700' }}
                />
              )}
              {blown && (
                <motion.div initial={{ opacity: 0.5 }} animate={{ opacity: 0 }} className="w-2 h-4 mx-auto bg-gray-600 rounded-full" />
              )}
              <div className="w-1.5 h-6 bg-yellow-100 mx-auto" />
            </div>
          ))}
        </div>
        {/* Cake body */}
        <div className="relative">
          <div className="w-44 h-12 rounded-t-xl mx-auto" style={{ background: flavor.cream }} />
          <div className="w-52 h-14 rounded-b-xl" style={{ background: flavor.color, boxShadow: `0 15px 40px ${flavor.color}55` }} />
          <div className="absolute top-12 left-0 right-0 flex justify-around">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="w-3 h-4 rounded-b-full" style={{ background: flavor.cream }} />
            ))}
          </div>
        </div>
      </motion.div>

      {!blown ? (
        <button onClick={blowCandles} className="neon-btn px-6 py-3 text-sm animate-pulse-glow">
          Tap to blow out candles 🌬️
        </button>
      ) : (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onContinue}
          className="neon-btn px-6 py-3 text-sm flex items-center gap-2"
        >
          See Our Memories 🌸
        </motion.button>
      )}
    </motion.div>
  )
}

/* ========== Memories Stage ========== */
function MemoriesStage({ journey, onContinue }: { journey: JourneyData; onContinue: () => void }) {
  const [index, setIndex] = useState(0)
  const memories = journey.memories

  if (memories.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6">
        <p className="text-pink-100/40 mb-6">No memories uploaded</p>
        <button onClick={onContinue} className="neon-btn px-6 py-3 text-sm">Continue</button>
      </motion.div>
    )
  }

  const next = () => {
    if (index < memories.length - 1) setIndex(index + 1)
  }
  const prev = () => {
    if (index > 0) setIndex(index - 1)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6"
    >
      <h2 className="text-xl font-serif font-bold mb-1 text-center">Our Memories 📸</h2>
      <p className="text-xs text-pink-100/40 mb-6">{index + 1} of {memories.length} · Swipe or tap</p>

      <div className="relative w-full max-w-sm" onClick={next}>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 50, rotate: 5 }}
            animate={{ opacity: 1, x: 0, rotate: index % 2 === 0 ? -2 : 2 }}
            exit={{ opacity: 0, x: -50, rotate: -5 }}
            transition={{ duration: 0.3 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => { if (info.offset.x < -50) next(); if (info.offset.x > 50) prev() }}
            className="cursor-pointer"
          >
            {journey.memory_layout === 'polaroid' && (
              <div className="bg-white p-3 pb-10 rounded-sm shadow-2xl mx-auto max-w-[280px]">
                <img src={memories[index].url} alt="" className="w-full h-52 object-cover" />
                {memories[index].caption && <p className="text-gray-700 font-script text-lg text-center mt-3">{memories[index].caption}</p>}
                {/* Tape accent */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-yellow-200/40 rotate-2" />
              </div>
            )}
            {journey.memory_layout === 'cinema' && (
              <div className="rounded-xl overflow-hidden shadow-2xl max-w-[280px] mx-auto">
                <img src={memories[index].url} alt="" className="w-full h-52 object-cover" />
                {memories[index].caption && <p className="text-sm text-center py-2 bg-black/70">{memories[index].caption}</p>}
              </div>
            )}
            {journey.memory_layout === 'scrapbook' && (
              <div className="rounded-lg p-3 max-w-[280px] mx-auto" style={{ background: 'rgba(255,255,255,0.06)', border: '2px dashed rgba(255,40,130,0.3)' }}>
                <img src={memories[index].url} alt="" className="w-full h-52 object-cover rounded" />
                {memories[index].caption && <p className="font-script text-lg text-center mt-2 text-pink-100/70">{memories[index].caption}</p>}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="flex gap-2 mt-6">
        {memories.map((_, i) => (
          <button key={i} onClick={() => setIndex(i)} className={`h-2 rounded-full transition-all ${i === index ? 'w-6 bg-neon-magenta' : 'w-2 bg-pink-100/20'}`} />
        ))}
      </div>

      {index === memories.length - 1 ? (
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onContinue} className="neon-btn px-6 py-3 text-sm mt-6">
          Pop Some Wishes 🎈
        </motion.button>
      ) : (
        <button onClick={next} className="ghost-btn px-6 py-2.5 text-sm mt-6">Next →</button>
      )}
    </motion.div>
  )
}

/* ========== Wishes / Balloons Stage ========== */
function WishesStage({ journey, onContinue }: { journey: JourneyData; onContinue: () => void }) {
  const wishes = journey.wishes.length > 0 ? journey.wishes : ['You are amazing! ✨']
  const [popped, setPopped] = useState<Set<number>>(new Set())
  const [showToast, setShowToast] = useState<string | null>(null)

  const colors = ['#E91E63', '#FF2882', '#FFD700', '#FF80AB', '#9C27B0', '#42A5F5', '#66BB6A']

  const popBalloon = (i: number) => {
    if (popped.has(i)) return
    const newPopped = new Set(popped)
    newPopped.add(i)
    setPopped(newPopped)
    setShowToast(wishes[i])
    fireConfetti()
    setTimeout(() => setShowToast(null), 3000)
  }

  const allPopped = popped.size >= wishes.length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6"
    >
      <h2 className="text-xl font-serif font-bold mb-2">Pop the balloons! 🎈</h2>
      <p className="text-sm text-pink-100/40 mb-6">Popped {popped.size}/{wishes.length}</p>

      <div className="relative w-full max-w-md h-72">
        {wishes.map((_, i) => {
          const isPopped = popped.has(i)
          const left = (i * 17 + 10) % 80
          const delay = i * 0.4
          return (
            <motion.button
              key={i}
              initial={{ y: 300, opacity: 0 }}
              animate={isPopped ? { scale: 1.4, opacity: 0 } : { y: [300, -20], opacity: [0, 1, 1, 0.8], x: [0, left, left + 10, left] }}
              transition={isPopped ? { duration: 0.3 } : { duration: 6, repeat: Infinity, delay, ease: 'easeInOut' }}
              onClick={() => popBalloon(i)}
              className="absolute"
              style={{ left: `${left}%`, top: 0 }}
              disabled={isPopped}
            >
              {!isPopped && (
                <div className="relative">
                  <div className="w-12 h-16 rounded-full" style={{ background: colors[i % colors.length], boxShadow: `0 0 15px ${colors[i % colors.length]}55` }}>
                    <div className="w-3 h-4 rounded-full mx-auto" style={{ background: colors[i % colors.length], filter: 'brightness(1.3)', marginTop: 4 }} />
                  </div>
                  <div className="w-px h-4 bg-pink-100/20 mx-auto" />
                </div>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-panel rounded-2xl px-6 py-4 max-w-xs text-center absolute bottom-24"
          >
            <Heart className="text-neon-magenta mx-auto mb-2" size={20} />
            <p className="text-sm font-script text-lg text-pink-100/80">{showToast}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {allPopped && (
        <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onClick={onContinue} className="neon-btn px-6 py-3 text-sm">
          Play a Game 🎮
        </motion.button>
      )}
    </motion.div>
  )
}

/* ========== Game Stage ========== */
function GameStage({ journey, onContinue }: { journey: JourneyData; onContinue: () => void }) {
  if (journey.game_type === 'puzzle') {
    return <PuzzleGame key="puzzle" journey={journey} onContinue={onContinue} />
  }
  return <MemoryGame key="memory" onContinue={onContinue} />
}

function MemoryGame({ onContinue }: { onContinue: () => void }) {
  const symbols = ['🎀', '💖', '🎁', '✨', '🌟', '💝']
  const cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5)
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<Set<number>>(new Set())
  const [busy, setBusy] = useState(false)

  const flip = (i: number) => {
    if (busy || flipped.includes(i) || matched.has(i)) return
    const newFlipped = [...flipped, i]
    setFlipped(newFlipped)
    if (newFlipped.length === 2) {
      setBusy(true)
      const [a, b] = newFlipped
      if (cards[a] === cards[b]) {
        const newMatched = new Set(matched)
        newMatched.add(a)
        newMatched.add(b)
        setMatched(newMatched)
        setFlipped([])
        setBusy(false)
      } else {
        setTimeout(() => { setFlipped([]); setBusy(false) }, 900)
      }
    }
  }

  const won = matched.size === cards.length

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6">
      <h2 className="text-xl font-serif font-bold mb-2">Memory Match 🎴</h2>
      <p className="text-sm text-pink-100/40 mb-6">Match all {symbols.length} pairs</p>
      <div className="grid grid-cols-4 gap-3 max-w-sm">
        {cards.map((sym, i) => {
          const isFlipped = flipped.includes(i) || matched.has(i)
          return (
            <button
              key={i}
              onClick={() => flip(i)}
              className="w-16 h-20 rounded-xl flex items-center justify-center text-3xl transition-all"
              style={{
                background: isFlipped ? 'rgba(233,30,99,0.15)' : 'rgba(26,11,26,0.8)',
                border: isFlipped ? '2px solid #E91E63' : '1px solid rgba(233,30,99,0.15)',
                transform: isFlipped ? 'rotateY(180deg)' : 'none',
                opacity: matched.has(i) ? 0.5 : 1,
              }}
            >
              {isFlipped ? sym : '🎀'}
            </button>
          )
        })}
      </div>
      {won && (
        <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onClick={onContinue} className="neon-btn px-6 py-3 text-sm mt-6">
          One Last Surprise ✨
        </motion.button>
      )}
    </motion.div>
  )
}

function PuzzleGame({ journey, onContinue }: { journey: JourneyData; onContinue: () => void }) {
  // Simple 3x3 sliding puzzle with numbers
  const [tiles, setTiles] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 0].sort(() => Math.random() - 0.5))
  const [won, setWon] = useState(false)

  const move = (i: number) => {
    const zeroIdx = tiles.indexOf(0)
    const row = Math.floor(i / 3), col = i % 3
    const zRow = Math.floor(zeroIdx / 3), zCol = zeroIdx % 3
    if (Math.abs(row - zRow) + Math.abs(col - zCol) !== 1) return
    const newTiles = [...tiles]
    newTiles[zeroIdx] = tiles[i]
    newTiles[i] = 0
    setTiles(newTiles)
    if (newTiles.slice(0, 8).every((v, idx) => v === idx + 1)) setWon(true)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6">
      <h2 className="text-xl font-serif font-bold mb-2">Sliding Puzzle 🧩</h2>
      <p className="text-sm text-pink-100/40 mb-6">Arrange 1–8 in order</p>
      {journey.game_image && (
        <img src={journey.game_image} alt="" className="w-24 h-24 rounded-lg object-cover mb-4 opacity-60" />
      )}
      <div className="grid grid-cols-3 gap-2">
        {tiles.map((t, i) => (
          <button
            key={i}
            onClick={() => move(i)}
            className="w-20 h-20 rounded-xl flex items-center justify-center text-2xl font-bold transition-all"
            style={{
              background: t === 0 ? 'transparent' : 'rgba(233,30,99,0.15)',
              border: t === 0 ? '2px dashed rgba(233,30,99,0.1)' : '2px solid #E91E63',
              color: '#FF2882',
            }}
          >
            {t !== 0 && t}
          </button>
        ))}
      </div>
      {won && (
        <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onClick={onContinue} className="neon-btn px-6 py-3 text-sm mt-6">
          One Last Surprise ✨
        </motion.button>
      )}
    </motion.div>
  )
}

/* ========== Scratch Card Stage ========== */
function ScratchStage({ journey, onContinue }: { journey: JourneyData; onContinue: () => void }) {
  const [revealed, setRevealed] = useState(false)
  const canvasElementRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasElementRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    // Gold gradient
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    grad.addColorStop(0, '#FFD700')
    grad.addColorStop(0.5, '#D4AF37')
    grad.addColorStop(1, '#FFD700')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'rgba(0,0,0,0.3)'
    ctx.font = 'bold 16px Poppins'
    ctx.textAlign = 'center'
    ctx.fillText('Scratch here ✨', canvas.width / 2, canvas.height / 2)
  }, [])

  const scratch = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (revealed) return
    const canvas = canvasElementRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(x, y, 25, 0, Math.PI * 2)
    ctx.fill()

    // Check reveal percentage
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    let cleared = 0
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) cleared++
    }
    if (cleared / (canvas.width * canvas.height) > 0.4) {
      setRevealed(true)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6">
      <h2 className="text-xl font-serif font-bold mb-2">{journey.surprise_title || 'One last surprise'} ✨</h2>
      <p className="text-sm text-pink-100/40 mb-6">Scratch the card below</p>

      <div className="relative w-full max-w-xs h-48 rounded-2xl overflow-hidden">
        {/* Hidden content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 glass-panel">
          {journey.surprise_image && <img src={journey.surprise_image} alt="" className="w-full h-24 object-cover rounded-lg mb-2" />}
          <p className="text-sm text-pink-100/70 text-center font-script text-base">{journey.surprise_message}</p>
        </div>
        {/* Scratch overlay */}
        {!revealed && (
          <canvas
            ref={canvasElementRef}
            onPointerMove={scratch}
            onPointerDown={scratch}
            className="absolute inset-0 w-full h-full cursor-pointer touch-none"
          />
        )}
      </div>

      {revealed && (
        <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onClick={onContinue} className="neon-btn px-6 py-3 text-sm mt-6">
          Read My Letter ✉️
        </motion.button>
      )}
    </motion.div>
  )
}

/* ========== Letter Stage ========== */
function LetterStage({ journey, onDone }: { journey: JourneyData; onDone: () => void }) {
  const [opened, setOpened] = useState(false)
  const [text, setText] = useState('')

  useEffect(() => {
    if (!opened) return
    let i = 0
    const interval = setInterval(() => {
      if (i >= journey.letter_body.length) {
        clearInterval(interval)
        return
      }
      setText(journey.letter_body.slice(0, i + 1))
      i++
    }, 35)
    return () => clearInterval(interval)
  }, [opened, journey.letter_body])

  const theme = getThemeConfig(journey.theme)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6">
      {!opened ? (
        <motion.button
          onClick={() => setOpened(true)}
          whileHover={{ scale: 1.05 }}
          className="relative"
        >
          <div className="w-48 h-32 relative">
            {/* Envelope body */}
            <div className="absolute inset-0 rounded-lg" style={{ background: theme.accent, filter: 'brightness(0.8)' }} />
            {/* Flap */}
            <div className="absolute top-0 left-0 right-0 h-0 border-l-[96px] border-r-[96px] border-t-[50px] border-transparent" style={{ borderTopColor: theme.accent }} />
            {/* Heart stamp */}
            <div className="absolute bottom-3 right-3 w-8 h-8 rounded flex items-center justify-center" style={{ background: '#FFD700' }}>
              <Heart size={16} className="text-red-600" />
            </div>
          </div>
          <p className="text-center mt-3 text-sm text-pink-100/50 animate-pulse">Tap to open ✉️</p>
        </motion.button>
      ) : (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md max-h-[80vh] overflow-y-auto no-scrollbar"
        >
          <div className="bg-[#2A1530] rounded-2xl p-6 relative" style={{ border: '1px solid rgba(255,40,130,0.2)', backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, rgba(233,30,99,0.08) 27px, rgba(233,30,99,0.08) 28px)' }}>
            {/* Wax seal */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#E91E63', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
              <Heart size={16} className="text-white" />
            </div>
            <p className="font-script text-xl text-pink-100/80 mb-4 mt-2">{journey.letter_greeting}</p>
            <p className="font-script text-base text-pink-100/70 leading-loose typewriter-cursor">{text}</p>
            {text.length >= journey.letter_body.length && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-script text-lg text-pink-100/80 mt-6 text-right"
              >
                {journey.letter_signoff}
              </motion.p>
            )}
          </div>
          {text.length >= journey.letter_body.length && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={onDone}
              className="neon-btn px-6 py-3 text-sm mt-6 w-full"
            >
              Finish 💖
            </motion.button>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}

/* ========== Done Stage ========== */
function DoneStage({ journey }: { journey: JourneyData }) {
  const theme = getThemeConfig(journey.theme)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Heart className="text-neon-magenta" size={64} fill="currentColor" />
      </motion.div>
      <h2 className="text-2xl font-serif font-bold mt-6 mb-2" style={{ color: theme.accent }}>Made with love, for {journey.recipient_name}</h2>
      <p className="text-sm text-pink-100/50 max-w-xs">I hope this little journey made you smile. You deserve all the happiness in the world.</p>
      <button onClick={() => window.location.reload()} className="ghost-btn px-6 py-3 text-sm mt-8">
        Replay the journey
      </button>
    </motion.div>
  )
}
