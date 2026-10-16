import { Track, Album, Artist, Playlist, MusicSourceType } from "../../types/music";

export interface SyncProgress {
  scannedCount: number;
  totalEstimate?: number;
  currentFolder?: string;
  isComplete: boolean;
  error?: string;
}

export interface MusicSourceProvider {
  id: string;
  name: string;
  type: MusicSourceType;
  isConnected: boolean;

  connect(): Promise<boolean>;
  disconnect(): Promise<void>;

  scanLibrary?(onProgress?: (progress: SyncProgress) => void): Promise<Track[]>;
  getStreamUrl(track: Track): Promise<string>;
  getArtworkUrl?(track: Track): Promise<string | undefined>;

  // Optional feature supports
  fetchAlbums?(): Promise<Album[]>;
  fetchArtists?(): Promise<Artist[]>;
  fetchPlaylists?(): Promise<Playlist[]>;

  scrobble?(track: Track): Promise<void>;
  setFavorite?(track: Track, favorite: boolean): Promise<void>;
}
