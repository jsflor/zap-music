import { useState } from "react";
import { X, Trash2, Clock, Music } from "lucide-react";
import { usePlayerStore } from "../../stores/playerStore";

export function QueueDrawer() {
  const {
    queue,
    queueIndex,
    history,
    currentTrack,
    isQueueOpen,
    toggleQueue,
    removeFromQueue,
    clearQueue,
    playTrack,
  } = usePlayerStore();

  const [activeTab, setActiveTab] = useState<"next" | "history">("next");

  if (!isQueueOpen) return null;

  const upNextTracks = queue.slice(queueIndex + 1);

  return (
    <div className="fixed top-14 right-0 bottom-0 z-30 flex w-80 flex-col border-l border-apple-border bg-apple-sidebar/95 shadow-2xl backdrop-blur-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-apple-border p-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab("next")}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
              activeTab === "next"
                ? "bg-apple-red-dark text-white"
                : "text-apple-text-muted hover:text-apple-text"
            }`}
          >
            Playing Next ({upNextTracks.length})
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
              activeTab === "history"
                ? "bg-apple-red-dark text-white"
                : "text-apple-text-muted hover:text-apple-text"
            }`}
          >
            History
          </button>
        </div>

        <button
          onClick={toggleQueue}
          className="rounded p-1 text-apple-text-muted hover:text-apple-text"
        >
          <X size={15} />
        </button>
      </div>

      {/* Current Playing Song Card */}
      {currentTrack && (
        <div className="border-b border-apple-border p-3">
          <div className="text-[10px] font-semibold text-apple-text-subtle uppercase">Now Playing</div>
          <div className="mt-1 flex items-center space-x-2.5">
            <div className="h-9 w-9 shrink-0 overflow-hidden rounded bg-black/40">
              {currentTrack.artworkUrl ? (
                <img src={currentTrack.artworkUrl} alt={currentTrack.title} className="h-full w-full object-cover" />
              ) : (
                <Music size={16} className="m-auto text-apple-text-muted" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-bold text-apple-red-dark">{currentTrack.title}</div>
              <div className="truncate text-[10px] text-apple-text-muted">{currentTrack.artist}</div>
            </div>
          </div>
        </div>
      )}

      {/* Content List */}
      <div className="flex-1 overflow-y-auto p-2">
        {activeTab === "next" ? (
          upNextTracks.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center text-xs text-apple-text-muted">
              <p>Queue is empty</p>
              <p className="text-[10px] text-apple-text-subtle">Play a song to automatically generate Up Next</p>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex justify-end px-2 pb-1">
                <button
                  onClick={clearQueue}
                  className="flex items-center space-x-1 text-[11px] text-apple-text-subtle hover:text-apple-red-dark"
                >
                  <Trash2 size={11} />
                  <span>Clear Queue</span>
                </button>
              </div>
              {upNextTracks.map((track, i) => {
                const actualIndex = queueIndex + 1 + i;
                return (
                  <div
                    key={`${track.id}-${i}`}
                    onDoubleClick={() => playTrack(track, queue)}
                    className="group flex items-center justify-between rounded-md p-2 text-xs hover:bg-apple-hover"
                  >
                    <div className="flex min-w-0 flex-1 items-center space-x-2">
                      <div className="h-7 w-7 shrink-0 overflow-hidden rounded bg-black/40">
                        {track.artworkUrl ? (
                          <img src={track.artworkUrl} alt={track.title} className="h-full w-full object-cover" />
                        ) : (
                          <Music size={12} className="m-auto text-apple-text-muted" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1 truncate">
                        <div className="truncate font-medium text-apple-text">{track.title}</div>
                        <div className="truncate text-[10px] text-apple-text-muted">{track.artist}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromQueue(actualIndex)}
                      className="hidden text-apple-text-subtle hover:text-apple-red-dark group-hover:block"
                    >
                      <X size={13} />
                    </button>
                  </div>
                );
              })}
            </div>
          )
        ) : history.length === 0 ? (
          <div className="flex h-48 items-center justify-center text-xs text-apple-text-muted">
            No history yet
          </div>
        ) : (
          <div className="space-y-1">
            {history.map((track, i) => (
              <div
                key={`${track.id}-hist-${i}`}
                onDoubleClick={() => playTrack(track)}
                className="flex items-center space-x-2 rounded-md p-2 text-xs hover:bg-apple-hover cursor-pointer"
              >
                <Clock size={12} className="text-apple-text-subtle shrink-0" />
                <div className="min-w-0 flex-1 truncate">
                  <div className="truncate font-medium text-apple-text">{track.title}</div>
                  <div className="truncate text-[10px] text-apple-text-muted">{track.artist}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
