'use client';

import React, { useState, useEffect, useContext, useRef } from 'react';
import Style from '@/styles/Books.module.css';
import { useRouter } from 'next/router';

// import products from './products/[id]';
import products from '@/pages/api/[id]';
import Link from 'next/link';
import axios from 'axios';

// import { StateContext } from '@/Context/ReligiousContext';

const Books = () => {
   // const [filteredProducts, setFilteredProducts] = useState([...products]);
   const [filteredProducts, setFilteredProducts] = useState([...products]);
   const [searchInput, setSearchInput] = useState('');
   const [selectedCompany, setSelectedCompany] = useState('all');
   const [selectedProductId, setSelectedProductId] = useState(null);
   const [kingdomBook, setKingdomBook] = useState([]);
   const sidebarRef = useRef(null);

   // const { address, disconnect, connect } = useContext(StateContext);

   // console.log(address);
   // const fetchBooks = async () => {
   //    try {
   //       const res = await axios.get(booksURL);

   //       const data = await res.data.data;
   //       console.log(data);
   //       setKingdomBook(data);
   //       return data;
   //    } catch (error) {
   //       console.log('Failed to fetch', error);
   //    }
   // };

   //    To make calls to other endpoints fetch the token value from the data you stored on local storage and pass it in the authorization header of your request

   // create another function called fetchBooks

   // const booksURL =
   //    'http://kingdomcoin-001-site1.ctempurl.com/api/Book/GetAllBooks';

   // // Function to fetch books using the stored token
   // const fetchBooks = async () => {
   //    try {
   //       // Get the stored token from local storage
   //       const storedData = JSON.parse(localStorage.getItem('responseData'));
   //       const token = storedData.token;
   //       console.log(token);

   //       if (token) {
   //          // Define the API endpoint for fetching books
   //          // const booksURL =
   //          //    'http://kingdomcoin-001-site1.ctempurl.com/api/Book/GetAllBooks';

   //          // Make a GET request to the books endpoint with the token in the Authorization header
   //          const res = await axios.get(booksURL, {
   //             headers: {
   //                Authorization: `Bearer ${token}`,
   //             },
   //          });
   //          console.log(res);

   //          if (res.data.statusCode === 200) {
   //             const booksData = res.data; // Access the res data
   //             console.log(booksData);
   //          } else {
   //             console.error(
   //                `API request failed with status code ${res.status}`
   //             );
   //             if (res.status === 401) {
   //                console.error(
   //                   'Unauthorized: Check your authorization token.'
   //                );
   //             }
   //          }
   //       } else {
   //          console.error('Token not found in local storage');
   //       }
   //    } catch (error) {
   //       console.error('Error fetching books:', error);
   //    }
   // };

   // // Now you can call fetchBooks whenever you need to fetch books

   // fetchBooks();

   useEffect(() => {
      // Filter products based on searchInput and selectedCompany
      let filtered = [...products];

      if (searchInput) {
         filtered = filtered.filter((product) =>
            product.title.toLowerCase().includes(searchInput.toLowerCase())
         );
      }

      if (selectedCompany !== 'all') {
         filtered = filtered.filter(
            (product) => product.category === selectedCompany
         );
      }
      // fetchBooks();
      setFilteredProducts(filtered);
   }, [searchInput, selectedCompany, products]);

   const displayProducts = () => {
      if (filteredProducts.length < 1) {
         // return <h6>Sorry, no products matched your search</h6>;
      }

      return filteredProducts.map(({ id, title, image, price }) => (
         <div className={Style.product} key={id}>
            <Link href={`/single?id=${id}`} passHref>
               <img
                  src={image}
                  className="h-28 w-full object-cover"
                  width={400}
                  height={150}
                  alt="images"
               />
            </Link>

            <div className={Style.productIcons}></div>
            <div className={Style.namePrice}>
               <h5 className={Style.productName}>{title}</h5>
               <h4 className={Style.productPrice}>${price}</h4>
            </div>
         </div>
      ));
   };

   const displayButtons = () => {
      const buttons = [
         'all',
         ...new Set(products.map((product) => product.category)),
      ];

      return buttons.map((button) => (
         <button
            className={Style.companyBtn}
            key={button}
            onClick={() => setSelectedCompany(button)}
         >
            {button}
         </button>
      ));
   };

   return (
      <>
         <div className={Style.main}>
            <div className={Style.sidebar} ref={sidebarRef}>
               <form>
                  <input
                     type="text"
                     className={Style.searchInput}
                     placeholder="Search..."
                     value={searchInput}
                     onChange={(e) => setSearchInput(e.target.value)}
                  />
               </form>
               <span className={Style.book}>Books</span>
               <div className={Style.companies}>{displayButtons()}</div>
            </div>
            <div className={Style.rightMain}>
               <div className={Style.productsContainer}>
                  {displayProducts()}
               </div>
               <div>
                  <ul>
                     {/* {kingdomBook.map((book, index) => (
                        <li key={index}>
                           <h2>{book.name}</h2>
                           <img
                              src={book.cover}
                              alt="image"
                              width={100}
                              height={100}
                           />
                           <p>
                              <strong>Author:</strong> {book.author}
                           </p>
                           <p>
                              <strong>Category:</strong> {book.category}
                           </p>
                           <p>
                              <strong>Description:</strong> {book.description}
                           </p>
                           <p>
                              <strong>Price:</strong> ${book.price}
                           </p>
                        </li>
                     ))} */}
                  </ul>
               </div>
            </div>
         </div>
      </>
   );
};

export default Books;
