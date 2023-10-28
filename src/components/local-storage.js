// local-storage.js

export const saveLikesAndDislikesToLocalStorage = (
   likedSongs,
   dislikedSongs
) => {
   const likesAndDislikes = { likedSongs, dislikedSongs };
   //    console.log(likesAndDislikes.likedSongs);
   localStorage.setItem('likesAndDislikes', JSON.stringify(likesAndDislikes));
};

export const getLikesAndDislikesFromLocalStorage = () => {
   if (typeof localStorage !== 'undefined') {
      const data = localStorage.getItem('likesAndDislikes');
      if (data) {
         const likesAndDislikes = JSON.parse(data);
         return likesAndDislikes;
      }
   }
   return { likedSongs: {}, dislikedSongs: {} };
};
