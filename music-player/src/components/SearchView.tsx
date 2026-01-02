import { Music, Play } from "lucide-react";
import { useLibraryStore } from "../store/libraryStore";
import { usePlayerStore } from "../store/playerStore";
import { formatDuration } from "../utils/format";
import type { Song } from "../types";

export const SearchView = () => {
  const { getFilteredSongs, searchQuery } = useLibraryStore();
  const { setQueue, currentSong, isPlaying } = usePlayerStore();

  const results = getFilteredSongs();

  const handleSongClick = (_song: Song, index: number) => {
    setQueue(results, index);
  };

  const isCurrentSong = (song: Song) => currentSong?.id === song.id;

  if (!searchQuery) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="w-32 h-32 rounded-full bg-surface/30 flex items-center justify-center mx-auto mb-6">
            <Music size={64} className="text-secondary" />
          </div>
          <h2 className="text-2xl font-semibold text-primary mb-2">
            Search for songs
          </h2>
          <p className="text-sm text-secondary">
            Find your favorite tracks by title, artist, or album
          </p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="w-32 h-32 rounded-full bg-surface/30 flex items-center justify-center mx-auto mb-6">
            <Music size={64} className="text-secondary" />
          </div>
          <h2 className="text-2xl font-semibold text-primary mb-2">
            No results found
          </h2>
          <p className="text-sm text-secondary">
            Try searching for something else
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-primary mb-6">
        Search results for "{searchQuery}"
      </h2>

      <div className="space-y-1">
        {results.map((song, index) => (
          <div
            key={song.id}
            onClick={() => handleSongClick(song, index)}
            className={`group flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all ${
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
          </div>
        ))}
      </div>
    </div>
  );
};
