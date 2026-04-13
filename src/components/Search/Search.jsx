import React, { useState, useEffect, useRef } from 'react'
import { Search as SearchIcon, X, Loader2, Music2 } from 'lucide-react'
import { searchYouTube, searchJamendo } from '../../services/musicApi'
import { TrackRow } from '../TrackCard'
import { useAppStore, usePlayerStore } from '../../store/usePlayerStore'

const SUGGESTIONS = [
  'Arijit Singh', 'AR Rahman', 'Diljit Dosanjh', 'Shreya Ghoshal',
  'SPB', 'Asha Bhosle', 'Kishore Kumar', 'Sunidhi Chauhan',
  'Lo-fi chill', 'Bollywood 2024', 'Tamil hits', 'Punjabi pop',
  'Carnatic music', 'Sufi songs', 'Indie Hindi', 'K-pop'
]

export default function Search() {
  const { searchQuery, setSearchQuery, selectedLanguage } = useAppStore()
  const { setCurrentTrack, addRecentlyPlayed } = usePlayerStore()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  useEffect(() => {
    if (!searchQuery.trim()) { setResults([]); setSearched(false); setError(''); return }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      setError('')
      try {
        // YouTube is primary source - search with music intent
        const [ytResults, jmResults] = await Promise.allSettled([
          searchYouTube(`${searchQuery} song`, 20),
          searchJamendo(searchQuery, 10),
        ])
        const yt = ytResults.status === 'fulfilled' ? ytResults.value : []
        const jm = jmResults.status === 'fulfilled' ? jmResults.value : []
        const all = [...yt, ...jm]
        if (all.length === 0) setError('No results found. Try a different search term.')
        setResults(all)
        setSearched(true)
      } catch (e) {
        setError('Search failed. Check your API key or internet connection.')
        console.error(e)
      } finally {
        setLoading(false)
      }
    }, 500)
    return () => clearTimeout(debounceRef.current)
  }, [searchQuery])

  const filtered = selectedLanguage === 'all'
    ? results
    : results.filter(t => !t.language || t.language === selectedLanguage || t.language === 'unknown')

  const ytTracks = filtered.filter(t => t.source === 'youtube')
  const jmTracks = filtered.filter(t => t.source === 'jamendo')

  function playAll(tracks) {
    if (!tracks.length) return
    tracks.forEach(t => addRecentlyPlayed(t))
    setCurrentTrack(tracks[0], tracks, 0)
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '24px' }}>

      {/* Search bar */}
      <div style={{ position: 'relative', maxWidth: '560px', marginBottom: '24px' }}>
        <SearchIcon size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search songs, artists, languages..."
          style={{
            width: '100%', background: '#242424', color: '#fff', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '999px', padding: '12px 40px 12px 44px', fontSize: '14px', outline: 'none', boxSizing: 'border-box'
          }}
          onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.3)'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')}
            style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginBottom: '16px' }}>
          <Loader2 size={16} className="animate-spin" />
          Searching YouTube & Jamendo...
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <p style={{ color: 'rgba(255,100,100,0.8)', fontSize: '13px', marginBottom: '16px' }}>{error}</p>
      )}

      {/* Empty state + suggestions */}
      {!searched && !loading && (
        <div>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', marginBottom: '16px' }}>
            Search for any song, artist, or genre
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => setSearchQuery(s)}
                style={{ fontSize: '12px', padding: '6px 14px', background: '#242424', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}
                onMouseEnter={e => e.target.style.color = '#fff'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* YouTube results */}
      {ytTracks.length > 0 && (
        <section style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#f87171' }}>🔴 YouTube Music ({ytTracks.length})</span>
            <button onClick={() => playAll(ytTracks)}
              style={{ fontSize: '12px', color: '#1DB954', background: 'none', border: 'none', cursor: 'pointer' }}>
              Play all
            </button>
          </div>
          <div>
            {ytTracks.map((track, i) => (
              <TrackRow key={track.id} track={track} queue={ytTracks} index={i} showIndex />
            ))}
          </div>
        </section>
      )}

      {/* Jamendo results */}
      {jmTracks.length > 0 && (
        <section style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#4ade80' }}>🟢 Jamendo — Free & Legal ({jmTracks.length})</span>
            <button onClick={() => playAll(jmTracks)}
              style={{ fontSize: '12px', color: '#1DB954', background: 'none', border: 'none', cursor: 'pointer' }}>
              Play all
            </button>
          </div>
          <div>
            {jmTracks.map((track, i) => (
              <TrackRow key={track.id} track={track} queue={jmTracks} index={i} showIndex />
            ))}
          </div>
        </section>
      )}

      {/* No results after search */}
      {searched && !loading && filtered.length === 0 && !error && (
        <div style={{ textAlign: 'center', paddingTop: '60px' }}>
          <Music2 size={40} style={{ color: 'rgba(255,255,255,0.1)', margin: '0 auto 12px' }} />
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>No results for "{searchQuery}"</p>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px', marginTop: '4px' }}>Try a different language filter or spelling</p>
        </div>
      )}
    </div>
  )
}
