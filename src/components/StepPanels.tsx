import { useRef } from 'react'
import { Upload, X, Plus, Trash2, Music } from 'lucide-react'
import { JourneyData, themes, giftTypes, giftStyles, cakeFlavors, memoryLayouts, gameTypes, presetTracks, MemoryItem } from '../lib/types'
import { uploadAsset } from '../lib/supabase'

interface Props {
  journey: JourneyData
  update: <K extends keyof JourneyData>(key: K, value: JourneyData[K]) => void
}

export default function StepPanels({ journey, update }: Props) {
  return (
    <div className="space-y-5">
      {/* Render based on step handled by parent via switch — but we export individual panels */}
    </div>
  )
}

/* ---------- Step 1: Recipient ---------- */
export function StepRecipient({ journey, update }: Props) {
  return (
    <div className="space-y-4">
      <Field label="Recipient Name">
        <input className="dark-input" value={journey.recipient_name} onChange={(e) => update('recipient_name', e.target.value)} placeholder="Cutiepie" />
      </Field>
      <Field label="Date of Birth">
        <input type="date" className="dark-input" value={journey.date_of_birth} onChange={(e) => update('date_of_birth', e.target.value)} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Secret 4-digit PIN">
          <input className="dark-input" maxLength={4} value={journey.pin} onChange={(e) => update('pin', e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="1234" />
        </Field>
        <Field label="PIN Hint (optional)">
          <input className="dark-input" value={journey.pin_hint} onChange={(e) => update('pin_hint', e.target.value)} placeholder="Our anniversary month" />
        </Field>
      </div>
    </div>
  )
}

/* ---------- Step 2: Theme ---------- */
export function StepTheme({ journey, update }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Object.values(themes).map((t) => (
        <button
          key={t.key}
          onClick={() => update('theme', t.key)}
          className={`relative rounded-xl p-4 text-left transition-all ${journey.theme === t.key ? 'ring-2 ring-neon-pink' : 'ring-1 ring-neon-pink/10 hover:ring-neon-pink/30'}`}
          style={{ background: t.bgGradient }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 rounded-full" style={{ background: t.accent }} />
            <div className="w-4 h-4 rounded-full" style={{ background: t.particleColor }} />
          </div>
          <span className="text-sm font-medium">{t.label}</span>
          {journey.theme === t.key && <span className="absolute top-2 right-2 text-neon-magenta text-xs">✓</span>}
        </button>
      ))}
    </div>
  )
}

/* ---------- Step 3: Gift Wrap ---------- */
export function StepWrap({ journey, update }: Props) {
  return (
    <div className="space-y-5">
      <Field label="Gift Type">
        <div className="flex flex-wrap gap-2">
          {giftTypes.map((g) => (
            <button key={g.key} onClick={() => update('gift_type', g.key)} className={`chip ${journey.gift_type === g.key ? 'chip-active' : ''}`}>{g.label}</button>
          ))}
        </div>
      </Field>
      <Field label="Style">
        <div className="flex flex-wrap gap-2">
          {giftStyles.map((s) => (
            <button key={s.key} onClick={() => update('gift_style', s.key)} className={`chip ${journey.gift_style === s.key ? 'chip-active' : ''}`}>{s.label}</button>
          ))}
        </div>
      </Field>
    </div>
  )
}

/* ---------- Step 4: Cake ---------- */
export function StepCake({ journey, update }: Props) {
  return (
    <Field label="Cake Flavor">
      <div className="grid grid-cols-1 gap-2">
        {cakeFlavors.map((f) => (
          <button key={f.key} onClick={() => update('cake_flavor', f.key)} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${journey.cake_flavor === f.key ? 'ring-2 ring-neon-pink bg-neon-pink/5' : 'ring-1 ring-neon-pink/10 hover:ring-neon-pink/30'}`}>
            <div className="w-8 h-8 rounded-lg" style={{ background: f.color, border: `2px solid ${f.cream}` }} />
            <span className="text-sm font-medium">{f.label}</span>
            {journey.cake_flavor === f.key && <span className="ml-auto text-neon-magenta text-xs">✓</span>}
          </button>
        ))}
      </div>
    </Field>
  )
}

/* ---------- Step 5: Welcome ---------- */
export function StepWelcome({ journey, update }: Props) {
  return (
    <div className="space-y-4">
      <Field label="Headline">
        <input className="dark-input" value={journey.welcome_headline} onChange={(e) => update('welcome_headline', e.target.value)} placeholder="There's something special I want to tell you..." />
      </Field>
      <Field label="Subtitle">
        <input className="dark-input" value={journey.welcome_subtitle} onChange={(e) => update('welcome_subtitle', e.target.value)} placeholder="A little journey, just for you" />
      </Field>
    </div>
  )
}

/* ---------- Step 6: Music ---------- */
export function StepMusic({ journey, update }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    const url = await uploadAsset(file, 'audio')
    if (url) {
      update('music_track', url)
      update('music_name', file.name.replace(/\.[^.]+$/, ''))
    }
  }

  return (
    <div className="space-y-4">
      <Field label="Background Music">
        <div className="space-y-2">
          {presetTracks.map((t) => (
            <button key={t.key} onClick={() => { update('music_track', t.url); update('music_name', t.name) }} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${journey.music_track === t.url ? 'ring-2 ring-neon-pink bg-neon-pink/5' : 'ring-1 ring-neon-pink/10 hover:ring-neon-pink/30'}`}>
              <Music size={18} className={journey.music_track === t.url ? 'text-neon-magenta' : 'text-pink-100/40'} />
              <span className="text-sm">{t.name}</span>
              {journey.music_track === t.url && <span className="ml-auto text-neon-magenta text-xs">✓</span>}
            </button>
          ))}
        </div>
      </Field>
      <div className="pt-2">
        <button onClick={() => fileRef.current?.click()} className="ghost-btn w-full py-3 flex items-center justify-center gap-2 text-sm">
          <Upload size={16} /> Upload your own MP3
        </button>
        <input ref={fileRef} type="file" accept="audio/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f) }} />
        {journey.music_name && journey.music_track && !presetTracks.find((t) => t.url === journey.music_track) && (
          <p className="text-xs text-pink-100/40 mt-2 text-center">{journey.music_name} uploaded</p>
        )}
      </div>
    </div>
  )
}

/* ---------- Step 7: Memories ---------- */
export function StepMemories({ journey, update }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (files: FileList) => {
    const items: MemoryItem[] = [...journey.memories]
    for (const file of Array.from(files)) {
      const url = await uploadAsset(file, 'photos')
      if (url) items.push({ url, caption: '' })
    }
    update('memories', items)
  }

  const updateCaption = (i: number, caption: string) => {
    const items = [...journey.memories]
    items[i] = { ...items[i], caption }
    update('memories', items)
  }

  const removeMemory = (i: number) => {
    update('memories', journey.memories.filter((_, idx) => idx !== i))
  }

  return (
    <div className="space-y-4">
      <Field label="Layout">
        <div className="flex gap-2">
          {memoryLayouts.map((l) => (
            <button key={l.key} onClick={() => update('memory_layout', l.key)} className={`chip ${journey.memory_layout === l.key ? 'chip-active' : ''}`}>{l.label}</button>
          ))}
        </div>
      </Field>
      <button onClick={() => fileRef.current?.click()} className="ghost-btn w-full py-4 flex items-center justify-center gap-2 text-sm border-dashed">
        <Plus size={18} /> Upload Photos
      </button>
      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { const fs = e.target.files; if (fs) handleUpload(fs) }} />
      {journey.memories.length > 0 && (
        <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
          {journey.memories.map((m, i) => (
            <div key={i} className="flex items-start gap-3 p-2 rounded-lg glass-panel">
              <img src={m.url} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
              <input className="dark-input flex-1 !py-2 !text-sm" value={m.caption} onChange={(e) => updateCaption(i, e.target.value)} placeholder="Caption (e.g. Our first adventure 🌸)" />
              <button onClick={() => removeMemory(i)} className="p-1.5 text-pink-100/40 hover:text-red-400"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ---------- Step 8: Game ---------- */
export function StepGame({ journey, update }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    const url = await uploadAsset(file, 'games')
    if (url) update('game_image', url)
  }

  return (
    <div className="space-y-4">
      <Field label="Game Type">
        <div className="flex gap-2">
          {gameTypes.map((g) => (
            <button key={g.key} onClick={() => update('game_type', g.key)} className={`chip ${journey.game_type === g.key ? 'chip-active' : ''}`}>{g.label}</button>
          ))}
        </div>
      </Field>
      {journey.game_type === 'puzzle' && (
        <div>
          <button onClick={() => fileRef.current?.click()} className="ghost-btn w-full py-3 flex items-center justify-center gap-2 text-sm">
            <Upload size={16} /> Upload puzzle image
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f) }} />
          {journey.game_image && <img src={journey.game_image} alt="" className="mt-2 w-full h-24 object-cover rounded-lg" />}
        </div>
      )}
      <p className="text-xs text-pink-100/40">Memory Match uses bow icons — no upload needed.</p>
    </div>
  )
}

/* ---------- Step 9: Wishes ---------- */
export function StepWishes({ journey, update }: Props) {
  const addWish = () => update('wishes', [...journey.wishes, 'New wish'])
  const updateWish = (i: number, val: string) => { const w = [...journey.wishes]; w[i] = val; update('wishes', w) }
  const removeWish = (i: number) => update('wishes', journey.wishes.filter((_, idx) => idx !== i))

  return (
    <div className="space-y-3">
      {journey.wishes.map((w, i) => (
        <div key={i} className="flex items-start gap-2">
          <input className="dark-input flex-1" value={w} onChange={(e) => updateWish(i, e.target.value)} placeholder="You make my whole world brighter ✨" />
          <button onClick={() => removeWish(i)} className="p-2.5 text-pink-100/40 hover:text-red-400"><X size={16} /></button>
        </div>
      ))}
      <button onClick={addWish} className="ghost-btn w-full py-3 flex items-center justify-center gap-2 text-sm">
        <Plus size={16} /> Add a wish
      </button>
    </div>
  )
}

/* ---------- Step 10: Surprise ---------- */
export function StepSurprise({ journey, update }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const handleUpload = async (file: File) => {
    const url = await uploadAsset(file, 'surprise')
    if (url) update('surprise_image', url)
  }

  return (
    <div className="space-y-4">
      <Field label="Title">
        <input className="dark-input" value={journey.surprise_title} onChange={(e) => update('surprise_title', e.target.value)} placeholder="One last surprise" />
      </Field>
      <Field label="Message">
        <textarea className="dark-input min-h-[80px] resize-none" value={journey.surprise_message} onChange={(e) => update('surprise_message', e.target.value)} placeholder="Here is something I never told you..." />
      </Field>
      <Field label="Hidden Image">
        <button onClick={() => fileRef.current?.click()} className="ghost-btn w-full py-3 flex items-center justify-center gap-2 text-sm">
          <Upload size={16} /> Upload surprise image
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f) }} />
        {journey.surprise_image && <img src={journey.surprise_image} alt="" className="mt-2 w-full h-24 object-cover rounded-lg" />}
      </Field>
    </div>
  )
}

/* ---------- Step 11: Letter ---------- */
export function StepLetter({ journey, update }: Props) {
  return (
    <div className="space-y-4">
      <Field label="Greeting">
        <input className="dark-input" value={journey.letter_greeting} onChange={(e) => update('letter_greeting', e.target.value)} placeholder="My dearest," />
      </Field>
      <Field label="Body">
        <textarea className="dark-input min-h-[140px] resize-none" value={journey.letter_body} onChange={(e) => update('letter_body', e.target.value)} placeholder="Every moment with you has been a gift..." />
      </Field>
      <Field label="Sign-off">
        <input className="dark-input" value={journey.letter_signoff} onChange={(e) => update('letter_signoff', e.target.value)} placeholder="Forever yours, with all my heart 💖" />
      </Field>
    </div>
  )
}

/* ---------- Shared Field wrapper ---------- */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-neon-magenta mb-2">{label}</label>
      {children}
    </div>
  )
}
