import React, { useContext, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { StateContext } from '@/Context/ReligiousContext';
import AudioControl from '@/components/audioControl';
import { PlayIcon, PauseIcon } from '@/components/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
   setActiveSong,
   setCurrentTime,
   setDuration,
   setProgressBarWidth,
   togglePlayback,
} from '@/reduxToolkit/slices/audioSlice';

const Download = () => {
   const { handlePlayClick, audioRefs, handleSongEnd } =
      useContext(StateContext);
   const activeSongId = useSelector((state) => state.audio.activeSongId);
   const isPlaying = useSelector(
      (state) => state.audio.songStates[state.audio.activeSongId]
   );
   const repeat = useSelector((state) => state.audio.repeat);

   const [purchasedProducts, setPurchasedProducts] = useState([]);
   const [progressUpdateInterval, setProgressUpdateInterval] = useState(null);

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
      console.log(userPurchasedProducts.length);
      setPurchasedProducts(userPurchasedProducts);
   }, [address]);

   // State to track the hover state of items
   const [hoveredItemId, setHoveredItemId] = useState(null);

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
            <div className="flex flex-wrap gap-3 p-2 justify-center items-center">
               {purchasedProducts.map(
                  ({ id, file, imageUrl, title, artist }) => (
                     <div
                        key={id}
                        className="flex justify-between items-center mx-1 px-7 py-3 space-x-5 rounded-md bg-white"
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
                              width={80}
                              height={80}
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
                        <div className="flex justify-between items-center">
                           <span className="text-black text-sm">{title}</span>
                           <span className="border bg-[#DAA851] rounded-lg p-1 mx-2"></span>
                           <span className="text-gray-600">{artist}</span>
                        </div>
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
