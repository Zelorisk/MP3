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

## discord rich presence setup

to enable spotify-like discord rich presence that shows what you're currently playing:

### step 1: create discord application

1. go to https://discord.com/developers/applications
2. click "new application" 
3. name it exactly "music player" (or whatever you want to display)
4. click "create"
5. copy the **application id** (you'll need this in step 2)

### step 2: add rich presence assets (optional but recommended)

1. in your discord application, go to "rich presence" → "art assets"
2. click "add image(s)"
3. upload an image (recommended: 1024x1024 png) 
4. name it exactly `music_icon` (this is what the app looks for)
5. click "save changes"

**suggested images:**
- use a music note icon, equalizer, or headphones image
- for spotify-like experience, use a green/black themed image
- you can create one at https://www.canva.com or use any image editor

### step 3: configure the app

1. open `src-tauri/src/lib.rs` in a code editor
2. find line 13: `discord.connect("1234567890123456789")`
3. replace `1234567890123456789` with your application id from step 1
4. save the file

### step 4: rebuild the app

```bash
cd music-player
npm run tauri build
```

the built app will be in `src-tauri/target/release/bundle/`

### step 5: test it

1. make sure discord is running
2. launch your music player app
3. play a song
4. check your discord profile - it should show:
   - **details**: song title
   - **state**: "by [artist]" (or "paused • by [artist]")
   - **large image**: your uploaded icon (if you added one)
   - **large text**: album name
   - **time remaining**: countdown timer when playing

### troubleshooting

**discord rpc not showing:**
- make sure discord desktop app is running (not browser)
- verify your application id is correct in `lib.rs`
- check that the app rebuilt successfully after changing the id
- restart both discord and the music player

**"failed to connect to discord" error:**
- close discord completely and reopen it
- check if another app is using discord rpc
- on linux, ensure discord ipc socket is accessible at `$XDG_RUNTIME_DIR/discord-ipc-0`

**image not showing:**
- verify the asset name is exactly `music_icon` (case-sensitive)
- wait a few minutes after uploading - discord caches assets
- check the image was saved in the discord developer portal

**different app name showing:**
- the name shown in discord is your application name from the developer portal
- to change it, rename your application in the discord developer portal
- changes may take a few minutes to propagate

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
