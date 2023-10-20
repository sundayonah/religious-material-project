// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import songsReducer from '../reduxToolkit/slices/songsSlices';
import audioReducer from '../reduxToolkit/slices/audioSlice';

const store = configureStore({
   reducer: {
      songs: songsReducer,
      audio: audioReducer,
   },
});

export default store;
