import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
// import pdfjs from 'pdfjs-dist/build/pdf';
import { Document } from 'react-pdf';

import PDFViewer from './pdfViewer'; // Import the PDFViewer component
import { CloseIcon, ThumbsDown, ThumbsUp } from '../icons';
import { toggleDislike, toggleLike } from '@/reduxToolkit/slices/bookSlice';
import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';

export const BooksDownload = ({ pdfPurchasedProducts }) => {
   const { address } = useAccount();
   const dispatch = useDispatch();

   const likedBook = useSelector((state) => state.book.likedBook);
   const dislikedBook = useSelector((state) => state.book.dislikedBook);

   // const [pdfPurchasedProducts, setPurchasedBooks] = useState([]);
   const [selectedBook, setSelectedBook] = useState(null);

   const handleBookSelect = (book) => {
      const { type, dataFile } = book;
      const fiePath = `http://hokoshokos-001-site1.etempurl.com/${type}/${dataFile}`;
      // console.log(fiePath);
      setSelectedBook(fiePath);
   };

   const handleCloseBook = () => {
      setSelectedBook(null);
   };

   const handleToggleLike = (id) => {
      if (likedBook[id]) {
         dispatch(toggleDislike({ bookId: id, isDisliked: false }));
      } else {
         dispatch(toggleLike({ bookId: id, isLiked: true }));
      }
   };

   const handleToggleDislike = (id) => {
      if (dislikedBook[id]) {
         dispatch(toggleDislike({ bookId: id, isLiked: false }));
      } else {
         dispatch(toggleDislike({ bookId: id, isDisliked: true }));
      }
   };

   // console.log(selectedBook);

   return (
      <div className="py-4">
         <h4 className="text-2xl font-bold my-4 text-white">Purchased Books</h4>

         {/* <div className="flex flex-wrap justify-center items-center md:flex-row md:items-center sm:flex-col sm:items-start space-x-4 space-y-4"> */}
         <div className="flex flex-wrap gap-3 p-2 justify-center md:justify-start items-center">
            {pdfPurchasedProducts.map((book, index) => (
               <div
                  key={index}
                  className="  px-2 py-3  rounded-md  shadow-custom"
                  // className="  shadow-custom"
               >
                  <Image
                     src={`https://gateway.pinata.cloud/ipfs/${book.image}`}
                     alt={book.title}
                     className="m-auto object-cover rounded-md"
                     width={150}
                     height={150}
                  />
                  <h3 className="text-md font-semibold mt-2 text-gray-400 italic">
                     {book.title}
                  </h3>
                  <div className="flex justify-between items-center space-x-1">
                     <button
                        onClick={() => handleBookSelect(book)}
                        className="bg-yellow-700 text-white py-1 px-3 mt-2 rounded-md"
                     >
                        Read Book
                     </button>
                     <div className="flex space-x-4 ">
                        <button
                           onClick={() => handleToggleLike(index)} // Pass the book ID here
                           className={`${
                              likedBook[index] ? 'text-likeColor' : 'text-white'
                           }`}
                        >
                           <ThumbsUp />
                        </button>
                        <button
                           onClick={() => handleToggleDislike(index)} // Pass the book ID here
                           className={`${
                              dislikedBook[index]
                                 ? 'text-likeColor'
                                 : 'text-white'
                           }`}
                        >
                           <ThumbsDown />
                        </button>
                     </div>
                  </div>
               </div>
            ))}
         </div>
         {selectedBook && (
            <div className="fixed top-0 left-auto right-auto w-[80%] h-full mt-14 bg-black bg-opacity-80 ">
               <div className="bg-white p-4 rounded-lg shadow-md">
                  <button
                     onClick={handleCloseBook}
                     className="absolute top-7 right-4 text-black py-1 px-2 rounded-full"
                  >
                     <CloseIcon />
                  </button>
                  <h3 className="text-xl font-semibold">
                     {selectedBook.title}
                  </h3>
                  {/* display title, justify the pdf content on all devices */}

                  <PDFViewer src={selectedBook} />
                  {/* <PDFViewer
                     src={`http://hokoshokos-001-site1.etempurl.com/${type}/${dataFile}`}
                  /> */}
               </div>
            </div>
         )}
      </div>
   );
};
