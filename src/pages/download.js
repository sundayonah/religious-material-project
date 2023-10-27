import React, { useContext, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { StateContext } from '@/Context/ReligiousContext';
import AudioControl from '@/components/audioControl';
import { PlayIcon, PauseIcon, ThumbsUp, ThumbsDown } from '@/components/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
   setActiveSong,
   setCurrentTime,
   setDuration,
   setProgressBarWidth,
   setSongDuration,
   togglePlayback,
   toggleLike,
   toggleDislike,
} from '@/reduxToolkit/slices/audioSlice';
import DownloadSidebar from '@/components/downloadSidebar';

const Download = () => {
   const { handlePlayClick, audioRefs, handleSongEnd } =
      useContext(StateContext);
   const activeSongId = useSelector((state) => state.audio.activeSongId);
   const isPlaying = useSelector(
      (state) => state.audio.songStates[state.audio.activeSongId]
   );
   const likedSongs = useSelector((state) => state.audio.likedSongs);
   const dislikedSongs = useSelector((state) => state.audio.dislikedSongs);

   const [purchasedProducts, setPurchasedProducts] = useState([]);
   const [progressUpdateInterval, setProgressUpdateInterval] = useState(null);
   // const [isLiked, setIsLiked] = useState(false);
   // const [isLiked, setIsLiked] = useState({});

   // const [isDisliked, setIsDisliked] = useState(false);
   const [hoveredItemId, setHoveredItemId] = useState(null);
   const [durationsUpdated, setDurationsUpdated] = useState(null);
   const [songDurations, setSongDurations] = useState({});

   const { address } = useAccount();
   const dispatch = useDispatch();

   useEffect(() => {
      // Retrieve the list of purchased products from local storage
      const storedPurchasedProducts =
         JSON.parse(localStorage.getItem('purchasedProducts')) || [];

      // Deserialize the stored products and filter them based on the current user's address
      const userPurchasedProducts = storedPurchasedProducts
         .map((serializedProduct) => JSON.parse(serializedProduct))
         .filter((item) => item.address === address);
      setPurchasedProducts(userPurchasedProducts);
   }, [address, dispatch]);

   const formatTime = (time) => {
      const minutes = Math.floor(time / 60);
      // console.log(minutes);
      const seconds = Math.floor(time % 60);
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
         2,
         '0'
      )}`;
   };

   useEffect(() => {
      const fetchSongDurations = async () => {
         const newDurations = {};

         for (const { id, file } of purchasedProducts) {
            const audio = new Audio(file);

            // Use the promise-based approach to get duration
            const duration = await new Promise((resolve) => {
               audio.addEventListener('loadedmetadata', () => {
                  resolve(audio.duration);
               });
               audio.load();
            });
            newDurations[id] = duration;
         }
         setSongDurations(newDurations);
      };

      if (purchasedProducts.length > 0) {
         fetchSongDurations();
      }
   }, [purchasedProducts]);

   const storedLikedSongs =
      typeof window !== 'undefined'
         ? JSON.parse(localStorage.getItem('likedSongs')) || {}
         : {};

   const storedDislikedSongs =
      typeof window !== 'undefined'
         ? JSON.parse(localStorage.getItem('dislikedSongs')) || {}
         : {};

   // Function to check if a song is liked
   const isSongLiked = (id) => storedLikedSongs[id] === true;

   // Function to check if a song is disliked
   const isSongDisliked = (id) => storedDislikedSongs[id] === true;

   // // Function to toggle like for a song
   // const handleToggleLike = (id) => {
   //    if (isSongLiked(id)) {
   //       // If the song is liked, toggle dislike
   //       dispatch(toggleDislike({ songId: id, isDisliked: true }));
   //    } else {
   //       // If the song is not liked, toggle like
   //       dispatch(toggleLike({ songId: id, isLiked: true }));
   //    }
   // };

   // // Function to toggle dislike for a song
   // const handleToggleDislike = (id) => {
   //    if (isSongDisliked(id)) {
   //       // If the song is disliked, toggle like
   //       dispatch(toggleLike({ songId: id, isLiked: true }));
   //    } else {
   //       // If the song is not disliked, toggle dislike
   //       dispatch(toggleDislike({ songId: id, isDisliked: true }));
   //    }
   // };

   // const handleToggleLike = (id) => {
   //    // Dispatch the action to toggle like for the song
   //    dispatch(toggleLike({ songId: id, isLiked: !isLiked[id] }));
   // };
   const handleToggleLike = (id) => {
      if (likedSongs[id]) {
         dispatch(toggleDislike({ songId: id, isDisliked: true }));
      } else {
         dispatch(toggleLike({ songId: id, isLiked: true }));
      }
   };
   const handleToggleDislike = (id) => {
      if (dislikedSongs[id]) {
         dispatch(toggleLike({ songId: id, isLiked: true }));
      } else {
         dispatch(toggleDislike({ songId: id, isDisliked: true }));
      }
   };

   // const handleToggleDislike = (id) => {
   //    // Dispatch the action to toggle dislike for the song
   //    dispatch(toggleDislike({ songId: id, isDisliked: !isDisliked[id] }));
   // };

   if (purchasedProducts.length === 0) {
      return (
         <div className="mt-28 text-gray-500 pl-5">
            <h1>Connect your wallet to see all your products</h1>
         </div>
      );
   }

   return (
      <>
         <div className="w-[80%] flex m-auto mt-28">
            <DownloadSidebar />
            <div className="w-full flex flex-col gap-3 p-2">
               {purchasedProducts.map(
                  ({ id, file, imageUrl, title, artist }) => (
                     <div
                        key={id}
                        className="flex justify-between items-center py-2 bg-transparent border-t-[1px] border-gray-700"
                        onMouseEnter={() => setHoveredItemId(id)}
                        onMouseLeave={() => setHoveredItemId(null)}
                     >
                        <div className="text-gray-700 relative">
                           <audio
                              preload="auto"
                              controls={false}
                              loop
                              style={{ display: 'none' }}
                              ref={(ref) => (audioRefs[id] = ref)}
                              onEnded={() => handleSongEnd(id)}
                           >
                              <source src={file} type="audio/mpeg" />
                           </audio>
                           <img
                              src={imageUrl}
                              alt={`Image ${title}`}
                              className="rounded-md cursor-pointer"
                              width={50}
                              height={50}
                              onClick={() => handlePlayClick(id)}
                           />

                           {activeSongId === id || hoveredItemId === id ? (
                              <div className="flex justify-center items-center p-1 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
                                 <button
                                    onClick={() =>
                                       handlePlayClick(
                                          id,
                                          title,
                                          artist,
                                          imageUrl
                                       )
                                    }
                                 >
                                    {activeSongId === id ? (
                                       isPlaying ? (
                                          <PauseIcon />
                                       ) : (
                                          <PlayIcon />
                                       )
                                    ) : (
                                       <PlayIcon />
                                    )}
                                 </button>
                              </div>
                           ) : null}
                        </div>
                        <span className="w-[150px] text-white text-sm overflow-hidden whitespace-nowrap">
                           {title.length > 20
                              ? `${title.slice(0, 20)}...`
                              : title}
                        </span>
                        <span className="w-[150px] text-gray-600 text-sm overflow-hidden whitespace-nowrap">
                           {artist.length > 20
                              ? `${artist.slice(0, 20)}...`
                              : artist}
                        </span>
                        <div className="w-[50px] flex items-center space-x-4">
                           {/* {hoveredItemId === id ? (
                              <>
                                 <button
                                    onClick={() => toggleLike(id)}
                                    // className={`text-white `}
                                    className={`text-white ${
                                       isSongLiked(id) ? 'text-red-600' : ''
                                    }`}
                                 >
                                    <ThumbsUp />
                                 </button>
                                 <button
                                    className="text-white"
                                    onClick={handleDislikes}
                                 >
                                    <ThumbsDown />
                                 </button>
                              </>
                           ) : (
                              <>
                                 <button className="text-red-600">
                                    {isSongLiked(id) === true && <ThumbsUp />}
                                 </button>
                              </>
                           )} */}

                           {hoveredItemId === id ? (
                              <>
                                 <button
                                    onClick={() => handleToggleLike(id)}
                                    className={`${
                                       likedSongs[id]
                                          ? 'text-likeColor'
                                          : 'text-white'
                                    }`}
                                 >
                                    <ThumbsUp />
                                 </button>
                                 <button
                                    className="text-white"
                                    onClick={() => handleToggleDislike(id)}
                                 >
                                    <ThumbsDown />
                                 </button>
                              </>
                           ) : (
                              <>
                                 <button className="text-likeColor">
                                    {likedSongs[id] === true && <ThumbsUp />}
                                 </button>
                              </>
                           )}
                        </div>
                        <span className="text-gray-600">
                           {songDurations[id]
                              ? formatTime(songDurations[id])
                              : '0'}
                        </span>
                     </div>
                  )
               )}
            </div>
         </div>

         {isPlaying || activeSongId ? <AudioControl /> : null}
      </>
   );
};

export default Download;
