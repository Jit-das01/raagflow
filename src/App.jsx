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
    <div className="flex flex-col h-screen bg-surface-base text-white">
      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Content area */}
        <main className="flex-1 bg-gradient-to-b from-surface-elevated to-surface-base overflow-hidden">
          <MainContent />
        </main>
      </div>

      {/* Player bar (always visible at bottom) */}
      <Player />
    </div>
  )
}
