import { usePlayerStore } from '../store/playerStore';
import { formatTime } from '../utils/format';

export const ProgressBar = () => {
  const { currentTime, duration, seek } = usePlayerStore();

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    seek(newTime);
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-secondary font-light w-10 text-right">
        {formatTime(currentTime)}
      </span>

      <div
        className="flex-1 h-1 bg-tertiary rounded-full cursor-pointer group"
        onClick={handleSeek}
      >
        <div
          className="h-full bg-accent rounded-full relative transition-all duration-200 group-hover:bg-indigo-400"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <span className="text-xs text-secondary font-light w-10">
        {formatTime(duration)}
      </span>
    </div>
  );
};
