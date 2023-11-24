import React from 'react';
import Image from 'next/image';
import { CloseIcon } from '@/components/icons';

const Modal = ({ isOpen, closeModal, content }) => {
   if (!isOpen || !content) {
      return null;
   }

   return (
      <div className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-70 flex justify-center items-center  ">
         <div className="bg-white p-4 rounded-md max-w-md md:w-full w-[85%]  shadow-generate">
            <div className="flex justify-end">
               <button
                  onClick={closeModal}
                  className="text-gray-600 hover:text-gray-800"
               >
                  <CloseIcon />
               </button>
            </div>
            <div className="flex flex-col items-center justify-center">
               <div className="relative">
                  <Image
                     src={`https://gateway.pinata.cloud/ipfs/${content.image}`}
                     alt={content.title}
                     width={400}
                     height={300}
                     className="rounded-md mb-4"
                  />
                  <span className="absolute right-0 bottom-4 font-bold bg-black bg-opacity-70 rounded-md p-1 text-yellow-600">
                     $TKC {(content.contentPrice / 1e15).toLocaleString()}
                  </span>
               </div>
               <h2 className="text-xl font-bold">{content.title}</h2>
               <p className="text-gray-800">{content.author}</p>
               <p className="text-gray-600 text-sm">{content.description}</p>
               <div className="w-full flex justify-center items-center mt-3 space-x-4">
                  {/* <span className="border border-yellow-700 font-bold bg-transparent py-1 px-2 rounded-sm hover:bg-gray-300 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:ring-opacity-50 text-black">
                     $TKC {(content.contentPrice / 1e15).toLocaleString()}
                  </span> */}
                  <button className="w-full text-white bg-yellow-700 py-1 px-2 rounded-sm hover:bg-yellow-800 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:ring-opacity-50">
                     Approve
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Modal;
