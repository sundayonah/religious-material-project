// LoadingSpinner.js

import React from 'react';

export const LoadingSpinner = () => {
   return (
      <div className="flex items-center justify-center px-4">
         <div className="flex items-center justify-center w-6 h-6">
            <div className="w-2 h-2 mr-1 bg-white rounded-full animate-ping delay-100"></div>
            <div className="w-2 h-4 mr-1 bg-white rounded-full animate-pulse delay-500"></div>
            <div className="w-2 h-2 mr-1 bg-white rounded-full animate-ping delay-700"></div>
            <div className="w-2 h-4 bg-white rounded-full animate-pulse delay-1000"></div>
         </div>
      </div>
   );
};

export const ProductLenghtLoadingSpinner = () => {
   return (
      <div class="flex items-center justify-center   mt-72">
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
   );
};
