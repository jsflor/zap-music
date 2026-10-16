import { Play, Pause, SkipBack, SkipForward, Maximize2, Music } from "lucide-react";
import { usePlayerStore } from "../../stores/playerStore";

export function MiniPlayerView() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    prevTrack,
    nextTrack,
    seek,
    toggleMiniPlayer,
  } = usePlayerStore();

  const formatTime = (secs: number) => {
    if (!isFinite(secs) || secs < 0) return "0:00";
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 flex w-80 items-center space-x-3 rounded-xl border border-apple-border bg-apple-sidebar/95 p-3 shadow-2xl backdrop-blur-2xl">
      {/* Artwork */}
      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-black/50 shadow">
        {currentTrack?.artworkUrl ? (
          <img src={currentTrack.artworkUrl} alt={currentTrack.title} className="h-full w-full object-cover" />
        ) : (
          <Music size={20} className="text-apple-text-muted" />
        )}
      </div>

      {/* Info & Controls */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <div className="truncate text-xs font-bold text-apple-text">
            {currentTrack?.title || "Not Playing"}
          </div>
          <button
            onClick={toggleMiniPlayer}
            title="Expand to Full Player"
            className="text-apple-text-muted hover:text-apple-text"
          >
            <Maximize2 size={13} />
          </button>
        </div>
        <div className="truncate text-[10px] text-apple-text-muted">{currentTrack?.artist || "—"}</div>

        {/* Scrubber */}
        <div className="mt-1 flex items-center space-x-1.5 text-[9px] font-mono text-apple-text-subtle">
          <input
            type="range"
            min="0"
            max={duration || 100}
            step="0.5"
            value={currentTime}
            onChange={(e) => seek(parseFloat(e.target.value))}
            className="h-1 flex-1"
          />
          <span>{formatTime(currentTime)}</span>
        </div>

        {/* Transport */}
        <div className="mt-1 flex items-center justify-center space-x-3">
          <button onClick={prevTrack} className="text-apple-text-muted hover:text-apple-text">
            <SkipBack size={13} />
          </button>
          <button
            onClick={togglePlay}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-apple-text text-apple-content shadow"
          >
            {isPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" className="ml-0.5" />}
          </button>
          <button onClick={nextTrack} className="text-apple-text-muted hover:text-apple-text">
            <SkipForward size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
