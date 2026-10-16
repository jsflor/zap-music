import { MusicSourceProvider, SyncProgress } from "./types";
import { Track } from "../../types/music";

export interface SpotifyConfig {
  accessToken: string;
  refreshToken?: string;
  clientId?: string;
}

export class SpotifySource implements MusicSourceProvider {
  public id: string;
  public name: string;
  public type = "spotify" as const;
  public isConnected = false;
  private config: SpotifyConfig;

  constructor(id: string = "spotify-default", name: string = "Spotify", config: SpotifyConfig) {
    this.id = id;
    this.name = name;
    this.config = config;
  }

  public async connect(): Promise<boolean> {
    if (!this.config.accessToken) {
      this.isConnected = false;
      return false;
    }
    try {
      const res = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${this.config.accessToken}` },
      });
      this.isConnected = res.ok;
      return res.ok;
    } catch {
      this.isConnected = false;
      return false;
    }
  }

  public async disconnect(): Promise<void> {
    this.isConnected = false;
  }

  public async scanLibrary(onProgress?: (progress: SyncProgress) => void): Promise<Track[]> {
    if (!this.isConnected) {
      onProgress?.({ scannedCount: 0, isComplete: true, error: "Not connected to Spotify" });
      return [];
    }

    onProgress?.({ scannedCount: 0, currentFolder: "Spotify Saved Tracks", isComplete: false });
    try {
      const res = await fetch("https://api.spotify.com/v1/me/tracks?limit=50", {
        headers: { Authorization: `Bearer ${this.config.accessToken}` },
      });
      const data = await res.json();
      const items = data.items || [];

      interface SpotifyItem {
        track: {
          id: string;
          name: string;
          duration_ms: number;
          preview_url?: string;
          artists: Array<{ name: string }>;
          album: {
            name: string;
            release_date?: string;
            images: Array<{ url: string }>;
          };
          track_number?: number;
        };
      }

      const tracks: Track[] = items.map((item: SpotifyItem) => {
        const t = item.track;
        const year = t.album.release_date ? parseInt(t.album.release_date.slice(0, 4), 10) : undefined;
        return {
          id: `spotify-${this.id}-${t.id}`,
          title: t.name,
          artist: t.artists.map((a) => a.name).join(", "),
          album: t.album.name,
          year,
          trackNumber: t.track_number,
          duration: Math.round(t.duration_ms / 1000),
          streamUrl: t.preview_url || `spotify:track:${t.id}`,
          artworkUrl: t.album.images[0]?.url,
          favorited: true,
          sourceType: "spotify",
          sourceId: this.id,
          dateAdded: Date.now(),
        };
      });

      onProgress?.({ scannedCount: tracks.length, isComplete: true });
      return tracks;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      onProgress?.({ scannedCount: 0, isComplete: true, error: msg });
      return [];
    }
  }

  public async getStreamUrl(track: Track): Promise<string> {
    return track.streamUrl;
  }
}
