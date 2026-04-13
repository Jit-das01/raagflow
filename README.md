# 🎵 RaagFlow

> Free music streaming for every Indian language and beyond — built like Spotify, powered by open APIs.

![RaagFlow](https://img.shields.io/badge/RaagFlow-v0.1.0-1DB954?style=for-the-badge&logo=music&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=flat-square&logo=pwa)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## 🌟 What is RaagFlow?

RaagFlow is a **cross-platform music streaming PWA** that aggregates music from YouTube, SoundCloud, and Jamendo into a single Spotify-style interface — supporting **10 Indian languages** (Hindi, Tamil, Telugu, Bengali, Punjabi, Marathi, Kannada, Malayalam) plus English.

**Core principle:** Build on top of APIs that already handle music licensing. Zero direct licensing cost in v1. Near-zero server cost.

## ✨ Features

- 🎧 **Multi-source playback** — YouTube, SoundCloud, Jamendo (Creative Commons)
- 🇮🇳 **10 Indian languages** — language-filtered home feeds and search
- ❤️ **Liked songs** — persisted locally across sessions
- 🔀 **Shuffle, repeat, crossfade controls**
- 📱 **PWA** — installable on Android/iOS, works offline for cached content
- 🔍 **Unified search** — searches all 3 sources simultaneously
- 🕑 **Recently played** history
- 🎨 **Spotify-dark aesthetic** — dark UI, smooth animations

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| State | Zustand (with persistence) |
| Audio | Howler.js (SoundCloud/Jamendo) + YouTube IFrame API |
| Styling | Tailwind CSS |
| Data fetching | React Query |
| PWA | vite-plugin-pwa |
| Animations | Framer Motion |

## 🚀 Getting Started

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/raagflow.git
cd raagflow
npm install
```

### 2. Set up API keys

```bash
cp .env.example .env
```

Edit `.env` and add your keys:

| Key | Where to get it | Free tier |
|---|---|---|
| `VITE_YOUTUBE_API_KEY` | [Google Cloud Console](https://console.cloud.google.com) → YouTube Data API v3 | 10,000 units/day |
| `VITE_SOUNDCLOUD_CLIENT_ID` | [SoundCloud Developers](https://developers.soundcloud.com) | Apply for access |
| `VITE_JAMENDO_CLIENT_ID` | [Jamendo Developer](https://developer.jamendo.com) | Free, included |

> **Note:** App works with just `VITE_YOUTUBE_API_KEY`. SoundCloud and Jamendo are optional enhancements.

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 4. Build for production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
raagflow/
├── src/
│   ├── components/
│   │   ├── Player/         # Bottom player bar (controls, seek, volume)
│   │   ├── Sidebar/        # Nav + language filter + library
│   │   ├── Home/           # Landing feed with language sections
│   │   ├── Search/         # Multi-source search results
│   │   ├── Library/        # Liked songs + playlists
│   │   └── TrackCard.jsx   # Reusable card + row components
│   ├── services/
│   │   └── musicApi.js     # All API integrations + track normalizer
│   ├── store/
│   │   └── usePlayerStore.js  # Zustand stores (player + app state)
│   ├── hooks/
│   │   └── useAudioPlayer.js  # Howler.js audio engine hook
│   └── styles/
│       └── global.css
├── .env.example
├── vite.config.js
└── tailwind.config.js
```

## 🗺 Roadmap

- [x] v0.1 — Core playback, search, liked songs, language filter
- [ ] v0.2 — User auth (Supabase), cloud-synced playlists
- [ ] v0.3 — AI recommendations (collaborative filtering on play history)
- [ ] v0.4 — Audio ads via Google Ad Manager (VAST 4.x)
- [ ] v0.5 — React Native mobile apps (Expo)
- [ ] v1.0 — Direct music licensing, self-hosted CDN

## ⚖️ Legal

RaagFlow operates as a **frontend aggregator** of third-party APIs:
- **YouTube** content is played via the official YouTube IFrame Player API, complying with YouTube's Terms of Service.
- **SoundCloud** tracks are streamed via the official SoundCloud API, limited to tracks artists have enabled for external streaming.
- **Jamendo** content is Creative Commons licensed — free to stream legally.

No audio files are hosted on RaagFlow servers. For direct music hosting, consult a music licensing attorney before proceeding.

## 🤝 Contributing

PRs welcome! Please open an issue first for major features.

## 📄 License

MIT © 2024 [Jit Das](https://github.com/Jit-das01)
