import { useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { usePlayerStore } from "../store/playerStore";

export const useDiscordRPC = () => {
  const { currentSong, isPlaying, currentTime } = usePlayerStore();
  const lastUpdateRef = useRef<{ songId: string | null; isPlaying: boolean }>({
    songId: null,
    isPlaying: false,
  });
  const [discordAvailable, setDiscordAvailable] = useState(false);

  useEffect(() => {
    invoke("init_discord")
      .then(() => {
        setDiscordAvailable(true);
      })
      .catch(() => {
        setDiscordAvailable(false);
      });
  }, []);

  useEffect(() => {
    if (!discordAvailable) return;

    const currentSongId = currentSong?.id || null;
    const songChanged = lastUpdateRef.current.songId !== currentSongId;
    const playStateChanged = lastUpdateRef.current.isPlaying !== isPlaying;

    if (!songChanged && !playStateChanged) return;

    lastUpdateRef.current = { songId: currentSongId, isPlaying };

    if (currentSong) {
      invoke("update_discord_presence", {
        songTitle: currentSong.title,
        artist: currentSong.artist,
        album: currentSong.album,
        duration: Math.floor(currentSong.duration),
        currentTime: Math.floor(currentTime),
        isPlaying,
      }).catch(() => {
        setDiscordAvailable(false);
      });
    } else {
      invoke("clear_discord_presence").catch(() => {
        setDiscordAvailable(false);
      });
    }
  }, [currentSong, isPlaying, discordAvailable, currentTime]);
};
