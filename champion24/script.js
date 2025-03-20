// DOM Elements
const playButton = document.querySelector('.fa-play').parentElement;
const albumArt = document.getElementById('albumArt');
const songTitle = document.getElementById('songTitle');
const artistName = document.getElementById('artistName');
const progressBar = document.querySelector('.bg-purple-500');
const currentTime = document.querySelector('.text-gray-400');
const audioFileInput = document.getElementById('audioFileInput');
const songsList = document.getElementById('songsList');
const playlistsContainer = document.getElementById('playlistsContainer');
const favoritesContainer = document.getElementById('favoritesContainer');
const playlistModal = document.getElementById('playlistModal');
const audio = new Audio();

// State management
let currentSongIndex = 0;
let isPlaying = false;
let currentPlaylist = [];
let playlists = JSON.parse(localStorage.getItem('playlists')) || {};
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Default songs
const defaultSongs = [
    {
        title: 'Summer Vibes',
        artist: 'Champion Artist',
        cover: 'https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg',
        duration: '3:45'
    },
    {
        title: 'Midnight Dreams',
        artist: 'Champion Artist',
        cover: 'https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg',
        duration: '3:30'
    },
    {
        title: 'Ocean Waves',
        artist: 'Champion Artist',
        cover: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg',
        duration: '4:15'
    },
    {
        title: 'City Lights',
        artist: 'Champion Artist',
        cover: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg',
        duration: '3:55'
    }
];

// Initialize audio player
function initializePlayer() {
    currentPlaylist = [...defaultSongs];
    renderSongs();
    renderPlaylists();
    renderFavorites();
    setupEventListeners();
}

// File upload handling
audioFileInput.addEventListener('change', handleFileUpload);

function handleFileUpload(event) {
    const files = event.target.files;
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const song = {
                title: file.name.replace(/\.[^/.]+$/, ""),
                artist: 'Local File',
                cover: 'https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg',
                duration: '0:00',
                file: e.target.result
            };
            currentPlaylist.push(song);
            renderSongs();
        };
        reader.readAsDataURL(file);
    });
}

// Playlist management
function createPlaylist(name) {
    playlists[name] = [];
    localStorage.setItem('playlists', JSON.stringify(playlists));
    renderPlaylists();
}

function addToPlaylist(playlistName, song) {
    playlists[playlistName].push(song);
    localStorage.setItem('playlists', JSON.stringify(playlists));
    renderPlaylists();
}

function toggleFavorite(song) {
    const index = favorites.findIndex(fav => fav.title === song.title);
    if (index === -1) {
        favorites.push(song);
    } else {
        favorites.splice(index, 1);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderFavorites();
}

// Render functions
function renderSongs() {
    songsList.innerHTML = currentPlaylist.map((song, index) => createSongElement(song, index)).join('');
}

function renderPlaylists() {
    playlistsContainer.innerHTML = Object.keys(playlists).map(name => `
        <div class="bg-gray-800 rounded-lg p-4">
            <h4 class="font-medium mb-2">${name}</h4>
            <p class="text-gray-400 text-sm">${playlists[name].length} songs</p>
        </div>
    `).join('');
}

function renderFavorites() {
    favoritesContainer.innerHTML = favorites.map((song, index) => createSongElement(song, index, true)).join('');
}

function createSongElement(song, index, isFavorite = false) {
    const isActive = index === currentSongIndex;
    const isFav = favorites.some(fav => fav.title === song.title);
    
    return `
        <div class="bg-gray-800 rounded-lg p-4 flex items-center gap-4 hover:bg-gray-700 transition-colors cursor-pointer ${isActive ? 'border-l-4 border-purple-500' : ''}"
             onclick="playSong(${index})">
            <img src="${song.cover}" alt="${song.title}" class="w-12 h-12 rounded-md object-cover">
            <div class="flex-1">
                <h4 class="font-medium">${song.title}</h4>
                <p class="text-gray-400 text-sm">${song.artist}</p>
            </div>
            <button onclick="toggleFavorite(currentPlaylist[${index}]); event.stopPropagation();"
                    class="hover:text-purple-500 transition-colors ${isFav ? 'favorite-active' : ''}">
                <i class="fas fa-heart"></i>
            </button>
            <span class="text-gray-400">${song.duration}</span>
        </div>
    `;
}

// Audio control functions
function playSong(index) {
    currentSongIndex = index;
    const song = currentPlaylist[index];
    
    if (song.file) {
        audio.src = song.file;
    }
    
    updatePlayerUI(song);
    audio.play();
    isPlaying = true;
    playButton.querySelector('i').classList.replace('fa-play', 'fa-pause');
    albumArt.classList.add('rotating');
}

// Toggle play/pause
playButton.addEventListener('click', () => {
    if (audio.src) {
        const playIcon = playButton.querySelector('i');
        if (isPlaying) {
            audio.pause();
            playIcon.classList.replace('fa-pause', 'fa-play');
            albumArt.classList.remove('rotating');
        } else {
            audio.play();
            playIcon.classList.replace('fa-play', 'fa-pause');
            albumArt.classList.add('rotating');
        }
        isPlaying = !isPlaying;
    }
});

// Setup event listeners
function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`${btn.dataset.tab}Container`).classList.add('active');
        });
    });

    // Playlist modal
    document.getElementById('newPlaylistBtn').addEventListener('click', () => {
        playlistModal.style.display = 'flex';
    });

    document.getElementById('cancelPlaylist').addEventListener('click', () => {
        playlistModal.style.display = 'none';
    });

    document.getElementById('createPlaylist').addEventListener('click', () => {
        const name = document.getElementById('playlistName').value.trim();
        if (name) {
            createPlaylist(name);
            playlistModal.style.display = 'none';
            document.getElementById('playlistName').value = '';
        }
    });

    // Audio events
    audio.addEventListener('timeupdate', () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${progress}%`;
        currentTime.textContent = formatTime(audio.currentTime);
    });

    audio.addEventListener('ended', () => {
        const nextIndex = (currentSongIndex + 1) % currentPlaylist.length;
        playSong(nextIndex);
    });
}

// Helper functions
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Initialize the player
initializePlayer();

// Update player UI
function updatePlayerUI(song) {
    albumArt.src = song.cover;
    songTitle.textContent = song.title;
    artistName.textContent = song.artist;
}

// Handle next/previous
document.querySelector('.fa-forward').parentElement.addEventListener('click', () => {
    const nextIndex = (currentSongIndex + 1) % currentPlaylist.length;
    playSong(nextIndex);
});

document.querySelector('.fa-backward').parentElement.addEventListener('click', () => {
    const prevIndex = (currentSongIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
    playSong(prevIndex);
});

// Handle shuffle and repeat
let isShuffleOn = false;
let isRepeatOn = false;

document.querySelector('.fa-shuffle').parentElement.addEventListener('click', (e) => {
    isShuffleOn = !isShuffleOn;
    e.target.classList.toggle('text-purple-500');
});

document.querySelector('.fa-repeat').parentElement.addEventListener('click', (e) => {
    isRepeatOn = !isRepeatOn;
    e.target.classList.toggle('text-purple-500');
});

// Volume control
let volume = 1;
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && volume < 1) {
        volume = Math.min(1, volume + 0.1);
        audio.volume = volume;
    } else if (e.key === 'ArrowDown' && volume > 0) {
        volume = Math.max(0, volume - 0.1);
        audio.volume = volume;
    }
});

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        playButton.click();
    } else if (e.code === 'ArrowRight') {
        document.querySelector('.fa-forward').parentElement.click();
    } else if (e.code === 'ArrowLeft') {
        document.querySelector('.fa-backward').parentElement.click();
    }
});

// Smooth transitions
albumArt.addEventListener('load', () => {
    albumArt.classList.add('transition-all');
});
