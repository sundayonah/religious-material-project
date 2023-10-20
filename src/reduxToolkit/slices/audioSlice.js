// audioSlice.js
import { createSlice } from '@reduxjs/toolkit';

const audioSlice = createSlice({
   name: 'audio',
   initialState: {
      activeSongId: null,
      songStates: {}, // Object to store the playing state of each song
   },
   reducers: {
      setActiveSong: (state, action) => {
         state.activeSongId = action.payload;
         state.songStates[action.payload] = true; // Start playing the new song.
      },
      togglePlayback: (state, action) => {
         const songId = action.payload;
         if (songId === state.activeSongId) {
            state.songStates[songId] = !state.songStates[songId]; // Toggle play/pause state of the active song.
         }
      },
   },
});

export const { togglePlayback, setActiveSong } = audioSlice.actions;
export default audioSlice.reducer;
