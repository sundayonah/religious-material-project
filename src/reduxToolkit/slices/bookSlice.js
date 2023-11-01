// // bookSlice.js

// import { createSlice } from '@reduxjs/toolkit';

// const bookSlice = createSlice({
//    name: 'book',
//    initialState: {
//       activeBookId: null,
//       bookStates: {}, // Object to store the playing state of each song
//       likedBook: {},
//       dislikedBook: {},
//    },
//    reducers: {
//       toggleLike: (state, action) => {
//          const { bookId, isLiked } = action.payload;
//          console.log(bookId);
//          state.likedBook[bookId] = isLiked;
//          state.dislikedBook[bookId] = false;
//       },
//       toggleDislike: (state, action) => {
//          const { bookId, isDisliked } = action.payload;
//          state.dislikedBook[bookId] = isDisliked;
//          state.likedBook[bookId] = false;
//       },
//    },
// });

// export const { toggleLike, toggleDislike } = bookSlice.actions;
// export default bookSlice.reducer;

// bookSlice.js

import { createSlice } from '@reduxjs/toolkit';

const loadPreferencesFromLocalStorage = () => {
   if (typeof localStorage !== 'undefined') {
      const likedBook = JSON.parse(localStorage.getItem('likedBook')) || {};
      const dislikedBook =
         JSON.parse(localStorage.getItem('dislikedBook')) || {};
      return { likedBook, dislikedBook };
   } else {
      return { likedBook: {}, dislikedBook: {} };
   }
};

const initialState = loadPreferencesFromLocalStorage();

const bookSlice = createSlice({
   name: 'book',
   initialState,
   reducers: {
      toggleLike: (state, action) => {
         const { bookId, isLiked } = action.payload;
         state.likedBook[bookId] = isLiked;
         state.dislikedBook[bookId] = false;
         // Save preferences to local storage
         localStorage.setItem('likedBook', JSON.stringify(state.likedBook));
         localStorage.setItem(
            'dislikedBook',
            JSON.stringify(state.dislikedBook)
         );
      },
      toggleDislike: (state, action) => {
         const { bookId, isDisliked } = action.payload;
         state.dislikedBook[bookId] = isDisliked;
         state.likedBook[bookId] = false;
         // Save preferences to local storage
         localStorage.setItem('likedBook', JSON.stringify(state.likedBook));
         localStorage.setItem(
            'dislikedBook',
            JSON.stringify(state.dislikedBook)
         );
      },
   },
});

export const { toggleLike, toggleDislike } = bookSlice.actions;
export default bookSlice.reducer;
