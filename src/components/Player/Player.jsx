import React, { useCallback } from 'react'
import {
  Play, Pause, SkipBack, SkipForward, Shuffle,
  Repeat, Repeat1, Volume2, VolumeX, Heart, ChevronUp
} from 'lucide-react'
import { usePlayerStore, useAppStore } from '../../store/usePlayerStore'
import { useAudioPlayer } from '../../hooks/useAudioPlayer'

function formatTime(secs) {
  if (!secs || isNaN(secs)) return '0:00'
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function Player() {
  const {
    currentTrack, isPlaying, volume, isMuted, shuffle, repeat,
    progress, duration, isPlayerExpanded,
    setIsPlaying, setVolume, toggleMute, toggleShuffle,
    cycleRepeat, setProgress, toggleExpanded, playNext, playPrev,
  } = usePlayerStore()

  const { likedSongs, toggleLike } = useAppStore()
  const { seek } = useAudioPlayer()

  const isLiked = currentTrack && likedSongs.some(t => t.id === currentTrack.id)

  const handleSeek = useCallback((e) => {
    const val = parseFloat(e.target.value)
    setProgress(val)
    seek(val)
  }, [seek])

  if (!currentTrack) return (
    <div className="h-20 border-t border-white/10 bg-surface-raised flex items-center justify-center">
      <p className="text-sm text-white/30">Nothing playing — search for a track to start</p>
    </div>
  )

  return (
    <div className={`border-t border-white/10 bg-surface-raised transition-all duration-300 ${isPlayerExpanded ? 'h-screen' : 'h-20'}`}>
      {/* Compact bar */}
      <div className="h-20 flex items-center px-4 gap-4">
        {/* Track info */}
        <div className="flex items-center gap-3 w-64 min-w-0 cursor-pointer" onClick={toggleExpanded}>
          <img
            src={currentTrack.thumbnail || '/placeholder.jpg'}
            alt={currentTrack.title}
            className="w-12 h-12 rounded object-cover flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="text-sm font-medium line-clamp-1">{currentTrack.title}</p>
            <p className="text-xs text-white/50 line-clamp-1">{currentTrack.artist}</p>
          </div>
          <ChevronUp size={14} className={`text-white/40 flex-shrink-0 transition-transform ${isPlayerExpanded ? 'rotate-180' : ''}`} />
        </div>

        {/* Like button */}
        <button onClick={() => toggleLike(currentTrack)} className="text-white/50 hover:text-white transition-colors flex-shrink-0">
          <Heart size={16} fill={isLiked ? '#1DB954' : 'none'} stroke={isLiked ? '#1DB954' : 'currentColor'} />
        </button>

        {/* Center controls */}
        <div className="flex-1 flex flex-col items-center gap-1 max-w-lg mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={toggleShuffle} className={`transition-colors ${shuffle ? 'text-brand' : 'text-white/50 hover:text-white'}`}>
              <Shuffle size={16} />
            </button>
            <button onClick={playPrev} className="text-white/70 hover:text-white transition-colors">
              <SkipBack size={20} fill="currentColor" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying
                ? <Pause size={18} fill="#000" stroke="none" />
                : <Play size={18} fill="#000" stroke="none" className="ml-0.5" />
              }
            </button>
            <button onClick={playNext} className="text-white/70 hover:text-white transition-colors">
              <SkipForward size={20} fill="currentColor" />
            </button>
            <button onClick={cycleRepeat} className={`transition-colors ${repeat !== 'off' ? 'text-brand' : 'text-white/50 hover:text-white'}`}>
              {repeat === 'one' ? <Repeat1 size={16} /> : <Repeat size={16} />}
            </button>
          </div>

          {/* Seek bar */}
          <div className="w-full flex items-center gap-2">
            <span className="text-xs text-white/40 w-8 text-right">{formatTime(progress)}</span>
            <input
              type="range" min="0" max={duration || 100} value={progress}
              onChange={handleSeek}
              className="flex-1 accent-white"
              style={{ background: `linear-gradient(to right, #fff ${(progress / (duration || 1)) * 100}%, #444 0)` }}
            />
            <span className="text-xs text-white/40 w-8">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 w-36">
          <button onClick={toggleMute} className="text-white/50 hover:text-white transition-colors">
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input
            type="range" min="0" max="1" step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1"
            style={{ background: `linear-gradient(to right, #fff ${(isMuted ? 0 : volume) * 100}%, #444 0)` }}
          />
        </div>

        {/* Source badge */}
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
          currentTrack.source === 'youtube' ? 'bg-red-900/50 text-red-300' :
          currentTrack.source === 'soundcloud' ? 'bg-orange-900/50 text-orange-300' :
          'bg-green-900/50 text-green-300'
        }`}>
          {currentTrack.source === 'youtube' ? 'YT' : currentTrack.source === 'soundcloud' ? 'SC' : 'JM'}
        </span>
      </div>

      {/* YouTube iframe (hidden but functional) */}
      {currentTrack.source === 'youtube' && currentTrack.youtubeId && (
        <div className="hidden">
          <iframe
            id="yt-player"
            src={`https://www.youtube.com/embed/${currentTrack.youtubeId}?autoplay=1&enablejsapi=1`}
            allow="autoplay"
            title="YouTube player"
          />
        </div>
      )}
    </div>
  )
}
