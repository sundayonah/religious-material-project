import Image from 'next/image';
import React, { useState } from 'react';

const MessageModalContent = ({ filteredMessages }) => {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [modalContent, setModalContent] = useState(filteredMessages);

   const openModal = (product) => {
      console.log(product);
      setModalContent(product);
      setIsModalOpen(true);
   };

   const closeModal = () => {
      setModalContent(null);
      setIsModalOpen(false);
   };
   //    console.log(filteredMessages);

   return (
      <>
         {isModalOpen && (
            <div className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
               <div className="bg-white p-8 rounded-md max-w-md w-full">
                  {filteredMessages && (
                     <>
                        <div className="flex justify-end">
                           <button
                              onClick={closeModal}
                              className="text-gray-800 hover:text-gray-800"
                           >
                              Close
                           </button>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                           <Image
                              src={`https://gateway.pinata.cloud/ipfs/${modalContent.image}`}
                              alt={modalContent.title}
                              width={400}
                              height={300}
                              className="rounded-md mb-4"
                           />
                           <h2 className="text-xl font-bold">
                              {modalContent.title}
                           </h2>
                           <p className="text-gray-600">
                              {modalContent.author}
                           </p>
                           <p className="text-gray-600">
                              {modalContent.description}
                           </p>
                           <p className="text-gray-600">
                              $TKC {modalContent.contentPrice / 1e15}
                           </p>
                        </div>
                     </>
                  )}
               </div>
            </div>
         )}
      </>
   );
};

export default MessageModalContent;
