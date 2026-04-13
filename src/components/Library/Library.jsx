import React from 'react'
import { Heart, Music2 } from 'lucide-react'
import { useAppStore } from '../../store/usePlayerStore'
import { TrackRow } from '../TrackCard'

export default function Library() {
  const { likedSongs, activePage } = useAppStore()

  if (activePage === 'liked') {
    return (
      <div className="h-full overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-b from-purple-800 to-surface-base px-6 pt-8 pb-6">
          <div className="w-40 h-40 bg-gradient-to-br from-purple-700 to-brand rounded-lg flex items-center justify-center mb-4 shadow-2xl">
            <Heart size={64} fill="white" stroke="none" />
          </div>
          <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-1">Playlist</p>
          <h1 className="text-4xl font-bold mb-2">Liked Songs</h1>
          <p className="text-sm text-white/60">{likedSongs.length} songs</p>
        </div>
        <div className="px-2 py-4">
          {likedSongs.length === 0 ? (
            <div className="text-center py-16">
              <Heart size={48} className="mx-auto text-white/10 mb-3" />
              <p className="text-white/40 text-sm">Songs you like will appear here</p>
            </div>
          ) : (
            likedSongs.map((track, i) => (
              <TrackRow key={track.id} track={track} queue={likedSongs} index={i} showIndex />
            ))
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto px-6 py-6">
      <h1 className="text-2xl font-bold mb-6">Your Library</h1>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-purple-800 to-brand rounded-lg p-4 flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => useAppStore.getState().setActivePage('liked')}>
          <Heart size={28} fill="white" stroke="none" />
          <div>
            <p className="font-semibold">Liked Songs</p>
            <p className="text-xs text-white/70">{likedSongs.length} songs</p>
          </div>
        </div>
        <div className="bg-surface-elevated rounded-lg p-4 flex items-center gap-3 cursor-pointer hover:bg-surface-overlay transition-colors">
          <Music2 size={28} className="text-white/40" />
          <div>
            <p className="font-semibold text-white/60">Create Playlist</p>
            <p className="text-xs text-white/40">Coming soon</p>
          </div>
        </div>
      </div>
    </div>
  )
}
