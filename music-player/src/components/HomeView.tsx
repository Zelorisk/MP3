import { Music, Clock, ListMusic } from "lucide-react";
import { useLibraryStore } from "../store/libraryStore";
import { useViewStore } from "../store/viewStore";
import { usePlayerStore } from "../store/playerStore";
import { formatDuration } from "../utils/format";

export const HomeView = () => {
  const { songs, playlists, recentlyPlayed } = useLibraryStore();
  const { setView, setPlaylistView } = useViewStore();
  const { setQueue } = usePlayerStore();

  const recentSongs = songs
    .filter((song) => recentlyPlayed.includes(song.id))
    .sort((a, b) => recentlyPlayed.indexOf(a.id) - recentlyPlayed.indexOf(b.id))
    .slice(0, 6);

  const handlePlayRecent = (songIndex: number) => {
    setQueue(recentSongs, songIndex);
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-primary mb-2">Good evening</h1>
      </div>

      {recentSongs.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-primary mb-4">
            Recently played
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {recentSongs.map((song, index) => (
              <div
                key={song.id}
                onClick={() => handlePlayRecent(index)}
                className="group bg-surface/30 hover:bg-surface/60 rounded-lg flex items-center gap-4 overflow-hidden cursor-pointer transition-all"
              >
                <div className="w-20 h-20 bg-surface flex-shrink-0 flex items-center justify-center">
                  {song.artwork ? (
                    <img
                      src={song.artwork}
                      alt={song.album}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Music size={24} className="text-secondary" />
                  )}
                </div>
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="text-sm font-semibold text-primary truncate">
                    {song.title}
                  </h3>
                  <p className="text-xs text-secondary truncate">
                    {song.artist}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <button
          type="button"
          onClick={() => setView("library")}
          className="bg-surface/30 hover:bg-surface/50 rounded-lg p-6 cursor-pointer transition-all group border border-tertiary/30"
        >
          <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-4 mx-auto bg-accent/10">
            <Music size={32} className="text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-primary mb-1 text-center">
            Your Library
          </h3>
          <p className="text-sm text-secondary text-center">
            {songs.length} songs
          </p>
        </button>

        <button
          type="button"
          onClick={() => setView("recent")}
          className="bg-surface/30 hover:bg-surface/50 rounded-lg p-6 cursor-pointer transition-all group border border-tertiary/30"
        >
          <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-4 mx-auto bg-accent/10">
            <Clock size={32} className="text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-primary mb-1 text-center">
            Recent
          </h3>
          <p className="text-sm text-secondary text-center">
            {recentlyPlayed.length} plays
          </p>
        </button>

        <button
          type="button"
          onClick={() => setView("library")}
          className="bg-surface/30 hover:bg-surface/50 rounded-lg p-6 cursor-pointer transition-all group border border-tertiary/30"
        >
          <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-4 mx-auto bg-accent/10">
            <ListMusic size={32} className="text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-primary mb-1 text-center">
            Playlists
          </h3>
          <p className="text-sm text-secondary text-center">
            {playlists.length} created
          </p>
        </button>
      </div>

      {playlists.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-primary mb-4">
            Your Playlists
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {playlists.map((playlist) => {
              const playlistSongs = songs.filter((s) =>
                playlist.songs.includes(s.id),
              );
              const totalDuration = playlistSongs.reduce(
                (acc, s) => acc + s.duration,
                0,
              );

              return (
                <button
                  type="button"
                  key={playlist.id}
                  onClick={() => setPlaylistView(playlist.id)}
                  className="group bg-surface/30 hover:bg-surface/50 rounded-lg p-4 cursor-pointer transition-all"
                >
                  <div className="aspect-square bg-gradient-to-br from-accent/20 to-accent/5 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <ListMusic size={48} className="text-accent" />
                  </div>
                  <h3 className="text-sm font-semibold text-primary truncate mb-1">
                    {playlist.name}
                  </h3>
                  <p className="text-xs text-secondary">
                    {playlistSongs.length} songs •{" "}
                    {formatDuration(totalDuration)}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
