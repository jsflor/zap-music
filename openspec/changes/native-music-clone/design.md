## Context

See `proposal.md` for overall motivation and `specs/` for behavioral requirements.
The app is constructed in `zap-music/` as a unified Tauri v2 multi-platform application supporting desktop (macOS, Linux, Windows), mobile (iOS, Android), and static web browsers.

## Goals / Non-Goals

**Goals:**
- Provide a pixel-perfect clone of the macOS Music app user interface using authentic design tokens recovered via REA inspection (`#FA233B` light, `#FA2D48` dark, translucent blurred sidebar, LCD playback header).
- Deliver high-performance playback and instant search across massive libraries (100k+ songs).
- Implement an extensible `MusicSourceProvider` abstraction unifying Local Files, S3/Cloudflare R2, Navidrome/Subsonic, and Spotify.
- Maintain single-codebase parity between native Tauri builds and standalone web browser builds.

**Non-Goals:**
- DRM decryption / circumvention (Spotify streaming relies strictly on the official Spotify Web Playback SDK).
- Audio editing, mastering, or digital audio workstation (DAW) features.
- Physical CD burning/ripping capabilities.

## Decisions

### 1. Tauri v2 vs Electron
- **Choice**: Tauri v2.
- **Rationale**: Tauri v2 offers tiny binary size (~10MB vs ~150MB), near-zero idle RAM usage (~30MB vs ~300MB), and first-class native iOS and Android build targets from the same codebase.
- **Alternatives Considered**: Electron (heavy memory usage, lacks mobile support), Flutter (non-standard web ecosystem, difficult to achieve 1:1 macOS Cocoa UI fidelity).

### 2. Frontend: React 19, Vite, Tailwind CSS & Zustand
- **Choice**: React 19 + TypeScript + Vite + Tailwind CSS + Zustand.
- **Rationale**: React with `@tanstack/react-virtual` delivers 60fps scrolling on large catalogs. Tailwind CSS enables clean expression of macOS design tokens (`backdrop-blur`, system vibrancy, SF font stacks). Zustand provides ultra-lightweight, decoupled reactive state for playback timing and library indexes without unnecessary component re-renders.
- **Alternatives Considered**: Vue, Svelte (solid, but smaller ecosystem for complex audio canvas visualizers and virtual table libraries).

### 3. Audio Engine Architecture: Dual-Engine Strategy
- **Choice**:
  - Native Desktop & Mobile: Rust audio engine using `symphonia` for audio decoding and `rodio` / native platform output.
  - Web Mode: HTML5 Audio & Web Audio API fallback with `AudioContext`.
- **Rationale**: Guarantees true cross-platform availability. Web users can run the app without compiling Rust binaries, while native desktop/mobile users get hardware-accelerated media key integration (MPRIS, SMTC, NowPlaying).

### 4. Pluggable Storage Source Architecture
- **Choice**: Unified TypeScript `MusicSourceProvider` interface with factory registration:
  - `LocalSource`: Communicates with Tauri Rust commands using `lofty` to extract tags and embedded APIC artwork.
  - `S3Source`: Issues HTTP Range requests (fetching initial 64KB for ID3 metadata, then streaming chunks).
  - `SubsonicSource`: OpenSubsonic REST API client with token/salt authentication and scrobbling.
  - `SpotifySource`: Spotify Web API for metadata + Spotify Web Playback SDK for playback.

### 5. Local Database & Cache
- **Choice**: SQLite (`rusqlite` / `sqlx` in native Tauri, IndexedDB/`sql.js` in browser mode).
- **Rationale**: SQLite provides ACID persistence, sub-millisecond full-text queries, and instant startup time for large libraries.

## Risks / Trade-offs

- **[Large Library Performance]** → Virtualized rendering (`@tanstack/react-virtual`) for the Songs table and Albums grid so only visible items are mounted in DOM.
- **[Audio Codec Licensing & Support]** → `symphonia` supports MP3, AAC, FLAC, WAV, and Vorbis out of the box with zero external C-dependency requirements.
- **[Network Latency on Cloud S3 / R2]** → Pre-fetch metadata headers and cache track metadata in local SQLite on first discovery; only stream audio bytes on demand with range requests.
- **[Web Browser Filesystem Sandboxing]** → Web mode utilizes the modern HTML5 File System Access API (`showDirectoryPicker`) for local directory access where supported, with indexed metadata saved to IndexedDB.
