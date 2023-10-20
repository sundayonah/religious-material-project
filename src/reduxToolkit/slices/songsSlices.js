// redux/slices/songsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const songsSlice = createSlice({
   name: 'songs',
   initialState: { purchasedSongs: [] },
   reducers: {
      addSong: (state, action) => {
         state.purchasedSongs.push(action.payload);
      },
   },
});

export const { addSong } = songsSlice.actions;
export default songsSlice.reducer;
