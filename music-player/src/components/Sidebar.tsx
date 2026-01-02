import {
  Home,
  Search,
  Music,
  FolderOpen,
  Clock,
  ListMusic,
  Plus,
  FolderPlus,
} from "lucide-react";
import { useState } from "react";
import { useFileSystem } from "../hooks/useFileSystem";
import { useMetadata } from "../hooks/useMetadata";
import { useLibraryStore } from "../store/libraryStore";
import { useViewStore } from "../store/viewStore";

export const Sidebar = () => {
  const { openFiles, openFolder } = useFileSystem();
  const { extractFromFiles } = useMetadata();
  const { addSongs, playlists, createPlaylist } = useLibraryStore();
  const { currentView, setView, setPlaylistView } = useViewStore();
  const [showNewPlaylist, setShowNewPlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const handleOpenFiles = async () => {
    const filePaths = await openFiles();
    if (filePaths.length > 0) {
      const songs = await extractFromFiles(filePaths);
      addSongs(songs);
    }
  };

  const handleOpenFolder = async () => {
    const filePaths = await openFolder();
    if (filePaths.length > 0) {
      const songs = await extractFromFiles(filePaths);
      addSongs(songs);
    }
  };

  const handleImportFolderAsPlaylist = async () => {
    const filePaths = await openFolder();
    if (filePaths.length > 0) {
      const folderName =
        filePaths[0].split("/").filter(Boolean).slice(-2, -1)[0] ||
        "New Playlist";

      const songs = await extractFromFiles(filePaths);

      const playlistId = createPlaylist(folderName);

      const addedSongs = addSongs(songs);

      addedSongs.forEach((song) => {
        useLibraryStore.getState().addToPlaylist(playlistId, song.id);
      });

      setPlaylistView(playlistId);
    }
  };

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());
      setNewPlaylistName("");
      setShowNewPlaylist(false);
    }
  };

  return (
    <div className="w-64 bg-surface/30 flex flex-col h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-light text-primary mb-8">Music Player</h1>

        <nav className="space-y-2">
          <button
            type="button"
            onClick={() => setView("home")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === "home"
                ? "bg-accent/10 text-accent"
                : "text-secondary hover:text-primary hover:bg-tertiary/50"
            }`}
          >
            <Home size={20} />
            <span className="font-light">Home</span>
          </button>

          <button
            type="button"
            onClick={() => setView("search")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === "search"
                ? "bg-accent/10 text-accent"
                : "text-secondary hover:text-primary hover:bg-tertiary/50"
            }`}
          >
            <Search size={20} />
            <span className="font-light">Search</span>
          </button>

          <button
            type="button"
            onClick={() => setView("library")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === "library"
                ? "bg-accent/10 text-accent"
                : "text-secondary hover:text-primary hover:bg-tertiary/50"
            }`}
          >
            <Music size={20} />
            <span className="font-light">Library</span>
          </button>

          <button
            type="button"
            onClick={() => setView("recent")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === "recent"
                ? "bg-accent/10 text-accent"
                : "text-secondary hover:text-primary hover:bg-tertiary/50"
            }`}
          >
            <Clock size={20} />
            <span className="font-light">Recent</span>
          </button>
        </nav>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-secondary uppercase">
              Playlists
            </h2>
            <button
              type="button"
              onClick={() => setShowNewPlaylist(true)}
              className="text-secondary hover:text-primary transition-colors"
              title="Create playlist"
            >
              <Plus size={18} />
            </button>
          </div>

          {showNewPlaylist && (
            <div className="mb-2">
              <input
                type="text"
                placeholder="Playlist name"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                onBlur={() => {
                  if (!newPlaylistName.trim()) setShowNewPlaylist(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreatePlaylist();
                  if (e.key === "Escape") {
                    setShowNewPlaylist(false);
                    setNewPlaylistName("");
                  }
                }}
                className="w-full bg-surface/80 border border-tertiary text-primary text-sm rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
          )}

          <div className="space-y-1 max-h-64 overflow-y-auto">
            {playlists.map((playlist) => (
              <button
                type="button"
                key={playlist.id}
                onClick={() => setPlaylistView(playlist.id)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-left ${
                  currentView === "playlist" &&
                  useViewStore.getState().selectedPlaylistId === playlist.id
                    ? "bg-accent/10 text-accent"
                    : "text-secondary hover:text-primary hover:bg-tertiary/50"
                }`}
              >
                <ListMusic size={16} />
                <span className="text-sm font-light truncate">
                  {playlist.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto p-6 pb-32 space-y-2">
        <button
          type="button"
          onClick={handleOpenFiles}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-tertiary text-secondary hover:text-primary hover:border-secondary transition-colors"
        >
          <Music size={18} />
          <span className="text-sm font-light">Add Files</span>
        </button>

        <button
          type="button"
          onClick={handleOpenFolder}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-tertiary text-secondary hover:text-primary hover:border-secondary transition-colors"
        >
          <FolderOpen size={18} />
          <span className="text-sm font-light">Add Folder</span>
        </button>

        <button
          type="button"
          onClick={handleImportFolderAsPlaylist}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-accent/30 text-accent hover:text-accent/80 hover:border-accent transition-colors"
        >
          <FolderPlus size={18} />
          <span className="text-sm font-light">Import as Playlist</span>
        </button>
      </div>
    </div>
  );
};
