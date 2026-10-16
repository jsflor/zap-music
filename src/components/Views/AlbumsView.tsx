import { Disc, Play, ArrowLeft, Clock, Star } from "lucide-react";
import { useLibraryStore } from "../../stores/libraryStore";
import { usePlayerStore } from "../../stores/playerStore";
import { Album } from "../../types/music";

export function AlbumsView() {
  const { albums, selectedAlbum, selectAlbum, toggleFavorite } = useLibraryStore();
  const { playTrack, currentTrack, isPlaying } = usePlayerStore();

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins}:${s < 10 ? "0" : ""}${s}`;
  };

  const handlePlayAlbum = (album: Album, shuffle = false) => {
    if (album.tracks.length === 0) return;
    const tracksToPlay = shuffle ? [...album.tracks].sort(() => Math.random() - 0.5) : album.tracks;
    playTrack(tracksToPlay[0], tracksToPlay);
  };

  if (selectedAlbum) {
    return (
      <div className="flex-1 overflow-y-auto p-8">
        {/* Back navigation */}
        <button
          onClick={() => selectAlbum(null)}
          className="mb-6 flex items-center space-x-1.5 text-xs text-apple-red-dark hover:underline"
        >
          <ArrowLeft size={14} />
          <span>All Albums</span>
        </button>

        {/* Album Header */}
        <div className="flex items-end space-x-6 pb-8 border-b border-apple-border">
          <div className="h-52 w-52 shrink-0 overflow-hidden rounded-lg bg-black/40 shadow-artwork-lg">
            {selectedAlbum.artworkUrl ? (
              <img
                src={selectedAlbum.artworkUrl}
                alt={selectedAlbum.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-apple-text-subtle">
                <Disc size={64} />
              </div>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <span className="text-xs font-semibold tracking-wider text-apple-text-subtle uppercase">
              Album
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-apple-text">
              {selectedAlbum.title}
            </h1>
            <div className="text-sm font-semibold text-apple-red-dark">
              {selectedAlbum.artist}
            </div>
            <div className="text-xs text-apple-text-muted">
              {selectedAlbum.genre ? `${selectedAlbum.genre} • ` : ""}
              {selectedAlbum.year ? `${selectedAlbum.year} • ` : ""}
              {selectedAlbum.trackCount} songs, {Math.round(selectedAlbum.duration / 60)} minutes
            </div>
            {/* Play & Shuffle Buttons */}
            <div className="flex items-center space-x-3 pt-3">
              <button
                onClick={() => handlePlayAlbum(selectedAlbum, false)}
                className="flex items-center space-x-2 rounded-md bg-apple-red-dark px-4 py-1.5 text-xs font-semibold text-white shadow transition-transform hover:scale-105 active:scale-95"
              >
                <Play size={14} fill="currentColor" />
                <span>Play</span>
              </button>
              <button
                onClick={() => handlePlayAlbum(selectedAlbum, true)}
                className="flex items-center space-x-2 rounded-md border border-apple-border bg-apple-hover px-4 py-1.5 text-xs font-semibold text-apple-text transition-colors hover:bg-apple-active active:scale-95"
              >
                <span>Shuffle</span>
              </button>
            </div>
          </div>
        </div>

        {/* Track List */}
        <div className="mt-6">
          <div className="grid grid-cols-[36px_1fr_60px_40px] px-3 pb-2 text-[11px] font-semibold text-apple-text-subtle uppercase border-b border-apple-border">
            <span>#</span>
            <span>Title</span>
            <span className="text-right"><Clock size={13} className="inline" /></span>
            <span></span>
          </div>
          <div className="divide-y divide-apple-border/40">
            {selectedAlbum.tracks.map((track, i) => {
              const isCurrent = currentTrack?.id === track.id;
              return (
                <div
                  key={track.id}
                  onDoubleClick={() => playTrack(track, selectedAlbum.tracks)}
                  className={`group grid grid-cols-[36px_1fr_60px_40px] items-center rounded-md px-3 py-2 text-xs transition-colors hover:bg-apple-hover ${
                    isCurrent ? "text-apple-red-dark font-medium" : "text-apple-text"
                  }`}
                >
                  <span className="text-apple-text-muted group-hover:hidden">
                    {track.trackNumber || i + 1}
                  </span>
                  <button
                    onClick={() => playTrack(track, selectedAlbum.tracks)}
                    className="hidden text-apple-text group-hover:block"
                  >
                    <Play size={12} fill="currentColor" />
                  </button>
                  <span className="truncate">{track.title}</span>
                  <span className="text-right text-apple-text-muted">
                    {formatDuration(track.duration)}
                  </span>
                  <div className="flex justify-center">
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
      </div>
    );
  }

  // Grid of all albums
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-apple-text">Albums</h1>
      {albums.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center text-apple-text-muted">
          <Disc size={48} className="mb-2 text-apple-text-subtle" />
          <p className="text-sm">No albums found in your library.</p>
          <p className="text-xs text-apple-text-subtle">Sync a folder or cloud source to populate your music.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {albums.map((album) => {
            const isPlayingThisAlbum = album.tracks.some((t) => t.id === currentTrack?.id) && isPlaying;
            return (
              <div
                key={album.id}
                onClick={() => selectAlbum(album)}
                className="group cursor-pointer select-none"
              >
                {/* Artwork with play hover button */}
                <div className="relative aspect-square w-full overflow-hidden rounded-md bg-black/40 shadow-artwork transition-transform duration-200 group-hover:shadow-artwork-lg">
                  {album.artworkUrl ? (
                    <img
                      src={album.artworkUrl}
                      alt={album.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-apple-text-subtle">
                      <Disc size={48} />
                    </div>
                  )}

                  {/* Play overlay button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayAlbum(album);
                    }}
                    className={`absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-apple-red-dark text-white shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 ${
                      isPlayingThisAlbum ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <Play size={16} fill="currentColor" className="ml-0.5" />
                  </button>
                </div>

                {/* Album Details */}
                <div className="mt-2 text-xs">
                  <div className="truncate font-semibold text-apple-text group-hover:text-apple-red-dark">
                    {album.title}
                  </div>
                  <div className="truncate text-apple-text-muted">{album.artist}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
