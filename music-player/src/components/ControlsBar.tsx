import { Controls } from "./Controls";
import { ProgressBar } from "./ProgressBar";
import { VolumeControl } from "./VolumeControl";
import { NowPlaying } from "./NowPlaying";

export const ControlsBar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 to-black/80 backdrop-blur-md z-50">
      <div className="px-6 py-3">
        <ProgressBar />
      </div>

      <div className="px-6 pb-4 flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <NowPlaying />
        </div>

        <div className="flex-1 flex justify-center">
          <Controls />
        </div>

        <div className="flex-1 flex justify-end">
          <VolumeControl />
        </div>
      </div>
    </div>
  );
};
