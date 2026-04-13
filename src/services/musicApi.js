import axios from 'axios'

// ─── Config ───────────────────────────────────────────────────────
const YT_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || ''
const SC_CLIENT_ID = import.meta.env.VITE_SOUNDCLOUD_CLIENT_ID || ''
const JAMENDO_CLIENT_ID = import.meta.env.VITE_JAMENDO_CLIENT_ID || ''

// ─── Track normalizer: maps any source to a common schema ─────────
export function normalizeTrack(raw, source) {
  if (source === 'youtube') {
    const id = raw.id?.videoId || raw.id
    return {
      id: `yt_${id}`,
      source: 'youtube',
      title: raw.snippet?.title || raw.title,
      artist: raw.snippet?.channelTitle || 'Unknown',
      album: '',
      thumbnail: raw.snippet?.thumbnails?.medium?.url || raw.snippet?.thumbnails?.default?.url || '',
      duration: 0, // requires extra API call; fetch on play
      streamUrl: null, // played via YouTube embed
      youtubeId: id,
      language: detectLanguage(raw.snippet?.title || ''),
    }
  }
  if (source === 'soundcloud') {
    return {
      id: `sc_${raw.id}`,
      source: 'soundcloud',
      title: raw.title,
      artist: raw.user?.username || 'Unknown',
      album: '',
      thumbnail: raw.artwork_url?.replace('-large', '-t300x300') || raw.user?.avatar_url || '',
      duration: Math.floor(raw.duration / 1000),
      streamUrl: raw.stream_url ? `${raw.stream_url}?client_id=${SC_CLIENT_ID}` : null,
      language: detectLanguage(raw.title + ' ' + (raw.tag_list || '')),
    }
  }
  if (source === 'jamendo') {
    return {
      id: `jm_${raw.id}`,
      source: 'jamendo',
      title: raw.name,
      artist: raw.artist_name,
      album: raw.album_name || '',
      thumbnail: raw.album_image || raw.image || '',
      duration: raw.duration || 0,
      streamUrl: raw.audio,
      language: raw.language || 'english',
    }
  }
  return raw
}

function detectLanguage(text) {
  const lower = text.toLowerCase()
  if (/punjabi|ਪੰਜਾਬੀ/.test(lower)) return 'punjabi'
  if (/tamil|தமிழ்/.test(lower)) return 'tamil'
  if (/telugu|తెలుగు/.test(lower)) return 'telugu'
  if (/bengali|বাংলা/.test(lower)) return 'bengali'
  if (/malayalam|മലയാളം/.test(lower)) return 'malayalam'
  if (/kannada|ಕನ್ನಡ/.test(lower)) return 'kannada'
  if (/marathi|मराठी/.test(lower)) return 'marathi'
  if (/hindi|bollywood|हिंदी/.test(lower)) return 'hindi'
  return 'english'
}

// ─── YouTube ──────────────────────────────────────────────────────
const ytClient = axios.create({ baseURL: 'https://www.googleapis.com/youtube/v3' })

export async function searchYouTube(query, maxResults = 20) {
  if (!YT_API_KEY) return []
  const { data } = await ytClient.get('/search', {
    params: { part: 'snippet', q: `${query} official audio`, type: 'video',
      videoCategoryId: '10', maxResults, key: YT_API_KEY }
  })
  return (data.items || []).map(item => normalizeTrack(item, 'youtube'))
}

export async function getYouTubeTrending(regionCode = 'IN', maxResults = 30) {
  if (!YT_API_KEY) return []
  const { data } = await ytClient.get('/videos', {
    params: { part: 'snippet,contentDetails', chart: 'mostPopular',
      videoCategoryId: '10', regionCode, maxResults, key: YT_API_KEY }
  })
  return (data.items || []).map(item => normalizeTrack({ ...item, id: item.id }, 'youtube'))
}

// ─── SoundCloud ───────────────────────────────────────────────────
const scClient = axios.create({ baseURL: 'https://api.soundcloud.com' })

export async function searchSoundCloud(query, limit = 20) {
  if (!SC_CLIENT_ID) return []
  const { data } = await scClient.get('/tracks', {
    params: { q: query, limit, client_id: SC_CLIENT_ID, filter: 'streamable' }
  })
  return (data || []).map(item => normalizeTrack(item, 'soundcloud'))
}

export async function getSoundCloudCharts(genre = 'all-music', limit = 20) {
  if (!SC_CLIENT_ID) return []
  const { data } = await scClient.get('/charts', {
    params: { kind: 'trending', genre: `soundcloud:genres:${genre}`, limit, client_id: SC_CLIENT_ID }
  })
  return ((data.collection || []).map(c => c.track)).map(t => normalizeTrack(t, 'soundcloud'))
}

// ─── Jamendo (CC-licensed, no key needed for basic) ───────────────
const jmClient = axios.create({ baseURL: 'https://api.jamendo.com/v3.0' })
const JM_ID = JAMENDO_CLIENT_ID || 'b6747d04' // Jamendo public demo key

export async function searchJamendo(query, limit = 20) {
  const { data } = await jmClient.get('/tracks/', {
    params: { client_id: JM_ID, format: 'json', limit, search: query, include: 'musicinfo', audioformat: 'mp32' }
  })
  return (data.results || []).map(t => normalizeTrack(t, 'jamendo'))
}

export async function getJamendoTracks({ tags = '', limit = 30 } = {}) {
  const { data } = await jmClient.get('/tracks/', {
    params: { client_id: JM_ID, format: 'json', limit, tags, audioformat: 'mp32',
      orderby: 'popularity_total', include: 'musicinfo' }
  })
  return (data.results || []).map(t => normalizeTrack(t, 'jamendo'))
}

// ─── Unified search across all sources ───────────────────────────
export async function searchAll(query) {
  const results = await Promise.allSettled([
    searchYouTube(query, 15),
    searchSoundCloud(query, 10),
    searchJamendo(query, 10),
  ])
  return results
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => r.value)
}

// ─── Home feed: trending + curated per language ───────────────────
export async function getHomeFeed(language = 'all') {
  const queries = {
    all: ['trending india 2024', 'bollywood hits', 'top songs'],
    hindi: ['hindi songs 2024', 'bollywood new', 'hindi pop'],
    english: ['english pop 2024', 'top english songs'],
    tamil: ['tamil songs 2024', 'kollywood hits'],
    telugu: ['telugu songs 2024', 'tollywood hits'],
    bengali: ['bengali songs 2024', 'rabindra sangeet modern'],
    punjabi: ['punjabi songs 2024', 'punjabi pop bhangra'],
    marathi: ['marathi songs 2024', 'marathi pop'],
    kannada: ['kannada songs 2024', 'sandalwood music'],
    malayalam: ['malayalam songs 2024', 'mollywood music'],
  }
  const q = queries[language] || queries.all
  const results = await Promise.allSettled(q.map(query => searchYouTube(query, 10)))
  return results.filter(r => r.status === 'fulfilled').flatMap(r => r.value)
}
