import { Track, Album, Artist, Playlist } from "../types/music";

export interface SearchResults {
  tracks: Track[];
  albums: Album[];
  artists: Artist[];
}

export class LibraryDatabase {
  private tracks: Map<string, Track> = new Map();
  private playlists: Map<string, Playlist> = new Map();
  private dbName = "zap_music_catalog";

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const storedTracks = localStorage.getItem(`${this.dbName}_tracks`);
      if (storedTracks) {
        const parsed: Track[] = JSON.parse(storedTracks);
        parsed.forEach((t) => this.tracks.set(t.id, t));
      }
      const storedPlaylists = localStorage.getItem(`${this.dbName}_playlists`);
      if (storedPlaylists) {
        const parsed: Playlist[] = JSON.parse(storedPlaylists);
        parsed.forEach((p) => this.playlists.set(p.id, p));
      }
    } catch (err) {
      console.warn("Could not load from localStorage:", err);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(
        `${this.dbName}_tracks`,
        JSON.stringify(Array.from(this.tracks.values()))
      );
      localStorage.setItem(
        `${this.dbName}_playlists`,
        JSON.stringify(Array.from(this.playlists.values()))
      );
    } catch (err) {
      console.warn("Could not save to localStorage:", err);
    }
  }

  public upsertTracks(tracks: Track[]): void {
    tracks.forEach((track) => this.tracks.set(track.id, track));
    this.saveToStorage();
  }

  public getAllTracks(): Track[] {
    return Array.from(this.tracks.values());
  }

  public getTrack(id: string): Track | undefined {
    return this.tracks.get(id);
  }

  public setFavorite(trackId: string, favorited: boolean): void {
    const track = this.tracks.get(trackId);
    if (track) {
      track.favorited = favorited;
      this.tracks.set(trackId, { ...track });
      this.saveToStorage();
    }
  }

  public getAlbums(): Album[] {
    const albumMap = new Map<string, Album>();

    for (const track of this.tracks.values()) {
      const key = `${track.album}|||${track.albumArtist || track.artist}`;
      let album = albumMap.get(key);
      if (!album) {
        album = {
          id: `album-${btoa(encodeURIComponent(key)).slice(0, 16)}`,
          title: track.album,
          artist: track.albumArtist || track.artist,
          artworkUrl: track.artworkUrl,
          year: track.year,
          genre: track.genre,
          trackCount: 0,
          duration: 0,
          tracks: [],
        };
        albumMap.set(key, album);
      }
      album.trackCount += 1;
      album.duration += track.duration || 0;
      album.tracks.push(track);
      if (!album.artworkUrl && track.artworkUrl) {
        album.artworkUrl = track.artworkUrl;
      }
    }

    return Array.from(albumMap.values()).sort((a, b) => a.title.localeCompare(b.title));
  }

  public getArtists(): Artist[] {
    const artistMap = new Map<string, Artist>();
    const albums = this.getAlbums();

    for (const album of albums) {
      const key = album.artist;
      let artist = artistMap.get(key);
      if (!artist) {
        artist = {
          id: `artist-${btoa(encodeURIComponent(key)).slice(0, 16)}`,
          name: key,
          artworkUrl: album.artworkUrl,
          albumCount: 0,
          trackCount: 0,
          albums: [],
        };
        artistMap.set(key, artist);
      }
      artist.albumCount += 1;
      artist.trackCount += album.trackCount;
      artist.albums.push(album);
    }

    return Array.from(artistMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  public getPlaylists(): Playlist[] {
    return Array.from(this.playlists.values());
  }

  public createPlaylist(name: string, description?: string): Playlist {
    const id = `playlist-${Date.now()}`;
    const playlist: Playlist = {
      id,
      name,
      description,
      trackCount: 0,
      duration: 0,
      tracks: [],
    };
    this.playlists.set(id, playlist);
    this.saveToStorage();
    return playlist;
  }

  public addTrackToPlaylist(playlistId: string, track: Track): void {
    const playlist = this.playlists.get(playlistId);
    if (playlist) {
      playlist.tracks.push(track);
      playlist.trackCount = playlist.tracks.length;
      playlist.duration += track.duration;
      if (!playlist.artworkUrl && track.artworkUrl) {
        playlist.artworkUrl = track.artworkUrl;
      }
      this.saveToStorage();
    }
  }

  public search(query: string): SearchResults {
    const q = query.trim().toLowerCase();
    if (!q) {
      return { tracks: [], albums: [], artists: [] };
    }

    const matchedTracks = Array.from(this.tracks.values()).filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        t.album.toLowerCase().includes(q)
    );

    const matchedAlbums = this.getAlbums().filter(
      (a) => a.title.toLowerCase().includes(q) || a.artist.toLowerCase().includes(q)
    );

    const matchedArtists = this.getArtists().filter((art) => art.name.toLowerCase().includes(q));

    return {
      tracks: matchedTracks.slice(0, 50),
      albums: matchedAlbums.slice(0, 20),
      artists: matchedArtists.slice(0, 20),
    };
  }
}

export const libraryDb = new LibraryDatabase();
