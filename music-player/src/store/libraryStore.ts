import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Song, Playlist } from "../types";
import { getArtwork } from "../utils/artworkCache";

interface LibraryStore {
  songs: Song[];
  playlists: Playlist[];
  recentlyPlayed: string[];
  searchQuery: string;
  sortBy: "title" | "artist" | "album" | "duration" | "dateAdded";
  sortOrder: "asc" | "desc";

  addSongs: (songs: Song[]) => Song[];
  removeSong: (id: string) => void;
  clearLibrary: () => void;

  createPlaylist: (name: string) => string;
  deletePlaylist: (id: string) => void;
  renamePlaylist: (id: string, name: string) => void;
  addToPlaylist: (playlistId: string, songId: string) => void;
  removeFromPlaylist: (playlistId: string, songId: string) => void;

  addToRecentlyPlayed: (songId: string) => void;

  setSearchQuery: (query: string) => void;
  setSortBy: (
    sortBy: "title" | "artist" | "album" | "duration" | "dateAdded",
  ) => void;
  toggleSortOrder: () => void;

  getFilteredSongs: () => Song[];
}

export const useLibraryStore = create<LibraryStore>()(
  persist(
    (set, get) => ({
      songs: [],
      playlists: [],
      recentlyPlayed: [],
      searchQuery: "",
      sortBy: "title",
      sortOrder: "asc",

      addSongs: (newSongs) => {
        const { songs } = get();
        const existingPaths = new Set(songs.map((s) => s.filePath));
        const uniqueSongs = newSongs.filter(
          (s) => !existingPaths.has(s.filePath),
        );
        set({ songs: [...songs, ...uniqueSongs] });
        return uniqueSongs;
      },

      removeSong: (id) => {
        set({ songs: get().songs.filter((s) => s.id !== id) });
      },

      clearLibrary: () => {
        set({ songs: [], playlists: [], recentlyPlayed: [] });
      },

      createPlaylist: (name) => {
        const newPlaylist: Playlist = {
          id: `playlist-${Date.now()}`,
          name,
          songs: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set({ playlists: [...get().playlists, newPlaylist] });
        return newPlaylist.id;
      },

      deletePlaylist: (id) => {
        set({ playlists: get().playlists.filter((p) => p.id !== id) });
      },

      renamePlaylist: (id, name) => {
        set({
          playlists: get().playlists.map((p) =>
            p.id === id ? { ...p, name, updatedAt: Date.now() } : p,
          ),
        });
      },

      addToPlaylist: (playlistId, songId) => {
        set({
          playlists: get().playlists.map((p) =>
            p.id === playlistId
              ? { ...p, songs: [...p.songs, songId], updatedAt: Date.now() }
              : p,
          ),
        });
      },

      removeFromPlaylist: (playlistId, songId) => {
        set({
          playlists: get().playlists.map((p) =>
            p.id === playlistId
              ? {
                  ...p,
                  songs: p.songs.filter((id) => id !== songId),
                  updatedAt: Date.now(),
                }
              : p,
          ),
        });
      },

      addToRecentlyPlayed: (songId) => {
        const { recentlyPlayed } = get();
        const filtered = recentlyPlayed.filter((id) => id !== songId);
        set({ recentlyPlayed: [songId, ...filtered].slice(0, 50) });
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },

      setSortBy: (sortBy) => {
        set({ sortBy });
      },

      toggleSortOrder: () => {
        set({ sortOrder: get().sortOrder === "asc" ? "desc" : "asc" });
      },

      getFilteredSongs: () => {
        const { songs, searchQuery, sortBy, sortOrder } = get();

        let filtered = songs;

        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = songs.filter(
            (song) =>
              song.title.toLowerCase().includes(query) ||
              song.artist.toLowerCase().includes(query) ||
              song.album.toLowerCase().includes(query),
          );
        }

        const sorted = [...filtered].sort((a, b) => {
          let aVal: string | number = "";
          let bVal: string | number = "";

          switch (sortBy) {
            case "title":
              aVal = a.title.toLowerCase();
              bVal = b.title.toLowerCase();
              break;
            case "artist":
              aVal = a.artist.toLowerCase();
              bVal = b.artist.toLowerCase();
              break;
            case "album":
              aVal = a.album.toLowerCase();
              bVal = b.album.toLowerCase();
              break;
            case "duration":
              aVal = a.duration;
              bVal = b.duration;
              break;
            case "dateAdded":
              aVal = a.dateAdded;
              bVal = b.dateAdded;
              break;
          }

          if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
          if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
          return 0;
        });

        return sorted;
      },
    }),
    {
      name: "music-player-library",
      partialize: (state) => ({
        songs: state.songs.map((song) => {
          let cleanPath = song.filePath;

          if (cleanPath.startsWith("asset://")) {
            const decodedPath = decodeURIComponent(cleanPath);
            const pathMatch = decodedPath.match(
              /\/(Users|home|mnt)\/.+\.(mp3|flac|wav|ogg|m4a|aac)$/i,
            );
            if (pathMatch) {
              cleanPath = "/" + pathMatch[0].replace(/^\/+/, "");
            }
          }

          return {
            ...song,
            filePath: cleanPath,
            artwork: undefined,
          };
        }),
        playlists: state.playlists,
        recentlyPlayed: state.recentlyPlayed,
        searchQuery: state.searchQuery,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
      }),
      onRehydrateStorage: () => {
        return async (state) => {
          if (state?.songs) {
            const fixedSongs = state.songs.map((song) => {
              let fixedPath = song.filePath;

              if (fixedPath.startsWith("asset://")) {
                const decodedPath = decodeURIComponent(fixedPath);
                const pathMatch = decodedPath.match(
                  /\/(Users|home|mnt)\/.+\.(mp3|flac|wav|ogg|m4a|aac)$/i,
                );
                if (pathMatch) {
                  fixedPath = "/" + pathMatch[0].replace(/^\/+/, "");
                  console.log("🔧 Fixed legacy path for:", song.title);
                }
              }

              return { ...song, filePath: fixedPath };
            });

            state.songs = fixedSongs;

            setTimeout(async () => {
              const songsWithArtwork = await Promise.all(
                fixedSongs.map(async (song) => {
                  if (!song.artwork && song.filePath) {
                    const artwork = await getArtwork(song.filePath);
                    return { ...song, artwork: artwork || undefined };
                  }
                  return song;
                }),
              );
              state.songs = songsWithArtwork;
            }, 100);
          }
        };
      },
    },
  ),
);
