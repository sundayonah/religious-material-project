'use client';

import React, { useState, useEffect } from 'react';
import Style from '@/style/Books.module.css';
import { useRouter } from 'next/router';
import '../app/globals.css';

import products from './products/[id]';
import Link from 'next/link';
import Header from '@/Components/header';

const Books = () => {
   const [filteredProducts, setFilteredProducts] = useState([...products]);
   const [searchInput, setSearchInput] = useState('');
   const [selectedCompany, setSelectedCompany] = useState('all');
   const [selectedProductId, setSelectedProductId] = useState(null);

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

      setFilteredProducts(filtered);
   }, [searchInput, selectedCompany, products]);

   const displayProducts = () => {
      if (filteredProducts.length < 1) {
         // return <h6>Sorry, no products matched your search</h6>;
      }

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
            <div className={Style.sidebar}>
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
            </div>
         </div>
      </>
   );
};

export default Books;
