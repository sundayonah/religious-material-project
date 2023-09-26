'use client';

import React, { useEffect, useState } from 'react';
import Style from '@/style/home.module.css';
import '../app/globals.css';
import axios from 'axios';

const Home = () => {
   const [books, setBooks] = useState([]);

   const booksURL =
      'http://kingdomcoin-001-site1.ctempurl.com/api/Book/GetAllBooks';

   // Function to fetch books using the stored token
   const fetchBooks = async () => {
      try {
         // Get the stored token from local storage
         const storedData = JSON.parse(localStorage.getItem('responseData'));
         const token = storedData.token;
         // console.log(token);

         if (token) {
            // Make a GET request to the books endpoint with the token in the Authorization header
            const res = await axios.get(booksURL, {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            });
            // console.log(res.data.data);

            if (res.data.statusCode === 200) {
               const booksData = res.data; // Access the res data

               setBooks(booksData.data);
            } else {
               console.error(
                  `API request failed with status code ${res.status}`
               );
               if (res.status === 401) {
                  console.error(
                     'Unauthorized: Check your authorization token.'
                  );
               }
            }
         } else {
            console.error('Token not found in local storage');
         }
      } catch (error) {
         console.error('Error fetching books:', error);
      }
   };

   // Now you can call fetchBooks whenever you need to fetch books

   useEffect(() => {
      fetchBooks();
   }, []);
   /*
   
 data: [
      {
        recId: '1',
        cover: ' ... (length: 59455)',
        name: ' ... (length: 17)',
        author: ' ... (length: 13)',
        category: ' ... (length: 7)',
        description: ' ... (length: 37)',
        price: 1.5,
        bookFile: ' ... (length: 25)'
      },
    */

   return (
      <div className={Style.main}>
         {books.map((book) => {
            const { recId, author, category, description, price, cover } = book;

            return (
               <div key={recId}>
                  <img
                     src={cover}
                     alt={`Cover for ${recId}`}
                     width={150}
                     height={100}
                  />
                  <p>{recId}</p>
                  <p>{author}</p>
                  <p>{description}</p>
                  <p>{price}</p>
                  <p>{category}</p>
               </div>
            );
         })}
         <h1>Home Page</h1>
      </div>
   );
};

export default Home;
