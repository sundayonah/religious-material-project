import React from 'react';

const download = () => {
   const repetitions = Array.from({ length: 12 });

   return (
      <>
         <div className="w-[80%] m-auto mt-28">
            <div className="grid grid-rows-3 grid-flow-col md:grid-rows-2 gap-4 justify-center items-center">
               {repetitions.map((_, index) => (
                  <div key={index} className="flex border b-2 m-2 rounded-md">
                     <div className="text-gray-700">
                        <img
                           src="/images/play-1.png"
                           alt=""
                           className=""
                           width={100}
                           height={150}
                        />
                     </div>
                     <div className="flex flex-col m-1">
                        <span className="text-white">title</span>
                        <span className="text-gray-600">artist</span>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </>
   );
};

export default download;
