import React from 'react'
import { Home, Search, Library, Heart, Clock, Music2, Plus } from 'lucide-react'
import { useAppStore } from '../../store/usePlayerStore'

const navItems = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'library', icon: Library, label: 'Your Library' },
]

const languages = [
  { code: 'all', label: 'All Languages' },
  { code: 'hindi', label: 'Hindi' },
  { code: 'english', label: 'English' },
  { code: 'tamil', label: 'Tamil' },
  { code: 'telugu', label: 'Telugu' },
  { code: 'bengali', label: 'Bengali' },
  { code: 'punjabi', label: 'Punjabi' },
  { code: 'marathi', label: 'Marathi' },
  { code: 'kannada', label: 'Kannada' },
  { code: 'malayalam', label: 'Malayalam' },
]

export default function Sidebar() {
  const { activePage, setActivePage, selectedLanguage, setLanguage, likedSongs, recentlyPlayed } = useAppStore()

  return (
    <aside className="w-60 flex-shrink-0 bg-black flex flex-col h-full overflow-hidden">
      {/* Logo */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center">
            <Music2 size={16} className="text-black" />
          </div>
          <span className="font-bold text-lg tracking-tight">RaagFlow</span>
        </div>
      </div>

      {/* Main nav */}
      <nav className="px-3 mb-6">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActivePage(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
              activePage === id ? 'text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            <Icon size={20} strokeWidth={activePage === id ? 2.5 : 1.5} />
            {label}
          </button>
        ))}
      </nav>

      {/* Library section */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1">
        <div className="flex items-center justify-between px-3 mb-2">
          <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Library</span>
          <button className="text-white/40 hover:text-white transition-colors" title="Create playlist">
            <Plus size={16} />
          </button>
        </div>

        {/* Liked songs */}
        <button
          onClick={() => setActivePage('liked')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
            activePage === 'liked' ? 'bg-surface-elevated text-white' : 'text-white/60 hover:text-white hover:bg-surface-raised'
          }`}
        >
          <div className="w-9 h-9 rounded bg-gradient-to-br from-purple-700 to-brand flex items-center justify-center flex-shrink-0">
            <Heart size={14} fill="white" stroke="none" />
          </div>
          <div className="min-w-0 text-left">
            <p className="font-medium text-sm line-clamp-1">Liked Songs</p>
            <p className="text-xs text-white/40">{likedSongs.length} songs</p>
          </div>
        </button>

        {/* Recently played */}
        {recentlyPlayed.length > 0 && (
          <>
            <p className="text-xs text-white/40 px-3 pt-4 pb-1 uppercase tracking-wider font-semibold">Recent</p>
            {recentlyPlayed.slice(0, 5).map(track => (
              <button key={track.id} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-white/60 hover:text-white hover:bg-surface-raised transition-colors">
                <img src={track.thumbnail} alt="" className="w-9 h-9 rounded object-cover flex-shrink-0" />
                <div className="min-w-0 text-left">
                  <p className="line-clamp-1 text-sm">{track.title}</p>
                  <p className="text-xs text-white/40 line-clamp-1">{track.artist}</p>
                </div>
              </button>
            ))}
          </>
        )}
      </div>

      {/* Language filter */}
      <div className="px-3 py-4 border-t border-white/10">
        <p className="text-xs text-white/40 uppercase tracking-wider font-semibold px-3 mb-2">Language</p>
        <div className="space-y-0.5 max-h-48 overflow-y-auto">
          {languages.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => setLanguage(code)}
              className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors ${
                selectedLanguage === code
                  ? 'text-brand font-medium'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
