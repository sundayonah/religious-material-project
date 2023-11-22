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
      fetchPrices,
      isAllowance,
   } = useContext(StateContext);

   const router = useRouter();
   const { id } = router.query; // Get the bookDetails ID from the query parameter

   const { address } = useAccount();
   const [bookLoadingStates, setBookLoadingStates] = useState(false);
   const [bookDetails, setBookDetails] = useState(null);
   const [updatedPrices, setUpdatedPrices] = useState(null);

   const [individualPurchasedStatus, setIndividualPurchasedStatus] =
      useState(false);
   const [viewBooksBasedOnCategory, setViewBooksBasedOnCategory] = useState([]);

   const RMTestnetContractAddress =
      '0xF00Ab09b8FA49dD07da19024d6D213308314Ddb8';
   const TokenAddress = '0x8dFaC13397e766f892bFA55790798A60eaB52921';

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
      const fetchBookDetails = async () => {
         try {
            const showBookDetails = await fetchBooks();
            // console.log(showBookDetails);
            const foundBook = showBookDetails.find((book) => book.recId === id);

            // Fetch prices
            const prices = await fetchPrices(showBookDetails);

            // Merge foundBook with prices
            const bookWithPrice = {
               ...foundBook,
               contentPrice: prices.find((price) => price.id === foundBook.id)
                  ?.contentPrice,
            };

            // console.log(bookWithPrice);

            setViewBooksBasedOnCategory(showBookDetails);

            setBookDetails(bookWithPrice);
         } catch (error) {
            console.error('Error fetching book details:', error);
         }
      };

      fetchBookDetails();
   }, [id, fetchPrices]);

   const [selectedItem, setSelectedItem] = useState(null);
   const [filteredCategories, setFilteredCategories] = useState([]);

   useEffect(() => {
      // if (id && viewBooksBasedOnCategory) {
      //    const foundItem = viewBooksBasedOnCategory.find((item) => item.id === parseInt(id));
      //    setSelectedItem(foundItem);

      // Filter categories based on the selected item's category
      if (bookDetails) {
         const filtered = viewBooksBasedOnCategory.filter(
            (item) => item.category === bookDetails.category
         );

         setFilteredCategories(filtered);
      }
      // }
   }, [id, viewBooksBasedOnCategory, bookDetails]);

   // useEffect(() => {
   //    const fetchData = async () => {
   //       const bookDetails = await fetchBooks();
   //       const foundBook = bookDetails.find((book) => book.recId === id);

   //       setBookDetails(foundBook);
   //       console.log(foundBook);
   //    };

   //    fetchData();
   // }, [id]);

   useEffect(() => {
      const checkPurchasedStatus = async () => {
         try {
            const response = await axios.get(
               `http://hokoshokos-001-site1.etempurl.com/api/Catalog/GetTransactions/${address}`
            );

            // console.log(bookDetails.counterId);

            const purchasedProducts = await response.data.data;
            // console.log(purchasedProducts);
            const purchasedMap = {};

            // bookDetails.forEach((book) => {
            const isPurchased = await purchasedProducts.some(
               (product) => product.counterId === bookDetails.counterId
            );

            // console.log(isPurchased);
            purchasedMap[bookDetails.counterId] = isPurchased;
            // });

            // console.log(purchasedMap);

            setIndividualPurchasedStatus(purchasedMap);
         } catch (error) {
            console.error('Error checking purchase status:', error);
         }
      };

      checkPurchasedStatus();
   }, [address, bookDetails]);

   // Filter books based on category
   const relatedBooksByCategory = viewBooksBasedOnCategory.filter(
      (book) => book.category === bookDetails.category && book.recId !== id
   );

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
               // console.log(receipt);

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

   // console.log(bookDetails);

   // Render the product details
   return (
      <div className="mt-16">
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
         <div className="md:flex w-[70%] flex-row m-auto pt-8 justify-around items-center gap-4">
            {bookDetails ? (
               <>
                  <Image
                     src={`https://gateway.pinata.cloud/ipfs/${bookDetails.image}`}
                     className="m-auto object-cover rounded-md"
                     width={300}
                     height={200}
                     alt="single image"
                  />

                  <div className="m-4">
                     <h2 className="text-white text-2xl">
                        {bookDetails.title}
                     </h2>
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
                        {individualPurchasedStatus[bookDetails.counterId] ? (
                           <button
                              disabled
                              className="text-white mt-1 bg-gray-500 py-1 px-2 rounded-sm"
                           >
                              Purchased
                           </button>
                        ) : (
                           <>
                              {approvedProducts.includes(bookDetails.recId) ||
                              isAllowance ? (
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
         {/* DISPLAY BOOKS BASED ON CATEGORY */}
         <div className="mt-20 w-[90%] m-auto">
            <div>
               <h2 className="text-[#DAA851]  my-8">
                  Related items Based On Category
               </h2>
               {/* <div className="md:flex w-[85%] flex-row m-auto pt-16 justify-around items-center gap-4"> */}
               <div className="flex flex-wrap gap-3 p-2 justify-center md:justify-start items-center">
                  {filteredCategories.map((relatedBook) => (
                     <div
                        key={relatedBook.recId}
                        // className="flex transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 "
                        // className="transition transform hover:-translate-y-1 duration-300  motion-reduce:transition-none motion-reduce:transform-none shadow-newCustom py-1 px-2 rounded-lg "

                        className="transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 shadow-newCustom rounded-lg py-1 px-2"
                     >
                        <Link href={`/single?id=${relatedBook.recId}`} passHref>
                           <img
                              src={`https://gateway.pinata.cloud/ipfs/${relatedBook.image}`}
                              className="object-cover w-auto h-24 rounded-md"
                              // width={150}
                              // height={150}
                              alt={relatedBook.title}
                           />
                           <div className="flex flex-col">
                              <span className="text-gray-500">
                                 {relatedBook.author}
                              </span>
                              <span className="text-white">
                                 {relatedBook.title}
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

export default Single;

// import { useRouter } from 'next/router';
// import Link from 'next/link';
// import { useEffect, useMemo, useState } from 'react';
// // Assuming dummyItems array is already defined here...

// const SinglePage = () => {
//    const router = useRouter();
//    const { id } = router.query;

//    const dummyItems = useMemo(() => {
//       return [
//          {
//             id: 1,
//             title: 'Book 1',
//             image: 'https://via.placeholder.com/150',
//             category: 'Healing',
//          },
//          {
//             id: 2,
//             title: 'Book 2',
//             image: 'https://via.placeholder.com/150',
//             category: 'Fiction',
//          },
//          {
//             id: 3,
//             title: 'Book 3',
//             image: 'https://via.placeholder.com/150',
//             category: 'Fantasy',
//          },
//          {
//             id: 4,
//             title: 'Book 4',
//             image: 'https://via.placeholder.com/150',
//             category: 'Healing',
//          },
//          {
//             id: 5,
//             title: 'Book 5',
//             image: 'https://via.placeholder.com/150',
//             category: 'Fiction',
//          },
//          {
//             id: 6,
//             title: 'Book 6',
//             image: 'https://via.placeholder.com/150',
//             category: 'Fantasy',
//          },
//          {
//             id: 7,
//             title: 'Book 7',
//             image: 'https://via.placeholder.com/150',
//             category: 'Healing',
//          },
//          {
//             id: 8,
//             title: 'Book 8',
//             image: 'https://via.placeholder.com/150',
//             category: 'Fiction',
//          },
//          {
//             id: 9,
//             title: 'Book 9',
//             image: 'https://via.placeholder.com/150',
//             category: 'Fantasy',
//          },
//          {
//             id: 10,
//             title: 'Book 10',
//             image: 'https://via.placeholder.com/150',
//             category: 'Healing',
//          },
//          {
//             id: 11,
//             title: 'Book 11',
//             image: 'https://via.placeholder.com/150',
//             category: 'Fiction',
//          },
//          {
//             id: 12,
//             title: 'Book 12',
//             image: 'https://via.placeholder.com/150',
//             category: 'Fantasy',
//          },
//       ];
//    }, []);

//    const [selectedItem, setSelectedItem] = useState(null);
//    const [filteredCategories, setFilteredCategories] = useState([]);

//    useEffect(() => {
//       if (id && dummyItems) {
//          const foundItem = dummyItems.find((item) => item.id === parseInt(id));
//          setSelectedItem(foundItem);

//          // Filter categories based on the selected item's category
//          if (foundItem) {
//             const filtered = dummyItems.filter(
//                (item) => item.category === foundItem.category
//             );
//             setFilteredCategories(filtered);
//          }
//       }
//    }, [id, dummyItems]);

//    if (!selectedItem) {
//       return <p>Loading...</p>; // Handle loading state if needed
//    }
//    return (
//       <div className="container mx-auto mt-28">
//          <div className="grid grid-cols-2 gap-4">
//             <div className="col-span-1">
//                <img
//                   src={selectedItem.image}
//                   alt={selectedItem.title}
//                   className="rounded-md"
//                />
//                <h2 className="text-2xl font-bold mt-4">{selectedItem.title}</h2>
//                <p className="text-gray-600">{selectedItem.category}</p>
//             </div>
//             <div className="col-span-1">
//                <h3 className="text-xl font-bold mb-4">Categories</h3>
//                <div className="flex flex-wrap">
//                   {filteredCategories.map((item) => (
//                      <Link
//                         key={item.id}
//                         href={`/single?id=${item.id}`}
//                         passHref
//                      >
//                         <span className="mr-4 mb-2 text-blue-500 hover:text-blue-700">
//                            {item.category}
//                         </span>
//                      </Link>
//                   ))}
//                </div>
//             </div>
//          </div>
//       </div>
//    );
// };

// export default SinglePage;
