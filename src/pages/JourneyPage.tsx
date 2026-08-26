import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Loader2, Gift, AlertCircle } from 'lucide-react'
import { useJourneyStore } from '../lib/store'
import { useAudioPlayer } from '../lib/useAudio'
import JourneyExperience from '../components/JourneyExperience'

export default function JourneyPage() {
  const { id } = useParams<{ id: string }>()
  const { journey, load } = useJourneyStore()
  const audio = useAudioPlayer()
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    load(id).then((ok) => {
      if (!ok) setNotFound(true)
      setLoading(false)
    })
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0F0510, #1D0B20)' }}>
        <div className="text-center">
          <Loader2 className="animate-spin text-neon-magenta mx-auto mb-4" size={40} />
          <p className="text-sm text-pink-100/40">Loading your gift...</p>
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'linear-gradient(135deg, #0F0510, #1D0B20)' }}>
        <div className="glass-panel rounded-2xl p-8 text-center max-w-sm">
          <AlertCircle className="text-neon-magenta mx-auto mb-4" size={40} />
          <h2 className="text-xl font-serif font-bold mb-2">Gift not found</h2>
          <p className="text-sm text-pink-100/50 mb-6">This link may be invalid or the gift has been removed.</p>
          <Link to="/" className="neon-btn px-6 py-3 text-sm inline-block">Go Home</Link>
        </div>
      </div>
    )
  }

  return <JourneyExperience journey={journey} audio={audio} />
}
