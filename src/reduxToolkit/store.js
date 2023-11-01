// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import songsReducer from '../reduxToolkit/slices/songsSlices';
import audioReducer from '../reduxToolkit/slices/audioSlice';
import messageReducer from '../reduxToolkit/slices/messagesSlice';
import bookReducer from '../reduxToolkit/slices/bookSlice';

const store = configureStore({
   reducer: {
      songs: songsReducer,
      audio: audioReducer,
      message: messageReducer,
      book: bookReducer,
   },
});

export default store;
