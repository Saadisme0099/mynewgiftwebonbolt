import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, SkipForward, Eye, Smartphone, Monitor, RotateCcw, Sparkles, Gift, Save, Loader2, QrCode, Copy } from 'lucide-react'
import { useJourneyStore } from '../lib/store'
import { stepDefs, totalSteps, stepProgress } from '../lib/steps'
import LivePreview from '../components/LivePreview'
import {
  StepRecipient, StepTheme, StepWrap, StepCake, StepWelcome,
  StepMusic, StepMemories, StepGame, StepWishes, StepSurprise, StepLetter,
} from '../components/StepPanels'

export default function CreatePage() {
  const navigate = useNavigate()
  const { journey, update, save, reset, isSaving, savedId } = useJourneyStore()
  const [step, setStep] = useState(1)
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile')
  const [showComplete, setShowComplete] = useState(false)

  const currentStep = stepDefs.find((s) => s.n === step)!
  const progress = stepProgress(step)

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1)
    else handleSave()
  }
  const handleBack = () => { if (step > 1) setStep(step - 1) }
  const handleSkip = () => { if (step < totalSteps) setStep(step + 1) }

  const handleSave = async () => {
    const id = await save()
    if (id) setShowComplete(true)
  }

  const handleResetPreview = () => { setDevice('mobile') }

  const renderStep = () => {
    const props = { journey, update }
    switch (currentStep.key) {
      case 'recipient': return <StepRecipient {...props} />
      case 'theme': return <StepTheme {...props} />
      case 'wrap': return <StepWrap {...props} />
      case 'cake': return <StepCake {...props} />
      case 'welcome': return <StepWelcome {...props} />
      case 'music': return <StepMusic {...props} />
      case 'memories': return <StepMemories {...props} />
      case 'game': return <StepGame {...props} />
      case 'wishes': return <StepWishes {...props} />
      case 'surprise': return <StepSurprise {...props} />
      case 'letter': return <StepLetter {...props} />
      default: return null
    }
  }

  if (showComplete && savedId) {
    return <CompleteScreen journeyId={savedId} onNew={() => { reset(); setStep(1); setShowComplete(false) }} onView={() => navigate(`/j/${savedId}`)} />
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #0F0510, #1D0B20)' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 md:px-8 py-3 border-b border-neon-pink/10 flex-shrink-0">
        <Link to="/" className="flex items-center gap-2 text-pink-100/60 hover:text-neon-magenta transition-colors">
          <Gift size={20} className="text-neon-pink" />
          <span className="font-serif font-bold hidden sm:block">GiftBeat</span>
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={handleSave} disabled={isSaving} className="neon-btn px-4 py-2 text-sm flex items-center gap-2">
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save & Share'}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Left: Control Panel */}
        <div className="flex flex-col w-full lg:w-[480px] lg:flex-shrink-0 h-[55vh] lg:h-auto lg:min-h-0 border-r border-neon-pink/10">
          {/* Step header */}
          <div className="px-6 pt-6 pb-4 flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-pink-100/40">Step {step} / {totalSteps} · {progress}%</span>
              <span className="text-xs text-pink-100/30">{currentStep.key}</span>
            </div>
            <div className="h-1.5 rounded-full bg-neon-pink/10 overflow-hidden mb-4">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #E91E63, #FF2882)' }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <h2 className="text-xl font-serif font-bold">{currentStep.title}</h2>
            <p className="text-sm text-pink-100/40 mt-0.5">{currentStep.subtitle}</p>
          </div>

          {/* Scrollable input area */}
          <div className="flex-1 overflow-y-auto px-6 pb-4 no-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep.key}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer navigation */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-neon-pink/10 flex-shrink-0 gap-2">
            <button onClick={handleBack} disabled={step === 1} className="ghost-btn px-4 py-2.5 text-sm flex items-center gap-1.5 disabled:opacity-30">
              <ArrowLeft size={16} /> Back
            </button>
            <button onClick={handleSkip} disabled={step === totalSteps} className="ghost-btn px-3 py-2.5 text-sm flex items-center gap-1.5 disabled:opacity-30">
              <SkipForward size={14} /> Skip
            </button>
            <button onClick={handleNext} className="neon-btn px-5 py-2.5 text-sm flex items-center gap-1.5">
              {step === totalSteps ? (<><Check size={16} /> Finish</>) : (<>Next <ArrowRight size={16} /></>)}
            </button>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-8 min-h-0 relative">
          {/* Preview controls */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex rounded-lg overflow-hidden border border-neon-pink/15">
              <button onClick={() => setDevice('mobile')} className={`px-3 py-1.5 text-xs flex items-center gap-1.5 transition-colors ${device === 'mobile' ? 'bg-neon-pink/20 text-neon-magenta' : 'text-pink-100/40 hover:text-pink-100/70'}`}>
                <Smartphone size={14} /> Mobile
              </button>
              <button onClick={() => setDevice('desktop')} className={`px-3 py-1.5 text-xs flex items-center gap-1.5 transition-colors ${device === 'desktop' ? 'bg-neon-pink/20 text-neon-magenta' : 'text-pink-100/40 hover:text-pink-100/70'}`}>
                <Monitor size={14} /> Desktop
              </button>
            </div>
            <button onClick={handleResetPreview} className="ghost-btn px-3 py-1.5 text-xs flex items-center gap-1.5">
              <RotateCcw size={12} /> Reset
            </button>
          </div>

          {/* Device frame */}
          <div className="flex-1 flex items-center justify-center w-full min-h-0">
            {device === 'mobile' ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative"
                style={{ width: '320px', maxWidth: '100%' }}
              >
                {/* Phone frame */}
                <div className="relative rounded-[2.5rem] p-3 bg-black border-[3px] border-gray-800 shadow-2xl" style={{ aspectRatio: '393/852', maxHeight: '70vh' }}>
                  {/* Notch */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-b-2xl z-20" />
                  <div className="w-full h-full rounded-[2rem] overflow-hidden relative bg-black">
                    <LivePreview journey={journey} stepKey={currentStep.key} device="mobile" />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-3xl"
              >
                <div className="rounded-xl border-2 border-gray-800 bg-black shadow-2xl overflow-hidden" style={{ aspectRatio: '16/10' }}>
                  <LivePreview journey={journey} stepKey={currentStep.key} device="desktop" />
                </div>
              </motion.div>
            )}
          </div>

          <p className="text-xs text-pink-100/30 mt-4 flex items-center gap-1.5">
            <Eye size={12} /> Live preview — updates as you type
          </p>
        </div>
      </div>
    </div>
  )
}

function CompleteScreen({ journeyId, onNew, onView }: { journeyId: string; onNew: () => void; onView: () => void }) {
  const [copied, setCopied] = useState(false)
  const shareUrl = `${window.location.origin}/j/${journeyId}`

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'linear-gradient(135deg, #0F0510, #1D0B20)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel rounded-3xl p-8 md:p-12 max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-16 h-16 rounded-full bg-neon-pink/15 flex items-center justify-center mx-auto mb-6"
        >
          <Check className="text-neon-magenta" size={32} />
        </motion.div>
        <h2 className="text-2xl font-serif font-bold mb-2">Your gift is ready!</h2>
        <p className="text-sm text-pink-100/50 mb-6">Share this private link with them. They'll enter the PIN to unlock it.</p>

        <div className="flex items-center gap-2 p-3 rounded-xl glass-panel mb-4">
          <input readOnly value={shareUrl} className="flex-1 bg-transparent text-sm text-pink-100/70 outline-none" />
          <button onClick={copyLink} className="text-neon-magenta hover:text-neon-pink transition-colors">
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          <Link to={`/j/${journeyId}`} className="neon-btn w-full py-3 flex items-center justify-center gap-2 text-sm">
            <Eye size={16} /> Preview the Journey
          </Link>
          <div className="flex items-center justify-center gap-3 text-sm text-pink-100/40">
            <QrCode size={16} /> QR code available on the journey page
          </div>
        </div>

        <button onClick={onNew} className="ghost-btn w-full py-3 text-sm flex items-center justify-center gap-2">
          <Sparkles size={16} /> Create Another Gift
        </button>
      </motion.div>
    </div>
  )
}
