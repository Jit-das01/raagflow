import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const usePlayerStore = create(
  persist(
    (set, get) => ({
      // Current track
      currentTrack: null,
      queue: [],
      queueIndex: 0,
      isPlaying: false,
      volume: 0.8,
      isMuted: false,
      shuffle: false,
      repeat: 'off', // 'off' | 'all' | 'one'
      progress: 0,
      duration: 0,

      // UI state
      isPlayerExpanded: false,

      setCurrentTrack: (track, queue = [], index = 0) =>
        set({ currentTrack: track, queue, queueIndex: index, isPlaying: true, progress: 0 }),

      setIsPlaying: (val) => set({ isPlaying: val }),
      setVolume: (vol) => set({ volume: vol, isMuted: vol === 0 }),
      toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
      toggleShuffle: () => set((s) => ({ shuffle: !s.shuffle })),
      cycleRepeat: () => set((s) => ({
        repeat: s.repeat === 'off' ? 'all' : s.repeat === 'all' ? 'one' : 'off'
      })),
      setProgress: (p) => set({ progress: p }),
      setDuration: (d) => set({ duration: d }),
      toggleExpanded: () => set((s) => ({ isPlayerExpanded: !s.isPlayerExpanded })),

      playNext: () => {
        const { queue, queueIndex, shuffle, repeat } = get()
        if (!queue.length) return
        let nextIndex
        if (shuffle) {
          nextIndex = Math.floor(Math.random() * queue.length)
        } else if (repeat === 'one') {
          nextIndex = queueIndex
        } else {
          nextIndex = (queueIndex + 1) % queue.length
        }
        set({ currentTrack: queue[nextIndex], queueIndex: nextIndex, isPlaying: true, progress: 0 })
      },

      playPrev: () => {
        const { queue, queueIndex } = get()
        if (!queue.length) return
        const prevIndex = (queueIndex - 1 + queue.length) % queue.length
        set({ currentTrack: queue[prevIndex], queueIndex: prevIndex, isPlaying: true, progress: 0 })
      },

      addToQueue: (track) => set((s) => ({ queue: [...s.queue, track] })),
      clearQueue: () => set({ queue: [], currentTrack: null, isPlaying: false }),
    }),
    { name: 'raagflow-player', partialize: (s) => ({ volume: s.volume, shuffle: s.shuffle, repeat: s.repeat }) }
  )
)

export const useAppStore = create((set) => ({
  activePage: 'home',
  searchQuery: '',
  selectedLanguage: 'all',
  languages: ['all', 'hindi', 'english', 'tamil', 'telugu', 'bengali', 'punjabi', 'marathi', 'kannada', 'malayalam'],
  likedSongs: [],
  recentlyPlayed: [],

  setActivePage: (page) => set({ activePage: page }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setLanguage: (lang) => set({ selectedLanguage: lang }),
  toggleLike: (track) => set((s) => ({
    likedSongs: s.likedSongs.find(t => t.id === track.id)
      ? s.likedSongs.filter(t => t.id !== track.id)
      : [track, ...s.likedSongs]
  })),
  addRecentlyPlayed: (track) => set((s) => ({
    recentlyPlayed: [track, ...s.recentlyPlayed.filter(t => t.id !== track.id)].slice(0, 20)
  })),
}))
