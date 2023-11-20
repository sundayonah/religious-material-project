// pages / products / [id].js;

import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Products from './api/[id]'; // Import your bookDetails data
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import RMabi from '@/Contract/rm-abi.json';
import toast, { Toaster } from 'react-hot-toast';
import { fetchBooks } from '@/components/fetchProducts';
import { StateContext } from '@/Context/ReligiousContext';
import {
   LoadingSpinner,
   ProductLenghtLoadingSpinner,
} from '@/components/utils';
import Image from 'next/image';
import axios from 'axios';

const Single = ({ kingdomBooksWithPrice }) => {
   const {
      approvedProducts,
      Approved,
      setApprovedProducts,
      approveLoadingStates,
   } = useContext(StateContext);

   const router = useRouter();
   const { id } = router.query; // Get the bookDetails ID from the query parameter

   const { address } = useAccount();
   const [bookLoadingStates, setBookLoadingStates] = useState(false);
   const [bookDetails, setBookDetails] = useState(null);
   const [individualPurchasedStatus, setIndividualPurchasedStatus] =
      useState(false);

   const RMTestnetContractAddress =
      '0xF00Ab09b8FA49dD07da19024d6D213308314Ddb8';
   const TokenAddress = '0x8dFaC13397e766f892bFA55790798A60eaB52921';

   const hasPurchased = (userAddress, contentId) => {
      const purchasedProducts =
         JSON.parse(localStorage.getItem('purchasedBooks')) || [];

      return purchasedProducts.some((bookDetails) => {
         const parsedProduct = JSON.parse(bookDetails);
         return (
            parsedProduct.address === userAddress &&
            parsedProduct.id === contentId
         );
      });
   };

   // console.log(kingdomBooksWithPrice);

   // useEffect(() => {
   // const fetchData = async () => {
   //    const response = await axios.get(
   //       `http://hokoshokos-001-site1.etempurl.com/api/Catalog/GetTransactions/${address}`
   //    );
   //    try {
   //       const bookDetails = await fetchBooks();
   //       const foundBook = bookDetails.find((book) => book.recId === id);

   //       const counterId = foundBook.counterId;

   //       const purchasedProducts = response.data.data;

   //       let purch = purchasedProducts.find((product) => product.counterId);

   //       let purchasedId = purch.counterId;

   //       let checkPurchased = purchasedId === counterId;
   //       console.log(checkPurchased);

   //       setBookDetails(foundBook);
   //       setIndividualPurchasedStatus(checkPurchased);
   //    } catch (error) {
   //       console.error('Error checking purchase status:', error);
   //    }
   // };
   // fetchData();

   useEffect(() => {
      const fetchData = async () => {
         const bookDetails = await fetchBooks();
         const foundBook = bookDetails.find((book) => book.recId === id);

         setBookDetails(foundBook);
         console.log(foundBook);
      };

      fetchData();
   }, [id]);

   // useEffect(() => {
   //    const checkPurchasedStatus = async () => {
   //       // const { counterId } = bookDetails;

   //       try {
   //          const response = await axios.get(
   //             `http://hokoshokos-001-site1.etempurl.com/api/Catalog/GetTransactions/${address}`
   //          );

   //          const purchasedProducts = response.data.data;
   //          console.log(purchasedProducts);

   //          let purch = purchasedProducts.find((product) => product.counterId);

   //          let purchasedId = purch.counterId;
   //          console.log(purchasedId);

   //          console.log(counterId);

   //          let checkPurchased = purchasedId === counterId;

   //          console.log(checkPurchased);

   //          // setIndividualPurchasedStatus(purchasedMap);
   //       } catch (error) {
   //          console.error('Error checking purchase status:', error);
   //       }
   //    };

   //    checkPurchasedStatus();
   // }, [address, bookDetails]);

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

               setBookLoadingStates((prevStates) => ({
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
               console.log(receipt);

               if (receipt.status === 1) {
                  // Update the approvedProducts state
                  setApprovedProducts((prevProducts) => [
                     ...prevProducts,
                     product.recId,
                  ]);
                  // Create a product details object
                  const purchasedBook = {
                     id: product.recId,
                     author: product.recId,
                     title: product.title,
                     image: product.image,
                     category: product.category,
                     bookFile: product.bookFile,
                     address: address, // Store the user's address with the purchased book
                  };

                  // console.log(purchasedBook);

                  // // Serialize the purchased product before storing it
                  // const serializedProduct = JSON.stringify(purchasedBook);

                  // // Add the purchased product to localStorage
                  // const storedPurchasedBooks =
                  //    JSON.parse(localStorage.getItem('purchasedBooks')) || [];
                  // storedPurchasedBooks.push(serializedProduct);
                  // localStorage.setItem(
                  //    'purchasedBooks',
                  //    JSON.stringify(storedPurchasedBooks)
                  // );

                  const purchasedBookTitle = purchasedBook.title;

                  // Display a success toast notification
                  toast.success(`${purchasedBookTitle}, Purchase successful`, {
                     duration: 4000,
                     position: 'bottom-right',
                     icon: '✅',
                  });

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
                     'http://hokoshokos-001-site1.etempurl.com/api/Catalog/AddTransactions',
                     transactionData
                  );

                  // Check the response from the API
                  if (addTransactionResponse.status === 200) {
                     console.log(
                        'Transaction added successfully:',
                        addTransactionResponse.data
                     );
                  } else {
                     console.error(
                        'Failed to add transaction:',
                        addTransactionResponse.statusText
                     );
                  }

                  setBookLoadingStates((prevStates) => ({
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
         console.error('Purchase failed:', err.message);
         setBookLoadingStates((prevStates) => ({
            ...prevStates,
            [product.id]: false,
         }));
      }
      setBookLoadingStates((prevStates) => ({
         ...prevStates,
         [product.id]: false,
      }));
   };

   if (!bookDetails) {
      return (
         <div className="mt-28">
            <ProductLenghtLoadingSpinner />
         </div>
      );
   }

   // Render the product details
   return (
      <div className="mt-20">
         <Toaster />

         <Link href="/books">
            <svg
               xmlns="http://www.w3.org/2000/svg"
               fill="none"
               viewBox="0 0 24 24"
               strokeWidth={1.5}
               stroke="currentColor"
               className="text-[#DAA851] ml-8 w-12 h-12"
            >
               <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
               />
            </svg>
         </Link>
         <div className="md:flex w-[70%] flex-row m-auto pt-16 justify-around items-center gap-4">
            {bookDetails ? (
               <>
                  <Image
                     src={`https://gateway.pinata.cloud/ipfs/${bookDetails.image}`}
                     className="m-auto object-cover rounded-md"
                     width={300}
                     height={200}
                     alt="single image"
                  />

                  {/* <img class="h-48 w-full object-cover md:h-full md:w-48" src="/img/store.jpg" alt="Man looking at item at a store" /> */}

                  <div className="m-4">
                     <h4 className="text-white">{bookDetails.title}</h4>
                     <h4 className="text-gray-500">{bookDetails.category}</h4>
                     <p className="text-white">{bookDetails.description}</p>

                     <div className="flex flex-col">
                        {/* <span className="text-gray-500 pb-3 ">
                           TKC$ {bookDetails.price}
                        </span> */}
                        {/* <button
                           onClick={() => buyNow(bookDetails, address)}
                           className="w-full text-white mt-1 bg-yellow-700 py-1 px-2 rounded-sm hover:bg-yellow-800 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:ring-opacity-50"
                        >
                           Buy Now
                        </button> */}
                        {hasPurchased(address, bookDetails.recId) ? (
                           <button
                              disabled
                              className="text-white mt-1 bg-gray-500 py-1 px-2 rounded-sm"
                           >
                              Purchased
                           </button>
                        ) : (
                           <>
                              {approvedProducts.includes(bookDetails.recId) ? (
                                 <button
                                    onClick={() => {
                                       buyNow(bookDetails);
                                    }}
                                    className="text-white mt-1 bg-yellow-700 py-1 px-2 rounded-sm hover:bg-yellow-800 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:ring-opacity-50"
                                 >
                                    {bookLoadingStates[bookDetails.recId] ? (
                                       <LoadingSpinner />
                                    ) : (
                                       'Buy Now'
                                    )}
                                 </button>
                              ) : (
                                 <button
                                    onClick={() => {
                                       Approved(bookDetails);
                                    }}
                                    className="text-white mt-1 bg-yellow-700 py-1 px-2 rounded-sm hover:bg-yellow-800 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:ring-opacity-50"
                                 >
                                    {approveLoadingStates[bookDetails.recId] ? (
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
               </>
            ) : (
               <p>Product not found</p>
            )}
         </div>
      </div>
   );
};

export default Single;
