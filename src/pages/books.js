'use client';

import React, { useState, useEffect, useContext, useRef } from 'react';
import { useRouter } from 'next/router';

// import products from './products/[id]';
import products from '@/pages/api/[id]';
import Link from 'next/link';
import axios from 'axios';
import { CloseIcon, FilterIcon } from '@/components/icons';
import Image from 'next/image';

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
         return (
            <h6 className="text-white text-3xl">
               Sorry, no products matched your search
            </h6>
         );
      }

      return filteredProducts.map(({ id, title, image, price }) => (
         <div
            className="relative bg-transparent p-2  hover:bg-[#342b1c] rounded-tl-3xl rounded-br-3xl shadow-custom mb-4"
            key={id}
         >
            <Link href={`/single?id=${id}`} passHref>
               <Image
                  src={image}
                  className="h-40 w-full rounded-tl-3xl object-center "
                  alt={title}
                  width={200}
                  height={150}
               />
               {/* 
               <div class="md:flex-shrink-0">
               <img
                  src={image}
                  alt={`${title} Image `}
                  className="rounded-md object-center h-48"
                  // width={200}
                  // height={150}
               />
               </div> */}
            </Link>
            <div className="text-center mt-1 mb-3 ">
               <h5 className="text-gray-500 text-lg capitalize">{title}</h5>
               <span className="absolute bg-[#DAA851] my-1 px-2 py-1 text-gray-700 font-bold text-sm left-48 md:left-40 lg:left-40 xl:left-40 2xl:left-70 rounded-md">
                  $TKC {price}
               </span>
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
            <div className="flex m-auto flex-col justify-center items-center">
               <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {displayProducts()}
               </div>
            </div>
         </div>
      </>
   );
};
export default Books;

// //previous
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

//             </Link>
//             <div className="text-center mt-1 mb-3 ">
//                <h5 className="text-gray-500 text-lg capitalize">{title}</h5>
//                <span className="absolute bg-[#DAA851] my-1 px-2 py-1 text-gray-700 font-bold text-sm left-48 md:left-32 lg:left-28 xl:left-24 2xl:left-70 rounded-md">
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
//             <div className="flex m-auto flex-col justify-center items-center">
//                <div className=" grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//                   {displayProducts()}
//                </div>
//             </div>
//          </div>
//       </>
//    );
// };
// export default Books;
