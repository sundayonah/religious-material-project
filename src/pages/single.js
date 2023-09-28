// pages / products / [id].js;

import React from 'react';
import { useRouter } from 'next/router';
import Products from './api/[id]'; // Import your product data
import Style from '@/styles/single.module.css';

const Single = () => {
   const router = useRouter();
   const { id } = router.query; // Get the product ID from the query parameter

   // Find the product with the matching ID
   const product = Products.find((product) => product.id === id);

   // const categories = Products.map((category) => category.category);
   // console.log(categories);

   if (!product) {
      return (
         <div>
            <p>Loading...</p>
         </div>
      );
   }

   // Render the product details
   return (
      <div>
         <div className={Style.main}>
            {product ? (
               <>
                  <img
                     className={Style.img}
                     src={product.image}
                     width={400}
                     height={300}
                     alt="single image"
                  />

                  <div className={Style.imgContent}>
                     <h4>{product.title}</h4>
                     <h4>{product.category}</h4>
                     <p>{product.description}</p>

                     <div className={Style.priceBuy}>
                        <span>${product.price}</span>
                        <button>Buy Now</button>
                     </div>
                  </div>
               </>
            ) : (
               <p>Product not found</p>
            )}
         </div>
      </div>
   );
};

export default Single;

// 'use client';

// import Header from '@/Components/header';
// import { useRouter } from 'next/router';
// import { useEffect, useState } from 'react';
// import Style from '../style/single.module.css';
// const SingleBook = () => {
//    const router = useRouter();
//    const { id } = router.query;
//    const [product, setProduct] = useState(null);

//    // const url = 'https://course-api.com/javascript-store-single-product';

//    // import product directly from api
//    // and check if id == id coming from api
//    // show product else "An has Error has occur"

//    console.log(id);

//    useEffect(() => {
//       const fetchData = async () => {
//          try {
//             if (id) {
//                // const response = await fetch(`/api/products/${id}`);
//                const response = await fetch(`/products/${id}`);
//                console.log(response);
//                if (!response.ok) {
//                   throw new Error(`HTTP error! Status: ${response.status}`);
//                }
//                const data = await response.json();

//                console.log(data);
//                setProduct(data);
//             }
//          } catch (error) {
//             console.error(error);
//          }
//       };

//       fetchData();
//    }, [id]);

//    // if (!product) {
//    //    // Handle the loading state here
//    //    return (
//    //       <>
//    //          <div>Loading...</div>
//    //          <p>Wait while we fetch data</p>
//    //       </>
//    //    );
//    // }

//    // Render the product details once product is available
//    return (
//       <>
//          <Header />
//          <hr />
//          {/* <div className={Style.main}>
//             <div className={Style.img}>
//                <img
//                   src={product.image}
//                   width={400}
//                   height={300}
//                   alt="single image"
//                />
//             </div>
//             <div className={Style.imgContent}>
//                <h4>{product.title}</h4>
//                <p>{product.description}</p>

//                <div className={Style.priceBuy}>
//                   <span>${product.price}</span>
//                   <button>Buy Now</button>
//                </div>
//             </div>
//          </div> */}
//          <p>{id}</p>
//       </>
//    );
// };

// export default SingleBook;
