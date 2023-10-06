import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { create } from 'ipfs-http-client';

const BooksList = () => {
   const [books, setBooks] = useState([]);
   const [file, setFile] = useState(null);

   // Function to upload an image to IPFS via Pinata and retrieve the IPFS hash
   const uploadImageToIPFS = async (imageUrl) => {
      try {
         // Create an IPFS client
         const ipfs = create({
            host: 'ipfs-api.pinata.cloud',
            port: 443,
            protocol: 'https',
            headers: {
               authorization: `Bearer YOUR_API_KEY:YOUR_API_SECRET`, // Replace with your API Key and API Secret
            },
         });

         // Fetch the image and convert it to an ArrayBuffer
         const imageBuffer = await fetch(imageUrl).then((res) =>
            res.arrayBuffer()
         );

         // Convert the ArrayBuffer to an array of bytes
         const imageBufferArray = Array.from(new Uint8Array(imageBuffer));

         // Upload the image to IPFS via Pinata
         const ipfsFile = await ipfs.add(imageBufferArray);
         const ipfsHash = ipfsFile.path; // Get the IPFS hash from the 'path' property

         return ipfsHash;
      } catch (error) {
         console.error('Error uploading image to IPFS via Pinata:', error);
         return null; // Return null in case of an error
      }
   };

   useEffect(() => {
      const fetchBooks = async () => {
         try {
            // Fetch books data from the API
            const response = await axios.get(
               'http://kingdomcoin-001-site1.ctempurl.com/api/Book/GetAllBooks'
            );

            if (response.status === 200) {
               const booksData = response.data.data;

               // Iterate over the books and upload images to IPFS via Pinata
               const booksWithIPFSImages = await Promise.all(
                  booksData.map(async (book) => {
                     try {
                        const imageUrl = book.imageUrl;
                        const ipfsHash = await uploadImageToIPFS(imageUrl);

                        if (ipfsHash) {
                           book.ipfsImageHash = ipfsHash;
                        }

                        return book;
                     } catch (error) {
                        console.error(
                           'Error uploading image to IPFS via Pinata:',
                           error
                        );
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
         <h1>IPFS</h1>
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
