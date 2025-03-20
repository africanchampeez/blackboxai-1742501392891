# Champion 24 Music Player

A modern, Progressive Web App (PWA) music player that works offline and can be installed on mobile devices.

## Features

- 🎵 Play local music files
- 📱 Install as a mobile app
- 💜 Create and manage favorites
- 📋 Create custom playlists
- 🔄 Shuffle and repeat modes
- 📴 Offline support
- 🎨 Modern, responsive design

## Installation

### As a Mobile App

1. Open the app in your mobile browser: `https://your-domain.com`
2. Tap the "Install App" button when prompted
3. The app will be installed on your device and can be accessed from your home screen

### As a Web App

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate app icons:
   ```bash
   node generate-icons.js
   ```
4. Serve the app:
   ```bash
   python3 -m http.server 8000
   ```
5. Open `http://localhost:8000` in your browser

## Usage

1. **Add Music**
   - Click the "+" icon to upload local music files
   - Supported formats: MP3, WAV, OGG

2. **Create Playlists**
   - Click "New Playlist"
   - Enter playlist name
   - Add songs to your playlist

3. **Favorites**
   - Click the heart icon on any song to add it to favorites
   - Access your favorites from the Favorites tab

4. **Playback Controls**
   - Play/Pause: Space bar or click play button
   - Next/Previous: Arrow keys or click next/previous buttons
   - Volume: Up/Down arrow keys
   - Shuffle: Click shuffle button
   - Repeat: Click repeat button

## Technical Details

- Built with HTML5, CSS3, and JavaScript
- Uses Web Audio API for audio processing
- Implements Service Workers for offline support
- Uses IndexedDB for local storage
- Follows PWA best practices

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

MIT License
