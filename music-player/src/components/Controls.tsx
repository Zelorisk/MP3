import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
} from "lucide-react";
import { usePlayerStore } from "../store/playerStore";
import type { RepeatMode } from "../types";

export const Controls = () => {
  const {
    isPlaying,
    shuffle,
    repeat,
    togglePlayPause,
    previous,
    next,
    toggleShuffle,
    setRepeat,
  } = usePlayerStore();

  const cycleRepeat = () => {
    const modes: RepeatMode[] = ["off", "all", "one"];
    const currentIndex = modes.indexOf(repeat);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeat(modes[nextIndex]);
  };

  const getRepeatIcon = () => {
    if (repeat === "one") return <Repeat1 size={18} />;
    return <Repeat size={18} />;
  };

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={toggleShuffle}
        className={`transition-colors ${
          shuffle ? "text-accent" : "text-secondary hover:text-primary"
        }`}
      >
        <Shuffle size={18} />
      </button>

      <button
        type="button"
        onClick={previous}
        className="text-primary hover:text-accent transition-colors"
      >
        <SkipBack size={20} fill="currentColor" />
      </button>

      <button
        type="button"
        onClick={togglePlayPause}
        className="w-10 h-10 rounded-full bg-accent hover:bg-indigo-500 flex items-center justify-center transition-all hover:scale-105"
      >
        {isPlaying ? (
          <Pause size={20} fill="white" />
        ) : (
          <Play size={20} fill="white" className="ml-0.5" />
        )}
      </button>

      <button
        type="button"
        onClick={next}
        className="text-primary hover:text-accent transition-colors"
      >
        <SkipForward size={20} fill="currentColor" />
      </button>

      <button
        type="button"
        onClick={cycleRepeat}
        className={`transition-colors ${
          repeat !== "off" ? "text-accent" : "text-secondary hover:text-primary"
        }`}
      >
        {getRepeatIcon()}
      </button>
    </div>
  );
};
