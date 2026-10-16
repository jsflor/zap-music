import { useRef, useState, useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Play, Clock, Star, ArrowUpDown } from "lucide-react";
import { useLibraryStore } from "../../stores/libraryStore";
import { usePlayerStore } from "../../stores/playerStore";

type SortField = "title" | "artist" | "album" | "duration" | "playedCount";

export function SongsView() {
  const { tracks, toggleFavorite } = useLibraryStore();
  const { playTrack, currentTrack } = usePlayerStore();
  const [sortField, setSortField] = useState<SortField>("title");
  const [sortAsc, setSortAsc] = useState(true);

  const parentRef = useRef<HTMLDivElement>(null);

  const sortedTracks = useMemo(() => {
    return [...tracks].sort((a, b) => {
      let valA: string | number = a[sortField] || "";
      let valB: string | number = b[sortField] || "";

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [tracks, sortField, sortAsc]);

  const rowVirtualizer = useVirtualizer({
    count: sortedTracks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 36,
    overscan: 10,
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden bg-apple-content p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-apple-text">Songs</h1>
        <div className="text-xs text-apple-text-muted">{tracks.length} songs</div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-[36px_2fr_1.5fr_1.5fr_70px_60px_40px] items-center border-b border-apple-border px-3 py-2 text-[11px] font-semibold text-apple-text-subtle uppercase select-none">
        <span>#</span>
        <button
          onClick={() => handleSort("title")}
          className="flex items-center space-x-1 text-left hover:text-apple-text"
        >
          <span>Title</span>
          <ArrowUpDown size={11} />
        </button>
        <button
          onClick={() => handleSort("artist")}
          className="flex items-center space-x-1 text-left hover:text-apple-text"
        >
          <span>Artist</span>
          <ArrowUpDown size={11} />
        </button>
        <button
          onClick={() => handleSort("album")}
          className="flex items-center space-x-1 text-left hover:text-apple-text"
        >
          <span>Album</span>
          <ArrowUpDown size={11} />
        </button>
        <button
          onClick={() => handleSort("duration")}
          className="flex items-center justify-end space-x-1 hover:text-apple-text text-right"
        >
          <Clock size={12} />
        </button>
        <button
          onClick={() => handleSort("playedCount")}
          className="text-right hover:text-apple-text"
        >
          Plays
        </button>
        <span className="text-center">Fav</span>
      </div>

      {/* Virtualized Rows Container */}
      <div ref={parentRef} className="flex-1 overflow-y-auto">
        {sortedTracks.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-sm text-apple-text-muted">
            No songs available in your library.
          </div>
        ) : (
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const track = sortedTracks[virtualRow.index];
              const isCurrent = currentTrack?.id === track.id;

              return (
                <div
                  key={track.id}
                  onDoubleClick={() => playTrack(track, sortedTracks)}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  className={`group grid grid-cols-[36px_2fr_1.5fr_1.5fr_70px_60px_40px] items-center px-3 text-xs rounded transition-colors hover:bg-apple-hover ${
                    isCurrent ? "text-apple-red-dark font-medium bg-apple-hover" : "text-apple-text"
                  }`}
                >
                  <span className="text-apple-text-muted group-hover:hidden">
                    {virtualRow.index + 1}
                  </span>
                  <button
                    onClick={() => playTrack(track, sortedTracks)}
                    className="hidden text-apple-text group-hover:block"
                  >
                    <Play size={12} fill="currentColor" />
                  </button>

                  <span className="truncate pr-2 font-medium">{track.title}</span>
                  <span className="truncate pr-2 text-apple-text-muted">{track.artist}</span>
                  <span className="truncate pr-2 text-apple-text-muted">{track.album}</span>
                  <span className="text-right text-apple-text-muted">
                    {formatDuration(track.duration)}
                  </span>
                  <span className="text-right text-apple-text-subtle">
                    {track.playedCount || 0}
                  </span>
                  <div className="flex justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(track.id);
                      }}
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
        )}
      </div>
    </div>
  );
}
