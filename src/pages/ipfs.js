import React, { useState, useEffect } from 'react';
import axios from 'axios';
// const ipfsAPI = require('ipfs-http-client');

const BooksList = () => {
   const [books, setBooks] = useState([]);

   useEffect(() => {
      const fetchBooks = async () => {
         try {
            // Fetch books data from the API
            const response = await axios.get(
               'http://kingdomcoin-001-site1.ctempurl.com/api/Book/GetAllBooks'
            );

            if (response.status === 200) {
               const booksData = response.data.data;
               // Create an instance of the IPFS client
               const ipfs = ipfsAPI('localhost', '5001'); // IPFS API endpoint

               // Iterate over the books and upload images to IPFS
               const booksWithIPFSImages = await Promise.all(
                  booksData.map(async (book) => {
                     try {
                        // Assuming the API provides image URLs in the 'imageUrl' field
                        const imageUrl = book.imageUrl;
                        const imageBuffer = await fetch(imageUrl).then((res) =>
                           res.arrayBuffer()
                        );
                        const imageBufferArray = Array.from(
                           new Uint8Array(imageBuffer)
                        );
                        const ipfsFile = await ipfs.add({
                           path: 'book-image.jpg', // You can provide a suitable file name
                           content: imageBufferArray,
                        });
                        const ipfsHash = ipfsFile.cid.toString();
                        book.ipfsImageHash = ipfsHash;
                        return book;
                     } catch (error) {
                        console.error('Error uploading image to IPFS:', error);
                        return book;
                     }
                  })
               );

               setBooks(booksWithIPFSImages);
            } else {
               console.error(
                  `API request failed with status code ${response.status}`
               );
            }
         } catch (error) {
            console.error('Error fetching books:', error);
         }
      };

      fetchBooks();
   }, []);

   return (
      <div>
         <h1>Books List</h1>
         <h1>Books List</h1>
         <h1>Books List</h1>
         <h1>Books List</h1>
         <ul>
            {books.map((book) => (
               <li key={book.id}>
                  <h3>{book.title}</h3>
                  <img
                     src={`https://ipfs.io/ipfs/${book.ipfsImageHash}`}
                     alt={book.title}
                  />
               </li>
            ))}
         </ul>
      </div>
   );
};

export default BooksList;
