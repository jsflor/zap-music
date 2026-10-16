import { describe, it, expect, beforeEach } from "vitest";
import { LibraryDatabase } from "../services/database";
import { Track } from "../types/music";

describe("LibraryDatabase", () => {
  let db: LibraryDatabase;

  const mockTrack1: Track = {
    id: "test-1",
    title: "Blue in Green",
    artist: "Miles Davis",
    album: "Kind of Blue",
    duration: 337,
    streamUrl: "http://example.com/blue.mp3",
    sourceType: "local",
    sourceId: "local-1",
    favorited: false,
    playedCount: 10,
  };

  const mockTrack2: Track = {
    id: "test-2",
    title: "So What",
    artist: "Miles Davis",
    album: "Kind of Blue",
    duration: 562,
    streamUrl: "http://example.com/so_what.mp3",
    sourceType: "local",
    sourceId: "local-1",
    favorited: true,
    playedCount: 25,
  };

  beforeEach(() => {
    localStorage.clear();
    db = new LibraryDatabase();
  });

  it("should upsert tracks and query them correctly", () => {
    db.upsertTracks([mockTrack1, mockTrack2]);
    const all = db.getAllTracks();
    expect(all).toHaveLength(2);
    expect(db.getTrack("test-1")?.title).toBe("Blue in Green");
  });

  it("should aggregate albums and calculate total tracks and duration", () => {
    db.upsertTracks([mockTrack1, mockTrack2]);
    const albums = db.getAlbums();
    expect(albums).toHaveLength(1);
    expect(albums[0].title).toBe("Kind of Blue");
    expect(albums[0].trackCount).toBe(2);
    expect(albums[0].duration).toBe(899);
  });

  it("should aggregate artists correctly", () => {
    db.upsertTracks([mockTrack1, mockTrack2]);
    const artists = db.getArtists();
    expect(artists).toHaveLength(1);
    expect(artists[0].name).toBe("Miles Davis");
    expect(artists[0].trackCount).toBe(2);
  });

  it("should perform fast search under 50ms", () => {
    db.upsertTracks([mockTrack1, mockTrack2]);
    const start = performance.now();
    const results = db.search("Miles");
    const elapsed = performance.now() - start;

    expect(results.tracks).toHaveLength(2);
    expect(results.artists).toHaveLength(1);
    expect(results.albums).toHaveLength(1);
    expect(elapsed).toBeLessThan(50);
  });

  it("should create and manage playlists", () => {
    const playlist = db.createPlaylist("Jazz Classics", "Essential cool jazz");
    expect(playlist.name).toBe("Jazz Classics");
    expect(db.getPlaylists()).toHaveLength(1);

    db.addTrackToPlaylist(playlist.id, mockTrack1);
    const updated = db.getPlaylists()[0];
    expect(updated.tracks).toHaveLength(1);
    expect(updated.duration).toBe(337);
  });

  it("should toggle favorites", () => {
    db.upsertTracks([mockTrack1]);
    expect(db.getTrack("test-1")?.favorited).toBe(false);

    db.setFavorite("test-1", true);
    expect(db.getTrack("test-1")?.favorited).toBe(true);
  });
});
