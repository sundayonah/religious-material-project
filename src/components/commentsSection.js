import Image from 'next/image';
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from './icons';

const CommentsSection = () => {
   const [isCommentsVisible, setCommentsVisible] = useState(false);

   const toggleCommentsVisibility = () => {
      setCommentsVisible((prev) => !prev);
   };

   return (
      <div className=" relative z-50">
         <div
            // className="fixed flex items-center cursor-pointer"
            className="fixed right-0 flex justify-center pr-2 items-center  cursor-pointer"
            onClick={toggleCommentsVisibility}
         >
            {isCommentsVisible ? (
               <>
                  <ChevronRight />
                  <div className="hidden group-hover:inline-block bg-black text-white text-xs absolute p-2  rounded whitespace-no-wrap">
                     Comment
                  </div>
               </>
            ) : (
               <ChevronLeft />
            )}
         </div>

         {!isCommentsVisible && (
            <div className="absolute right-10 p-4 z-40  w-96 bg-[#2c2517] rounded-sm ">
               {/* // <div */}
               {/* //    className="absolute right-4 p-4 z-40 w-96 bg-[#493d2d] rounded-sm overflow-y-auto"
               style={{ pointerEvents: 'all' }} */}
               {/* > */}
               <span className="text-white">Comment</span>
               <div className="py-2">
                  <input
                     className=" px-4 py-2 rounded-md border border-[#DAA851] bg-[#342b1c] text-white focus:outline-none focus:ring-2 focus:ring-[#DAA851] focus:border-transparent"
                     type="text"
                     placeholder="Say Something"
                  />
               </div>
               <span className="text-white capitalize">previous comments</span>
               {/* <div className="flex justify-center py-2">
                  <div>
                     <Image
                        src="/images/logo.png"
                        alt="comment avatar"
                        width={150}
                        height={150}
                     />
                  </div>
                  <div className="bg-[#63533c] py-1 px-2 rounded-r-2xl rounded-bl-2xl ">
                     <span className="text-white test-small font-bold ">
                        0x43xxx...xxxxx
                     </span>
                     <p className="text-white test-small">
                        For verily I say unto you, That whosoever shall say unto
                        this mountain.
                     </p>
                  </div>
               </div>
               <div className="flex justify-center py-2">
                  <div>
                     <Image
                        src="/images/logo.png"
                        alt="comment avatar"
                        width={150}
                        height={150}
                     />
                  </div>
                  <div className="bg-[#63533c] py-1 px-2 rounded-r-2xl rounded-bl-2xl ">
                     <span className="text-white test-small font-bold ">
                        0x43xxx...xxxxx
                     </span>
                     <p className="text-white test-small">
                        For verily I say unto you, That whosoever shall say unto
                        this mountain.
                     </p>
                  </div>
               </div>
               <div className="flex justify-center py-2">
                  <div>
                     <Image
                        src="/images/logo.png"
                        alt="comment avatar"
                        width={150}
                        height={150}
                     />
                  </div>
                  <div className="bg-[#63533c] py-1 px-2 rounded-r-2xl rounded-bl-2xl ">
                     <span className="text-white test-small font-bold ">
                        0x43xxx...xxxxx
                     </span>
                     <p className="text-white test-small">
                        For verily I say unto you, That whosoever shall say unto
                        this mountain.
                     </p>
                  </div>
               </div> */}
               <div className="flex justify-center py-2">
                  <div>
                     <Image
                        src="/images/logo.png"
                        alt="comment avatar"
                        width={150}
                        height={150}
                     />
                  </div>
                  <div className="bg-[#63533c] py-1 px-2 rounded-r-2xl rounded-bl-2xl ">
                     <span className="text-white test-small font-bold ">
                        0x43xxx...xxxxx
                     </span>
                     <p className="text-white test-small">
                        For verily I say unto you, That whosoever shall say unto
                        this mountain.
                     </p>
                  </div>
               </div>
               <div className="flex justify-center">
                  <div>
                     <Image
                        src="/images/logo.png"
                        alt="comment avatar"
                        width={150}
                        height={150}
                     />
                  </div>
                  <div className="bg-[#63533c] py-1 px-2 rounded-r-2xl rounded-bl-2xl ">
                     <span className="text-white test-small font-bold ">
                        0x43xxx...xxxxx
                     </span>
                     <p className="text-white test-small">
                        For verily I say unto you, That whosoever shall say unto
                        this mountain.
                     </p>
                  </div>
               </div>
               <span className="text-purple-400 capitalize text-sm flex justify-end pt-2 ">
                  view more comments...
               </span>
            </div>
         )}
      </div>
   );
};

export default CommentsSection;
