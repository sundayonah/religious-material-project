import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from './icons';

const CommentsSection = () => {
   const [isCommentsVisible, setCommentsVisible] = useState(false);

   const toggleCommentsVisibility = () => {
      setCommentsVisible((prev) => !prev);
   };

   return (
      <div className={`relative z-50`}>
         <div
            className="fixed right-0 flex justify-center pr-2 items-center cursor-pointer "
            onClick={toggleCommentsVisibility}
         >
            {isCommentsVisible ? (
               <div className="transition-transform transform">
                  <ChevronLeft />
               </div>
            ) : (
               <div className="transition-transform">
                  <ChevronRight />
                  {/* <span className="group-hover:inline-block absolute bg-black text-white text-xs p-2 px-4 -ml-20 mb-16 rounded whitespace-no-wrap transition-opacity duration-300">
                     Show Comments
                  </span> */}
               </div>
            )}
         </div>
         <div
            className={`absolute right-8 p-4 z-40 w-96 bg-[#2c2517] rounded-sm transition-transform duration-300 ${
               isCommentsVisible ? 'scale-100  ' : 'scale-0'
            }`}
         >
            {isCommentsVisible && (
               <
                  //   className={`absolute right-8 p-4 z-40 w-96 bg-[#2c2517] rounded-sm transition-transform duration-700  ${
                  //      isCommentsVisible
                  //         ? ''
                  //         : 'transform translate-x-full duration-300 delay-700'
                  //   }`}
               >
                  <span className="text-white">Comment</span>
                  <div className=" py-2">
                     <input
                        className="w-full px-4 py-2 rounded-md border border-[#DAA851] bg-[#342b1c] text-white focus:outline-none focus:ring-2 focus:ring-[#DAA851] focus:border-transparent"
                        type="text"
                        placeholder="Say Something"
                     />
                  </div>
                  <span className="text-white capitalize">
                     previous comments
                  </span>
                  <div className="flex justify-center py-2">
                     <div>
                        <Image
                           src="/images/logo.png"
                           alt="comment avatar"
                           width={80}
                           height={80}
                        />
                     </div>
                     <div className="bg-[#63533c] py-1 px-2 rounded-r-2xl rounded-bl-2xl ">
                        <span className="text-white test-small font-bold ">
                           0x43xxx...xxxxx
                        </span>
                        <p className="text-white test-small">
                           For verily I say unto you, That whosoever shall say
                           unto this mountain.
                        </p>
                     </div>
                  </div>
                  <div className="flex justify-center py-2">
                     <div>
                        <Image
                           src="/images/logo.png"
                           alt="comment avatar"
                           width={80}
                           height={80}
                        />
                     </div>
                     <div className="bg-[#63533c] py-1 px-2 rounded-r-2xl rounded-bl-2xl ">
                        <span className="text-white test-small font-bold ">
                           0x43xxx...xxxxx
                        </span>
                        <p className="text-white test-small">
                           For verily I say unto you, That whosoever shall say
                           unto this mountain.
                        </p>
                     </div>
                  </div>
                  <div className="flex justify-center py-2">
                     <div>
                        <Image
                           src="/images/logo.png"
                           alt="comment avatar"
                           width={80}
                           height={80}
                        />
                     </div>
                     <div className="bg-[#63533c] py-1 px-2 rounded-r-2xl rounded-bl-2xl ">
                        <span className="text-white test-small font-bold ">
                           0x43xxx...xxxxx
                        </span>
                        <p className="text-white test-small">
                           For verily I say unto you, That whosoever shall say
                           unto this mountain.
                        </p>
                     </div>
                  </div>

                  <span className="text-purple-400 capitalize text-sm flex justify-end pt-2 ">
                     view more comments...
                  </span>
               </>
            )}
         </div>
      </div>
   );
};

export default CommentsSection;
