import React, { useEffect, useState } from 'react';
import { CloseIcon, FilterIcon, OpenIcon } from '../icons';
import SongDownloads from './songDownloads';
import { MessagesDownload } from './messagesDownload';
import { BooksDownload } from './booksDownload';

const DownloadSidebar = () => {
   const sideMenu = ['All', 'Books', 'Messages', 'Songs'];

   const [sideBarOpen, setSideBarOpen] = useState(false);
   const [selectedFilter, setSelectedFilter] = useState('All');
   const [downloadedSongs, setDownloadedSongs] = useState([]);
   const [downloadedMessages, setDownloadedMessages] = useState([]);
   const [downloadedBooks, setDownloadedBooks] = useState([]);
   const [filterModalOpen, setFilterModalOpen] = useState(false);
   const [searchInput, setSearchInput] = useState('');
   const [combinedPurchasedProducts, setCombinedPurchasedProducts] = useState(
      []
   );

   const toggleMenu = () => {
      setSideBarOpen(!sideBarOpen);
   };

   const closeMenu = () => {
      setSideBarOpen(false);
   };

   const handleFilterClick = (filter) => {
      setSelectedFilter(filter);
   };

   const openFilterModal = () => {
      setFilterModalOpen(true);
   };

   const closeFilterModal = () => {
      setFilterModalOpen(false);
   };

   // const renderContent = (filteredProducts) => {
   //    switch (selectedFilter) {
   //       case 'All':
   //          return (
   //             <>
   //                <SongDownloads />
   //                <MessagesDownload />
   //                <BooksDownload />
   //                {/* Add rendering for Books here */}
   //             </>
   //          );
   //       case 'Books':
   //          // Implement your Books rendering logic
   //          return <BooksDownload />;
   //       case 'Songs':
   //          return <SongDownloads />;
   //       case 'Messages':
   //          return <MessagesDownload />;
   //       default:
   //          return null;
   //    }
   // };

   const renderContent = () => {
      switch (selectedFilter) {
         case 'All':
            return (
               <>
                  <SongDownloads />
                  <MessagesDownload />
                  <BooksDownload />
                  {/* Add rendering for Books here */}
               </>
            );
         case 'Books':
            return <BooksDownload />;
         case 'Songs':
            return <SongDownloads />;
         case 'Messages':
            return <MessagesDownload />;
         default:
            return null;
      }
   };

   const handleSearchInputChange = (e) => {
      console.log(e.target.value);
      setSearchInput(e.target.value);
   };

   useEffect(() => {
      // Step 1: Retrieve purchased products from local storage for each category
      const purchasedSongs =
         JSON.parse(localStorage.getItem('purchasedProducts')) || [];
      const purchasedMessages =
         JSON.parse(localStorage.getItem('purchasedMessages')) || [];
      const purchasedBooks =
         JSON.parse(localStorage.getItem('purchasedBooks')) || [];

      // Step 2: Combine purchased products from all categories
      const allPurchasedProducts = [
         ...purchasedSongs.map(JSON.parse), // Parse each item in the array
         ...purchasedMessages.map(JSON.parse), // Parse each item in the array
         ...purchasedBooks.map(JSON.parse), // Parse each item in the array
      ];

      // console.log(allPurchasedProducts);

      setCombinedPurchasedProducts(allPurchasedProducts);
   }, []);

   // ...

   const filterPurchasedProducts = () => {
      const filteredProducts = combinedPurchasedProducts.filter((product) => {
         if (product.title) {
            const title = product.title.toLowerCase();
            return title.includes(searchInput.toLowerCase());
         }
         return false; // Exclude products without a title property
      });

      // console.log(filteredProducts);
      return filteredProducts;
   };

   return (
      <>
         <div className="flex justify-center items-center mb-7 relative">
            <div className="flex items-center">
               {/* Container for input and FilterIcon */}
               <input
                  className="w-full md:w-[320px] px-4 py-2 rounded-md border border-transparent bg-[#342b1c] text-white focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-transparent"
                  type="text"
                  placeholder="Search products..."
                  value={searchInput}
                  onChange={handleSearchInputChange}
               />
               <button
                  onClick={openFilterModal}
                  className="flex mx-3 py-1 px-3 text-[#DAA851] rounded-md space-x-2 border border-[#DAA851] "
               >
                  <span>Filter</span>
                  <FilterIcon />
               </button>
            </div>
            {filterModalOpen && (
               // <div className="absolute right-0 top-12 flex items-center">
               <div className="absolute top-12 right-0 md:right-8 lg:right-16 xl:right-64 2xl:right-64 flex items-center">
                  <div className="w-64 p-4 bg-[#2c2518] rounded-lg shadow-custom">
                     <div className="flex justify-end">
                        <button
                           onClick={closeFilterModal}
                           className="text-white rounded-md p-1  hover:bg-[#342b1c]"
                        >
                           <CloseIcon />
                        </button>
                     </div>
                     {sideMenu.map((menu, i) => (
                        <div key={i} className="text-gray-600">
                           <button
                              onClick={() => handleFilterClick(menu)}
                              className={`px-4 py-2 w-full text-left hover:bg-[#342b1c] rounded-lg ${
                                 selectedFilter === menu ? 'text-[#DAA851]' : ''
                              }`}
                           >
                              {menu}
                           </button>
                        </div>
                     ))}
                  </div>
               </div>
            )}
         </div>

         <div className="w-full">{renderContent()}</div>
      </>
   );
};

export default DownloadSidebar;
