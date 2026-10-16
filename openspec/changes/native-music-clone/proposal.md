## Why

Proprietary music applications lock users into specific streaming ecosystems or platforms, while existing open-source music players often look unpolished, lack cross-platform consistency, or only support one storage backend. Users need a self-hostable, open-source music player that faithfully replicates the clean, native aesthetic of the macOS Music app while running across macOS, Linux, Windows, iOS, Android, and Web browsers, with unified access to Local Storage, S3/Cloudflare R2, Navidrome/Subsonic, and Spotify.

## What Changes

- **Core Application Scaffolding**: Setup Tauri v2 desktop & mobile bundle configuration with a React 19 + TypeScript + Vite + Tailwind CSS frontend.
- **Native macOS Music Design System**: Implement the visual identity recovered from REA inspection:
  - Exact brand colors (`#FA233B` light mode, `#FA2D48` dark mode).
  * Blurred translucent sidebar with macOS system typography.
  * Central LCD playback capsule in the top toolbar with track metadata, cover art thumbnail, scrubber bar, and time counters.
  * Responsive view layouts: Recently Added grid, Albums grid, Artists split-view, Songs table, Playlist detail, Full-Screen time-synced Lyrics with dynamic cover-art mesh gradients, and detached MiniPlayer.
- **Audio Engine**: Build a low-latency, gapless audio playback engine with queue management (Up Next, History, Autoplay) using Rust audio backends on native platforms and Web Audio API fallback for web.
- **Pluggable Music Sources**:
  - Local Storage scanner with metadata and embedded artwork extraction using Rust `lofty`.
  - Cloudflare R2 / AWS S3 audio streamer using HTTP Range requests.
  - Navidrome / Subsonic client supporting OpenSubsonic REST API (catalog, streaming, scrobbling, star sync).
  - Spotify integration for authenticated accounts via Spotify Web API and Web Playback SDK.
- **Local Catalog Cache**: Embedded SQLite database for instant full-text search across all combined music sources.

## Capabilities

### New Capabilities
- `audio-engine`: Cross-platform audio playback engine supporting play/pause, seek, volume, repeat, shuffle, gapless transitions, and queue management.
- `music-sources`: Unified multi-source music provider abstraction supporting Local files, S3/R2 buckets, Subsonic/Navidrome servers, and Spotify.
- `library-management`: Local metadata catalog, SQLite search index, track metadata storage, and playlist/favorite management.
- `native-ui`: macOS Music app-style user interface including Top LCD bar, sidebar navigation, song tables, album grids, full-screen lyrics, and MiniPlayer.

### Modified Capabilities
None. This is the initial greenfield proposal for the project.

## Impact

- Creates the root project structure in `zap-music/` with Tauri v2 and Vite frontend.
- Defines backend Rust dependencies (`tauri`, `lofty`, `symphonia`/`rodio`, `rusqlite`/`sqlx`, `reqwest`).
- Defines frontend dependencies (`react`, `zustand`, `lucide-react`, `tailwindcss`, `@tanstack/react-virtual`).
- Supports building native binaries for macOS, Linux, Windows, iOS, Android, plus standalone static web build.
