import React, { useContext, useEffect, useRef, useState } from 'react';
import { useAccount } from 'wagmi';
import { StateContext } from '@/Context/ReligiousContext';
import AudioControl from '@/components/audioControl';
import { PlayIcon, PauseIcon } from '@/components/icons';
import { useSelector } from 'react-redux';

const Download = () => {
   const songStates = useSelector((state) => state.audio.songStates);
   const activeSongId = useSelector((state) => state.audio.activeSongId);
   const {
      handlePlayClick,
      // songStates,
      // activeSongId,
      audioRefs,
      handleSongEnd,
   } = useContext(StateContext);

   const [purchasedProducts, setPurchasedProducts] = useState([]);

   const { address } = useAccount();

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
                        className="flex justify-between items-center mx-1 px-3 py-3 space-x-5 rounded-md bg-gray-500"
                     >
                        <div className="text-gray-700 relative">
                           <audio
                              controls
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

                           {activeSongId === id && (
                              <div className="flex justify-center items-center p-1 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
                                 <button onClick={() => handlePlayClick(id)}>
                                    {songStates[id] ? (
                                       <PlayIcon />
                                    ) : (
                                       <PauseIcon />
                                    )}
                                 </button>
                              </div>
                           )}
                        </div>
                        <div className="">
                           <span className="text-white">{title}</span>
                           <span className="text-gray-600">{artist}</span>
                        </div>
                     </div>
                  )
               )}
            </div>
         </div>
         <AudioControl />
      </>
   );
};

export default Download;
