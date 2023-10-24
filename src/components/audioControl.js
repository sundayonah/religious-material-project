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

   // const [currentTime, setCurrentTime] = useState(0);
   // const [duration, setDuration] = useState(0);

   const songStates = useSelector((state) => state.audio.songStates);
   const activeSongId = useSelector((state) => state.audio.activeSongId);

   const isPlaying = useSelector(
      (state) => state.audio.songStates[state.audio.activeSongId]
   );

   const currentTime = useSelector((state) => state.audio.currentTime);
   const duration = useSelector((state) => state.audio.duration);
   const progressBarWidth = useSelector(
      (state) => state.audio.progressBarWidth
   );

   const songDetails = useSelector((state) => state.audio.songDetails);
   // console.log(songDetails);

   // const currentTime = useSelector((state) => state.audio.currentTime);
   const volume = useSelector((state) => state.audio.volume);

   const purchasedProducts =
      JSON.parse(localStorage.getItem('purchasedProducts')) || [];

   // console.log('Active Song ID:', activeSongId);

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
            console.log(nextSongDetails);

            // Retrieve the audio element for the current and next songs
            const currentAudio = audioRefs[activeSongId];
            const nextAudio = audioRefs[nextSongId];

            if (currentAudio && nextAudio) {
               // Pause the current song and reset its currentTime to 0
               currentAudio.pause();
               currentAudio.currentTime = 0;

               // Play the next song
               nextAudio.play();

               // Update the active song in the Redux store
               dispatch(setActiveSong(nextSongId));
               dispatch(updateSongDetails(nextSongDetails));
               // dispatch(setDuration(nextSongDetails.duration));
            }
         }
      }
   };

   const handlePlayPause = () => {
      // Ensure there's an active song
      if (activeSongId) {
         // Toggle the play/pause state in the Redux store
         dispatch(togglePlayback(activeSongId));

         const audio = audioRefs[activeSongId];
         // Retrieve the audio element for the active song

         if (audio) {
            if (isPlaying) {
               // If it's playing, pause the audio
               audio.pause();
               clearInterval(progressUpdateInterval); // Stop updating the progress bar
            } else {
               // If it's paused, play the audio
               audio.play().catch((error) => {
                  console.error('Failed to play audio:', error);
               });

               // Start a new interval to update the progress bar
               const interval = setInterval(() => {
                  // Update the progress bar based on the audio's current time
                  const currentTime = audio.currentTime;
                  // console.log(currentTime);
                  const totalTime = audio.duration;
                  // console.log(totalTime);
                  if (!isNaN(totalTime)) {
                     const percentage = (currentTime / totalTime) * 100;
                     dispatch(setProgressBarWidth(percentage));
                     dispatch(setCurrentTime(currentTime));
                  }
               }, 1000); // Update every 1000 milliseconds (1 second)
               setProgressUpdateInterval(interval);
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

               // Play the previous song
               previousAudio.play();

               // Update the active song in the Redux store
               dispatch(setActiveSong(previousSongId));
               dispatch(updateSongDetails(previousSongDetails));
            }
         }
      }
   };

   // console the currentTime and duration

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
   //    const totalTime = ref.current?.duration;
   //    console.log(currentTime.toFixed());
   //    console.log(totalTime);
   //    const percentage = ((currentTime / Math.floor(totalTime)) * 100).toFixed(
   //       8
   //    );
   //    dispatch(setProgressBarWidth(percentage));
   // }, [currentTime, dispatch]);

   useEffect(() => {
      if (currentTime < 1) return;

      const audio = ref.current;

      if (audio) {
         audio.addEventListener('loadedmetadata', () => {
            // The 'loadedmetadata' event is triggered when the duration becomes available
            const totalTime = audio.duration;
            console.log(totalTime);
            const percentage = (currentTime / totalTime) * 100;
            dispatch(setDuration(totalTime));
            dispatch(setProgressBarWidth(percentage));
         });

         return () => {
            // Clean up the event listener when the component unmounts
            audio.removeEventListener('loadedmetadata');
         };
      }
   }, [currentTime, dispatch]);

   useEffect(() => {
      const audio = audioRefs[activeSongId];
      console.log(audio);
      if (audio) {
         audio.onloadedmetadata = () => {
            const newDuration = audio.duration;
            console.log(newDuration);
            dispatch(setDuration(newDuration));
         };
      }
   }, [activeSongId]);

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

   return (
      <>
         <div className="fixed bottom-0 w-full bg-black  p-5">
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
               className="w-full progress border-t-[5px] border-red-300 relative mx-auto"
            >
               <div
                  style={{ width: `${progressBarWidth}%` }}
                  className="relative -top-1 border-t-[5px] border-t-red-500"
               >
                  {/* <span
                     className="absolute -top-2.5 -right-3 w-4 h-4 hover:scale-110 rounded-full bg-red-800 "
                     onMouseUp={() => setMouseDown(false)}
                  ></span> */}
               </div>
            </div>
            <div className="flex justify-between items-center">
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
                     {activeSongId && isPlaying ? <PlayIcon /> : <PauseIcon />}
                  </button>
                  <button onClick={playNextSong} className="text-white px-2">
                     <NextIcon />
                  </button>

                  <div className="flex items-center justify-between">
                     <span className="text-gray-500 text-xs px-3">
                        {formatTime(currentTime)} / {formatTime(duration)}
                     </span>
                  </div>

                  {/* <span className="text-gray-500 text-xs px-3">
                     4:44 / 7:16
                  </span> */}
               </div>
               <div className="flex justify-center items-center">
                  <img
                     src="/images/explore2.jpg"
                     alt={`Image`}
                     className="rounded-md cursor-pointer object-contain"
                     width={30}
                     height={30}
                     //  onClick={() => handlePlayClick(id)}
                  />
                  <div className="flex flex-col text-xs px-2">
                     {/* <span className="text-white">Song Title</span>
                     <span className=" text-gray-500">Artist Name</span> */}
                     <span className="text-white">{songDetails.title}</span>
                     <span className="text-gray-500">{songDetails.artist}</span>
                  </div>
               </div>
               <div className="flex justify-center items-center">
                  {/* <input
                     type="range"
                     value={volume}
                     onChange={handleVolumeChange}
                     min="0"
                     max="1"
                     step="0.01"
                  /> */}
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
