import { Volume2, VolumeX } from "lucide-react";
import { usePlayerStore } from "../store/playerStore";

export const VolumeControl = () => {
  const { volume, isMuted, setVolume, toggleMute } = usePlayerStore();

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  return (
    <div className="flex items-center gap-2 group">
      <button
        type="button"
        onClick={toggleMute}
        className="text-secondary hover:text-primary transition-colors"
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      <div className="w-20 h-1 bg-tertiary rounded-full relative">
        <input
          type="range"
          min="0"
          max="100"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
        <div
          className="h-full bg-secondary rounded-full transition-all"
          style={{ width: `${isMuted ? 0 : volume}%` }}
        />
      </div>
    </div>
  );
};
