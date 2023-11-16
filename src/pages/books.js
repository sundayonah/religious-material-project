// 'use client';

// import React, { useState, useEffect, useContext, useRef } from 'react';
// import { useRouter } from 'next/router';

// // import products from './products/[id]';
// import products from '@/pages/api/[id]';
// import Link from 'next/link';
// import axios from 'axios';
// import { CloseIcon, FilterIcon } from '@/components/icons';
// import Image from 'next/image';

// // import { StateContext } from '@/Context/ReligiousContext';

// const Books = () => {
//    // const [filteredProducts, setFilteredProducts] = useState([...products]);
//    const [filteredProducts, setFilteredProducts] = useState([...products]);
//    const [searchInput, setSearchInput] = useState('');
//    const [selectedCompany, setSelectedCompany] = useState('all');
//    const [selectedProductId, setSelectedProductId] = useState(null);
//    const [kingdomBook, setKingdomBook] = useState([]);
//    const [bookModalOpen, setBookModalOpen] = useState(false);
//    const sidebarRef = useRef(null);
//    const opeBookModal = () => {
//       setBookModalOpen(true);
//    };

//    const closeBookModal = () => {
//       setBookModalOpen(false);
//    };

//    const bookURL =
//       'http://kingdomcoin-001-site1.ctempurl.com/api/Catalog/GetAllBooks';
//    const bookFile = async () => {
//       try {
//          const token =
//             'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMzQ2NjkzYWItOGZhOS00Mjg4LWEwZmYtMzNkOTZmYzdiOWJmIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIweDMyZTgwZTE2YWFmZGJiYjIwYmE1NTY5MGYyNzVhMjYwOGUzZWNmYzAiLCJleHAiOjE2OTk1OTc5MDgsImlzcyI6Imh0dHA6Ly9yb2Fkc3Rhci5jb20iLCJhdWQiOiJodHRwOi8vcm9hZHN0YXIuY29tIn0.HcQ6DkETMVi3FK6JYgBg49A9mv65jv7B4eJYWGrOnzg'; // Replace with your actual access token
//          const config = {
//             headers: {
//                Authorization: `Bearer ${token}`,
//             },
//          };
//          const res = await axios.get(bookURL, config);
//          console.log(res);
//          const data = await res.data;
//          console.log(data);
//       } catch (error) {
//          console.log(error);
//       }
//    };

//    useEffect(() => {
//       bookFile();
//    }, []);

//    useEffect(() => {
//       // Filter products based on searchInput and selectedCompany
//       let filtered = [...products];

//       if (searchInput) {
//          filtered = filtered.filter((product) =>
//             product.title.toLowerCase().includes(searchInput.toLowerCase())
//          );
//       }

//       if (selectedCompany !== 'all') {
//          filtered = filtered.filter(
//             (product) => product.category === selectedCompany
//          );
//       }
//       // fetchBooks();
//       setFilteredProducts(filtered);
//    }, [searchInput, selectedCompany, products]);

//    const displayProducts = () => {
//       if (filteredProducts.length < 1) {
//          return (
//             <h6 className="text-white text-3xl">
//                Sorry, no products matched your search
//             </h6>
//          );
//       }

//       return filteredProducts.map(({ id, title, image, price }) => (
//          <div
//             className="relative bg-transparent p-2  hover:bg-[#342b1c] rounded-tl-3xl rounded-br-3xl shadow-custom mb-4"
//             key={id}
//          >
//             <Link href={`/single?id=${id}`} passHref>
//                <Image
//                   src={image}
//                   className="h-40 w-full rounded-tl-3xl object-center "
//                   alt={title}
//                   width={200}
//                   height={150}
//                />
//                {/*
//                <div class="md:flex-shrink-0">
//                <img
//                   src={image}
//                   alt={`${title} Image `}
//                   className="rounded-md object-center h-48"
//                   // width={200}
//                   // height={150}
//                />
//                </div> */}
//             </Link>
//             <div className="text-center mt-1 mb-3 ">
//                <h5 className="text-gray-500 text-lg capitalize">{title}</h5>
//                <span className="absolute bg-[#DAA851] my-1 px-2 py-1 text-gray-700 font-bold text-sm left-48 md:left-40 lg:left-40 xl:left-40 2xl:left-70 rounded-md">
//                   $TKC {price}
//                </span>
//             </div>
//          </div>
//       ));
//    };

//    const displayButtons = () => {
//       const buttons = [
//          'all',
//          ...new Set(products.map((product) => product.category)),
//       ];

//       return buttons.map((button) => (
//          <button
//             className="block px-4 py-2 w-full text-left hover:bg-[#342b1c] rounded-lg text-lg capitalize  text-gray-500 hover:text-gray-600 "
//             key={button}
//             onClick={() => setSelectedCompany(button)}
//          >
//             {button}
//          </button>
//       ));
//    };

//    return (
//       <>
//          <div className=" w-[90%] m-auto mt-28 mb-8">
//             <div className="flex justify-center items-center mb-7 relative">
//                <div
//                   className=" flex justify-center items-center mb-4"
//                   ref={sidebarRef}
//                >
//                   <input
//                      type="text"
//                      className=" md:w-[320px] px-4 py-2 rounded-md border border-transparent bg-[#342b1c] text-white focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-transparent"
//                      placeholder="Search Books..."
//                      value={searchInput}
//                      onChange={(e) => setSearchInput(e.target.value)}
//                   />
//                   <button
//                      onClick={opeBookModal}
//                      className="flex mx-3 py-1 px-3 text-[#DAA851] rounded-md space-x-2 border border-[#DAA851]"
//                   >
//                      <span className="text-white text-sm">Filter</span>
//                      <FilterIcon />
//                   </button>
//                </div>
//                {bookModalOpen && (
//                   <div className="absolute top-12 right-0 md:right-8 lg:right-1/4 xl:right-72 2xl:right-1/3 flex items-center z-10 ">
//                      <div className="w-64 p-4 bg-[#2c2518] rounded-lg shadow-custom">
//                         <div className="flex justify-end">
//                            <button
//                               onClick={closeBookModal}
//                               className="text-white rounded-md p-1  hover:bg-[#342b1c]"
//                            >
//                               <CloseIcon />
//                            </button>
//                         </div>
//                         <span className="text-[#daa851]">Books</span>
//                         <div>{displayButtons()}</div>
//                      </div>
//                   </div>
//                )}
//             </div>
//             {/* <div className="w-[95%] justify-center items-center m-auto"> */}
//             <div className="flex m-auto flex-col justify-center items-center">
//                <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//                   {displayProducts()}
//                </div>
//             </div>
//          </div>
//       </>
//    );
// };
// export default Books;

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

// import { StateContext } from '@/Context/ReligiousContext';

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

   const opeBookModal = () => {
      setBookModalOpen(true);
   };

   const closeBookModal = () => {
      setBookModalOpen(false);
   };

   // Function to fetch prices for each book
   const fetchPrices = useCallback(async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(
         RMTestnetContractAddress,
         RMabi,
         signer
      );

      const updatedMessages = [];
      for (const book of kingdomBook) {
         const contentId = book.id;
         console.log(contentId);

         const contentData = await contract.content(contentId);
         const contentSplit = contentData.toString();
         // console.log(contentSplit);
         const contentValues = contentSplit.split(','); // Splitting the string by comma

         // Assuming the second value (index 1) represents the price
         const contentPrice = contentValues[1] ? parseInt(contentValues[1]) : 0;

         // // Assuming other values in 'contentData' correspond to other properties in 'book'
         const bookWithPrice = { ...book, contentPrice };
         console.log(bookWithPrice);

         updatedMessages.push(bookWithPrice);
      }

      console.log(updatedMessages);
      return updatedMessages;
   }, [kingdomBook]);

   useEffect(() => {
      const fetchMessagesWithPrice = async () => {
         const bookWithPrices = await fetchPrices();
         setKingdomBooksWithPrice(bookWithPrices);

         const bookDetails = await fetchBooks();
         // console.log(bookDetails);
         setKingdomBook(bookDetails);
      };
      fetchMessagesWithPrice();
   }, [fetchPrices]);

   console.log(kingdomBooksWithPrice);

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

   const displayProducts = () => {
      if (kingdomBooksWithPrice.length === 0) {
         return (
            <>
               <div class="flex items-center justify-center   mt-24">
                  <div class="flex items-center justify-center  w-6 h-6">
                     <div class="w-24 h-24 p-5 bg-[#DAA851] rounded-full animate-pulse delay-500">
                        Lo
                     </div>
                     <div class="w-24 h-24 p-5 bg-[#DAA851] rounded-full animate-ping delay-100">
                        ad
                     </div>
                     <div class="w-24 h-24 p-5 bg-[#DAA851] rounded-full animate-pulse delay-500">
                        i
                     </div>
                     <div class="w-24 h-24 p-5 bg-[#DAA851] rounded-full animate-ping delay-700">
                        n
                     </div>
                     <div class="w-24 h-24 p-5 bg-[#DAA851] rounded-full animate-pulse delay-1000">
                        g
                     </div>
                  </div>
               </div>
            </>
         );
      }

      console.log(kingdomBooksWithPrice);
      return (
         <>
            {/* {filteredProducts.length === 0 ? (
               <div className="flex justify-center items-center mt-24">
                  <p className="text-2xl text-gray-400">
                     No Messages 🔽 found matching the search.
                  </p>
               </div>
            ) : ( */}
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
                           <h5 className="text-gray-500 text-lg capitalize">
                              {author}
                           </h5>
                           {/* <span className="absolute bg-[#DAA851] my-1 px-4 py-1 text-gray-700 font-bold text-sm left-48 md:left-40 lg:left-40 xl:left-40 2xl:left-70 rounded-md"> */}
                           <span className="absolute bg-[#DAA851] my-1 px-4 py-1 text-gray-700 font-bold text-sm  rounded-md">
                              $TKC {contentPrice}
                           </span>
                        </div>
                     </div>
                  )
               )}
            </>
            {/* )} */}
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
                     onClick={opeBookModal}
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
            {filteredProducts.length === 0 ? (
               <div className="flex justify-center items-center mt-24">
                  <p className="text-2xl text-gray-400">
                     No Books 📚 found matching the search.
                  </p>
               </div>
            ) : (
               <div className="flex m-auto flex-col justify-center items-center">
                  <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                     <>{displayProducts()}</>
                  </div>
               </div>
            )}
         </div>
      </>
   );
};
export default Books;
