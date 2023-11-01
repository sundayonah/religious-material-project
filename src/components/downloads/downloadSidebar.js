import React, { useEffect, useState } from 'react';
import { CloseIcon, OpenIcon } from '../icons';
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
   // Add a state for downloaded books when available

   const toggleMenu = () => {
      setSideBarOpen(!sideBarOpen);
   };

   const closeMenu = () => {
      setSideBarOpen(false);
   };

   const handleFilterClick = (filter) => {
      setSelectedFilter(filter);
   };

   useEffect(() => {
      // Load downloaded songs and messages from local storage
      const songs = JSON.parse(localStorage.getItem('purchasedProducts')) || [];
      const messages =
         JSON.parse(localStorage.getItem('purchasedMessages')) || [];

      setDownloadedSongs(songs);
      setDownloadedMessages(messages);

      // You can add similar code to load downloaded books when available
   }, []);

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
            // Implement your Books rendering logic
            return <BooksDownload />;
         case 'Songs':
            return <SongDownloads />;
         case 'Messages':
            return <MessagesDownload />;
         default:
            return null;
      }
   };

   return (
      <>
         <div className="w-[15%] ">
            <div className="md:hidden">
               {sideBarOpen ? (
                  ''
               ) : (
                  <button
                     onClick={toggleMenu}
                     className="text-white rounded-md"
                  >
                     <OpenIcon />
                  </button>
               )}
            </div>
            <div
               className={`${
                  sideBarOpen
                     ? 'block left-0 px-5 py-4 w-[30%] min-h-full top-0 border-r-[1px] border-gray-800 bg-[#2c2518] z-50'
                     : 'hidden'
               } md:flex flex-col absolute`}
            >
               <div className="flex justify-end">
                  {sideBarOpen && (
                     <button
                        onClick={closeMenu}
                        className="text-white  rounded-md md:hidden"
                     >
                        <CloseIcon />
                     </button>
                  )}
               </div>
               <h5 className="text-[#DAA851]">Library</h5>
               {sideMenu.map((menu, i) => (
                  <div key={i} className="text-gray-600">
                     <button
                        onClick={() => handleFilterClick(menu)}
                        className={`py-1 hover:text-gray-500 ${
                           selectedFilter === menu ? 'text-[#DAA851]' : ''
                        }`}
                     >
                        {menu}
                     </button>
                  </div>
               ))}
            </div>
         </div>

         <div className="w-full">{renderContent()}</div>
      </>
   );
};

export default DownloadSidebar;
