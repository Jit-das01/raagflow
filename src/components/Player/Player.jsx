import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, Volume2, VolumeX, Heart, Music2 } from 'lucide-react'
import { usePlayerStore, useAppStore } from '../../store/usePlayerStore'

function formatTime(secs) {
  if (!secs || isNaN(secs)) return '0:00'
  return `${Math.floor(secs / 60)}:${Math.floor(secs % 60).toString().padStart(2, '0')}`
}

export default function Player() {
  const {
    currentTrack, isPlaying, volume, isMuted, shuffle, repeat,
    progress, duration, setIsPlaying, setVolume, toggleMute,
    toggleShuffle, cycleRepeat, setProgress, setDuration, playNext, playPrev,
  } = usePlayerStore()
  const { likedSongs, toggleLike } = useAppStore()
  const isLiked = currentTrack && likedSongs.some(t => t.id === currentTrack.id)

  // YouTube IFrame API
  const ytPlayerRef = useRef(null)
  const ytContainerRef = useRef(null)
  const tickRef = useRef(null)
  const [ytReady, setYtReady] = useState(!!window.YT?.Player)

  useEffect(() => {
    if (window.YT?.Player) { setYtReady(true); return }
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const s = document.createElement('script')
      s.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(s)
    }
    window.onYouTubeIframeAPIReady = () => setYtReady(true)
  }, [])

  useEffect(() => {
    if (!ytReady || !currentTrack?.youtubeId) return
    const div = ytContainerRef.current
    if (!div) return
    if (ytPlayerRef.current?.loadVideoById) {
      ytPlayerRef.current.loadVideoById(currentTrack.youtubeId)
      setProgress(0); setDuration(0)
      return
    }
    ytPlayerRef.current = new window.YT.Player(div, {
      height: '1', width: '1',
      videoId: currentTrack.youtubeId,
      playerVars: { autoplay: 1, controls: 0, playsinline: 1, fs: 0 },
      events: {
        onReady: (e) => { e.target.setVolume(isMuted ? 0 : Math.round(volume * 100)) },
        onStateChange: (e) => {
          if (e.data === window.YT.PlayerState.ENDED) playNext()
          if (e.data === window.YT.PlayerState.PLAYING) {
            setIsPlaying(true)
            setDuration(ytPlayerRef.current.getDuration?.() || 0)
          }
          if (e.data === window.YT.PlayerState.PAUSED) setIsPlaying(false)
        }
      }
    })
  }, [ytReady, currentTrack?.youtubeId])

  // Sync play/pause to YT player
  useEffect(() => {
    if (!ytPlayerRef.current?.playVideo || currentTrack?.source !== 'youtube') return
    if (isPlaying) ytPlayerRef.current.playVideo()
    else ytPlayerRef.current.pauseVideo()
  }, [isPlaying])

  // Sync volume
  useEffect(() => {
    if (!ytPlayerRef.current?.setVolume) return
    ytPlayerRef.current.setVolume(isMuted ? 0 : Math.round(volume * 100))
  }, [volume, isMuted])

  // Progress tick
  useEffect(() => {
    clearInterval(tickRef.current)
    if (!isPlaying) return
    tickRef.current = setInterval(() => {
      if (ytPlayerRef.current?.getCurrentTime) {
        const t = ytPlayerRef.current.getCurrentTime() || 0
        const d = ytPlayerRef.current.getDuration() || 0
        setProgress(t)
        if (d > 0) setDuration(d)
      }
    }, 500)
    return () => clearInterval(tickRef.current)
  }, [isPlaying, currentTrack?.id])

  const progressPct = duration > 0 ? Math.min((progress / duration) * 100, 100) : 0

  const handleSeekClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    const newTime = pct * (duration || 100)
    setProgress(newTime)
    ytPlayerRef.current?.seekTo?.(newTime, true)
  }

  return (
    <div className="border-t border-white/10 bg-[#181818] flex-shrink-0" style={{ height: '80px' }}>
      <div className="h-full flex items-center px-4 gap-4">

        {/* Track info */}
        <div className="flex items-center gap-3 min-w-0" style={{ width: '220px' }}>
          {currentTrack ? (
            <>
              <img src={currentTrack.thumbnail} alt="" className="w-12 h-12 rounded object-cover flex-shrink-0"
                onError={e => { e.target.src = `https://picsum.photos/seed/${currentTrack.id}/48` }} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white truncate">{currentTrack.title}</p>
                <p className="text-xs text-white/50 truncate">{currentTrack.artist}</p>
              </div>
              <button onClick={() => toggleLike(currentTrack)} className="flex-shrink-0">
                <Heart size={16} fill={isLiked ? '#1DB954' : 'none'} stroke={isLiked ? '#1DB954' : '#ffffff60'} />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2 text-white/20">
              <Music2 size={18} />
              <span className="text-xs">Pick a song</span>
            </div>
          )}
        </div>

        {/* CENTER CONTROLS */}
        <div className="flex-1 flex flex-col items-center gap-1" style={{ maxWidth: '480px', margin: '0 auto' }}>
          {/* Buttons row */}
          <div className="flex items-center gap-5">
            <button onClick={toggleShuffle} title="Shuffle"
              style={{ color: shuffle ? '#1DB954' : 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <Shuffle size={16} />
            </button>

            <button onClick={playPrev} title="Previous"
              style={{ color: 'rgba(255,255,255,0.8)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <SkipBack size={22} fill="currentColor" />
            </button>

            <button onClick={() => setIsPlaying(!isPlaying)} title={isPlaying ? 'Pause' : 'Play'}
              style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {isPlaying
                ? <Pause size={18} fill="#000" stroke="none" />
                : <Play size={18} fill="#000" stroke="none" style={{ marginLeft: '2px' }} />
              }
            </button>

            <button onClick={playNext} title="Next"
              style={{ color: 'rgba(255,255,255,0.8)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <SkipForward size={22} fill="currentColor" />
            </button>

            <button onClick={cycleRepeat} title="Repeat"
              style={{ color: repeat !== 'off' ? '#1DB954' : 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              {repeat === 'one' ? <Repeat1 size={16} /> : <Repeat size={16} />}
            </button>
          </div>

          {/* Seek bar */}
          <div className="w-full flex items-center gap-2">
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', width: '28px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
              {formatTime(progress)}
            </span>
            <div onClick={handleSeekClick}
              style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', cursor: 'pointer', position: 'relative' }}>
              <div style={{ width: `${progressPct}%`, height: '100%', background: '#fff', borderRadius: '2px', transition: 'width 0.3s linear' }} />
            </div>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', width: '28px', fontVariantNumeric: 'tabular-nums' }}>
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* VOLUME */}
        <div className="flex items-center gap-2" style={{ width: '120px' }}>
          <button onClick={toggleMute} style={{ color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}>
            {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', cursor: 'pointer', position: 'relative' }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
              setVolume(pct)
            }}>
            <div style={{ width: `${(isMuted ? 0 : volume) * 100}%`, height: '100%', background: '#fff', borderRadius: '2px' }} />
          </div>
        </div>

        {/* Hidden YT container */}
        <div ref={ytContainerRef} style={{ position: 'fixed', bottom: '-10px', right: '-10px', width: '1px', height: '1px', overflow: 'hidden', opacity: 0 }} />
      </div>
    </div>
  )
}
