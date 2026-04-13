import React from 'react'
import Sidebar from './components/Sidebar/Sidebar'
import Player from './components/Player/Player'
import Home from './components/Home/Home'
import Search from './components/Search/Search'
import Library from './components/Library/Library'
import { useAppStore } from './store/usePlayerStore'

function MainContent() {
  const { activePage } = useAppStore()
  switch (activePage) {
    case 'search': return <Search />
    case 'library':
    case 'liked': return <Library />
    default: return <Home />
  }
}

export default function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0f0f0f', color: '#fff', overflow: 'hidden' }}>
      {/* Top: sidebar + main content */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <main style={{ flex: 1, background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f0f 40%)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <MainContent />
        </main>
      </div>

      {/* Player — always at bottom, always visible */}
      <Player />
    </div>
  )
}
