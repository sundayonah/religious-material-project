import React, { useState } from 'react';
import { CloseIcon, OpenIcon } from '../icons';

const DownloadSidebar = () => {
   const sideMenu = ['All', 'Books', 'Messages', 'Songs'];

   const [sideBarOpen, setSideBarOpen] = useState(false);

   const toggleMenu = () => {
      setSideBarOpen(!sideBarOpen);
   };

   const closeMenu = () => {
      setSideBarOpen(false);
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
               <div></div>
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
                     <button className="py-1 hover:text-gray-500">
                        {menu}
                     </button>
                  </div>
               ))}
            </div>
         </div>
      </>
   );
};

export default DownloadSidebar;
