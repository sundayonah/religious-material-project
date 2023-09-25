'use client';

import React, { useState, useEffect, useContext, useRef } from 'react';
import Style from '@/style/Books.module.css';
import { useRouter } from 'next/router';
import '../app/globals.css';

import products from './products/[id]';
import Link from 'next/link';
import Header from '@/Components/header/header';
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

   // const booksURL = 'https://apis.kayibank.com:8002/api/Lookup/GetCountryCodes';

   // const booksURL =
   //    'http://kingdomcoin-001-site1.ctempurl.com/api/Book/GetAllBooks';

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

   console.log();

   const displayProducts = () => {
      if (filteredProducts.length < 1) {
         // return <h6>Sorry, no products matched your search</h6>;
      }

      // useEffect(() => {
      //    const handleScroll = () => {
      //       const header = document.querySelector('.header'); // Replace with your actual header class or ID
      //       const sidebar = sidebarRef.current;

      //       if (header && sidebar) {
      //          const headerRect = header.getBoundingClientRect();
      //          const sidebarRect = sidebar.getBoundingClientRect();

      //          // Calculate the point where the sidebar should become fixed
      //          const scrollY = window.scrollY;
      //          const threshold = headerRect.bottom;

      //          // Determine if the sidebar should be fixed or unfixed
      //          if (scrollY >= threshold) {
      //             sidebar.style.position = 'fixed';
      //             // sidebar.style.top = '0';
      //          } else {
      //             sidebar.style.position = 'relative';
      //             sidebar.style.top = '';
      //          }
      //       }
      //    };

      //    window.addEventListener('scroll', handleScroll);
      //    return () => {
      //       window.removeEventListener('scroll', handleScroll);
      //    };
      // }, []);

      return filteredProducts.map(({ id, title, image, price }) => (
         <div className={Style.product} key={id}>
            <Link href={`/single?id=${id}`} passHref>
               <img src={image} className={Style.img} alt="images" />
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
         <Header />
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
               <button onClick={() => connect()}>Connect Wallet</button>
            </div>
            <div className={Style.rightMain}>
               <div className={Style.productsContainer}>
                  {displayProducts()}
               </div>
               <div>
                  <ul>
                     {kingdomBook.map((book, index) => (
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
                     ))}
                  </ul>
               </div>
            </div>
         </div>
      </>
   );
};

export default Books;
