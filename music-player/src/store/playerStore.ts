import { create } from "zustand";
import { Howl } from "howler";
import { convertFileSrc } from "@tauri-apps/api/core";
import type { Song, RepeatMode } from "../types";
import { useLibraryStore } from "./libraryStore";

interface PlayerStore {
  sound: Howl | null;
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  shuffle: boolean;
  repeat: RepeatMode;
  queue: Song[];
  queueIndex: number;

  play: (song: Song) => void;
  pause: () => void;
  togglePlayPause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  setRepeat: (mode: RepeatMode) => void;
  next: () => void;
  previous: () => void;
  setQueue: (songs: Song[], startIndex?: number) => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  cleanup: () => void;
  updateProgress: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  sound: null,
  currentSong: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 70,
  isMuted: false,
  shuffle: false,
  repeat: "off",
  queue: [],
  queueIndex: -1,

  play: (song) => {
    const { sound, volume, isMuted } = get();

    useLibraryStore.getState().addToRecentlyPlayed(song.id);

    if (sound) {
      sound.unload();
    }

    const convertedPath = convertFileSrc(song.filePath);
    console.log("🎵 Playing song:", song.title);
    console.log("📁 Original path:", song.filePath);
    console.log("🔗 Converted path:", convertedPath);

    const newSound = new Howl({
      src: [convertedPath],
      html5: true,
      volume: isMuted ? 0 : volume / 100,
      onload: () => {
        console.log("✅ Audio loaded successfully");
        set({ duration: newSound.duration() });
      },
      onloaderror: (_id, error) => {
        console.error("❌ Audio load error:", error);
        console.error("Failed to load:", convertedPath);
      },
      onplayerror: (_id, error) => {
        console.error("❌ Audio play error:", error);
      },
      onplay: () => {
        console.log("▶️ Playback started");
        set({ isPlaying: true });
        get().updateProgress();
      },
      onpause: () => {
        console.log("⏸️ Playback paused");
        set({ isPlaying: false });
      },
      onend: () => {
        console.log("⏭️ Playback ended");
        const { repeat, next } = get();
        set({ isPlaying: false, currentTime: 0 });

        if (repeat === "one") {
          newSound.play();
        } else {
          next();
        }
      },
    });

    newSound.play();
    set({
      sound: newSound,
      currentSong: song,
      currentTime: 0,
    });
  },

  pause: () => {
    const { sound } = get();
    if (sound) {
      sound.pause();
    }
  },

  togglePlayPause: () => {
    const { sound, isPlaying } = get();
    if (sound) {
      if (isPlaying) {
        sound.pause();
      } else {
        sound.play();
      }
    }
  },

  stop: () => {
    const { sound } = get();
    if (sound) {
      sound.stop();
      set({ isPlaying: false, currentTime: 0 });
    }
  },

  seek: (time) => {
    const { sound } = get();
    if (sound) {
      sound.seek(time);
      set({ currentTime: time });
    }
  },

  setVolume: (vol) => {
    const { sound, isMuted } = get();
    set({ volume: vol });
    if (sound && !isMuted) {
      sound.volume(vol / 100);
    }
  },

  toggleMute: () => {
    const { sound, volume, isMuted } = get();
    const newMuted = !isMuted;
    set({ isMuted: newMuted });
    if (sound) {
      sound.volume(newMuted ? 0 : volume / 100);
    }
  },

  toggleShuffle: () => {
    set({ shuffle: !get().shuffle });
  },

  setRepeat: (mode) => {
    set({ repeat: mode });
  },

  next: () => {
    const { queue, queueIndex, shuffle, repeat } = get();

    if (queue.length === 0) return;

    let nextIndex = queueIndex + 1;

    if (shuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else if (nextIndex >= queue.length) {
      if (repeat === "all") {
        nextIndex = 0;
      } else {
        return;
      }
    }

    set({ queueIndex: nextIndex });
    get().play(queue[nextIndex]);
  },

  previous: () => {
    const { queue, queueIndex, currentTime } = get();

    if (queue.length === 0) return;

    if (currentTime > 3) {
      get().seek(0);
      return;
    }

    let prevIndex = queueIndex - 1;

    if (prevIndex < 0) {
      prevIndex = queue.length - 1;
    }

    set({ queueIndex: prevIndex });
    get().play(queue[prevIndex]);
  },

  setQueue: (songs, startIndex = 0) => {
    set({ queue: songs, queueIndex: startIndex });
    if (songs.length > 0 && startIndex >= 0 && startIndex < songs.length) {
      get().play(songs[startIndex]);
    }
  },

  addToQueue: (song) => {
    const { queue } = get();
    set({ queue: [...queue, song] });
  },

  removeFromQueue: (index) => {
    const { queue, queueIndex } = get();
    const newQueue = queue.filter((_, i) => i !== index);

    let newIndex = queueIndex;
    if (index < queueIndex) {
      newIndex = queueIndex - 1;
    } else if (index === queueIndex && newQueue.length > 0) {
      if (newIndex >= newQueue.length) {
        newIndex = newQueue.length - 1;
      }
      get().play(newQueue[newIndex]);
    }

    set({ queue: newQueue, queueIndex: newIndex });
  },

  cleanup: () => {
    const { sound } = get();
    if (sound) {
      sound.unload();
    }
  },

  updateProgress: () => {
    const { sound, isPlaying } = get();
    if (sound && isPlaying) {
      const seek = sound.seek();
      if (typeof seek === "number") {
        set({ currentTime: seek });
      }
      requestAnimationFrame(() => get().updateProgress());
    }
  },
}));
