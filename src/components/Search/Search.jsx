import React, { useState, useEffect, useRef } from 'react'
import { Search as SearchIcon, X, Loader2 } from 'lucide-react'
import { searchAll } from '../../services/musicApi'
import { TrackRow } from '../TrackCard'
import { useAppStore } from '../../store/usePlayerStore'

export default function Search() {
  const { searchQuery, setSearchQuery, selectedLanguage } = useAppStore()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const inputRef = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!searchQuery.trim()) { setResults([]); setSearched(false); return }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const all = await searchAll(searchQuery)
        setResults(all)
        setSearched(true)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }, 600)
    return () => clearTimeout(debounceRef.current)
  }, [searchQuery])

  const filtered = selectedLanguage === 'all'
    ? results
    : results.filter(t => t.language === selectedLanguage)

  const ytTracks = filtered.filter(t => t.source === 'youtube')
  const scTracks = filtered.filter(t => t.source === 'soundcloud')
  const jmTracks = filtered.filter(t => t.source === 'jamendo')

  return (
    <div className="h-full overflow-y-auto px-6 py-6">
      {/* Search input */}
      <div className="relative mb-6 max-w-xl">
        <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search songs, artists, languages..."
          className="w-full bg-surface-elevated text-white placeholder-white/30 rounded-full px-10 py-3 text-sm outline-none focus:ring-1 focus:ring-white/30 border border-white/10"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
            <X size={16} />
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-white/50 text-sm">
          <Loader2 size={16} className="animate-spin" />
          Searching across YouTube, SoundCloud & Jamendo...
        </div>
      )}

      {!loading && searched && filtered.length === 0 && (
        <p className="text-white/40 text-sm">No results found. Try a different language filter or query.</p>
      )}

      {!searched && !loading && (
        <div className="text-center py-20">
          <SearchIcon size={48} className="mx-auto text-white/10 mb-4" />
          <p className="text-white/40">Search for songs in any Indian or international language</p>
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {['Arijit Singh', 'AR Rahman', 'Diljit Dosanjh', 'SPB', 'Lo-fi chill', 'Carnatic'].map(s => (
              <button key={s} onClick={() => setSearchQuery(s)}
                className="text-xs px-3 py-1.5 bg-surface-elevated rounded-full text-white/60 hover:text-white hover:bg-surface-overlay transition-colors">
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results by source */}
      {[
        { label: '🔴 YouTube Music', tracks: ytTracks, color: 'text-red-400' },
        { label: '🟠 SoundCloud', tracks: scTracks, color: 'text-orange-400' },
        { label: '🟢 Jamendo (Free/CC)', tracks: jmTracks, color: 'text-green-400' },
      ].map(({ label, tracks, color }) => tracks.length > 0 && (
        <section key={label} className="mb-6">
          <h2 className={`text-sm font-semibold mb-2 ${color}`}>{label}</h2>
          <div className="space-y-0.5">
            {tracks.map((track, i) => (
              <TrackRow key={track.id} track={track} queue={tracks} index={i} showIndex />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
