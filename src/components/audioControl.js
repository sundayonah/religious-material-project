import React, {
   useRef,
   useState,
   useEffect,
   useContext,
   useCallback,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
   PrevIcon,
   NextIcon,
   PauseIcon,
   PlayIcon,
   RepeatIcon,
   SpeakerIcon,
   ThumbsUp,
   ThumbsDown,
} from '@/components/icons';
import {
   togglePlayback,
   setActiveSong,
   toggleRepeat,
   setVolume,
   setNextSong,
   setPreviousSong,
   updateSongDetails,
   setCurrentTime,
   setProgressBarWidth,
   setDuration,
   setImageUrl,
   toggleLike,
   toggleDislike,
   handleControls, // New action for handling prev/next
} from '@/reduxToolkit/slices/audioSlice';
import { StateContext } from '@/Context/ReligiousContext';
import Volume from './Volume';

const AudioPlayer = () => {
   const ref = useRef(null);

   const dispatch = useDispatch();
   const {
      handlePlayClick,
      //   songStates,
      //   activeSongId,
      audioRefs,
      handleSongEnd,
   } = useContext(StateContext);
   const [mousedown, setMouseDown] = useState(false);
   const [progressUpdateInterval, setProgressUpdateInterval] = useState(null);
   // const [isLiked, setIsLiked] = useState(false);
   // const [isDisliked, setIsDisliked] = useState(false);

   // const [currentTime, setCurrentTime] = useState(0);
   // const [duration, setDuration] = useState(0);

   const songStates = useSelector((state) => state.audio.songStates);
   const activeSongId = useSelector((state) => state.audio.activeSongId);
   const repeat = useSelector((state) => state.audio.repeat);

   const isPlaying = useSelector(
      (state) => state.audio.songStates[state.audio.activeSongId]
   );

   const currentTime = useSelector((state) => state.audio.currentTime);
   const duration = useSelector((state) => state.audio.duration);
   const progressBarWidth = useSelector(
      (state) => state.audio.progressBarWidth
   );

   // const likedSongs = useSelector((state) => state.audio.likedSongs);
   // const dislikedSongs = useSelector((state) => state.audio.dislikedSongs);

   const isLiked = useSelector((state) => state.audio.likedSongs[activeSongId]);
   const isDisliked = useSelector(
      (state) => state.audio.dislikedSongs[activeSongId]
   );

   const songDetails = useSelector((state) => state.audio.songDetails);
   // console.log(songDetails);

   const imageUrl = useSelector((state) => state.audio.imageUrl);
   const volume = useSelector((state) => state.audio.volume);

   const purchasedProducts =
      JSON.parse(localStorage.getItem('purchasedProducts')) || [];

   // console.log('Active Song ID:', activeSongId);

   const startProgressUpdateInterval = (audio) => {
      const interval = setInterval(() => {
         const currentTime = audio.currentTime;
         const totalTime = audio.duration;
         const image = audio.imageUrl;
         console.log(image);
         if (!isNaN(totalTime)) {
            const percentage = (currentTime / totalTime) * 100;
            dispatch(setProgressBarWidth(percentage));
            dispatch(setCurrentTime(currentTime));
            dispatch(setDuration(totalTime));
            dispatch(setImageUrl(image));
         }
      }, 1000); // Update every 1000 milliseconds (1 second)
      return interval;
   };

   // Define the progress update function.
   const handleProgressUpdate = () => {
      const audio = audioRefs[activeSongId];
      if (audio && audio.duration) {
         const currentTime = audio.currentTime;
         const totalTime = audio.duration;
         const percentage = (currentTime / totalTime) * 100;
         dispatch(setProgressBarWidth(percentage));
         dispatch(setCurrentTime(currentTime));
         dispatch(setDuration(totalTime));
         // dispatch(setImageUrl(image));
      }
   };

   useEffect(() => {
      // Set up a progress update interval when the component mounts
      const audio = audioRefs[activeSongId];
      if (audio && isPlaying) {
         const interval = setInterval(handleProgressUpdate, 1000);
         setProgressUpdateInterval(interval);

         // Clear the interval when the component unmounts
         return () => clearInterval(interval);
      }
   }, [activeSongId, isPlaying, audioRefs]);

   const handlePlayPause = () => {
      const audio = audioRefs[activeSongId];
      if (audio) {
         if (isPlaying) {
            audio.pause();
            clearInterval(progressUpdateInterval); // Clear the existing interval
         } else {
            audio.play().catch((error) => {
               console.error('Failed to play audio:', error);
            });
            // Start the progress update interval and set it in state
            const interval = setInterval(handleProgressUpdate);
            setProgressUpdateInterval(interval);
         }
         dispatch(togglePlayback(activeSongId));
      }
      console.log('ytfjhgv');
   };

   const handleLikes = () => {
      if (isLiked) {
         // If already liked, remove like
         dispatch(toggleLike({ songId: activeSongId, isLiked: false }));
      } else {
         // If not liked, add like
         dispatch(toggleLike({ songId: activeSongId, isLiked: true }));
      }
   };

   const handleDislikes = () => {
      if (isDisliked) {
         // If already disliked, remove dislike
         dispatch(toggleDislike({ songId: activeSongId, isDisliked: false }));
      } else {
         // If not disliked, add dislike
         dispatch(toggleDislike({ songId: activeSongId, isDisliked: true }));
      }
   };

   const playNextSong = () => {
      const productIds = purchasedProducts.map((product) => {
         const parsedProduct = JSON.parse(product);
         return parsedProduct.id;
      });

      const currentIndex = productIds.indexOf(activeSongId);

      if (currentIndex !== -1 && currentIndex < productIds.length - 1) {
         const nextSongId = productIds[currentIndex + 1];

         // Find the index of the next song in purchasedProducts
         const nextSongIndex = purchasedProducts.findIndex((product) => {
            const parsedProduct = JSON.parse(product);
            return parsedProduct.id === nextSongId;
         });

         if (nextSongIndex !== -1) {
            // Get the next song's details (title, artist, duration, etc.)
            const nextSongDetails = JSON.parse(
               purchasedProducts[nextSongIndex]
            );

            // Retrieve the audio element for the current and next songs
            const currentAudio = audioRefs[activeSongId];
            const nextAudio = audioRefs[nextSongId];
            if (currentAudio && nextAudio) {
               currentAudio.pause();
               currentAudio.currentTime = 0;

               nextAudio.play().then(() => {
                  // Update the active song in the Redux store after the audio has started playing
                  dispatch(setActiveSong(nextSongId));
                  dispatch(updateSongDetails(nextSongDetails));

                  nextAudio.addEventListener('loadedmetadata', () => {
                     // Update the duration and progress bar width when the new audio is ready
                     const newDuration = nextAudio.duration;
                     dispatch(setDuration(newDuration));

                     const interval = startProgressUpdateInterval(nextAudio);
                     setProgressUpdateInterval(interval);
                  });
               });
            }
         }
      }
   };

   const playPreviousSong = () => {
      const productIds = purchasedProducts.map((product) => {
         const parsedProduct = JSON.parse(product);
         return parsedProduct.id;
      });

      const currentIndex = productIds.indexOf(activeSongId);

      if (currentIndex > 0) {
         const previousSongId = productIds[currentIndex - 1];

         // Find the index of the previous song in purchasedProducts
         const previousSongIndex = purchasedProducts.findIndex((product) => {
            const parsedProduct = JSON.parse(product);
            return parsedProduct.id === previousSongId;
         });

         if (previousSongIndex !== -1) {
            // Get the previous song's details (title, artist, duration, etc.)
            const previousSongDetails = JSON.parse(
               purchasedProducts[previousSongIndex]
            );

            // Retrieve the audio element for the current and previous songs
            const currentAudio = audioRefs[activeSongId];
            const previousAudio = audioRefs[previousSongId];

            if (currentAudio && previousAudio) {
               // Pause the current song and reset its currentTime to 0
               currentAudio.pause();
               currentAudio.currentTime = 0;

               previousAudio.play().then(() => {
                  // Update the active song in the Redux store after the audio has started playing
                  dispatch(setActiveSong(previousSongId));
                  dispatch(updateSongDetails(previousSongDetails));

                  previousAudio.addEventListener('loadedmetadata', () => {
                     // Update the duration and progress bar width when the new audio is ready
                     const newDuration = previousAudio.duration;
                     dispatch(setDuration(newDuration));

                     // Clear the existing progress update interval before starting a new one
                     clearInterval(progressUpdateInterval);

                     const interval = setInterval(handleProgressUpdate, 1000);
                     setProgressUpdateInterval(interval);
                  });
               });
            }
         }
      }
   };

   // Define a function to format time (for example, to display in MM:SS format)
   const formatTime = (time) => {
      const minutes = Math.floor(time / 60);
      // console.log(minutes);
      const seconds = Math.floor(time % 60);
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
         2,
         '0'
      )}`;
   };

   const handleVolume = (e) => {
      if (e.target.classList.contains('input')) return;

      // Get the active song's audio element using the activeSongId
      const audio = audioRefs[activeSongId];

      if (audio) {
         if (volume > 0) {
            dispatch(setVolume(0)); // Update the volume in Redux
            audio.volume = 0; // Mute the audio
         } else {
            dispatch(setVolume(1)); // Update the volume in Redux
            audio.volume = 1; // Unmute the audio
         }
      }
   };

   const handleVolumeChange = (e) => {
      dispatch(setVolume(e.target.value)); // Update the volume in Redux
      const audio = audioRefs[activeSongId]; // Get the correct audio element
      if (audio) {
         audio.volume = e.target.value; // Set the volume
      }
   };

   // useEffect(() => {
   //    if (currentTime < 1) return;

   //    const audio = ref.current;

   //    if (audio) {
   //       audio.addEventListener('loadedmetadata', () => {
   //          // The 'loadedmetadata' event is triggered when the duration becomes available
   //          const totalTime = audio.duration;
   //          console.log(totalTime);
   //          const percentage = (currentTime / totalTime) * 100;
   //          dispatch(setDuration(totalTime));
   //          dispatch(setProgressBarWidth(percentage));
   //       });

   //       return () => {
   //          // Clean up the event listener when the component unmounts
   //          audio.removeEventListener('loadedmetadata');
   //       };
   //    }
   // }, [currentTime, dispatch]);

   // useEffect(() => {
   //    const audio = audioRefs[activeSongId];
   //    if (audio) {
   //       audio.onloadedmetadata = () => {
   //          const newDuration = audio.duration;
   //          console.log(newDuration);
   //          dispatch(setDuration(newDuration));
   //       };
   //    }
   // }, [activeSongId]);

   const handleMouseDown = (e, flag) => {
      if (flag && !e.target.classList.contains('progress')) return;
      const currentPoint = e.clientX - e.target.getBoundingClientRect().left;
      console.log(currentPoint);
      const totalWidth = e.currentTarget.clientWidth;
      console.log(totalWidth);
      let percentage = ((currentPoint / totalWidth) * 100).toFixed(8);
      if (percentage > 100) percentage = 100;
      const newTime = Math.floor((percentage / 100) * ref.current.duration);
      console.log(newTime);
      dispatch(setCurrentTime(newTime));
      ref.current.currentTime = newTime;
      dispatch(setProgressBarWidth(percentage));
   };

   // console.log(songDetails);
   // console.log(activeSongId);

   return (
      <>
         <div className="fixed bottom-0 w-full">
            <div
               onClick={(e) => {
                  handleMouseDown(e, true);
               }}
               onMouseMove={(e) => {
                  if (mousedown && e.target.classList.contains('progress')) {
                     handleMouseDown(e, false);
                  }
               }}
               onMouseDown={() => setMouseDown(true)}
               onMouseLeave={() => setMouseDown(false)}
               className="w-full  progress border-t-[1px] border-[#828282] relative  pb-3"
            >
               <div
                  style={{ width: `${progressBarWidth}%` }}
                  className="relative -top-0 border-t-[2px] border-[#DAA851]"
               ></div>
            </div>

            <div className="flex justify-between items-center p-2">
               <div className=" flex justify-center items-center">
                  <button
                     onClick={playPreviousSong}
                     className="text-white px-2"
                  >
                     <PrevIcon />
                  </button>
                  <button
                     className="text-white"
                     onClick={() => handlePlayPause()}
                  >
                     {activeSongId && isPlaying ? <PauseIcon /> : <PlayIcon />}
                  </button>
                  <button onClick={playNextSong} className="text-white px-2">
                     <NextIcon />
                  </button>

                  <div className="flex items-center justify-between">
                     <span className="text-gray-500 text-xs px-3">
                        {formatTime(currentTime)} / {formatTime(duration)}
                     </span>
                  </div>
               </div>
               <div className="flex justify-center items-center">
                  <img
                     // src="/images/explore2.jpg"
                     src={songDetails.imageUrl}
                     alt={`Image`}
                     className="rounded-md cursor-pointer object-contain"
                     width={30}
                     height={30}
                     //  onClick={() => handlePlayClick(id)}
                  />
                  <div className="flex flex-col text-xs px-2">
                     <span className="text-white">{songDetails.title}</span>
                     <span className="text-gray-500">{songDetails.artist}</span>
                  </div>

                  <div className="flex justify-center items-center mx-4">
                     <button
                        onClick={handleLikes}
                        className={`px-3 relative group ${
                           isLiked ? 'text-likeColor' : ' text-white'
                        } `}
                     >
                        <ThumbsUp />

                        <div className="hidden group-hover:inline-block bg-black text-white text-xs absolute p-2 -mt-16 -ml-4 rounded whitespace-no-wrap">
                           Like
                        </div>
                     </button>
                     <button
                        onClick={handleDislikes}
                        className={`px-3 text-white relative group `}
                     >
                        <ThumbsDown color="white" />
                        <div className="hidden group-hover:inline-block bg-black text-white text-xs absolute p-2 -mt-16 -ml-4 rounded whitespace-no-wrap">
                           Dislike
                        </div>
                     </button>
                  </div>
               </div>
               <div className="flex justify-center items-center">
                  <Volume
                     handleVolume={handleVolume}
                     handleVolumeChange={handleVolumeChange}
                  />
                  <button className="text-white px-2">
                     <RepeatIcon />
                  </button>
               </div>
            </div>
         </div>
      </>
   );
};

export default AudioPlayer;
