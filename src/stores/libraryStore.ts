import { create } from "zustand";
import { Track, Album, Artist, Playlist } from "../types/music";
import { libraryDb, SearchResults } from "../services/database";
import { LocalStorageSource } from "../services/sources/localSource";
import { MusicSourceProvider } from "../services/sources/types";

export type LibraryView = "recently-added" | "artists" | "albums" | "songs" | "playlist" | "search";

interface LibraryState {
  tracks: Track[];
  albums: Album[];
  artists: Artist[];
  playlists: Playlist[];
  sources: MusicSourceProvider[];

  selectedView: LibraryView;
  selectedAlbum: Album | null;
  selectedArtist: Artist | null;
  selectedPlaylist: Playlist | null;

  searchQuery: string;
  searchResults: SearchResults;
  isSyncing: boolean;

  // Actions
  setView: (view: LibraryView) => void;
  selectAlbum: (album: Album | null) => void;
  selectArtist: (artist: Artist | null) => void;
  selectPlaylist: (playlist: Playlist | null) => void;
  setSearchQuery: (query: string) => void;
  toggleFavorite: (trackId: string) => void;
  createPlaylist: (name: string, description?: string) => Playlist;
  addTrackToPlaylist: (playlistId: string, track: Track) => void;
  refreshFromDb: () => void;
  syncSources: () => Promise<void>;
}

const defaultLocalSource = new LocalStorageSource();

export const useLibraryStore = create<LibraryState>((set, get) => ({
  tracks: libraryDb.getAllTracks(),
  albums: libraryDb.getAlbums(),
  artists: libraryDb.getArtists(),
  playlists: libraryDb.getPlaylists(),
  sources: [defaultLocalSource],

  selectedView: "recently-added",
  selectedAlbum: null,
  selectedArtist: null,
  selectedPlaylist: null,

  searchQuery: "",
  searchResults: { tracks: [], albums: [], artists: [] },
  isSyncing: false,

  setView: (view) => set({ selectedView: view }),
  selectAlbum: (album) => set({ selectedAlbum: album, selectedView: "albums" }),
  selectArtist: (artist) => set({ selectedArtist: artist, selectedView: "artists" }),
  selectPlaylist: (playlist) => set({ selectedPlaylist: playlist, selectedView: "playlist" }),

  setSearchQuery: (query) => {
    const results = libraryDb.search(query);
    set({
      searchQuery: query,
      searchResults: results,
      selectedView: query.trim() ? "search" : get().selectedView === "search" ? "songs" : get().selectedView,
    });
  },

  toggleFavorite: (trackId) => {
    const track = libraryDb.getTrack(trackId);
    if (track) {
      const nextFav = !track.favorited;
      libraryDb.setFavorite(trackId, nextFav);
      get().refreshFromDb();
    }
  },

  createPlaylist: (name, description) => {
    const p = libraryDb.createPlaylist(name, description);
    get().refreshFromDb();
    return p;
  },

  addTrackToPlaylist: (playlistId, track) => {
    libraryDb.addTrackToPlaylist(playlistId, track);
    get().refreshFromDb();
  },

  refreshFromDb: () => {
    set({
      tracks: libraryDb.getAllTracks(),
      albums: libraryDb.getAlbums(),
      artists: libraryDb.getArtists(),
      playlists: libraryDb.getPlaylists(),
    });
  },

  syncSources: async () => {
    set({ isSyncing: true });
    try {
      const { sources } = get();
      for (const source of sources) {
        if (source.scanLibrary) {
          const newTracks = await source.scanLibrary();
          libraryDb.upsertTracks(newTracks);
        }
      }
      get().refreshFromDb();
    } catch (err) {
      console.error("Sync sources error:", err);
    } finally {
      set({ isSyncing: false });
    }
  },
}));
