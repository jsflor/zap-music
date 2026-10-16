## 1. Scaffolding & Tauri v2 Setup

- [ ] 1.1 Initialize Tauri v2 project structure with React 19, TypeScript, and Vite, and verify `npm run build` succeeds
- [ ] 1.2 Configure Tailwind CSS with macOS Music design tokens (Light KeyColor `#FA233B`, Dark KeyColor `#FA2D48`, SF Pro fonts, backdrop vibrancy), and verify theme tokens render in demo component
- [ ] 1.3 Configure `tauri.conf.json` with transparent titlebar, window vibrancy, and multi-platform permissions, and verify window chrome matches macOS native appearance

## 2. Audio Engine & State Architecture

- [ ] 2.1 Implement core audio player abstraction with dual-engine support (Rust native audio via Tauri commands and Web Audio API fallback for browser mode), and verify basic playback start/stop
- [ ] 2.2 Implement playback state store using Zustand (playing, paused, elapsed time, duration, volume, mute, repeat, shuffle), and verify state changes update synchronously
- [ ] 2.3 Implement Play Queue and History manager (Up Next, reordering, auto-advancing to next track), and verify queue progression upon track completion
- [ ] 2.4 Integrate OS media control integrations (macOS NowPlaying, Linux MPRIS, Windows SMTC), and verify transport key events update player state

## 3. Storage Providers & Metadata Ingestion

- [ ] 3.1 Define `MusicSourceProvider` interface and implement Local Storage source with `lofty` metadata extraction and embedded artwork parsing, and verify local folder scan extracts ID3/FLAC tags
- [ ] 3.2 Implement Cloudflare R2 / AWS S3 source with HTTP Range requests, and verify remote audio stream chunk loading
- [ ] 3.3 Implement Navidrome / Subsonic OpenSubsonic REST API provider, and verify authentication, catalog sync, and streaming
- [ ] 3.4 Implement Spotify Web API / Web Playback SDK client integration, and verify authentication and playlist fetching
- [ ] 3.5 Implement embedded SQLite catalog database schema (tracks, albums, artists, playlists), and verify instant search queries across indexed items

## 4. macOS Native UI Components

- [ ] 4.1 Build Top LCD Toolbar with transport buttons, volume slider, central LCD metadata capsule, scrubber, and utility buttons, and verify elapsed/remaining time updates in real-time
- [ ] 4.2 Build Translucent Sidebar with Library sections (Recently Added, Artists, Albums, Songs, Made For You) and Playlists group, and verify routing between views
- [ ] 4.3 Build Albums Grid view and Album Detail view with square artwork cards and hover play triggers, and verify album click opens detail view
- [ ] 4.4 Build Songs Table view with virtualized scrolling (`@tanstack/react-virtual`) and multi-column sorting, and verify 60fps scrolling on large song lists
- [ ] 4.5 Build Artists Master-Detail view with alphabetical artist list and album discography, and verify selecting an artist loads their tracks
- [ ] 4.6 Build Full-Screen Time-Synced Lyrics view with dynamic cover-art canvas mesh gradient, and verify lyrics scroll smoothly in sync with playback time
- [ ] 4.7 Build MiniPlayer mode with compact floating HUD, and verify toggling between standard and MiniPlayer window sizes

## 5. Cross-Platform Verification & Web Build

- [ ] 5.1 Configure standalone Web build pipeline (PWA / static SPA) with feature detection (`isTauri()`), and verify browser execution without native plugins
- [ ] 5.2 Validate iOS and Android Tauri v2 mobile build configurations, and verify mobile bundle configurations generate without errors
- [ ] 5.3 Run end-to-end integration tests on queue management, search, and audio playback across mock sources, and verify all test suites pass
