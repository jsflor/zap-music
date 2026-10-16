# zap-music: Developer & Agent Guidelines

## 1. Project Overview & Mission
`zap-music` is an open-source, self-hostable music player designed to be a pixel-perfect, high-performance clone of the native macOS Music app (`Music.app`).
Built on **Tauri v2** (`https://v2.tauri.app/`) with a modern React + TypeScript frontend, it delivers native desktop and mobile experiences across:
- **macOS**
- **Linux**
- **Windows**
- **iOS**
- **Android**
- **Web (PWA / Browser)**

---

## 2. REA Inspection Findings (macOS Music.app)

Directly recovered from inspecting `/System/Applications/Music.app` (Apple Music 1.6.6 on macOS):

### 2.1 Design Tokens & Colors
* **Primary Key Accent (`KeyColor`)**:
  * Light Mode: `sRGB(0.980, 0.137, 0.231)` &rarr; **`#FA233B`**
  * Dark Mode (`NSAppearanceNameDarkAqua`): `sRGB(0.980, 0.176, 0.282)` &rarr; **`#FA2D48`**
  * High-Contrast Accessibility: `sRGB(0.839, 0.000, 0.090)` &rarr; **`#D60017`**
* **Vibrancy & Chrome**:
  * Translucent blurred sidebar using macOS vibrancy / backdrop-blur (`visualEffect`).
  * Unified titlebar with traffic light buttons integrated cleanly.
  * Rounded corners: 8px for cards/menus, 4px for album artwork thumbnails.
* **Typography**:
  * SF Pro Display / Text (`system-ui, -apple-system, BlinkMacSystemFont`).
  * Text scales: Title (13px semibold/bold), Subtitle/Metadata (11px regular, opacity 0.65).

### 2.2 Layout & Navigation Hierarchy
* **Top Header / LCD Player Capsule**:
  * Transport controls: Previous, Play/Pause, Next.
  * Volume control slider with speaker icons.
  * Central LCD capsule: Thumbnail artwork (36×36px), Track Title (13px semibold), Artist — Album (11px muted), Scrubber bar with elapsed and remaining time (`-MM:SS`).
  * Right utility actions: Time-synced Lyrics toggle, Playing Next / Queue toggle, AirPlay / Device selector, Search field.
* **Left Sidebar**:
  * **Library**:
    * *Recently Added* (Grid of albums sorted by date added)
    * *Artists* (Split list of artists with discography on right)
    * *Albums* (Square grid with hover play button)
    * *Songs* (Dense table with columns: `#`, `Title`, `Time`, `Artist`, `Album`, `Genre`, `Plays`, `Rating`, `Favorite`)
    * *Made For You* (Personalized auto-mixes)
  * **Playlists**:
    * All Playlists, User playlists, folders, and smart playlists.
* **Special Views**:
  * **Full-Screen Lyrics**: Auto-scrolling time-synced lyrics over an animated, blurred canvas mesh gradient derived from the album art's dominant colors.
  * **MiniPlayer**: Detachable compact floating HUD displaying album artwork, song info, and transport controls.

### 2.3 Data Model & Core Entities (from `com.apple.Music.sdef`)
* **Track**: `id`, `title`, `artist`, `album`, `albumArtist`, `genre`, `composer`, `year`, `trackNumber`, `discNumber`, `duration`, `bitRate`, `sampleRate`, `lyrics` (LRC synced + plain), `rating`, `favorited`, `playedCount`, `playedDate`, `dateAdded`, `streamUrl` / `filePath`, `sourceId`.
* **Playlist**: `id`, `name`, `description`, `favorited`, `customArtworkUrl`, `isFolder`, `parentId`, `trackIds`, `rules`.
* **Source**: Pluggable storage provider identifying the origin of tracks.

---

## 3. Pluggable Music Source Architecture
All audio and metadata operations must go through the `MusicSourceProvider` abstraction:
1. **Local Storage**: Scans local directories and mounted network shares (SMB/NFS). Extracts tags via Rust `lofty` and caches in local SQLite.
2. **Cloudflare R2 / AWS S3**: Interacts via S3-compatible REST API. Uses HTTP Range requests for ID3 header parsing and low-latency audio streaming.
3. **Home Server (Navidrome / Subsonic)**: Communicates via OpenSubsonic REST API. Supports remote streaming, playlist synchronization, scrobbling, and starred tracks.
4. **Official Spotify Account**: Connects via Spotify Web API for catalog/metadata and Spotify Web Playback SDK for playback (authenticated Spotify Premium users).

---

## 4. Multi-Platform & Web Support Rules
* **Platform Abstraction**:
  * When compiling under Tauri (Desktop / Mobile), utilize native Rust plugins for filesystem, local SQLite database, and media controls (MPRIS on Linux, SMTC on Windows, NowPlaying on macOS/iOS).
  * When running in standard web mode, gracefully fallback to browser APIs (Web Audio API, IndexedDB, HTML5 Media Session API).
  * Always use feature-detection via `isTauri()` instead of hardcoded platform checks.
* **Audio Engine Invariants**:
  * Zero-gap playback transitions where possible.
  * Volume and scrubber state must always be reactive and synchronized across views, MiniPlayer, and OS media centers.

---

## 5. OpenSpec Workflow
This project follows **OpenSpec** for all specification-driven development:
- Propose changes using `openspec new change <name>`.
- Maintain delta specs under `openspec/changes/<name>/specs/`.
- Do not modify production application code until the change proposal and tasks have been formally approved and reviewed.
