import React from 'react'
import { Play, Heart, MoreHorizontal } from 'lucide-react'
import { usePlayerStore, useAppStore } from '../../store/usePlayerStore'

export function TrackCard({ track, queue = [], index = 0 }) {
  const { setCurrentTrack, currentTrack, isPlaying } = usePlayerStore()
  const { toggleLike, likedSongs, addRecentlyPlayed } = useAppStore()

  const isActive = currentTrack?.id === track.id
  const isLiked = likedSongs.some(t => t.id === track.id)

  function play() {
    addRecentlyPlayed(track)
    setCurrentTrack(track, queue.length ? queue : [track], index)
  }

  return (
    <div
      className={`group relative bg-surface-raised rounded-lg p-3 cursor-pointer hover:bg-surface-elevated transition-colors ${isActive ? 'ring-1 ring-brand/40' : ''}`}
      onClick={play}
    >
      <div className="relative mb-3">
        <img
          src={track.thumbnail || '/placeholder.jpg'}
          alt={track.title}
          className="w-full aspect-square object-cover rounded-md"
          onError={(e) => { e.target.src = `https://picsum.photos/seed/${track.id}/200` }}
        />
        <button className="absolute bottom-2 right-2 w-10 h-10 bg-brand rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-lg">
          <Play size={18} fill="black" stroke="none" className="ml-0.5" />
        </button>
        {isActive && isPlaying && (
          <div className="absolute bottom-2 right-2 w-10 h-10 bg-brand rounded-full flex items-center justify-center shadow-lg">
            <div className="flex gap-0.5 items-end h-4">
              {[1,2,3].map(i => (
                <div key={i} className="w-1 bg-black rounded-full animate-bounce" style={{
                  height: `${[40, 70, 55][i-1]}%`, animationDelay: `${i * 0.1}s`
                }} />
              ))}
            </div>
          </div>
        )}
        {/* Source badge */}
        <span className={`absolute top-2 left-2 text-[9px] px-1.5 py-0.5 rounded font-semibold ${
          track.source === 'youtube' ? 'bg-red-600 text-white' :
          track.source === 'soundcloud' ? 'bg-orange-500 text-white' :
          'bg-green-600 text-white'
        }`}>
          {track.source === 'youtube' ? 'YT' : track.source === 'soundcloud' ? 'SC' : 'CC'}
        </span>
      </div>
      <p className={`text-sm font-medium line-clamp-1 ${isActive ? 'text-brand' : ''}`}>{track.title}</p>
      <p className="text-xs text-white/50 line-clamp-1 mt-0.5">{track.artist}</p>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-white/30 capitalize">{track.language}</span>
        <button
          onClick={(e) => { e.stopPropagation(); toggleLike(track) }}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart size={14} fill={isLiked ? '#1DB954' : 'none'} stroke={isLiked ? '#1DB954' : '#ffffff80'} />
        </button>
      </div>
    </div>
  )
}

export function TrackRow({ track, queue = [], index = 0, showIndex = false }) {
  const { setCurrentTrack, currentTrack, isPlaying } = usePlayerStore()
  const { toggleLike, likedSongs, addRecentlyPlayed } = useAppStore()

  const isActive = currentTrack?.id === track.id
  const isLiked = likedSongs.some(t => t.id === track.id)

  function play() {
    addRecentlyPlayed(track)
    setCurrentTrack(track, queue.length ? queue : [track], index)
  }

  function formatDur(s) {
    if (!s) return '--'
    return `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`
  }

  return (
    <div
      className={`group flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer hover:bg-surface-elevated transition-colors ${isActive ? 'bg-surface-elevated' : ''}`}
      onClick={play}
    >
      {showIndex && (
        <span className={`w-5 text-sm text-center flex-shrink-0 ${isActive ? 'text-brand' : 'text-white/40 group-hover:hidden'}`}>
          {isActive && isPlaying ? '▶' : index + 1}
        </span>
      )}
      <img src={track.thumbnail || '/placeholder.jpg'} alt="" className="w-10 h-10 rounded object-cover flex-shrink-0"
        onError={(e) => { e.target.src = `https://picsum.photos/seed/${track.id}/40` }} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium line-clamp-1 ${isActive ? 'text-brand' : ''}`}>{track.title}</p>
        <p className="text-xs text-white/50 line-clamp-1">{track.artist}</p>
      </div>
      <span className="text-xs text-white/30 capitalize hidden sm:block">{track.language}</span>
      <button onClick={(e) => { e.stopPropagation(); toggleLike(track) }}
        className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <Heart size={14} fill={isLiked ? '#1DB954' : 'none'} stroke={isLiked ? '#1DB954' : '#ffffff80'} />
      </button>
      <span className="text-xs text-white/40 w-10 text-right flex-shrink-0">{formatDur(track.duration)}</span>
    </div>
  )
}
