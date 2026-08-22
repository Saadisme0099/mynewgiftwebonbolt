import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Gift, Sparkles, Cake, Heart, Gamepad2, PenLine, Music,
  Image, Lock, QrCode, Eye, Share2, ArrowRight, Star,
} from 'lucide-react'
import ParticleBackground from '../components/ParticleBackground'

const occasions = [
  { name: 'Birthday', icon: Cake, desc: 'Balloon pops, interactive cake cuts, and music player cards', live: true },
  { name: 'Anniversary', icon: Heart, desc: 'Romantic journeys with champagne toasts and love letters', live: true },
  { name: 'Proposal', icon: Sparkles, desc: 'Open a velvet ring box, unfold a jar of reasons', live: true },
  { name: 'Promise', icon: PenLine, desc: 'Personalized promises and elegant digital cards', live: false },
  { name: 'Apology', icon: Heart, desc: 'Sincere apologies with cute interactive unboxings', live: false },
  { name: 'Congratulations', icon: Star, desc: 'Celebrate achievements with virtual confetti', live: false },
  { name: "Valentine's Day", icon: Heart, desc: 'Love letters and date countdowns', live: false },
  { name: 'Festival Wishes', icon: Sparkles, desc: 'Interactive greetings for Diwali, Eid, Christmas', live: false },
  { name: 'Friendship', icon: Heart, desc: 'Playful, personal keepsakes for best friends', live: false },
  { name: 'Love', icon: Heart, desc: 'An interactive, heartfelt love journey', live: false },
]

const features = [
  { icon: Gift, title: '3D Gift Box', desc: 'A realistic gift they tap to open' },
  { icon: Lock, title: 'Secret PIN', desc: 'Lock it behind a private code' },
  { icon: Image, title: 'Photo Memories', desc: 'Your favourite moments together' },
  { icon: Cake, title: 'A Festive Centerpiece', desc: 'A birthday cake to blow out' },
  { icon: Gamepad2, title: 'A Playful Game', desc: 'A puzzle or match they solve to continue' },
  { icon: PenLine, title: 'Handwritten Letter', desc: 'Types itself out, word by word' },
]

const steps = [
  { icon: Sparkles, title: 'Personalize', desc: 'Add their name, your photos, wishes and a heartfelt letter — with a live preview the whole time.' },
  { icon: Eye, title: 'Preview', desc: 'Play the entire journey exactly as they will see it. All free, no payment needed.' },
  { icon: Share2, title: 'Share the Link', desc: 'Get a private link and QR code instantly. Send it on WhatsApp or print the QR on a card.' },
]

const faqs = [
  { q: 'How do they open it?', a: 'They get a private link. It opens the interactive journey in any browser, no app needed. If you set a PIN, they enter the 4-digit code to unlock it.' },
  { q: 'Do they need an app?', a: 'No. It works in any modern browser on phone, tablet or desktop. It looks best on a phone.' },
  { q: 'Is it private?', a: 'Your journey lives at a private, unguessable link — it\'s never listed or shared. Only the people you send the link and PIN to can open it.' },
  { q: 'What\'s the PIN for?', a: 'It\'s a playful lock screen — the recipient enters the 4-digit PIN you chose to "unlock" their surprise. Remember to tell them the PIN.' },
  { q: 'Can I preview before sharing?', a: 'Yes — you can play the entire journey for free before you decide. No payment is ever required.' },
  { q: 'Can I edit after sharing?', a: 'Yes. Open your dashboard, hit Edit on a journey, make your changes and save — the same link updates instantly.' },
  { q: 'Can I delete a journey?', a: 'Yes. You can permanently delete a journey (and its uploaded photos) from your dashboard at any time — the shared link stops working immediately.' },
]

export default function LandingPage() {
  return (
    <div className="relative min-h-screen" style={{ background: 'linear-gradient(180deg, #0F0510 0%, #1D0B20 50%, #0F0510 100%)' }}>
      <ParticleBackground color="#FF2882" density={35} shape="heart" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5">
        <div className="flex items-center gap-2">
          <Gift className="text-neon-pink" size={28} />
          <span className="text-xl font-serif font-bold">GiftBeat</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="ghost-btn px-4 py-2 text-sm hidden sm:block">My Journeys</Link>
          <Link to="/create" className="neon-btn px-5 py-2.5 text-sm">Start Building</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 px-6 md:px-12 pt-12 pb-20 max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-sm text-neon-magenta mb-6">
            <Sparkles size={14} /> Interactive gift journeys, made with love
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-5">
            Build a <em className="text-neon-magenta not-italic" style={{ fontStyle: 'italic' }}>magical</em> birthday & anniversary<br className="hidden md:block" /> gift website in minutes
          </h1>
          <p className="text-base md:text-lg text-pink-100/60 max-w-2xl mx-auto mb-8 leading-relaxed">
            A guided, interactive journey for birthdays, anniversaries and more — a 3D gift to unlock,
            a secret PIN, photo memories, a playful game and a handwritten letter. Personalize it,
            preview it live, and share one link. Completely free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/create" className="neon-btn px-8 py-3.5 text-base flex items-center gap-2">
              Build a Gift <ArrowRight size={18} />
            </Link>
            <Link to="/dashboard" className="ghost-btn px-8 py-3.5 text-base">View My Journeys</Link>
          </div>
        </motion.div>
      </section>

      {/* Occasions */}
      <section className="relative z-10 px-6 md:px-12 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-serif font-bold text-center mb-3">Made for every occasion</h2>
        <p className="text-center text-pink-100/50 mb-12 max-w-xl mx-auto">
          Birthday, anniversary and proposal are live today. More occasions are on the way.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {occasions.map((occ, i) => (
            <motion.div
              key={occ.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel rounded-2xl p-5 text-center hover:border-neon-pink/40 transition-all cursor-pointer group"
              onClick={() => occ.live && (window.location.href = '/create')}
            >
              <occ.icon className="mx-auto mb-3 text-neon-magenta group-hover:scale-110 transition-transform" size={32} />
              <h3 className="font-semibold text-sm mb-1">{occ.name}</h3>
              <p className="text-xs text-pink-100/40 leading-snug">{occ.desc}</p>
              {occ.live ? (
                <span className="inline-block mt-2 text-xs text-emerald-400">Live</span>
              ) : (
                <span className="inline-block mt-2 text-xs text-pink-100/30">Soon</span>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 md:px-12 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-serif font-bold text-center mb-3">Everything inside the journey</h2>
        <p className="text-center text-pink-100/50 mb-12 max-w-xl mx-auto">
          A series of delightful, interactive moments — all personalized by you.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-panel rounded-2xl p-6 flex items-start gap-4 hover:glow-border transition-all"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(233,30,99,0.12)' }}>
                <f.icon className="text-neon-magenta" size={24} />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-pink-100/50">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 px-6 md:px-12 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-serif font-bold text-center mb-3">How it works</h2>
        <p className="text-center text-pink-100/50 mb-12">Three simple steps — no design or tech skills needed.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative glass-panel rounded-2xl p-8 text-center"
            >
              <div className="text-5xl font-serif text-neon-pink/20 absolute top-4 right-6">{i + 1}</div>
              <s.icon className="mx-auto mb-4 text-neon-magenta" size={36} />
              <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
              <p className="text-sm text-pink-100/50 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Free banner */}
      <section className="relative z-10 px-6 md:px-12 py-16 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-panel rounded-3xl p-10 md:p-14 glow-border"
        >
          <h2 className="text-3xl font-serif font-bold mb-4">Always free, always magical</h2>
          <p className="text-pink-100/60 mb-6 max-w-xl mx-auto">
            Build and preview the whole thing for free. Share it whenever you're ready — no payment, no subscription, no catch.
          </p>
          <Link to="/create" className="neon-btn px-8 py-3.5 text-base inline-flex items-center gap-2">
            Start Building <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="relative z-10 px-6 md:px-12 py-16 max-w-3xl mx-auto">
        <h2 className="text-3xl font-serif font-bold text-center mb-12">Frequently asked questions</h2>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <details key={i} className="glass-panel rounded-xl p-5 group">
              <summary className="font-medium cursor-pointer list-none flex items-center justify-between">
                {f.q}
                <span className="text-neon-pink transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-pink-100/50 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 md:px-12 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Ready to make their day unforgettable?</h2>
        <p className="text-pink-100/50 mb-8">Build it now, preview it free, and share in minutes.</p>
        <Link to="/create" className="neon-btn px-10 py-4 text-lg inline-flex items-center gap-2">
          Create a Gift <Gift size={20} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 md:px-12 py-10 border-t border-neon-pink/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Gift className="text-neon-pink" size={22} />
            <span className="font-serif font-bold">GiftBeat</span>
          </div>
          <p className="text-sm text-pink-100/30">Personalized, interactive gift surprises — made with love, shared in one link.</p>
          <div className="flex gap-4">
            <Link to="/dashboard" className="text-sm text-pink-100/40 hover:text-neon-magenta transition-colors">Dashboard</Link>
            <Link to="/create" className="text-sm text-pink-100/40 hover:text-neon-magenta transition-colors">Create</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
