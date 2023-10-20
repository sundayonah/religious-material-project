import React, { useContext, useEffect, useRef, useState } from 'react';
import { useAccount } from 'wagmi';
import { StateContext } from '@/Context/ReligiousContext';

const Download = () => {
   const { handlePlayClick, songStates, activeSongId, audioRefs } =
      useContext(StateContext);

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
                                    {!songStates[id] ? (
                                       <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 24 24"
                                          fill="currentColor"
                                          className="w-6 h-6"
                                       >
                                          <path
                                             fillRule="evenodd"
                                             d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                                             clipRule="evenodd"
                                          />
                                       </svg>
                                    ) : (
                                       <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 24 24"
                                          fill="currentColor"
                                          className="w-6 h-6"
                                       >
                                          <path
                                             fillRule="evenodd"
                                             d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
                                             clipRule="evenodd"
                                          />
                                       </svg>
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
      </>
   );
};

export default Download;
