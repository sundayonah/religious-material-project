import React, { useContext } from 'react';
import Image from 'next/image';
import { CloseIcon } from '@/components/icons';
import { StateContext } from '@/Context/ReligiousContext';
import { LoadingSpinner } from '../utils';

const SongModal = ({
   isOpen,
   closeModal,
   song,
   individualPurchasedStatus,
   songLoadingStates,
   buyNow,
}) => {
   const {
      approvedProducts,
      Approved,
      setApprovedProducts,
      approveLoadingStates,
      fetchPrices,
      isAllowance,
   } = useContext(StateContext);

   if (!isOpen || !song) {
      return null;
   }

   // console.log({ song });

   return (
      // <div className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-30 flex justify-center items-center">
      <div
         className={`fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-30 flex justify-center items-center rounded-sm transition-transform duration-300 ${
            isOpen ? 'scale-100' : 'scale-0'
         }`}
      >
         <div className="bg-white p-4 rounded-md max-w-md md:w-full w-[85%]  shadow-generate">
            <div className="flex justify-end">
               <button
                  onClick={closeModal}
                  className="text-gray-600 hover:text-gray-800"
               >
                  <CloseIcon />
               </button>
            </div>
            <div className="flex flex-col items-center justify-center">
               <div className="relative">
                  <Image
                     src={`https://gateway.pinata.cloud/ipfs/${song.image}`}
                     alt={song.title}
                     width={400}
                     height={300}
                     className="rounded-md mb-4"
                  />
                  <span className="absolute right-0 bottom-4 font-bold bg-black bg-opacity-70 rounded-md p-1 text-yellow-600">
                     {/* $TKC {(song.contentPrice / 1e15).toLocaleString()} */}
                     $TKC {song.contentPrice}
                  </span>
               </div>
               <h2 className="text-xl font-bold">{song.title}</h2>
               <p className="text-gray-800">{song.author}</p>
               <p className="text-gray-600 text-sm">{song.description}</p>
               <div className="w-full flex justify-center items-center mt-3 space-x-4">
                  {/* <span className="border border-yellow-700 font-bold bg-transparent py-1 px-2 rounded-sm hover:bg-gray-300 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:ring-opacity-50 text-black">
                     $TKC {(song.contentPrice / 1e15).toLocaleString()}
                  </span> */}
                  {/* <button className="w-full text-white bg-yellow-700 py-1 px-2 rounded-sm hover:bg-yellow-800 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:ring-opacity-50">
                     Approve
                  </button> */}
                  {individualPurchasedStatus[song.counterId] ? (
                     <button
                        disabled
                        className="w-[95%] text-white ml-2 bg-gray-500 py-1 px-4 rounded-sm"
                     >
                        Purchased
                     </button>
                  ) : (
                     <>
                        {approvedProducts.includes(song.recId) ||
                        isAllowance ? (
                           <button
                              onClick={() => {
                                 // setSelectedProduct(song);
                                 buyNow(song);
                              }}
                              className="w-[95%] text-white px-4 ml-2 py-1 bg-yellow-700  rounded-sm hover:bg-yellow-800 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:ring-opacity-50"
                           >
                              {songLoadingStates[song.recId] ? (
                                 <LoadingSpinner />
                              ) : (
                                 'Buy Now'
                              )}
                           </button>
                        ) : (
                           <button
                              onClick={() => {
                                 Approved(song);
                              }}
                              className="w-[95%] text-white ml-2 bg-yellow-700 py-1 px-4 rounded-sm"
                           >
                              {approveLoadingStates[song.recId] ? (
                                 <LoadingSpinner />
                              ) : (
                                 'Approve'
                              )}
                           </button>
                        )}
                     </>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};

export default SongModal;
