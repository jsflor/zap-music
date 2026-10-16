import { MusicSourceProvider, SyncProgress } from "./types";
import { Track } from "../../types/music";

export interface S3SourceConfig {
  endpoint: string; // e.g. "https://<account_id>.r2.cloudflarestorage.com"
  bucket: string;
  region?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  publicUrlPrefix?: string; // Optional custom domain / CDN
}

export class S3StorageSource implements MusicSourceProvider {
  public id: string;
  public name: string;
  public type = "s3" as const;
  public isConnected = false;
  private config: S3SourceConfig;

  constructor(id: string, name: string, config: S3SourceConfig) {
    this.id = id;
    this.name = name;
    this.config = config;
  }

  public async connect(): Promise<boolean> {
    try {
      this.isConnected = true;
      return true;
    } catch {
      this.isConnected = false;
      return false;
    }
  }

  public async disconnect(): Promise<void> {
    this.isConnected = false;
  }

  public async scanLibrary(onProgress?: (progress: SyncProgress) => void): Promise<Track[]> {
    onProgress?.({ scannedCount: 0, currentFolder: `s3://${this.config.bucket}`, isComplete: false });
    
    // In production, listObjectsV2 or server-side manifest is fetched.
    // Demonstrating S3 Range-streaming track structure:
    const basePrefix = this.config.publicUrlPrefix || `${this.config.endpoint}/${this.config.bucket}`;
    
    const sampleS3Tracks: Track[] = [
      {
        id: `s3-${this.id}-01`,
        title: "Cloud Nine Echoes",
        artist: "Horizon Stream",
        album: "Stratosphere",
        albumArtist: "Horizon Stream",
        genre: "Cloud Ambient",
        year: 2024,
        trackNumber: 1,
        duration: 260,
        streamUrl: `${basePrefix}/audio/cloud_nine.mp3`,
        artworkUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80",
        sourceType: "s3",
        sourceId: this.id,
        dateAdded: Date.now(),
      },
    ];

    onProgress?.({ scannedCount: sampleS3Tracks.length, isComplete: true });
    return sampleS3Tracks;
  }

  public async getStreamUrl(track: Track): Promise<string> {
    return track.streamUrl;
  }
}
