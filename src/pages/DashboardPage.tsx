import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Gift, Plus, Trash2, Eye, Copy, Check, Loader2, QrCode, Calendar } from 'lucide-react'
import { JourneyData, themes } from '../lib/types'
import { useJourneyStore } from '../lib/store'

export default function DashboardPage() {
  const { loadAll, remove } = useJourneyStore()
  const [journeys, setJourneys] = useState<JourneyData[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [qrId, setQrId] = useState<string | null>(null)

  useEffect(() => {
    loadAll().then((data) => {
      setJourneys(data)
      setLoading(false)
    })
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this gift journey? The shared link will stop working immediately.')) return
    const ok = await remove(id)
    if (ok) setJourneys(journeys.filter((j) => j.id !== id))
  }

  const copyLink = (id: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/j/${id}`)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0F0510, #1D0B20)' }}>
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-neon-pink/10">
        <Link to="/" className="flex items-center gap-2">
          <Gift className="text-neon-pink" size={24} />
          <span className="font-serif font-bold text-lg">GiftBeat</span>
        </Link>
        <Link to="/create" className="neon-btn px-5 py-2.5 text-sm flex items-center gap-2">
          <Plus size={16} /> New Gift
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-6 md:px-12 py-10">
        <h1 className="text-3xl font-serif font-bold mb-2">My Gift Journeys</h1>
        <p className="text-sm text-pink-100/40 mb-8">All your created gifts in one place. Share, preview, or delete anytime.</p>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-neon-magenta" size={32} />
          </div>
        ) : journeys.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-2xl p-12 text-center"
          >
            <Gift className="mx-auto mb-4 text-neon-pink/40" size={48} />
            <h2 className="text-xl font-serif font-bold mb-2">No gifts yet</h2>
            <p className="text-sm text-pink-100/40 mb-6">Create your first interactive gift journey — it's free.</p>
            <Link to="/create" className="neon-btn px-6 py-3 text-sm inline-flex items-center gap-2">
              <Plus size={16} /> Create a Gift
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {journeys.map((j, i) => {
              const theme = themes[j.theme] || themes.classic
              return (
                <motion.div
                  key={j.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-panel rounded-2xl p-5 hover:glow-border transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-serif font-bold text-lg">{j.recipient_name || 'Untitled'}</h3>
                      <div className="flex items-center gap-2 text-xs text-pink-100/30 mt-1">
                        <Calendar size={12} />
                        {j.date_of_birth ? new Date(j.date_of_birth).toLocaleDateString() : 'No date'}
                        <span className="ml-2 px-2 py-0.5 rounded-full" style={{ background: theme.accentSoft, color: theme.accent }}>{theme.label}</span>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(j.id!)} className="p-2 text-pink-100/30 hover:text-red-400 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Preview thumbnail */}
                  <Link to={`/j/${j.id}`} className="block mb-4">
                    <div className="h-24 rounded-xl overflow-hidden relative" style={{ background: theme.bgGradient }}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Gift className="text-pink-100/30" size={32} />
                      </div>
                      {j.memories?.[0]?.url && (
                        <img src={j.memories[0].url} alt="" className="absolute right-2 top-2 w-12 h-12 rounded-lg object-cover opacity-70" />
                      )}
                    </div>
                  </Link>

                  <div className="flex items-center gap-2">
                    <Link to={`/j/${j.id}`} className="ghost-btn flex-1 py-2 text-sm flex items-center justify-center gap-1.5">
                      <Eye size={14} /> Open
                    </Link>
                    <button onClick={() => copyLink(j.id!)} className="ghost-btn py-2 px-3 text-sm flex items-center justify-center gap-1.5">
                      {copiedId === j.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                    <button onClick={() => setQrId(qrId === j.id ? null : j.id!)} className="ghost-btn py-2 px-3 text-sm flex items-center justify-center">
                      <QrCode size={14} />
                    </button>
                  </div>

                  {qrId === j.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 pt-3 border-t border-neon-pink/10 flex flex-col items-center"
                    >
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`${window.location.origin}/j/${j.id}`)}`} alt="QR Code" className="w-32 h-32 rounded-lg bg-white p-2" />
                      <p className="text-xs text-pink-100/40 mt-2">Print this QR or share the link</p>
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
