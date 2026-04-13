import React from 'react'
import { useQuery } from 'react-query'
import { Play } from 'lucide-react'
import { getHomeFeed } from '../../services/musicApi'
import { TrackCard } from '../TrackCard'
import { useAppStore, usePlayerStore } from '../../store/usePlayerStore'

const languageEmojis = {
  hindi: '🇮🇳', english: '🇬🇧', tamil: '🎭', telugu: '🌿',
  bengali: '🐟', punjabi: '🌾', marathi: '🦁', kannada: '🐘', malayalam: '🌴', all: '🌍'
}

const sections = [
  { key: 'hindi', label: 'Hindi Hits' },
  { key: 'english', label: 'English Charts' },
  { key: 'punjabi', label: 'Punjabi Beats' },
  { key: 'tamil', label: 'Tamil Fire' },
  { key: 'telugu', label: 'Telugu Vibes' },
  { key: 'bengali', label: 'Bengali Tunes' },
]

function Section({ langKey, label, onSelectPage }) {
  const { selectedLanguage } = useAppStore()
  const { data = [], isLoading } = useQuery(
    ['home-feed', langKey],
    () => getHomeFeed(langKey),
    { staleTime: 300000 }
  )

  const tracks = data.slice(0, 6)

  if (isLoading) return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4">{label}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-surface-raised rounded-lg aspect-square animate-pulse" />
        ))}
      </div>
    </section>
  )

  if (!tracks.length) return null

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{languageEmojis[langKey]} {label}</h2>
        <button className="text-sm text-white/50 hover:text-white transition-colors">See all</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {tracks.map((track, i) => (
          <TrackCard key={track.id} track={track} queue={tracks} index={i} />
        ))}
      </div>
    </section>
  )
}

const greetingTime = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Home() {
  const { setActivePage } = useAppStore()

  return (
    <div className="h-full overflow-y-auto px-6 py-6">
      <h1 className="text-3xl font-bold mb-6">{greetingTime()} 👋</h1>

      {/* Quick genre picks */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {[
          { label: 'Bollywood', color: 'from-pink-700 to-rose-900', q: 'bollywood' },
          { label: 'Lo-fi Study', color: 'from-blue-700 to-indigo-900', q: 'lofi' },
          { label: 'Indie Vibes', color: 'from-green-700 to-teal-900', q: 'indie' },
          { label: 'Punjabi Pop', color: 'from-orange-600 to-amber-900', q: 'punjabi' },
          { label: 'Tamil Beats', color: 'from-red-700 to-orange-900', q: 'tamil' },
          { label: 'Sufi & Soul', color: 'from-purple-700 to-violet-900', q: 'sufi' },
        ].map(({ label, color, q }) => (
          <button
            key={q}
            onClick={() => { useAppStore.getState().setSearchQuery(q); setActivePage('search') }}
            className={`bg-gradient-to-br ${color} rounded-lg px-4 py-5 text-left hover:opacity-90 transition-opacity flex items-center justify-between group`}
          >
            <span className="font-semibold text-sm">{label}</span>
            <Play size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" fill="white" stroke="none" />
          </button>
        ))}
      </div>

      {/* Language sections */}
      {sections.map(s => (
        <Section key={s.key} langKey={s.key} label={s.label} />
      ))}
    </div>
  )
}
