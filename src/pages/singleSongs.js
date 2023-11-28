// pages / products / [id].js;

import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Products from './api/[id]'; // Import your songDetails data
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import RMabi from '@/Contract/rm-abi.json';
import toast, { Toaster } from 'react-hot-toast';
import {
   fetchBooks,
   fetchSongs,
   useFetchMessages,
} from '@/components/fetchProducts';
import { StateContext } from '@/Context/ReligiousContext';
import {
   LoadingSpinner,
   ProductLenghtLoadingSpinner,
} from '@/components/utils';
import Image from 'next/image';
import axios from 'axios';
import CommentsSection from '@/components/commentsSection';

const SingleSong = ({ kingdomBooksWithPrice }) => {
   const {
      approvedProducts,
      Approved,
      setApprovedProducts,
      approveLoadingStates,
      fetchSongPrices,
      isAllowance,
      fetchPrices,
   } = useContext(StateContext);

   const router = useRouter();
   const { id } = router.query; // Get the songDetails ID from the query parameter

   const { address } = useAccount();
   const [songLoadingStates, setSongLoadingStates] = useState(false);
   const [songDetails, setSongDetails] = useState(null);
   const [addPricesToCategories, setAddPricesToCategories] = useState([]);

   const [individualPurchasedStatus, setIndividualPurchasedStatus] =
      useState(false);
   const [viewSongsBasedOnCategory, setViewSongsBasedOnCategory] = useState([]);

   const RMTestnetContractAddress =
      '0xF00Ab09b8FA49dD07da19024d6D213308314Ddb8';
   const TokenAddress = '0x8dFaC13397e766f892bFA55790798A60eaB52921';

   useEffect(() => {
      const fetchSongDetails = async () => {
         try {
            const showSongDetails = await fetchSongs();
            // console.log(showSongDetails);
            const foundSong = showSongDetails.find((song) => song.recId === id);
            // console.log(foundSong);

            // Fetch prices
            const prices = await fetchPrices(showSongDetails);

            // Merge foundSong with prices
            const songWithPrice = {
               ...foundSong,
               contentPrice: prices.find((price) => price.id === foundSong.id)
                  ?.contentPrice,
            };

            setAddPricesToCategories(prices);

            setViewSongsBasedOnCategory(showSongDetails);

            setSongDetails(songWithPrice);
         } catch (error) {
            console.error('Error fetching song details:', error);
         }
      };

      fetchSongDetails();
   }, [id, fetchPrices]);

   const [selectedItem, setSelectedItem] = useState(null);
   const [filteredCategories, setFilteredCategories] = useState([]);

   useEffect(() => {
      // Filter categories based on the selected item's category
      if (songDetails) {
         const filtered = viewSongsBasedOnCategory
            .filter((item) => item.category === songDetails.category)
            .map((filteredItem) => {
               const priceItem = addPricesToCategories.find(
                  (price) => price.id === filteredItem.id
               );
               return {
                  ...filteredItem,
                  contentPrice: priceItem ? priceItem.contentPrice : null,
               };
            });

         setFilteredCategories(filtered);
      }
   }, [id, viewSongsBasedOnCategory, songDetails, addPricesToCategories]);

   // useEffect(() => {
   //    const fetchData = async () => {
   //       const songDetails = await fetchBooks();
   //       const foundSong = songDetails.find((song) => song.recId === id);

   //       setSongDetails(foundSong);
   //       console.log(foundSong);
   //    };

   //    fetchData();
   // }, [id]);

   useEffect(() => {
      const checkPurchasedStatus = async () => {
         try {
            const response = await axios.get(
               `https://hokoshokos-001-site1.etempurl.com/api/Catalog/GetTransactions/${address}`
            );

            // console.log(songDetails.counterId);

            const purchasedProducts = await response.data.data;
            // console.log(purchasedProducts);
            const purchasedMap = {};

            // songDetails.forEach((song) => {
            const isPurchased = await purchasedProducts.some(
               (product) => product.counterId === songDetails.counterId
            );

            // console.log(isPurchased);
            purchasedMap[songDetails.counterId] = isPurchased;
            // });

            // console.log(purchasedMap);

            setIndividualPurchasedStatus(purchasedMap);
         } catch (error) {
            console.error('Error checking purchase status:', error);
         }
      };

      checkPurchasedStatus();
   }, [address, songDetails]);

   // Filter books based on category
   // const relatedBooksByCategory = viewSongsBasedOnCategory.filter(
   //    (song) => song.category === songDetails.category && song.recId !== id
   // );

   // console.log(relatedBooksByCategory);

   const buyNow = async (product) => {
      try {
         if (product) {
            if (window.ethereum) {
               const provider = new ethers.providers.Web3Provider(
                  window.ethereum
               );
               const signer = provider.getSigner();

               if (address === undefined) {
                  toast.success(`Please Connect Your Wallet.`, {
                     duration: 4000,
                     position: 'top-right',
                     icon: '❌',
                     style: {
                        background: '#fff',
                        border: '1px solid #a16206',
                     },
                  });
                  return;
               }

               setSongLoadingStates((prevStates) => ({
                  ...prevStates,
                  [product.id]: true,
               }));
               const contract = new ethers.Contract(
                  RMTestnetContractAddress,
                  RMabi,
                  signer
               );

               // Make the purchase through the smart contract
               const contentId = product.counterId;
               const token = TokenAddress;

               let tx;
               tx = await contract.purchase(contentId, token, {
                  gasLimit: 400000, // Adjust the gas limit as needed
                  gasPrice: ethers.utils.parseUnits('10.0', 'gwei'), // Adjust the gas price as needed
               });

               const receipt = await tx.wait();
               // console.log(receipt);

               if (receipt.status === 1) {
                  // Update the approvedProducts state
                  setApprovedProducts((prevProducts) => [
                     ...prevProducts,
                     product.recId,
                  ]);
                  // Create a product details object
                  const purchasedMessage = {
                     id: product.recId,
                     author: product.recId,
                     title: product.title,
                     image: product.image,
                     category: product.category,
                     bookFile: product.bookFile,
                     address: address, // Store the user's address with the purchased song
                  };

                  // console.log(purchasedMessage);

                  // // Serialize the purchased product before storing it
                  // const serializedProduct = JSON.stringify(purchasedMessage);

                  // // Add the purchased product to localStorage
                  // const storedPurchasedBooks =
                  //    JSON.parse(localStorage.getItem('purchasedBooks')) || [];
                  // storedPurchasedBooks.push(serializedProduct);
                  // localStorage.setItem(
                  //    'purchasedBooks',
                  //    JSON.stringify(storedPurchasedBooks)
                  // );

                  const purchasedMessageTitle = purchasedMessage.title;

                  // Display a success toast notification
                  toast.success(
                     `${purchasedMessageTitle}, Purchase successful`,
                     {
                        duration: 4000,
                        position: 'bottom-right',
                        icon: '✅',
                     }
                  );

                  // Call the API to add the transaction
                  const transactionData = {
                     hash: product.hash,
                     address: address,
                     counterId: product.counterId,
                     type: product.type,
                     transactionHash: receipt.transactionHash,
                  };

                  // console.log(transactionData);

                  // Make a POST request to the API endpoint
                  const addTransactionResponse = await axios.post(
                     'https://hokoshokos-001-site1.etempurl.com/api/Catalog/AddTransactions',
                     transactionData
                  );

                  // Check the response from the API
                  if (addTransactionResponse.status === 200) {
                  } else {
                     console.error(
                        'Failed to add transaction:',
                        addTransactionResponse.statusText
                     );
                  }

                  setSongLoadingStates((prevStates) => ({
                     ...prevStates,
                     [product.id]: false,
                  }));
               } else {
                  console.error('Transaction Not Successful');
               }
               console.log('done');
            } else {
               console.error('User is not connected to a Web3 provider.');
            }
            // Perform any other actions here if needed
         } else {
            console.error('Product not found in Book Details.');
         }
      } catch (err) {
         console.error('Purchase failed:', err.song);
         setSongLoadingStates((prevStates) => ({
            ...prevStates,
            [product.id]: false,
         }));
      }
      setSongLoadingStates((prevStates) => ({
         ...prevStates,
         [product.id]: false,
      }));
   };

   if (!songDetails) {
      return (
         <div className="mt-28">
            <ProductLenghtLoadingSpinner />
         </div>
      );
   }

   // console.log(filteredCategories);

   // Render the product details
   return (
      <div className="mt-16">
         <Toaster />

         <div className=" w-[5%] ml-8">
            <Link href="/songs">
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="text-[#DAA851]  w-12 h-10"
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                  />
               </svg>
            </Link>
         </div>
         <div className="md:flex w-[85%] flex-row m-auto pt-8 justify-around gap-4">
            {songDetails ? (
               <>
                  <div className=" relative w-full h-full">
                     <Image
                        src={`https://gateway.pinata.cloud/ipfs/${songDetails.image}`}
                        alt="single image"
                        width={200}
                        height={150}
                        className="h-72 w-[100%] md:w-full rounded-md object-center"
                     />
                     <span className="absolute right-0 bottom-0 bg-black bg-opacity-70 rounded-md p-1 text-yellow-600">
                        TKC${' '}
                        {(songDetails.contentPrice / 1e15).toLocaleString()}
                     </span>
                     {/* </div> */}
                  </div>

                  <div className="w-full">
                     <h2 className="text-white text-2xl">
                        {songDetails.title}
                     </h2>
                     <h4 className="text-gray-500">{songDetails.category}</h4>
                     <p className="text-white text-sm">
                        {songDetails.description}
                     </p>

                     <div className="w-full flex justify-between items-center space-x-4 ">
                        <div className="w-full">
                           {individualPurchasedStatus[songDetails.counterId] ? (
                              <button
                                 disabled
                                 className="w-full text-white mt-1 bg-gray-500 py-1 px-2 rounded-sm cursor-not-allowed"
                              >
                                 Purchased
                              </button>
                           ) : (
                              <>
                                 {approvedProducts.includes(
                                    songDetails.recId
                                 ) || isAllowance ? (
                                    <button
                                       onClick={() => {
                                          buyNow(songDetails);
                                       }}
                                       className="w-full text-white mt-1 bg-yellow-700 py-1 px-2 rounded-sm hover:bg-yellow-800 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:ring-opacity-50"
                                    >
                                       {songLoadingStates[songDetails.recId] ? (
                                          <LoadingSpinner />
                                       ) : (
                                          'Buy Now'
                                       )}
                                    </button>
                                 ) : (
                                    <button
                                       onClick={() => {
                                          Approved(songDetails);
                                       }}
                                       className="w-full  text-white mt-1 bg-yellow-700 py-1 px-2 rounded-sm hover:bg-yellow-800 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:ring-opacity-50"
                                    >
                                       {approveLoadingStates[
                                          songDetails.recId
                                       ] ? (
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
                  <div className="w-full">
                     {/* <CommentsSection /> */}
                     <CommentsSection
                        recId={songDetails.recId}
                        type={songDetails.type}
                     />
                  </div>
               </>
            ) : (
               <p>Product not found</p>
            )}
         </div>
         {/* DISPLAY BOOKS BASED ON CATEGORY */}
         <div className="mt-20 mb-8 w-[90%] m-auto">
            <div>
               <h2 className="text-[#DAA851]  my-8">
                  Related items Based On Category
               </h2>

               {/* <div className="md:flex w-[85%] flex-row m-auto pt-16 justify-around items-center gap-4"> */}
               <div className="flex flex-wrap gap-3 p-2 justify-center md:justify-start items-center">
                  {filteredCategories.map((relatedSong) => (
                     <div
                        key={relatedSong.recId}
                        // className="flex transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 "
                        // className="transition transform hover:-translate-y-1 duration-300  motion-reduce:transition-none motion-reduce:transform-none shadow-newCustom py-1 px-2 rounded-lg "

                        className="transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 shadow-newCustom rounded-lg py-2 px-2"
                     >
                        <Link
                           href={`/singleSongs?id=${relatedSong.recId}`}
                           passHref
                        >
                           <Image
                              src={`https://gateway.pinata.cloud/ipfs/${relatedSong.image}`}
                              className="object-cover w-auto h-24 rounded-md"
                              width={200}
                              height={150}
                              alt={relatedSong.title}
                           />
                           <div className="flex flex-col">
                              <span className="text-gray-500">
                                 {relatedSong.author}
                              </span>
                              <span className="text-white">
                                 {relatedSong.title}
                              </span>
                           </div>
                           <div className=" flex justify-center text-white mt-1   bg-yellow-700 py-1 px-2 rounded-sm hover:bg-yellow-800 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:ring-opacity-50">
                              <span className="text-sm">
                                 TKC${' '}
                                 {(
                                    relatedSong.contentPrice / 1e15
                                 ).toLocaleString()}
                              </span>
                           </div>
                        </Link>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
};

export default SingleSong;
