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

const Books = () => {
   // const [filteredProducts, setFilteredProducts] = useState([...products]);
   const [filteredProducts, setFilteredProducts] = useState([]);
   const [searchInput, setSearchInput] = useState('');
   const [selectedCompany, setSelectedCompany] = useState('all');
   const [selectedProductId, setSelectedProductId] = useState(null);
   const [kingdomBook, setKingdomBook] = useState([]);
   const [bookModalOpen, setBookModalOpen] = useState(false);
   const [kingdomBooksWithPrice, setKingdomBooksWithPrice] = useState([]);

   const RMTestnetContractAddress =
      '0xF00Ab09b8FA49dD07da19024d6D213308314Ddb8';

   const sidebarRef = useRef(null);

   const openBookModal = () => {
      setBookModalOpen(true);
   };

   const closeBookModal = () => {
      setBookModalOpen(false);
   };

   const publicProvider =
      'https://polygon-mumbai.g.alchemy.com/v2/o_O5LwKav_r5UECR-59GtRZsIqnhD0N8';
   // Function to fetch prices for each book
   const fetchPrices = useCallback(async () => {
      // const provider = new ethers.providers.getDefaultProvider('homestead', {
      //    alchemy: 'o_O5LwKav_r5UECR-59GtRZsIqnhD0N8',
      // });
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const signer = provider.getSigner();

      const contract = new ethers.Contract(
         RMTestnetContractAddress,
         RMabi,
         // provider
         signer
      );

      const updatedMessages = [];
      for (const book of kingdomBook) {
         const contentId = book.id;

         const contentData = await contract.content(contentId);
         const contentSplit = contentData.toString();
         // console.log(contentSplit);
         const contentValues = contentSplit.split(','); // Splitting the string by comma

         // Assuming the second value (index 1) represents the price
         const contentPrice = contentValues[1] ? parseInt(contentValues[1]) : 0;
         // console.log(contentPrice);

         // // Assuming other values in 'contentData' correspond to other properties in 'book'
         const bookWithPrice = { ...book, contentPrice };
         // console.log(bookWithPrice);

         updatedMessages.push(bookWithPrice);
      }

      // console.log(updatedMessages);
      return updatedMessages;
   }, [kingdomBook]);
   // 465000000000000000;

   useEffect(() => {
      const fetchBooks = async () => {
         try {
            const response = await axios.get(
               'http://hokoshokos-001-site1.etempurl.com/api/Catalog/GetAllBooks'
            );
            const data = response.data.data;

            // console.log('Original Book Data:', data);

            const bookDetails = await Promise.all(
               data.map(async (book) => {
                  try {
                     const ipfsHash = book.hash;
                     const pinataApiUrl = `https://purple-existing-woodpecker-520.mypinata.cloud/ipfs/${ipfsHash}`;

                     console.log(
                        'Fetching IPFS content for book',
                        book.recId,
                        '-',
                        ipfsHash
                     );

                     const pinataResponse = await axios.get(pinataApiUrl);

                     console.log(
                        'Pinata Response for book',
                        book.recId,
                        '-',
                        pinataResponse.data
                     );

                     if (pinataResponse.status === 200) {
                        const ipfsContent = pinataResponse.data;

                        console.log(book);

                        const completeBookInfo = {
                           recId: book.recId,
                           hash: book.hash,
                           counterId: book.counterId,
                           category: book.category,
                           bookFile: book.bookFile,
                           ...ipfsContent,
                        };

                        console.log('Complete Book Info:', completeBookInfo);
                        return completeBookInfo;
                     } else {
                        console.error(
                           'Pinata API returned an error:',
                           pinataResponse.status,
                           pinataResponse.statusText
                        );
                        return null;
                     }
                  } catch (error) {
                     console.error('Error processing book:', error);
                     return null;
                  }
               })
            );

            // console.log('Book Details:', bookDetails);

            const filteredBooks = bookDetails.filter((book) => book !== null);
            // console.log('Filtered Books:', filteredBooks);
            setKingdomBook(filteredBooks);
         } catch (error) {
            console.error('Error fetching books details:', error);
         }
      };

      fetchBooks();
   }, []);

   // console.log(kingdomBook);

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
      const fetchMessagesWithPrice = async () => {
         try {
            const bookWithPrices = await fetchPrices();
            setKingdomBooksWithPrice(bookWithPrices);

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
   }, [fetchPrices]);

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
      setFilteredProducts(filtered);
      // setFilteredProducts(filtered);
   }, [searchInput, selectedCompany, kingdomBooksWithPrice]);

   const router = useRouter();

   // useEffect(() => {
   //    const checkPurchasedStatus = async () => {
   //       try {
   //          const response = await axios.get(
   //             `http://kingdomcoin-001-site1.ctempurl.com/api/Catalog/GetTransactions/${address}`
   //          );

   //          const purchasedProducts = response.data.data;
   //          const purchasedMap = {};

   //          filteredMessages.forEach((message) => {
   //             const isPurchased = purchasedProducts.some(
   //                (product) => product.counterId === message.counterId
   //             );
   //             purchasedMap[message.counterId] = isPurchased;
   //          });

   //          // console.log(purchasedMap);

   //          setIndividualPurchasedStatus(purchasedMap);
   //       } catch (error) {
   //          console.error('Error checking purchase status:', error);
   //       }
   //    };

   //    checkPurchasedStatus();
   // }, [address]);

   // console.log(kingdomBook);

   if (kingdomBooksWithPrice.length === 0) {
      return (
         <>
            {/* <ProductLenghtLoadingSpinner /> */}
            <div className="flex justify-center items-center mt-24">
               <p className="text-2xl text-gray-400">Coming Soon</p>
            </div>
         </>
      );
   }
   const displayProducts = () => {
      return (
         <>
            {filteredProducts.length === 0 ? (
               <div className="flex justify-center items-center mt-24">
                  <p className="text-2xl text-gray-400">
                     No Messages 🔽 found matching the search.
                  </p>
               </div>
            ) : (
               <>
                  {filteredProducts.map(
                     ({ recId, title, image, author, id, contentPrice }) => (
                        <div
                           className="relative bg-transparent p-2  hover:bg-[#342b1c] rounded-tl-3xl rounded-br-3xl shadow-custom mb-4"
                           key={recId}
                        >
                           <Link href={`/single?id=${recId}`} passHref>
                              <Image
                                 src={`https://gateway.pinata.cloud/ipfs/${image}`}
                                 className="h-48 w-52 rounded-tl-3xl object-center "
                                 alt={title}
                                 width={300}
                                 height={150}
                              />
                           </Link>
                           <div className="text-center mt-1 mb-3 ">
                              <h5 className="text-gray-500 text-lg capitalize">
                                 {title}
                              </h5>
                              {/* <h5 className="text-gray-500 text-lg capitalize">
                              {id}
                           </h5> */}
                              <h5 className="text-white text-lg capitalize">
                                 {author}
                              </h5>
                              {/* <span className="absolute bg-[#DAA851] my-1 px-4 py-1 text-gray-700 font-bold text-sm left-48 md:left-40 lg:left-40 xl:left-40 2xl:left-70 rounded-md"> */}
                              <span className="absolute bg-[#DAA851] my-1 px-4 py-1 text-gray-700 font-bold text-sm  rounded-md">
                                 $TKC {contentPrice / 1e15}
                              </span>
                           </div>
                        </div>
                     )
                  )}
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
            {/* <div className="w-[95%] justify-center items-center m-auto"> */}
            {filteredProducts.length !== 0 ? (
               <div className="flex m-auto flex-col justify-center items-center">
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
