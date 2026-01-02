import { Music, Play, Trash2, ListPlus } from "lucide-react";
import { useState } from "react";
import { useLibraryStore } from "../store/libraryStore";
import { usePlayerStore } from "../store/playerStore";
import { formatDuration } from "../utils/format";
import type { Song } from "../types";

export const SongList = () => {
  const { getFilteredSongs, removeSong, playlists, addToPlaylist } =
    useLibraryStore();
  const { setQueue, currentSong, isPlaying } = usePlayerStore();
  const [contextMenuSong, setContextMenuSong] = useState<string | null>(null);

  const songs = getFilteredSongs();

  const handleSongClick = (_song: Song, index: number) => {
    setQueue(songs, index);
  };

  const handleRemoveSong = (e: React.MouseEvent, songId: string) => {
    e.stopPropagation();
    removeSong(songId);
  };

  const handleAddToPlaylist = (
    e: React.MouseEvent,
    playlistId: string,
    songId: string,
  ) => {
    e.stopPropagation();
    addToPlaylist(playlistId, songId);
    setContextMenuSong(null);
  };

  const toggleContextMenu = (e: React.MouseEvent, songId: string) => {
    e.stopPropagation();
    setContextMenuSong(contextMenuSong === songId ? null : songId);
  };

  const isCurrentSong = (song: Song) => {
    return currentSong?.id === song.id;
  };

  if (songs.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="w-32 h-32 rounded-full bg-surface/30 flex items-center justify-center mx-auto mb-6">
            <Music size={64} className="text-secondary" />
          </div>
          <h2 className="text-2xl font-semibold text-primary mb-2">
            No songs in library
          </h2>
          <p className="text-sm text-secondary">
            Add files or folders to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        <h2 className="text-xl font-light text-primary mb-6">
          All Songs ({songs.length})
        </h2>

        <div className="space-y-1">
          {songs.map((song, index) => (
            <button
              type="button"
              key={song.id}
              onClick={() => handleSongClick(song, index)}
              className={`w-full group flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all ${
                isCurrentSong(song)
                  ? "bg-accent/10 hover:bg-accent/20"
                  : "hover:bg-tertiary/50"
              }`}
            >
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

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => toggleContextMenu(e, song.id)}
                    className="text-secondary hover:text-primary transition-colors"
                    title="Add to playlist"
                  >
                    <ListPlus size={16} />
                  </button>

                  {contextMenuSong === song.id && playlists.length > 0 && (
                    <div className="absolute right-0 top-full mt-2 bg-surface border border-tertiary rounded-lg shadow-xl z-50 min-w-48">
                      <div className="p-2">
                        <p className="text-xs text-secondary px-3 py-2">
                          Add to playlist
                        </p>
                        {playlists.map((playlist) => (
                          <button
                            key={playlist.id}
                            onClick={(e) =>
                              handleAddToPlaylist(e, playlist.id, song.id)
                            }
                            className="w-full text-left px-3 py-2 text-sm text-primary hover:bg-tertiary/50 rounded transition-colors"
                            disabled={playlist.songs.includes(song.id)}
                          >
                            {playlist.name}
                            {playlist.songs.includes(song.id) && (
                              <span className="ml-2 text-xs text-accent">
                                ✓
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={(e) => handleRemoveSong(e, song.id)}
                  className="text-secondary hover:text-red-500 transition-all"
                  title="Remove song"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
