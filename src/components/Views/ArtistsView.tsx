import { Mic2, Play, Disc } from "lucide-react";
import { useLibraryStore } from "../../stores/libraryStore";
import { usePlayerStore } from "../../stores/playerStore";

export function ArtistsView() {
  const { artists, selectedArtist, selectArtist } = useLibraryStore();
  const { playTrack, currentTrack } = usePlayerStore();

  const currentSelected = selectedArtist || artists[0] || null;

  return (
    <div className="flex h-full flex-1 overflow-hidden bg-apple-content">
      {/* Left Artists Master Column */}
      <div className="w-64 overflow-y-auto border-r border-apple-border p-3">
        <h2 className="mb-3 px-3 text-xs font-semibold tracking-wider text-apple-text-subtle uppercase">
          Artists ({artists.length})
        </h2>
        <div className="space-y-0.5">
          {artists.map((artist) => {
            const isSelected = currentSelected?.id === artist.id;
            return (
              <button
                key={artist.id}
                onClick={() => selectArtist(artist)}
                className={`flex w-full items-center space-x-3 rounded-md px-3 py-2 text-left text-xs transition-colors ${
                  isSelected
                    ? "bg-apple-red-dark text-white font-medium"
                    : "text-apple-text hover:bg-apple-hover"
                }`}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-black/40 shadow">
                  {artist.artworkUrl ? (
                    <img src={artist.artworkUrl} alt={artist.name} className="h-full w-full object-cover" />
                  ) : (
                    <Mic2 size={14} className={isSelected ? "text-white" : "text-apple-text-muted"} />
                  )}
                </div>
                <div className="min-w-0 flex-1 truncate">
                  <div className="truncate font-medium">{artist.name}</div>
                  <div className={`truncate text-[10px] ${isSelected ? "text-white/80" : "text-apple-text-muted"}`}>
                    {artist.albumCount} {artist.albumCount === 1 ? "album" : "albums"}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Artist Detail & Discography Column */}
      <div className="flex-1 overflow-y-auto p-8">
        {currentSelected ? (
          <div>
            {/* Artist Header */}
            <div className="mb-8 flex items-center space-x-6 border-b border-apple-border pb-6">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-black/40 shadow-artwork">
                {currentSelected.artworkUrl ? (
                  <img src={currentSelected.artworkUrl} alt={currentSelected.name} className="h-full w-full object-cover" />
                ) : (
                  <Mic2 size={40} className="text-apple-text-muted" />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-apple-text">{currentSelected.name}</h1>
                <p className="text-xs text-apple-text-muted mt-1">
                  {currentSelected.albumCount} albums • {currentSelected.trackCount} songs
                </p>
              </div>
            </div>

            {/* Discography */}
            <div className="space-y-8">
              {currentSelected.albums.map((album) => (
                <div key={album.id} className="space-y-3">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded bg-black/40 shadow">
                      {album.artworkUrl ? (
                        <img src={album.artworkUrl} alt={album.title} className="h-full w-full object-cover" />
                      ) : (
                        <Disc size={24} className="m-auto text-apple-text-muted" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-apple-text">{album.title}</h3>
                      <div className="text-xs text-apple-text-muted">
                        {album.year ? `${album.year} • ` : ""}
                        {album.trackCount} tracks
                      </div>
                    </div>
                  </div>

                  {/* Album Tracks */}
                  <div className="divide-y divide-apple-border/40 rounded-lg border border-apple-border/60 bg-apple-hover/40 px-3">
                    {album.tracks.map((track, i) => {
                      const isCurrent = currentTrack?.id === track.id;
                      return (
                        <div
                          key={track.id}
                          onDoubleClick={() => playTrack(track, album.tracks)}
                          className={`group flex items-center justify-between py-2 text-xs transition-colors ${
                            isCurrent ? "text-apple-red-dark font-medium" : "text-apple-text"
                          }`}
                        >
                          <div className="flex items-center space-x-3 truncate">
                            <span className="w-5 text-apple-text-muted group-hover:hidden">
                              {track.trackNumber || i + 1}
                            </span>
                            <button
                              onClick={() => playTrack(track, album.tracks)}
                              className="hidden w-5 text-apple-text group-hover:block"
                            >
                              <Play size={11} fill="currentColor" />
                            </button>
                            <span className="truncate">{track.title}</span>
                          </div>
                          <span className="text-apple-text-muted">
                            {Math.floor(track.duration / 60)}:{(track.duration % 60 < 10 ? "0" : "") + (track.duration % 60)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-apple-text-muted">
            Select an artist from the list.
          </div>
        )}
      </div>
    </div>
  );
}
