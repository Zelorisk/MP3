import { useEffect } from "react";
import { GridBackground } from "./components/GridBackground";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { HomeView } from "./components/HomeView";
import { SearchView } from "./components/SearchView";
import { SongList } from "./components/SongList";
import { PlaylistView } from "./components/PlaylistView";
import { RecentView } from "./components/RecentView";
import { ControlsBar } from "./components/ControlsBar";
import { usePlayerStore } from "./store/playerStore";
import { useViewStore } from "./store/viewStore";
import { useDiscordRPC } from "./hooks/useDiscordRPC";

function App() {
  const cleanup = usePlayerStore((state) => state.cleanup);
  const { currentView } = useViewStore();

  useDiscordRPC();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      const state = usePlayerStore.getState();

      switch (e.key) {
        case " ":
          e.preventDefault();
          state.togglePlayPause();
          break;
        case "ArrowLeft":
          e.preventDefault();
          state.previous();
          break;
        case "ArrowRight":
          e.preventDefault();
          state.next();
          break;
        case "ArrowUp":
          e.preventDefault();
          state.setVolume(Math.min(100, state.volume + 5));
          break;
        case "ArrowDown":
          e.preventDefault();
          state.setVolume(Math.max(0, state.volume - 5));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      cleanup();
    };
  }, [cleanup]);

  const renderView = () => {
    switch (currentView) {
      case "home":
        return <HomeView />;
      case "search":
        return <SearchView />;
      case "library":
        return <SongList />;
      case "playlist":
        return <PlaylistView />;
      case "recent":
        return <RecentView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <GridBackground />

      <div className="flex h-screen relative z-10">
        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <div className="flex-1 overflow-auto pb-32">{renderView()}</div>
        </div>
      </div>

      <ControlsBar />
    </div>
  );
}

export default App;
