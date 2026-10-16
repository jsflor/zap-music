import { MusicSourceProvider, SyncProgress } from "./types";
import { Track } from "../../types/music";

export class LocalStorageSource implements MusicSourceProvider {
  public id: string;
  public name: string;
  public type = "local" as const;
  public isConnected = false;
  private rootPath: string = "";

  constructor(id: string = "local-default", name: string = "Local Library") {
    this.id = id;
    this.name = name;
  }

  public setPath(path: string) {
    this.rootPath = path;
  }

  public async connect(): Promise<boolean> {
    this.isConnected = true;
    return true;
  }

  public async disconnect(): Promise<void> {
    this.isConnected = false;
  }

  public async scanLibrary(onProgress?: (progress: SyncProgress) => void): Promise<Track[]> {
    const isTauri = typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

    if (isTauri && this.rootPath) {
      try {
        const { invoke } = await import("@tauri-apps/api/core");
        onProgress?.({ scannedCount: 0, currentFolder: this.rootPath, isComplete: false });
        
        interface TauriTrack {
          id: string;
          title: string;
          artist: string;
          album: string;
          album_artist?: string;
          genre?: string;
          year?: number;
          track_number?: number;
          duration_seconds: number;
          file_path: string;
          artwork_base64?: string;
        }

        const rawTracks = await invoke<TauriTrack[]>("scan_folder", {
          folderPath: this.rootPath,
        });

        const tracks: Track[] = rawTracks.map((t) => ({
          id: t.id,
          title: t.title,
          artist: t.artist,
          album: t.album,
          albumArtist: t.album_artist,
          genre: t.genre,
          year: t.year,
          trackNumber: t.track_number,
          duration: t.duration_seconds,
          streamUrl: isTauri
            ? `asset://${t.file_path}` // Tauri custom protocol for local audio streaming
            : t.file_path,
          artworkUrl: t.artwork_base64,
          sourceType: "local",
          sourceId: this.id,
          dateAdded: Date.now(),
        }));

        onProgress?.({ scannedCount: tracks.length, isComplete: true });
        return tracks;
      } catch (err) {
        console.error("Tauri local scan failed:", err);
      }
    }

    // Web Fallback: Mock / Demonstration library of high quality royalty-free demo tracks
    onProgress?.({ scannedCount: 0, currentFolder: "Web Sample Library", isComplete: false });
    const demoTracks: Track[] = [
      {
        id: "demo-track-1",
        title: "Midnight City Groove",
        artist: "Synthwave Collective",
        album: "Neon Horizon",
        albumArtist: "Synthwave Collective",
        genre: "Electronic",
        year: 2024,
        trackNumber: 1,
        duration: 184,
        streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        artworkUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&auto=format&fit=crop&q=80",
        lyrics: "[00:00.00]Midnight City Lights\n[00:15.00]Cruising down the avenue\n[00:30.00]Electric dreams in our eyes\n[00:45.00]Nothing left to lose\n[01:00.00]Neon reflections on the glass\n[01:20.00]Feel the rhythm of the night",
        favorited: true,
        sourceType: "local",
        sourceId: this.id,
        dateAdded: Date.now() - 1000000,
        playedCount: 14,
      },
      {
        id: "demo-track-2",
        title: "Solaris Flare",
        artist: "Aura Nova",
        album: "Astral Echoes",
        albumArtist: "Aura Nova",
        genre: "Ambient",
        year: 2023,
        trackNumber: 2,
        duration: 215,
        streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        artworkUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80",
        favorited: false,
        sourceType: "local",
        sourceId: this.id,
        dateAdded: Date.now() - 2000000,
        playedCount: 8,
      },
      {
        id: "demo-track-3",
        title: "Velvet Rain",
        artist: "Luna Jazz Trio",
        album: "Blue Note Sessions",
        albumArtist: "Luna Jazz Trio",
        genre: "Jazz",
        year: 2022,
        trackNumber: 3,
        duration: 242,
        streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        artworkUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80",
        favorited: true,
        sourceType: "local",
        sourceId: this.id,
        dateAdded: Date.now() - 3000000,
        playedCount: 22,
      },
      {
        id: "demo-track-4",
        title: "Echoes of Dawn",
        artist: "Aura Nova",
        album: "Astral Echoes",
        albumArtist: "Aura Nova",
        genre: "Ambient",
        year: 2023,
        trackNumber: 4,
        duration: 198,
        streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        artworkUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80",
        favorited: false,
        sourceType: "local",
        sourceId: this.id,
        dateAdded: Date.now() - 4000000,
        playedCount: 5,
      },
      {
        id: "demo-track-5",
        title: "Starlight Voyage",
        artist: "Synthwave Collective",
        album: "Neon Horizon",
        albumArtist: "Synthwave Collective",
        genre: "Electronic",
        year: 2024,
        trackNumber: 5,
        duration: 220,
        streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        artworkUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&auto=format&fit=crop&q=80",
        favorited: true,
        sourceType: "local",
        sourceId: this.id,
        dateAdded: Date.now() - 5000000,
        playedCount: 19,
      },
    ];

    onProgress?.({ scannedCount: demoTracks.length, isComplete: true });
    return demoTracks;
  }

  public async getStreamUrl(track: Track): Promise<string> {
    return track.streamUrl;
  }

  public async getArtworkUrl(track: Track): Promise<string | undefined> {
    return track.artworkUrl;
  }
}
