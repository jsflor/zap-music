import {
  Clock,
  Mic2,
  Disc3,
  Music2,
  Sparkles,
  Plus,
  ListMusic,
  RefreshCw,
} from "lucide-react";
import { useLibraryStore, LibraryView } from "../../stores/libraryStore";

export function Sidebar() {
  const {
    selectedView,
    setView,
    playlists,
    selectedPlaylist,
    selectPlaylist,
    createPlaylist,
    isSyncing,
    syncSources,
  } = useLibraryStore();

  const handleCreatePlaylist = () => {
    const name = prompt("Enter playlist title:", "New Playlist");
    if (name?.trim()) {
      const p = createPlaylist(name.trim());
      selectPlaylist(p);
    }
  };

  const navItems: Array<{ id: LibraryView; label: string; icon: typeof Clock }> = [
    { id: "recently-added", label: "Recently Added", icon: Clock },
    { id: "artists", label: "Artists", icon: Mic2 },
    { id: "albums", label: "Albums", icon: Disc3 },
    { id: "songs", label: "Songs", icon: Music2 },
    { id: "search", label: "Made For You", icon: Sparkles },
  ];

  return (
    <aside className="flex h-full w-56 flex-col border-r border-apple-border bg-apple-sidebar select-none backdrop-blur-2xl">
      <div className="flex-1 overflow-y-auto px-2 py-4">
        {/* Library Section */}
        <div className="mb-6">
          <div className="px-3 pb-1.5 text-[11px] font-semibold tracking-wider text-apple-text-subtle uppercase">
            Library
          </div>
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = selectedView === item.id && !selectedPlaylist;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    selectPlaylist(null);
                    setView(item.id);
                  }}
                  className={`flex w-full items-center space-x-2.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-apple-red-dark text-white shadow-sm"
                      : "text-apple-text-muted hover:bg-apple-hover hover:text-apple-text"
                  }`}
                >
                  <Icon size={15} className={isActive ? "text-white" : "text-apple-red-dark"} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Playlists Section */}
        <div>
          <div className="flex items-center justify-between px-3 pb-1.5">
            <span className="text-[11px] font-semibold tracking-wider text-apple-text-subtle uppercase">
              Playlists
            </span>
            <button
              onClick={handleCreatePlaylist}
              title="New Playlist"
              className="text-apple-text-subtle hover:text-apple-text"
            >
              <Plus size={14} />
            </button>
          </div>
          <nav className="space-y-0.5">
            {playlists.length === 0 ? (
              <div className="px-3 py-2 text-xs text-apple-text-subtle italic">
                No playlists created
              </div>
            ) : (
              playlists.map((playlist) => {
                const isActive = selectedPlaylist?.id === playlist.id;
                return (
                  <button
                    key={playlist.id}
                    onClick={() => selectPlaylist(playlist)}
                    className={`flex w-full items-center space-x-2.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-apple-red-dark text-white shadow-sm"
                        : "text-apple-text-muted hover:bg-apple-hover hover:text-apple-text"
                    }`}
                  >
                    <ListMusic size={15} className={isActive ? "text-white" : "text-apple-text-muted"} />
                    <span className="truncate">{playlist.name}</span>
                  </button>
                );
              })
            )}
          </nav>
        </div>
      </div>

      {/* Sync Footer Button */}
      <div className="border-t border-apple-border p-3">
        <button
          onClick={() => syncSources()}
          disabled={isSyncing}
          className="flex w-full items-center justify-center space-x-2 rounded-md border border-apple-border bg-apple-hover px-3 py-1.5 text-xs font-medium text-apple-text transition-colors hover:bg-apple-active disabled:opacity-50"
        >
          <RefreshCw size={13} className={isSyncing ? "animate-spin text-apple-red-dark" : ""} />
          <span>{isSyncing ? "Syncing Sources..." : "Sync Libraries"}</span>
        </button>
      </div>
    </aside>
  );
}
