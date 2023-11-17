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
