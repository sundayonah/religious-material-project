import React from 'react';
import { useWeb3Modal } from '@web3modal/wagmi/react';

const Download = () => {
   const repetitions = Array.from({ length: 12 });
   const { open } = useWeb3Modal();

   // console.log(open());

   return (
      <>
         <div className="w-[80%] m-auto mt-28">
            <div className="flex flex-wrap gap-3 p-2 justify-center items-center">
               {repetitions.map((_, index) => (
                  <div
                     key={index}
                     className="flex justify-between items-center mx-1  px-2 py-3  rounded-md border border-s-green-800"
                  >
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

export default Download;
