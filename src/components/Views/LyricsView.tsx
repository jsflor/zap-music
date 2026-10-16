import { useEffect, useRef, useMemo } from "react";
import { X, Music } from "lucide-react";
import { usePlayerStore } from "../../stores/playerStore";

interface LyricLine {
  time: number;
  text: string;
}

export function LyricsView() {
  const { currentTrack, currentTime, seek, toggleLyrics } = usePlayerStore();
  const activeLineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse LRC timestamps or plain lyrics
  const lyricLines = useMemo<LyricLine[]>(() => {
    if (!currentTrack?.lyrics) return [];

    const lines = currentTrack.lyrics.split("\n");
    const parsed: LyricLine[] = [];
    const lrcRegex = /\[(\d{2}):(\d{2})\.?(\d*)\](.*)/;

    for (const line of lines) {
      const match = line.match(lrcRegex);
      if (match) {
        const mins = parseInt(match[1], 10);
        const secs = parseInt(match[2], 10);
        const ms = match[3] ? parseInt(match[3].padEnd(3, "0"), 10) : 0;
        const time = mins * 60 + secs + ms / 1000;
        const text = match[4].trim();
        if (text) parsed.push({ time, text });
      } else if (line.trim()) {
        // Plain lyric without timestamp
        parsed.push({ time: -1, text: line.trim() });
      }
    }

    return parsed.sort((a, b) => a.time - b.time);
  }, [currentTrack?.lyrics]);

  // Find active line index
  const activeIndex = useMemo(() => {
    if (lyricLines.length === 0 || lyricLines[0].time === -1) return -1;
    let index = -1;
    for (let i = 0; i < lyricLines.length; i++) {
      if (currentTime >= lyricLines[i].time) {
        index = i;
      } else {
        break;
      }
    }
    return index;
  }, [lyricLines, currentTime]);

  // Auto-scroll to active lyric
  useEffect(() => {
    if (activeLineRef.current && containerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeIndex]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-black/90 backdrop-blur-3xl animate-in fade-in duration-300">
      {/* Dynamic Ambient Mesh Gradient Background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 blur-3xl transition-opacity duration-1000"
        style={{
          background: currentTrack?.artworkUrl
            ? `radial-gradient(circle at 30% 30%, #FA2D48 0%, transparent 60%), radial-gradient(circle at 70% 70%, #681525 0%, transparent 70%), url(${currentTrack.artworkUrl}) center/cover no-repeat`
            : "radial-gradient(circle at 50% 50%, #FA2D48 0%, #111111 100%)",
        }}
      />

      {/* Header with track metadata & close button */}
      <div className="relative z-10 flex h-20 items-center justify-between px-8">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 overflow-hidden rounded-md bg-black/40 shadow-lg">
            {currentTrack?.artworkUrl ? (
              <img src={currentTrack.artworkUrl} alt={currentTrack.title} className="h-full w-full object-cover" />
            ) : (
              <Music size={24} className="m-auto text-white/50" />
            )}
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">{currentTrack?.title || "No Track Playing"}</h2>
            <p className="text-xs text-white/70">{currentTrack?.artist} — {currentTrack?.album}</p>
          </div>
        </div>

        <button
          onClick={toggleLyrics}
          className="rounded-full bg-white/10 p-2 text-white/80 backdrop-blur-md transition-colors hover:bg-white/20 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      {/* Lyrics Scrollable Area */}
      <div
        ref={containerRef}
        className="relative z-10 flex-1 overflow-y-auto px-12 py-16 scroll-smooth"
      >
        <div className="mx-auto max-w-3xl space-y-8">
          {lyricLines.length === 0 ? (
            <div className="flex h-96 flex-col items-center justify-center text-white/50">
              <p className="text-xl font-medium">No lyrics available for this song.</p>
            </div>
          ) : (
            lyricLines.map((line, idx) => {
              const isActive = idx === activeIndex;
              const isPast = activeIndex !== -1 && idx < activeIndex;

              return (
                <div
                  key={idx}
                  ref={isActive ? activeLineRef : null}
                  onClick={() => line.time >= 0 && seek(line.time)}
                  className={`cursor-pointer transition-all duration-300 ${
                    isActive
                      ? "text-3xl font-extrabold text-white scale-105 tracking-tight drop-shadow-md"
                      : isPast
                      ? "text-2xl font-semibold text-white/40 hover:text-white/70"
                      : "text-2xl font-semibold text-white/30 hover:text-white/70"
                  }`}
                >
                  {line.text}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
