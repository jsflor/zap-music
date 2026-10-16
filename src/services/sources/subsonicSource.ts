import { MusicSourceProvider, SyncProgress } from "./types";
import { Track } from "../../types/music";

export interface SubsonicConfig {
  serverUrl: string; // e.g. "https://music.home.lan"
  username: string;
  token: string;
  salt: string;
}

export class SubsonicSource implements MusicSourceProvider {
  public id: string;
  public name: string;
  public type = "subsonic" as const;
  public isConnected = false;
  private config: SubsonicConfig;

  constructor(id: string, name: string, config: SubsonicConfig) {
    this.id = id;
    this.name = name;
    this.config = config;
  }

  private buildUrl(endpoint: string, params: Record<string, string> = {}): string {
    const cleanUrl = this.config.serverUrl.replace(/\/+$/, "");
    const url = new URL(`${cleanUrl}/rest/${endpoint}`);
    url.searchParams.set("u", this.config.username);
    url.searchParams.set("t", this.config.token);
    url.searchParams.set("s", this.config.salt);
    url.searchParams.set("v", "1.16.1");
    url.searchParams.set("c", "ZapMusic");
    url.searchParams.set("f", "json");

    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, v);
    }
    return url.toString();
  }

  public async connect(): Promise<boolean> {
    try {
      const pingUrl = this.buildUrl("ping.view");
      const res = await fetch(pingUrl);
      const data = await res.json();
      this.isConnected = data?.["subsonic-response"]?.status === "ok";
      return this.isConnected;
    } catch {
      this.isConnected = false;
      return false;
    }
  }

  public async disconnect(): Promise<void> {
    this.isConnected = false;
  }

  public async scanLibrary(onProgress?: (progress: SyncProgress) => void): Promise<Track[]> {
    onProgress?.({ scannedCount: 0, currentFolder: "Navidrome Server", isComplete: false });
    try {
      const url = this.buildUrl("getRandomSongs.view", { size: "50" });
      const res = await fetch(url);
      const json = await res.json();
      const songs = json?.["subsonic-response"]?.randomSongs?.song || [];

      interface SubsonicSong {
        id: string;
        title: string;
        artist: string;
        album: string;
        genre?: string;
        year?: number;
        track?: number;
        duration?: number;
        coverArt?: string;
        starred?: string;
      }

      const tracks: Track[] = songs.map((s: SubsonicSong) => ({
        id: `subsonic-${this.id}-${s.id}`,
        title: s.title || "Untitled",
        artist: s.artist || "Unknown Artist",
        album: s.album || "Unknown Album",
        genre: s.genre,
        year: s.year,
        trackNumber: s.track,
        duration: s.duration || 0,
        streamUrl: this.buildUrl("stream.view", { id: s.id }),
        artworkUrl: s.coverArt ? this.buildUrl("getCoverArt.view", { id: s.coverArt }) : undefined,
        favorited: !!s.starred,
        sourceType: "subsonic",
        sourceId: this.id,
        dateAdded: Date.now(),
      }));

      onProgress?.({ scannedCount: tracks.length, isComplete: true });
      return tracks;
    } catch {
      onProgress?.({ scannedCount: 0, isComplete: true, error: "Unable to reach Subsonic server" });
      return [];
    }
  }

  public async getStreamUrl(track: Track): Promise<string> {
    return track.streamUrl;
  }

  public async scrobble(track: Track): Promise<void> {
    const rawId = track.id.replace(`subsonic-${this.id}-`, "");
    const url = this.buildUrl("scrobble.view", { id: rawId, submission: "true" });
    try {
      await fetch(url);
    } catch (err) {
      console.warn("Subsonic scrobble failed:", err);
    }
  }

  public async setFavorite(track: Track, favorite: boolean): Promise<void> {
    const rawId = track.id.replace(`subsonic-${this.id}-`, "");
    const endpoint = favorite ? "star.view" : "unstar.view";
    const url = this.buildUrl(endpoint, { id: rawId });
    try {
      await fetch(url);
    } catch (err) {
      console.warn("Subsonic star update failed:", err);
    }
  }
}
