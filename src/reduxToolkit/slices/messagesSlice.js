// messageSlice.js
import {
   getLikesAndDislikesFromLocalStorage,
   saveLikesAndDislikesToLocalStorage,
} from '@/components/local-storage';
import { createSlice } from '@reduxjs/toolkit';

const messageSlice = createSlice({
   name: 'message',
   initialState: {
      activeMessageId: null,
      messageStates: {}, // Object to store the playing state of each song
      repeat: false, // Add a repeat state
      volume: 1,
      volumeBar: false,
      prev: null, // Track previous song
      next: null, // Track next song
      currentTime: 0,
      duration: 0,
      progressBarWidth: 0,
      messageDurations: {}, // New state property to store song durations
      messageDetails: {
         id: '',
         title: '',
         artist: '',
         duration: 0, // You can include other details you need
         imageUrl: '',
      },
      likedMessage: getLikesAndDislikesFromLocalStorage().likedMessage,
      dislikedMessage: getLikesAndDislikesFromLocalStorage().dislikedMessage,
   },
   reducers: {
      setActiveMessage: (state, action) => {
         state.activeMessageId = action.payload;
         state.messageStates[action.payload] = true; // Start playing the new song.
         state.currentTime = 0; // Reset currentTime when a new song is selected.
         state.duration = 0; // Reset duration when a new song is selected.
         state.imageUrl = null; // Reset imageUrl when a new song is selected
      },

      togglePlayback: (state, action) => {
         const messageId = action.payload;
         if (messageId === state.activeMessageId) {
            state.messageStates[messageId] = !state.messageStates[messageId]; // Toggle play/pause state of the active song.
         }
      },
      toggleRepeat: (state) => {
         state.repeat = !state.repeat;
      },
      setVolume: (state, action) => {
         state.volume = action.payload;
      },
      setNextMessage: (state, action) => {
         state.next = action.payload;
         console.log(state, action);
      },
      setPreviousMessage: (state, action) => {
         state.prev = action.payload;
      },
      handleControls: (state, { payload }) => {
         if (payload === 'prev') {
            if (state.prev !== null) {
               state.next = state.activeMessageId;
               state.activeMessageId = state.prev;
               state.prev = null;
            }
         } else if (payload === 'next') {
            if (state.next !== null) {
               state.prev = state.activeMessageId;
               state.activeMessageId = state.next;
               state.next = null;
            }
         }
      },
      updateMessageDetails: (state, action) => {
         state.messageDetails = action.payload;
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
      setMessageDuration: (state, action) => {
         const { messageId, duration } = action.payload;
         state.messageDurations[messageId] = duration;
      },

      toggleLike: (state, action) => {
         const { messageId, isLiked } = action.payload;
         state.likedMessage[messageId] = isLiked;
         state.dislikedMessage[messageId] = false;
         saveLikesAndDislikesToLocalStorage(
            state.likedMessage,
            state.dislikedMessage
         );
      },
      toggleDislike: (state, action) => {
         const { messageId, isDisliked } = action.payload;
         state.dislikedMessage[messageId] = isDisliked;
         state.likedMessage[messageId] = false;
         saveLikesAndDislikesToLocalStorage(
            state.likedMessage,
            state.dislikedMessage
         );
      },
   },
});

export const {
   togglePlayback,
   setActiveMessage,
   toggleRepeat,
   setVolume,
   setNextMessage,
   setPreviousMessage,
   handleControls,
   updateMessageDetails,
   setCurrentTime,
   setProgressBarWidth,
   setVolumeBar,
   setDuration,
   setImageUrl,
   setMessageDuration,
   toggleLike,
   toggleDislike,
} = messageSlice.actions;
export default messageSlice.reducer;
