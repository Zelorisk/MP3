# music player

a minimalist desktop mp3 music player built with tauri, react, and typescript.

## features

- **spotify-like interface**: home, search, library, playlists, and recent views
- **audio playback**: play mp3, flac, wav, ogg, m4a, and aac files
- **metadata extraction**: automatically reads id3 tags for artist, title, album, artwork (parallel processing for fast loading)
- **smart search**: instant search across all songs by title, artist, or album
- **playlist management**: create, rename, delete playlists with drag-and-drop song management
- **recently played**: tracks your listening history with quick access
- **shuffle & repeat**: random playback and loop modes (track/all)
- **keyboard shortcuts**: space (play/pause), arrow keys (volume/navigation)
- **discord rich presence**: shows what you're listening to on discord (spotify-style)
- **modern ui**: dark spotify-inspired interface with smooth animations
- **lightweight**: tauri makes it ~10-15mb (vs 150mb+ electron apps)
- **persistent storage**: your library and playlists are saved automatically

## keyboard shortcuts

- `space` - play/pause
- `arrow left` - previous track
- `arrow right` - next track
- `arrow up` - volume up
- `arrow down` - volume down

## development

```bash
npm install
npm run tauri dev
```

## build

```bash
npm run tauri build
```

builds will be in `src-tauri/target/release/bundle/`:
- **macos**: .dmg and .app
- **windows**: .exe and .msi
- **linux**: .deb and .appimage

## usage

1. click "add files" or "add folder" in the sidebar
2. select your music files or folder
3. click any song to start playing
4. use playback controls at the bottom or keyboard shortcuts

## tech stack

- tauri 2.x - desktop framework
- react 19 - ui framework
- typescript - type safety
- tailwind css - styling
- howler.js - audio engine
- music-metadata-browser - id3 tag reading
- zustand - state management
- lucide-react - icons
- discord-rich-presence - discord integration
