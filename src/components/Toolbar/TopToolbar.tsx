import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  ListMusic,
  Quote,
  Search,
  Star,
  Music,
} from "lucide-react";
import { usePlayerStore } from "../../stores/playerStore";
import { useLibraryStore } from "../../stores/libraryStore";

export function TopToolbar() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    repeatMode,
    isShuffled,
    isLyricsOpen,
    isQueueOpen,
    togglePlay,
    prevTrack,
    nextTrack,
    seek,
    setVolume,
    toggleMute,
    toggleRepeat,
    toggleShuffle,
    toggleLyrics,
    toggleQueue,
  } = usePlayerStore();

  const { searchQuery, setSearchQuery, toggleFavorite } = useLibraryStore();

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds) || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const remainingTime = duration > 0 ? duration - currentTime : 0;

  return (
    <header className="titlebar-drag-region flex h-14 w-full select-none items-center justify-between border-b border-apple-border bg-apple-sidebar/80 px-4 backdrop-blur-xl">
      {/* Left Transport & Volume Controls */}
      <div className="no-drag flex items-center space-x-3">
        {/* Shuffle */}
        <button
          onClick={toggleShuffle}
          title="Shuffle"
          className={`rounded p-1.5 transition-colors ${
            isShuffled ? "text-apple-red-dark" : "text-apple-text-muted hover:text-apple-text"
          }`}
        >
          <Shuffle size={14} />
        </button>

        {/* Previous Track */}
        <button
          onClick={prevTrack}
          title="Previous Track"
          className="rounded p-1.5 text-apple-text-muted transition-colors hover:text-apple-text active:scale-95"
        >
          <SkipBack size={17} />
        </button>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          title={isPlaying ? "Pause" : "Play"}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-apple-text text-apple-content shadow transition-transform hover:scale-105 active:scale-95"
        >
          {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
        </button>

        {/* Next Track */}
        <button
          onClick={nextTrack}
          title="Next Track"
          className="rounded p-1.5 text-apple-text-muted transition-colors hover:text-apple-text active:scale-95"
        >
          <SkipForward size={17} />
        </button>

        {/* Repeat Mode */}
        <button
          onClick={toggleRepeat}
          title="Repeat Mode"
          className={`rounded p-1.5 transition-colors ${
            repeatMode !== "off" ? "text-apple-red-dark" : "text-apple-text-muted hover:text-apple-text"
          }`}
        >
          {repeatMode === "one" ? <Repeat1 size={15} /> : <Repeat size={15} />}
        </button>

        {/* Volume Slider */}
        <div className="flex items-center space-x-1.5 pl-2">
          <button
            onClick={toggleMute}
            className="text-apple-text-muted transition-colors hover:text-apple-text"
          >
            {isMuted || volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="h-1 w-16"
          />
        </div>
      </div>

      {/* Center LCD Capsule Display */}
      <div className="no-drag flex w-[380px] max-w-[45vw] items-center space-x-2.5 rounded-lg border border-apple-lcd-border bg-apple-lcd px-3 py-1 shadow-lcd backdrop-blur-md">
        {/* Cover Art Thumbnail */}
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded bg-black/40 shadow">
          {currentTrack?.artworkUrl ? (
            <img
              src={currentTrack.artworkUrl}
              alt={currentTrack.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <Music size={16} className="text-apple-text-muted" />
          )}
        </div>

        {/* Metadata & Interactive Scrubber */}
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <div className="flex items-center justify-between">
            <div className="truncate text-xs font-semibold leading-tight text-apple-text">
              {currentTrack?.title || "Not Playing"}
            </div>
            {currentTrack && (
              <button
                onClick={() => toggleFavorite(currentTrack.id)}
                className="ml-1 text-apple-text-muted hover:text-apple-red-dark"
              >
                <Star
                  size={12}
                  fill={currentTrack.favorited ? "currentColor" : "none"}
                  className={currentTrack.favorited ? "text-apple-red-dark" : ""}
                />
              </button>
            )}
          </div>
          <div className="truncate text-[10px] text-apple-text-muted">
            {currentTrack ? `${currentTrack.artist} — ${currentTrack.album}` : "Select a song to start listening"}
          </div>

          {/* Scrubber Bar */}
          <div className="mt-1 flex items-center space-x-1.5 text-[9px] font-mono text-apple-text-subtle">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.5"
              value={currentTime}
              onChange={(e) => seek(parseFloat(e.target.value))}
              disabled={!currentTrack}
              className="h-1 flex-1 disabled:opacity-40"
            />
            <span>{duration > 0 ? `-${formatTime(remainingTime)}` : "--:--"}</span>
          </div>
        </div>
      </div>

      {/* Right Search & Utility Toggles */}
      <div className="no-drag flex items-center space-x-2">
        {/* Lyrics Button */}
        <button
          onClick={toggleLyrics}
          title="Lyrics"
          className={`rounded-md p-1.5 transition-colors ${
            isLyricsOpen
              ? "bg-apple-red-dark text-white"
              : "text-apple-text-muted hover:bg-apple-hover hover:text-apple-text"
          }`}
        >
          <Quote size={15} />
        </button>

        {/* Playing Next / Queue Button */}
        <button
          onClick={toggleQueue}
          title="Playing Next Queue"
          className={`rounded-md p-1.5 transition-colors ${
            isQueueOpen
              ? "bg-apple-red-dark text-white"
              : "text-apple-text-muted hover:bg-apple-hover hover:text-apple-text"
          }`}
        >
          <ListMusic size={16} />
        </button>

        {/* Search Field */}
        <div className="relative flex items-center">
          <Search size={13} className="pointer-events-none absolute left-2 text-apple-text-subtle" />
          <input
            type="text"
            placeholder="Artists, Songs, Lyrics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-7 w-40 rounded-md border border-apple-border bg-black/20 pl-7 pr-2 text-xs text-apple-text placeholder-apple-text-subtle focus:border-apple-red-dark focus:outline-none focus:ring-1 focus:ring-apple-red-dark"
          />
        </div>
      </div>
    </header>
  );
}
