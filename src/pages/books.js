'use client';

import React, { useState, useEffect, useContext, useRef } from 'react';
import { useRouter } from 'next/router';

// import products from './products/[id]';
import products from '@/pages/api/[id]';
import Link from 'next/link';
import axios from 'axios';
import { CloseIcon, FilterIcon } from '@/components/icons';

// import { StateContext } from '@/Context/ReligiousContext';

const Books = () => {
   // const [filteredProducts, setFilteredProducts] = useState([...products]);
   const [filteredProducts, setFilteredProducts] = useState([...products]);
   const [searchInput, setSearchInput] = useState('');
   const [selectedCompany, setSelectedCompany] = useState('all');
   const [selectedProductId, setSelectedProductId] = useState(null);
   const [kingdomBook, setKingdomBook] = useState([]);
   const [bookModalOpen, setBookModalOpen] = useState(false);
   const sidebarRef = useRef(null);

   // const { address, disconnect, connect } = useContext(StateContext);

   // console.log(address);
   // const fetchBooks = async () => {
   //    try {
   //       const res = await axios.get(booksURL);

   //       const data = await res.data.data;
   //       console.log(data);
   //       setKingdomBook(data);
   //       return data;
   //    } catch (error) {
   //       console.log('Failed to fetch', error);
   //    }
   // };

   //    To make calls to other endpoints fetch the token value from the data you stored on local storage and pass it in the authorization header of your request

   // create another function called fetchBooks

   // const booksURL =
   //    'http://kingdomcoin-001-site1.ctempurl.com/api/Book/GetAllBooks';

   // // Function to fetch books using the stored token
   // const fetchBooks = async () => {
   //    try {
   //       // Get the stored token from local storage
   //       const storedData = JSON.parse(localStorage.getItem('responseData'));
   //       const token = storedData.token;
   //       console.log(token);

   //       if (token) {
   //          // Define the API endpoint for fetching books
   //          // const booksURL =
   //          //    'http://kingdomcoin-001-site1.ctempurl.com/api/Book/GetAllBooks';

   //          // Make a GET request to the books endpoint with the token in the Authorization header
   //          const res = await axios.get(booksURL, {
   //             headers: {
   //                Authorization: `Bearer ${token}`,
   //             },
   //          });
   //          console.log(res);

   //          if (res.data.statusCode === 200) {
   //             const booksData = res.data; // Access the res data
   //             console.log(booksData);
   //          } else {
   //             console.error(
   //                `API request failed with status code ${res.status}`
   //             );
   //             if (res.status === 401) {
   //                console.error(
   //                   'Unauthorized: Check your authorization token.'
   //                );
   //             }
   //          }
   //       } else {
   //          console.error('Token not found in local storage');
   //       }
   //    } catch (error) {
   //       console.error('Error fetching books:', error);
   //    }
   // };

   // // Now you can call fetchBooks whenever you need to fetch books

   // fetchBooks();

   const opeBookModal = () => {
      setBookModalOpen(true);
   };

   const closeBookModal = () => {
      setBookModalOpen(false);
   };

   useEffect(() => {
      // Filter products based on searchInput and selectedCompany
      let filtered = [...products];

      if (searchInput) {
         filtered = filtered.filter((product) =>
            product.title.toLowerCase().includes(searchInput.toLowerCase())
         );
      }

      if (selectedCompany !== 'all') {
         filtered = filtered.filter(
            (product) => product.category === selectedCompany
         );
      }
      // fetchBooks();
      setFilteredProducts(filtered);
   }, [searchInput, selectedCompany, products]);

   const displayProducts = () => {
      if (filteredProducts.length < 1) {
         // return <h6>Sorry, no products matched your search</h6>;
      }

      return filteredProducts.map(({ id, title, image, price }) => (
         <div
            className="bg-transparent p-2 border border-gray-500 rounded-tr-3xl rounded-bl-3xl   shadow-md mb-4"
            key={id}
         >
            <Link href={`/single?id=${id}`} passHref>
               <img
                  src={image}
                  className="h-32 w-full rounded-tr-3xl object-cover"
                  alt={title}
               />
            </Link>

            <div className="text-center mt-1">
               <h5 className="text-gray-500 text-sm">{title}</h5>
               <h4 className="text-gray-700 font-bold text-lg">$TKC {price}</h4>
            </div>
         </div>
      ));
   };

   const displayButtons = () => {
      const buttons = [
         'all',
         ...new Set(products.map((product) => product.category)),
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
         <div className=" w-[87%] m-auto mt-28 mb-8 gap-4 ">
            <div className="flex justify-center items-center mb-7 relative">
               <div
                  className=" flex justify-center items-center mb-12"
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
                     className="flex mx-3 py-1 px-3 text-[#DAA851] rounded-md space-x-2 border border-[#DAA851] "
                  >
                     <span className="text-white">Filter Book</span>
                     <FilterIcon />
                  </button>
               </div>

               {bookModalOpen && (
                  <div className="absolute top-12 right-0 md:right-8 lg:right-16 xl:right-64 2xl:right-64 flex items-center">
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
            <div className="w-full justify-center items-center m-auto ">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayProducts()}
               </div>
            </div>
         </div>
      </>
   );
};

export default Books;
