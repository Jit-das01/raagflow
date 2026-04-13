import React from 'react'
import { Home, Search, Library, Heart, Music2, Plus } from 'lucide-react'
import { useAppStore } from '../../store/usePlayerStore'

const navItems = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'library', icon: Library, label: 'Your Library' },
]

const languages = [
  { code: 'all', label: '🌍 All Languages' },
  { code: 'hindi', label: '🇮🇳 Hindi' },
  { code: 'english', label: '🇬🇧 English' },
  { code: 'tamil', label: '🎭 Tamil' },
  { code: 'telugu', label: '🌿 Telugu' },
  { code: 'bengali', label: '🐟 Bengali' },
  { code: 'punjabi', label: '🌾 Punjabi' },
  { code: 'marathi', label: '🦁 Marathi' },
  { code: 'kannada', label: '🐘 Kannada' },
  { code: 'malayalam', label: '🌴 Malayalam' },
]

export default function Sidebar() {
  const { activePage, setActivePage, selectedLanguage, setLanguage, likedSongs, recentlyPlayed } = useAppStore()

  return (
    <aside style={{ width: '220px', flexShrink: 0, background: '#000', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* Logo */}
      <div style={{ padding: '20px 20px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: '#1DB954', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Music2 size={16} color="#000" />
          </div>
          <span style={{ fontWeight: 700, fontSize: '18px', letterSpacing: '-0.5px' }}>RaagFlow</span>
        </div>
        <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '4px', marginLeft: '42px' }}>Free • Forever</p>
      </div>

      {/* Nav */}
      <nav style={{ padding: '0 12px 16px' }}>
        {navItems.map(({ id, icon: Icon, label }) => (
          <button key={id} onClick={() => setActivePage(id)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: activePage === id ? 600 : 400,
              color: activePage === id ? '#fff' : 'rgba(255,255,255,0.6)',
              background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
              transition: 'color 0.15s'
            }}
            onMouseEnter={e => { if (activePage !== id) e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { if (activePage !== id) e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
          >
            <Icon size={20} strokeWidth={activePage === id ? 2.5 : 1.5} />
            {label}
          </button>
        ))}
      </nav>

      {/* Library */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Library</span>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }} title="Create playlist">
            <Plus size={15} />
          </button>
        </div>

        {/* Liked songs */}
        <button onClick={() => setActivePage('liked')}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '8px 12px', borderRadius: '6px', background: activePage === 'liked' ? '#242424' : 'none',
            border: 'none', cursor: 'pointer', textAlign: 'left', marginBottom: '2px'
          }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: 'linear-gradient(135deg, #450af5, #1DB954)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Heart size={14} fill="white" stroke="none" />
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '13px', fontWeight: 500, color: '#fff', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Liked Songs</p>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>{likedSongs.length} songs</p>
          </div>
        </button>

        {/* Recently played */}
        {recentlyPlayed.length > 0 && (
          <>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', padding: '12px 12px 4px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Recent</p>
            {recentlyPlayed.slice(0, 5).map(track => (
              <button key={track.id}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 12px', borderRadius: '6px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                onMouseEnter={e => e.currentTarget.style.background = '#242424'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
                onClick={() => {
                  const { setCurrentTrack } = require('../../store/usePlayerStore').usePlayerStore.getState()
                  setCurrentTrack(track, [track], 0)
                }}
              >
                <img src={track.thumbnail} alt="" style={{ width: '36px', height: '36px', borderRadius: '4px', objectFit: 'cover', flexShrink: 0 }}
                  onError={e => e.target.style.display = 'none'} />
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: '12px', color: '#fff', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{track.title}</p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{track.artist}</p>
                </div>
              </button>
            ))}
          </>
        )}
      </div>

      {/* Language filter */}
      <div style={{ padding: '8px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', padding: '4px 12px 6px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Language</p>
        <div style={{ maxHeight: '160px', overflowY: 'auto' }}>
          {languages.map(({ code, label }) => (
            <button key={code} onClick={() => setLanguage(code)}
              style={{
                width: '100%', textAlign: 'left', padding: '5px 12px', borderRadius: '4px',
                fontSize: '12px', fontWeight: selectedLanguage === code ? 600 : 400,
                color: selectedLanguage === code ? '#1DB954' : 'rgba(255,255,255,0.5)',
                background: 'none', border: 'none', cursor: 'pointer'
              }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Credit — designed & developed by Jit Das */}
      <div style={{ padding: '10px 16px 14px', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
        <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', margin: 0, lineHeight: 1.6 }}>
          Designed & Developed by
        </p>
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: 0, fontWeight: 600, letterSpacing: '0.02em' }}>
          Jit Das
        </p>
        <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.15)', margin: '2px 0 0', letterSpacing: '0.03em' }}>
          github.com/Jit-das01
        </p>
      </div>
    </aside>
  )
}
