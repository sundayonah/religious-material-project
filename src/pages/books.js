'use client';
import React, {
   useState,
   useEffect,
   useContext,
   useRef,
   useCallback,
} from 'react';
import { useRouter } from 'next/router';
// import products from './products/[id]';
// import products from '@/pages/api/[id]';
import Link from 'next/link';
import axios from 'axios';
import { CloseIcon, FilterIcon } from '@/components/icons';
import Image from 'next/image';
import { fetchBooks } from '@/components/fetchProducts';
import { ethers } from 'ethers';
import RMabi from '@/Contract/rm-abi.json';
import {
   LoadingSpinner,
   ProductLenghtLoadingSpinner,
   SearchIconWhenThereIsNoFilter,
} from '@/components/utils';
import { StateContext } from '@/Context/ReligiousContext';
import { useAccount } from 'wagmi';
const Books = () => {
   const {
      approvedProducts,
      Approved,
      setApprovedProducts,
      approveLoadingStates,
      fetchPrices,
      isAllowance,
   } = useContext(StateContext);
   const { address } = useAccount();
   const [filteredBooks, setFilteredBooks] = useState([]);
   const [searchInput, setSearchInput] = useState('');
   const [selectedCompany, setSelectedCompany] = useState('all');
   const [selectedProductId, setSelectedProductId] = useState(null);
   const [kingdomBook, setKingdomBook] = useState([]);
   const [bookModalOpen, setBookModalOpen] = useState(false);
   const [kingdomBooksWithPrice, setKingdomBooksWithPrice] = useState([]);
   const [individualPurchasedStatus, setIndividualPurchasedStatus] =
      useState(false);
   const [bookLoadingStates, setBookLoadingStates] = useState(false);
   const [selectedProduct, setSelectedProduct] = useState(null);
   const RMTestnetContractAddress =
      '0xF00Ab09b8FA49dD07da19024d6D213308314Ddb8';
   const TokenAddress = '0x8dFaC13397e766f892bFA55790798A60eaB52921';
   const sidebarRef = useRef(null);

   const openBookModal = () => {
      setBookModalOpen(true);
   };

   const closeBookModal = () => {
      setBookModalOpen(false);
   };

   // const booksContent = async () => {
   //    try {
   //       const messageURL =
   //          'http://hokoshokos-001-site1.etempurl.com/api/Catalog/GetAllBooks';
   //       const response = await axios.get(messageURL);
   //       const data = response.data.data;
   //       // console.log('Original Data:', data);
   //       const bookDetails = await Promise.all(
   //          data.map(async (message) => {
   //             try {
   //                const ipfsHash = message.hash;
   //                const pinataApiUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
   //                const pinataResponse = await axios.get(pinataApiUrl);
   //                // console.log(pinataResponse);
   //                if (pinataResponse.status === 200) {
   //                   const ipfsContent = pinataResponse.data;
   //                   const completeMessageInfo = {
   //                      recId: message.recId,
   //                      hash: message.hash,
   //                      counterId: message.counterId,
   //                      category: message.category,
   //                      bookFile: message.bookFile,
   //                      type: message.type,
   //                      ...ipfsContent,
   //                   };
   //                   // console.log('Complete Message Info:', completeMessageInfo);
   //                   return completeMessageInfo;
   //                } else {
   //                   console.error(
   //                      'Pinata API returned an error:',
   //                      pinataResponse.status,
   //                      pinataResponse.statusText
   //                   );
   //                   return null;
   //                }
   //             } catch (error) {
   //                console.error('Error fetching IPFS content:', error);
   //                return null;
   //             }
   //          })
   //       );
   //       // console.log('Message Details:', bookDetails);
   //       // const filteredMessages = bookDetails.filter(
   //       //    (detail) => detail !== null
   //       // );
   //       setKingdomBook(bookDetails);
   //       // console.log('Filtered Messages:', bookDetails);
   //       // Return the filteredDownloads as the API response
   //       // res.status(200).json(filteredMessages);
   //    } catch (error) {
   //       console.error('Error fetching Message details:', error);
   //    }
   // };

   useEffect(() => {
      const checkPurchasedStatus = async () => {
         try {
            const response = await axios.get(
               `https://hokoshokos-001-site1.etempurl.com/api/Catalog/GetTransactions/${address}`
            );
            const purchasedProducts = response.data.data;
            // console.log(purchasedProducts);
            const purchasedMap = {};
            filteredBooks.forEach((song) => {
               const isPurchased = purchasedProducts.some(
                  (product) => product.counterId === song.counterId
               );
               purchasedMap[song.counterId] = isPurchased;
            });
            // console.log(purchasedMap);
            setIndividualPurchasedStatus(purchasedMap);
         } catch (error) {
            console.error('Error checking purchase status:', error);
         }
      };
      checkPurchasedStatus();
   }, [address]);

   const buyNow = async (product) => {
      console.log(product);
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

   useEffect(() => {
      const fetchMessagesWithPrice = async () => {
         try {
            const bookWithPrices = await fetchPrices(kingdomBook);
            setKingdomBooksWithPrice(bookWithPrices);
            // console.log(bookWithPrices);

            const bookDetails = await fetchBooks();
            setKingdomBook(bookDetails);
            // console.log(bookDetails);

            // const response = await axios.get('/api/book');
            // const data = response.data;
            // // console.log(data);

            // setKingdomBook(data);
         } catch (error) {
            console.error('Error fetching books:', error);
         }
      };
      // booksContent();
      fetchMessagesWithPrice();
   }, [fetchPrices, kingdomBook]);

   // console.log(kingdomBooksWithPrice);
   // useEffect(() => {
   //    const fetchData = async () => {
   //       const bookDetails = await fetchBooks();
   //       console.log(bookDetails);
   //       setKingdomBook(bookDetails);
   //    };
   //    fetchData();
   // }, []);

   useEffect(() => {
      // Filter products based on searchInput and selectedCompany
      let filtered = [...kingdomBooksWithPrice];
      if (searchInput) {
         filtered = filtered.filter((book) =>
            book.title.toLowerCase().includes(searchInput.toLowerCase())
         );
         // console.log(filtered);
      }
      if (selectedCompany !== 'all') {
         filtered = filtered.filter(
            (product) => product.category === selectedCompany
         );
      }
      // console.log(filtered);
      // fetchBooks();
      setFilteredBooks(filtered);
      // setFilteredBooks(filtered);
   }, [searchInput, selectedCompany, kingdomBooksWithPrice]);

   const router = useRouter();
   if (kingdomBooksWithPrice.length === 0) {
      return (
         <>
            <ProductLenghtLoadingSpinner />
         </>
      );
   }
   // console.log(kingdomBooksWithPrice);
   // if (!kingdomBooksWithPrice || kingdomBooksWithPrice.length === 0) {
   //    return (
   //       <div className="mt-48">
   //          <p className="text-white text-2xl">No data available</p>;
   //       </div>
   //    );
   // }
   const displayProducts = () => {
      return (
         <>
            {filteredBooks.length === 0 ? (
               <div className="flex justify-center items-center mt-24">
                  <p className="text-2xl text-gray-400">
                     No Messages 🔽 found matching the search.
                  </p>
               </div>
            ) : (
               <>
                  {filteredBooks.map((book) => (
                     <div
                        // className=" relative bg-transparent p-2  hover:bg-[#342b1c] rounded-tl-3xl rounded-br-3xl shadow-custom mb-4"
                        className=" bg-transparent p-2  hover:bg-[#342b1c] rounded-tl-3xl rounded-br-3xl shadow-custom mb-4"
                        key={book.recId}
                     >
                        <Link href={`/single?id=${book.recId}`} passHref>
                           <img
                              src={`https://gateway.pinata.cloud/ipfs/${book.image}`}
                              className="h-32 w-72 md:w-52 rounded-tl-3xl object-center "
                              alt={book.title}
                              width={300}
                              height={150}
                           />
                        </Link>
                        <div className=" mt-1 mb-1 ">
                           <h5 className="text-white text-md capitalize">
                              {book.title}
                           </h5>
                           <h5 className="text-gray-400 text-sm mb-2 capitalize">
                              {book.author}
                           </h5>
                           {/* <div className="absolute"> */}
                           <div className="w-full flex justify-center items-center">
                              <span className="md:w-[70%] w-[40%] bg-[#DAA851] mr-auto px-2 py-1 text-gray-700 font-bold text-sm rounded-sm space-x-3">
                                 $TKC{' '}
                                 {(book.contentPrice / 1e15).toLocaleString()}
                              </span>
                              {/* <span className="bg-yellow-700 my-1 px-4 py-2 text-white font-bold text-sm  rounded-md hover:bg-yellow-800 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:ring-opacity-50"> */}
                              <div className="w-full">
                                 {individualPurchasedStatus[book.counterId] ? (
                                    <button
                                       disabled
                                       className="w-[95%] text-white ml-2 bg-gray-500 py-1 px-4 rounded-sm"
                                    >
                                       Purchased
                                    </button>
                                 ) : (
                                    <>
                                       {approvedProducts.includes(book.recId) ||
                                       isAllowance ? (
                                          <button
                                             onClick={() => {
                                                // setSelectedProduct(song);
                                                buyNow(book);
                                             }}
                                             className="w-[95%] text-white px-4 py-1 bg-yellow-700  rounded-sm hover:bg-yellow-800 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:ring-opacity-50"
                                          >
                                             {bookLoadingStates[book.recId] ? (
                                                <LoadingSpinner />
                                             ) : (
                                                'Buy Now'
                                             )}
                                          </button>
                                       ) : (
                                          <button
                                             onClick={() => {
                                                Approved(book);
                                             }}
                                             className="w-[95%] text-white ml-2 bg-yellow-700 py-1 px-4 rounded-sm"
                                          >
                                             {approveLoadingStates[
                                                book.recId
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
                     </div>
                  ))}
               </>
            )}
         </>
      );
   };
   const displayButtons = () => {
      const buttons = [
         'all',
         ...new Set(kingdomBook.map((book) => book.category)),
      ];
      return buttons.map((button) => (
         <button
            className="block px-4 py-2 w-full text-left hover:bg-[#342b1c] rounded-lg text-lg capitalize  text-gray-500 hover:text-gray-600 "
            key={button}
            onClick={() => setSelectedCompany(button)}
         >
            {button}
         </button>
      ));
   };
   return (
      <>
         <div className=" w-[90%] m-auto mt-28 mb-8">
            <div className="flex justify-center items-center mb-7 relative">
               <div
                  className=" flex justify-center items-center mb-4"
                  ref={sidebarRef}
               >
                  <input
                     type="text"
                     className=" md:w-[320px] px-4 py-2 rounded-md border border-transparent bg-[#342b1c] text-white focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-transparent"
                     placeholder="Search Books..."
                     value={searchInput}
                     onChange={(e) => setSearchInput(e.target.value)}
                  />
                  <button
                     onClick={openBookModal}
                     className="flex mx-3 py-1 px-3 text-[#DAA851] rounded-md space-x-2 border border-[#DAA851]"
                  >
                     <span className="text-white text-sm">Filter</span>
                     <FilterIcon />
                  </button>
               </div>
               {bookModalOpen && (
                  <div className="absolute top-12 right-0 md:right-8 lg:right-1/4 xl:right-72 2xl:right-1/3 flex items-center z-10 ">
                     <div className="w-64 p-4 bg-[#2c2518] rounded-lg shadow-custom">
                        <div className="flex justify-end">
                           <button
                              onClick={closeBookModal}
                              className="text-white rounded-md p-1  hover:bg-[#342b1c]"
                           >
                              <CloseIcon />
                           </button>
                        </div>
                        <span className="text-[#daa851]">Books</span>
                        <div>{displayButtons()}</div>
                     </div>
                  </div>
               )}
            </div>
            {/* <div className="w-[90%] justify-center items-center m-auto"> */}
            {filteredBooks.length !== 0 ? (
               <div className=" flex m-auto flex-col justify-center items-center">
                  <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                     <>{displayProducts()}</>
                  </div>
               </div>
            ) : (
               <div className="flex justify-center items-center mt-8">
                  {SearchIconWhenThereIsNoFilter('Book')}
               </div>
            )}
         </div>
      </>
   );
};
export default Books;
