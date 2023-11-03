// pages / products / [id].js;

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Products from './api/[id]'; // Import your product data
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import RMabi from '@/Contract/rm-abi.json';
import toast, { Toaster } from 'react-hot-toast';

const Single = () => {
   const router = useRouter();
   const { id } = router.query; // Get the product ID from the query parameter
   const { address } = useAccount();
   const [bookLoadingStates, setBookLoadingStates] = useState(false);

   const RMTestnetContractAddress =
      '0xF00Ab09b8FA49dD07da19024d6D213308314Ddb8';
   const TokenAddress = '0x8dFaC13397e766f892bFA55790798A60eaB52921';

   const hasPurchased = (userAddress, contentId) => {
      const purchasedProducts =
         JSON.parse(localStorage.getItem('purchasedBooks')) || [];

      return purchasedProducts.some((product) => {
         const parsedProduct = JSON.parse(product);
         return (
            parsedProduct.address === userAddress &&
            parsedProduct.id === contentId
         );
      });
   };

   // Find the product with the matching ID
   const product = Products.find((product) => product.id === id);

   // const buyNows = (product, userAddress) => {
   //    if (product && userAddress) {
   //       // Find the index of the product in songDetails using its id
   //       const productIndex = messagesDetails.findIndex(
   //          (message) => message.id === product.id
   //       );

   //       if (productIndex !== -1) {
   //          // Retrieve the corresponding image URL based on the product's index
   //          const imageUrl = imageUrls[productIndex];

   //          // Store the purchased product with the imageUrl and user address
   //          const purchasedProduct = {
   //             ...product,
   //             imageUrl,
   //             address: userAddress, // Include the user's address
   //          };

   //          // Serialize the purchased product before storing it
   //          const serializedProduct = JSON.stringify(purchasedProduct);

   //          // Retrieve the existing purchased products or initialize an empty array
   //          const purchasedMessages =
   //             JSON.parse(localStorage.getItem('purchasedMessages')) || [];

   //          // Add the purchased product to the array
   //          purchasedMessages.push(serializedProduct);
   //          localStorage.setItem(
   //             'purchasedMessages',
   //             JSON.stringify(purchasedMessages)
   //          );
   //       } else {
   //          console.error('Product not found in songDetails.');
   //       }
   //    }
   // };

   // const notify = () =>
   //    toast('Hello World', {
   //       duration: 4000,
   //       position: 'top-center',

   //       // Styling
   //       style: {},
   //       className: '',

   //       // Custom Icon
   //       icon: '👏',

   //       // Change colors of success/error/loading icon
   //       iconTheme: {
   //          primary: '#000',
   //          secondary: '#fff',
   //       },

   //       // Aria
   //       ariaProps: {
   //          role: 'status',
   //          'aria-live': 'polite',
   //       },
   //    });

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
               const contentId = parseInt(product.id);
               const token = TokenAddress;

               let tx;
               tx = await contract.purchase(contentId, token, {
                  // value: valueInWei, // Send the price as value in Wei
                  gasLimit: 200000, // Adjust the gas limit as needed
                  gasPrice: ethers.utils.parseUnits('10.0', 'gwei'), // Adjust the gas price as needed
               });

               const receipt = await tx.wait();

               if (receipt.status === 1) {
                  // Create a product details object
                  const purchasedBook = {
                     id: product.id,
                     title: product.title,
                     image: product.image,
                     file: product.file,
                     address: address, // Store the user's address with the purchased book
                  };

                  // Serialize the purchased product before storing it
                  const serializedProduct = JSON.stringify(purchasedBook);

                  // Add the purchased product to localStorage
                  const storedPurchasedBooks =
                     JSON.parse(localStorage.getItem('purchasedBooks')) || [];
                  storedPurchasedBooks.push(serializedProduct);
                  localStorage.setItem(
                     'purchasedBooks',
                     JSON.stringify(storedPurchasedBooks)
                  );

                  const purchasedBookTitle = purchasedBook.title;

                  // Display a success toast notification
                  toast.success(`${purchasedBookTitle}, Purchase successful`, {
                     duration: 4000,
                     position: 'bottom-right',
                     icon: '✅',
                  });

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
         console.error('Purchase failed:', err);
      }
      setBookLoadingStates((prevStates) => ({
         ...prevStates,
         [product.id]: false,
      }));
   };

   if (!product) {
      return (
         <>
            <div class="flex justify-center mt-72 shadow rounded-md p-4 max-w-sm w-full mx-auto">
               <div class="animate-spin flex space-x-4">
                  <div class="rounded-full  bg-yellow-700  h-48 w-48">
                     <div class="rounded-full bg-red-400 h-28 w-28">
                        <div class="rounded-full bg-white h-12 w-12"></div>
                     </div>
                  </div>
               </div>
            </div>
         </>
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
               className="text-white ml-8 w-12 h-12"
            >
               <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
               />
            </svg>
         </Link>
         <div className="md:flex w-[70%] flex-row m-auto pt-16 justify-around items-center gap-4">
            {product ? (
               <>
                  <img
                     className="m-auto object-cover rounded-md"
                     src={product.image}
                     width={300}
                     height={200}
                     alt="single image"
                  />

                  {/* <img class="h-48 w-full object-cover md:h-full md:w-48" src="/img/store.jpg" alt="Man looking at item at a store" /> */}

                  <div className="m-4">
                     <h4 className="text-white">{product.title}</h4>
                     <h4 className="text-gray-500">{product.category}</h4>
                     <p className="text-white">{product.description}</p>

                     <div className="flex flex-col">
                        <span className="text-gray-500 pb-3 ">
                           TKC$ {product.price}
                        </span>
                        {/* <button
                           onClick={() => buyNow(product, address)}
                           className="w-full text-white mt-1 bg-yellow-700 py-1 px-2 rounded-sm hover:bg-yellow-800 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:ring-opacity-50"
                        >
                           Buy Now
                        </button> */}
                        {hasPurchased(address, product.id) ? (
                           <button
                              disabled
                              className="text-white mt-1 bg-gray-500 py-1 px-2 rounded-sm"
                           >
                              Purchased
                           </button>
                        ) : (
                           <button
                              onClick={() => {
                                 buyNow(product, address);
                              }}
                              className="text-white mt-1 bg-yellow-700 py-1 px-2 rounded-sm hover-bg-yellow-800 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:ring-opacity-50"
                           >
                              {bookLoadingStates[product.id] ? (
                                 <div class="flex items-center justify-center  px-4 ">
                                    <div class="flex items-center justify-center  w-6 h-6">
                                       <div class="w-2 h-2 mr-1 bg-white rounded-full animate-ping delay-100"></div>
                                       <div class="w-2 h-4 mr-1 bg-white rounded-full animate-pulse delay-500"></div>
                                       <div class="w-2 h-2 mr-1 bg-white rounded-full animate-ping delay-700"></div>
                                       <div class="w-2 h-4 bg-white rounded-full animate-pulse delay-1000"></div>
                                    </div>
                                 </div>
                              ) : (
                                 'Buy Now'
                              )}
                           </button>
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
