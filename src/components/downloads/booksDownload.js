import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
// import pdfjs from 'pdfjs-dist/build/pdf';
import { Document } from 'react-pdf';

import PDFViewer from './pdfViewer'; // Import the PDFViewer component
import { CloseIcon, ThumbsDown, ThumbsUp } from '../icons';
import { toggleDislike, toggleLike } from '@/reduxToolkit/slices/bookSlice';
import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';

export const BooksDownload = () => {
   const { address } = useAccount();
   const dispatch = useDispatch();

   const likedBook = useSelector((state) => state.book.likedBook);
   const dislikedBook = useSelector((state) => state.book.dislikedBook);

   const [purchasedBooks, setPurchasedBooks] = useState([]);
   const [selectedBook, setSelectedBook] = useState(null);

   // useEffect(() => {
   //    // Retrieve the list of purchased books from local storage
   //    const storedPurchasedBooks =
   //       JSON.parse(localStorage.getItem('purchasedBooks')) || [];
   //    //   console.log(storedPurchasedBooks);

   //    // Filter purchased books based on the current user's address
   //    const userPurchasedBooks = storedPurchasedBooks.filter(
   //       (book) => book.address === address
   //    );
   //    console.log(userPurchasedBooks);

   //    setPurchasedBooks(userPurchasedBooks);
   // }, [address]);

   useEffect(() => {
      // Retrieve the list of purchased products from local storage
      const storedPurchasedProducts =
         JSON.parse(localStorage.getItem('purchasedBooks')) || [];

      // Deserialize the stored products and filter them based on the current user's address
      const userPurchasedProducts = storedPurchasedProducts
         .map((serializedProduct) => JSON.parse(serializedProduct))
         .filter((item) => item.address === address);
      console.log(userPurchasedProducts);
      setPurchasedBooks(userPurchasedProducts);
   }, [address, dispatch]);

   const handleBookSelect = (book) => {
      setSelectedBook(book);
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

   return (
      <div className="py-4">
         <h4 className="text-2xl font-bold my-4 text-white">Purchased Books</h4>
         <div className="grid grid-cols-2 gap-4">
            {purchasedBooks.map((book, index) => (
               <div
                  key={index}
                  className=" mx-1  px-2 py-3  rounded-md  shadow-custom"
               >
                  <img
                     src={book.image}
                     alt={book.title}
                     className="w-full h-40 object-cover rounded-md"
                  />
                  <h3 className="text-lg font-semibold mt-2 text-gray-400 italic">
                     {book.title}
                  </h3>
                  <div className="flex justify-between items-center space-x-3">
                     <button
                        onClick={() => handleBookSelect(book)}
                        className="bg-yellow-700 text-white py-2 px-4 mt-2 rounded-md"
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
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex justify-center items-center">
               <div className="bg-white p-4 rounded-lg shadow-md">
                  <button
                     onClick={handleCloseBook}
                     className="absolute top-2 right-2 text-white py-1 px-2 rounded-full"
                  >
                     <CloseIcon />
                  </button>
                  <h3 className="text-xl font-semibold">
                     {selectedBook.title}
                  </h3>

                  <PDFViewer src={selectedBook.file} />
               </div>
            </div>
         )}
      </div>
   );
};
