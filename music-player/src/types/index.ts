export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  filePath: string;
  artwork?: string;
  year?: number;
  genre?: string;
  dateAdded: number;
}

export interface Playlist {
  id: string;
  name: string;
  songs: string[];
  createdAt: number;
  updatedAt: number;
}

export type RepeatMode = 'off' | 'all' | 'one';

export interface PlayerState {
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
}

export interface LibraryState {
  songs: Song[];
  playlists: Playlist[];
  recentlyPlayed: string[];
  searchQuery: string;
  sortBy: 'title' | 'artist' | 'album' | 'duration' | 'dateAdded';
  sortOrder: 'asc' | 'desc';
}
