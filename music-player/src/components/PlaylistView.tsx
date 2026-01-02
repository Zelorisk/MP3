import { Music, Play, Trash2, ArrowLeft, Plus, Search, X } from "lucide-react";
import { useState } from "react";
import { useLibraryStore } from "../store/libraryStore";
import { useViewStore } from "../store/viewStore";
import { usePlayerStore } from "../store/playerStore";
import { formatDuration } from "../utils/format";
import type { Song } from "../types";

export const PlaylistView = () => {
  const { selectedPlaylistId, setView } = useViewStore();
  const {
    songs,
    playlists,
    removeFromPlaylist,
    deletePlaylist,
    renamePlaylist,
    addToPlaylist,
  } = useLibraryStore();
  const { setQueue, currentSong, isPlaying } = usePlayerStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [showAddSongs, setShowAddSongs] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const playlist = playlists.find((p) => p.id === selectedPlaylistId);

  if (!playlist) {
    setView("home");
    return null;
  }

  const playlistSongs = songs.filter((s) => playlist.songs.includes(s.id));
  const totalDuration = playlistSongs.reduce((acc, s) => acc + s.duration, 0);

  const availableSongs = songs.filter((s) => !playlist.songs.includes(s.id));
  const filteredAvailableSongs = availableSongs.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.album.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handlePlaySong = (_song: Song, index: number) => {
    setQueue(playlistSongs, index);
  };

  const handleRemove = (e: React.MouseEvent, songId: string) => {
    e.stopPropagation();
    removeFromPlaylist(playlist.id, songId);
  };

  const handleDelete = () => {
    if (confirm(`Delete playlist "${playlist.name}"?`)) {
      deletePlaylist(playlist.id);
      setView("home");
    }
  };

  const handleRename = () => {
    if (editName.trim()) {
      renamePlaylist(playlist.id, editName.trim());
      setIsEditing(false);
    }
  };

  const startEditing = () => {
    setEditName(playlist.name);
    setIsEditing(true);
  };

  const handleAddSong = (songId: string) => {
    addToPlaylist(playlist.id, songId);
  };

  const isCurrentSong = (song: Song) => currentSong?.id === song.id;

  return (
    <div className="flex-1 overflow-auto">
      <div className="h-80 bg-gradient-to-b from-accent/20 to-transparent p-6 flex items-end">
        <div className="w-full">
          <button
            onClick={() => setView("home")}
            className="flex items-center gap-2 text-secondary hover:text-primary mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm">Back</span>
          </button>

          <div className="flex items-end gap-6">
            <div className="w-52 h-52 bg-gradient-to-br from-accent/40 to-accent/20 rounded-lg flex items-center justify-center shadow-2xl">
              <Music size={80} className="text-accent" />
            </div>

            <div className="flex-1 pb-4">
              <p className="text-xs font-semibold text-secondary uppercase mb-2">
                Playlist
              </p>
              {isEditing ? (
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={handleRename}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRename();
                      if (e.key === "Escape") setIsEditing(false);
                    }}
                    className="bg-transparent border-b-2 border-accent text-6xl font-bold text-primary outline-none"
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={startEditing}
                  className="text-6xl font-bold text-primary mb-4 cursor-pointer hover:text-accent/80 transition-colors text-left"
                >
                  {playlist.name}
                </button>
              )}
              <p className="text-sm text-secondary">
                {playlistSongs.length} songs • {formatDuration(totalDuration)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black/40 backdrop-blur-sm px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          {playlistSongs.length > 0 && (
            <button
              onClick={() => setQueue(playlistSongs, 0)}
              className="w-14 h-14 rounded-full bg-accent hover:bg-accent/80 hover:scale-105 flex items-center justify-center transition-all shadow-lg"
            >
              <Play size={24} fill="black" className="text-black ml-1" />
            </button>
          )}

          <button
            onClick={() => setShowAddSongs(!showAddSongs)}
            className="text-secondary hover:text-primary transition-colors p-2"
            title="Add songs"
          >
            <Plus size={20} />
          </button>

          <button
            onClick={handleDelete}
            className="text-secondary hover:text-red-500 transition-colors p-2"
            title="Delete playlist"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="px-6 pb-6">
        {showAddSongs && (
          <div className="mb-6 bg-surface rounded-lg p-4 border border-tertiary/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary">Add Songs</h3>
              <button
                onClick={() => {
                  setShowAddSongs(false);
                  setSearchQuery("");
                }}
                className="text-secondary hover:text-primary transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative mb-4">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search songs..."
                className="w-full bg-background border border-tertiary/30 rounded-lg pl-10 pr-4 py-2 text-sm text-primary placeholder-secondary focus:outline-none focus:border-accent"
              />
            </div>

            <div className="max-h-96 overflow-y-auto space-y-1">
              {filteredAvailableSongs.length === 0 ? (
                <p className="text-center text-secondary py-8">
                  {availableSongs.length === 0
                    ? "All songs from your library are already in this playlist"
                    : "No songs found"}
                </p>
              ) : (
                filteredAvailableSongs.map((song) => (
                  <div
                    key={song.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-tertiary/50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-background rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                      {song.artwork ? (
                        <img
                          src={song.artwork}
                          alt={song.album}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Music size={16} className="text-secondary" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-primary truncate">
                        {song.title}
                      </h4>
                      <p className="text-xs text-secondary truncate">
                        {song.artist}
                      </p>
                    </div>

                    <button
                      onClick={() => handleAddSong(song.id)}
                      className="text-accent hover:text-accent/80 transition-colors p-2"
                      title="Add to playlist"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {playlistSongs.length === 0 ? (
          <div className="text-center py-20">
            <Plus size={64} className="text-tertiary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-primary mb-2">
              This playlist is empty
            </h3>
            <p className="text-sm text-secondary">
              Add songs from your library using the + button above
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {playlistSongs.map((song, index) => (
              <div
                key={song.id}
                onClick={() => handlePlaySong(song, index)}
                className={`group flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all ${
                  isCurrentSong(song)
                    ? "bg-accent/10 hover:bg-accent/20"
                    : "hover:bg-tertiary/50"
                }`}
              >
                <span className="w-6 text-center text-sm text-secondary">
                  {index + 1}
                </span>

                <div className="relative w-12 h-12 bg-surface rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                  {song.artwork ? (
                    <img
                      src={song.artwork}
                      alt={song.album}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Music size={20} className="text-secondary" />
                  )}

                  {isCurrentSong(song) && isPlaying && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="w-1 h-4 bg-accent animate-pulse mx-0.5" />
                      <div
                        className="w-1 h-3 bg-accent animate-pulse mx-0.5"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <div
                        className="w-1 h-5 bg-accent animate-pulse mx-0.5"
                        style={{ animationDelay: "0.4s" }}
                      />
                    </div>
                  )}

                  {!isCurrentSong(song) && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play size={20} fill="white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3
                    className={`text-sm font-medium truncate ${
                      isCurrentSong(song) ? "text-accent" : "text-primary"
                    }`}
                  >
                    {song.title}
                  </h3>
                  <p className="text-xs text-secondary truncate">
                    {song.artist} • {song.album}
                  </p>
                </div>

                <span className="text-xs text-secondary font-light">
                  {formatDuration(song.duration)}
                </span>

                <button
                  onClick={(e) => handleRemove(e, song.id)}
                  className="opacity-0 group-hover:opacity-100 text-secondary hover:text-red-500 transition-all ml-2"
                  title="Remove from playlist"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
