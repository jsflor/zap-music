import { useEffect } from "react";
import { TopToolbar } from "./components/Toolbar/TopToolbar";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { RecentlyAddedView } from "./components/Views/RecentlyAddedView";
import { ArtistsView } from "./components/Views/ArtistsView";
import { AlbumsView } from "./components/Views/AlbumsView";
import { SongsView } from "./components/Views/SongsView";
import { PlaylistView } from "./components/Views/PlaylistView";
import { SearchView } from "./components/Views/SearchView";
import { LyricsView } from "./components/Views/LyricsView";
import { QueueDrawer } from "./components/Views/QueueDrawer";
import { MiniPlayerView } from "./components/Views/MiniPlayerView";

import { usePlayerStore } from "./stores/playerStore";
import { useLibraryStore } from "./stores/libraryStore";
import { initMediaControls } from "./services/mediaControls";

export default function App() {
  const { isLyricsOpen, isMiniPlayer } = usePlayerStore();
  const { selectedView, selectedPlaylist, tracks, syncSources } = useLibraryStore();

  // Initialize OS MediaSession keys & initial sync
  useEffect(() => {
    const cleanupMedia = initMediaControls();
    if (tracks.length === 0) {
      syncSources();
    }
    return () => cleanupMedia();
  }, [tracks.length, syncSources]);

  // Main View Router
  const renderMainView = () => {
    if (selectedPlaylist) {
      return <PlaylistView />;
    }

    switch (selectedView) {
      case "recently-added":
        return <RecentlyAddedView />;
      case "artists":
        return <ArtistsView />;
      case "albums":
        return <AlbumsView />;
      case "songs":
        return <SongsView />;
      case "search":
        return <SearchView />;
      default:
        return <RecentlyAddedView />;
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-apple-content font-sans text-apple-text select-none">
      {/* Top LCD Toolbar */}
      <TopToolbar />

      {/* Main Container */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Translucent Sidebar */}
        <Sidebar />

        {/* View Content */}
        <main className="relative flex flex-1 flex-col overflow-hidden bg-apple-content">
          {renderMainView()}
        </main>

        {/* Up Next / Queue Drawer */}
        <QueueDrawer />
      </div>

      {/* Full-Screen Synced Lyrics Modal */}
      {isLyricsOpen && <LyricsView />}

      {/* MiniPlayer Floating HUD */}
      {isMiniPlayer && <MiniPlayerView />}
    </div>
  );
}
