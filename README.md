# 🎵 Zap Music

An open-source, self-hostable music player designed as a pixel-perfect, high-performance clone of the native macOS Music app (`Music.app`). Built on [Tauri v2](https://v2.tauri.app/) and React 19, Zap Music runs natively across **macOS, Linux, Windows, iOS, Android, and modern Web browsers**.

---

## ✨ Features

- **macOS Native Aesthetic**: Exact Apple Music design tokens (`#FA233B` light, `#FA2D48` dark), translucent blurred sidebar, unified titlebar, and top LCD playback capsule.
- **Unified Multi-Source Storage**:
  - **Local Storage**: Scan folders on Mac, PC, or mounted network shares (SMB/NFS) with tag and embedded artwork parsing via Rust `lofty`.
  - **Object Storage**: Stream audio from Cloudflare R2 or AWS S3 via efficient HTTP Range requests.
  - **Home Server**: Connect to Navidrome, Subsonic, or Airsonic via the OpenSubsonic REST API with scrobbling and favorite sync.
  - **Spotify**: Connect your Spotify Premium account for library browsing and playback via the Spotify Web Playback SDK.
- **Audio Engine**: Low-latency, gapless playback with active queue management (Up Next, reordering, history, shuffle, and repeat modes).
- **Time-Synced Lyrics**: Full-screen lyric visualizer featuring smooth auto-scroll and dynamic ambient mesh gradient backgrounds generated from the album cover.
- **MiniPlayer**: Detachable, floating compact HUD mode.
- **Instant Search**: Embedded SQLite/IndexedDB catalog providing sub-50ms search across songs, albums, and artists.
- **System Media Keys**: Native OS media integration (macOS NowPlaying, Windows SMTC, Linux MPRIS).

---

## 📋 Prerequisites

Before running the project locally, ensure you have the following installed:

1. **Node.js**: `v20` or higher (`v24.x` recommended)
2. **Package Manager**: `npm` (v10+), `pnpm`, or `yarn`
3. **Rust Toolchain**: Required for native desktop/mobile Tauri builds:
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```
4. **Platform-Specific Dependencies (Desktop)**:
   - **macOS**: Xcode Command Line Tools (`xcode-select --install`)
   - **Linux**:
     ```bash
     sudo apt update && sudo apt install -y libwebkit2gtk-4.1-dev build-essential curl wget file libssl-dev libayatana-appindicator3-dev librsvg2-dev
     ```
   - **Windows**: Microsoft Visual Studio C++ Build Tools & WebView2

*(Note: If you only want to run the Web version in your browser, only Node.js and npm are required!)*

---

## 🚀 Quick Start (Local Setup)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/zap-music.git
cd zap-music
```

### 2. Install Dependencies
```bash
npm install
```

---

## 💻 Running the Application

### Option A: Run in Web Browser (Fastest)
Runs the application as a standalone web application inside your browser:
```bash
npm run dev
```
Open [http://localhost:1420](http://localhost:1420) in your browser.

### Option B: Run as Native Desktop App (Tauri)
Launches the native macOS / Linux / Windows window with native blur, private macOS titlebars, and system media integration:
```bash
npm run tauri dev
```

---

## 🧪 Testing & Verification

Run the automated test suite (database indexing, queue state, audio engine, and multi-source mock integrations):
```bash
npm test
```

Verify the TypeScript compilation and production bundle:
```bash
npm run build
```

Verify the Rust backend:
```bash
cargo check --manifest-path src-tauri/Cargo.toml
```

---

## 📦 Building for Production

### Build Web Application (Static SPA / PWA)
```bash
npm run build
```
Outputs static files to `dist/`. You can deploy this folder to Cloudflare Pages, Vercel, Netlify, or self-host via Nginx / Caddy.

### Build Native Desktop Installers
```bash
npm run tauri build
```
- **macOS**: Generates `.dmg` and `.app` bundles in `src-tauri/target/release/bundle/dmg/`.
- **Windows**: Generates `.msi` and `.exe` installers in `src-tauri/target/release/bundle/msi/`.
- **Linux**: Generates `.deb` and `.AppImage` packages in `src-tauri/target/release/bundle/deb/`.

---

## ⚙️ Configuring Music Sources

Click **"Sync Libraries"** in the sidebar to configure or scan sources:

### 1. Local Storage
- In native desktop mode, point to your local music directory (e.g., `/Users/<username>/Music` or `D:\Music`).
- The scanner automatically parses ID3, Vorbis, and MP4 tags and caches them locally.

### 2. Cloudflare R2 / AWS S3
Configure your bucket credentials in settings:
- **Endpoint**: `https://<account_id>.r2.cloudflarestorage.com`
- **Bucket**: `my-music-vault`
- **Access / Secret Keys** (or set a public custom domain).

### 3. Navidrome / Subsonic
- **Server URL**: `https://navidrome.yourdomain.com`
- **Username**: Your username
- **Password / Token**: Configured in settings (authenticates via secure MD5 token + salt).

---

## 🛠️ Tech Stack

- **Desktop/Mobile Runtime**: [Tauri v2](https://v2.tauri.app/) (Rust)
- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, SF Pro Display / Text typography
- **State Management**: Zustand
- **Virtualization**: TanStack Virtual
- **Audio Decoding & Tags**: Rust `lofty`, `rodio`, `symphonia` + Web Audio API fallback
- **Persistence**: SQLite (native) / IndexedDB (web)
- **Specification System**: [OpenSpec](https://github.com/Fission-AI/OpenSpec)

---

## 📄 License

Open-source under the MIT License.
