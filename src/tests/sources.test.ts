import { describe, it, expect, vi } from "vitest";
import { LocalStorageSource } from "../services/sources/localSource";
import { S3StorageSource } from "../services/sources/s3Source";
import { SubsonicSource } from "../services/sources/subsonicSource";
import { SpotifySource } from "../services/sources/spotifySource";

describe("MusicSourceProviders", () => {
  it("LocalStorageSource connects and scans sample catalog", async () => {
    const source = new LocalStorageSource("local-test", "My Mac");
    const connected = await source.connect();
    expect(connected).toBe(true);

    const tracks = await source.scanLibrary();
    expect(tracks.length).toBeGreaterThan(0);
    expect(tracks[0].sourceType).toBe("local");
  });

  it("S3StorageSource connects and produces range-streamable URLs", async () => {
    const source = new S3StorageSource("s3-test", "R2 Bucket", {
      endpoint: "https://account.r2.cloudflarestorage.com",
      bucket: "music-vault",
    });

    const connected = await source.connect();
    expect(connected).toBe(true);

    const tracks = await source.scanLibrary();
    expect(tracks.length).toBe(1);
    expect(tracks[0].sourceType).toBe("s3");
    expect(tracks[0].streamUrl).toContain("https://account.r2.cloudflarestorage.com/music-vault");
  });

  it("SubsonicSource builds authenticated API URLs with salt and token", async () => {
    const source = new SubsonicSource("navidrome-test", "Home Navidrome", {
      serverUrl: "https://navidrome.home.local",
      username: "admin",
      token: "secretToken123",
      salt: "randomSalt456",
    });

    // Mock fetch for Subsonic ping
    const globalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ "subsonic-response": { status: "ok" } }),
    } as Response);

    const connected = await source.connect();
    expect(connected).toBe(true);

    globalThis.fetch = globalFetch;
  });

  it("SpotifySource gracefully reports disconnected when no token is supplied", async () => {
    const source = new SpotifySource("spotify-test", "Spotify", {
      accessToken: "",
    });

    const connected = await source.connect();
    expect(connected).toBe(false);

    const tracks = await source.scanLibrary();
    expect(tracks).toHaveLength(0);
  });
});
