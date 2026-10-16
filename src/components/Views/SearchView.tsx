import { Play, Disc, Mic2, Star } from "lucide-react";
import { useLibraryStore } from "../../stores/libraryStore";
import { usePlayerStore } from "../../stores/playerStore";

export function SearchView() {
  const { searchQuery, searchResults, selectAlbum, selectArtist, toggleFavorite } = useLibraryStore();
  const { playTrack, currentTrack } = usePlayerStore();

  const { tracks, albums, artists } = searchResults;
  const hasResults = tracks.length > 0 || albums.length > 0 || artists.length > 0;

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-apple-text">Search Results</h1>
        <p className="text-xs text-apple-text-muted mt-1">
          Showing results for "{searchQuery}"
        </p>
      </div>

      {!hasResults ? (
        <div className="flex h-64 flex-col items-center justify-center text-apple-text-muted">
          <p className="text-sm">No matches found for "{searchQuery}".</p>
          <p className="text-xs text-apple-text-subtle mt-1">Try searching by song title, artist, or album name.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Artists Matches */}
          {artists.length > 0 && (
            <div>
              <h2 className="mb-3 text-xs font-semibold tracking-wider text-apple-text-subtle uppercase">
                Artists
              </h2>
              <div className="flex space-x-4 overflow-x-auto pb-2">
                {artists.map((artist) => (
                  <button
                    key={artist.id}
                    onClick={() => selectArtist(artist)}
                    className="flex w-28 shrink-0 flex-col items-center text-center group cursor-pointer"
                  >
                    <div className="h-20 w-20 overflow-hidden rounded-full bg-black/40 shadow">
                      {artist.artworkUrl ? (
                        <img src={artist.artworkUrl} alt={artist.name} className="h-full w-full object-cover" />
                      ) : (
                        <Mic2 size={28} className="m-auto text-apple-text-muted" />
                      )}
                    </div>
                    <span className="mt-2 truncate text-xs font-semibold text-apple-text group-hover:text-apple-red-dark w-full">
                      {artist.name}
                    </span>
                    <span className="text-[10px] text-apple-text-subtle">Artist</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Albums Matches */}
          {albums.length > 0 && (
            <div>
              <h2 className="mb-3 text-xs font-semibold tracking-wider text-apple-text-subtle uppercase">
                Albums
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {albums.map((album) => (
                  <div
                    key={album.id}
                    onClick={() => selectAlbum(album)}
                    className="group cursor-pointer select-none"
                  >
                    <div className="aspect-square w-full overflow-hidden rounded-md bg-black/40 shadow-artwork">
                      {album.artworkUrl ? (
                        <img src={album.artworkUrl} alt={album.title} className="h-full w-full object-cover" />
                      ) : (
                        <Disc size={36} className="m-auto text-apple-text-muted" />
                      )}
                    </div>
                    <div className="mt-1.5 text-xs truncate font-semibold text-apple-text group-hover:text-apple-red-dark">
                      {album.title}
                    </div>
                    <div className="text-[11px] truncate text-apple-text-muted">{album.artist}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Songs Matches */}
          {tracks.length > 0 && (
            <div>
              <h2 className="mb-3 text-xs font-semibold tracking-wider text-apple-text-subtle uppercase">
                Songs
              </h2>
              <div className="divide-y divide-apple-border/40 rounded-lg border border-apple-border bg-apple-hover/40 px-3">
                {tracks.map((track) => {
                  const isCurrent = currentTrack?.id === track.id;
                  return (
                    <div
                      key={track.id}
                      onDoubleClick={() => playTrack(track, tracks)}
                      className={`group flex items-center justify-between py-2.5 text-xs transition-colors ${
                        isCurrent ? "text-apple-red-dark font-medium" : "text-apple-text hover:bg-apple-hover"
                      }`}
                    >
                      <div className="flex min-w-0 flex-1 items-center space-x-3">
                        <button
                          onClick={() => playTrack(track, tracks)}
                          className="text-apple-text-muted hover:text-apple-text"
                        >
                          <Play size={13} fill="currentColor" />
                        </button>
                        <div className="min-w-0 flex-1 truncate">
                          <div className="truncate font-semibold">{track.title}</div>
                          <div className="truncate text-[10px] text-apple-text-muted">
                            {track.artist} — {track.album}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 pl-4 text-apple-text-muted">
                        <span>
                          {Math.floor(track.duration / 60)}:{(track.duration % 60 < 10 ? "0" : "") + (track.duration % 60)}
                        </span>
                        <button
                          onClick={() => toggleFavorite(track.id)}
                          className="text-apple-text-subtle hover:text-apple-red-dark"
                        >
                          <Star
                            size={12}
                            fill={track.favorited ? "currentColor" : "none"}
                            className={track.favorited ? "text-apple-red-dark" : ""}
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
