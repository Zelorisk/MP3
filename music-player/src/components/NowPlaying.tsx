import { Music } from 'lucide-react';
import { usePlayerStore } from '../store/playerStore';

export const NowPlaying = () => {
  const { currentSong } = usePlayerStore();

  if (!currentSong) return null;

  return (
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 bg-surface rounded-lg flex items-center justify-center overflow-hidden">
        {currentSong.artwork ? (
          <img
            src={currentSong.artwork}
            alt={currentSong.album}
            className="w-full h-full object-cover"
          />
        ) : (
          <Music size={24} className="text-secondary" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-primary truncate">
          {currentSong.title}
        </h3>
        <p className="text-xs text-secondary truncate">
          {currentSong.artist}
        </p>
      </div>
    </div>
  );
};
