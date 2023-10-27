import React from 'react';

const DownloadSidebar = () => {
   const sideMenu = ['All', 'Books', 'Messages', 'Songs'];

   return (
      <>
         <div className="w-[20%]">
            <h5 className="text-[#DAA851]">Library</h5>
            {sideMenu.map((menu, i) => (
               <div key={i} className="text-gray-600">
                  <button className="py-1 hover:text-gray-500">{menu}</button>
               </div>
            ))}
         </div>
      </>
   );
};

export default DownloadSidebar;
