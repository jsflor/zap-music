import { Disc, Play } from "lucide-react";
import { useLibraryStore } from "../../stores/libraryStore";
import { usePlayerStore } from "../../stores/playerStore";

export function RecentlyAddedView() {
  const { albums, selectAlbum } = useLibraryStore();
  const { playTrack, currentTrack, isPlaying } = usePlayerStore();

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-apple-text">Recently Added</h1>
        <p className="text-xs text-apple-text-muted mt-1">Latest albums and tracks added to your collection</p>
      </div>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {albums.map((album) => {
          const isPlayingThisAlbum = album.tracks.some((t) => t.id === currentTrack?.id) && isPlaying;
          return (
            <div
              key={album.id}
              onClick={() => selectAlbum(album)}
              className="group cursor-pointer select-none"
            >
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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (album.tracks.length > 0) {
                      playTrack(album.tracks[0], album.tracks);
                    }
                  }}
                  className={`absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-apple-red-dark text-white shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 ${
                    isPlayingThisAlbum ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  <Play size={16} fill="currentColor" className="ml-0.5" />
                </button>
              </div>

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
    </div>
  );
}
