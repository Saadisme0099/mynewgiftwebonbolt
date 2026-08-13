import { useEffect, useRef, useState, useCallback } from 'react'

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentUrl, setCurrentUrl] = useState<string>('')

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const load = useCallback((url: string, autoplay = false) => {
    if (!url) {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      setIsPlaying(false)
      setCurrentUrl('')
      return
    }
    if (audioRef.current) {
      audioRef.current.pause()
    }
    const audio = new Audio(url)
    audio.loop = true
    audio.volume = 0.4
    audioRef.current = audio
    setCurrentUrl(url)
    if (autoplay) {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
    }
  }, [])

  const toggle = useCallback(() => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {})
    }
  }, [isPlaying])

  return { isPlaying, currentUrl, load, toggle }
}
