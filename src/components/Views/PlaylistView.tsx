import { ListMusic, Play, Clock, Star } from "lucide-react";
import { useLibraryStore } from "../../stores/libraryStore";
import { usePlayerStore } from "../../stores/playerStore";

export function PlaylistView() {
  const { selectedPlaylist, toggleFavorite } = useLibraryStore();
  const { playTrack, currentTrack } = usePlayerStore();

  if (!selectedPlaylist) {
    return (
      <div className="flex h-full flex-1 items-center justify-center text-sm text-apple-text-muted">
        Select a playlist from the sidebar.
      </div>
    );
  }

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins}:${s < 10 ? "0" : ""}${s}`;
  };

  const handlePlayPlaylist = (shuffle = false) => {
    if (selectedPlaylist.tracks.length === 0) return;
    const tracksToPlay = shuffle
      ? [...selectedPlaylist.tracks].sort(() => Math.random() - 0.5)
      : selectedPlaylist.tracks;
    playTrack(tracksToPlay[0], tracksToPlay);
  };

  return (
    <div className="flex h-full flex-1 flex-col overflow-y-auto bg-apple-content p-8">
      {/* Header */}
      <div className="flex items-end space-x-6 border-b border-apple-border pb-8">
        <div className="flex h-48 w-48 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-apple-red-dark/80 to-purple-900/80 shadow-artwork-lg">
          {selectedPlaylist.artworkUrl ? (
            <img
              src={selectedPlaylist.artworkUrl}
              alt={selectedPlaylist.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <ListMusic size={64} className="text-white/70" />
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <span className="text-xs font-semibold tracking-wider text-apple-text-subtle uppercase">
            Playlist
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-apple-text">
            {selectedPlaylist.name}
          </h1>
          {selectedPlaylist.description && (
            <p className="text-xs text-apple-text-muted max-w-lg">
              {selectedPlaylist.description}
            </p>
          )}
          <div className="text-xs text-apple-text-muted">
            {selectedPlaylist.trackCount} songs, {Math.round(selectedPlaylist.duration / 60)} minutes
          </div>
          {/* Action buttons */}
          <div className="flex items-center space-x-3 pt-3">
            <button
              onClick={() => handlePlayPlaylist(false)}
              className="flex items-center space-x-2 rounded-md bg-apple-red-dark px-4 py-1.5 text-xs font-semibold text-white shadow transition-transform hover:scale-105 active:scale-95"
            >
              <Play size={14} fill="currentColor" />
              <span>Play</span>
            </button>
            <button
              onClick={() => handlePlayPlaylist(true)}
              className="flex items-center space-x-2 rounded-md border border-apple-border bg-apple-hover px-4 py-1.5 text-xs font-semibold text-apple-text transition-colors hover:bg-apple-active active:scale-95"
            >
              <span>Shuffle</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tracks */}
      <div className="mt-6">
        <div className="grid grid-cols-[36px_2fr_1.5fr_1.5fr_70px_40px] px-3 pb-2 text-[11px] font-semibold text-apple-text-subtle uppercase border-b border-apple-border">
          <span>#</span>
          <span>Title</span>
          <span>Artist</span>
          <span>Album</span>
          <span className="text-right"><Clock size={12} className="inline" /></span>
          <span className="text-center">Fav</span>
        </div>
        <div className="divide-y divide-apple-border/40">
          {selectedPlaylist.tracks.map((track, i) => {
            const isCurrent = currentTrack?.id === track.id;
            return (
              <div
                key={`${track.id}-${i}`}
                onDoubleClick={() => playTrack(track, selectedPlaylist.tracks)}
                className={`group grid grid-cols-[36px_2fr_1.5fr_1.5fr_70px_40px] items-center rounded-md px-3 py-2 text-xs transition-colors hover:bg-apple-hover ${
                  isCurrent ? "text-apple-red-dark font-medium" : "text-apple-text"
                }`}
              >
                <span className="text-apple-text-muted group-hover:hidden">{i + 1}</span>
                <button
                  onClick={() => playTrack(track, selectedPlaylist.tracks)}
                  className="hidden text-apple-text group-hover:block"
                >
                  <Play size={12} fill="currentColor" />
                </button>
                <span className="truncate pr-2 font-medium">{track.title}</span>
                <span className="truncate pr-2 text-apple-text-muted">{track.artist}</span>
                <span className="truncate pr-2 text-apple-text-muted">{track.album}</span>
                <span className="text-right text-apple-text-muted">{formatDuration(track.duration)}</span>
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
