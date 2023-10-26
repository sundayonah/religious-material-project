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
} from '@/reduxToolkit/slices/audioSlice';

const Download = () => {
   const { handlePlayClick, audioRefs, handleSongEnd } =
      useContext(StateContext);
   const activeSongId = useSelector((state) => state.audio.activeSongId);
   const isPlaying = useSelector(
      (state) => state.audio.songStates[state.audio.activeSongId]
   );

   const [purchasedProducts, setPurchasedProducts] = useState([]);
   const [progressUpdateInterval, setProgressUpdateInterval] = useState(null);
   const [isLiked, setIsLiked] = useState(false);
   const [isDisliked, setIsDisliked] = useState(false);
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
   const handleLikes = () => {
      setIsLiked(true);
      setIsDisliked(false);
      console.log('likes');
      // Any other logic related to handling likes.
   };

   const handleDislikes = () => {
      setIsLiked(false);
      setIsDisliked(true);
      console.log('dislike');
      // Any other logic related to handling dislikes.
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

   if (purchasedProducts.length === 0) {
      return (
         <div className="mt-28 text-gray-500 pl-5">
            <h1>Connect your wallet to see all your products</h1>
         </div>
      );
   }

   return (
      <>
         <div className="w-[80%] m-auto mt-28">
            <div className="flex flex-col gap-3 p-2">
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
                        </span>{' '}
                        <div className="w-[50px] flex items-center space-x-4">
                           {hoveredItemId === id && (
                              <>
                                 <button
                                    onClick={handleLikes}
                                    className="text-white"
                                 >
                                    <ThumbsUp />
                                 </button>
                                 <button onClick={handleDislikes}>
                                    <ThumbsDown color="white" />
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
