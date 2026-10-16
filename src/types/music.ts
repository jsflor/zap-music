export type MusicSourceType = "local" | "s3" | "subsonic" | "spotify";

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumArtist?: string;
  genre?: string;
  composer?: string;
  year?: number;
  trackNumber?: number;
  discNumber?: number;
  duration: number; // in seconds
  bitRate?: number;
  sampleRate?: number;
  streamUrl: string;
  artworkUrl?: string;
  lyrics?: string; // synced LRC or plain text
  favorited?: boolean;
  playedCount?: number;
  playedDate?: number;
  dateAdded?: number;
  sourceType: MusicSourceType;
  sourceId: string;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  artworkUrl?: string;
  year?: number;
  trackCount: number;
  duration: number;
  genre?: string;
  tracks: Track[];
}

export interface Artist {
  id: string;
  name: string;
  artworkUrl?: string;
  albumCount: number;
  trackCount: number;
  albums: Album[];
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  artworkUrl?: string;
  trackCount: number;
  duration: number;
  favorited?: boolean;
  isFolder?: boolean;
  parentId?: string;
  tracks: Track[];
}

export type RepeatMode = "off" | "all" | "one";
export type ShuffleMode = "off" | "songs";
