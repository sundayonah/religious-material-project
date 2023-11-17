// audioSlice.js
import {
   getLikesAndDislikesFromLocalStorage,
   saveLikesAndDislikesToLocalStorage,
} from '@/components/local-storage';
import { createSlice } from '@reduxjs/toolkit';

const audioSlice = createSlice({
   name: 'audio',
   initialState: {
      activeSongId: null,
      songStates: {}, // Object to store the playing state of each song
      repeat: false, // Add a repeat state
      volume: 1,
      volumeBar: false,
      prev: null, // Track previous song
      next: null, // Track next song
      currentTime: 0,
      duration: 0,
      progressBarWidth: 0,
      songDurations: {}, // New state property to store song durations
      songDetails: {
         id: '',
         title: '',
         artist: '',
         duration: 0, // You can include other details you need
         imageUrl: '',
         bookFile: '',
      },
      likedSongs: getLikesAndDislikesFromLocalStorage().likedSongs,
      dislikedSongs: getLikesAndDislikesFromLocalStorage().dislikedSongs,
   },
   reducers: {
      setActiveSong: (state, action) => {
         state.activeSongId = action.payload;
         state.songStates[action.payload] = true; // Start playing the new song.
         state.currentTime = 0; // Reset currentTime when a new song is selected.
         state.duration = 0; // Reset duration when a new song is selected.
         state.imageUrl = null; // Reset imageUrl when a new song is selected
      },

      togglePlayback: (state, action) => {
         const songId = action.payload;
         if (songId === state.activeSongId) {
            state.songStates[songId] = !state.songStates[songId]; // Toggle play/pause state of the active song.
         }
      },
      toggleRepeat: (state) => {
         state.repeat = !state.repeat;
      },
      setVolume: (state, action) => {
         state.volume = action.payload;
      },
      setNextSong: (state, action) => {
         state.next = action.payload;
         console.log(state, action);
      },
      setPreviousSong: (state, action) => {
         state.prev = action.payload;
      },
      handleControls: (state, { payload }) => {
         if (payload === 'prev') {
            if (state.prev !== null) {
               state.next = state.activeSongId;
               state.activeSongId = state.prev;
               state.prev = null;
            }
         } else if (payload === 'next') {
            if (state.next !== null) {
               state.prev = state.activeSongId;
               state.activeSongId = state.next;
               state.next = null;
            }
         }
      },
      updateSongDetails: (state, action) => {
         state.songDetails = action.payload;
      },
      setCurrentTime: (state, { payload }) => {
         state.currentTime = payload;
      },
      setDuration: (state, { payload }) => {
         state.duration = payload;
      },
      setImageUrl: (state, { payload }) => {
         state.imageUrl = payload;
      },
      setProgressBarWidth: (state, { payload }) => {
         state.progressBarWidth = payload;
      },

      setVolume: (state, { payload }) => {
         state.volume = payload;
      },
      setVolumeBar: (state, { payload }) => {
         state.volumeBar = payload;
      },
      setSongDuration: (state, action) => {
         const { songId, duration } = action.payload;
         state.songDurations[songId] = duration;
      },

      toggleLike: (state, action) => {
         const { songId, isLiked } = action.payload;
         state.likedSongs[songId] = isLiked;
         state.dislikedSongs[songId] = false;
         saveLikesAndDislikesToLocalStorage(
            state.likedSongs,
            state.dislikedSongs
         );
      },
      toggleDislike: (state, action) => {
         const { songId, isDisliked } = action.payload;
         state.dislikedSongs[songId] = isDisliked;
         state.likedSongs[songId] = false;
         saveLikesAndDislikesToLocalStorage(
            state.likedSongs,
            state.dislikedSongs
         );
      },
   },
});

export const {
   togglePlayback,
   setActiveSong,
   toggleRepeat,
   setVolume,
   setNextSong,
   setPreviousSong,
   handleControls,
   updateSongDetails,
   setCurrentTime,
   setProgressBarWidth,
   setVolumeBar,
   setDuration,
   setImageUrl,
   setSongDuration,
   toggleLike,
   toggleDislike,
} = audioSlice.actions;
export default audioSlice.reducer;
