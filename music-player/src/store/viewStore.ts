import { create } from 'zustand';

export type ViewType = 'home' | 'search' | 'library' | 'playlist' | 'recent';

interface ViewStore {
  currentView: ViewType;
  selectedPlaylistId: string | null;

  setView: (view: ViewType) => void;
  setPlaylistView: (playlistId: string) => void;
}

export const useViewStore = create<ViewStore>((set) => ({
  currentView: 'home',
  selectedPlaylistId: null,

  setView: (view) => set({ currentView: view, selectedPlaylistId: null }),
  setPlaylistView: (playlistId) => set({ currentView: 'playlist', selectedPlaylistId: playlistId }),
}));
