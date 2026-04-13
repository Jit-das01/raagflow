import { useEffect, useRef, useCallback } from 'react'
import { Howl } from 'howler'
import { usePlayerStore } from '../store/usePlayerStore'

export function useAudioPlayer() {
  const howlRef = useRef(null)
  const {
    currentTrack, isPlaying, volume, isMuted,
    setIsPlaying, setProgress, setDuration, playNext
  } = usePlayerStore()

  const destroyHowl = useCallback(() => {
    if (howlRef.current) {
      howlRef.current.unload()
      howlRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!currentTrack) return
    destroyHowl()

    // YouTube tracks use the iframe embed — no Howl needed
    if (currentTrack.source === 'youtube') {
      setDuration(0)
      return
    }

    if (!currentTrack.streamUrl) return

    const howl = new Howl({
      src: [currentTrack.streamUrl],
      html5: true,
      volume: isMuted ? 0 : volume,
      onload: () => setDuration(howl.duration()),
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onend: () => playNext(),
      onloaderror: (_, err) => console.error('Howl load error:', err),
    })

    howlRef.current = howl
    howl.play()

    return () => destroyHowl()
  }, [currentTrack?.id])

  // Sync play/pause
  useEffect(() => {
    if (!howlRef.current) return
    if (isPlaying) howlRef.current.play()
    else howlRef.current.pause()
  }, [isPlaying])

  // Sync volume
  useEffect(() => {
    if (!howlRef.current) return
    howlRef.current.volume(isMuted ? 0 : volume)
  }, [volume, isMuted])

  // Progress ticker
  useEffect(() => {
    const interval = setInterval(() => {
      if (howlRef.current && isPlaying) {
        setProgress(howlRef.current.seek() || 0)
      }
    }, 500)
    return () => clearInterval(interval)
  }, [isPlaying])

  const seek = useCallback((seconds) => {
    if (howlRef.current) howlRef.current.seek(seconds)
  }, [])

  return { seek }
}
